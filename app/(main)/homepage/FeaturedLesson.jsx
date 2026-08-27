'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Sparkles, User, ArrowRight} from 'lucide-react';

export default function FeaturedLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/featured`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (isMounted) {
          setLessons(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load featured lessons:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center min-h-75">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-gray-500 font-medium">Curating featured wisdom...</p>
        </div>
      </section>
    );
  }

  if (lessons.length === 0) {
    return null; // Hide section entirely if admin hasn't featured any lessons yet
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Curated Insights
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight dark:text-white">
            Featured Life Lessons
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xl">
            Handpicked wisdom and transformative perspectives selected by our platform moderators.
          </p>
        </div>

        <Link
          href="/components/dashboard/my-lessons"
          className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors group"
        >
          Explore All Lessons
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid of Featured Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessons.map((lesson) => (
          <article
            key={lesson._id}
            className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
          >
            {/* Featured Badge */}
            <div className="absolute top-4 left-4 z-10 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> Featured
            </div>

            {/* Thumbnail Image */}
            <div className="relative h-48 w-full bg-amber-50 overflow-hidden">
              {lesson.imageUrl ? (
                <Image
                  src={lesson.imageUrl}
                  alt={lesson.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-amber-100/50">
                  <Sparkles className="w-10 h-10 text-amber-400" />
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                  {lesson.category || 'General Wisdom'}
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {lesson.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                  {lesson.description || lesson.content}
                </p>
              </div>

              {/* Author & Action Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                    {lesson.creator.name?.[0] || <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-xs font-semibold text-gray-700">
                    {lesson.creator.name || 'Anonymous'}
                  </span>
                </div>

                <Link
                  href={`/components/dashboard/my-lessons/${lesson._id}`}
                  className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-amber-500 transition-colors"
                >
                  Read Lesson
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}