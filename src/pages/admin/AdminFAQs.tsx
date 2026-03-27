import React, { useState, useEffect } from 'react';
import { Plus, Trash2, HelpCircle, Search } from 'lucide-react';
import { FAQ } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newFaq, setNewFaq] = useState<Partial<FAQ>>({});
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchFaqs = async () => {
    const res = await fetch('/api/faqs');
    const data = await res.json();
    setFaqs(data);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFaq)
    });
    setIsAdding(false);
    setNewFaq({});
    fetchFaqs();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    fetchFaqs();
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-stone-200 dark:border-stone-800 pb-12">
        <div>
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">Support</span>
          <h1 className="text-5xl font-serif font-bold text-stone-900 dark:text-white">FAQ Manager</h1>
          <p className="text-stone-400 mt-4 text-xs font-bold uppercase tracking-[0.2em]">Manage frequently asked questions for your guests.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl flex items-center gap-4"
        >
          <Plus className="w-5 h-5" />
          Add FAQ
        </button>
      </div>

      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {faqs.map((faq) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={faq.id}
              className="bg-white dark:bg-stone-900 p-10 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 shadow-sm flex justify-between items-start group hover:shadow-xl transition-all duration-700"
            >
              <div className="flex-1 pr-12">
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mb-4 flex items-center gap-4 group-hover:text-orange-600 transition-colors">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                  {faq.question}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed">{faq.answer}</p>
              </div>
              <button 
                onClick={() => setConfirmDelete(faq.id)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-stone-300 hover:bg-rose-50 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all duration-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">New Entry</span>
                <h3 className="text-4xl font-serif font-bold text-stone-900 dark:text-white">Add FAQ</h3>
              </div>
              
              <form onSubmit={handleSave} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Question</label>
                  <input 
                    required 
                    className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all" 
                    value={newFaq.question || ''} 
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Answer</label>
                  <textarea 
                    required 
                    rows={4} 
                    className="w-full px-8 py-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none resize-none text-sm font-medium transition-all leading-relaxed" 
                    value={newFaq.answer || ''} 
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} 
                  />
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
                    Save FAQ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete FAQ?"
        message="Are you sure you want to remove this question from your FAQ list?"
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminFAQs;
