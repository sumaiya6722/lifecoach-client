'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '../../../lib/auth-client'; // Or your custom Auth Hook
import {
  BookOpen,
  Bookmark,
  PlusCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

// Dummy Weekly Activity Data for Chart
const chartData = [
  { day: 'Mon', lessons: 1, favorites: 2 },
  { day: 'Tue', lessons: 2, favorites: 1 },
  { day: 'Wed', lessons: 0, favorites: 4 },
  { day: 'Thu', lessons: 3, favorites: 2 },
  { day: 'Fri', lessons: 1, favorites: 5 },
  { day: 'Sat', lessons: 4, favorites: 3 },
  { day: 'Sun', lessons: 2, favorites: 6 },
];

export default function DashboardHome() {
  const { data: session } = useSession();
  const user = session?.user;

  const [stats, setStats] = useState({ createdCount: 0, savedCount: 0 });
  const [recentLessons, setRecentLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user?.email) return;

      try {
        setLoading(true);

        // 1. Fetch User Stats (Created & Favorites Count)
        const statsRes = await fetch(
          `http://localhost:5000/dashboard/stats?email=${user.email}&userId=${user.id || user.email}`
        );
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        // 2. Fetch Recent Lessons created by user
        const recentRes = await fetch(
          `http://localhost:5000/dashboard/recent-lessons?email=${user.email}&limit=4`
        );
        if (recentRes.ok) {
          const recentData = await recentRes.json();
          setRecentLessons(recentData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
}, [user?.email, user?.id]);


  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10">
      {/* Header / Welcome Section */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, <span className="text-indigo-400">{user?.name || 'Coach'}</span> 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here is your learning overview and recent activity updates.
          </p>
        </div>

        {/* Quick Shortcut */}
        <Link
          href="/dashboard/add-lesson"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20 w-fit"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Lesson
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Total Lessons Created */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Lessons Created</p>
            <h3 className="text-3xl font-bold mt-2">
              {loading ? '...' : stats.createdCount}
            </h3>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
        </div>

        {/* Total Favorites Saved */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Saved (Favorites)</p>
            <h3 className="text-3xl font-bold mt-2">
              {loading ? '...' : stats.savedCount}
            </h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Bookmark className="w-7 h-7" />
          </div>
        </div>

        {/* Total Engagement / Contributions */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-sm font-medium text-slate-400">Weekly Reflection Pace</p>
            <h3 className="text-3xl font-bold mt-2">Active</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <TrendingUp className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Main Grid Section: Analytics Chart + Shortcuts & Recent Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column (2 Cols): Analytics Chart & Recent Lessons */}
        <div className="lg:col-span-2 space-y-8">

          {/* Analytics Chart */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  Weekly Reflection & Saved Activity
                </h2>
                <p className="text-xs text-slate-400 mt-1">Overview of interactions over the past week</p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="lessonsColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                    labelStyle={{ color: '#f8fafc' }}
                  />
                  <Area type="monotone" dataKey="lessons" stroke="#6366f1" fillOpacity={1} fill="url(#lessonsColor)" name="Lessons" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recently Added Lessons */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Recently Added Lessons
              </h2>
              <Link
                href="/dashboard/my-lessons"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-slate-400">Loading lessons...</p>
            ) : recentLessons.length === 0 ? (
              <p className="text-sm text-slate-400">No lessons created yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentLessons.map((lesson) => (
                  <div key={lesson._id} className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-3 flex gap-3 items-center">
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                      <Image
                        src={
                          lesson.imageUrl && lesson.imageUrl.startsWith('http')
                            ? lesson.imageUrl
                            : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop'
                        }
                        alt={lesson.title || 'Lesson'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-medium text-sm text-slate-200 truncate">{lesson.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 capitalize">{lesson.category || 'General'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Quick Action Shortcuts */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4">Quick Shortcuts</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/add-lesson"
              className="flex items-center justify-between p-3.5 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/40 rounded-xl text-sm font-medium transition"
            >
              <span className="flex items-center gap-2.5">
                <PlusCircle className="w-4 h-4 text-indigo-400" />
                Add New Reflection
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/components/dashboard/my-favorites"
              className="flex items-center justify-between p-3.5 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/40 rounded-xl text-sm font-medium transition"
            >
              <span className="flex items-center gap-2.5">
                <Bookmark className="w-4 h-4 text-amber-400" />
                View Saved Favorites
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/components/dashboard/userProfile"
              className="flex items-center justify-between p-3.5 bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/40 rounded-xl text-sm font-medium transition"
            >
              <span className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                My Created Lessons
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}