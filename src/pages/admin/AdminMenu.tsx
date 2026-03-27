import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  GripVertical, 
  Image as ImageIcon,
  Check,
  X,
  Star,
  Sparkles,
  Upload,
  Loader2,
  Search,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuCategory, MenuItem } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useNotifications } from '../../context/NotificationContext';

import ConfirmDialog from '../../components/ConfirmDialog';

const SUGGESTED_IMAGES = [
  { name: 'Butter Chicken', url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800' },
  { name: 'Paneer Tikka', url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Biryani', url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800' },
  { name: 'Dal Makhani', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Gulab Jamun', url: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800' },
  { name: 'Masala Dosa', url: 'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&q=80&w=800' },
  { name: 'Chana Masala', url: 'https://images.unsplash.com/photo-1585937421612-70a0f2455f75?auto=format&fit=crop&q=80&w=800' },
  { name: 'Naan', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800' },
  { name: 'Samosa', url: 'https://images.unsplash.com/photo-1601050634127-601482a966cf?auto=format&fit=crop&q=80&w=800' },
  { name: 'Tandoori Chicken', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800' },
  { name: 'Palak Paneer', url: 'https://images.unsplash.com/photo-1603894584134-f1c2baee44f9?auto=format&fit=crop&q=80&w=800' },
  { name: 'Mango Lassi', url: 'https://images.unsplash.com/photo-1571006682881-79262bc837bc?auto=format&fit=crop&q=80&w=800' },
  { name: 'Chicken 65', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800' },
  { name: 'Lamb Rogan Josh', url: 'https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&q=80&w=800' },
  { name: 'Rasmalai', url: 'https://images.unsplash.com/photo-1630953899906-d16511a72558?auto=format&fit=crop&q=80&w=800' },
  { name: 'Masala Chai', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800' },
  { name: 'Onion Bhaji', url: 'https://images.unsplash.com/photo-1626132646529-500637532537?auto=format&fit=crop&q=80&w=800' },
  { name: 'Garlic Naan', url: 'https://images.unsplash.com/photo-1601050633647-81a35257769a?auto=format&fit=crop&q=80&w=800' }
];

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';

const AdminMenu = () => {
  const { menu, refreshMenu } = useAppContext();
  const { showNotification } = useNotifications();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  
  // Confirmation states
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'category' | 'item', id: number } | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    await fetch('/api/menu/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName, sort_order: menu?.categories.length || 0 })
    });
    setNewCategoryName('');
    setIsAddingCategory(false);
    refreshMenu();
    showNotification('Category added successfully!', 'success');
  };

  const handleDeleteCategory = async (id: number) => {
    await fetch(`/api/menu/categories/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    refreshMenu();
    showNotification('Category deleted successfully!', 'success');
  };

  const handleToggleAvailability = async (id: number, currentStatus: boolean) => {
    await fetch(`/api/menu/items/${id}/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: !currentStatus })
    });
    refreshMenu();
    showNotification(`Item marked as ${!currentStatus ? 'available' : 'unavailable'}`, 'success');
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const method = editingItem.id ? 'PUT' : 'POST';
    const url = editingItem.id ? `/api/menu/items/${editingItem.id}` : '/api/menu/items';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingItem)
    });

    setEditingItem(null);
    refreshMenu();
    showNotification('Item saved successfully!', 'success');
  };

  const handleDeleteItem = async (id: number) => {
    await fetch(`/api/menu/items/${id}`, { method: 'DELETE' });
    setConfirmDelete(null);
    refreshMenu();
    showNotification('Item deleted successfully!', 'success');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingItem) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setEditingItem({ ...editingItem, image_url: data.imageUrl });
      showNotification('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showNotification('Failed to upload image. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-stone-200 dark:border-stone-800 pb-12">
        <div>
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">Curation</span>
          <h1 className="text-5xl font-serif font-bold text-stone-900 dark:text-white">Menu Manager</h1>
          <p className="text-stone-400 mt-4 text-xs font-bold uppercase tracking-[0.2em]">Refine your culinary offerings and presentation.</p>
        </div>
        <button 
          onClick={() => setIsAddingCategory(true)}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 flex items-center gap-3 shadow-xl"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="space-y-24">
        {menu?.categories.map((category) => (
          <div key={category.id} className="space-y-12">
            <div className="flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-full border border-stone-200 dark:border-stone-800 flex items-center justify-center text-stone-300 group-hover:text-orange-600 transition-colors">
                  <GripVertical className="w-5 h-5 cursor-move" />
                </div>
                <div>
                  <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">{category.name}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mt-1 block">
                    {menu.items.filter(i => i.category_id === category.id).length} Curated Items
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setEditingItem({ category_id: category.id, is_available: true, is_popular: false })}
                  className="text-stone-400 hover:text-orange-600 p-3 rounded-full border border-stone-100 dark:border-stone-800 hover:border-orange-600 transition-all flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
                <button 
                  onClick={() => setConfirmDelete({ type: 'category', id: category.id })}
                  className="text-stone-300 hover:text-red-500 p-3 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {menu.items.filter(i => i.category_id === category.id).map((item) => (
                <div key={item.id} className="group relative bg-white dark:bg-stone-900 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-2xl transition-all duration-700">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-6 bg-stone-100 dark:bg-stone-800">
                    <img 
                      src={item.image_url || PLACEHOLDER_IMAGE} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        console.error(`Failed to load image for item: ${item.name}`, item.image_url);
                        const target = e.target as HTMLImageElement;
                        target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <div className="absolute top-4 left-4 flex gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleAvailability(item.id, !!item.is_available);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
                          item.is_available 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                            : 'bg-stone-200 dark:bg-stone-800 text-stone-400 hover:bg-red-500 hover:text-white'
                        }`}
                        title={item.is_available ? 'Mark as Unavailable' : 'Mark as Available'}
                      >
                        {item.is_available ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {item.is_popular && (
                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                          <Star className="w-3 h-3 text-orange-600 fill-current" />
                        </div>
                      )}
                      {!item.is_available && (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                          Sold Out
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-white leading-tight">{item.name}</h4>
                      <span className="text-lg font-serif font-bold text-orange-600">₹{item.price.toFixed(0)}</span>
                    </div>
                    <p className="text-xs text-stone-400 font-light leading-relaxed line-clamp-2 italic">"{item.description}"</p>
                  </div>
                  
                  <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[2rem] flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <button 
                      onClick={() => setEditingItem(item)}
                      className="w-12 h-12 bg-white text-stone-900 rounded-full flex items-center justify-center hover:bg-orange-600 hover:text-white transition-all duration-500 shadow-2xl"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setConfirmDelete({ type: 'item', id: item.id })}
                      className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-500 shadow-2xl"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-stone-950/40 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-[3rem] p-12 w-full max-w-xl shadow-2xl border border-stone-100 dark:border-stone-800"
            >
              <div className="mb-10">
                <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">New Grouping</span>
                <h3 className="text-4xl font-serif font-bold text-stone-900 dark:text-white">Add Category</h3>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Category Name</label>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. Signature Entrées"
                    className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setIsAddingCategory(false)}
                    className="flex-1 px-8 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddCategory}
                    className="flex-1 px-8 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl"
                  >
                    Create Category
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Item Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-stone-950/40 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 rounded-[3rem] p-12 w-full max-w-2xl shadow-2xl border border-stone-100 dark:border-stone-800 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="mb-10">
                <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">
                  {editingItem.id ? 'Refinement' : 'Creation'}
                </span>
                <h3 className="text-4xl font-serif font-bold text-stone-900 dark:text-white">
                  {editingItem.id ? 'Edit Menu Item' : 'Add New Item'}
                </h3>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Item Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Description</label>
                  <textarea
                    rows={3}
                    className="w-full px-8 py-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none resize-none text-sm font-medium transition-all leading-relaxed"
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Base Price (₹)</label>
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                        <input
                          required
                          type="number"
                          step="0.01"
                          className="w-full pl-12 pr-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-bold"
                          value={editingItem.price || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                        />
                      </div>
                      <div className="flex gap-2">
                        {[99, 199, 299, 499].map(p => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setEditingItem({ ...editingItem, price: p })}
                            className="px-4 py-2 text-[10px] font-bold border border-stone-100 dark:border-stone-800 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-600 transition-all uppercase tracking-widest"
                          >
                            ₹{p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Variants Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">Variants</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const variants = JSON.parse(editingItem.variants || '[]');
                          variants.push({ name: '', price: 0 });
                          setEditingItem({ ...editingItem, variants: JSON.stringify(variants) });
                        }}
                        className="text-orange-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
                      >
                        + Add Variant
                      </button>
                    </div>
                    <div className="space-y-3">
                      {JSON.parse(editingItem.variants || '[]').map((v: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <input 
                            placeholder="Variant Name (e.g. Small)"
                            className="flex-1 px-6 py-3 text-sm rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 outline-none focus:border-orange-600 transition-all font-medium"
                            value={v.name}
                            onChange={(e) => {
                              const variants = JSON.parse(editingItem.variants || '[]');
                              variants[idx].name = e.target.value;
                              setEditingItem({ ...editingItem, variants: JSON.stringify(variants) });
                            }}
                          />
                          <div className="relative w-32">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs">₹</span>
                            <input 
                              type="number"
                              placeholder="Price"
                              className="w-full pl-8 pr-4 py-3 text-sm rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 outline-none focus:border-orange-600 transition-all font-bold"
                              value={v.price}
                              onChange={(e) => {
                                const variants = JSON.parse(editingItem.variants || '[]');
                                variants[idx].price = parseFloat(e.target.value);
                                setEditingItem({ ...editingItem, variants: JSON.stringify(variants) });
                              }}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const variants = JSON.parse(editingItem.variants || '[]');
                              variants.splice(idx, 1);
                              setEditingItem({ ...editingItem, variants: JSON.stringify(variants) });
                            }}
                            className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Options Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">Custom Options</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const options = JSON.parse(editingItem.options || '[]');
                          options.push({ name: '', price: 0 });
                          setEditingItem({ ...editingItem, options: JSON.stringify(options) });
                        }}
                        className="text-orange-600 text-[10px] font-bold uppercase tracking-widest hover:underline"
                      >
                        + Add Option
                      </button>
                    </div>
                    <div className="space-y-3">
                      {JSON.parse(editingItem.options || '[]').map((o: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <input 
                            placeholder="Option Name (e.g. Extra Spice)"
                            className="flex-1 px-6 py-3 text-sm rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 outline-none focus:border-orange-600 transition-all font-medium"
                            value={o.name}
                            onChange={(e) => {
                              const options = JSON.parse(editingItem.options || '[]');
                              options[idx].name = e.target.value;
                              setEditingItem({ ...editingItem, options: JSON.stringify(options) });
                            }}
                          />
                          <div className="relative w-32">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-xs">+₹</span>
                            <input 
                              type="number"
                              placeholder="Add"
                              className="w-full pl-10 pr-4 py-3 text-sm rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 outline-none focus:border-orange-600 transition-all font-bold"
                              value={o.price}
                              onChange={(e) => {
                                const options = JSON.parse(editingItem.options || '[]');
                                options[idx].price = parseFloat(e.target.value);
                                setEditingItem({ ...editingItem, options: JSON.stringify(options) });
                              }}
                            />
                          </div>
                          <button 
                            type="button"
                            onClick={() => {
                              const options = JSON.parse(editingItem.options || '[]');
                              options.splice(idx, 1);
                              setEditingItem({ ...editingItem, options: JSON.stringify(options) });
                            }}
                            className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center px-4">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em]">Visual Presentation</label>
                      <button 
                        type="button"
                        onClick={() => setShowGallery(!showGallery)}
                        className="text-orange-600 text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-2"
                      >
                        <ImageIcon className="w-4 h-4" />
                        {showGallery ? 'Close Gallery' : 'Browse Curated Gallery'}
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Curated Gallery */}
                      <AnimatePresence>
                        {showGallery && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-stone-50 dark:bg-stone-950 rounded-[2rem] p-8 border border-stone-100 dark:border-stone-800">
                              <div className="relative mb-6">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                                <input 
                                  type="text"
                                  placeholder="Search curated images..."
                                  className="w-full pl-14 pr-8 py-3 text-sm rounded-full border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 outline-none focus:border-orange-600 transition-all"
                                  value={gallerySearch}
                                  onChange={(e) => setGallerySearch(e.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-4 gap-4 max-h-64 overflow-y-auto pr-4 custom-scrollbar">
                                {SUGGESTED_IMAGES.filter(img => img.name.toLowerCase().includes(gallerySearch.toLowerCase())).map((img, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setEditingItem({ ...editingItem, image_url: img.url });
                                      setShowGallery(false);
                                    }}
                                    className="relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-orange-600 transition-all group"
                                  >
                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="text-[8px] text-white font-bold uppercase text-center px-2 tracking-widest">{img.name}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Image Preview */}
                      <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 group">
                        {editingItem.image_url ? (
                          <>
                            <img 
                              src={editingItem.image_url} 
                              alt="Preview" 
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                console.error(`Failed to load preview image: ${editingItem.image_url}`);
                                const target = e.target as HTMLImageElement;
                                target.src = PLACEHOLDER_IMAGE;
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => setEditingItem({ ...editingItem, image_url: '' })}
                              className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-stone-800 text-rose-500 rounded-full shadow-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-500"
                              title="Remove image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-stone-300">
                            <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em]">No Visual Selected</p>
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-md flex flex-col items-center justify-center text-white">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-orange-600" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Uploading Asset...</p>
                          </div>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex gap-4">
                        <label className={`flex-1 flex items-center justify-center gap-4 px-8 py-5 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 hover:border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all cursor-pointer group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <Upload className="w-5 h-5 text-stone-400 group-hover:text-orange-600 transition-colors" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 group-hover:text-orange-600 transition-colors">
                            {isUploading ? 'Uploading...' : 'Upload Asset'}
                          </span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            disabled={isUploading}
                            onChange={handleFileUpload}
                          />
                        </label>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Direct URL</label>
                        <input
                          type="text"
                          placeholder="Or paste image URL here..."
                          className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                          value={editingItem.image_url || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-10 pt-4 border-t border-stone-50 dark:border-stone-800">
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${editingItem.is_popular ? 'bg-orange-600 border-orange-600 shadow-lg shadow-orange-600/20' : 'border-stone-200 dark:border-stone-800 group-hover:border-orange-600'}`}>
                      {editingItem.is_popular && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={editingItem.is_popular || false}
                      onChange={(e) => setEditingItem({ ...editingItem, is_popular: e.target.checked })}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Signature Dish</span>
                  </label>
                  <label className="flex items-center gap-4 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${editingItem.is_available ? 'bg-orange-600 border-orange-600 shadow-lg shadow-orange-600/20' : 'border-stone-200 dark:border-stone-800 group-hover:border-orange-600'}`}>
                      {editingItem.is_available && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={editingItem.is_available || false}
                      onChange={(e) => setEditingItem({ ...editingItem, is_available: e.target.checked })}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">Available for Order</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-8">
                  <button 
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 px-8 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-8 py-5 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl"
                  >
                    Save Selection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title={confirmDelete?.type === 'category' ? 'Delete Category?' : 'Delete Item?'}
        message={confirmDelete?.type === 'category' 
          ? 'Are you sure you want to delete this category? All items inside will be permanently removed.' 
          : 'Are you sure you want to delete this menu item? This action cannot be undone.'}
        onConfirm={() => {
          if (confirmDelete?.type === 'category') handleDeleteCategory(confirmDelete.id);
          else if (confirmDelete?.type === 'item') handleDeleteItem(confirmDelete.id);
        }}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminMenu;
