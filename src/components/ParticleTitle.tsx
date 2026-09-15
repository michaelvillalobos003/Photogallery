import React, { useEffect, useRef } from 'react';

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  orbitAngle: number;
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitSpeed: number;
  floatOffset: number;
  burstOffsetX: number;
  burstOffsetY: number;
}

export function ParticleTitle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clickBurstRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    const text = 'Photo Gallery';
    const mouse = { x: -2000, y: -2000, active: false };

    // Cycle timing (in milliseconds)
    // 0 - 3200ms: Formed text (with gentle organic micro-shimmer)
    // 3200 - 3900ms: Dissolve & explode into white balls
    // 3900 - 5400ms: Swirling, floating cloud of white balls
    // 5400 - 6800ms: Magnetic pull & reform back into text
    // 6800 - 7000ms: Settle snap
    const CYCLE_DURATION = 7000;
    const startTime = performance.now();

    const generateTextParticles = () => {
      if (!canvas || !container) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width || 600;
      // Fixed comfortable height for title canvas
      height = Math.max(90, Math.min(130, width * 0.22));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      // Create offscreen canvas to sample text pixels
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d');
      if (!offCtx) return;

      // Determine responsive font size
      const fontSize = Math.max(26, Math.min(52, width * 0.088));
      offCtx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#ffffff';

      const centerX = width / 2;
      const centerY = height / 2;
      offCtx.fillText(text, centerX, centerY);

      // Sample pixels
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const newParticles: Particle[] = [];

      // Grid sampling step (adapt based on width for ~450 - 650 particles)
      const step = width < 420 ? 3 : width < 680 ? 4 : 4;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            const rad = Math.random() * 0.9 + 1.4; // Little white ball size
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * (width * 0.45) + 30;

            newParticles.push({
              originX: x,
              originY: y,
              x: x,
              y: y,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              radius: rad,
              baseRadius: rad,
              alpha: Math.random() * 0.2 + 0.8,
              orbitAngle: angle,
              orbitRadiusX: Math.random() * (width * 0.38) + 25,
              orbitRadiusY: Math.random() * (height * 0.7) + 20,
              orbitSpeed: (Math.random() - 0.5) * 0.035 + (Math.random() > 0.5 ? 0.015 : -0.015),
              floatOffset: Math.random() * Math.PI * 2,
              burstOffsetX: Math.cos(angle) * dist,
              burstOffsetY: Math.sin(angle) * dist * 0.6,
            });
          }
        }
      }

      particles = newParticles;
    };

    generateTextParticles();

    const resizeObserver = new ResizeObserver(() => {
      generateTextParticles();
    });
    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.x = -2000;
      mouse.y = -2000;
    };

    const handleClick = () => {
      // Force immediate dispersion burst on click/tap
      clickBurstRef.current = performance.now();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);
    canvas.addEventListener('click', handleClick);

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // Determine cycle progress
      const elapsed = (now - startTime) % CYCLE_DURATION;
      const clickAge = now - clickBurstRef.current;
      const isManualBurst = clickAge < 2500;

      let mode: 'formed' | 'dissolving' | 'swirling' | 'reforming';
      let progress = 0;

      if (isManualBurst) {
        if (clickAge < 600) {
          mode = 'dissolving';
          progress = clickAge / 600;
        } else if (clickAge < 1600) {
          mode = 'swirling';
          progress = (clickAge - 600) / 1000;
        } else {
          mode = 'reforming';
          progress = (clickAge - 1600) / 900;
        }
      } else {
        if (elapsed < 3200) {
          mode = 'formed';
          progress = elapsed / 3200;
        } else if (elapsed < 3900) {
          mode = 'dissolving';
          progress = (elapsed - 3200) / 700;
        } else if (elapsed < 5400) {
          mode = 'swirling';
          progress = (elapsed - 3900) / 1500;
        } else {
          mode = 'reforming';
          progress = (elapsed - 5400) / 1600;
        }
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const t = now * 0.002;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let targetX = p.originX;
        let targetY = p.originY;
        let targetRadius = p.baseRadius;

        if (mode === 'formed') {
          // Subtle organic breathing of the letters
          const microBreath = Math.sin(t * 1.5 + p.floatOffset) * 0.35;
          targetX = p.originX;
          targetY = p.originY + microBreath;
          targetRadius = p.baseRadius;

          // Tight spring return to text
          p.x += (targetX - p.x) * 0.22;
          p.y += (targetY - p.y) * 0.22;
        } else if (mode === 'dissolving') {
          // Eased explosive burst into little white balls
          const easeOutQuad = 1 - (1 - progress) * (1 - progress);
          const scatterX = p.originX + p.burstOffsetX * easeOutQuad;
          const scatterY = p.originY + p.burstOffsetY * easeOutQuad;

          // Add rotational swirl
          const rotAngle = progress * 1.5;
          const cos = Math.cos(rotAngle);
          const sin = Math.sin(rotAngle);
          const dx = scatterX - centerX;
          const dy = scatterY - centerY;

          targetX = centerX + (dx * cos - dy * sin * 0.5);
          targetY = centerY + (dx * sin * 0.5 + dy * cos);
          targetRadius = p.baseRadius * (1 + easeOutQuad * 0.5);

          p.x += (targetX - p.x) * 0.16;
          p.y += (targetY - p.y) * 0.16;
        } else if (mode === 'swirling') {
          // Dynamic swirling Apple-style vortex of white balls
          p.orbitAngle += p.orbitSpeed;
          const orbitWave = Math.sin(t * 2 + p.floatOffset) * 12;

          targetX = centerX + Math.cos(p.orbitAngle) * p.orbitRadiusX + Math.sin(t + p.floatOffset) * 8;
          targetY = centerY + Math.sin(p.orbitAngle) * p.orbitRadiusY + orbitWave;
          targetRadius = p.baseRadius * (1.2 + Math.sin(p.orbitAngle) * 0.3);

          p.x += (targetX - p.x) * 0.08;
          p.y += (targetY - p.y) * 0.08;
        } else if (mode === 'reforming') {
          // Magnetic pull back into the exact text form
          // Cubic elastic ease
          const ease = Math.min(1, Math.max(0, progress));
          const pullForce = 0.12 + ease * 0.22;

          targetX = p.originX;
          targetY = p.originY;
          targetRadius = p.baseRadius;

          p.x += (targetX - p.x) * pullForce;
          p.y += (targetY - p.y) * pullForce;
        }

        // Interactive mouse push/stir
        if (mouse.active) {
          const mdx = mouse.x - p.x;
          const mdy = mouse.y - p.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          const mradius = 85;
          if (mdist < mradius && mdist > 0) {
            const force = (mradius - mdist) / mradius;
            p.x -= (mdx / mdist) * force * 18;
            p.y -= (mdy / mdist) * force * 18;
          }
        }

        // Draw little white ball with Apple-like luminous glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1.0, targetRadius), 0, Math.PI * 2);

        ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

        // Inner bright specular core
        ctx.beginPath();
        ctx.arc(p.x - targetRadius * 0.25, p.y - targetRadius * 0.25, Math.max(0.6, targetRadius * 0.35), 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="particle-title-wrapper"
      className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center cursor-pointer select-none group"
      title="Click or hover to scatter the Photo Gallery particles!"
    >
      {/* Screen-reader / Accessible Title */}
      <h1 className="sr-only">Photo Gallery</h1>

      {/* Apple-style Interactive Particle Canvas */}
      <canvas
        ref={canvasRef}
        id="particle-title-canvas"
        className="block touch-none"
        aria-hidden="true"
      />

      {/* Subtle interaction hint on hover */}
      <span className="opacity-0 group-hover:opacity-60 transition-opacity duration-300 text-[11px] uppercase tracking-widest text-neutral-400 -mt-1 pointer-events-none">
        Click or hover to scatter
      </span>
    </div>
  );
}
