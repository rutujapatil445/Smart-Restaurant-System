import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const revenueData = analytics?.revenueData || [
    { name: 'Mon', value: 0 },
    { name: 'Tue', value: 0 },
    { name: 'Wed', value: 0 },
    { name: 'Thu', value: 0 },
    { name: 'Fri', value: 0 },
    { name: 'Sat', value: 0 },
    { name: 'Sun', value: 0 },
  ];

  const categoryPerformance = [
    { name: 'Appetizers', value: 25, color: '#EA580C' },
    { name: 'Main Course', value: 45, color: '#1C1C1C' },
    { name: 'Desserts', value: 15, color: '#78716C' },
    { name: 'Beverages', value: 15, color: '#D6D3D1' },
  ];

  const hourlyTraffic = [
    { hour: '12:00', traffic: 20 },
    { hour: '13:00', traffic: 45 },
    { hour: '14:00', traffic: 30 },
    { hour: '15:00', traffic: 15 },
    { hour: '16:00', traffic: 10 },
    { hour: '17:00', traffic: 25 },
    { hour: '18:00', traffic: 60 },
    { hour: '19:00', traffic: 85 },
    { hour: '20:00', traffic: 95 },
    { hour: '21:00', traffic: 70 },
    { hour: '22:00', traffic: 40 },
  ];

  const stats = [
    { label: 'Net Revenue', value: `₹${analytics?.totalRevenue?.toLocaleString() || '0'}`, change: '+14.2%', icon: DollarSign, isUp: true },
    { label: 'Total Guests', value: analytics?.totalGuests?.toString() || '0', change: '+8.4%', icon: Users, isUp: true },
    { label: 'Avg. Rating', value: analytics?.avgRating?.toFixed(1) || '0.0', change: '+0.2', icon: TrendingUp, isUp: true },
    { label: 'Reservations', value: analytics?.totalReservations?.toString() || '0', change: '+5.2%', icon: Calendar, isUp: true },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Business Analytics</h1>
          <p className="text-stone-500 mt-2 text-sm">Comprehensive performance metrics and customer insights.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0F0F0F] border border-stone-800 rounded-xl p-1">
            {['7D', '30D', '90D', '1Y'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  timeRange.includes(range) ? 'bg-stone-800 text-white' : 'text-stone-500 hover:text-stone-300'
                }`}
                onClick={() => setTimeRange(`Last ${range}`)}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="px-6 py-3 rounded-xl bg-orange-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
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
            className="p-8 rounded-[2rem] bg-[#0F0F0F] border border-stone-800/50"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.change}
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </div>
            </div>
            <h3 className="text-stone-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-serif font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 p-10 rounded-[3rem] bg-[#0F0F0F] border border-stone-800/50">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-orange-600/10 text-orange-600">
                <LineChartIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-white">Revenue Trajectory</h3>
                <p className="text-stone-500 text-xs mt-1">Daily earnings vs guest count</p>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
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
                />
                <YAxis 
                  stroke="#444" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `₹${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#EA580C" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie Chart */}
        <div className="p-10 rounded-[3rem] bg-[#0F0F0F] border border-stone-800/50">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400">
              <PieChartIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Revenue Share</h3>
              <p className="text-stone-500 text-xs mt-1">By menu category</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryPerformance}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-4">
            {categoryPerformance.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{item.name}</span>
                </div>
                <span className="text-sm font-serif font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Traffic Bar Chart */}
      <div className="p-10 rounded-[3rem] bg-[#0F0F0F] border border-stone-800/50">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800 text-stone-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-white">Hourly Traffic</h3>
              <p className="text-stone-500 text-xs mt-1">Peak operational hours analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-600" />
            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Filter by Day</span>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyTraffic}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1C" vertical={false} />
              <XAxis 
                dataKey="hour" 
                stroke="#444" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#444" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip 
                cursor={{ fill: '#1C1C1C' }}
                contentStyle={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '12px' }}
              />
              <Bar 
                dataKey="traffic" 
                fill="#EA580C" 
                radius={[8, 8, 0, 0]} 
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
