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
// import LessonCard from '@/app/(main)/components/cards/LessonCard';
import { useSession, authClient } from '../../../../../lib/auth-client';

export default function LessonDetailsPage({ params }) {
  const { id } = use(params);
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const isUserPremium = user?.plan === 'user_premium' || user?.plan === 'admin_premium';

  // Component States
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive States
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const [reportsCount, setReportsCount] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate content');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Helper to fetch authorization header
  const getAuthHeaders = async () => {
    const { data: tokenData } = await authClient.token();
    return {
      'Content-Type': 'application/json',
      ...(tokenData?.token ? { Authorization: `Bearer ${tokenData.token}` } : {})
    };
  };

  // Single Consolidated Fetch Effect
  useEffect(() => {
    async function fetchLesson() {
      try {
        const headers = await getAuthHeaders();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons/${id}`, { headers });

        if (res.ok) {
          const data = await res.json();
          setLesson(data);
          setLikesCount(data.likesCount || 0);
          setFavoritesCount(data.favoritesCount || 0);
          setReportsCount(data.reportsCount || 0);
          setComments(data.comments || []);
          setIsLiked(data.isLikedByUser || false);

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

    if (id && !isPending) {
      fetchLesson();
    }
  }, [id, isPending, user?.id, user?.email]);

  // Handler for Like Toggle
  const handleLikeToggle = async () => {
    const newLikedState = !isLiked;
    const newLikesCount = newLikedState ? likesCount + 1 : likesCount - 1;

    setIsLiked(newLikedState);
    setLikesCount(newLikesCount);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons/${id}/like`, {
        method: 'PATCH',
        headers,
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
      toast.error('Error toggling like.');
    }
  };

  // Handler for Favorite Toggle
  const handleFavoriteToggle = async () => {
    const userIdentifier = user?.id || user?.email;

    if (!userIdentifier) {
      toast.error('Please log in to save lessons');
      return;
    }

    const newFavoriteState = !isFavorited;
    const newFavoritesCount = newFavoriteState ? favoritesCount + 1 : favoritesCount - 1;

    setIsFavorited(newFavoriteState);
    setFavoritesCount(newFavoritesCount);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons/${id}/favorite`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ userId: userIdentifier, email: user?.email }),
      });

      if (!res.ok) {
        setIsFavorited(!newFavoriteState);
        setFavoritesCount(favoritesCount);
        toast.error('Failed to update favorite status.');
      }
    } catch (error) {
      setIsFavorited(!newFavoriteState);
      setFavoritesCount(favoritesCount);
      toast.error('Error toggling favorite.');
    }
  };

  // Handler for Posting Comments
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const temporaryText = commentText;
    setCommentText('');

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons/${id}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: temporaryText,
          userEmail: user?.email || 'Anonymous',
          userName: user?.name || user?.displayName || 'Anonymous User',
          userImage: user?.image || user?.photoURL || '',
        }),
      });

      const data = await res.json();

      if (res.ok && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
      } else {
        toast.error('Failed to post comment.');
        setCommentText(temporaryText);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      setCommentText(temporaryText);
    }
  };

  // Report Submission Handler
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    const userIdentifier = user?.id || user?.email;

    if (!userIdentifier) {
      toast.error('Please log in to report a lesson.');
      return;
    }

    setIsSubmittingReport(true);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/lessons/${id}/report`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          userId: user?.id,
          email: user?.email,
          reason: reportReason,
        }),
      });

      if (res.ok) {
        setReportsCount((prev) => prev + 1);
        toast.success('Thank you. The report has been sent for review.');
        setIsReportModalOpen(false);
        setReportReason('Inappropriate content');
      } else {
        toast.error('Failed to submit report.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('An error occurred while reporting.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (loading || isPending) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading lesson details...</p>
      </div>
    );
  }

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

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
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

      {/* Main Content */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-amber-200/80 shadow-xl overflow-hidden p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-4">
          {lesson.title}
        </h1>

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

        <div className="relative">
          <div className={`prose max-w-none text-gray-800 text-lg leading-relaxed space-y-4 whitespace-pre-line ${isLocked ? 'blur-md select-none pointer-events-none' : ''}`}>
            {lesson.story}
          </div>

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

        {!isLocked && (
          <div className="py-6 border-y border-amber-100 my-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLikeToggle}
                className={`font-bold flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${
                  isLiked
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-amber-200 text-gray-700 hover:bg-amber-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                {likesCount} Likes
              </button>

              <button
                onClick={handleFavoriteToggle}
                className={`font-bold flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
                  isFavorited
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

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="font-bold text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Flag className="w-4 h-4 text-rose-600" /> Report ({reportsCount})
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

            {(lesson.creator?.userId || lesson.creator?.email) && (
              <Link
                href={`/components/profile/${lesson.creator.userId || lesson.creator.email}`}
                className="px-4 py-2 text-xs border border-amber-400 text-amber-900 font-bold rounded-xl hover:bg-amber-100 transition-colors"
              >
                View All Lessons
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Discussion Section */}
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

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No comments yet. Be the first to share your view!</p>
            ) : (
              comments.map((item, idx) => (
                <div
                  key={item._id || item.id || idx}
                  className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex gap-3 items-start"
                >
                  {item.userImage && (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-amber-200">
                      <Image
                        src={item.userImage}
                        alt={item.userName || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-gray-900">
                        {item.userName || item.userEmail || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {item.text || item.comment || ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-amber-100">
            <h3 className="text-xl font-black text-gray-900 mb-2 flex items-center gap-2">
              <Flag className="w-5 h-5 text-rose-600" /> Report Lesson
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Help us keep the community safe. Please select why you are reporting this lesson.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-amber-200 text-sm text-gray-800 bg-amber-50/30 outline-hidden focus:ring-2 focus:ring-amber-400"
                >
                  <option value="Inappropriate content">Inappropriate content</option>
                  <option value="Spam or misleading">Spam or misleading</option>
                  <option value="Copyright violation">Copyright violation</option>
                  <option value="Harassment or hate speech">Harassment or hate speech</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}