'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Award, UserCheck, Sparkles } from 'lucide-react';

export default function TopContributorsSection() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchContributors() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homepage/top-contributors-week`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setContributors(data);
        }
      } catch (error) {
        console.error('Failed to load top contributors:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchContributors();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="py-10 mt-4 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header with entrance animation */}
      <div className="mb-8 transition-all duration-700 ease-out">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-800 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Weekly Leaderboard
        </div>
        <h2 className="text-3xl dark:text-white sm:text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
          <Award className="w-8 h-8 text-amber-500 animate-bounce" /> Top Contributors of the Week
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Creators who published the most life insights in the last 7 days.
        </p>
      </div>

      {contributors.length === 0 ? (
        <div className="p-8 rounded-3xl bg-amber-50/40 border border-amber-100/80 text-center text-gray-500 text-xs italic shadow-xs">
          No active contributors recorded this week.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contributors.map((creator, idx) => (
            <div
              key={creator._id || idx}
              style={{ animationDelay: `${idx * 150}ms` }}
              className="group bg-linear-to-b from-white to-amber-50/30 rounded-3xl border border-amber-100 p-6 shadow-xs hover:shadow-xl hover:border-amber-300 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center relative overflow-hidden"
            >
              {/* Subtle top glow bar on hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-linear-to-r from-amber-300 via-amber-500 to-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Rank Badge */}
              <span className="absolute top-4 right-4 w-8 h-8 rounded-2xl bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center border border-amber-300 shadow-xs group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-white transition-all duration-300">
                #{idx + 1}
              </span>

              {/* Avatar with hover ring zoom */}
              <div className="relative w-20 h-20 rounded-full p-1 bg-linear-to-tr from-amber-400 to-amber-200 mb-4 shadow-sm group-hover:shadow-md transition-transform duration-300 group-hover:scale-105">
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={creator.photoURL || 'https://via.placeholder.com/150'}
                    alt={creator.name || 'User'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Contributor Name */}
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-1.5 group-hover:text-amber-600 transition-colors">
                {creator.name || 'Anonymous User'}
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              </h3>
              <p className="text-[11px] text-gray-400 mb-5 max-w-45 truncate">{creator._id}</p>

              {/* Stat Pill */}
              <div className="mt-auto w-full py-2 px-3 rounded-2xl bg-white text-amber-950 text-xs font-bold border border-amber-200/80 shadow-xs group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all duration-300">
                {creator.recentLessonsCount} Lessons Posted
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}