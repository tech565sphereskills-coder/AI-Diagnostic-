import React, { useState, useEffect } from 'react';
import { Search, Trash2, Ban } from 'lucide-react';
import type { User as UserType } from '../../types';
import { adminService } from '../../services/adminService';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadUsers() {
      const data = await adminService.getUsers();
      setUsers(data);
    }
    loadUsers();
  }, []);

  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const handleToggleDisable = (id: string) => {
    alert(`Toggled user status for user ID: ${id}`);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user record?')) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
            User Administration
          </span>
          <h1 className="text-2xl font-extrabold text-white font-outfit">User Management</h1>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
        />
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Registered Date</th>
              <th className="py-3 px-4">Assessments</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4">
                  <span className="font-bold text-white block">{u.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{u.email}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    u.role === 'admin' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">{u.createdAt}</td>
                <td className="py-3.5 px-4 font-bold text-indigo-400">{u.assessmentCount}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleDisable(u.id)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                    title="Disable User"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
