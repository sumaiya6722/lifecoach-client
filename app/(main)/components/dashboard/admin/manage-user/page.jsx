'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { ShieldCheck, User, Trash2, ShieldAlert, BookOpen, Search } from 'lucide-react';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all users on mount
  useEffect(() => {
    let isMounted = true;

    async function fetchUsers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setUsers(data);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load user list');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handler to change user role (Promote/Demote)
  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmMsg = `Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success(`User role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('An error occurred while updating role');
    }
  };

  // Handler to delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${userName || 'this user'}?`)) {
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('User deleted successfully');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred while deleting user');
    }
  };

  // Filter users by search input
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Users...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight dark:text-white">Manage Users</h1>
          <p className="text-sm text-gray-500">View user statistics, promote accounts to admin, or remove accounts.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-amber-200 text-sm text-gray-800 bg-white outline-hidden focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/60 border-b border-amber-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Lessons Created</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 italic">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => (
                  <tr key={item._id} className="hover:bg-amber-50/30 transition-colors">

                    {/* User Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-200 shrink-0 bg-amber-100 flex items-center justify-center">
                          {item.image || item.photoURL ? (
                            <Image
                              src={item.image || item.photoURL}
                              alt={item.name || 'User'}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.name || 'Anonymous User'}</p>
                          <p className="text-xs text-gray-500">{item.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-6">
                      {item.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                          <User className="w-3.5 h-3.5 text-gray-400" /> User
                        </span>
                      )}
                    </td>

                    {/* Total Lessons Created */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        {item.totalLessons || 0}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Promote / Demote Button */}
                        <button
                          onClick={() => handleRoleChange(item._id, item.role)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${item.role === 'admin'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            }`}
                        >
                          {item.role === 'admin' ? (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" /> Make User
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" /> Make Admin
                            </>
                          )}
                        </button>

                        {/* Delete User Button */}
                        <button
                          onClick={() => handleDeleteUser(item._id, item.name)}
                          className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}