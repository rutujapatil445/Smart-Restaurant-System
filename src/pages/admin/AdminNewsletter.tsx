import React, { useState, useEffect } from 'react';
import { Mail, Search, Download } from 'lucide-react';
import { NewsletterSub } from '../../types';
import { motion } from 'motion/react';

const AdminNewsletter = () => {
  const [subs, setSubs] = useState<NewsletterSub[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubs = async () => {
    const res = await fetch('/api/newsletter');
    const data = await res.json();
    setSubs(data);
  };

  useEffect(() => { fetchSubs(); }, []);

  const filteredSubs = subs.filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const exportCSV = () => {
    const csv = 'Email,Subscribed At\n' + subs.map(s => `${s.email},${s.created_at}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter_subscribers.csv';
    a.click();
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-stone-200 dark:border-stone-800 pb-12">
        <div>
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">Audience</span>
          <h1 className="text-5xl font-serif font-bold text-stone-900 dark:text-white">Newsletter Subscribers</h1>
          <p className="text-stone-400 mt-4 text-xs font-bold uppercase tracking-[0.2em]">View and manage your email marketing list.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl flex items-center gap-4"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-[3rem] border border-stone-100 dark:border-stone-800 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-stone-50 dark:border-stone-800">
          <div className="relative max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Search emails..."
              className="pl-14 pr-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none w-full text-sm font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 dark:bg-stone-950 text-stone-400 text-[10px] uppercase tracking-[0.4em]">
              <tr>
                <th className="px-10 py-6 font-bold">Email Address</th>
                <th className="px-10 py-6 font-bold">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-stone-50 dark:hover:bg-stone-950 transition-all duration-500 group">
                  <td className="px-10 py-6 flex items-center gap-6">
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-full group-hover:scale-110 transition-transform duration-500">
                      <Mail className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="font-serif font-bold text-stone-900 dark:text-white text-lg group-hover:text-orange-600 transition-colors">{sub.email}</span>
                  </td>
                  <td className="px-10 py-6 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    {new Date(sub.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSubs.length === 0 && (
          <div className="p-32 text-center text-stone-300 font-serif italic text-2xl">
            No subscribers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNewsletter;
