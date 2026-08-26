'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { 
  ShieldAlert, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  X, 
  MessageSquare, 
  AlertTriangle, 
  User 
} from 'lucide-react';

export default function ReportedLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null); // Modal state

  // Fetch reported lessons safely without linter warnings
  useEffect(() => {
    let isMounted = true;

    async function fetchReportedLessons() {
      try {
        const res = await fetch('http://localhost:5000/admin/reported-lessons');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setLessons(data);
        }
      } catch (error) {
        console.error('Error loading reported lessons:', error);
        toast.error('Failed to load reported lessons');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchReportedLessons();

    return () => {
      isMounted = false;
    };
  }, []);

  // Action: Ignore reports and clear flags
  const handleIgnoreReports = async (lessonId) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/reported-lessons/${lessonId}/ignore`, {
        method: 'PATCH',
      });

      if (res.ok) {
        toast.success('Reports cleared. Lesson kept live.');
        setLessons((prev) => prev.filter((l) => l._id !== lessonId));
        if (selectedLesson?._id === lessonId) setSelectedLesson(null);
      } else {
        toast.error('Failed to clear reports');
      }
    } catch (error) {
      console.error('Error ignoring reports:', error);
      toast.error('An error occurred while clearing reports');
    }
  };

  // Action: Permanently delete lesson
  const handleDeleteLesson = async (lessonId, lessonTitle) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete "${lessonTitle || 'this lesson'}"?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/admin/reported-lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Lesson deleted permanently');
        setLessons((prev) => prev.filter((l) => l._id !== lessonId));
        if (selectedLesson?._id === lessonId) setSelectedLesson(null);
      } else {
        toast.error('Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('An error occurred while deleting lesson');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs text-gray-500 font-medium">Loading Reported Lessons...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-8 h-8 text-rose-600" /> Reported Lessons
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review community flags, inspect user feedback, and take moderation action.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold self-start sm:self-auto">
          {lessons.length} Pending Reports
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-amber-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/60 border-b border-amber-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                <th className="py-4 px-6">Lesson Title</th>
                <th className="py-4 px-6">Creator</th>
                <th className="py-4 px-6">Report Count</th>
                <th className="py-4 px-6">Reasons</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60 text-sm">
              {lessons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 italic">
                    🎉 No flagged or reported lessons found!
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => {
                  const reportCount = lesson.reportsCount || lesson.reports?.length || 1;
                  return (
                    <tr key={lesson._id} className="hover:bg-amber-50/30 transition-colors">
                      {/* Lesson Title */}
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 line-clamp-1">{lesson.title}</p>
                        <span className="text-[10px] text-gray-400">ID: {lesson._id}</span>
                      </td>

                      {/* Creator */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-200 bg-amber-100 shrink-0">
                            {lesson.creator?.photoURL ? (
                              <Image
                                src={lesson.creator.photoURL}
                                alt={lesson.creator.name || 'User'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-amber-600 m-auto mt-1" />
                            )}
                          </div>
                          <span className="text-xs font-semibold text-gray-700">
                            {lesson.creator?.name || 'Anonymous'}
                          </span>
                        </div>
                      </td>

                      {/* Report Count */}
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          {reportCount} {reportCount === 1 ? 'Report' : 'Reports'}
                        </span>
                      </td>

                      {/* View Reasons Button */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() => setSelectedLesson(lesson)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-600" /> View Reasons
                        </button>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Ignore / Clear Flags */}
                          <button
                            onClick={() => handleIgnoreReports(lesson._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                            title="Keep lesson live & clear reports"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ignore
                          </button>

                          {/* Delete Lesson */}
                          <button
                            onClick={() => handleDeleteLesson(lesson._id, lesson.title)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                            title="Permanently remove lesson"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: View Report Reasons & Reporter Info */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-100 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-amber-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Report Details</span>
                <h3 className="text-xl font-black text-gray-900 line-clamp-1">{selectedLesson.title}</h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reported Reasons List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {!selectedLesson.reports || selectedLesson.reports.length === 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 text-gray-700 text-xs flex items-start gap-2 border border-amber-100">
                  <MessageSquare className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p>Standard flag logged for inappropriate or low-quality content.</p>
                </div>
              ) : (
                selectedLesson.reports.map((report, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-gray-800">
                        <User className="w-3.5 h-3.5 text-amber-600" />
                        {report.reporterName || report.reporterEmail || 'Anonymous Reporter'}
                      </div>
                      {report.createdAt && (
                        <span className="text-[10px] text-gray-400">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 bg-white p-2.5 rounded-xl border border-amber-100">
                      {report.reason || report.comment || 'No specific description provided.'}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-100">
              <button
                onClick={() => handleIgnoreReports(selectedLesson._id)}
                className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                Ignore All Reports
              </button>
              <button
                onClick={() => handleDeleteLesson(selectedLesson._id, selectedLesson.title)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Delete Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}