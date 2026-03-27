import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChefHat, Award, Clock, Users, Star } from 'lucide-react';
import { StaffMember } from '../types';

const About = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    fetch('/api/staff')
      .then(res => res.json())
      .then(data => setStaff(data));
  }, []);

  return (
    <section id="about" className="py-32 bg-stone-50 dark:bg-stone-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-xl border-4 border-white dark:border-stone-900">
              <img
                src="https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=1000"
                alt="Indian Spices"
                loading="lazy"
                decoding="async"
                width="1000"
                height="1250"
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl -z-0" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-100 dark:bg-emerald-900/20 rounded-full blur-3xl -z-0" />
            
            <div className="absolute top-1/2 -right-12 -translate-y-1/2 hidden xl:block">
              <div className="vertical-text text-[10px] font-bold uppercase tracking-[0.5em] text-stone-300 dark:text-stone-700">
                Crafted with Passion
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="text-orange-600 font-bold tracking-[0.3em] uppercase text-xs mb-6 block">Our Heritage</span>
            <h2 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white mb-8 leading-[1.1] font-serif">
              A Legacy of <br /> <span className="italic text-orange-600">Flavor</span> & Tradition
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-400 mb-12 leading-relaxed font-light">
              Saffron Spice was born from a passion for authentic Indian culinary arts. 
              Our recipes have been passed down through generations, each dish a testament 
              to the rich cultural tapestry of India.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mb-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-stone-900 dark:bg-white rounded-full flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white dark:text-stone-900" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white text-lg">Tandoor Masters</h4>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">Our chefs specialize in traditional clay oven techniques, bringing you smoky, authentic flavors.</p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-stone-900 dark:bg-white rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white dark:text-stone-900" />
                </div>
                <h4 className="font-bold text-stone-900 dark:text-white text-lg">Hand-Picked Spices</h4>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">We source our spices directly from the fields of Kerala and Rajasthan for unmatched purity.</p>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-stone-900 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900 dark:text-white">Trusted by 10,000+ Foodies</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-orange-500 fill-current" />)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Staff Section */}
        {staff.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Meet Our Culinary Team</h3>
              <div className="w-20 h-1 bg-orange-500 mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {staff.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="bg-white dark:bg-stone-900 p-8 md:p-6 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-500 group text-center w-full"
                >
                  <div className="relative mb-6 inline-block">
                    <div className="w-40 h-40 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white dark:border-stone-800 shadow-lg mx-auto relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110">
                      <img 
                        src={member.image_url || `https://i.pravatar.cc/200?u=${member.id}`} 
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        width="160"
                        height="160"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-all duration-500 scale-110 opacity-0 group-hover:opacity-100" />
                  </div>
                  <h4 className="font-bold text-stone-900 dark:text-white text-xl md:text-lg mb-1 tracking-tight">{member.name}</h4>
                  <p className="text-orange-600 font-semibold text-xs md:text-[10px] uppercase tracking-[0.2em]">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
