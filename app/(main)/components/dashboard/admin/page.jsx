'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Users, 
  BookOpen, 
  Flag, 
  TrendingUp, 
  Award, 
  Calendar 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdminStats() {
      try {
        const res = await fetch('http://localhost:5000/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load admin stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Platform Analytics...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Platform Dashboard</h1>
        <p className="text-sm text-gray-500">Monitor platform metrics, content status, and user engagement.</p>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Users */}
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalUsers || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-md">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Public Lessons */}
        <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Public Lessons</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalPublicLessons || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Reported Lessons */}
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Flagged / Reported</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalReportedLessons || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-md">
            <Flag className="w-6 h-6" />
          </div>
        </div>

        {/* Today's New Lessons */}
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">New Today</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.todaysNewLessons || 0}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-md">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Analytics & Top Contributors Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Lesson & User Growth Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" /> Platform Growth
            </h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.growthData?.lessonGrowth || []}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Active Contributors List (1 Column) */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Top Contributors
          </h2>

          <div className="space-y-4">
            {stats?.mostActiveContributors?.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No activity recorded yet.</p>
            ) : (
              stats?.mostActiveContributors?.map((contributor, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/40 border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-300 shrink-0">
                      <Image 
                        src={contributor.photoURL || 'https://via.placeholder.com/150'} 
                        alt={contributor.name || 'User'} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{contributor.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-gray-400">{contributor._id}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-black">
                    {contributor.lessonCount} Lessons
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}