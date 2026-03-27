import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60" 
          alt="Hero Background" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-stone-50" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-orange-500 font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Experience the Art of Indian Cuisine</span>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight">
            Saffron <span className="italic text-orange-500">Spice</span>
          </h1>
          <p className="text-xl text-stone-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            A journey through the vibrant flavors of India, where tradition meets modern culinary excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#reservations" className="px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold transition-all transform hover:scale-105 shadow-xl shadow-orange-600/20">
              Book a Table
            </a>
            <a href="#menu" className="px-10 py-5 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 rounded-full font-bold transition-all transform hover:scale-105">
              Order Online
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
