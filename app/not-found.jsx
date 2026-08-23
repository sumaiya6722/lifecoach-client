'use client'

import Link from 'next/link';
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12">
      {/* Floating Card Container matching the Navbar & Footer Theme */}
      <div className="max-w-2xl w-full bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm p-8 sm:p-12 text-center space-y-6">
        
        {/* Animated Visual Badge */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-emerald-100 text-emerald-600 font-extrabold text-3xl shadow-sm animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-10 h-10"
          >
            <circle cx="12" cy="12" r="10"/>
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
          </svg>
        </div>

        {/* Big 404 Heading */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Error 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Lost Your Way?
          </h1>
        </div>

        {/* Thoughtful Life-Coach Message */}
        <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
          Even the best life journeys have unexpected turns. The page or life lesson you are looking for doesn’t exist or has moved.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link 
            href="/" 
            className="w-full sm:w-auto btn bg-[#0b1b3d] hover:bg-emerald-600 text-white font-medium rounded-full px-8 shadow-md border-none transition-all"
          >
            Return Home
          </Link>

          <Link 
            href="/lessons" 
            className="w-full sm:w-auto btn btn-ghost text-gray-700 hover:text-emerald-600 font-medium rounded-full px-6"
          >
            Explore Public Lessons
          </Link>
        </div>

      </div>
    </div>
  );
}