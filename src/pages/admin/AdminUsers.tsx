import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, Search, MoreVertical, Trash2, Shield, UserCheck, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ConfirmDialog from '../../components/ConfirmDialog';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setConfirmDelete(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white tracking-tight">User Management</h1>
          <p className="text-stone-500 mt-2 text-sm">Manage registered customers and their access levels.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3">
            <Users className="w-5 h-5 text-orange-500" />
            <span className="text-xl font-serif font-bold text-white">{users.length}</span>
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Total Users</span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0F0F0F] p-4 rounded-3xl border border-stone-800/50">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
          <input 
            type="text" 
            placeholder="Search users by name or email..."
            className="w-full bg-stone-900/50 border border-stone-800 text-white text-xs px-12 py-3 rounded-xl outline-none focus:border-orange-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="bg-[#0F0F0F] rounded-[2.5rem] border border-stone-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-stone-600 text-[10px] uppercase tracking-widest font-bold border-b border-stone-800">
              <tr>
                <th className="py-6 px-8">User</th>
                <th className="py-6 px-8">Role</th>
                <th className="py-6 px-8">Contact</th>
                <th className="py-6 px-8">Joined</th>
                <th className="py-6 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="group hover:bg-stone-900/30 transition-all">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-lg font-serif font-bold text-stone-400">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{user.name}</h4>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">ID: #{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2">
                      <Shield className={`w-3 h-3 ${user.role === 'admin' ? 'text-orange-500' : 'text-stone-500'}`} />
                      <span className={`text-xs font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-orange-500' : 'text-stone-400'}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Mail className="w-3 h-3" />
                      {user.email}
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => setConfirmDelete(user.id)}
                        className="p-2 hover:bg-rose-500/10 rounded-lg transition-all text-stone-600 hover:text-rose-500"
                        disabled={user.role === 'admin'} // Prevent deleting admins from here for safety
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

      {filteredUsers.length === 0 && !isLoading && (
        <div className="py-20 text-center bg-[#0F0F0F] rounded-[3rem] border border-stone-800/50">
          <Users className="w-16 h-16 text-stone-800 mx-auto mb-6" />
          <h3 className="text-xl font-serif font-bold text-white mb-2">No users found</h3>
          <p className="text-stone-500 text-sm">Try adjusting your search query.</p>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete !== null}
        title="Delete User Account?"
        message="This will permanently remove the user's account and all associated data. This action cannot be undone."
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminUsers;
