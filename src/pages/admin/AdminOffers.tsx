import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, Tag } from 'lucide-react';
import { Offer } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newOffer, setNewOffer] = useState<Partial<Offer>>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchOffers = async () => {
    const res = await fetch('/api/offers');
    const data = await res.json();
    setOffers(data);
  };

  useEffect(() => { fetchOffers(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOffer)
    });
    setIsAdding(false);
    setNewOffer({});
    fetchOffers();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/offers/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    fetchOffers();
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-stone-200 dark:border-stone-800 pb-12">
        <div>
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">Promotions</span>
          <h1 className="text-5xl font-serif font-bold text-stone-900 dark:text-white">Special Offers</h1>
          <p className="text-stone-400 mt-4 text-xs font-bold uppercase tracking-[0.2em]">Create and manage promotional offers and coupons.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl flex items-center gap-4"
        >
          <Plus className="w-5 h-5" />
          Create Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <AnimatePresence mode="popLayout">
          {offers.map((offer) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={offer.id}
              className="bg-white dark:bg-stone-900 p-10 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col group relative overflow-hidden hover:shadow-2xl transition-all duration-700"
            >
              <div className="absolute top-6 right-6">
                <button 
                  onClick={() => setConfirmDelete(offer.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-stone-300 hover:bg-rose-50 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white group-hover:text-orange-600 transition-colors">{offer.title}</h3>
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-8 flex-1 leading-relaxed">{offer.description}</p>
              <div className="flex items-center justify-between pt-8 border-t border-stone-50 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-orange-600" />
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{offer.code}</span>
                </div>
                <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Expires: {offer.expiry_date}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-stone-950/40 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-[3rem] p-12 w-full max-w-xl shadow-2xl border border-stone-100 dark:border-stone-800"
            >
              <div className="mb-10">
                <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">New Promotion</span>
                <h3 className="text-4xl font-serif font-bold text-stone-900 dark:text-white">Create Offer</h3>
              </div>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Title</label>
                  <input 
                    required 
                    className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all" 
                    value={newOffer.title || ''} 
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Description</label>
                  <textarea 
                    rows={2} 
                    className="w-full px-8 py-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none resize-none text-sm font-medium transition-all leading-relaxed" 
                    value={newOffer.description || ''} 
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Promo Code</label>
                    <input 
                      required 
                      className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none uppercase text-sm font-bold tracking-widest" 
                      value={newOffer.code || ''} 
                      onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Expiry Date</label>
                    <input 
                      type="date" 
                      className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all" 
                      value={newOffer.expiry_date || ''} 
                      onChange={(e) => setNewOffer({ ...newOffer, expiry_date: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-8">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)} 
                    className="flex-1 px-8 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-8 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl"
                  >
                    Create Offer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete Offer?"
        message="Are you sure you want to remove this promotional offer?"
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminOffers;
