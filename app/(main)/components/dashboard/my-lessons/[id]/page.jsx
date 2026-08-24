'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import {
  Sparkles,
  Calendar,
  Clock,
  Eye,
  Lock,
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  Flag,
  MessageSquare,
  Send,
  UserCheck,
  Edit
} from 'lucide-react';
import LessonCard from '@/app/(main)/components/cards/LessonCard';
import { useSession } from '../../../../../lib/auth-client';

export default function LessonDetailsPage({ params }) {
  // Unwrap params using React.use()
  const { id } = use(params);

  // Get active user session
  const { data: session, isPending } = useSession();
  const user = session?.user;

  // Derive user premium status from plan
  const isUserPremium = user?.plan === 'user_premium' || user?.plan === 'admin_premium';

  // Component States
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive Feature States with Counts
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Fetch lesson data and existing interactions on mount
  useEffect(() => {
    async function fetchLesson() {
      try {
        const res = await fetch(`http://localhost:5000/dashboard/lessons/${id}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data);

          // Populate counts from database
          setLikesCount(data.likesCount || 0);
          setFavoritesCount(data.favoritesCount || 0);
          setComments(data.comments || []);
          setIsLiked(data.isLikedByUser || false);

          // UPDATE 1: Check if the current user ID or email exists in favoritedBy array
          const userIdentifier = user?.id || user?.email;
          const favorited = Array.isArray(data.favoritedBy) && data.favoritedBy.includes(userIdentifier);
          setIsFavorited(favorited);
        } else {
          setLesson(null);
        }
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchLesson();
    }
  }, [id, user?.id, user?.email]);

  // Handler for Like Toggle with Counter Persistence
  const handleLikeToggle = async () => {
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;

    setIsLiked(newLikedState);
    setLikesCount(newLikesCount);

    try {
      const res = await fetch(`http://localhost:5000/dashboard/lessons/${id}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: newLikedState ? 'like' : 'unlike' }),
      });

      if (!res.ok) {
        setIsLiked(!newLikedState);
        setLikesCount(likesCount);
        toast.error('Failed to update likes on server.');
      }
    } catch (error) {
      setIsLiked(!newLikedState);
      setLikesCount(likesCount);
      toast.error('Error toggling like:', error);
    }
  };

  // UPDATE 2: Handler for Favorite Toggle passing user identifier
  const handleFavoriteToggle = async () => {
    const userIdentifier = user?.id || user?.email;

    if (!userIdentifier) {
      alert('Please log in to save lessons');
      return;
    }

    const newFavoriteState = !isFavorited;
    const newFavoritesCount = newFavoriteState ? favoritesCount + 1 : favoritesCount - 1;

    // Optimistic UI Update
    setIsFavorited(newFavoriteState);
    setFavoritesCount(newFavoritesCount);

    try {
      const res = await fetch(`http://localhost:5000/dashboard/lessons/${id}/favorite`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userIdentifier,
          email: user?.email
        }),
      });

      if (!res.ok) {
        // Rollback state if server request fails
        setIsFavorited(!newFavoriteState);
        setFavoritesCount(favoritesCount);
        console.error('Failed to update favorite status on server.');
      }
    } catch (error) {
      // Rollback state on error
      setIsFavorited(!newFavoriteState);
      setFavoritesCount(favoritesCount);
      console.error('Error toggling favorite:', error);
    }
  };

  // Handler for Posting Comments with Backend Persistence
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const temporaryText = commentText;
    setCommentText('');

    try {
      const res = await fetch(`http://localhost:5000/dashboard/lessons/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: temporaryText,
          createdAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        const savedComment = await res.json();
        setComments((prev) => [savedComment, ...prev]);
      } else {
        toast.error('Failed to post comment.');
        setCommentText(temporaryText);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setCommentText(temporaryText);
    }
  };

  // Loading Skeleton State
  if (loading || isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading lesson details...</p>
      </div>
    );
  }

  // Not Found State
  if (!lesson) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Lesson not found</h2>
        <Link href="/components/dashboard/my-lessons" className="mt-4 text-amber-600 underline font-medium">
          Back to Lessons
        </Link>
      </div>
    );
  }

  const isPremiumLesson = lesson.accessLevel === 'Premium';
  const isLocked = isPremiumLesson && !isUserPremium;
  const relatedLessons = [];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">

      {/* Navigation & Header Badges */}
      <div className="flex items-center justify-between mb-6">
        <div className='flex gap-2'>
          <Link
            href="/components/dashboard/my-lessons"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Link>

          {(user?.email === lesson.creator?.email || user?.id === lesson.creator?.userId) && (
            <Link
              href={`/components/dashboard/lessons/edit/${id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold bg-blue-100 text-blue-900 hover:bg-blue-200 transition-colors"
            >
              <Edit className="w-4 h-4" /> Edit Lesson
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2">
          {lesson.category && (
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              {lesson.category}
            </span>
          )}
          {lesson.tone && (
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
              {lesson.tone}
            </span>
          )}
          {isPremiumLesson && (
            <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black flex items-center gap-1 shadow-xs">
              <Lock className="w-3 h-3" /> PREMIUM
            </span>
          )}
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-xl overflow-hidden p-6 sm:p-10">

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
          {lesson.title}
        </h1>

        {/* Lesson Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-500 border-b border-amber-100 pb-6 mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-amber-500" />
            Created: {new Date(lesson.createdAt?.$date || lesson.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-amber-500" />
            3 min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4 text-amber-500" />
            1,240 Views
          </span>
        </div>

        {/* Cover Image */}
        {lesson.imageUrl && (
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden mb-8 shadow-md">
            <Image
              src={lesson.imageUrl}
              alt={lesson.title || 'Lesson Cover'}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Story / Locked State */}
        <div className="relative">
          <div className={`prose max-w-none text-gray-800 text-lg leading-relaxed space-y-4 whitespace-pre-line ${isLocked ? 'blur-md select-none pointer-events-none' : ''}`}>
            {lesson.story}
          </div>

          {/* Premium Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-8 border border-amber-300 shadow-2xl">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Premium Life Lesson</h2>
              <p className="text-gray-600 text-sm max-w-md mt-2 mb-6">
                This insight is reserved for Premium Members. Upgrade your plan to unlock full access.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-lg px-8 py-3 rounded-xl text-base transition-colors"
              >
                <Sparkles className="w-5 h-5" /> Unlock with Premium
              </Link>
            </div>
          )}
        </div>

        {/* Interactive Action Buttons */}
        {!isLocked && (
          <div className="py-6 border-y border-amber-100 my-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <button
                onClick={handleLikeToggle}
                className={`font-bold flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${isLiked
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                  }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                {likesCount} Likes
              </button>

              {/* Favorite Button with Live Counter */}
              <button
                onClick={handleFavoriteToggle}
                className={`font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${isFavorited
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                  }`}
              >
                <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-amber-600 text-amber-600' : 'text-amber-600'}`} />
                {favoritesCount} Favorites
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="font-bold text-xs text-gray-600 hover:text-amber-600 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors">
                <Share2 className="w-4 h-4 text-amber-600" /> Share
              </button>

              <button className="font-bold text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors">
                <Flag className="w-4 h-4" /> Report
              </button>
            </div>
          </div>
        )}

        {/* Author Details */}
        <div className="mt-12 pt-8 border-t border-amber-100">
          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shadow-xs shrink-0">
                <Image
                  src={lesson.creator?.photoURL || 'https://via.placeholder.com/150'}
                  alt={lesson.creator?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1">
                  <h3 className="font-bold text-lg text-gray-900">{lesson.creator?.name || 'Anonymous Author'}</h3>
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-gray-500 font-medium">{lesson.creator?.email}</p>
              </div>
            </div>

            {lesson.creator?.userId || lesson.creator?.email ? (
              <Link
                href={`/components/profile/${lesson.creator.userId || lesson.creator.email}`}
                className="px-4 py-2 text-xs border border-amber-400 text-amber-900 font-bold rounded-xl hover:bg-amber-100 transition-colors"
              >
                View All Lessons
              </Link>
            ) : null}
          </div>
        </div>

      </div>

      {/* Dynamic Comment Section */}
      {!isLocked && (
        <div className="mt-12 pt-8 border-t border-amber-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-600" /> Discussion ({comments.length})
          </h3>

          <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-8">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts or takeaways..."
              className="flex-1 px-4 py-3 rounded-xl border border-amber-200 outline-hidden text-sm text-gray-800 bg-white shadow-xs focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="font-bold text-white bg-amber-500 hover:bg-amber-600 px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" /> Post
            </button>
          </form>

          {/* Comment List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No comments yet. Be the first to share your view!</p>
            ) : (
              comments.map((item, idx) => (
                <div key={item._id || item.id || idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <p className="text-sm text-gray-800">{item.text}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Recommended Grid */}
      {relatedLessons.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" /> Recommended Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedLessons.map((item) => (
              <LessonCard key={item._id} lesson={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}