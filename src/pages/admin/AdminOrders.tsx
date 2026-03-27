import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  ExternalLink,
  CreditCard,
  Truck,
  Smartphone,
  User,
  Phone,
  MapPin,
  Calendar,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useNotifications } from '../../context/NotificationContext';

interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  price: number;
  item_name: string;
}

interface Order {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  order_type: 'delivery' | 'takeaway';
  payment_method: 'cod' | 'card' | 'wallet';
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

const AdminOrders = () => {
  const { showNotification } = useNotifications();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<number[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    orderId: number | null;
    newStatus: string;
    isBulk: boolean;
  }>({
    isOpen: false,
    orderId: null,
    newStatus: '',
    isBulk: false
  });

  useEffect(() => {
    fetchOrders();

    // WebSocket listener for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'NEW_ORDER':
          setOrders(prev => [message.data, ...prev]);
          break;
        case 'ORDER_UPDATED':
          setOrders(prev => prev.map(order => 
            order.id === message.data.id 
              ? { ...order, status: message.data.status } 
              : order
          ));
          setSelectedOrder(prev => (prev?.id === message.data.id ? { ...prev, status: message.data.status } : prev));
          break;
        case 'BULK_ORDER_UPDATED':
          setOrders(prev => prev.map(order => 
            message.data.ids.includes(order.id)
              ? { ...order, status: message.data.status }
              : order
          ));
          setSelectedOrder(prev => (prev && message.data.ids.includes(prev.id) ? { ...prev, status: message.data.status } : prev));
          break;
      }
    };

    return () => ws.close();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  };

  const updateOrderStatus = (id: number, status: string) => {
    setConfirmDialog({
      isOpen: true,
      orderId: id,
      newStatus: status,
      isBulk: false
    });
  };

  const updateBulkStatus = (status: string) => {
    setConfirmDialog({
      isOpen: true,
      orderId: null,
      newStatus: status,
      isBulk: true
    });
  };

