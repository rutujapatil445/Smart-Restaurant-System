import React, { useState } from 'react';
import { Plus, Search, Calendar, User, Tag, Edit2, Trash2, Eye, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminPosts = () => {
  const [posts, setPosts] = useState([
    { id: 1, title: 'The Art of Indian Spices', author: 'Chef Rajesh', date: '2024-03-10', category: 'Culinary', status: 'Published', views: 1240 },
    { id: 2, title: 'New Seasonal Menu Launch', author: 'Admin', date: '2024-03-05', category: 'News', status: 'Published', views: 850 },
    { id: 3, title: 'Behind the Scenes: Our Kitchen', author: 'Chef Rajesh', date: '2024-03-01', category: 'Story', status: 'Draft', views: 0 },
    { id: 4, title: 'Traditional Curry Recipes', author: 'Chef Rajesh', date: '2024-02-25', category: 'Recipes', status: 'Published', views: 2100 },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setPosts(posts.filter(p => p.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Blog & News</h1>
          <p className="text-stone-500 mt-2 text-sm">Create and manage articles for your audience.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 rounded-2xl bg-orange-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Create New Post
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0F0F0F] p-4 rounded-3xl border border-stone-800/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
          <input 
            type="text" 
            placeholder="Search posts by title..."
            className="w-full bg-stone-900/50 border border-stone-800 text-white text-xs px-12 py-3 rounded-xl outline-none focus:border-orange-500/50 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-stone-900 border border-stone-800 text-stone-400 text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl outline-none">
            <option>All Categories</option>
            <option>Culinary</option>
            <option>News</option>
            <option>Recipes</option>
          </select>
          <select className="bg-stone-900 border border-stone-800 text-stone-400 text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl outline-none">
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 gap-6">
        {posts.map((post, idx) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={post.id}
            className="group p-6 rounded-[2rem] bg-[#0F0F0F] border border-stone-800/50 hover:border-stone-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-600 group-hover:border-orange-500/50 transition-all overflow-hidden">
                <div className="text-2xl font-serif font-bold opacity-20">{post.title.charAt(0)}</div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    post.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {post.status}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-white group-hover:text-orange-500 transition-colors">{post.title}</h3>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                    <User className="w-3 h-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-500 font-bold uppercase tracking-widest">
                    <Eye className="w-3 h-3" />
                    {post.views} Views
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="px-6 py-3 rounded-xl bg-stone-900 border border-stone-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center gap-2">
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
              <button 
                onClick={() => setConfirmDelete(post.id)}
                className="p-3 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete Post?"
        message="This article will be permanently removed from your website."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminPosts;
