import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Users, CheckCircle2, AlertCircle, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useAppContext();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    occasion: 'None',
    note: ''
  });

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

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

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[date.getDay()];
  };

  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const isTimeValid = (date: string, time: string) => {
    if (!openingHours || !date || !time) return true;
    
    const dayName = getDayName(date);
    const hoursRange = openingHours[dayName];
    if (!hoursRange) return false;

    const [startStr, endStr] = hoursRange.split(' - ');
    const start = parseTime(startStr);
    const end = parseTime(endStr);
    const selected = parseTime(time);

    // Handle ranges that cross midnight (e.g., 11:00 AM - 12:00 AM)
    if (end < start) {
      return selected >= start || selected <= end;
    }
    
    return selected >= start && selected <= end;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isTimeValid(formData.date, formData.time)) {
      const dayName = getDayName(formData.date);
      const range = openingHours ? openingHours[dayName] : 'our operating hours';
      setError(`Please select a time within our operating hours for this day: ${range}`);
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to book reservation');

      setIsSubmitted(true);
      
      // Reset and close after some time
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setFormData({ name: '', email: '', phone: '', date: '', time: '', guests: '', occasion: 'None', note: '' });
      }, 4000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white z-[70] shadow-2xl rounded-[3rem] p-12 flex flex-col max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-4xl font-serif font-bold">Book Your Table</h3>
                <p className="text-stone-500 text-sm mt-2">Experience the symphony of spices</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">Reservation Requested!</h4>
                  <p className="text-stone-500 mb-2">
                    We've received your request for a <span className="text-orange-600 font-bold">{formData.occasion !== 'None' ? formData.occasion : 'table'}</span> on {formData.date} at {formData.time}.
                  </p>
                  <p className="text-stone-500 text-sm">We'll confirm via email shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col">
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>{error}</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        <input 
                          required 
                          type="text" 
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        <input 
                          required 
                          type="email" 
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        <input 
                          required 
                          type="tel" 
                          name="phone"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Date</label>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        <input 
                          required 
                          type="date" 
                          name="date"
                          min={today}
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Time</label>
                      <div className="relative group">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        <select 
                          required 
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none"
                        >
                          <option value="">Select Time</option>
                          <optgroup label="Lunch">
                            <option>12:00 PM</option>
                            <option>12:30 PM</option>
                            <option>1:00 PM</option>
                            <option>1:30 PM</option>
                            <option>2:00 PM</option>
                            <option>2:30 PM</option>
                            <option>3:00 PM</option>
                          </optgroup>
                          <optgroup label="Dinner">
                            <option>6:00 PM</option>
                            <option>6:30 PM</option>
                            <option>7:00 PM</option>
                            <option>7:30 PM</option>
                            <option>8:00 PM</option>
                            <option>8:30 PM</option>
                            <option>9:00 PM</option>
                            <option>9:30 PM</option>
                            <option>10:00 PM</option>
                            <option>10:30 PM</option>
                            <option>11:00 PM</option>
                          </optgroup>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Guests</label>
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                        <select 
                          required 
                          name="guests"
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none"
                        >
                          <option value="">Select Guests</option>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                          <option value="12">12 Guests</option>
                          <option value="15">15+ Guests</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Occasion</label>
                      <select 
                        name="occasion"
                        value={formData.occasion}
                        onChange={handleChange}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all appearance-none"
                      >
                        <option>None</option>
                        <option>Birthday</option>
                        <option>Anniversary</option>
                        <option>Business</option>
                        <option>Date Night</option>
                        <option>Family Gathering</option>
                        <option>Celebration</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 mb-12">
                    <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">Special Notes</label>
                    <div className="relative group">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-stone-400 group-focus-within:text-orange-500 transition-colors" />
                      <textarea 
                        name="note"
                        placeholder="Any special requests or dietary requirements?"
                        value={formData.note}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/5 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center group"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Confirm Reservation
                        <CheckCircle2 className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReservationModal;
