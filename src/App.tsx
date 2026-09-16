import React, { useEffect, useState } from 'react';
import { ParticleTitle } from './components/ParticleTitle';
import ShaderDemo_ATC from '@/components/ui/atc-shader';
import { VerticalCutReveal } from '@/components/ui/vertical-cut-reveal';

interface Photo {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
  highlights: string;
}

const photos: Photo[] = [
  {
    id: 1,
    title: 'Spider-Man',
    category: 'Marvel Universe',
    imageUrl: '/images/spiderman.jpg',
    description:
      'Peter Parker leaps between Manhattan’s soaring skyscrapers in his iconic red and blue suit. Armed with superhuman spider-agility, wall-crawling instincts, and homemade web-shooters, he balances the complex pressures of ordinary youth with his sacred oath that with great power comes great responsibility.',
    highlights: 'Hero • Web-Slinger • Queens, NYC',
  },
  {
    id: 2,
    title: 'Gilberto Mora',
    category: 'Soccer Phenom',
    imageUrl: '/images/gilmertomora.jpg',
    description:
      'Widely celebrated as one of the most exciting young talents in modern soccer, Gilberto Mora electrifies stadiums with blinding footwork, deceptive pace, and clinical playmaking intelligence. A rising international midfielder with world-class potential.',
    highlights: 'Midfielder • Club Tijuana / Mexico • Prodigy',
  },
  {
    id: 3,
    title: 'Sheriff Woody',
    category: 'Disney / Pixar',
    imageUrl: '/images/woody.jpg',
    description:
      'The courageous, kind-hearted vintage pull-string cowboy sheriff from Pixar’s Toy Story. As the natural leader of Andy’s room, Woody’s steadfast loyalty to Buzz Lightyear and his fellow toys demonstrates that true friendship endures across every frontier.',
    highlights: 'Classic Animation • Andy’s Room • Cowboy Sheriff',
  },
  {
    id: 4,
    title: 'New York City',
    category: 'Travel & Urban',
    imageUrl: '/images/new_york.jpg',
    description:
      'The iconic Empire City stands as a global crossroads of commerce, art, and urban culture. From the neon towers of Midtown Manhattan and yellow taxicabs to the peaceful winding paths of Central Park, New York radiates an unforgettable, unstoppable pulse.',
    highlights: 'Manhattan • Empire State • Urban Metropolis',
  },
  {
    id: 5,
    title: 'Washington, D.C.',
    category: 'Travel & History',
    imageUrl: '/images/washington.jpg',
    description:
      'The stately capital of the United States, defined by magnificent neoclassical marble monuments, world-class Smithsonian galleries, and the reflective waters of the National Mall. A historic center of governance and sweeping national heritage.',
    highlights: 'National Mall • Capitol Hill • Cherry Blossoms',
  },
  {
    id: 6,
    title: 'Mexico',
    category: 'Travel & Culture',
    imageUrl: '/images/mexico.jpg',
    description:
      'A land of extraordinary contrasts where thousands of years of ancient Mayan and Aztec civilizations meet vibrant colonial plazas, sun-kissed coastal waters, festive mariachi music, and world-renowned culinary warmth.',
    highlights: 'Latin America • Ancient Pyramids • Coastal Beauty',
  },
  {
    id: 7,
    title: 'Street Tacos',
    category: 'Mexican Gastronomy',
    imageUrl: '/images/tacos.jpg',
    description:
      'The quintessential cornerstone of Mexican street food: freshly pressed, hot corn tortillas loaded with tender, seasoned grilled meat, crisp finely diced white onions, fragrant cilantro, and a bright squeeze of tart lime alongside spicy homemade salsa.',
    highlights: 'Street Food • Taquería Classic • Fresh Salsas',
  },
  {
    id: 8,
    title: 'Huevos con Chorizo',
    category: 'Mexican Gastronomy',
    imageUrl: '/images/huevos_con_chorizo.jpg',
    description:
      'A hearty and beloved traditional breakfast enjoyed across Mexico. Farm-fresh eggs are scrambled directly with deeply spiced pork chorizo infused with chiles, cumin, and garlic, served sizzling hot with warm refried beans and corn tortillas.',
    highlights: 'Traditional Breakfast • Spiced Chorizo • Comfort Food',
  },
  {
    id: 9,
    title: 'Elote Callejero',
    category: 'Mexican Gastronomy',
    imageUrl: '/images/elote.jpg',
    description:
      'Sweet Mexican street corn grilled on an open flame until lightly charred, slathered with silky Mexican crema or mayonnaise, heavily dusted with salty crumbled cotija cheese, and sprinkled with tangy chile-lime seasoning.',
    highlights: 'Antojito • Grilled Sweetcorn • Cotija & Chile',
  },
];

