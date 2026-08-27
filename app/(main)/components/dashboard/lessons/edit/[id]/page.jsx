'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useSession, authClient } from '../../../../../../lib/auth-client';

export default function EditLessonPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Personal Growth',
    tone: 'Motivational',
    visibility: 'Public',
    accessLevel: 'Free',
    story: '',
    imageUrl: '',
  });

  const isPremiumUser = user?.plan === 'user_premium' || user?.plan === 'admin_premium';

  const categories = ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned'];
  const emotionalTones = ['Motivational', 'Sad', 'Realization', 'Gratitude'];

  // Helper to fetch authorization header safely
  const getAuthHeaders = async () => {
    const { data: tokenData } = await authClient.token();
    return {
      'Content-Type': 'application/json',
      ...(tokenData?.token ? { Authorization: `Bearer ${tokenData.token}` } : {})
    };
  };

  // Fetch pre-filled data on page load with token
  useEffect(() => {
    async function fetchLesson() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons/${id}`, {
          headers
        });

        if (res.ok) {
          const data = await res.json();
          setFormData({
            title: data.title || '',
            category: data.category || 'Personal Growth',
            tone: data.tone || 'Motivational',
            visibility: data.visibility || 'Public',
            accessLevel: data.accessLevel || 'Free',
            story: data.story || '',
            imageUrl: data.imageUrl || '',
          });
        } else {
          toast.error('Failed to load lesson details.');
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
        toast.error('Server error loading lesson.');
      } finally {
        setLoading(false);
      }
    }

    if (id && !isPending) {
      fetchLesson();
    }
  }, [id, isPending]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('Lesson updated successfully!');
        setTimeout(() => {
          router.push(`/components/dashboard/my-lessons/${id}`);
        }, 1500);
      } else {
        toast.error('Failed to update lesson.');
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Server error updating lesson.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-amber-500"></span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-10 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto">

        {/* Top Cancel Link */}
        <Link
          href={`/components/dashboard/my-lessons/${id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Go Back
        </Link>

        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border border-amber-200/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Update Wisdom
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight dark:text-white">
            Edit Your Life Lesson
          </h1>
        </div>

        {/* Form Container */}
        <div className="relative bg-linear-to-br from-amber-50/90 via-orange-50/40 to-amber-100/60 backdrop-blur-md rounded-3xl border border-amber-200/70 shadow-2xl p-6 sm:p-10">

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
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-200/80 outline-none text-gray-800 bg-white/80 focus:bg-white"
              />
            </div>

            {/* Category & Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-bold text-gray-800 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200/80 outline-none text-gray-800 bg-white/80"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="tone" className="block text-sm font-bold text-gray-800 mb-2">
                  Emotional Tone
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200/80 outline-none text-gray-800 bg-white/80"
                >
                  {emotionalTones.map((tone) => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visibility & Access Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="visibility" className="block text-sm font-bold text-gray-800 mb-2">
                  Visibility
                </label>
                <select
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-amber-200/80 outline-none text-gray-800 bg-white/80"
                >
                  <option value="Public">Public (Visible on Explore)</option>
                  <option value="Private">Private (Only visible to you)</option>
                </select>
              </div>

              <div>
                <label htmlFor="accessLevel" className="block text-sm font-bold text-gray-800 mb-2">
                  Access Level
                </label>
                <select
                  id="accessLevel"
                  name="accessLevel"
                  disabled={!isPremiumUser}
                  value={formData.accessLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border outline-none text-gray-800 bg-white/80 disabled:opacity-50"
                >
                  <option value="Free">Free (Available to everyone)</option>
                  <option value="Premium">Premium (Paid Members Only)</option>
                </select>
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
                value={formData.story}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-200/80 outline-none text-gray-800 bg-white/80 resize-y"
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-bold text-gray-800 mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-amber-200/80 outline-none text-gray-800 bg-white/80"
              />
            </div>

            {/* Save Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? 'Saving Changes...' : 'Save & Update Lesson'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}