import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut, 
  LayoutDashboard,
  UtensilsCrossed,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAppContext } from '../context/AppContext';

interface NewNavbarProps {
  onCartClick?: () => void;
}

const NewNavbar: React.FC<NewNavbarProps> = ({ onCartClick }) => {
  const { user, isAdmin, signOut } = useAuth();
  const { cart } = useCart();
  const { settings } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Active section detection
      const sections = ['home', 'menu', 'reservations', 'loyalty', 'story'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Menu', href: 'menu', isHash: true },
    { name: 'Reservations', href: 'reservations', isHash: true },
    { name: 'AI Studio', href: '/ai-tools', isHash: false, icon: <Sparkles className="w-3 h-3" /> },
    { name: 'Loyalty', href: 'loyalty', isHash: true },
    { name: 'Our Story', href: 'story', isHash: true },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, isHash: boolean) => {
    if (!isHash) return;
    
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate(`/#${href}`);
      return;
    }

    const element = document.getElementById(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled 
          ? 'py-4 bg-white/90 dark:bg-stone-950/90 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/50 shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
              scrolled ? 'bg-orange-600 shadow-lg shadow-orange-600/20' : 'bg-white/10 backdrop-blur-md border border-white/20'
            } group-hover:scale-110 group-hover:rotate-3`}>
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-serif font-bold tracking-tight leading-none transition-colors duration-500 ${
                scrolled ? 'text-stone-900 dark:text-white' : 'text-white'
              }`}>
                {settings?.restaurant_name || 'Saffron Spice'}
              </span>
              <span className={`text-[8px] uppercase tracking-[0.3em] font-bold mt-1 transition-colors duration-500 ${
                scrolled ? 'text-orange-600' : 'text-orange-400'
              }`}>
                Authentic Indian
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.name}
                  href={`#${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href, true)}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 group ${
                    scrolled ? 'text-stone-600 dark:text-stone-400' : 'text-white/80'
                  } hover:text-orange-600 dark:hover:text-orange-500`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon}
                    {link.name}
                  </span>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform origin-left transition-transform duration-300 ${
                    activeSection === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 group ${
                    scrolled ? 'text-stone-600 dark:text-stone-400' : 'text-white/80'
                  } hover:text-orange-600 dark:hover:text-orange-500`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon}
                    {link.name}
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
                </Link>
              )
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <button 
              onClick={onCartClick}
              className={`relative p-2 rounded-full transition-all ${
              scrolled ? 'hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-900 dark:text-white' : 'hover:bg-white/10 text-white'
            }`}>
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-1 rounded-full transition-all ${
                    scrolled ? 'bg-stone-100 dark:bg-stone-900' : 'bg-white/10 backdrop-blur-md'
                  } hover:ring-2 hover:ring-orange-600/50`}
                >
                  <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
                    {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-white dark:bg-stone-950 rounded-2xl shadow-2xl border border-stone-200/50 dark:border-stone-800/50 py-3 z-[110] overflow-hidden"
                    >
                      <div className="px-5 py-3 border-b border-stone-100 dark:border-stone-900 mb-2">
                        <p className="text-sm font-bold text-stone-900 dark:text-white truncate">{user.displayName || 'Guest User'}</p>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate uppercase tracking-widest mt-0.5">{user.email}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 hover:text-orange-600 dark:hover:text-orange-500 hover:bg-stone-50 dark:hover:bg-stone-900 transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      )}

                      <button 
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold uppercase tracking-widest text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-2.5 rounded-full transition-all ${
                  scrolled 
                    ? 'bg-stone-900 text-white hover:bg-orange-600' 
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-stone-900'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-full transition-all ${
                scrolled ? 'text-stone-900 dark:text-white' : 'text-white'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 space-y-2">
              {navLinks.map((link) => (
                link.isHash ? (
                  <a
                    key={link.name}
                    href={`#${link.href}`}
                    onClick={(e) => handleNavClick(e, link.href, true)}
                    className={`block px-4 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all ${
                      activeSection === link.href 
                        ? 'text-orange-600 bg-orange-50 dark:bg-orange-950/50' 
                        : 'text-stone-600 dark:text-stone-400 hover:text-orange-600 hover:bg-stone-50 dark:hover:bg-stone-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon}
                      {link.name}
                    </span>
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl transition-all text-stone-600 dark:text-stone-400 hover:text-orange-600 hover:bg-stone-50 dark:hover:bg-stone-900"
                  >
                    <span className="flex items-center gap-2">
                      {link.icon}
                      {link.name}
                    </span>
                  </Link>
                )
              ))}
              
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-orange-600 text-white px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] mt-6"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NewNavbar;
