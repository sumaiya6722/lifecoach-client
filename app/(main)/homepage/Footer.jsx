'use client'

import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <div className="w-full px-4 pt-12 pb-6 bg-transparent">
      {/* Container matching the Navbar's rounded card aesthetic */}
      <div className="max-w-7xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 rounded-md shadow-sm p-8 md:p-12 transition-colors">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-9 w-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-extrabold text-xl group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight leading-none">
                  life<span className="text-amber-600 dark:text-amber-500">Coach</span>
                </span>
                <span className="text-[9px] font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase leading-tight">
                  Digital Wisdom
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Preserve personal wisdom, reflect on growth, and learn from life experiences shared by a global community.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm tracking-wide uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/lessons" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Public Lessons</Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing & Plans</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm tracking-wide uppercase">Contact Info</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@lifecoach.com</span>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm tracking-wide uppercase">Follow Us</h4>
            <div className="flex items-center gap-3">
              {/* X Logo */}
              <a href="https://x.com" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-[#0b1b3d] dark:hover:bg-amber-500 hover:text-white dark:hover:text-gray-950 transition-all border border-transparent dark:border-gray-700" aria-label="X (formerly Twitter)">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-gray-950 transition-all border border-transparent dark:border-gray-700" aria-label="Facebook">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white dark:hover:text-gray-950 transition-all border border-transparent dark:border-gray-700" aria-label="LinkedIn">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Terms & Copyright */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} lifeCoach. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms & Conditions</Link>
            <Link href="/privacy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;