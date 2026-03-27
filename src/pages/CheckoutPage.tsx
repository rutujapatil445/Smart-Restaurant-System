import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { motion } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, CreditCard, Truck, MapPin, User, Phone, Clock, ChevronDown, Wallet, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { showNotification } = useNotifications();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    pickupTime: '',
    notes: ''
  });

  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      const orderData = {
        ...formData,
        order_type: orderType,
        payment_method: paymentMethod,
        total_amount: totalPrice,
        items: cart.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // Simulate payment processing for card/wallet
      if (paymentMethod !== 'cod') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      clearCart();
      setIsProcessing(false);
      navigate('/order-success');
    } catch (error) {
      console.error('Order Error:', error);
      showNotification('There was an error placing your order. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100 dark:border-gray-700">
          <div className="bg-orange-50 dark:bg-orange-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-serif">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Looks like you haven't added any delicious dishes to your cart yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-all shadow-lg"
          >
            Browse Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-32 bg-stone-50 dark:bg-stone-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-24">
          {/* Order Summary */}
          <div className="flex-1">
            <div className="mb-12">
              <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Review</span>
              <h2 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white font-serif leading-none">
                Your <span className="italic text-orange-600">Selection</span>
              </h2>
            </div>

            <div className="space-y-12">
              <div className="divide-y divide-stone-100 dark:divide-stone-900">
                {cart.map((item) => (
                  <div key={item.id} className="py-10 flex items-center gap-10 group">
                    <div className="relative aspect-[3/4] w-32 overflow-hidden rounded-[2rem] shadow-2xl border-4 border-white dark:border-stone-900 shrink-0">
                      <img 
                        src={item.image_url || "https://images.unsplash.com/photo-1585937421612-70a0f2455f75?auto=format&fit=crop&q=80&w=100"} 
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-stone-900 dark:text-white text-2xl mb-2">{item.name}</h4>
                      <p className="text-orange-600 font-bold text-sm tracking-[0.2em] uppercase">₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-4 bg-white dark:bg-stone-900 px-4 py-2 rounded-full border border-stone-100 dark:border-stone-800 shadow-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-stone-900 dark:text-white text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-300 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-12 border-t border-stone-200 dark:border-stone-800">
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-center text-sm uppercase tracking-[0.2em] font-bold">
                    <span className="text-stone-400">Subtotal</span>
                    <span className="text-stone-900 dark:text-white">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm uppercase tracking-[0.2em] font-bold">
                    <span className="text-stone-400">{orderType === 'delivery' ? 'Delivery' : 'Service'}</span>
                    <span className="text-emerald-600 italic">Complimentary</span>
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-2">Total Amount</span>
                  <span className="text-6xl font-bold text-stone-900 dark:text-white tracking-tighter font-serif">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="w-full lg:w-[500px]">
            <div className="mb-12">
              <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[10px] mb-4 block">Details</span>
              <h2 className="text-5xl font-bold text-stone-900 dark:text-white font-serif leading-none">
                Checkout
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Order Type Toggle */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-6 rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 border-2 ${
                    orderType === 'delivery' 
                      ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900 dark:border-white shadow-2xl' 
                      : 'bg-transparent text-stone-400 border-stone-100 dark:border-stone-900 hover:border-stone-300'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`flex-1 py-6 rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center justify-center gap-3 border-2 ${
                    orderType === 'takeaway' 
                      ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 border-stone-900 dark:border-white shadow-2xl' 
                      : 'bg-transparent text-stone-400 border-stone-100 dark:border-stone-900 hover:border-stone-300'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Takeaway
                </button>
              </div>

              <div className="space-y-6">
                <div className="group">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Full Name</label>
                  <input 
                    required
                    type="text"
                    name="name"
                    className="w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="group">
                  <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    name="phone"
                    className="w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                {orderType === 'delivery' ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="group">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Delivery Address</label>
                      <textarea 
                        required={orderType === 'delivery'}
                        name="address"
                        rows={2}
                        className="w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white resize-none"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="group">
                      <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-4 block">Pickup Time</label>
                      <select
                        required={orderType === 'takeaway'}
                        name="pickupTime"
                        className="w-full bg-transparent border-b-2 border-stone-200 dark:border-stone-800 py-4 focus:border-orange-600 outline-none transition-all font-serif text-2xl text-stone-900 dark:text-white cursor-pointer appearance-none"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Time</option>
                        <option value="11:00 AM">11:00 AM (ASAP)</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="01:00 PM">01:00 PM</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="pt-12">
                <label className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-400 mb-8 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'cod', icon: Truck, label: 'Cash' },
                    { id: 'card', icon: CreditCard, label: 'Card' },
                    { id: 'wallet', icon: Smartphone, label: 'Wallet' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`flex flex-col items-center gap-4 p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                        paymentMethod === method.id 
                          ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-600 text-orange-600 shadow-xl shadow-orange-600/10' 
                          : 'bg-transparent border-stone-100 dark:border-stone-900 text-stone-400 hover:border-stone-300'
                      }`}
                    >
                      <method.icon className="w-6 h-6" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                disabled={isProcessing}
                type="submit"
                className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-8 rounded-[2rem] font-bold text-xs uppercase tracking-[0.4em] hover:bg-orange-600 dark:hover:bg-orange-600 hover:text-white dark:hover:text-white transition-all duration-700 shadow-2xl disabled:opacity-50 group mt-12"
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
