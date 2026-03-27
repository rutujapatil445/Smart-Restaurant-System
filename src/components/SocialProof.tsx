import React from 'react';
import { motion } from 'motion/react';
import { Star, Instagram, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Elena Rodriguez",
    role: "Food Critic",
    content: "The most authentic Indian experience in the city. The Smoked Butter Chicken is a revelation. Every bite feels like a journey to Old Delhi.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "Lifestyle Blogger",
    content: "Exquisite atmosphere and impeccable service. The attention to detail in the presentation of the signature dishes is world-class.",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah Jenkins",
    role: "Regular Guest",
    content: "Saffron Spice has become our family's favorite spot for celebrations. The flavors are consistent and the staff makes you feel like royalty.",
    rating: 5
  }
];

const instagramPosts = [
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=400",
  "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=400"
];

const SocialProof = () => {
  return (
    <section className="py-32 bg-stone-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Reviews */}
        <div className="text-center mb-24">
          <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Testimonials</span>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-16 font-serif leading-none">
            Voices of <span className="italic text-orange-600">Excellence</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-dark p-10 rounded-[3rem] text-left relative"
              >
                <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5" />
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                  ))}
                </div>
                <p className="text-stone-400 font-light italic mb-8 leading-relaxed">
                  "{review.content}"
                </p>
                <div>
                  <h5 className="text-white font-bold font-serif text-lg">{review.name}</h5>
                  <p className="text-orange-600 text-[10px] font-bold uppercase tracking-widest">{review.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Instagram Feed */}
        <div className="pt-32 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div>
              <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Social Feed</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">
                Follow the <span className="italic text-orange-600">Saffron Journey</span>
              </h2>
            </div>
            <a
              href="#"
              className="flex items-center gap-4 text-white font-bold text-[10px] uppercase tracking-[0.3em] hover:text-orange-500 transition-colors group"
            >
              <Instagram className="w-5 h-5" />
              @saffronspice_official
              <div className="w-12 h-px bg-white/20 group-hover:w-16 group-hover:bg-orange-500 transition-all" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square rounded-2xl overflow-hidden group relative"
              >
                <img
                  src={post}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
