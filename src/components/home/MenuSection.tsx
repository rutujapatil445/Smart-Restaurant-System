import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, X } from 'lucide-react';

interface MenuSectionProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMenu: any[];
  addToCart: (item: any) => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory, 
  searchQuery,
  setSearchQuery,
  filteredMenu, 
  addToCart 
}) => {
  return (
    <section id="menu" className="py-24 bg-stone-100 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">Explore Our Flavors</span>
          <h2 className="text-5xl font-serif font-bold mt-2">Interactive Menu</h2>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for your favorite dish..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-16 py-5 bg-white rounded-full border border-stone-200 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                  : 'bg-white text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={item.id}
                className="bg-white p-6 rounded-[2rem] flex gap-6 items-center shadow-sm hover:shadow-md transition-all border border-stone-200/50"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
                    className="w-full h-full object-cover" 
                    alt={item.name} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <span className="font-serif font-bold text-orange-600">₹{item.price}</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-4 line-clamp-1">{item.description}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="text-xs font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    Add to Cart <Plus className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
