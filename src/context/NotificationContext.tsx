import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  clearNotification: (id: string) => void;
  showNotification: (message: string, type?: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user, isAdmin } = useAuth();

  const showNotification = (message: string, type: string = 'info') => {
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-clear after 5 seconds
    setTimeout(() => {
      clearNotification(newNotification.id);
    }, 5000);
  };

  useEffect(() => {
    if (!isAdmin) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'NEW_RESERVATION') {
          showNotification(`New reservation from ${payload.data.name} for ${payload.data.date} at ${payload.data.time} (${payload.data.guests} guests)`, 'reservation');
        }
      } catch (err) {
        console.error('Failed to parse notification', err);
      }
    };

    return () => socket.close();
  }, [isAdmin]);

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotification, showNotification }}>
      {children}
      <NotificationOverlay notifications={notifications} clearNotification={clearNotification} />
    </NotificationContext.Provider>
  );
};

const NotificationOverlay: React.FC<{ notifications: Notification[], clearNotification: (id: string) => void }> = ({ notifications, clearNotification }) => {
  return (
    <div className="fixed top-6 right-6 z-[9999] pointer-events-none space-y-4 max-w-sm w-full">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="pointer-events-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-100 dark:border-stone-800 p-6 flex gap-4 items-start"
          >
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-900 dark:text-white mb-1">New Notification</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">{n.message}</p>
              <p className="text-[10px] text-stone-300 mt-2 uppercase tracking-widest font-bold">
                {n.timestamp.toLocaleTimeString()}
              </p>
            </div>
            <button 
              onClick={() => clearNotification(n.id)}
              className="text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
