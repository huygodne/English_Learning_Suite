import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LessonSummary } from '../types';

interface DashboardLessonsListProps {
  lessons: LessonSummary[];
  loading?: boolean;
  maxItems?: number;
}

const DashboardLessonsList: React.FC<DashboardLessonsListProps> = ({
  lessons = [],
  loading = false,
  maxItems = 5
}) => {
  const displayedLessons = lessons.slice(0, maxItems);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Chưa có bài học nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedLessons.map((lesson, index) => (
        <motion.div
          key={lesson.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
          whileHover={{ scale: 1.02, x: 4 }}
        >
          <Link to={`/lessons/${lesson.id}`}>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {lesson.level}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-primary-600 transition-colors">
                  {lesson.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Level {lesson.level} • Bài học
                </p>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                className="flex-shrink-0"
              >
                <svg className="w-5 h-5 text-slate-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </Link>
        </motion.div>
      ))}
      {lessons.length > maxItems && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: maxItems * 0.1 }}
        >
          <Link
            to="/lessons"
            className="block text-center py-3 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Xem tất cả ({lessons.length} bài học) →
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardLessonsList;

