import React from 'react';
import ReservationForm from '../components/ReservationForm';
import { motion } from 'motion/react';

const ReservePage = () => {
  return (
    <div className="pt-40 pb-32 bg-stone-50 dark:bg-stone-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="text-center mb-24">
            <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-8 block">Reservations</span>
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-stone-900 dark:text-white mb-8 leading-none">
              Secure Your <span className="italic text-orange-600">Table</span>
            </h1>
            <p className="text-xs text-stone-400 max-w-lg mx-auto font-bold uppercase tracking-[0.4em] leading-loose">
              Join us for an evening of culinary excellence and refined hospitality.
            </p>
          </div>
          <ReservationForm />
        </motion.div>
      </div>
    </div>
  );
};

export default ReservePage;
