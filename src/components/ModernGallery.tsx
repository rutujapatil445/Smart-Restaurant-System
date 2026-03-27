import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X } from 'lucide-react';
import { GalleryItem } from '../types';

const ModernGallery = () => {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setGallery(data));
  }, []);

  return (
    <section id="gallery" className="py-32 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div>
            <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Visual Story</span>
            <h2 className="text-5xl md:text-7xl font-bold text-white font-serif leading-none">
              Atmosphere <br />
              <span className="italic text-orange-600">& Vibe</span>
            </h2>
          </div>
          <p className="text-stone-500 max-w-md font-light italic">
            Step into our world of luxury and tradition. A glimpse into the soul of Saffron Spice.
          </p>
        </div>

        {/* Masonry-like Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-[2.5rem] overflow-hidden break-inside-avoid cursor-pointer"
              onClick={() => setSelectedImage(item.image_url)}
            >
              <img
                src={item.image_url}
                alt={item.caption}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center text-white scale-50 group-hover:scale-100 transition-transform duration-500">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-white font-serif italic text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                    {item.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-8 right-8 text-white p-2 glass rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt=""
              className="max-w-full max-h-[90vh] rounded-[2rem] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ModernGallery;
