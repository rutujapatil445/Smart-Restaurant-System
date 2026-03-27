import React from 'react';
import { motion } from 'motion/react';
import { Star, Plus, ChevronRight } from 'lucide-react';

interface PopularDishesProps {
  popularDishes: any[];
  addToCart: (dish: any) => void;
}

const PopularDishes: React.FC<PopularDishesProps> = ({ popularDishes, addToCart }) => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-16">
        <div>
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">Guest Favorites</span>
          <h2 className="text-4xl font-serif font-bold mt-2">Popular Dishes</h2>
        </div>
        <a href="#menu" className="text-orange-600 font-bold flex items-center gap-2 hover:gap-4 transition-all">
          View Full Menu <ChevronRight className="w-5 h-5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {popularDishes.slice(0, 3).map((dish, idx) => (
          <motion.div 
            key={dish.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-stone-100"
          >
            <div className="h-64 overflow-hidden relative">
              <img 
                src={dish.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={dish.name} 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold shadow-lg">
                <Star className="w-4 h-4 text-orange-500 fill-orange-500" /> 4.9
              </div>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{dish.name}</h3>
                <span className="text-xl font-serif font-bold text-orange-600">₹{dish.price}</span>
              </div>
              <p className="text-stone-500 text-sm mb-8 line-clamp-2">{dish.description}</p>
              <button 
                onClick={() => addToCart(dish)}
                className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PopularDishes;
