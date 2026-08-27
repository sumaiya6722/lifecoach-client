'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Save, Lock, User, Image as ImageIcon } from 'lucide-react';

export default function EditProfilePage() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [email, setEmail] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const userEmail = "sumaiyaali6722@gmail.com";

  useEffect(() => {
    async function fetchUserData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${userEmail}`);
        if (res.ok) {
          const data = await res.json();
          setName(data.name || '');
          setImage(data.image || '');
          setEmail(data.email || '');
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      } finally {
        setLoading(false);
      }
    }

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/email/${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          image,
        }),
      });

      if (res.ok) {
        setMessage('Profile updated successfully!');

        // Redirects and reloads browser state automatically
        setTimeout(() => {
          window.location.href = '/dashboard/userProfile';
        }, 800);
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading form...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6">

      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard/userProfile"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </Link>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-xl p-6 sm:p-10">
        <h1 className="text-2xl font-black text-gray-900 mb-6">Edit Profile</h1>

        {message && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${message.includes('successfully') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
            {message}
          </div>
        )}

        {/* Live Photo Preview */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0">
            <Image
              src={image || 'https://via.placeholder.com/150'}
              alt="Avatar Preview"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700">Avatar Preview</p>
            <p className="text-[11px] text-gray-500">Provide an image URL below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name Input */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-amber-600" /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white"
            />
          </div>

          {/* Image URL Input */}
          <div>
            <label className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" /> Image URL
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm focus:ring-2 focus:ring-amber-400 outline-none bg-white"
            />
          </div>

          {/* Locked Email Input */}
          <div>
            <label className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-gray-400" /> Email (Cannot be edited)
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full mt-4 font-bold text-white bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </div>

    </div>
  );
}