export default function App(): React.JSX.Element {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [shaderEnabled, setShaderEnabled] = useState<boolean>(true);
  const [shaderIntensity, setShaderIntensity] = useState<'subtle' | 'vivid'>('subtle');

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;

      if (e.key === 'Escape') {
        setSelectedPhotoIndex(null);
      } else if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : null));
      } else if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  const activePhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null;

  return (
    <div
      id="gallery-app"
      className="relative min-h-screen bg-[#09090b] text-neutral-100 py-10 px-4 sm:px-6 lg:px-8 select-none"
    >
      {/* 3D WebGL2 Volumetric Raymarching Shader Background */}
      {shaderEnabled && (
        <div
          id="shader-background-container"
          className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700"
          style={{ opacity: shaderIntensity === 'subtle' ? 0.65 : 0.95 }}
        >
          <ShaderDemo_ATC
            className="w-full h-full"
            resolutionScale={0.45}
            speed={0.85}
          />
          {/* Vignette Overlay for maximum photo readability and eye comfort */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-black/85 backdrop-blur-[0.5px]" />
        </div>
      )}

      {/* Full-Screen White Particle System: Formed Title + Roaming Background */}
      <ParticleTitle />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header section with subtitle and background controls */}
        <header id="gallery-header" className="text-center mb-10 sm:mb-12 flex flex-col items-center">
          <p
            id="gallery-subtitle"
            className="mt-3 text-xs sm:text-sm text-neutral-400 font-semibold tracking-widest uppercase"
          >
            Michael's Collection • Curated Gallery
          </p>

          {/* Background Shader Toggle & Controls */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setShaderEnabled(!shaderEnabled)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                shaderEnabled
                  ? 'bg-white/15 text-white border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                  : 'bg-black/40 text-neutral-400 border-white/10 hover:text-white'
              }`}
              title="Toggle the 3D WebGL Raymarching Shader Background"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  shaderEnabled ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-600'
                }`}
              />
              Shader Background: {shaderEnabled ? 'Active' : 'Off'}
            </button>

            {shaderEnabled && (
              <button
                onClick={() =>
                  setShaderIntensity(shaderIntensity === 'subtle' ? 'vivid' : 'subtle')
                }
                className="px-2.5 py-1 rounded-full text-xs text-neutral-300 hover:text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/10 transition-colors cursor-pointer"
                title="Toggle between subtle atmospheric shader and vivid contrast"
              >
                Intensity: {shaderIntensity === 'subtle' ? 'Subtle' : 'Vivid'}
              </button>
            )}
          </div>
        </header>

        {/* 3x3 Photo Grid */}
        <main
          id="photo-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7"
        >
          {photos.map((photo, index) => (
            <article
              key={photo.id}
              id={`photo-card-${photo.id}`}
              onClick={() => setSelectedPhotoIndex(index)}
              className="bg-[#131317]/85 backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.6)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_24px_rgba(255,255,255,0.08)] hover:border-white/30 hover:-translate-y-1.5 transition-all duration-300 ease-out overflow-hidden flex flex-col group cursor-pointer"
            >
              {/* Photo Image with Hover Zoom */}
              <div className="aspect-square w-full overflow-hidden bg-neutral-900 relative">
                <img
                  id={`photo-img-${photo.id}`}
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.retry) {
                      target.dataset.retry = '1';
                      target.src = target.src.startsWith('/') ? target.src.slice(1) : '/' + target.src;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 pointer-events-none">
                  <span className="text-xs font-semibold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    Read Story & View
                  </span>
                </div>
              </div>

              {/* Card Information & Snippet Preview */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#131317]/95">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold">
                      {photo.category}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      #{photo.id}
                    </span>
                  </div>

                  <h2
                    id={`photo-title-${photo.id}`}
                    className="text-base sm:text-lg font-bold text-neutral-100 group-hover:text-white transition-colors"
                  >
                    {photo.title}
                  </h2>

                  {/* 2-line Description Preview */}
                  <p className="mt-1.5 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <span>{photo.highlights.split('•')[0].trim()}</span>
                  <span className="text-white/80 font-medium">Click to open →</span>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>

      {/* Interactive Photo Lightbox with Full Description */}
      {activePhoto && (
        <div
          id="photo-lightbox-backdrop"
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            id="photo-lightbox-modal"
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[#16161b] rounded-2xl border border-white/20 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          >
            {/* Modal Top Bar */}
            <div className="px-5 py-3.5 bg-[#121216] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-semibold bg-white/10 text-neutral-200 border border-white/10">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {selectedPhotoIndex! + 1} of {photos.length}
                </span>
              </div>

              {/* Close Button */}
              <button
                id="lightbox-close-btn"
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center font-bold text-lg cursor-pointer border border-white/20"
                aria-label="Close dialog"
                title="Close (Esc)"
              >
                ×
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="overflow-y-auto flex-1 flex flex-col">
              {/* High-res Image Preview */}
              <div className="relative w-full max-h-[52vh] flex items-center justify-center bg-black/95 overflow-hidden p-2 group">
                <img
                  id="lightbox-full-img"
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain max-h-[50vh] rounded-lg"
                />

                {/* Left / Right Quick Navigation Buttons on Image */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center font-bold text-lg cursor-pointer border border-white/20 shadow-lg"
                  title="Previous Photo (Left Arrow)"
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 hover:bg-white hover:text-black text-white transition-all flex items-center justify-center font-bold text-lg cursor-pointer border border-white/20 shadow-lg"
                  title="Next Photo (Right Arrow)"
                  aria-label="Next photo"
                >
                  ›
                </button>
              </div>

              {/* Rich Photo Description with Vertical Cut Reveal Animation */}
              <div className="p-5 sm:p-6 bg-[#16161b] flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      <VerticalCutReveal
                        key={`title-${activePhoto.id}`}
                        splitBy="words"
                        staggerDuration={0.035}
                        staggerFrom="first"
                        transition={{
                          type: "spring",
                          stiffness: 220,
                          damping: 22,
                          delay: 0.05,
                        }}
                        containerClassName="font-bold text-white inline"
                      >
                        {activePhoto.title}
                      </VerticalCutReveal>
                    </h3>
                    <span className="text-xs text-neutral-400 font-medium">
                      {activePhoto.category}
                    </span>
                  </div>

                  {/* Complete Description Text with Smooth Vertical Cut Reveal Animation */}
                  <div className="mt-2 text-sm sm:text-base text-neutral-200 leading-relaxed">
                    <VerticalCutReveal
                      key={`desc-${activePhoto.id}`}
                      splitBy="words"
                      staggerDuration={0.014}
                      staggerFrom="first"
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 24,
                        delay: 0.12,
                      }}
                      containerClassName="text-neutral-200 leading-relaxed block"
                    >
                      {activePhoto.description}
                    </VerticalCutReveal>
                  </div>
                </div>

                {/* Bottom Bar with Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + photos.length) % photos.length : 0))}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer border border-white/10 flex items-center gap-1"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % photos.length : 0))}
                      className="px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer border border-white/10 flex items-center gap-1"
                    >
                      Next →
                    </button>
                  </div>

                  <button
                    id="lightbox-done-btn"
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="px-5 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-200 hover:text-white bg-white/10 hover:bg-white/25 rounded-lg transition-colors cursor-pointer border border-white/20"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
