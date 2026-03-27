import React from 'react';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { ChevronDown, Calendar } from 'lucide-react';

const NewHero = () => {
  const { settings } = useAppContext();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="w-full h-full"
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920"
            alt="Luxury Indian Dining"
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <span className="text-orange-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-8 block">
            {settings?.restaurant_type || 'Authentic Indian Cuisine'}
          </span>
          
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white mb-8 tracking-tighter leading-[0.85] font-serif uppercase">
            Saffron <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Spice</span>
          </h1>
          
          <p className="text-lg md:text-xl text-stone-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed italic font-serif">
            {settings?.tagline || 'A Symphony of Spices and Tradition'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="#reserve"
              className="group relative px-10 py-5 bg-orange-600 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full overflow-hidden transition-all hover:shadow-[0_20px_40px_-10px_rgba(234,88,12,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Calendar className="w-4 h-4" />
                Reserve a Table
              </span>
              <div className="absolute inset-0 bg-stone-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
            
            <a
              href="#menu"
              className="px-10 py-5 glass rounded-full text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white/10 transition-all"
            >
              Explore Menu
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-white/30 vertical-text">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-12">
        <div className="flex flex-col items-center gap-4">
          <div className="w-px h-24 bg-white/10" />
          <span className="vertical-text text-[8px] font-bold uppercase tracking-[0.5em] text-white/20">Est. 1998</span>
        </div>
      </div>
    </section>
  );
};

export default NewHero;
