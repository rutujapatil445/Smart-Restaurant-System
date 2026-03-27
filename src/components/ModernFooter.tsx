import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, UtensilsCrossed, Send, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ModernFooter = () => {
  const { settings } = useAppContext();
  const [email, setEmail] = useState('');
  const hours = settings?.opening_hours ? JSON.parse(settings.opening_hours) : {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 pt-32 pb-12 relative overflow-hidden">
      {/* Newsletter Overlay */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="glass-dark p-12 md:p-20 rounded-[4rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -z-10" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Spice Club</span>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif leading-tight">
                Join Our <br />
                <span className="italic text-orange-600">Inner Circle</span>
              </h2>
              <p className="text-stone-400 font-light italic">
                Get exclusive access to secret recipes, private event invites, and seasonal tasting menus.
              </p>
            </div>
            
            <form className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-full py-6 px-10 text-white outline-none focus:border-orange-600 transition-all backdrop-blur-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="absolute right-2 top-2 bottom-2 bg-orange-600 text-white px-8 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-orange-700 transition-all flex items-center gap-3">
                Join <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-600/30">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-serif font-bold text-white tracking-tight">
                {settings?.restaurant_name || 'Saffron Spice'}
              </span>
            </Link>
            <p className="text-stone-500 font-light italic leading-relaxed">
              Crafting unforgettable memories through the art of authentic Indian cuisine since 1998.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 glass rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-orange-600 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-white/50">Navigation</h4>
            <ul className="space-y-4 text-stone-400 text-sm font-light">
              <li><a href="#experience" className="hover:text-orange-500 transition-colors">The Experience</a></li>
              <li><a href="#menu" className="hover:text-orange-500 transition-colors">Culinary Menu</a></li>
              <li><a href="#signature" className="hover:text-orange-500 transition-colors">Signature Dishes</a></li>
              <li><a href="#gallery" className="hover:text-orange-500 transition-colors">Atmosphere</a></li>
              <li><a href="#reserve" className="hover:text-orange-500 transition-colors">Reservations</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-white/50">Contact</h4>
            <ul className="space-y-6 text-stone-400 text-sm font-light">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{settings?.address || '123 Gourmet Ave, Foodie City'}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{settings?.phone || '+1 (555) 123-4567'}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{settings?.email || 'hello@saffronspice.com'}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-10 text-white/50">Opening Hours</h4>
            <ul className="space-y-4 text-stone-400 text-xs uppercase tracking-widest">
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span>Mon - Wed</span>
                <span className="text-white">{hours.mon || '11 AM - 10 PM'}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span>Thu - Fri</span>
                <span className="text-white">{hours.thu || '11 AM - 11 PM'}</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-3">
                <span>Saturday</span>
                <span className="text-white">{hours.sat || '10 AM - 11 PM'}</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span className="text-white">{hours.sun || '10 AM - 9 PM'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
            &copy; {new Date().getFullYear()} {settings?.restaurant_name || 'Saffron Spice'}. All rights reserved.
          </p>
          
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-4 text-stone-600 hover:text-white transition-colors"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Back to top</span>
            <div className="w-10 h-10 glass rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-all">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;
