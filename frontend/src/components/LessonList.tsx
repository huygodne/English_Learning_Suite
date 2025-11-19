import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LessonSummary, UserLessonProgress } from '../types';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] },
  },
};

const levelConfig: Record<number, { label: string; classes: string }> = {
  1: { label: 'Easy', classes: 'bg-green-100 text-green-800' },
  2: { label: 'Medium', classes: 'bg-yellow-100 text-yellow-800' },
  3: { label: 'Hard', classes: 'bg-red-100 text-red-800' },
};

const formatLessonTitle = (name: string): string => {
  if (!name) return 'Bài học';
  const lastColon = name.lastIndexOf(':');
  const lastDash = name.lastIndexOf('-');
  const index = Math.max(lastColon, lastDash);
  return index >= 0 ? name.slice(index + 1).trim() : name.trim();
};

interface LessonListProps {
  lessons?: LessonSummary[];
  progressByLesson?: Record<number, UserLessonProgress>;
  loadingProgress?: boolean;
}

const LessonList: React.FC<LessonListProps> = ({ lessons = [], progressByLesson = {}, loadingProgress = false }) => {
  if (!lessons.length) {
    return null;
  }

  const formatDuration = (seconds: number = 0): string | null => {
    if (!seconds || seconds <= 0) return null;
    const minutes = Math.max(1, Math.round(seconds / 60));
    return `${minutes} phút`;
  };

  const formatDate = (isoString?: string): string | null => {
    if (!isoString) return null;
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const buildStatus = (progress?: UserLessonProgress) => {
    if (!progress) {
      return {
        label: 'Chưa học',
        classes: 'text-slate-600',
        action: 'Bắt đầu học',
        timeText: 'Chưa có tiến độ',
        estimatedTime: '30 phút',
      };
    }
    if (progress.isCompleted) {
      return {
        label: 'Đã học',
        classes: 'text-emerald-700',
        action: 'Học lại từ đầu',
        timeText: formatDate(progress.completedAt)
          ? `Hoàn thành ngày ${formatDate(progress.completedAt)}`
          : 'Đã hoàn thành',
        estimatedTime: formatDuration(progress.timeSpentSeconds) || '30 phút',
      };
    }
    return {
      label: 'Đang học',
      classes: 'text-amber-600',
      action: 'Tiếp tục học',
      timeText: formatDuration(progress.timeSpentSeconds)
        ? `Đã học ${formatDuration(progress.timeSpentSeconds)}`
        : 'Đã học 1 phút',
      estimatedTime: formatDuration(progress.timeSpentSeconds) || '30 phút',
    };
  };

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {lessons.map((lesson, index) => {
        const level = levelConfig[lesson.level] ?? levelConfig[1];
        const progress = progressByLesson[lesson.id];
        const status = buildStatus(progress);
        const lessonNumber = lesson.lessonNumber ?? index + 1;
        
        return (
          <motion.div
            key={lesson.id ?? index}
            variants={itemVariants}
            className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 group hover:shadow-xl transition-all duration-300"
          >
            {/* Header with badges */}
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1.5 rounded-full">
                Bài {lessonNumber}
              </span>
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${level.classes}`}>
                {level.label}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
              {formatLessonTitle(lesson.name)}
            </h3>

            {/* Status */}
            <div className="mb-4">
              <span className={`text-sm font-medium ${status.classes}`}>
                {status.label}
              </span>
            </div>

            {/* Time info */}
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                {loadingProgress ? 'Đang đồng bộ...' : status.timeText}
              </span>
              {!loadingProgress && (
                <>
                  <span className="text-slate-400">·</span>
                  <span>{status.estimatedTime}</span>
                </>
              )}
            </div>

            {/* Action button */}
            <Link
              to={`/lessons/${lesson.id}`}
              className="block w-full text-center px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 hover:scale-105"
            >
              {status.action}
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default LessonList;

