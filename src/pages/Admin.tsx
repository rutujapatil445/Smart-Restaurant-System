import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Utensils, 
  ShoppingBag, 
  CalendarCheck, 
  TrendingUp, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  DollarSign,
  ArrowLeft,
  Star,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [menu, setMenu] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loyalty, setLoyalty] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({ totalOrders: 0, totalRevenue: 0, popularDishes: [] });
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: 'Starters', image: '' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [menuRes, ordersRes, resRes, revRes, loyRes, anaRes] = await Promise.all([
        fetch('/api/menu').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/reservations').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json()),
        fetch('/api/loyalty').then(r => r.json()),
        fetch('/api/analytics').then(r => r.json())
      ]);
      setMenu(menuRes.items || []);
      setOrders(ordersRes);
      setReservations(resRes);
      setReviews(revRes);
      setLoyalty(loyRes);
      setAnalytics(anaRes);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    setNewItem({ name: '', description: '', price: '', category: 'Starters', image: '' });
    fetchData();
  };

  const handleDeleteMenu = async (id: number) => {
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    fetchData();
  };

  // Mock data for charts
  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-white flex flex-col fixed h-full">
        <div className="p-8 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center">
              <Utensils className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight">Admin<span className="text-orange-600">Panel</span></span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'menu', label: 'Menu Manager', icon: Utensils },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
            { id: 'reviews', label: 'Reviews', icon: Star },
            { id: 'loyalty', label: 'Loyalty Program', icon: Award },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id ? 'bg-orange-600 text-white' : 'text-stone-400 hover:bg-stone-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-white text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Back to Website
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12">
        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <header>
              <h1 className="text-4xl font-serif font-bold">Dashboard Overview</h1>
              <p className="text-stone-500 mt-2">Real-time insights into your restaurant's performance.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                    <DollarSign className="text-orange-600 w-6 h-6" />
                  </div>
                  <span className="text-stone-400 font-bold uppercase tracking-widest text-xs">Total Revenue</span>
                </div>
                <p className="text-4xl font-serif font-bold">₹{analytics.totalRevenue}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="text-blue-600 w-6 h-6" />
                  </div>
                  <span className="text-stone-400 font-bold uppercase tracking-widest text-xs">Total Orders</span>
                </div>
                <p className="text-4xl font-serif font-bold">{analytics.totalOrders}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="text-emerald-600 w-6 h-6" />
                  </div>
                  <span className="text-stone-400 font-bold uppercase tracking-widest text-xs">Popular Dishes</span>
                </div>
                <p className="text-4xl font-serif font-bold">{analytics.popularDishes.length}</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold mb-8">Revenue Trajectory</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#a8a29e', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="space-y-10">
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-serif font-bold">Menu Manager</h1>
                <p className="text-stone-500 mt-2">Add, edit, or remove dishes from your digital menu.</p>
              </div>
            </header>

            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100">
              <h3 className="text-xl font-bold mb-8">Add New Item</h3>
              <form onSubmit={handleAddMenu} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <input required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 outline-none focus:border-orange-500" placeholder="Dish Name" />
                <input required type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 outline-none focus:border-orange-500" placeholder="Price (₹)" />
                <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 outline-none focus:border-orange-500">
                  {["Starters", "Main Course", "Biryani", "Breads", "Desserts", "Drinks"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="md:col-span-2 bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 outline-none focus:border-orange-500" placeholder="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                <button className="bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" /> Add to Menu
                </button>
              </form>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400">Dish</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400">Category</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400">Price</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {menu.map(item => (
                    <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden">
                            <img 
                              src={item.image} 
                              className="w-full h-full object-cover" 
                              alt={item.name} 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="font-bold">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-stone-500">{item.category}</td>
                      <td className="px-8 py-6 font-serif font-bold">₹{item.price}</td>
                      <td className="px-8 py-6 text-right">
                        <button onClick={() => handleDeleteMenu(item.id)} className="p-2 text-stone-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-10">
            <header>
              <h1 className="text-4xl font-serif font-bold">Order Queue</h1>
              <p className="text-stone-500 mt-2">Manage incoming online orders and delivery status.</p>
            </header>

            <div className="grid grid-cols-1 gap-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100 flex flex-col md:flex-row justify-between gap-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-4 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Order #{order.id}</span>
                      <span className="text-stone-400 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.created_at).toLocaleString()}</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">{order.customer_name}</h4>
                    <p className="text-stone-500 text-sm mb-4">{order.address}</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(order.items) ? order.items : []).map((item: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-stone-100 rounded-lg text-xs font-medium">{item.quantity}x {item.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-2xl font-serif font-bold text-orange-600">₹{order.total}</p>
                    <div className="flex gap-3">
                      <button className="px-6 py-2 border border-stone-200 rounded-xl text-sm font-bold hover:bg-stone-50 transition-all">Reject</button>
                      <button className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="space-y-10">
            <header>
              <h1 className="text-4xl font-serif font-bold">Table Reservations</h1>
              <p className="text-stone-500 mt-2">View and manage upcoming table bookings.</p>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400">Guest</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400">Date & Time</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400">Guests</th>
                    <th className="px-8 py-6 text-xs font-bold uppercase tracking-widest text-stone-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {reservations.map(res => (
                    <tr key={res.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-bold">{res.name}</p>
                        <p className="text-xs text-stone-400">{res.email}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-medium">{res.date}</p>
                        <p className="text-xs text-stone-400">{res.time}</p>
                      </td>
                      <td className="px-8 py-6 font-bold">{res.guests} Pax</td>
                      <td className="px-8 py-6 text-right">
                        <span className="px-4 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-10">
            <header>
              <h1 className="text-4xl font-serif font-bold">Customer Reviews</h1>
              <p className="text-stone-500 mt-2">Monitor and manage guest feedback.</p>
            </header>
            <div className="grid grid-cols-1 gap-6">
              {reviews.map(review => (
                <div key={review.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center font-bold text-stone-400">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{review.name}</p>
                        <div className="flex gap-1 mt-1">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-orange-500 fill-orange-500" />)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-stone-600 italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'loyalty' && (
          <div className="space-y-10">
            <header>
              <h1 className="text-4xl font-serif font-bold">Loyalty Program</h1>
              <p className="text-stone-500 mt-2">Manage customer rewards and points.</p>
            </header>
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-400">Customer Email</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-400">Points</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-stone-400">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loyalty.map(member => (
                    <tr key={member.id}>
                      <td className="px-8 py-6 font-medium">{member.email}</td>
                      <td className="px-8 py-6">
                        <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-xl font-bold">{member.points} pts</span>
                      </td>
                      <td className="px-8 py-6 text-stone-400 text-sm">
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
