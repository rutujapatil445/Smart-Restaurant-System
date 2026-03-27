import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Offer } from '../types';

const Hero = () => {
  const { settings } = useAppContext();
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    fetch('/api/offers')
      .then(res => res.json())
      .then(data => setOffers(data));
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-stone-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920"
          alt="Restaurant Interior"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-transparent to-stone-950" />
      </div>

      {/* Vertical Rail Text */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block">
        <div className="vertical-text text-[10px] font-bold uppercase tracking-[0.5em] text-white/30 rotate-180">
          Est. 1998 — Authentic Indian Culinary Arts
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <AnimatePresence>
              {offers.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-3 px-6 py-2 mb-12 text-[10px] font-bold tracking-[0.3em] text-white uppercase bg-white/5 backdrop-blur-xl rounded-full border border-white/10"
                >
                  <Tag className="w-3 h-3 text-orange-500" />
                  <span>{offers[0].title}</span>
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-orange-400">Use Code {offers[0].code}</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.span 
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-orange-500 font-bold uppercase text-xs mb-6 block"
            >
              {settings?.restaurant_type || 'Authentic Indian Cuisine'}
            </motion.span>
            
            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-bold text-white mb-8 tracking-[-0.04em] leading-[0.85] font-serif uppercase">
              {settings?.restaurant_name || 'Saffron Spice'}
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-2xl text-stone-300 mb-16 max-w-2xl mx-auto font-light leading-relaxed italic font-serif"
            >
              {settings?.tagline || 'A Symphony of Spices and Tradition'}
            </motion.p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                to="/reserve"
                className="group relative px-12 py-6 bg-orange-600 text-white font-bold text-sm uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:shadow-[0_20px_40px_-10px_rgba(234,88,12,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  Reserve a Table
                </span>
                <div className="absolute inset-0 bg-stone-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </Link>
              
              <a
                href="#menu"
                className="group flex items-center gap-4 text-white font-bold text-sm uppercase tracking-[0.2em] hover:text-orange-500 transition-colors"
              >
                Explore Menu
                <div className="w-12 h-px bg-white/30 group-hover:w-16 group-hover:bg-orange-500 transition-all duration-500" />
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 vertical-text">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
