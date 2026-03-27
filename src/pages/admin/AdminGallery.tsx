import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Image as ImageIcon, Search, Upload, Edit3 } from 'lucide-react';
import { GalleryItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';
import ImageEditor from '../../components/admin/ImageEditor';

const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({ image_url: '', caption: '', category: 'Interior' });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Interior', 'Food', 'Events', 'Staff'];

  const fetchGallery = async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEditingImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditExisting = (item: GalleryItem) => {
    setNewItem({ image_url: item.image_url, caption: item.caption || '', category: item.category || 'Interior' });
    setEditingImage(item.image_url);
    setIsAdding(true);
  };

  const handleEditorSave = async (editedImageUrl: string) => {
    // If it's a blob URL, we need to upload it to the server
    if (editedImageUrl.startsWith('blob:')) {
      const response = await fetch(editedImageUrl);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('image', blob, 'edited-image.jpg');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      setNewItem({ ...newItem, image_url: uploadData.imageUrl });
    } else {
      setNewItem({ ...newItem, image_url: editedImageUrl });
    }
    setEditingImage(null);
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    setIsAdding(false);
    setNewItem({ image_url: '', caption: '', category: 'Interior' });
    fetchGallery();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    fetchGallery();
  };

  const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Gallery Manager</h1>
          <p className="text-stone-500 mt-2 text-sm">Curate the visual story of Saffron Spice.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 rounded-2xl bg-orange-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Add New Image
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0F0F0F] p-4 rounded-3xl border border-stone-800/50">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === cat 
                  ? 'bg-stone-800 text-white' 
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
          <input 
            type="text" 
            placeholder="Search images..."
            className="bg-stone-900/50 border border-stone-800 text-white text-xs px-12 py-3 rounded-xl outline-none focus:border-orange-500/50 transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              key={item.id}
              className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-stone-900 border border-stone-800/50"
            >
              <img 
                src={item.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800'} 
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800';
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-2 block">
                    {item.category || 'Interior'}
                  </span>
                  <h4 className="text-lg font-serif font-bold text-white mb-4 line-clamp-2">
                    {item.caption || 'Untitled Showcase'}
                  </h4>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleEditExisting(item)}
                      className="flex-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button 
                      onClick={() => setConfirmDelete(item.id)}
                      className="p-3 bg-rose-500/20 backdrop-blur-md border border-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Image Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0F0F0F] border border-stone-800 rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl"
            >
              <div className="mb-8 flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-serif font-bold text-white">
                    {editingImage ? 'Edit Image' : 'Add New Asset'}
                  </h3>
                  <p className="text-stone-500 text-sm mt-2">
                    {editingImage ? 'Refine your image before saving.' : 'Upload a high-quality image to your gallery.'}
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setIsAdding(false);
                    setEditingImage(null);
                  }}
                  className="p-2 text-stone-500 hover:text-white transition-colors"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              {editingImage ? (
                <ImageEditor 
                  imageUrl={editingImage}
                  onSave={handleEditorSave}
                  onCancel={() => setEditingImage(null)}
                />
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Image URL</label>
                        <input
                          type="text"
                          className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                          placeholder="https://images.unsplash.com/..."
                          value={newItem.image_url}
                          onChange={(e) => setNewItem({ ...newItem, image_url: e.target.value })}
                        />
                      </div>

                      <div className="relative group">
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileUpload}
                          className="hidden" 
                          accept="image/*"
                        />
                        <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-12 rounded-3xl border-2 border-dashed border-stone-800 group-hover:border-orange-500/50 transition-all flex flex-col items-center justify-center gap-4 bg-stone-900/30"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-stone-800 flex items-center justify-center text-stone-400 group-hover:text-orange-500 transition-colors">
                            <Upload className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Or Upload Local Image</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Category</label>
                        <select
                          className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all appearance-none"
                          value={newItem.category}
                          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        >
                          {categories.filter(c => c !== 'All').map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Caption</label>
                        <input
                          type="text"
                          className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                          placeholder="Atmospheric dining area..."
                          value={newItem.caption}
                          onChange={(e) => setNewItem({ ...newItem, caption: e.target.value })}
                        />
                      </div>

                      {newItem.image_url && (
                        <div className="pt-4">
                          <button 
                            type="button"
                            onClick={() => setEditingImage(newItem.image_url)}
                            className="w-full py-4 rounded-2xl bg-stone-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-700 transition-all flex items-center justify-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Selected Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button 
                      type="button" 
                      onClick={() => setIsAdding(false)} 
                      className="flex-1 px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-stone-500 hover:bg-stone-900 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={!newItem.image_url}
                      className="flex-1 px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Gallery
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete Image?"
        message="This action will permanently remove the image from your public gallery."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminGallery;
