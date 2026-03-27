import React from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Jenkins',
    role: 'Food Critic',
    content: 'The attention to detail at Lumina Bistro is unparalleled. Every dish tells a story of passion and precision.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    name: 'Michael Chen',
    role: 'Local Diner',
    content: 'Best scallops I have ever had. The atmosphere is elegant yet welcoming. A true gem in the heart of the city.',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=michael'
  },
  {
    name: 'Emma Thompson',
    role: 'Travel Blogger',
    content: 'A must-visit for anyone who appreciates fine dining without the pretension. The truffle arancini are to die for!',
    rating: 5,
    image: 'https://i.pravatar.cc/150?u=emma'
  }
];

const Testimonials = () => {
  return (
    <section className="py-32 bg-white dark:bg-stone-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Guest Stories</span>
          <h2 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white mb-8 font-serif leading-none">
            Kind <span className="italic text-orange-600">Words</span>
          </h2>
          <div className="w-24 h-px bg-stone-200 dark:bg-stone-800 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="relative group"
            >
              <div className="flex flex-col h-full text-center">
                <div className="mb-10 relative">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-orange-50 dark:bg-orange-900/10 rounded-full -z-0" />
                  <Quote className="w-12 h-12 text-stone-100 dark:text-stone-900 mx-auto relative z-10" />
                </div>
                
                <p className="text-stone-600 dark:text-stone-300 mb-12 text-xl leading-relaxed font-serif italic flex-1 px-4">
                  "{t.content}"
                </p>
                
                <div className="flex flex-col items-center gap-6">
                  <div className="w-20 h-20 rounded-full border-4 border-white dark:border-stone-900 overflow-hidden shadow-2xl">
                    <img
                      src={t.image}
                      alt={t.name}
                      loading="lazy"
                      decoding="async"
                      width="80"
                      height="80"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white text-sm tracking-[0.1em] uppercase mb-1">{t.name}</h4>
                    <p className="text-[10px] text-orange-600 font-black uppercase tracking-[0.3em]">{t.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 text-orange-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
