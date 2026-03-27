import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';

const signatureDishes = [
  {
    id: 1,
    name: "Royal Saffron Biryani",
    ingredients: ["Basmati Rice", "Kashmiri Saffron", "Tender Lamb", "Rose Petals"],
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800",
    price: "$32"
  },
  {
    id: 2,
    name: "Smoked Butter Chicken",
    ingredients: ["Charcoal Grilled Chicken", "Velvet Tomato Gravy", "Hand-churned Butter"],
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800",
    price: "$28"
  },
  {
    id: 3,
    name: "Truffle Malai Kofta",
    ingredients: ["Black Truffle Oil", "Cottage Cheese Dumplings", "Cashew Cream"],
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800",
    price: "$26"
  },
  {
    id: 4,
    name: "Lobster Moilee",
    ingredients: ["Fresh Atlantic Lobster", "Coconut Milk", "Curry Leaves", "Turmeric"],
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800",
    price: "$45"
  },
  {
    id: 5,
    name: "Gold Leaf Gulab Jamun",
    ingredients: ["Reduced Milk Solids", "24K Gold Leaf", "Cardamom Syrup"],
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800",
    price: "$18"
  }
];

const SignatureShowcase = () => {
  return (
    <section id="signature" className="py-32 bg-stone-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">The Collection</span>
            <h2 className="text-5xl md:text-7xl font-bold text-white font-serif leading-none">
              Signature <br />
              <span className="italic text-orange-600">Creations</span>
            </h2>
          </div>
          <p className="text-stone-500 max-w-md font-light italic">
            A curated selection of our most celebrated dishes, where traditional recipes meet contemporary luxury.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative overflow-x-auto custom-scrollbar pb-12">
        <div className="flex gap-8 px-4 sm:px-6 lg:px-8 min-w-max">
          {signatureDishes.map((dish, index) => (
            <motion.div
              key={dish.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative w-[350px] md:w-[450px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80" />
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Signature</span>
                </div>
                
                <h3 className="text-3xl font-serif font-bold text-white mb-4 group-hover:text-orange-500 transition-colors">
                  {dish.name}
                </h3>
                
                <div className="h-0 overflow-hidden group-hover:h-auto transition-all duration-500">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dish.ingredients.map(ing => (
                      <span key={ing} className="text-[8px] uppercase tracking-widest text-stone-400 border border-white/10 px-2 py-1 rounded-full">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif text-white">{dish.price}</span>
                  <button className="w-12 h-12 rounded-full glass flex items-center justify-center text-white hover:bg-orange-600 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignatureShowcase;
