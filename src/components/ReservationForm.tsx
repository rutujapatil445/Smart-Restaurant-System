import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

const ReservationForm = () => {
  const { user } = useAuth();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    note: '',
    table_number: ''
  });

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsSuccess(true);
        showNotification('Reservation request sent successfully!', 'success');
        setFormData({
          name: user?.displayName || '',
          email: user?.email || '',
          phone: '',
          date: '',
          time: '',
          guests: 2,
          note: '',
          table_number: ''
        });
      } else {
        showNotification('Failed to send reservation request. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Reservation failed', err);
      showNotification('An error occurred. Please check your connection.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-stone-900 p-12 rounded-[3rem] shadow-2xl text-center max-w-md mx-auto border border-stone-100 dark:border-stone-800"
      >
        <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white mb-4">Table Reserved!</h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8 font-light italic font-serif">
          Thank you, {formData.name}. We've received your request for {formData.guests} guests on {formData.date} at {formData.time}. 
          We'll send a confirmation email shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="bg-orange-600 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-orange-700 transition-all"
        >
          Make Another Booking
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-stone-900 p-10 md:p-20 rounded-[3rem] shadow-2xl border border-stone-100 dark:border-stone-800 max-w-5xl mx-auto transition-all duration-500"
    >
      <div className="text-center mb-16">
        <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Experience</span>
        <h2 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white mb-6 font-serif leading-none">
          Book Your <span className="italic text-orange-600">Table</span>
        </h2>
        <p className="text-stone-400 font-light tracking-[0.2em] uppercase text-xs">Join us for an unforgettable culinary journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Full Name</label>
          <input
            required
            type="text"
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Email Address</label>
          <input
            required
            type="email"
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Phone Number *</label>
          <input
            required
            type="tel"
            placeholder="+91 98765 43210"
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Guests</label>
          <select
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white cursor-pointer appearance-none"
            value={formData.guests}
            onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Date</label>
          <input
            required
            type="date"
            min={today}
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white cursor-pointer"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Preferred Time</label>
          <input
            required
            type="time"
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white cursor-pointer"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
        </div>
        <div className="group">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Table Number (Optional)</label>
          <input
            type="text"
            placeholder="e.g. T-12"
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white"
            value={formData.table_number}
            onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
          />
        </div>
        
        <div className="md:col-span-2 pt-12">
          <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Special Notes</label>
          <textarea
            placeholder="Any special requests or dietary requirements?"
            className="w-full bg-transparent border-b-2 border-stone-100 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-xl text-stone-900 dark:text-white resize-none"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            rows={2}
          />
        </div>

        <div className="md:col-span-2 pt-6">
          <p className="text-stone-400 text-[10px] uppercase tracking-[0.2em] italic">
            * Note: Reservations are subject to availability. We will confirm your booking via email.
          </p>
        </div>
        <div className="md:col-span-2 pt-12">
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-8 rounded-[2rem] font-bold text-xs uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-2xl disabled:opacity-50 group"
          >
            {isSubmitting ? 'Securing your table...' : 'Confirm Reservation'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReservationForm;
