import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Save, 
  Palette, 
  Globe, 
  Clock, 
  MapPin, 
  Phone, 
  Mail,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminSettings = () => {
  const { settings, refreshSettings } = useAppContext();
  const { showNotification } = useNotifications();
  const [formData, setFormData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'hours' | 'seo'>('general');

  useEffect(() => {
    if (settings) {
      setFormData({
        ...settings,
        opening_hours: JSON.parse(settings.opening_hours || '{}')
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        opening_hours: JSON.stringify(formData.opening_hours)
      };
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await refreshSettings();
      showNotification('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save settings', error);
      showNotification('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) return null;

  const tabs = [
    { id: 'general', name: 'General Info', icon: Globe },
    { id: 'design', name: 'Design & Branding', icon: Palette },
    { id: 'hours', name: 'Opening Hours', icon: Clock },
    { id: 'seo', name: 'SEO & Meta', icon: Type },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b border-stone-200 dark:border-stone-800 pb-12">
        <div>
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">Configuration</span>
          <h1 className="text-5xl font-serif font-bold text-stone-900 dark:text-white">Settings</h1>
          <p className="text-stone-400 mt-4 text-xs font-bold uppercase tracking-[0.2em]">Customize your restaurant's digital presence.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-xl flex items-center gap-4 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Tabs Sidebar */}
        <div className="lg:w-72 shrink-0">
          <div className="bg-white dark:bg-stone-900 rounded-[2.5rem] border border-stone-100 dark:border-stone-800 p-3 space-y-2 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 ${
                  activeTab === tab.id 
                    ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-xl' 
                    : 'text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-950'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-stone-900 rounded-[3rem] border border-stone-100 dark:border-stone-800 p-12 shadow-sm">
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Restaurant Name</label>
                    <input 
                      type="text" 
                      className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                      value={formData.restaurant_name}
                      onChange={(e) => setFormData({ ...formData, restaurant_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Cuisine Type</label>
                    <input 
                      type="text" 
                      className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                      value={formData.restaurant_type}
                      onChange={(e) => setFormData({ ...formData, restaurant_type: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Tagline</label>
                  <input 
                    type="text" 
                    className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-stone-100 dark:border-stone-800">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4 flex items-center gap-2">
                      <Phone className="w-3 h-3 text-orange-600" /> Phone
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4 flex items-center gap-2">
                      <Mail className="w-3 h-3 text-orange-600" /> Email
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-orange-600" /> Address
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'design' && (
              <motion.div
                key="design"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-white">Brand Palette</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Primary Color</span>
                        <input 
                          type="color" 
                          className="w-12 h-12 rounded-full cursor-pointer border-4 border-white dark:border-stone-800 shadow-xl overflow-hidden"
                          value={formData.primary_color}
                          onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center justify-between p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Secondary Color</span>
                        <input 
                          type="color" 
                          className="w-12 h-12 rounded-full cursor-pointer border-4 border-white dark:border-stone-800 shadow-xl overflow-hidden"
                          value={formData.secondary_color}
                          onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-xl font-serif font-bold text-stone-900 dark:text-white">Typography</h4>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">Font Family</label>
                      <select 
                        className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-[10px] font-bold uppercase tracking-widest transition-all"
                        value={formData.font_family}
                        onChange={(e) => setFormData({ ...formData, font_family: e.target.value })}
                      >
                        <option value="Inter">Inter (Modern Sans)</option>
                        <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                        <option value="Montserrat">Montserrat (Geometric Sans)</option>
                        <option value="Cormorant Garamond">Cormorant Garamond (Luxury Serif)</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="p-12 bg-stone-50 dark:bg-stone-950 rounded-[3rem] border border-dashed border-stone-200 dark:border-stone-800">
                  <h4 className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.4em] mb-10 text-center">Live Preview</h4>
                  <div className="flex flex-col items-center gap-8">
                    <button 
                      style={{ backgroundColor: formData.primary_color }}
                      className="px-12 py-4 rounded-full text-white text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:scale-105 transition-transform"
                    >
                      Primary Action
                    </button>
                    <p style={{ fontFamily: formData.font_family }} className="text-4xl font-serif font-bold text-stone-900 dark:text-white text-center leading-tight">
                      The art of <span className="italic text-orange-600">gastronomy</span> is a journey of the senses.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'hours' && (
              <motion.div
                key="hours"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {Object.keys(formData.opening_hours).map((day) => (
                  <div key={day} className="flex items-center gap-8 p-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950 transition-all duration-500">
                    <span className="w-32 text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400">{day}</span>
                    <input 
                      type="text" 
                      className="flex-1 px-8 py-3 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                      value={formData.opening_hours[day]}
                      onChange={(e) => setFormData({
                        ...formData,
                        opening_hours: { ...formData.opening_hours, [day]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'seo' && (
              <motion.div
                key="seo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-10"
              >
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">SEO Title</label>
                  <input 
                    type="text" 
                    className="w-full px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none text-sm font-medium transition-all"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  />
                  <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest ml-4">Recommended: 50-60 characters</p>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.4em] ml-4">SEO Description</label>
                  <textarea 
                    rows={4}
                    className="w-full px-8 py-6 rounded-[2rem] border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:border-orange-600 outline-none resize-none text-sm font-medium transition-all leading-relaxed"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  />
                  <p className="text-[8px] font-bold text-stone-300 uppercase tracking-widest ml-4">Recommended: 150-160 characters</p>
                </div>
                
                <div className="p-10 bg-stone-900 rounded-[3rem] border border-stone-800 shadow-2xl">
                  <h4 className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.4em] mb-6">Search Engine Preview</h4>
                  <div className="space-y-2">
                    <p className="text-blue-400 text-xl font-serif font-bold hover:underline cursor-pointer truncate">{formData.seo_title}</p>
                    <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest truncate">https://{formData.restaurant_name.toLowerCase().replace(/\s+/g, '')}.com</p>
                    <p className="text-stone-400 text-xs leading-relaxed line-clamp-2">{formData.seo_description}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
