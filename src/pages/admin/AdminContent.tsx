import React, { useState, useEffect } from 'react';
import { Save, Globe, Layout, Type, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const AdminContent = () => {
  const [content, setContent] = useState({
    hero: {
      title: 'Experience the Essence of Indian Fine Dining',
      subtitle: 'A symphony of spices, tradition, and modern elegance.',
      cta: 'Reserve Your Table'
    },
    about: {
      title: 'Our Story',
      story: 'Saffron Spice was born from a passion for authentic Indian flavors and a desire to create a dining experience that transcends the ordinary. Our journey began in the heart of India, where we learned the secrets of traditional spices and the art of slow-cooking.',
      signature: 'Chef Rajesh Kumar'
    },
    contact: {
      address: '123 Gourmet Avenue, Food City, FC 56789',
      phone: '+91 98765 43210',
      email: 'hello@saffronspice.com'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Website Content</h1>
          <p className="text-stone-500 mt-2 text-sm">Manage the copy and visuals of your public website.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all flex items-center gap-2">
            <Globe className="w-4 h-4" />
            View Live Site
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-4 rounded-2xl bg-orange-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-3 disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSaving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>
      </div>

      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-sm font-bold"
        >
          <CheckCircle2 className="w-5 h-5" />
          Website content updated successfully!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section Editor */}
        <div className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-orange-600/10 text-orange-600">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Hero Section</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Main Headline</label>
              <textarea 
                className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all min-h-[100px] resize-none"
                value={content.hero.title}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Sub-headline</label>
              <input 
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                value={content.hero.subtitle}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">CTA Button Text</label>
              <input 
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                value={content.hero.cta}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, cta: e.target.value } })}
              />
            </div>
          </div>
        </div>

        {/* About Section Editor */}
        <div className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-600">
              <Type className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Our Story</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Section Title</label>
              <input 
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                value={content.about.title}
                onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Story Content</label>
              <textarea 
                className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all min-h-[150px] resize-none leading-relaxed"
                value={content.about.story}
                onChange={(e) => setContent({ ...content, about: { ...content.about, story: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Signature / Attribution</label>
              <input 
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all italic"
                value={content.about.signature}
                onChange={(e) => setContent({ ...content, about: { ...content.about, signature: e.target.value } })}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-emerald-600/10 text-emerald-600">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Contact & Location</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Physical Address</label>
              <input 
                type="text"
                className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                value={content.contact.address}
                onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Phone Number</label>
                <input 
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                  value={content.contact.phone}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email"
                  className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                  value={content.contact.email}
                  onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Visual Assets */}
        <div className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 rounded-2xl bg-purple-600/10 text-purple-600">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white">Brand Assets</h3>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-stone-900/50 border border-stone-800 border-dashed flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Update Logo</h4>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest">SVG or PNG (Max 2MB)</p>
              <button className="mt-6 px-6 py-2 rounded-xl bg-stone-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-700 transition-all">
                Choose File
              </button>
            </div>
            <div className="p-6 rounded-3xl bg-stone-900/50 border border-stone-800 border-dashed flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-500 mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Hero Background</h4>
              <p className="text-[10px] text-stone-500 uppercase tracking-widest">High-res Image or Video</p>
              <button className="mt-6 px-6 py-2 rounded-xl bg-stone-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-700 transition-all">
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContent;
