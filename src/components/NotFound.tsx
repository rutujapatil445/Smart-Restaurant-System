import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home } from 'lucide-react';
import { motion } from 'motion/react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-md w-full bg-white rounded-[3rem] shadow-2xl p-16 text-center border border-stone-100 relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 blur-[80px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-orange-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 text-orange-600 shadow-inner">
            <Compass size={48} strokeWidth={1.5} />
          </div>
          
          <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Error 404</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6 italic leading-tight">
            Lost in the <span className="text-orange-600">Flavor</span>
          </h1>
          <p className="text-stone-500 font-light mb-12 leading-relaxed text-lg">
            The page you're looking for seems to have wandered off the menu. Let's get you back to something delicious.
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-orange-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20"
            >
              <Home size={18} />
              Return Home
            </Link>
            
            <button
              onClick={() => navigate(-1)}
              className="w-full py-5 bg-white text-stone-600 border border-stone-200 rounded-2xl font-bold text-xs uppercase tracking-[0.3em] hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
