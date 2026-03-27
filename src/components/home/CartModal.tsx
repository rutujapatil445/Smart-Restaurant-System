import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingCart, CheckCircle2, Loader2, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: any[];
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  total: number;
  clearCart: () => void;
  onCheckout: (cart: any[], total: number, email?: string) => Promise<any>;
}

const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  updateQuantity, 
  removeFromCart, 
  total, 
  clearCart,
  onCheckout
}) => {
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      await onCheckout(cart, total, user?.email || undefined);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-8 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-3xl font-serif font-bold">Your Cart</h3>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold mb-2">Order Placed!</h4>
                  <p className="text-stone-500">Thank you for your order. We'll start preparing it right away.</p>
                </motion.div>
              ) : cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingCart className="w-8 h-8 text-stone-300" />
                  </div>
                  <p className="text-stone-500 font-serif italic">Your cart is currently empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-6 group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                      <img 
                        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'} 
                        className="w-full h-full object-cover" 
                        alt={item.name} 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-stone-300 hover:text-rose-500 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-orange-600 font-bold mb-4">₹{item.price}</p>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {!isSuccess && (
              <div className="pt-8 border-t border-stone-100 mt-8">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-stone-500 uppercase tracking-widest text-xs font-bold">Total Amount</span>
                  <span className="text-4xl font-serif font-bold text-orange-600">₹{total}</span>
                </div>
                {user ? (
                  <button 
                    disabled={cart.length === 0 || isCheckingOut}
                    onClick={handleCheckout}
                    className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Checkout Now'
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <Link 
                      to="/login"
                      className="w-full py-5 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-xl"
                    >
                      <User className="w-5 h-5" />
                      Sign In to Checkout
                    </Link>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-100"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                        <span className="bg-white px-4 text-stone-400">Or</span>
                      </div>
                    </div>
                    <button 
                      disabled={cart.length === 0 || isCheckingOut}
                      onClick={handleCheckout}
                      className="w-full py-4 bg-white text-stone-600 border border-stone-200 rounded-2xl font-bold hover:bg-stone-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isCheckingOut ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        'Checkout as Guest'
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};


export default CartModal;
