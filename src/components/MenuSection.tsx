import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MenuCategory, MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Plus, ShoppingBag, ArrowUpDown, Sparkles, Loader2, MessageSquare } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { getGeminiApiKey } from '../lib/env';

const MenuImage = ({ item }: { item: any }) => {
  const [src, setSrc] = useState(item.image_url || "https://images.unsplash.com/photo-1585937421612-70a0f2455f75?auto=format&fit=crop&q=80&w=800");
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const handleError = () => {
    if (fallbackLevel === 0) {
      // Level 1: Try a high-quality generic Indian food image
      setSrc("https://images.unsplash.com/photo-1585937421612-70a0f2455f75?auto=format&fit=crop&q=80&w=800");
      setFallbackLevel(1);
    } else {
      // Final Level: Simple placeholder
      setSrc(`https://picsum.photos/seed/${encodeURIComponent(item.name)}/800/600`);
      setFallbackLevel(2);
    }
  };

  React.useEffect(() => {
    setSrc(item.image_url || "https://images.unsplash.com/photo-1585937421612-70a0f2455f75?auto=format&fit=crop&q=80&w=800");
    setFallbackLevel(0);
  }, [item.image_url]);

  return (
    <div className="relative w-full h-full">
      <img
        src={src}
        alt={item.name}
        loading="lazy"
        decoding="async"
        width="800"
        height="600"
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        referrerPolicy="no-referrer"
        onError={handleError}
      />
    </div>
  );
};

