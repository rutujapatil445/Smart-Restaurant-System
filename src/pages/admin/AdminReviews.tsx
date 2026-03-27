import React, { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare, Filter, Search, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminReviews = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setReviews(reviews.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === 'all' || 
      (filter === 'positive' && review.rating >= 4) ||
      (filter === 'negative' && review.rating <= 2);
    
    const matchesSearch = review.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Guest Reviews</h1>
          <p className="text-stone-500 mt-2 text-sm">Monitor and manage feedback from your diners.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3">
            <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            <span className="text-xl font-serif font-bold text-white">
              {(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1)}
            </span>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Avg Rating</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0F0F0F] p-4 rounded-3xl border border-stone-800/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
          <input 
            type="text" 
            placeholder="Search reviews by guest name or comment..."
            className="w-full bg-stone-900/50 border border-stone-800 text-white text-xs px-12 py-3 rounded-xl outline-none focus:border-orange-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            className="bg-stone-900 border border-stone-800 text-stone-400 text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Reviews</option>
            <option value="positive">Positive (4-5★)</option>
            <option value="negative">Negative (1-2★)</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              key={review.id}
              className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-lg font-serif font-bold text-stone-400">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{review.name}</h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < review.rating ? 'text-orange-500 fill-orange-500' : 'text-stone-800'}`} 
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <MessageSquare className="absolute -left-2 -top-2 w-8 h-8 text-stone-800/20 -z-10" />
                <p className="text-stone-400 text-sm leading-relaxed italic">"{review.comment}"</p>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-800/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-stone-600">Verified Visit</span>
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
                <button 
                  onClick={() => setConfirmDelete(review.id)}
                  className="p-2 hover:bg-rose-500/10 rounded-lg transition-all text-stone-600 hover:text-rose-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredReviews.length === 0 && !isLoading && (
        <div className="py-20 text-center bg-[#0F0F0F] rounded-[3rem] border border-stone-800/50">
          <MessageSquare className="w-16 h-16 text-stone-800 mx-auto mb-6" />
          <h3 className="text-xl font-serif font-bold text-white mb-2">No reviews found</h3>
          <p className="text-stone-500 text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete Review?"
        message="This action cannot be undone. The review will be permanently removed from your records."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminReviews;
