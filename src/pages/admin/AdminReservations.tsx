import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Mail,
  Phone,
  Calendar,
  Users
} from 'lucide-react';
import { Reservation } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../../context/NotificationContext';

const AdminReservations = () => {
  const { showNotification } = useNotifications();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled' | 'seated'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservationIds, setSelectedReservationIds] = useState<number[]>([]);

  const fetchReservations = async () => {
    const res = await fetch('/api/reservations');
    const data = await res.json();
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();

    // WebSocket listener for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      
      switch (message.type) {
        case 'NEW_RESERVATION':
          setReservations(prev => [message.data, ...prev]);
          break;
        case 'RESERVATION_UPDATED':
          setReservations(prev => prev.map(res => 
            res.id === message.data.id 
              ? { ...res, status: message.data.status, table_number: message.data.table_number || res.table_number } 
              : res
          ));
          break;
        case 'BULK_RESERVATION_UPDATED':
          setReservations(prev => prev.map(res => 
            message.data.ids.includes(res.id)
              ? { ...res, status: message.data.status }
              : res
          ));
          break;
      }
    };

    return () => ws.close();
  }, []);

  const updateStatus = async (id: number, status: string, table_number?: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, table_number })
      });
      
      if (res.ok) {
        if (status === 'confirmed') {
          showNotification('Reservation confirmed and email sent!', 'success');
        } else {
          showNotification(`Reservation marked as ${status}.`, 'success');
        }
      }
      fetchReservations();
    } catch (error) {
      showNotification('Failed to update reservation.', 'error');
    }
  };

  const updateBulkStatus = async (status: string) => {
    if (selectedReservationIds.length === 0) return;
    
    try {
      const res = await fetch('/api/reservations/bulk/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedReservationIds, status })
      });
      
      if (res.ok) {
        showNotification(`${selectedReservationIds.length} reservations marked as ${status}.`, 'success');
        setSelectedReservationIds([]);
        fetchReservations();
      }
    } catch (error) {
      showNotification('Failed to update reservations.', 'error');
    }
  };

  const toggleSelectAll = () => {
    if (selectedReservationIds.length === filteredReservations.length) {
      setSelectedReservationIds([]);
    } else {
      setSelectedReservationIds(filteredReservations.map(r => r.id));
    }
  };

  const toggleSelectReservation = (id: number, e: React.ChangeEvent) => {
    e.stopPropagation();
    if (selectedReservationIds.includes(id)) {
      setSelectedReservationIds(selectedReservationIds.filter(i => i !== id));
    } else {
      setSelectedReservationIds([...selectedReservationIds, id]);
    }
  };

  const filteredReservations = reservations
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-200 dark:border-stone-800 pb-12">
        <div>
          <span className="text-orange-600 font-bold tracking-[0.6em] uppercase text-[10px] mb-4 block">Hospitality</span>
          <h1 className="text-5xl font-serif font-bold text-stone-900 dark:text-white">Reservations</h1>
          <p className="text-stone-400 mt-4 text-xs font-bold uppercase tracking-[0.2em]">Manage incoming table requests and guest lists.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 group-focus-within:text-orange-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search guests..."
              className="pl-14 pr-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 focus:border-orange-600 outline-none w-72 text-[10px] font-bold uppercase tracking-widest transition-all duration-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-8 py-4 rounded-full border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 focus:border-orange-600 outline-none text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedReservationIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-orange-600 text-white px-8 py-4 rounded-full flex items-center justify-between shadow-lg shadow-orange-600/20"
          >
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-widest">{selectedReservationIds.length} Selected</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => updateBulkStatus('confirmed')}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-[10px] font-bold uppercase tracking-widest border border-white/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm All</span>
              </button>
              <button 
                onClick={() => updateBulkStatus('cancelled')}
                className="flex items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-[10px] font-bold uppercase tracking-widest border border-white/20"
              >
                <XCircle className="w-4 h-4" />
                <span>Cancel All</span>
              </button>
              <button 
                onClick={() => setSelectedReservationIds([])}
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
            <thead className="bg-stone-50 dark:bg-stone-950 text-stone-400 text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-6 font-bold text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                    checked={selectedReservationIds.length === filteredReservations.length && filteredReservations.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-10 py-6 font-bold">Guest Info</th>
                <th className="px-10 py-6 font-bold">Schedule</th>
                <th className="px-10 py-6 font-bold">Party</th>
                <th className="px-10 py-6 font-bold">Table</th>
                <th className="px-10 py-6 font-bold">Status</th>
                <th className="px-10 py-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              <AnimatePresence mode="popLayout">
                {filteredReservations.map((res) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={res.id} 
                    className="hover:bg-stone-50 dark:hover:bg-stone-950 transition-all duration-500 group"
                  >
                    <td className="px-6 py-8 text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-600 cursor-pointer"
                        checked={selectedReservationIds.includes(res.id)}
                        onChange={(e) => toggleSelectReservation(res.id, e)}
                      />
                    </td>
                    <td className="px-10 py-8">
                      <div className="font-serif font-bold text-stone-900 dark:text-white text-lg">{res.name}</div>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                          <Mail className="w-3 h-3 text-orange-600" /> {res.email}
                        </div>
                        {res.phone && (
                          <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                            <Phone className="w-3 h-3 text-orange-600" /> {res.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm text-stone-900 dark:text-white font-bold">{res.date}</div>
                      <div className="text-[10px] text-orange-600 font-bold uppercase tracking-widest mt-1">{res.time}</div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-sm font-bold text-stone-900 dark:text-white">
                        <Users className="w-4 h-4 text-stone-300" />
                        {res.guests} Guests
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <input 
                        type="text" 
                        placeholder="T-01"
                        className="w-20 px-4 py-2 rounded-full border border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-[10px] font-bold uppercase tracking-widest focus:border-orange-600 outline-none transition-all"
                        value={res.table_number || ''}
                        onChange={(e) => updateStatus(res.id, res.status, e.target.value)}
                      />
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-full text-[8px] font-bold uppercase tracking-[0.2em] ${
                        res.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                        res.status === 'seated' ? 'bg-blue-50 text-blue-600' :
                        res.status === 'cancelled' ? 'bg-rose-50 text-rose-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        {res.status !== 'confirmed' && (
                          <button 
                            onClick={() => updateStatus(res.id, 'confirmed')}
                            className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-500 shadow-xl"
                            title="Confirm"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {res.status !== 'cancelled' && (
                          <button 
                            onClick={() => updateStatus(res.id, 'cancelled')}
                            className="w-10 h-10 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all duration-500 shadow-xl"
                            title="Cancel"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {filteredReservations.length === 0 && (
          <div className="p-32 text-center">
            <div className="w-20 h-20 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center mx-auto mb-8 text-stone-200">
              <Calendar className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">No reservations found</h3>
            <p className="text-stone-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-4">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;
