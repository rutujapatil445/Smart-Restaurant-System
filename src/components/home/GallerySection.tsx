import React from 'react';

const GallerySection: React.FC = () => {
  const images = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
    "https://images.unsplash.com/photo-1567337710282-00832b415979"
  ];

  return (
    <section className="py-24 px-4 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">Visual Journey</span>
          <h2 className="text-5xl font-serif font-bold mt-2">The Saffron Gallery</h2>
        </div>
        <div className="columns-1 md:columns-3 gap-6 space-y-6">
          {images.map((src, i) => (
            <div key={i} className="rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <img 
                src={`${src}?auto=format&fit=crop&q=80&w=800`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={`Gallery ${i}`} 
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
