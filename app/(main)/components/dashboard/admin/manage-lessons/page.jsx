'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import {
  BookOpen,
  Lock,
  Flag,
  Star,
  CheckCircle,
  Trash2,
  Filter,
  ShieldAlert
} from 'lucide-react';

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [stats, setStats] = useState({ publicCount: 0, privateCount: 0, flaggedCount: 0 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [visibilityFilter, setVisibilityFilter] = useState('All');
  const [onlyFlagged, setOnlyFlagged] = useState(false);

  // Fetch Lessons and Stats with memoization to satisfy ESLint hooks rules
  useEffect(() => {
    let isMounted = true;

    async function fetchLessons() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          category: categoryFilter,
          visibility: visibilityFilter,
          flagged: onlyFlagged.toString(),
        });

        const res = await fetch(`http://localhost:5000/admin/lessons?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setLessons(data.lessons);
            setStats(data.stats);
          }
        }
      } catch (error) {
        console.error('Failed to load admin lessons:', error);
        toast.error('Failed to load lessons list');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchLessons();

    return () => {
      isMounted = false;
    };
  }, [categoryFilter, visibilityFilter, onlyFlagged]);

  // Handler: Toggle Featured
  const handleToggleFeatured = async (lessonId, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/lessons/${lessonId}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !currentStatus }),
      });

      if (res.ok) {
        toast.success(`Lesson ${!currentStatus ? 'added to' : 'removed from'} Featured`);
        setLessons((prev) =>
          prev.map((l) => (l._id === lessonId ? { ...l, isFeatured: !currentStatus } : l))
        );
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  // Handler: Mark Content as Reviewed
  const handleMarkReviewed = async (lessonId) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/lessons/${lessonId}/reviewed`, {
        method: 'PATCH',
      });

      if (res.ok) {
        toast.success('Lesson marked as reviewed');
        setLessons((prev) =>
          prev.map((l) =>
            l._id === lessonId ? { ...l, isReported: false, reportsCount: 0, isReviewed: true } : l
          )
        );
        setStats((prev) => ({ ...prev, flaggedCount: Math.max(0, prev.flaggedCount - 1) }));
      }
    } catch (error) {
      console.error('Error marking as reviewed:', error);
      toast.error('Failed to mark lesson as reviewed');
    }
  };

  // Handler: Delete Inappropriate Lesson
  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${lessonTitle || 'this lesson'}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/admin/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Lesson deleted successfully');
        setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      } else {
        toast.error('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('An error occurred while deleting');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-8">

      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight dark:text-white">Manage Lessons</h1>
        <p className="text-sm text-gray-500">Review content, moderate reported posts, and manage home page featured lessons.</p>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Public Lessons</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1 dark:text-white">{stats.publicCount}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Private Lessons</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1 dark:text-white">{stats.privateCount}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Flagged / Reported</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1 dark:text-white">{stats.flaggedCount}</h3>
          </div>
          <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-md">
            <Flag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filtering Bar */}
      <div className="bg-white p-4 rounded-3xl border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <Filter className="w-4 h-4 text-amber-500" /> Filters:
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-amber-200 text-xs font-medium bg-amber-50/30 text-gray-800 outline-hidden focus:ring-2 focus:ring-amber-400"
          >
            <option value="All">All Categories</option>
            <option value="Personal Growth">Personal Growth</option>
            <option value="Career">Career</option>
            <option value="Health">Health</option>
            <option value="Relationships">Relationships</option>
            <option value="Mindfulness">Mindfulness</option>
          </select>

          {/* Visibility Filter */}
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-amber-200 text-xs font-medium bg-amber-50/30 text-gray-800 outline-hidden focus:ring-2 focus:ring-amber-400"
          >
            <option value="All">All Visibility</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>

          {/* Flagged Toggle */}
          <button
            onClick={() => setOnlyFlagged(!onlyFlagged)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${onlyFlagged
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
              }`}
          >
            <Flag className="w-3.5 h-3.5" /> Only Flagged
          </button>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs text-gray-500">Loading lessons list...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-50/60 border-b border-amber-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-4 px-6">Lesson</th>
                  <th className="py-4 px-6">Creator</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100/60 text-sm">
                {lessons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 italic">
                      No lessons found matching your filters.
                    </td>
                  </tr>
                ) : (
                  lessons.map((lesson) => (
                    <tr key={lesson._id} className="hover:bg-amber-50/30 transition-colors">

                      {/* Title & Featured Indicator */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {lesson.isFeatured && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" title="Featured" />
                          )}
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{lesson.title}</p>
                            <span className="text-[10px] text-gray-400">ID: {lesson._id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Creator Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-200 shrink-0 bg-amber-100">
                            <Image
                              src={lesson.creator?.photoURL || 'https://via.placeholder.com/150'}
                              alt={lesson.creator?.name || 'Creator'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-800">{lesson.creator?.name || 'Anonymous'}</span>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
                          {lesson.category || 'General'}
                        </span>
                      </td>

                      {/* Status / Flag Badges */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${lesson.accessLevel === 'Private' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {lesson.accessLevel || 'Public'}
                          </span>

                          {(lesson.isReported || lesson.reportsCount > 0) && (
                            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3" /> Flagged ({lesson.reportsCount || 1})
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Admin Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle Featured */}
                          <button
                            onClick={() => handleToggleFeatured(lesson._id, lesson.isFeatured)}
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${lesson.isFeatured
                                ? 'bg-amber-100 text-amber-700 border-amber-300'
                                : 'bg-gray-50 text-gray-400 border-gray-200 hover:text-amber-500'
                              }`}
                            title={lesson.isFeatured ? 'Remove from Featured' : 'Make Featured'}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>

                          {/* Mark Reviewed */}
                          {(lesson.isReported || lesson.reportsCount > 0) && (
                            <button
                              onClick={() => handleMarkReviewed(lesson._id)}
                              className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                              title="Mark as Reviewed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Lesson */}
                          <button
                            onClick={() => handleDeleteLesson(lesson._id, lesson.title)}
                            className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                            title="Delete Inappropriate Lesson"
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
        )}
      </div>
    </div>
  );
}