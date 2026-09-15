import React, { useEffect, useRef } from 'react';

interface Photo {
  id: number;
  title: string;
  imageUrl: string;
  category: string;
}

const photos: Photo[] = [
  {
    id: 1,
    title: 'Spider-Man',
    category: 'Marvel',
    imageUrl: '/images/spiderman.jpg',
  },
  {
    id: 2,
    title: 'Gilmerto Mora',
    category: 'Gilmerto Mora',
    imageUrl: 'images/gilmertomora.jpg',
  },
  {
    id: 3,
    title: 'Woody',
    category: 'Toy Story',
    imageUrl: 'images/woody.jpg',
  },
  {
    id: 4,
    title: 'New York',
    category: 'Travel',
    imageUrl: 'images/new_york.jpg',
  },
  {
    id: 5,
    title: 'Washington',
    category: 'Travel',
    imageUrl: 'images/washington.jpg',
  },
  {
    id: 6,
    title: 'Mexico',
    category: 'Travel',
    imageUrl: 'images/mexico.jpg',
  },
  {
    id: 7,
    title: 'Tacos',
    category: 'Mexican Food',
    imageUrl: '/images/tacos.jpg',
  },
  {
    id: 8,
    title: 'Huevos con Chorizo',
    category: 'Mexican Food',
    imageUrl: 'images/huevos_con_chorizo.jpg',
  },
  {
    id: 9,
    title: 'Elote',
    category: 'Mexican Food',
    imageUrl: '/images/elote.jpg',
  },
];

export default function App(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const mouse = { x: -1000, y: -1000, radius: 140 };

    const palette = [
      'rgba(255, 49, 88, ',    // Vivid Electric Crimson/Pink
      'rgba(255, 110, 20, ',   // Radiant Neon Orange
      'rgba(255, 225, 0, ',    // Bright Cyber Yellow
      'rgba(16, 235, 120, ',   // Vivid Neon Green
      'rgba(0, 240, 255, ',    // Electric Cyan
      'rgba(60, 130, 255, ',   // Neon Electric Blue
      'rgba(175, 70, 255, ',   // Vivid Electric Violet
      'rgba(255, 30, 190, '    // Glowing Hot Magenta
    ];

    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      baseRadius: number;
      color: string;
      alpha: number;
      vx: number;
      vy: number;
      pulse: number;
      pulseSpeed: number;
    }> = [];

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.max(Math.floor((width * height) / 24000), 32), 65);
      for (let i = 0; i < count; i++) {
        const isLarge = Math.random() > 0.72;
        const baseRad = isLarge ? Math.random() * 8 + 10 : Math.random() * 5 + 5.5;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: baseRad,
          baseRadius: baseRad,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.25 + 0.6,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.035 + 0.02
        });
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    initParticles();

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.pulse) * 0.95;
        p.y += p.vy + Math.cos(p.pulse) * 0.95;
        p.pulse += p.pulseSpeed;

        if (p.x < -30) p.x = width + 30;
        else if (p.x > width + 30) p.x = -30;
        if (p.y < -30) p.y = height + 30;
        else if (p.y > height + 30) p.y = -30;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.x -= (dx / dist) * force * 5.5;
          p.y -= (dy / dist) * force * 5.5;
        }

        const currentRadius = Math.max(2, p.baseRadius + Math.sin(p.pulse) * 1.8);
        const currentAlpha = Math.max(0.35, Math.min(0.95, p.alpha + Math.sin(p.pulse) * 0.18));

        // Radiant neon glow effect on black
        ctx.shadowColor = p.color + '0.9)';
        ctx.shadowBlur = 14;

        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentAlpha + ')';
        ctx.fill();

        // Bright rim
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = p.color + '0.95)';
        ctx.stroke();

        // Luminous specular highlight
        ctx.beginPath();
        ctx.arc(p.x - currentRadius * 0.26, p.y - currentRadius * 0.26, Math.max(1, currentRadius * 0.32), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, ' + (currentAlpha * 0.7) + ')';
        ctx.fill();

        ctx.shadowBlur = 0;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 145) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist2 / 145) * 0.32;
            ctx.strokeStyle = p.color + lineAlpha + ')';
            ctx.lineWidth = 1.1;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div id="gallery-app" className="relative min-h-screen bg-[#09090b] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Interactive Floating Particle Canvas on Black Background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-1" aria-hidden="true" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <header id="gallery-header" className="text-center mb-10">
          <h1 id="gallery-main-title" className="text-3xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
            Photo Gallery
          </h1>
          <p id="gallery-subtitle" className="mt-2 text-base sm:text-lg text-neutral-400 font-medium">
            Michael's Photos
          </p>
        </header>

        <main id="photo-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <article
              key={photo.id}
              id={`photo-card-${photo.id}`}
              className="bg-[#141418] rounded-xl border border-white/10 shadow-lg hover:shadow-2xl hover:border-white/25 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col group"
            >
              <div className="aspect-square w-full overflow-hidden bg-neutral-900">
                <img
                  id={`photo-img-${photo.id}`}
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.retry) {
                      target.dataset.retry = '1';
                      target.src = target.src.startsWith('/') ? target.src.slice(1) : '/' + target.src;
                    }
                  }}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-center bg-[#141418]">
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                  {photo.category}
                </span>
                <h2 id={`photo-title-${photo.id}`} className="text-base font-semibold text-neutral-100 line-clamp-1">
                  {photo.title}
                </h2>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  );
}
