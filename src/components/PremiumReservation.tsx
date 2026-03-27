import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PremiumReservation = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    date: '',
    time: '',
    guests: 2
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <section id="reserve" className="py-32 bg-stone-950">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-dark p-16 rounded-[4rem] text-center border-orange-600/20"
          >
            <div className="w-24 h-24 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12 text-orange-600" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-white mb-6">Reservation Confirmed</h2>
            <p className="text-stone-400 mb-12 text-lg font-light italic font-serif">
              Thank you, {formData.name}. We've reserved a table for {formData.guests} on {formData.date} at {formData.time}. A confirmation has been sent to your email.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="px-12 py-5 bg-orange-600 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-orange-700 transition-all"
            >
              Make Another Booking
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="reserve" className="py-32 bg-stone-950 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ea580c10,transparent_70%)] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Reservations</span>
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 font-serif leading-none">
              Secure Your <br />
              <span className="italic text-orange-600">Private Table</span>
            </h2>
            <p className="text-stone-400 text-lg mb-12 font-light leading-relaxed">
              Experience the pinnacle of Indian fine dining. For parties larger than 12, please contact our events team directly.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h5 className="text-white font-bold font-serif">Lunch Service</h5>
                  <p className="text-stone-500 text-sm">12:00 PM — 3:30 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h5 className="text-white font-bold font-serif">Dinner Service</h5>
                  <p className="text-stone-500 text-sm">7:00 PM — 11:30 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-dark p-12 md:p-16 rounded-[4rem] border-white/5 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-white outline-none focus:border-orange-600 transition-all font-serif italic"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-white outline-none focus:border-orange-600 transition-all font-serif italic"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Date</label>
                  <div className="relative">
                    <input
                      required
                      type="date"
                      className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-white outline-none focus:border-orange-600 transition-all font-serif italic cursor-pointer"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Time</label>
                  <input
                    required
                    type="time"
                    className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-white outline-none focus:border-orange-600 transition-all font-serif italic cursor-pointer"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">Guests</label>
                  <select
                    className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-white outline-none focus:border-orange-600 transition-all font-serif italic cursor-pointer appearance-none"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(n => (
                      <option key={n} value={n} className="bg-stone-900">{n} Guests</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-8">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-orange-600 text-white py-6 rounded-2xl font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-orange-700 transition-all duration-500 shadow-2xl shadow-orange-600/20 disabled:opacity-50 group flex items-center justify-center gap-4"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
                  <Send className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PremiumReservation;
