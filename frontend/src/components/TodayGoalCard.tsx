import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ShimmerButton from './ShimmerButton';

interface TodayGoalCardProps {
  srsTasks?: {
    vocabularyToReview: number;
    newLessons: number;
  };
  onStartReview?: () => void;
}

const TodayGoalCard: React.FC<TodayGoalCardProps> = ({ 
  srsTasks = { vocabularyToReview: 12, newLessons: 3 },
  onStartReview 
}) => {
  return (
    <motion.div
      className="relative rounded-3xl p-6 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 border border-primary-200/50 shadow-[0_8px_30px_rgba(79,70,229,0.12)] overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Glow Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-400/20 via-secondary-400/20 to-primary-400/20 opacity-0 hover:opacity-100 transition-opacity duration-500 blur-xl" />
      <div className="absolute inset-[1px] rounded-3xl bg-white" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            Mục tiêu Hôm nay
          </h3>
          <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
            SRS
          </span>
        </div>

        <div className="space-y-4 mb-6">
          {/* Vocabulary to Review */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl">
                📚
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Từ vựng cần ôn</p>
                <p className="text-2xl font-bold text-slate-900">{srsTasks.vocabularyToReview} từ</p>
              </div>
            </div>
          </div>

          {/* New Lessons */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xl">
                ✨
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Bài học mới</p>
                <p className="text-2xl font-bold text-slate-900">{srsTasks.newLessons} bài</p>
              </div>
            </div>
          </div>
        </div>

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

