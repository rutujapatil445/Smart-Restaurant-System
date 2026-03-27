import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, UtensilsCrossed, ShoppingCart, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Navbar = () => {
  const { settings, darkMode, toggleDarkMode } = useAppContext();
  const { totalItems } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Active section observer
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = ['home', 'menu', 'about', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: 'home', isHash: true },
    { name: 'Menu', href: 'menu', isHash: true },
    { name: 'Gallery', href: '/gallery', isHash: false },
    { name: 'About', href: 'about', isHash: true },
    { name: 'Contact', href: 'contact', isHash: true },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (!link.isHash) {
      setIsOpen(false);
      return;
    }
    
    e.preventDefault();
    
    if (location.pathname !== '/') {
      navigate(`/#${link.href}`);
      setIsOpen(false);
      return;
    }

    const element = document.getElementById(link.href);
    if (element) {
      const offset = navRef.current?.offsetHeight || 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Update hash in URL without jumping
      window.history.pushState(null, '', `#${link.href}`);
    }
    setIsOpen(false);
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`relative h-12 w-12 flex items-center justify-center rounded-2xl overflow-hidden transition-all duration-500 ${
              scrolled ? 'bg-orange-50' : 'bg-white/10 backdrop-blur-sm'
            } group-hover:scale-110 group-hover:rotate-3 shadow-inner`}>
              <UtensilsCrossed className={`h-6 w-6 ${scrolled ? 'text-orange-600' : 'text-white'}`} />
            </div>
            <span className={`text-2xl font-serif font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-stone-900 dark:text-white' : 'text-white'
            }`}>
              {settings?.restaurant_name || 'Saffron Spice'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.isHash ? (
                <a
                  key={link.name}
                  href={`#${link.href}`}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 group ${
                    scrolled ? 'text-stone-700 dark:text-stone-200' : 'text-white'
                  } ${activeSection === link.href ? 'text-orange-600' : ''}`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform origin-left transition-transform duration-300 ${
                    activeSection === link.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </a>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative py-2 group ${
                    scrolled ? 'text-stone-700 dark:text-stone-200' : 'text-white'
                  }`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
                </Link>
              )
            ))}
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                scrolled ? 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to="/checkout" className="relative group">
              <ShoppingCart className={`h-6 w-6 transition-colors ${scrolled ? 'text-stone-700 dark:text-stone-200' : 'text-white'} group-hover:text-orange-600`} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-1.5 rounded-full transition-all ${
                    scrolled ? 'bg-stone-100 dark:bg-stone-800' : 'bg-white/10 backdrop-blur-sm'
                  } hover:ring-2 hover:ring-orange-600/50`}
                >
                  <div className="h-8 w-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                  </div>
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-800 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-stone-100 dark:border-stone-800">
                        <p className="text-sm font-bold text-stone-900 dark:text-white truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                      </div>
                      
                      {isAdmin && (
                        <Link 
                          to="/admin" 
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                        >
                          <LayoutDashboard className="h-4 w-4 text-orange-600" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button 
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${
                  scrolled ? 'text-stone-700 dark:text-stone-200 hover:text-orange-600' : 'text-white hover:text-orange-400'
                }`}
              >
                Sign In
              </Link>
            )}

            <Link
              to="/reserve"
              className="bg-orange-600 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-orange-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Book a Table
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                scrolled ? 'text-stone-900 dark:text-white' : 'text-white'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Link to="/checkout" className="relative">
              <ShoppingCart className={`h-6 w-6 ${scrolled ? 'text-stone-900 dark:text-white' : 'text-white'}`} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${scrolled ? 'text-stone-900' : 'text-white'} p-2`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                link.isHash ? (
                  <a
                    key={link.name}
                    href={`#${link.href}`}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`block px-3 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-colors ${
                      activeSection === link.href 
                        ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' 
                        : 'text-stone-700 dark:text-stone-200 hover:text-orange-600 hover:bg-stone-50 dark:hover:bg-stone-800'
                    }`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg transition-colors text-stone-700 dark:text-stone-200 hover:text-orange-600 hover:bg-stone-50 dark:hover:bg-stone-800"
                  >
                    {link.name}
                  </Link>
                )
              ))}
              <Link
                to="/reserve"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-orange-600 text-white px-6 py-4 rounded-lg text-xs font-bold uppercase tracking-[0.2em] mt-4"
              >
                Book a Table
              </Link>

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-4 border-t border-stone-100 dark:border-stone-800 mt-4">
                    <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900 dark:text-white">{user.displayName || 'User'}</p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white px-6 py-4 rounded-lg text-xs font-bold uppercase tracking-[0.2em] mt-2"
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

export default Navbar;
