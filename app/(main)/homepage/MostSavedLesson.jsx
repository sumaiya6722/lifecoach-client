'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import LessonCard from '@/app/(main)/components/cards/LessonCard';

export default function MostSavedLessonsSection() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSavedLessons() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/most-saved-lessons`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setLessons(data);
        }
      } catch (error) {
        console.error('Failed to load most saved lessons:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSavedLessons();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-100 text-center text-gray-500 text-xs italic">
          No saved lessons found yet.
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Clean Header */}
      <div className="mb-6 border-b border-amber-100 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-4xl sm:text-3xl font-black dark:text-white text-gray-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-500 fill-amber-500" /> Most Saved Lessons
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Top-rated insights bookmarked by our community.
          </p>
        </div>
      </div>

      {/* Clean Uniform 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, idx) => (
          <div key={lesson._id} className="flex flex-col space-y-2">
            {/* Rank Label above card */}
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-amber-800 px-1">
              <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px] shrink-0">
                #{idx + 1}
              </span>
              <span>{idx === 0 ? 'Most Bookmarked' : `Rank #${idx + 1}`}</span>
            </div>

            {/* Original Card Render */}
            <LessonCard lesson={lesson} />
          </div>
        ))}
      </div>
    </section>
  );
}