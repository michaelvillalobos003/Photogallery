import React, { useEffect, useRef, useState } from 'react';

interface TitleParticle {
  // Rel coordinates relative to title center
  relX: number;
  relY: number;
  // Current absolute screen coordinates
  x: number;
  y: number;
  // Origin coordinates when formed in title
  originX: number;
  originY: number;
  // Velocities during background roam
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  floatOffset: number;
  // Scatter direction and velocity
  scatterVx: number;
  scatterVy: number;
  depth: number;
}

export function ParticleTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation phase state for user feedback & interactive toggle
  const [phase, setPhase] = useState<'formed' | 'scattering' | 'roaming' | 'regrouping'>('formed');
  const manualActionRef = useRef<{ mode: 'scatter' | 'regroup'; timestamp: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let particles: TitleParticle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    const text = 'Photo Gallery';
    const mouse = { x: -2000, y: -2000, active: false };

    // Generate high-definition 128x128 pre-rendered luminous Apple-style pearl sphere
    const spriteSize = 128;
    const pearlSprite = document.createElement('canvas');
    pearlSprite.width = spriteSize;
    pearlSprite.height = spriteSize;
    const sCtx = pearlSprite.getContext('2d');
    if (sCtx) {
      const center = spriteSize / 2;

      // 1. Soft atmospheric light halo
      const halo = sCtx.createRadialGradient(center, center, 0, center, center, center);
      halo.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      halo.addColorStop(0.2, 'rgba(240, 248, 255, 0.75)');
      halo.addColorStop(0.48, 'rgba(220, 240, 255, 0.32)');
      halo.addColorStop(0.72, 'rgba(195, 225, 255, 0.09)');
      halo.addColorStop(1, 'rgba(255, 255, 255, 0)');
      sCtx.fillStyle = halo;
      sCtx.beginPath();
      sCtx.arc(center, center, center, 0, Math.PI * 2);
      sCtx.fill();

      // 2. High-definition 3D pearl sphere with top-left specular gradient
      const sphereRadius = center * 0.46;
      const sphereGrad = sCtx.createRadialGradient(
        center - sphereRadius * 0.28,
        center - sphereRadius * 0.28,
        0,
        center,
        center,
        sphereRadius
      );
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.98)');
      sphereGrad.addColorStop(0.72, 'rgba(235, 245, 255, 0.94)');
      sphereGrad.addColorStop(1, 'rgba(200, 225, 255, 0.88)');
      sCtx.fillStyle = sphereGrad;
      sCtx.beginPath();
      sCtx.arc(center, center, sphereRadius, 0, Math.PI * 2);
      sCtx.fill();

      // 3. Crisp specular pinpoint highlight (Apple glass pearl reflection)
      sCtx.fillStyle = '#ffffff';
      sCtx.beginPath();
      sCtx.arc(center - sphereRadius * 0.32, center - sphereRadius * 0.32, sphereRadius * 0.24, 0, Math.PI * 2);
      sCtx.fill();
    }

    // Automatic cycle timing (in milliseconds)
    // 0 - 3800ms: Formed title in header
    // 3800 - 5200ms: Burst & liftoff towards the whole screen
    // 5200 - 11800ms: Roaming freely across the entire background behind cards
    // 11800 - 14400ms: Magnetic pull back to regroup into the header title
    const CYCLE_DURATION = 14400;
    const startTime = performance.now();

    const generateTextParticles = () => {
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const headerRect = container.getBoundingClientRect();
      const titleWidth = Math.min(headerRect.width || 600, 720);
      const titleHeight = Math.max(80, Math.min(120, titleWidth * 0.22));

      // Offscreen canvas for sampling text pixels
      const offCanvas = document.createElement('canvas');
      offCanvas.width = titleWidth;
      offCanvas.height = titleHeight;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      const fontSize = Math.max(28, Math.min(52, titleWidth * 0.088));
      offCtx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro", "Segoe UI", Roboto, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#ffffff';

      const sampleCenterX = titleWidth / 2;
      const sampleCenterY = titleHeight / 2;
      offCtx.fillText(text, sampleCenterX, sampleCenterY);

      const imgData = offCtx.getImageData(0, 0, titleWidth, titleHeight);
      const data = imgData.data;
      const newParticles: TitleParticle[] = [];

      // Balanced sampling step for crisp letters + smooth 60-120fps (approx 240-300 particles)
      const step = titleWidth < 480 ? 3.6 : 4.0;

      const currentHeaderCenter = {
        x: headerRect.left + headerRect.width / 2,
        y: headerRect.top + headerRect.height / 2
      };

      for (let y = 0; y < titleHeight; y += step) {
        for (let x = 0; x < titleWidth; x += step) {
          const sampleX = Math.floor(x);
          const sampleY = Math.floor(y);
          const index = (sampleY * titleWidth + sampleX) * 4;
          const alpha = data[index + 3];

          if (alpha > 110) {
            // Rel coords relative to title center
            const relX = sampleX - sampleCenterX + (Math.random() - 0.5) * 0.5;
            const relY = sampleY - sampleCenterY + (Math.random() - 0.5) * 0.5;

            const rad = Math.random() * 0.7 + 1.8;
            // Angle and speed for bursting out across the whole screen
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4.5 + 2.5;
            const roamAngle = Math.random() * Math.PI * 2;
            const roamSpeed = Math.random() * 0.9 + 0.4;
            const depth = Math.random() * 0.45 + 0.8;

            const initialX = currentHeaderCenter.x + relX;
            const initialY = currentHeaderCenter.y + relY;

            newParticles.push({
              relX,
              relY,
              x: initialX,
              y: initialY,
              originX: initialX,
              originY: initialY,
              vx: Math.cos(roamAngle) * roamSpeed,
              vy: Math.sin(roamAngle) * roamSpeed,
              scatterVx: Math.cos(angle) * speed,
              scatterVy: Math.sin(angle) * speed,
              radius: rad,
              baseRadius: rad,
              alpha: Math.random() * 0.2 + 0.8,
              floatOffset: Math.random() * Math.PI * 2,
              depth,
            });
          }
        }
      }

      particles = newParticles;
    };

    generateTextParticles();

    let resizeTimer: number;
    const handleResize = () => {
      cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(generateTextParticles);
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Track mouse across the entire window for interactive particle stir
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    let lastPhaseState = '';

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Current title header center in screen coordinates
      const headerRect = container.getBoundingClientRect();
      const titleCenterX = headerRect.left + headerRect.width / 2;
      const titleCenterY = headerRect.top + headerRect.height / 2;

      let currentPhase: 'formed' | 'scattering' | 'roaming' | 'regrouping' = 'formed';
      let progress = 0;

      // Check if user manually triggered an action
      if (manualActionRef.current) {
        const actionAge = now - manualActionRef.current.timestamp;
        if (manualActionRef.current.mode === 'scatter') {
          if (actionAge < 1400) {
            currentPhase = 'scattering';
            progress = actionAge / 1400;
          } else if (actionAge < 8500) {
            currentPhase = 'roaming';
            progress = (actionAge - 1400) / 7100;
          } else {
            // End manual override and return to auto
            manualActionRef.current = null;
          }
        } else if (manualActionRef.current.mode === 'regroup') {
          if (actionAge < 2600) {
            currentPhase = 'regrouping';
            progress = actionAge / 2600;
          } else {
            manualActionRef.current = null;
          }
        }
      }

      // Automatic cyclic timeline if no manual override is active
      if (!manualActionRef.current) {
        const elapsed = (now - startTime) % CYCLE_DURATION;
        if (elapsed < 3800) {
          currentPhase = 'formed';
          progress = elapsed / 3800;
        } else if (elapsed < 5200) {
          currentPhase = 'scattering';
          progress = (elapsed - 3800) / 1400;
        } else if (elapsed < 11800) {
          currentPhase = 'roaming';
          progress = (elapsed - 5200) / 6600;
        } else {
          currentPhase = 'regrouping';
          progress = (elapsed - 11800) / 2600;
        }
      }

      if (currentPhase !== lastPhaseState) {
        lastPhaseState = currentPhase;
        setPhase(currentPhase);
      }

      const t = now * 0.002;
      const pLen = particles.length;

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];
        // Target in title header
        p.originX = titleCenterX + p.relX;
        p.originY = titleCenterY + p.relY;

        let scale = p.depth;

        if (currentPhase === 'formed') {
          // Living starlight shimmer in title formation
          const microBreath = Math.sin(t * 1.8 + p.floatOffset) * 0.45;
          const targetX = p.originX;
          const targetY = p.originY + microBreath;

          p.x += (targetX - p.x) * 0.22;
          p.y += (targetY - p.y) * 0.22;
        } else if (currentPhase === 'scattering') {
          // Accelerate outward from the title across the whole screen background
          const ease = 1 - Math.pow(1 - progress, 2.5);
          p.x += p.scatterVx * (1.5 - ease * 0.6) + p.vx;
          p.y += p.scatterVy * (1.5 - ease * 0.6) + p.vy;

          scale = p.depth * (1 + ease * 0.35);
        } else if (currentPhase === 'roaming') {
          // Roam freely all around the background behind the cards
          p.x += p.vx + Math.sin(t * 1.2 + p.floatOffset) * 1.1;
          p.y += p.vy + Math.cos(t * 0.9 + p.floatOffset) * 1.1;

          // Wrap softly across screen edges so particles continuously populate the whole page
          if (p.x < -30) p.x = width + 30;
          else if (p.x > width + 30) p.x = -30;
          if (p.y < -30) p.y = height + 30;
          else if (p.y > height + 30) p.y = -30;

          scale = p.depth * 1.15;
        } else if (currentPhase === 'regrouping') {
          // Magnetic attraction back into the header letters
          const ease = Math.min(1, Math.max(0, progress));
          const pullForce = 0.07 + (ease * ease) * 0.26;

          p.x += (p.originX - p.x) * pullForce;
          p.y += (p.originY - p.y) * pullForce;

          scale = p.depth;
        }

        // Interactive cursor repulsion anywhere on the viewport
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const distSq = mdx * mdx + mdy * mdy;
          const mrad = 95;
          const mradSq = mrad * mrad;
          if (distSq < mradSq && distSq > 0) {
            const mdist = Math.sqrt(distSq);
            const force = (mrad - mdist) / mrad;
            p.x -= (mdx / mdist) * force * 16;
            p.y -= (mdy / mdist) * force * 16;
          }
        }

        // Hardware-blitted 128px pre-rendered white pearl sprite
        const drawSize = p.radius * 3.6 * scale;
        ctx.globalAlpha = Math.min(1, p.alpha * (scale * 0.95));
        ctx.drawImage(pearlSprite, p.x - drawSize / 2, p.y - drawSize / 2, drawSize, drawSize);
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const handleTitleClick = () => {
    // Toggle manual trigger: if formed, scatter to background; if wandering, regroup!
    if (phase === 'formed') {
      manualActionRef.current = { mode: 'scatter', timestamp: performance.now() };
    } else {
      manualActionRef.current = { mode: 'regroup', timestamp: performance.now() };
    }
  };

  return (
    <>
      {/* Full-screen fixed particle canvas (draws behind gallery content) */}
      <canvas
        ref={canvasRef}
        id="fullscreen-particle-canvas"
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Header Container that anchors the "Photo Gallery" letters */}
      <div
        ref={containerRef}
        id="particle-title-wrapper"
        onClick={handleTitleClick}
        className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center cursor-pointer select-none group min-h-[90px] sm:min-h-[110px]"
        title="Click to scatter the particles into the background or regroup them!"
      >
        <h1 className="sr-only">Photo Gallery</h1>

        {/* Dynamic visual indicator badge */}
        <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-all duration-300 text-[11px] sm:text-xs text-neutral-300 font-medium">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>
            {phase === 'formed' && 'Title Formed • Click to Scatter to Background'}
            {phase === 'scattering' && 'Dispersing to Background...'}
            {phase === 'roaming' && 'Roaming Background • Click to Regroup Title'}
            {phase === 'regrouping' && 'Regrouping into Title...'}
          </span>
        </div>
      </div>
    </>
  );
}
