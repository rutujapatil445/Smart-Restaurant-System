import React from 'react';
import { Award, Star } from 'lucide-react';

interface LoyaltySectionProps {
  loyaltyEmail: string;
  setLoyaltyEmail: (email: string) => void;
  fetchLoyalty: (email: string) => void;
  joinLoyalty: (email: string) => Promise<boolean>;
  loyaltyPoints: number | null;
}

const LoyaltySection: React.FC<LoyaltySectionProps> = ({ 
  loyaltyEmail, 
  setLoyaltyEmail, 
  fetchLoyalty, 
  joinLoyalty,
  loyaltyPoints 
}) => {
  const [isJoining, setIsJoining] = React.useState(false);
  const [joinSuccess, setJoinSuccess] = React.useState(false);

  const handleJoin = async () => {
    if (!loyaltyEmail) return;
    setIsJoining(true);
    const success = await joinLoyalty(loyaltyEmail);
    if (success) {
      setJoinSuccess(true);
      setTimeout(() => setJoinSuccess(false), 3000);
    }
    setIsJoining(false);
  };

  return (
    <section id="loyalty" className="py-24 bg-stone-900 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-orange-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Loyalty Program</span>
            <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">Join the <span className="italic text-orange-500">Spice Circle</span></h2>
            <p className="text-stone-400 text-lg mb-12 font-light leading-relaxed">
              Earn points with every visit and unlock exclusive rewards, early access to new menus, and special birthday treats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={loyaltyEmail}
                onChange={(e) => setLoyaltyEmail(e.target.value)}
                className="flex-1 px-8 py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-orange-500 transition-colors"
              />
              <div className="flex gap-2">
                <button 
                  onClick={() => fetchLoyalty(loyaltyEmail)}
                  className="px-8 py-5 bg-stone-800 hover:bg-stone-700 text-white rounded-full font-bold transition-all whitespace-nowrap"
                >
                  Check Points
                </button>
                <button 
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="px-8 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-bold transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {isJoining ? 'Joining...' : joinSuccess ? 'Joined!' : 'Join Now'}
                </button>
              </div>
            </div>
            {loyaltyPoints !== null && (
              <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 inline-block animate-in fade-in slide-in-from-top-4 duration-500">
                <p className="text-stone-400 text-sm mb-1">Your Current Balance</p>
                <p className="text-3xl font-serif font-bold text-orange-500">{loyaltyPoints} Points</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center">
              <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="text-orange-500 w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Exclusive Access</h4>
              <p className="text-xs text-stone-500">Be the first to try our seasonal creations.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center mt-12">
              <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="text-orange-500 w-6 h-6" />
              </div>
              <h4 className="font-bold mb-2">Earn Rewards</h4>
              <p className="text-xs text-stone-500">10 points for every ₹100 spent.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoyaltySection;
