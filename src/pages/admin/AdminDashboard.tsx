import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Plus,
  UtensilsCrossed,
  MoreVertical,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { motion } from 'motion/react';
import { Reservation } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const AdminDashboard = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, analyticsData] = await Promise.all([
          fetch('/api/reservations').then(res => res.json()),
          fetch('/api/analytics').then(res => res.json())
        ]);
        setReservations(resData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { 
      label: 'Total Revenue', 
      value: analytics ? `₹${analytics.totalRevenue.toLocaleString()}` : '₹0', 
      change: '+12.5%', 
      icon: DollarSign, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10' 
    },
    { 
      label: 'Reservations', 
      value: analytics ? analytics.totalReservations.toString() : '0', 
      change: '+18.2%', 
      icon: Calendar, 
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10' 
    },
    { 
      label: 'Avg. Rating', 
      value: analytics ? analytics.avgRating.toString() : '0', 
      change: '+0.2', 
      icon: Star, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10' 
    },
    { 
      label: 'Total Guests', 
      value: analytics ? analytics.totalGuests.toLocaleString() : '0', 
      change: '+5.4%', 
      icon: Users, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10' 
    },
  ];

  const revenueData = analytics?.revenueData || [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ];

  const popularDishes = analytics?.topDishes.map((dish: any) => ({
    name: dish.name,
    orders: Math.floor(Math.random() * 100) + 50, // Mocking orders for now as we don't track item-wise orders yet
    revenue: `₹${(dish.price * 50).toLocaleString()}`,
    trend: 'up'
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-stone-500 mt-2 text-sm">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-all">
            Download Report
          </button>
          <button className="px-6 py-3 rounded-xl bg-orange-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Reservation
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.label}
            className="p-6 rounded-3xl bg-[#0F0F0F] border border-stone-800/50 hover:border-stone-700 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-stone-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-serif font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Revenue Performance</h3>
              <p className="text-stone-500 text-xs mt-1">Weekly earnings overview</p>
            </div>
            <select className="bg-stone-900 border border-stone-800 text-stone-400 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1C" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ color: '#EA580C', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EA580C" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Dishes */}
        <div className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif font-bold text-white">Top Dishes</h3>
            <button className="text-orange-500 text-[10px] font-bold uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {popularDishes.map((dish, idx) => (
              <div key={dish.name} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 group-hover:border-orange-500/50 transition-all">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{dish.name}</h4>
                    <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">{dish.orders} Orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{dish.revenue}</p>
                  <p className={`text-[10px] font-bold ${dish.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {dish.trend === 'up' ? '↑ Trending' : '↓ Slowing'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-6 rounded-3xl bg-orange-600/5 border border-orange-600/20">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Insight</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Butter Chicken revenue is up <span className="text-white font-bold">24%</span> this week. Consider featuring it in the newsletter.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Reservations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Reservations */}
        <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-serif font-bold text-white">Recent Reservations</h3>
            <button className="text-stone-500 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-stone-600 text-[10px] uppercase tracking-widest font-bold border-b border-stone-800">
                <tr>
                  <th className="pb-4 px-2">Guest</th>
                  <th className="pb-4 px-2">Date & Time</th>
                  <th className="pb-4 px-2">Party</th>
                  <th className="pb-4 px-2">Status</th>
                  <th className="pb-4 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/50">
                {reservations.slice(0, 5).map((res) => (
                  <tr key={res.id} className="group hover:bg-stone-900/30 transition-all">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-[10px] font-bold text-stone-400 uppercase">
                          {res.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-white">{res.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-xs text-stone-300">{res.date}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{res.time}</div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="text-xs text-stone-300">{res.guests} Guests</span>
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                        res.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' :
                        res.status === 'cancelled' ? 'bg-rose-500/10 text-rose-500' :
                        'bg-orange-500/10 text-orange-500'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button className="p-2 hover:bg-stone-800 rounded-lg transition-all text-stone-500 hover:text-white">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Status */}
        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-[#0F0F0F] border border-stone-800/50">
            <h3 className="text-xl font-serif font-bold text-white mb-6">Operational Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-stone-300">Restaurant Status</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Open Now</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-stone-500" />
                  <span className="text-sm text-stone-300">Peak Hours</span>
                </div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">19:00 - 21:00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4 text-stone-500" />
                  <span className="text-sm text-stone-300">Active Orders</span>
                </div>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">12 Active</span>
              </div>
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-stone-800 transition-all">
              Manage Operations
            </button>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-orange-600 to-rose-600 text-white shadow-2xl shadow-orange-600/20">
            <h3 className="text-xl font-serif font-bold mb-2">Need Help?</h3>
            <p className="text-white/70 text-xs mb-6 leading-relaxed">Check our documentation or contact support for any assistance with the dashboard.</p>
            <button className="w-full py-4 rounded-2xl bg-white text-stone-900 text-[10px] font-bold uppercase tracking-widest hover:bg-stone-100 transition-all">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
