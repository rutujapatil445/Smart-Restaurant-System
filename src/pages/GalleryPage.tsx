import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Maximize2, Utensils, Sparkles, Heart } from 'lucide-react';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  category: 'ambiance' | 'dishes' | 'chef';
  description: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    title: 'Main Dining Hall',
    category: 'ambiance',
    description: 'Our main dining area features warm lighting and authentic decor.'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=1200',
    title: 'Signature Butter Chicken',
    category: 'dishes',
    description: 'Our world-famous butter chicken, slow-cooked in a rich tomato and cream gravy.'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=1200',
    title: 'The Art of Spice',
    category: 'chef',
    description: 'Our head chef carefully selecting the finest spices for the evening.'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200',
    title: 'Private Dining Room',
    category: 'ambiance',
    description: 'An intimate space for special celebrations and corporate events.'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&q=80&w=1200',
    title: 'Slow-Cooked Lamb Rogan Josh',
    category: 'dishes',
    description: 'Tender lamb in a rich, flavorful gravy with traditional spices.'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1571006682881-79262bc837bc?auto=format&fit=crop&q=80&w=1200',
    title: 'Mango Lassi Delight',
    category: 'dishes',
    description: 'A refreshing traditional yogurt drink blended with sweet mango pulp.'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200',
    title: 'The Spice Bar',
    category: 'ambiance',
    description: 'Craft cocktails inspired by the botanical wonders of the East.'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1200',
    title: 'Precision Plating',
    category: 'chef',
    description: 'Every dish is a canvas, every ingredient a brushstroke.'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1200',
    title: 'Chicken Tikka Masala',
    category: 'dishes',
    description: 'Grilled chicken chunks in a spicy, creamy tomato-based sauce.'
  }
];

const GalleryPage = () => {
  const [filter, setFilter] = useState<'all' | 'ambiance' | 'dishes' | 'chef'>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages = filter === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === filter);

  return (
    <div className="pt-40 pb-32 min-h-screen bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden mb-32">
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920" 
            alt="Gallery Background" 
            className="w-full h-full object-cover opacity-40 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/0 via-stone-50/80 to-stone-50 dark:from-stone-950/0 dark:via-stone-950/80 dark:to-stone-950" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-8 block">Visual Narrative</span>
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-stone-900 dark:text-white mb-8 leading-none">
              The <span className="italic text-orange-600">Gallery</span>
            </h1>
            <p className="text-xs text-stone-400 max-w-lg mx-auto font-bold uppercase tracking-[0.4em] leading-loose">
              A curated collection of moments, flavors, and atmospheres that define our legacy.
            </p>
          </motion.div>
        </div>

        <div className="absolute left-12 bottom-12 hidden lg:block">
          <span className="vertical-text text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">Est. 1998 — Mumbai</span>
        </div>
      </section>

      {/* Filter Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-wrap justify-center gap-12">
          {[
            { id: 'all', label: 'All Chapters' },
            { id: 'ambiance', label: 'The Space' },
            { id: 'dishes', label: 'The Cuisine' },
            { id: 'chef', label: 'The Craft' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`group relative py-2 text-[10px] font-bold uppercase tracking-[0.4em] transition-all duration-500 ${
                filter === item.id 
                  ? 'text-orange-600' 
                  : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              <motion.div 
                className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-orange-600 origin-left`}
                initial={false}
                animate={{ scaleX: filter === item.id ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid - Magazine Style */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          layout
          className="magazine-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className={`group relative overflow-hidden bg-stone-200 dark:bg-stone-900 cursor-pointer shadow-2xl ${
                  index % 5 === 0 ? 'md:col-span-2 md:row-span-2 aspect-[4/5]' : 'aspect-[3/4]'
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-12 backdrop-blur-[2px]">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    className="text-white"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-400 mb-4 block">
                      {image.category}
                    </span>
                    <h3 className="text-4xl font-serif font-bold mb-4 leading-tight">{image.title}</h3>
                    <div className="flex items-center text-white/50 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <Maximize2 className="h-4 w-4 mr-3" />
                      <span>Expand View</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-20 bg-stone-950/98 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-12 right-12 text-white/50 hover:text-white transition-colors p-4 group"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-10 w-10 transition-transform group-hover:rotate-90 duration-500" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-7xl w-full bg-stone-900 dark:bg-stone-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row h-full">
                <div className="lg:w-2/3 aspect-[4/3] lg:aspect-auto bg-stone-800">
                  <img 
                    src={selectedImage.url} 
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="lg:w-1/3 p-12 lg:p-20 flex flex-col justify-center bg-stone-900 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-600 mb-8 block">
                    {selectedImage.category}
                  </span>
                  <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">{selectedImage.title}</h2>
                  <p className="text-stone-400 leading-loose text-sm mb-12 font-light italic">
                    "{selectedImage.description}"
                  </p>
                  <div className="pt-12 border-t border-white/10 flex items-center justify-between">
                    <button className="flex items-center gap-4 text-stone-400 hover:text-orange-600 transition-all group">
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-orange-600 transition-all">
                        <Heart className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Appreciate</span>
                    </button>
                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className="mt-24 px-4">
        <div className="max-w-4xl mx-auto bg-emerald-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-400 blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-400 blur-[100px]" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Experience it for yourself</h2>
            <p className="text-emerald-100/80 mb-10 max-w-xl mx-auto">
              Ready to taste the magic? Book your table today and let us take you on a culinary journey you won't forget.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/reserve" 
                className="px-8 py-4 bg-white text-emerald-900 rounded-full font-bold hover:bg-emerald-50 transition-colors shadow-xl"
              >
                Book a Table
              </a>
              <a 
                href="/#menu" 
                className="px-8 py-4 bg-emerald-800 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors border border-emerald-700"
              >
                View Our Menu
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