const MenuSection = () => {
  const { menu } = useAppContext();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>('default');
  const [addedItem, setAddedItem] = useState<number | null>(null);

  // AI Recommendation State
  const [recommendations, setRecommendations] = useState<MenuItem[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [preferences, setPreferences] = useState('');
  const [showPreferenceInput, setShowPreferenceInput] = useState(false);

  useEffect(() => {
    if (menu && user) {
      fetchRecommendations();
    }
  }, [menu, user]);

  const fetchRecommendations = async (customPrefs?: string) => {
    if (!menu) return;
    setIsRecommending(true);
    try {
      let orderHistory = [];
      if (user?.email) {
        const res = await fetch(`/api/orders/${user.email}`);
        orderHistory = await res.json();
      }

      const apiKey = getGeminiApiKey();
      if (!apiKey) {
        throw new Error("Gemini API key is missing. Please ensure your API key is configured correctly.");
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        You are a gourmet food recommender for Saffron Spice, a premium Indian restaurant.
        Based on the user's order history and stated preferences, recommend 3 dishes from the menu.
        
        Menu: ${JSON.stringify(menu.items.map(i => ({ id: i.id, name: i.name, description: i.description })))}
        Order History: ${JSON.stringify(orderHistory.map((o: any) => o.items.map((i: any) => i.name)))}
        User Preferences: ${customPrefs || 'None stated'}
        
        Return the recommended dish IDs as a JSON array of numbers.
        Example: [1, 5, 12]
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.INTEGER }
          }
        }
      });

      const recommendedIds = JSON.parse(response.text || '[]');
      const recommendedItems = menu.items.filter(item => recommendedIds.includes(item.id));
      setRecommendations(recommendedItems);
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
    } finally {
      setIsRecommending(false);
    }
  };

  if (!menu) return null;

  // Get unique categories by name to avoid duplicates in the UI
  const uniqueCategories = menu.categories.reduce((acc: MenuCategory[], current) => {
    const x = acc.find(item => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);

  const handleAddToCart = (item: any) => {
    addToCart(item);
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  // Filter items based on active category name (to handle duplicates if they exist)
  const filteredItems = activeCategory === 'all' 
    ? menu.items 
    : menu.items.filter(item => {
        const cat = menu.categories.find(c => c.id === item.category_id);
        const activeCat = menu.categories.find(c => c.id === activeCategory);
        return cat?.name === activeCat?.name;
      });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <section id="menu" className="py-32 bg-white dark:bg-stone-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">The Collection</span>
          <h2 className="text-6xl md:text-8xl font-bold text-stone-900 dark:text-white mb-8 font-serif leading-none">
            Our <span className="italic text-orange-600">Signature</span> Menu
          </h2>
          <div className="w-24 h-px bg-stone-200 dark:bg-stone-800 mx-auto mb-8" />
          <p className="text-stone-500 dark:text-stone-400 max-w-2xl mx-auto font-light text-lg">
            A curated selection of authentic flavors, reimagined for the modern palate.
          </p>
        </div>

        {/* AI Recommendations Section */}
        <AnimatePresence>
          {(recommendations.length > 0 || isRecommending) && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-24 p-12 rounded-[3rem] bg-stone-900 text-white relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full -mr-48 -mt-48" />
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center text-orange-500">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-serif font-bold italic">Recommended for You</h3>
                    </div>
                    <p className="text-stone-400 text-sm max-w-md font-light">
                      Our AI analyzed your history and preferences to curate these perfect matches.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {showPreferenceInput ? (
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={preferences}
                          onChange={(e) => setPreferences(e.target.value)}
                          placeholder="e.g. Spicy, Vegan, Seafood..."
                          className="bg-stone-800 border border-stone-700 rounded-xl px-4 py-2 text-xs outline-none focus:border-orange-500 transition-all w-48"
                        />
                        <button 
                          onClick={() => {
                            fetchRecommendations(preferences);
                            setShowPreferenceInput(false);
                          }}
                          className="bg-orange-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 transition-all"
                        >
                          Update
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowPreferenceInput(true)}
                        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Set Preferences
                      </button>
                    )}
                  </div>
                </div>

                {isRecommending ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="animate-pulse space-y-4">
                        <div className="aspect-square bg-stone-800 rounded-2xl" />
                        <div className="h-4 bg-stone-800 rounded w-3/4" />
                        <div className="h-3 bg-stone-800 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {recommendations.map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ y: -10 }}
                        className="group relative"
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-stone-800">
                          <MenuImage item={item} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              onClick={() => handleAddToCart(item)}
                              className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center hover:scale-110 transition-transform"
                            >
                              <Plus className="w-6 h-6" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-lg font-serif font-bold mb-1">{item.name}</h4>
                        <p className="text-stone-500 text-xs italic line-clamp-1">{item.description}</p>
                        <span className="text-orange-500 text-xs font-bold mt-2 block">₹{item.price}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Menu Grid - Refined Luxury Style */}
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-72 lg:sticky lg:top-32 space-y-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 dark:text-stone-600">Categories</h3>
              <div className="flex lg:flex-col flex-wrap gap-4">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`relative py-2 text-sm font-bold transition-all duration-500 text-left group ${
                    activeCategory === 'all' 
                      ? 'text-orange-600' 
                      : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <span className="relative z-10">All Dishes</span>
                  {activeCategory === 'all' && (
                    <motion.div layoutId="activeCat" className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-orange-600 rounded-full" />
                  )}
                </button>
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`relative py-2 text-sm font-bold transition-all duration-500 text-left group ${
                      activeCategory === cat.id 
                        ? 'text-orange-600' 
                        : 'text-stone-400 hover:text-stone-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="relative z-10">{cat.name}</span>
                    {activeCategory === cat.id && (
                      <motion.div layoutId="activeCat" className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-orange-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-12 border-t border-stone-100 dark:border-stone-900">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 dark:text-stone-600 mb-6">Sort By</h3>
              <div className="space-y-4">
                {['default', 'price-asc', 'price-desc', 'name-asc'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option as any)}
                    className={`block text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                      sortBy === option ? 'text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    {option.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1">
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
            >
              <AnimatePresence mode="popLayout">
                {sortedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="group"
                  >
                    <div className="flex flex-col">
                      {/* Image Container */}
                      <div className={`relative aspect-square overflow-hidden rounded-2xl mb-6 shadow-lg border border-stone-100 dark:border-stone-800 transition-all duration-500 ${!item.is_available ? 'grayscale opacity-60' : ''}`}>
                        <MenuImage item={item} />
                        
                        {/* Status Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {item.is_popular && (
                            <div className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-md text-orange-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1.5">
                              <Sparkles className="w-2.5 h-2.5" />
                              Signature
                            </div>
                          )}
                          {!item.is_available && (
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                              Sold Out
                            </div>
                          )}
                        </div>

                        {/* Add Button Overlay */}
                        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          {item.is_available ? (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-14 h-14 rounded-full bg-white text-stone-900 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-all duration-500 hover:bg-orange-600 hover:text-white shadow-xl"
                            >
                              <Plus className="w-6 h-6" />
                            </button>
                          ) : (
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                              Unavailable
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-3">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mb-2 leading-tight">
                          {item.name}
                        </h3>
                        
                        <p className="text-stone-500 dark:text-stone-400 text-xs leading-relaxed font-light italic line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
