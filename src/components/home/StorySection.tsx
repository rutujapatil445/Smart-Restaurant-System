import React from 'react';

const StorySection: React.FC = () => {
  return (
    <section id="story" className="py-24 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          <img 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600" 
            className="rounded-3xl aspect-square object-cover" 
            alt="Story 1" 
            referrerPolicy="no-referrer"
          />
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600" 
            className="rounded-3xl aspect-[3/4] object-cover mt-12" 
            alt="Story 2" 
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="md:w-1/2">
          <span className="text-orange-600 font-bold tracking-widest uppercase text-sm">Our Heritage</span>
          <h2 className="text-5xl font-serif font-bold mt-4 mb-8">A Legacy of <br /> <span className="text-orange-600 italic">Authentic Flavors</span></h2>
          <p className="text-stone-500 leading-relaxed mb-8">
            Founded in the heart of India, Saffron Spice began as a small family kitchen with a big dream: to bring the true essence of Indian culinary traditions to the modern world. 
          </p>
          <p className="text-stone-500 leading-relaxed mb-10">
            Every dish we serve is a tribute to the diverse cultures and rich history of India. We use only the finest hand-picked spices and traditional slow-cooking techniques to ensure an unforgettable dining experience.
          </p>
          <div className="flex gap-12">
            <div>
              <p className="text-4xl font-serif font-bold text-orange-600">15+</p>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Years of Excellence</p>
            </div>
            <div>
              <p className="text-4xl font-serif font-bold text-orange-600">50+</p>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Signature Recipes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
