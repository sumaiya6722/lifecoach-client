'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, ImagePlus, Send, AlertCircle, Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { useSession } from '../../../../lib/auth-client';

export default function AddLessonPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  // Derive premium status from user.plan
  const isPremiumUser =
    user?.plan === 'user_premium' || user?.plan === 'admin_premium';

  const categories = [
    'Personal Growth',
    'Career',
    'Relationships',
    'Mindset',
    'Mistakes Learned',
  ];

  const emotionalTones = [
    'Motivational',
    'Sad',
    'Realization',
    'Gratitude',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('You must be logged in to post a lesson.');
      router.push('/login');
      return;
    }

    setLoading(true);

    // 1. Collect form data natively
    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // 2. Combine collected form values with session user data
    const lessonPayload = {
      ...rawData,
      accessLevel: isPremiumUser ? rawData.accessLevel : 'Free',
      creator: {
        userId: user.id || user._id,
        name: user.name,
        email: user.email,
        photoURL: user.image || user.photoURL || '',
      },
      likes: [],
      likesCount: 0,
      isFeatured: false,
      isReviewed: false,
      createdAt: new Date(),
    };

    try {
      const res = await fetch('http://localhost:5000/dashboard/lessons', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(lessonPayload),
      });

      const data = await res.json();

      if (res.ok && (data.insertedId || data.acknowledged)) {
        toast.success('Your lesson was added successfully!');
        router.push('/');
      } else {
        toast.error(data.message || 'Failed to add lesson.');
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-amber-500"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 overflow-hidden">
      {/* Ambient Decorative Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-125 h-75 bg-amber-200/40 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-87 h-62 bg-orange-200/30 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border border-amber-200/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> Share Your Wisdom
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight dark:text-white">
            Create a New Life Lesson
          </h1>
          <p className="mt-2 text-gray-600 font-medium">
            Inspire others by sharing your personal experiences, insights, and lessons learned.
          </p>
        </div>

        {/* Form Container */}
        <div className="relative bg-linear-to-br from-amber-50/90 via-orange-50/40 to-amber-100/60 backdrop-blur-md rounded-3xl border border-amber-200/70 shadow-2xl shadow-amber-900/10 p-6 sm:p-10">

          <div className="hidden sm:flex absolute -top-4 right-8 bg-white/90 backdrop-blur border border-amber-200 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Warm Community Hub
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Lesson Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-800 mb-2">
                Lesson Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="e.g., Failure is Just Data in Disguise"
                className="w-full px-4 py-3 rounded-xl border border-amber-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white/80 focus:bg-white shadow-sm"
              />
            </div>

            {/* Category & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-gray-800 mb-2">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue="Personal Growth"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800 bg-white/80 focus:bg-white cursor-pointer shadow-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-bold text-gray-800 mb-2">
                  Emotional Tone <span className="text-rose-500">*</span>
                </label>
                <select
                  id="tone"
                  name="tone"
                  defaultValue="Motivational"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800 bg-white/80 focus:bg-white cursor-pointer shadow-sm"
                >
                  {emotionalTones.map((tone) => (
                    <option key={tone} value={tone}>
                      {tone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visibility & Access Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="visibility" className="block text-sm font-bold text-gray-800 mb-2">
                  Visibility <span className="text-rose-500">*</span>
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  defaultValue="Public"
                  className="w-full px-4 py-3 rounded-xl border border-amber-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800 bg-white/80 focus:bg-white cursor-pointer shadow-sm"
                >
                  <option value="Public">Public (Visible on Explore)</option>
                  <option value="Private">Private (Only visible to you)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="accessLevel" className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    Access Level
                    {!isPremiumUser && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300/60">
                        <Lock className="w-3 h-3" /> FREE USER
                      </span>
                    )}
                  </label>

                  {!isPremiumUser && (
                    <div className="tooltip tooltip-left sm:tooltip-top" data-tip="Upgrade to Premium to create paid lessons.">
                      <span className="text-xs text-amber-700 underline flex items-center gap-1 cursor-pointer font-medium hover:text-amber-800 transition-colors">
                        <AlertCircle className="w-3.5 h-3.5" /> Locked?
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="accessLevel"
                    name="accessLevel"
                    disabled={!isPremiumUser}
                    defaultValue="Free"
                    className={`w-full px-4 py-3 rounded-xl border outline-none transition-all appearance-none shadow-sm ${
                      isPremiumUser
                        ? 'border-amber-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 bg-white/80 cursor-pointer text-gray-800'
                        : 'border-amber-200/50 bg-amber-100/40 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <option value="Free">Free (Available to everyone)</option>
                    <option value="Premium">Premium (Paid Members Only)</option>
                  </select>

                  {!isPremiumUser && (
                    <Lock className="w-4 h-4 text-amber-600/60 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>
              </div>
            </div>

            {/* Story */}
            <div>
              <label htmlFor="story" className="block text-sm font-bold text-gray-800 mb-2">
                Full Description / Story / Insight <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="story"
                name="story"
                required
                rows={6}
                placeholder="Detail the experience, what went wrong, what you learned..."
                className="w-full px-4 py-3 rounded-xl border border-amber-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white/80 focus:bg-white resize-y shadow-sm"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-800 mb-2">
                Cover Image URL <span className="text-xs text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=10…"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-amber-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white/80 focus:bg-white shadow-sm"
                />
                <ImagePlus className="w-5 h-5 text-amber-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#0b1b3d] hover:bg-emerald-600 text-white font-bold text-base shadow-lg shadow-emerald-950/10 hover:shadow-emerald-600/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Publish Lesson
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}