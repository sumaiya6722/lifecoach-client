'use client'

import React from 'react';

const BENEFIT_CARDS = [
  {
    id: 1,
    icon: "🧠",
    badge: "Mindful Reflection",
    title: "Turn Experience Into Wisdom",
    description: "Every trial, failure, and breakthrough holds lessons. Documenting your personal journey helps synthesize raw experiences into actionable wisdom.",
    accentColor: "bg-amber-100 text-amber-700 border-amber-200",
    hoverBorder: "hover:border-amber-300",
  },
  {
    id: 2,
    icon: "🤝",
    badge: "Community Impact",
    title: "Help Others Avoid Pitfalls",
    description: "Your life story is someone else's survival guide. Sharing your reflections empowers others to navigate similar obstacles with confidence.",
    accentColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    hoverBorder: "hover:border-emerald-300",
  },
  {
    id: 3,
    icon: "📜",
    badge: "Legacy Building",
    title: "Preserve Your Personal Journey",
    description: "Create a lasting digital archive of your values, insights, and growth that remains meaningful for future generations and mentee communities.",
    accentColor: "bg-blue-100 text-blue-700 border-blue-200",
    hoverBorder: "hover:border-blue-300",
  },
  {
    id: 4,
    icon: "📈",
    badge: "Continuous Growth",
    title: "Track Personal Evolution",
    description: "Reflecting regularly allows you to measure emotional growth, identify behavioral patterns, and stay aligned with your long-term goals.",
    accentColor: "bg-purple-100 text-purple-700 border-purple-200",
    hoverBorder: "hover:border-purple-300",
  },
];

const LessonMatter = () => {
  return (
    <section className="relative w-full px-4 py-16 overflow-hidden">
      {/* Floating Glassmorphic Container matching Banner & Sign Up */}
      <div className="max-w-7xl mx-auto bg-linear-to-br from-amber-50/60 via-white/80 to-amber-50/40 backdrop-blur-md border border-gray-100 rounded-3xl shadow-sm p-8 sm:p-12 lg:p-16 relative overflow-hidden">
        
        {/* Subtle Background Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 relative z-10 mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold tracking-wide shadow-2xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Core Values</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Why Learning From <span className="text-emerald-600 underline decoration-amber-300 underline-offset-4">Life Matters</span>
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Preserving and sharing personal wisdom transforms lived experience into actionable growth—not just for yourself, but for a global network of learners.
          </p>
        </div>

        {/* 4 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {BENEFIT_CARDS.map((card) => (
            <div
              key={card.id}
              className={`bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between ${card.hoverBorder}`}
            >
              <div>
                {/* Icon & Badge Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-xs">
                    {card.icon}
                  </div>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${card.accentColor}`}>
                    {card.badge}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Bottom Subtle Indicator Line */}
              <div className="mt-6 pt-4 border-t border-gray-100/80 flex items-center justify-between text-xs text-gray-400 font-medium">
                <span>Value #{card.id}</span>
                <span className="text-emerald-600 font-bold">✦ Preserved Wisdom</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default LessonMatter;