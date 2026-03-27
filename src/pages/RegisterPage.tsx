import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../lib/authService';
import { UserPlus, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    setError(null);
    
    try {
      await registerUser(name, email, password);
      if (email.toLowerCase() === 'adminsaffronspice@gmail.com') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-500/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-stone-500/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full max-w-xl bg-white dark:bg-stone-900 p-12 md:p-20 rounded-[4rem] shadow-2xl relative z-10 border border-stone-100 dark:border-stone-800"
      >
        <div className="text-center mb-16">
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-8 block">Join Us</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 dark:text-white mb-8 leading-none">
            Create <span className="italic text-orange-600">Account</span>
          </h1>
          <p className="text-xs text-stone-400 font-bold uppercase tracking-[0.4em]">Begin your culinary journey with us.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-12 p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl flex items-start gap-4 text-rose-500 text-xs font-bold uppercase tracking-widest"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="leading-relaxed">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-600 transition-colors" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-full py-6 pl-16 pr-8 text-stone-900 dark:text-white focus:outline-none focus:border-orange-600/50 transition-all duration-500 text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-600 transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-full py-6 pl-16 pr-8 text-stone-900 dark:text-white focus:outline-none focus:border-orange-600/50 transition-all duration-500 text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-full py-6 pl-16 pr-8 text-stone-900 dark:text-white focus:outline-none focus:border-orange-600/50 transition-all duration-500 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-1">Confirm</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 rounded-full py-6 pl-16 pr-8 text-stone-900 dark:text-white focus:outline-none focus:border-orange-600/50 transition-all duration-500 text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-[10px] uppercase tracking-[0.4em] py-6 rounded-full transition-all duration-700 flex items-center justify-center gap-4 group hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white shadow-xl"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white dark:border-stone-900/20 dark:border-t-stone-900 rounded-full animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-stone-400 mt-12 text-[10px] font-bold uppercase tracking-[0.2em]">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
