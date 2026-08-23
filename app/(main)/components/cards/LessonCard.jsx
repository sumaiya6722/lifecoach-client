'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@heroui/react';
import { MdArrowOutward } from "react-icons/md";
import { Lock, Sparkles, User } from 'lucide-react';

const LessonCard = ({ lesson }) => {
  const { 
    _id, 
    title, 
    category, 
    tone, 
    story, 
    imageUrl, 
    accessLevel, 
    creator 
  } = lesson;

  const isPremium = accessLevel === 'Premium';

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between w-full">
      
      <div>
        {/* Cover Image */}
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          {imageUrl ? (
            <Image 
              src={imageUrl} 
              alt={title || "Lesson image"} 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-500">
              <Sparkles className="w-8 h-8" />
            </div>
          )}

          {/* Access Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 backdrop-blur-md ${
              isPremium 
                ? 'bg-amber-500 text-white' 
                : 'bg-white/90 text-gray-800 border border-gray-100'
            }`}>
              {isPremium ? <Lock className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
              {accessLevel || 'Free'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {title}
          </h3>

          {/* Description / Story Preview */}
          <p className="text-sm text-gray-500 line-clamp-2 mt-2 leading-relaxed">
            {story || "No description provided."}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {category && (
              <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold">
                {category}
              </span>
            )}
            {tone && (
              <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-800 text-xs font-semibold">
                {tone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Creator & Action */}
      <div className="p-6 pt-0">
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          
          {/* Creator */}
          <div className="flex items-center gap-2.5 min-w-0">
            {creator?.photoURL ? (
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-amber-200 shrink-0">
                <Image 
                  src={creator.photoURL} 
                  alt={creator.name || "Author"} 
                  fill 
                  className="object-cover" 
                />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-bold text-gray-700 truncate">
              {creator?.name || 'Anonymous'}
            </span>
          </div>

          {/* Action Link */}
          <Link href={`/components/dashboard/my-lessons/${_id}`}>
            <Button 
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs px-4 flex items-center gap-1.5 transition-all"
            >
              See Details <MdArrowOutward className="w-4 h-4" />
            </Button>
          </Link>

        </div>
      </div>

    </div>
  );
};

export default LessonCard;