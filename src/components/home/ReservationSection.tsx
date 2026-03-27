import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Phone, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ReservationSectionProps {
  isReserving: boolean;
  setIsReserving: (val: boolean) => void;
}

const ReservationSection: React.FC<ReservationSectionProps> = ({ isReserving, setIsReserving }) => {
  const { settings } = useAppContext();

  const openingHours = useMemo(() => {
    if (!settings?.opening_hours) return null;
    try {
      return typeof settings.opening_hours === 'string' 
        ? JSON.parse(settings.opening_hours) 
        : settings.opening_hours;
    } catch (e) {
      console.error("Failed to parse opening hours", e);
      return null;
    }
  }, [settings]);

  const displayHours = useMemo(() => {
    if (!openingHours) return 'Mon-Sun: 12:00 PM - 11:00 PM';
    
    // Simple logic to show a range if they are mostly the same
    const mon = openingHours.mon;
    const sun = openingHours.sun;
    if (mon === sun) return `Mon-Sun: ${mon}`;
    return `Mon-Thu: ${mon}, Fri-Sat: ${openingHours.fri}, Sun: ${sun}`;
  }, [openingHours]);

  return (
    <section id="reservations" className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000" 
                className="w-full h-full object-cover" 
                alt="Restaurant Interior" 
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-600 rounded-full flex items-center justify-center text-white text-center p-6 shadow-2xl border-8 border-white">
              <span className="text-sm font-bold uppercase tracking-widest leading-tight">Voted Best Indian Dining 2024</span>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Reservations</span>
            <h2 className="text-5xl font-serif font-bold mb-8 leading-tight">Reserve Your <span className="italic text-orange-600">Culinary Journey</span></h2>
            <p className="text-stone-500 text-lg mb-12 font-light leading-relaxed">
              Experience the finest Indian cuisine in an elegant and welcoming atmosphere. We recommend booking in advance to ensure your preferred time.
            </p>
            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all border border-stone-100">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold">Location</h5>
                  <p className="text-sm text-stone-500">{settings?.address || '123 Spice Garden, Culinary District, Mumbai'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all border border-stone-100">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold">Phone</h5>
                  <p className="text-sm text-stone-500">{settings?.phone || '+91 98765 43210'}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all border border-stone-100">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-bold">Hours</h5>
                  <p className="text-sm text-stone-500">{displayHours}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsReserving(true)}
              className="w-full sm:w-auto px-12 py-5 bg-stone-900 text-white rounded-full font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <Calendar className="w-5 h-5" /> Book a Table Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
