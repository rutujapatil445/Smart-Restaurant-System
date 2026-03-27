import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../context/CartContext';
import { Plus, Info, Star } from 'lucide-react';
import { MenuCategory, MenuItem } from '../types';

const InteractiveMenu = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    Promise.all([
      fetch('/api/menu/categories').then(res => res.json()),
      fetch('/api/menu/items').then(res => res.json())
    ]).then(([catData, itemData]) => {
      setCategories(catData);
      setItems(itemData);
      if (catData.length > 0) setActiveCategory(catData[0].id);
    });
  }, []);

  const filteredItems = items.filter(item => item.category_id === activeCategory);

  return (
    <section id="menu" className="py-32 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">The Menu</span>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-serif leading-none">
            Culinary <span className="italic text-orange-600">Masterpieces</span>
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                activeCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                  : 'bg-white/5 text-stone-400 hover:bg-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`group glass rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 ${!item.is_available ? 'grayscale opacity-60' : ''}`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800'}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                  <div className="absolute top-6 right-6">
                    <span className="glass px-4 py-2 rounded-full text-white font-serif text-lg">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {item.is_popular && (
                      <div className="bg-orange-600 p-2 rounded-full shadow-lg w-fit">
                        <Star className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                    {!item.is_available && (
                      <div className="bg-red-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Sold Out
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-stone-500 text-sm font-light mb-8 line-clamp-2 italic">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors">
                      <Info className="w-4 h-4" />
                      Details
                    </button>
                    <button
                      onClick={() => item.is_available && addItem(item)}
                      disabled={!item.is_available}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all duration-500 ${
                        item.is_available 
                          ? 'bg-white/5 hover:bg-orange-600 group-hover:bg-orange-600' 
                          : 'bg-white/5 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Plus className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default InteractiveMenu;
