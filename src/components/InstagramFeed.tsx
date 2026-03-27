import React from 'react';
import { motion } from 'motion/react';
import { Instagram, ExternalLink, Heart, MessageCircle } from 'lucide-react';

const INSTA_POSTS = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=600',
    caption: 'Our signature Butter Chicken, slow-cooked to perfection. 🥘✨ #SaffronSpice #IndianCuisine',
    likes: '1.2k',
    comments: 45
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
    caption: 'The perfect ambiance for your next family dinner. 🕯️🍷 #FineDining #AuthenticIndia',
    likes: '850',
    comments: 22
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1601050634127-601482a966cf?auto=format&fit=crop&q=80&w=600',
    caption: 'Hand-crafted crispy Samosas served with our secret mint chutney. 🥟🔥 #StreetFood #Appetizers',
    likes: '2.1k',
    comments: 89
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1601050633647-81a35257769a?auto=format&fit=crop&q=80&w=600',
    caption: 'Freshly baked Garlic Naan coming right out of the Tandoor! 🫓💨 #Tandoori #FreshlyBaked',
    likes: '1.5k',
    comments: 34
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1571006682881-79262bc837bc?auto=format&fit=crop&q=80&w=600',
    caption: 'Cool down with our refreshing Mango Lassi. 🥭🥛 #SummerVibes #MangoLassi',
    likes: '920',
    comments: 18
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=600',
    caption: 'A vibrant spread of Indian flavors. Which one is your favorite? 🍛🌶️ #Foodie #IndianFood',
    likes: '3.4k',
    comments: 120
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=600',
    caption: 'Our chefs preparing the nightly specials with love and tradition. 👨‍🍳❤️ #ChefLife #KitchenMagic',
    likes: '1.1k',
    comments: 28
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=600',
    caption: 'End your meal on a sweet note with our Gulab Jamun. 🍯🍬 #Dessert #SweetTooth',
    likes: '1.8k',
    comments: 56
  }
];

const InstagramFeed = () => {
  return (
    <section className="py-32 bg-stone-50 dark:bg-stone-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="text-left">
            <div className="flex items-center gap-3 text-orange-600 mb-6">
              <div className="w-12 h-px bg-orange-600" />
              <span className="font-bold tracking-[0.4em] uppercase text-[10px]">@saffronspice_official</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white font-serif leading-none">
              Social <span className="italic text-orange-600">Moments</span>
            </h2>
          </div>
          
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-4 text-stone-900 dark:text-white font-bold text-xs uppercase tracking-[0.3em]"
          >
            Follow Our Journey
            <div className="w-12 h-px bg-stone-900 dark:bg-white group-hover:w-16 group-hover:bg-orange-600 transition-all duration-500" />
            <Instagram className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {INSTA_POSTS.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm border border-stone-100 dark:border-stone-800"
            >
              <img 
                src={post.image} 
                alt="Instagram Post" 
                loading="lazy"
                decoding="async"
                width="600"
                height="600"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 backdrop-blur-[1px]">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white text-[10px] line-clamp-2 mb-4 font-light leading-relaxed tracking-wide italic">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-4 text-white/90 text-[8px] font-bold uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-1.5">
                      <Heart className="w-2.5 h-2.5 text-orange-500 fill-orange-500" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-2.5 h-2.5 text-white fill-white" />
                      <span>{post.comments}</span>
                    </div>
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

export default InstagramFeed;
