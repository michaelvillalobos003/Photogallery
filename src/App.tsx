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
    imageUrl: '/images/architecture.jpg',
  },
  {
    id: 3,
    title: 'Emerald Forest',
    category: 'Nature',
    imageUrl: '/images/forest.jpg',
  },
  {
    id: 4,
    title: 'Coastal Serenity',
    category: 'Seascape',
    imageUrl: '/images/seascape.jpg',
  },
  {
    id: 5,
    title: 'Metropolitan Motion',
    category: 'Urban',
    imageUrl: '/images/city.jpg',
  },
  {
    id: 6,
    title: 'Golden Dunes',
    category: 'Desert',
    imageUrl: '/images/desert.jpg',
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
    imageUrl: '/images/huevos_con_chorizo.jpg',
  },
  {
    id: 9,
    title: 'Elote',
    category: 'Mexican Food',
    imageUrl: '/images/elote.jpg',
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
