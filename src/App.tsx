import React from 'react';

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
    title: 'Architectural Curves',
    category: 'Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Emerald Forest',
    category: 'Nature',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Coastal Serenity',
    category: 'Seascape',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Metropolitan Motion',
    category: 'Urban',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Golden Dunes',
    category: 'Desert',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 7,
    title: 'Winding Trail',
    category: 'Adventure',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 8,
    title: 'Mirror Lake',
    category: 'Waterscape',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=600&fit=crop&q=80',
  },
  {
    id: 9,
    title: 'Autumn Canopy',
    category: 'Botanical',
    imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&h=600&fit=crop&q=80',
  },
];

export default function App(): React.JSX.Element {
  return (
    <div id="gallery-app" className="min-h-screen bg-stone-100 text-stone-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header id="gallery-header" className="text-center mb-10">
          <h1 id="gallery-main-title" className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
            Photo Gallery
          </h1>
          <p id="gallery-subtitle" className="mt-2 text-sm sm:text-base text-stone-600">
            A 3&times;3 photo grid featuring equal dimensions
          </p>
        </header>

        <main id="photo-grid" className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <article
              key={photo.id}
              id={`photo-card-${photo.id}`}
              className="bg-white rounded-xl shadow-xs border border-stone-200/80 overflow-hidden flex flex-col group transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="aspect-square w-full overflow-hidden bg-stone-200">
                <img
                  id={`photo-img-${photo.id}`}
                  src={photo.imageUrl}
                  alt={photo.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-wider text-stone-600 font-medium mb-1">
                  {photo.category}
                </span>
                <h2 id={`photo-title-${photo.id}`} className="text-base font-semibold text-stone-800 line-clamp-1">
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
