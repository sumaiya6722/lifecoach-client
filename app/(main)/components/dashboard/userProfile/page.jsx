'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Mail,
  BookOpen,
  Bookmark,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useSession } from '../../../../lib/auth-client';
import LessonCard from '../../cards/LessonCard';

export default function ProfilePage() {
  const { data: session, isPending, update: updateSession } = useSession();
  const user = session?.user;

  // Derive status
  const isPremiumUser = user?.plan === 'user_premium' || user?.plan === 'admin_premium';

  // Component State
  const [userLessons, setUserLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [image, setImage] = useState('');

  // Open Edit Mode and safely populate form inputs from latest session
  const handleStartEdit = () => {
    setName(user?.name || '');
    setImage(user?.image || user?.photoURL || '');
    setIsEditing(true);
  };

  // Fetch Public Lessons created by this user
  useEffect(() => {
    async function fetchUserLessons() {
      if (!user?.email) return;

      try {
        setLoadingLessons(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/user-lessons?email=${encodeURIComponent(user.email)}`
        );

        if (res.ok) {
          const data = await res.json();

          // Case-insensitive check for 'Public' / 'public'
          const publicLessons = data
            .filter((lesson) => lesson.visibility?.toLowerCase() === 'public')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setUserLessons(publicLessons);
        }
      } catch (error) {
        console.error('Failed to fetch user lessons:', error);
      } finally {
        setLoadingLessons(false);
      }
    }

    if (user?.email) {
      fetchUserLessons();
    }
  }, [user?.email]);

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/users/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          name,
          image,
        }),
      });

      if (res.ok) {
        if (updateSession) {
          await updateSession({ name, image });
        }
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Server error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-xs text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">

      {/* Profile Header Card */}
      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-xl p-6 sm:p-10 mb-12 overflow-hidden">

        {/* Decorative background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

          {/* Avatar Section */}
          <div className="relative group shrink-0">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-md bg-amber-50">
              <Image
                src={user?.image || user?.photoURL || 'https://via.placeholder.com/150'}
                alt={user?.name || 'User Avatar'}
                fill
                className="object-cover"
              />
            </div>
            {isPremiumUser && (
              <div className="absolute -bottom-2 -right-2 bg-linear-to-r from-amber-500 to-orange-500 text-white p-2 rounded-full shadow-lg border-2 border-white" title="Premium Member">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
            )}
          </div>

          {/* User Info & Edit Form */}
          <div className="flex-1 text-center md:text-left w-full">

            {!isEditing ? (
              <div>
                <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 mb-2">
                  <h1 className="text-3xl font-black text-gray-900">{user?.name || 'User Name'}</h1>

                  {isPremiumUser && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 fill-white" /> Premium ⭐
                    </span>
                  )}
                </div>

                <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-1.5 text-sm mb-6">
                  <Mail className="w-4 h-4 text-amber-500" /> {user?.email}
                </p>

                <button
                  onClick={handleStartEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>
            ) : (
              /* Inline Edit Form */
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 outline-none text-sm text-gray-800 focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Photo URL</label>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 outline-none text-sm text-gray-800 focus:ring-2 focus:ring-amber-400 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Email (Cannot be changed)</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-amber-100 max-w-md">
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-black text-gray-900 block">
                    {user?.lessonsCount || userLessons.length || 0}
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lessons Created</span>
                </div>
              </div>

              <div className="bg-orange-50/70 border border-orange-200/60 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-3 bg-orange-100 text-orange-700 rounded-xl shrink-0">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xl font-black text-gray-900 block">
                    {user?.savedCount || 0}
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Lessons</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Public Created Lessons Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-amber-200/60 pb-4">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" /> Public Lessons by {user?.name?.split(' ')[0] || 'User'}
          </h2>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            {userLessons.length} Published
          </span>
        </div>

        {loadingLessons ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-gray-500">Loading public lessons...</p>
          </div>
        ) : userLessons.length === 0 ? (
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-10 text-center">
            <p className="text-gray-600 font-medium text-sm">No public lessons published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLessons.map((lesson) => (
              <LessonCard key={lesson._id || lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}