  const handleConfirmStatusUpdate = () => {
    const { orderId, newStatus, isBulk } = confirmDialog;
    
    if (isBulk) {
      if (selectedOrderIds.length === 0) return;
      
      fetch('/api/orders/bulk/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedOrderIds, status: newStatus })
      })
      .then(res => res.json())
      .then(() => {
        fetchOrders();
        setSelectedOrderIds([]);
        setConfirmDialog({ isOpen: false, orderId: null, newStatus: '', isBulk: false });
        showNotification(`${selectedOrderIds.length} orders updated to ${newStatus}`, 'success');
      })
      .catch(() => {
        showNotification('Failed to update orders', 'error');
      });
    } else {
      if (!orderId) return;

      fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      .then(res => res.json())
      .then(() => {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        setConfirmDialog({ isOpen: false, orderId: null, newStatus: '', isBulk: false });
        showNotification(`Order #${orderId.toString().padStart(4, '0')} updated to ${newStatus}`, 'success');
      })
      .catch(() => {
        showNotification('Failed to update order', 'error');
      });
    }
  };

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedOrderIds.includes(id)) {
      setSelectedOrderIds(selectedOrderIds.filter(i => i !== id));
    } else {
      setSelectedOrderIds([...selectedOrderIds, id]);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Total Amount', 'Status', 'Date'];
    const csvRows = orders.map(order => [
      `#${order.id.toString().padStart(4, '0')}`,
      order.name,
      order.total_amount.toFixed(2),
      order.status,
      new Date(order.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'wallet': return <Smartphone className="w-4 h-4" />;
      default: return <Truck className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-200 dark:border-stone-800 pb-12">
        <div>
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">Sales</span>
          <h1 className="text-5xl font-serif font-bold text-stone-900 dark:text-white">Order Management</h1>
          <p className="text-stone-400 mt-4 text-xs font-bold uppercase tracking-[0.2em]">Track and manage customer orders in real-time.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text"
              placeholder="Search orders..."
              className="pl-14 pr-8 py-4 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-full focus:border-orange-600 outline-none transition-all w-72 text-sm font-medium shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-600 transition-all text-[10px] font-bold uppercase tracking-widest shadow-sm"
          >
            <Download className="w-4 h-4 text-orange-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Status Filter Segmented Control */}
      <div className="flex items-center gap-2 p-1.5 bg-stone-100 dark:bg-stone-950 rounded-full w-fit">
        {['all', 'pending', 'processing', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
              statusFilter === status 
                ? 'bg-white dark:bg-stone-800 text-orange-600 shadow-sm' 
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
            }`}
          >
            {status}
            <span className="ml-2 opacity-50">
              ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bulk Actions Bar */}
          <AnimatePresence>
            {selectedOrderIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-orange-600 text-white px-8 py-4 rounded-full flex items-center justify-between shadow-lg shadow-orange-600/20"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold uppercase tracking-widest">{selectedOrderIds.length} Orders Selected</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => updateBulkStatus('completed')}
                    className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-[10px] font-bold uppercase tracking-widest border border-white/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Completed</span>
                  </button>
                  <button 
                    onClick={() => updateBulkStatus('cancelled')}
                    className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-[10px] font-bold uppercase tracking-widest border border-white/20"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Selected</span>
                  </button>
                  <button 
                    onClick={() => setSelectedOrderIds([])}
                    className="text-[10px] font-bold uppercase tracking-widest hover:underline ml-4"
                  >
                    Clear
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white dark:bg-stone-900 rounded-[3rem] shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-stone-50 dark:bg-stone-950 text-stone-400 text-[10px] uppercase tracking-[0.4em]">
                  <tr>
                    <th className="px-6 py-6 font-bold text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                        checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-10 py-6 font-bold">Order ID</th>
                    <th className="px-10 py-6 font-bold">Customer</th>
                    <th className="px-10 py-6 font-bold">Type</th>
                    <th className="px-10 py-6 font-bold">Total</th>
                    <th className="px-10 py-6 font-bold">Status</th>
                    <th className="px-10 py-6 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50 dark:divide-stone-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-10 py-20 text-center text-stone-300 font-serif italic text-xl">Loading orders...</td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-10 py-20 text-center text-stone-300 font-serif italic text-xl">No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr 
                        key={order.id} 
                        className={`hover:bg-stone-50 dark:hover:bg-stone-950 transition-all duration-500 cursor-pointer group ${selectedOrder?.id === order.id ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                            checked={selectedOrderIds.includes(order.id)}
                            onChange={(e) => toggleSelectOrder(order.id, e as any)}
                          />
                        </td>
                        <td className="px-10 py-6 font-mono text-[10px] font-bold text-stone-400 tracking-widest">
                          #{order.id.toString().padStart(4, '0')}
                        </td>
                      <td className="px-10 py-6">
                        <div className="font-serif font-bold text-stone-900 dark:text-white text-lg group-hover:text-orange-600 transition-colors">{order.name}</div>
                        <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{order.phone}</div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                          {order.order_type === 'delivery' ? <Truck className="w-4 h-4 text-orange-600" /> : <ShoppingBag className="w-4 h-4 text-orange-600" />}
                          <span>{order.order_type}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6 font-serif font-bold text-stone-900 dark:text-white text-lg">
                        ₹{order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-10 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center text-stone-300 hover:bg-white dark:hover:bg-stone-800 hover:text-orange-600 transition-all shadow-sm">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Sidebar */}
      <div className="space-y-8">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-stone-900 rounded-[3rem] shadow-2xl border border-stone-100 dark:border-stone-800 p-10 space-y-10"
              >
                <div className="flex items-center justify-between border-b border-stone-50 dark:border-stone-800 pb-8">
                  <div>
                    <span className="text-orange-600 font-bold tracking-[0.4em] uppercase text-[8px] mb-2 block">Order Details</span>
                    <h3 className="font-serif font-bold text-stone-900 dark:text-white text-3xl">Summary</h3>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-stone-300 tracking-widest bg-stone-50 dark:bg-stone-950 px-4 py-2 rounded-full">#{selectedOrder.id.toString().padStart(4, '0')}</span>
                </div>

                {/* Status Update */}
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    className="flex flex-col items-center justify-center gap-3 py-6 rounded-[2rem] bg-stone-50 dark:bg-stone-950 text-stone-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-500"
                  >
                    <Clock className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Process</span>
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                    className="flex flex-col items-center justify-center gap-3 py-6 rounded-[2rem] bg-stone-50 dark:bg-stone-950 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-500"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Complete</span>
                  </button>
                  <button 
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    className="flex items-center justify-center gap-4 py-5 rounded-full bg-stone-50 dark:bg-stone-950 text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-500 col-span-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Cancel Order</span>
                  </button>
                </div>

                {/* Customer Info */}
                <div className="space-y-6 bg-stone-50 dark:bg-stone-950 p-8 rounded-[2.5rem]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-lg font-serif font-bold text-stone-900 dark:text-white leading-tight">{selectedOrder.name}</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{selectedOrder.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm">
                      <Phone className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-stone-600 dark:text-stone-400">{selectedOrder.phone}</p>
                  </div>
                  {selectedOrder.order_type === 'delivery' && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm shrink-0">
                        <MapPin className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-stone-600 dark:text-stone-400 leading-relaxed">{selectedOrder.address}</p>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{selectedOrder.city}, {selectedOrder.zip}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm">
                      <Calendar className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-stone-600 dark:text-stone-400">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.4em] ml-4">Order Items</p>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-4 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-[10px] font-bold">{item.quantity}</span>
                          <span className="text-sm font-serif font-bold text-stone-900 dark:text-white">{item.item_name}</span>
                        </div>
                        <span className="text-sm font-bold text-stone-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment */}
                <div className="flex justify-between items-end pt-8 border-t border-stone-50 dark:border-stone-800">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">Payment</span>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800">
                      {getPaymentIcon(selectedOrder.payment_method)}
                      <span className="uppercase text-[10px] font-bold tracking-widest text-stone-500">{selectedOrder.payment_method}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-4xl font-serif font-bold text-orange-600">₹{selectedOrder.total_amount.toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-stone-50 dark:bg-stone-950 rounded-[3rem] border-2 border-dashed border-stone-200 dark:border-stone-800 p-20 text-center">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <ShoppingBag className="w-10 h-10 text-stone-200" />
                </div>
                <p className="text-stone-300 font-serif italic text-2xl">Select an order to view details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.isBulk ? "Bulk Status Update" : "Update Order Status"}
        message={confirmDialog.isBulk 
          ? `Are you sure you want to change the status of ${selectedOrderIds.length} selected orders to '${confirmDialog.newStatus}'?`
          : `Are you sure you want to change the status of order #${confirmDialog.orderId?.toString().padStart(4, '0')} to '${confirmDialog.newStatus}'?`
        }
        confirmText={confirmDialog.isBulk ? "Update All" : "Update Status"}
        onConfirm={handleConfirmStatusUpdate}
        onCancel={() => setConfirmDialog({ isOpen: false, orderId: null, newStatus: '', isBulk: false })}
        type={confirmDialog.newStatus === 'cancelled' ? 'danger' : confirmDialog.newStatus === 'completed' ? 'info' : 'warning'}
      />
    </div>
  );
};

export default AdminOrders;
