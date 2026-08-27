'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from '../../../../lib/auth-client';
import { toast } from 'react-toastify';
import { Heart, Trash2, Eye, BookOpen } from 'lucide-react';

export default function MyFavoritesPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userId = session?.user?.id || session?.user?.email;
  const userEmail = session?.user?.email;

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (!user?.id && !user?.email) return;

      try {
        const res = await fetch(
          `http://localhost:5000/dashboard/my-favorites/${user?.id || user?.email}?email=${user?.email}`
        );

        if (!res.ok) {
          throw new Error(`Server status: ${res.status}`);
        }

        const text = await res.text();
        const data = text ? JSON.parse(text) : [];
        setFavorites(data);
      } catch (error) {
        console.error('Failed to load favorites:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user]);

  // Remove Favorite Handler
  const handleRemoveFavorite = async (lessonId) => {
    try {
      const res = await fetch('http://localhost:5000/dashboard/my-favorites/remove', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, userId: userId || userEmail })
      });

      if (res.ok) {
        setFavorites((prev) => prev.filter((item) => item._id !== lessonId));
        toast.success('Removed from favorites');
      } else {
        toast.error('Could not remove item');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Server error removing favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-amber-500"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2 dark:text-white">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
            My Saved Favorites
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your saved collection of life lessons and reflections.
          </p>
        </div>
        <span className="self-start sm:self-center px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
          {favorites.length} Saved {favorites.length === 1 ? 'Lesson' : 'Lessons'}
        </span>
      </div>

      {/* Cards Grid */}
      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No Favorites Found</h3>
          <p className="text-gray-500 text-xs mt-1">
            You haven`t saved any lessons to your favorites list yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((lesson) => (
            <div
              key={lesson._id}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Optional Cover Image */}
              {lesson.imageUrl && (
                <div className="relative h-44 w-full">
                  <Image
                    src={
                      lesson.imageUrl && lesson.imageUrl.startsWith('http')
                        ? lesson.imageUrl
                        : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop'
                    }
                    alt={lesson.title || 'Lesson image'}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                </div>
              )}

              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 my-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    {lesson.accessLevel || 'Free'}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                {/* Title & Story Excerpt */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-2">
                  {lesson.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                  {lesson.story}
                </p>
              </div>

              {/* Creator & Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                {/* Creator info */}
                <div className="flex items-center gap-2 overflow-hidden">
                  {/* {lesson.creator?.photoURL ? (
                    <div className="relative h-44 w-full">
                      <Image
                        src={
                          lesson.imageUrl && lesson.imageUrl.startsWith('http')
                            ? lesson.imageUrl
                            : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop'
                        }
                        alt={lesson.title || 'Lesson image'}
                        fill
                        className="object-cover rounded-t-xl"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )} */}
                  <span className="text-sm font-bold text-gray-700 truncate">
                    <h4 className='text-gray-400 font-semibold text-xs'>Created by:</h4>
                    {lesson.creator?.name || 'Anonymous'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/components/dashboard/my-lessons/${lesson._id}`}
                    className="btn btn-sm bg-amber-100 hover:bg-amber-200 text-amber-900 border-none rounded-xl font-bold flex items-center gap-1 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </Link>

                  <button
                    onClick={() => handleRemoveFavorite(lesson._id)}
                    className="btn btn-sm bg-rose-50 hover:bg-rose-100 text-rose-600 border-none rounded-xl font-bold flex items-center gap-1 text-xs"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}