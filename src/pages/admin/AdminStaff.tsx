import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Phone, Shield, MoreVertical, Trash2, Edit2, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminStaff = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Waiter',
    email: '',
    phone: '',
    bio: '',
    image_url: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/staff/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setStaff(staff.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting staff:', error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      if (response.ok) {
        const added = await response.json();
        setStaff([...staff, added]);
        setIsAdding(false);
        setNewMember({ name: '', role: 'Waiter', email: '', phone: '', bio: '', image_url: '' });
      }
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Staff Management</h1>
          <p className="text-stone-500 mt-2 text-sm">Manage your team members and their access levels.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-4 rounded-2xl bg-orange-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 flex items-center gap-3"
        >
          <UserPlus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0F0F0F] p-4 rounded-3xl border border-stone-800/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
          <input 
            type="text" 
            placeholder="Search staff by name or role..."
            className="w-full bg-stone-900/50 border border-stone-800 text-white text-xs px-12 py-3 rounded-xl outline-none focus:border-orange-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-[#0F0F0F] rounded-[2.5rem] border border-stone-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-stone-600 text-[10px] uppercase tracking-widest font-bold border-b border-stone-800">
              <tr>
                <th className="py-6 px-8">Member</th>
                <th className="py-6 px-8">Role</th>
                <th className="py-6 px-8">Contact</th>
                <th className="py-6 px-8">Joined</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredStaff.map((member) => (
                <tr key={member.id} className="group hover:bg-stone-900/30 transition-all">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 overflow-hidden">
                        {member.image_url ? (
                          <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg font-serif font-bold text-stone-400">
                            {member.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{member.name}</h4>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">ID: #{member.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3 h-3 text-orange-500" />
                      <span className="text-sm text-stone-300">{member.role}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Mail className="w-3 h-3" />
                        {member.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-400">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-xs text-stone-400">
                      {new Date(member.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setConfirmDelete(member.id)}
                        className="p-2 hover:bg-rose-500/10 rounded-lg transition-all text-stone-600 hover:text-rose-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0F0F0F] border border-stone-800 rounded-[2.5rem] p-10 w-full max-w-xl shadow-2xl"
            >
              <div className="mb-8">
                <h3 className="text-3xl font-serif font-bold text-white">Add Team Member</h3>
                <p className="text-stone-500 text-sm mt-2">Invite a new member to the Saffron Spice team.</p>
              </div>
              
              <form onSubmit={handleAddStaff} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                    placeholder="e.g. Rajesh Kumar"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Role</label>
                    <select 
                      className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all appearance-none"
                      value={newMember.role}
                      onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    >
                      <option>Executive Chef</option>
                      <option>Sous Chef</option>
                      <option>Restaurant Manager</option>
                      <option>Head Waiter</option>
                      <option>Waiter</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Phone</label>
                    <input
                      type="text"
                      className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                      placeholder="+91 98765 43210"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full px-6 py-4 rounded-2xl bg-stone-900 border border-stone-800 text-white text-sm outline-none focus:border-orange-500 transition-all"
                    placeholder="rajesh@saffronspice.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)} 
                    className="flex-1 px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest text-stone-500 hover:bg-stone-900 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest bg-orange-600 text-white hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Remove Team Member?"
        message="This will remove them from the staff list and the About page."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminStaff;
