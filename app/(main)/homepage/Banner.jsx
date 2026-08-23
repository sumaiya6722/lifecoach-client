'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Import Swiper React components and required modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Optimized Unsplash URLs (forces 800px width and webp/jpg compression)
const SLIDES = [
  {
    id: 1,
    badgeText: "Transform Your Journey",
    badgeColor: "bg-blue-100 border-blue-200 text-blue-800",
    badgeDot: "bg-blue-500",
    headline: (
      <>
        Master <span className="text-blue-900 underline decoration-amber-300 underline-offset-4">Life Lessons</span> Anytime, Anywhere!
      </>
    ),
    description: "Discover real life wisdom, reflect on meaningful personal growth, and share life-changing insights with a global community of lifelong learners.",
    primaryBtnText: "Explore Lessons",
    primaryBtnLink: "/lessons",
    featuredTag: "Featured Insight",
    featuredTitle: "Overcoming Fear of Failure",
    featuredImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=75",
    cardGradient: "bg-gradient-to-tr from-purple-500 to-amber-400",
    authorName: "Sarah Jenkins",
    authorRole: "Mindset Coach",
    authorAvatar: "https://i.pravatar.cc/100?img=12",
    rating: "4.9",
  },
  {
    id: 2,
    badgeText: "Empower Your Career",
    badgeColor: "bg-amber-100 border-amber-200 text-amber-800",
    badgeDot: "bg-amber-500",
    headline: (
      <>
        Learn from <span className="text-amber-700 underline decoration-blue-300 underline-offset-4">Top Mentors</span> & Coaches!
      </>
    ),
    description: "Connect 1-on-1 with verified life coaches and industry leaders to help guide your mental clarity, career milestones, and personal habits.",
    primaryBtnText: "Find a Coach",
    primaryBtnLink: "/coaches",
    featuredTag: "Mentorship",
    featuredTitle: "Building Habits That Stick",
    featuredImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=75",
    cardGradient: "bg-gradient-to-tr from-blue-600 to-emerald-400",
    authorName: "David Chen",
    authorRole: "Productivity Guide",
    authorAvatar: "https://i.pravatar.cc/100?img=33",
    rating: "5.0",
  },
  {
    id: 3,
    badgeText: "Share & Inspire",
    badgeColor: "bg-emerald-100 border-emerald-200 text-emerald-800",
    badgeDot: "bg-emerald-500",
    headline: (
      <>
        Build Your <span className="text-emerald-700 underline decoration-purple-300 underline-offset-4">Wisdom Portfolio</span> Today!
      </>
    ),
    description: "Write your story, publish your hard-earned experiences, and inspire thousands who are navigating the exact path you once walked.",
    primaryBtnText: "Start Writing",
    primaryBtnLink: "/register",
    featuredTag: "Community Story",
    featuredTitle: "The Power of Mindful Growth",
    featuredImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=75",
    cardGradient: "bg-gradient-to-tr from-emerald-500 to-amber-300",
    authorName: "Elena Rostova",
    authorRole: "Wellness Creator",
    authorAvatar: "https://i.pravatar.cc/100?img=47",
    rating: "4.8",
  },
];

const Banner = () => {
  return (
    <section className="relative w-full px-4 pt-6 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto bg-linear-to-br from-amber-50/60 via-white/80 to-amber-50/40 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xs p-6 sm:p-10 lg:p-14 relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="banner-swiper relative z-10"
        >
          {SLIDES.map((slide, index) => (
            <SwiperSlide key={slide.id}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pb-8">
                
                {/* Left Column */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide shadow-xs ${slide.badgeColor}`}>
                    <span className={`flex h-2 w-2 rounded-full ${slide.badgeDot}`} />
                    <span>{slide.badgeText}</span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
                    {slide.headline}
                  </h1>

                  <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <Link
                      href={slide.primaryBtnLink}
                      className="btn bg-[#0b1b3d] hover:bg-emerald-600 text-white font-medium rounded-full px-8 py-3 shadow-md border-none transition-all text-center"
                    >
                      {slide.primaryBtnText}
                    </Link>

                    <Link
                      href="/register"
                      className="btn btn-ghost text-gray-800 hover:text-emerald-600 font-semibold rounded-full px-6 border border-gray-200 hover:border-emerald-300 transition-all text-center"
                    >
                      Start Sharing
                    </Link>
                  </div>

                  <div className="pt-6 border-t border-gray-200/60 grid grid-cols-3 gap-4 text-center sm:text-left max-w-lg">
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">10k+</p>
                      <p className="text-xs text-gray-500 font-medium">Wisdom Stories</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-emerald-600">98%</p>
                      <p className="text-xs text-gray-500 font-medium">Positive Impact</p>
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-gray-900">50k+</p>
                      <p className="text-xs text-gray-500 font-medium">Active Learners</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-5 relative flex justify-center">
                  <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-gray-100/80">
                    <div className={`relative h-56 w-full rounded-2xl overflow-hidden ${slide.cardGradient} flex items-center justify-center text-white`}>
                      <Image
                        src={slide.featuredImage}
                        alt={slide.featuredTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        priority={index === 0} // Preloads initial hero image immediately
                        className="object-cover mix-blend-overlay opacity-90"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10" />
                      <div className="absolute bottom-4 left-4 right-4 text-left z-20">
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                          {slide.featuredTag}
                        </span>
                        <h3 className="text-lg font-bold text-white mt-1">
                          {slide.featuredTitle}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={slide.authorAvatar}
                          alt={slide.authorName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border-2 border-emerald-500/20 object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-gray-900 leading-none">{slide.authorName}</p>
                          <p className="text-xs text-gray-500 mt-1">{slide.authorRole}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 text-sm font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                        ★ {slide.rating}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Banner;