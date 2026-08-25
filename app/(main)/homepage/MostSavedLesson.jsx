'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import LessonCard from '@/app/(main)/components/cards/LessonCard';

export default function MostSavedLessonsSection() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedLessons() {
      try {
        const res = await fetch('http://localhost:5000/homepage/most-saved-lessons');
        if (res.ok) {
          const data = await res.json();
          setLessons(data);
        }
      } catch (error) {
        console.error('Failed to load most saved lessons:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSavedLessons();
  }, []);

  if (loading) {
    return (
      <div className="py-8 flex justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-6">
        <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-amber-500" /> Most Saved Lessons
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Top-rated insights bookmarked by our community.
        </p>
      </div>

      {lessons.length === 0 ? (
        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 text-center text-gray-500 text-xs italic">
          No saved lessons found yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <LessonCard key={lesson._id} lesson={lesson} />
          ))}
        </div>
      )}
    </section>
  );
}