import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Utensils, 
  CalendarCheck, 
  Settings as SettingsIcon, 
  FileText, 
  LogOut,
  ChevronRight,
  Menu as MenuIcon,
  X,
  Image as ImageIcon,
  Users,
  TrendingUp,
  Mail,
  ShoppingBag,
  Search,
  Bell,
  BarChart3,
  Sparkles,
  Star,
  UserCheck
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { settings } = useAppContext();
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    menu: any[];
    orders: any[];
    reservations: any[];
  }>({ menu: [], orders: [], reservations: [] });
  const [isSearching, setIsSearching] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Menu', icon: Utensils, href: '/admin/menu' },
    { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { name: 'Reservations', icon: CalendarCheck, href: '/admin/reservations' },
    { name: 'Staff', icon: Users, href: '/admin/staff' },
    { name: 'Reviews', icon: Star, href: '/admin/reviews' },
    { name: 'Users', icon: UserCheck, href: '/admin/users' },
    { name: 'Gallery', icon: ImageIcon, href: '/admin/gallery' },
    { name: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { name: 'Newsletter', icon: Mail, href: '/admin/newsletter' },
    { name: 'Offers', icon: Sparkles, href: '/admin/offers' },
    { name: 'Content', icon: FileText, href: '/admin/content' },
    { name: 'AI Analysis', icon: Sparkles, href: '/ai-tools' },
    { name: 'Settings', icon: SettingsIcon, href: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ menu: [], orders: [], reservations: [] });
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (href: string) => {
    navigate(href);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-stone-300 font-sans selection:bg-orange-500/30">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full bg-[#0F0F0F] border-r border-stone-800/50 transition-all duration-500 z-50 ${
          isSidebarOpen ? 'w-72' : 'w-24'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-stone-800/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/20">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-serif font-bold text-xl text-white tracking-tight"
                >
                  Saffron<span className="text-orange-600">Spice</span>
                </motion.span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative ${
                      isActive 
                        ? 'bg-orange-600/10 text-orange-500' 
                        : 'hover:bg-stone-800/50 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-bold uppercase tracking-[0.2em]"
                      >
                        {item.name}
                      </motion.span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute left-0 w-1 h-6 bg-orange-600 rounded-r-full"
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Profile & Logout */}
          <div className="p-4 border-t border-stone-800/30 space-y-4">
            {isSidebarOpen && (
              <div className="flex items-center gap-3 px-2 py-3 rounded-2xl bg-stone-900/50 border border-stone-800/50">
                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
                  <Users className="w-5 h-5 text-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user?.name || 'Admin'}</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Manager</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={handleSignOut}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all duration-300 ${!isSidebarOpen ? 'w-full justify-center' : 'flex-1'}`}
              >
                <LogOut className="w-5 h-5" />
                {isSidebarOpen && <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>}
              </button>
              
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-all"
              >
                {isSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4 rotate-180" />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={`transition-all duration-500 pt-20 ${
          isSidebarOpen ? 'pl-72' : 'pl-24'
        }`}
      >
        {/* Header */}
        <header className="fixed top-0 right-0 h-20 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-stone-800/30 z-40 flex items-center justify-between px-8 transition-all duration-500"
          style={{ left: isSidebarOpen ? '18rem' : '6rem' }}
        >
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-stone-900/50 border border-stone-800/50 text-stone-500 hover:border-stone-700 transition-all group"
            >
              <Search className="w-4 h-4 group-hover:text-stone-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest pr-8">Search...</span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-stone-800 text-[10px] font-mono border border-stone-700">
                <span className="text-[8px]">⌘</span>
                <span>K</span>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2.5 rounded-full bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-[#0A0A0A]" />
            </button>
            <div className="h-8 w-[1px] bg-stone-800 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white">{settings?.restaurant_name || 'Saffron Spice'}</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-rose-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-12 lg:p-20 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-[#0A0A0A]/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-[#141414] rounded-2xl border border-stone-800 shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-stone-800 flex items-center gap-4">
                <Search className={`w-5 h-5 ${isSearching ? 'text-orange-500 animate-pulse' : 'text-stone-500'}`} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search for reservations, dishes, or orders..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-stone-600 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="px-2 py-1 rounded bg-stone-800 text-stone-50 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                  Esc
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {searchQuery.trim().length < 2 ? (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.2em] mb-3 px-2">Quick Access</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {menuItems.slice(0, 6).map(item => (
                          <button 
                            key={item.href} 
                            onClick={() => handleResultClick(item.href)}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-800/50 text-stone-300 transition-all text-left group border border-transparent hover:border-stone-700"
                          >
                            <item.icon className="w-4 h-4 text-stone-500 group-hover:text-orange-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Menu Items */}
                    {searchResults.menu.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em] mb-3 px-2">Menu Items</h4>
                        <div className="space-y-1">
                          {searchResults.menu.map(item => (
                            <button 
                              key={item.id} 
                              onClick={() => handleResultClick('/admin/menu')}
                              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-800/50 text-stone-300 transition-all text-left group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-800 shrink-0">
                                  <img 
                                    src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
                                    alt="" 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
                                    }}
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{item.name}</p>
                                  <p className="text-[10px] text-stone-500 uppercase tracking-widest">{item.category}</p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-orange-500">₹{item.price}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Orders */}
                    {searchResults.orders.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-3 px-2">Orders</h4>
                        <div className="space-y-1">
                          {searchResults.orders.map(order => (
                            <button 
                              key={order.id} 
                              onClick={() => handleResultClick('/admin/orders')}
                              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-800/50 text-stone-300 transition-all text-left group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0">
                                  <ShoppingBag className="w-5 h-5 text-stone-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{order.customer_name}</p>
                                  <p className="text-[10px] text-stone-500 uppercase tracking-widest">{order.customer_email}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-white">₹{order.total}</p>
                                <p className={`text-[8px] font-bold uppercase tracking-widest ${
                                  order.status === 'completed' ? 'text-emerald-500' : 'text-orange-500'
                                }`}>{order.status}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Reservations */}
                    {searchResults.reservations.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-3 px-2">Reservations</h4>
                        <div className="space-y-1">
                          {searchResults.reservations.map(res => (
                            <button 
                              key={res.id} 
                              onClick={() => handleResultClick('/admin/reservations')}
                              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-800/50 text-stone-300 transition-all text-left group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0">
                                  <CalendarCheck className="w-5 h-5 text-stone-500" />
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-white">{res.name}</p>
                                  <p className="text-[10px] text-stone-500 uppercase tracking-widest">{res.date} at {res.time}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs font-bold text-white">{res.guests} Guests</p>
                                <p className="text-[8px] font-bold uppercase tracking-widest text-blue-500">{res.status}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {searchResults.menu.length === 0 && searchResults.orders.length === 0 && searchResults.reservations.length === 0 && !isSearching && (
                      <div className="py-12 text-center">
                        <Search className="w-12 h-12 text-stone-800 mx-auto mb-4" />
                        <p className="text-stone-500 text-sm">No results found for "{searchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="p-3 bg-stone-900/50 border-t border-stone-800 flex items-center justify-between text-[8px] font-bold text-stone-500 uppercase tracking-[0.2em]">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded bg-stone-800 text-stone-300">↑↓</span> to navigate</span>
                  <span className="flex items-center gap-1"><span className="px-1 py-0.5 rounded bg-stone-800 text-stone-300">↵</span> to select</span>
                </div>
                <span>Search powered by SaffronSpice AI</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminLayout;
