'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, User, ArrowLeft } from 'lucide-react';
import LessonCard from '@/app/(main)/components/cards/LessonCard';

export default function UserProfilePage({ params }) {
  const { userId } = use(params);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserLessons() {
      try {
        const res = await fetch(`http://localhost:5000/dashboard/lessons/user/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setLessons(data);
        }
      } catch (error) {
        console.error('Error fetching user lessons:', error);
      } finally {
        setLoading(false);
      }
    }

    if (userId) fetchUserLessons();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-amber-500"></span>
      </div>
    );
  }

  const creatorName = lessons[0]?.creator?.name || 'User';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
      {/* Back Button */}
      <Link 
        href="/components/dashboard/my-lessons" 
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </Link>

      {/* Header Banner */}
      <div className="bg-linear-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white mb-8 shadow-lg flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl">{creatorName}`s Lessons.....</h1>
          <p className="text-amber-100 text-sm font-medium mt-1">
            Exploring {lessons.length} life {lessons.length === 1 ? 'lesson' : 'lessons'} shared by this creator.
          </p>
        </div>
      </div>

      {/* Lessons Grid */}
      {lessons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-amber-100 p-8 shadow-xs">
          <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-800">No Lessons Found</h3>
          <p className="text-gray-500 text-sm mt-1">This author hasn`t published any public lessons yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      )}
    </div>
  );
}