'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { 
  ShieldCheck, 
  Mail, 
  User, 
  Camera, 
  Save, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Activity 
} from 'lucide-react';
import { authClient } from '../../../../../lib/auth-client'; 

export default function AdminProfilePage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const [saving, setSaving] = useState(false);

  // Activity summary stats
  const [activity, setActivity] = useState({
    lessonsModerated: 0,
    totalLessons: 0,
    totalUsers: 0
  });

  // Fetch metrics without calling synchronous setState in the effect body
  useEffect(() => {
    let isMounted = true;
    const email = session?.user?.email;

    if (!email) return;

    fetch(`http://localhost:5000/admin/profile?email=${encodeURIComponent(email)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          if (data.activity) setActivity(data.activity);
          else if (data.stats) setActivity(data.stats);
        }
      })
      .catch((err) => console.error('Failed to load DB admin metrics:', err));

    return () => {
      isMounted = false;
    };
  }, [session?.user?.email]);

  if (sessionLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-gray-500 font-medium">Loading Admin Profile...</p>
      </div>
    );
  }

  // Key trick: Remount the Form sub-component when session user ID changes so inputs populate instantly
  const userKey = session?.user?.id || session?.user?.email || 'guest';

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Profile</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your account credentials, view platform metrics, and update your public display identity.
        </p>
      </div>

      <ProfileContent 
        key={userKey} 
        session={session} 
        activity={activity} 
        saving={saving} 
        setSaving={setSaving} 
      />
    </div>
  );
}

function ProfileContent({ session, activity, saving, setSaving }) {
  const [name, setName] = useState(session?.user?.name || '');
  const [email] = useState(session?.user?.email || '');
  const [photoURL, setPhotoURL] = useState(session?.user?.image || session?.user?.photoURL || '');
  const role = session?.user?.role || 'Admin';

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (authClient?.updateUser) {
        await authClient.updateUser({
          name: name,
          image: photoURL,
        });
      }

      const res = await fetch('http://localhost:5000/admin/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, photoURL }),
      });

      if (res.ok) {
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile on backend');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('An error occurred while saving profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Profile Card & Info */}
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-xs flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-400 p-1 bg-white shadow-md flex items-center justify-center">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-amber-50 flex items-center justify-center">
              {photoURL ? (
                <Image
                  src={photoURL}
                  alt={name || 'Admin'}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-amber-500" />
              )}
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-amber-500 text-white p-2 rounded-full shadow-md border-2 border-white">
            <Camera className="w-4 h-4" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">{name || 'Admin User'}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{email}</p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black shadow-xs">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span className="uppercase tracking-wider">{role}</span>
        </div>
      </div>

      {/* Activity Summary & Settings Form */}
      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-amber-50/60 border border-amber-100 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Moderated</p>
              <p className="text-lg font-black text-gray-900">{activity.lessonsModerated} Lessons</p>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Total Content</p>
              <p className="text-lg font-black text-gray-900">{activity.totalLessons} Lessons</p>
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase">Platform Users</p>
              <p className="text-lg font-black text-gray-900">{activity.totalUsers} Members</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-xs space-y-6">
          <div className="border-b border-amber-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" /> Edit Profile Settings
            </h3>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter admin name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-amber-200 text-sm font-medium bg-amber-50/20 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address (Read-Only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 text-sm font-medium bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Photo URL
              </label>
              <div className="relative">
                <Camera className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-amber-200 text-sm font-medium bg-amber-50/20 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-2xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}