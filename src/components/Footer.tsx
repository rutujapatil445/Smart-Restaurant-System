import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { settings } = useAppContext();
  const hours = settings?.opening_hours ? JSON.parse(settings.opening_hours) : {};

  return (
    <footer className="bg-stone-950 text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <UtensilsCrossed className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-serif font-bold tracking-tight">
                {settings?.restaurant_name || 'Saffron Spice'}
              </span>
            </Link>
            <p className="text-stone-400 leading-relaxed font-light italic font-serif">
              Experience the perfect blend of tradition and innovation. 
              Join us for an unforgettable culinary journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-600 transition-all duration-300 group">
                <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-600 transition-all duration-300 group">
                <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-600 transition-all duration-300 group">
                <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-white/50">Quick Links</h4>
            <ul className="space-y-4 text-stone-400 text-sm">
              <li><a href="#menu" className="hover:text-orange-500 transition-colors">Our Menu</a></li>
              <li><a href="#about" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><Link to="/reserve" className="hover:text-orange-500 transition-colors">Book a Table</Link></li>
              <li><a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a></li>
              <li><Link to="/admin" className="hover:text-orange-500 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-white/50">Contact Us</h4>
            <ul className="space-y-4 text-stone-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{settings?.address || '123 Gourmet Ave, Foodie City'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{settings?.phone || '+1 (555) 123-4567'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-600 shrink-0" />
                <span>{settings?.email || 'hello@saffronspice.com'}</span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-8 text-white/50">Opening Hours</h4>
            <ul className="space-y-3 text-stone-400 text-xs uppercase tracking-widest">
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Mon - Wed</span> <span>{hours.mon || '11 AM - 10 PM'}</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Thu - Fri</span> <span>{hours.thu || '11 AM - 11 PM'}</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Saturday</span> <span>{hours.sat || '10 AM - 11 PM'}</span></li>
              <li className="flex justify-between"><span>Sunday</span> <span>{hours.sun || '10 AM - 9 PM'}</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-stone-600 text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>&copy; {new Date().getFullYear()} {settings?.restaurant_name || 'Saffron Spice'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
