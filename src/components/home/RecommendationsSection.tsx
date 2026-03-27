import React from 'react';
import { TrendingUp, Plus, Award } from 'lucide-react';

interface RecommendationsSectionProps {
  recommendations: any[];
  addToCart: (item: any) => void;
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({ recommendations, addToCart }) => {
  return (
    <section className="py-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <TrendingUp className="w-4 h-4" /> Smart Recommendations
            </div>
            <h2 className="text-5xl font-serif font-bold mb-8">AI-Curated <br /> <span className="text-orange-600 italic">Chef's Selection</span></h2>
            <p className="text-stone-500 leading-relaxed mb-10">
              Our intelligent system analyzes trending flavors and seasonal ingredients to suggest the perfect meal for you. Experience the best of Saffron Spice today.
            </p>
            <div className="space-y-6">
              {recommendations.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200">
                    <img 
                      src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
                      className="w-full h-full object-cover" 
                      alt={item.name} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="font-bold">{item.name}</h5>
                    <p className="text-xs text-stone-500">₹{item.price} • {item.is_signature ? 'Signature' : 'Trending'}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="ml-auto p-2 bg-white rounded-lg border border-stone-200 hover:bg-orange-600 hover:text-white transition-all"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover"
                alt="Chef Special"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-stone-100 max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <Award className="text-white w-6 h-6" />
                </div>
                <div>
                  <h6 className="font-bold text-sm">Chef's Choice</h6>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest">Award Winning Recipe</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 italic">"This dish represents the soul of our kitchen, blending 24 unique spices."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecommendationsSection;
