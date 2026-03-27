import React, { useState } from 'react';
import { Utensils, Instagram, Facebook, Twitter, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-stone-950 text-white py-24 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <Utensils className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight">Saffron<span className="text-orange-600">Spice</span></span>
            </div>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
              Bringing the authentic flavors of India to your table with a modern twist. Experience the finest dining in the city.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://instagram.com/saffronspice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:text-white" />
              </a>
              <a 
                href="https://facebook.com/saffronspice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 group-hover:text-white" />
              </a>
              <a 
                href="https://twitter.com/saffronspice" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all duration-300 group"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 group-hover:text-white" />
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-8 uppercase tracking-widest text-xs">Quick Links</h5>
            <ul className="space-y-4 text-stone-500 text-sm">
              <li><a href="#menu" className="hover:text-orange-500 transition-colors">Menu</a></li>
              <li><a href="#reservations" className="hover:text-orange-500 transition-colors">Reservations</a></li>
              <li><a href="#loyalty" className="hover:text-orange-500 transition-colors">Loyalty Program</a></li>
              <li><a href="#story" className="hover:text-orange-500 transition-colors">Our Story</a></li>
              <li><a href="/admin" className="hover:text-orange-500 transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-8 uppercase tracking-widest text-xs">Contact Us</h5>
            <ul className="space-y-4 text-stone-500 text-sm">
              <li>+91 98765 43210</li>
              <li>hello@saffronspice.com</li>
              <li>123 Spice Garden, Mumbai</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-8 uppercase tracking-widest text-xs">Newsletter</h5>
            <p className="text-stone-500 text-xs mb-6">Subscribe to get the latest updates and offers.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-orange-500 text-sm"
              />
              <button 
                type="submit"
                disabled={status === 'loading'}
                className="px-4 py-3 bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </button>
            </form>
            {status === 'error' && (
              <p className="text-rose-500 text-[10px] mt-2">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-stone-600 uppercase tracking-[0.3em] font-bold">
          <p>© 2024 Saffron Spice. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
