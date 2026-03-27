import React from 'react';
import { motion } from 'motion/react';
import { ChefHat, Flame, Sprout } from 'lucide-react';

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-32 bg-stone-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left: Storytelling */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Our Legacy</span>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-serif leading-none">
              A Journey Through <br />
              <span className="italic text-orange-600">Ancestral Spices</span>
            </h2>
            <p className="text-stone-400 text-lg mb-12 font-light leading-relaxed">
              At Saffron Spice, we don't just cook; we narrate stories of ancient India through flavors that have been perfected over generations. Our kitchen is a sanctuary where tradition meets modern culinary artistry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-white font-bold font-serif text-xl">Master Chefs</h4>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Led by Chef Rajat Sharma, our team brings decades of expertise from the royal kitchens of North India.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="text-white font-bold font-serif text-xl">Tandoor Mastery</h4>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Authentic clay ovens fired with natural charcoal for that unmistakable smoky perfection.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Visuals */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border border-white/5"
            >
              <img
                src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=1000"
                alt="Chef at work"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            {/* Floating Accent */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-12 -left-12 w-64 h-64 glass rounded-[3rem] p-8 hidden md:block z-20"
            >
              <Sprout className="w-10 h-10 text-orange-600 mb-6" />
              <h5 className="text-white font-bold font-serif text-lg mb-2">Organic Sourcing</h5>
              <p className="text-stone-500 text-xs leading-relaxed">
                We partner directly with spice farmers in Kerala to ensure the purest harvest for our signature blends.
              </p>
            </motion.div>

            {/* Decorative Background Element */}
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
