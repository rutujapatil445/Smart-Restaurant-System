import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, getCurrentUser, logoutUser } from '../lib/authService';

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAdmin(currentUser?.role === 'admin');
    } catch (e) {
      console.error("Auth check failed", e);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    
    const handleAuthStateChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-state-change', handleAuthStateChange);
    return () => {
      window.removeEventListener('auth-state-change', handleAuthStateChange);
    };
  }, []);

  const signOut = async () => {
    await logoutUser();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
