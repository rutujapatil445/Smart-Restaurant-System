import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Package, Truck, ArrowRight, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="min-h-screen pt-40 pb-32 bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-stone-900 p-12 md:p-24 rounded-[4rem] shadow-2xl text-center max-w-4xl w-full relative overflow-hidden border border-stone-100 dark:border-stone-800"
      >
        <div className="mb-12">
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-8 block">Gratitude</span>
          <h2 className="text-6xl md:text-8xl font-serif font-bold text-stone-900 dark:text-white mb-8 leading-none">
            Order <span className="italic text-orange-600">Confirmed</span>
          </h2>
          <p className="text-stone-400 font-light tracking-[0.2em] uppercase text-xs">Your culinary journey has begun.</p>
        </div>

        <div className="bg-stone-50 dark:bg-stone-950 p-12 rounded-[3rem] mb-16 border border-stone-100 dark:border-stone-800">
          <p className="text-stone-400 text-sm font-bold uppercase tracking-[0.4em] mb-4">Reference Number</p>
          <p className="text-5xl font-serif font-bold text-stone-900 dark:text-white tracking-tighter">#{orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {[
            { label: 'Status', value: 'Preparing', icon: Package },
            { label: 'Estimate', value: '45 Mins', icon: Truck },
            { label: 'Method', value: 'COD', icon: CheckCircle2 }
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center mx-auto mb-6">
                <item.icon className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-2">{item.label}</p>
              <p className="text-lg font-serif font-bold text-stone-900 dark:text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => navigate('/')}
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-12 py-6 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl"
          >
            Back to Home
          </button>
          <button 
            onClick={() => navigate('/')}
            className="bg-transparent border-2 border-stone-100 dark:border-stone-800 text-stone-400 px-12 py-6 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:border-stone-900 dark:hover:border-white hover:text-stone-900 dark:hover:text-white transition-all duration-700"
          >
            Order More
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
