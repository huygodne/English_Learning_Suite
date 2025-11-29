import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ShimmerButton from './ShimmerButton';
import { LessonSummary } from '../types';

interface TodayGoalCardProps {
  srsTasks?: {
    vocabularyToReview: number;
    newLessons: number;
  };
  onStartReview?: () => void;
  className?: string;
  suggestedLessons?: LessonSummary[];
}

const TodayGoalCard: React.FC<TodayGoalCardProps> = ({
  srsTasks = { vocabularyToReview: 12, newLessons: 3 },
  onStartReview,
  className = '',
  suggestedLessons = []
}) => {
  return (
    <motion.div
      className={`relative rounded-2xl p-5 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 border border-primary-200/40 shadow-[0_10px_25px_rgba(79,70,229,0.08)] overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glow Border Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-400/15 via-secondary-400/15 to-primary-400/15 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl" />
      <div className="absolute inset-[1px] rounded-2xl bg-white" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="text-xl">🎯</span>
            Mục tiêu Hôm nay
          </h3>
          <span className="text-[11px] font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            SRS
          </span>
        </div>

        <div className="space-y-3 mb-5">
          {/* Vocabulary to Review */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-lg">
                📚
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Từ vựng cần ôn</p>
                <p className="text-xl font-bold text-slate-900">{srsTasks.vocabularyToReview} từ</p>
              </div>
            </div>
          </div>

          {/* New Lessons */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-lg">
                ✨
              </div>
              <div>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Bài học mới</p>
                <p className="text-xl font-bold text-slate-900">{srsTasks.newLessons} bài</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested lessons inside the same card */}
        {suggestedLessons.length > 0 && (
          <div className="mb-5">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.16em] mb-2 flex items-center gap-2">
              <span className="text-base">🆕</span>
              Bài học mới gợi ý
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-800">
              {suggestedLessons.slice(0, 3).map((lesson) => (
                <li key={lesson.id} className="flex items-center justify-between">
                  <span className="truncate max-w-[70%]">{lesson.name}</span>
                  <span className="text-[11px] text-slate-500 flex-shrink-0">
                    Trình độ {lesson.level}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA Button */}
        <Link to="/lessons" onClick={onStartReview} className="block">
          <motion.div
            whileTap={{ scale: 0.95 }}
          >
            <ShimmerButton 
              label="Bắt đầu Ôn tập" 
            />
          </motion.div>
        </Link>
      </div>
    </motion.div>
  );
};

export default TodayGoalCard;

