import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, MenuCategory, MenuItem } from '../types';

interface AppContextType {
  settings: Settings | null;
  menu: { categories: MenuCategory[]; items: MenuItem[] } | null;
  loading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
  refreshSettings: () => Promise<void>;
  refreshMenu: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [menu, setMenu] = useState<{ categories: MenuCategory[]; items: MenuItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    try {
      return saved ? JSON.parse(saved) : false;
    } catch (e) {
      console.error("Failed to parse darkMode", e);
      localStorage.removeItem('darkMode');
      return false;
    }
  });

  const toggleDarkMode = () => {
    setDarkMode((prev: boolean) => {
      const newValue = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newValue));
      return newValue;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const refreshMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error('Failed to fetch menu', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([refreshSettings(), refreshMenu()]);
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AppContext.Provider value={{ 
      settings, 
      menu, 
      loading, 
      darkMode, 
      toggleDarkMode, 
      refreshSettings, 
      refreshMenu 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
