import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const levelConfig = {
  1: { label: 'Easy', classes: 'bg-green-100 text-green-800' },
  2: { label: 'Medium', classes: 'bg-yellow-100 text-yellow-800' },
  3: { label: 'Hard', classes: 'bg-red-100 text-red-800' },
};

const formatLessonTitle = (name) => {
  if (!name) return 'Bài học';
  const lastColon = name.lastIndexOf(':');
  const lastDash = name.lastIndexOf('-');
  const index = Math.max(lastColon, lastDash);
  return index >= 0 ? name.slice(index + 1).trim() : name.trim();
};

const LessonList = ({ lessons = [] }) => {
  if (!lessons.length) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {lessons.map((lesson, index) => {
        const level = levelConfig[lesson.level] ?? levelConfig[3];
        return (
          <motion.div
            key={lesson.id ?? index}
            variants={itemVariants}
            className="card-feature group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="bg-primary-100 text-primary-800 text-sm font-semibold px-4 py-2 rounded-xl">
                Bài {lesson.lessonNumber ?? index + 1}
              </span>
              <span className={`text-sm font-semibold px-4 py-2 rounded-xl ${level.classes}`}>
                {level.label}
              </span>
            </div>

            <h3 className="text-2xl font-semibold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
              {formatLessonTitle(lesson.name)}
            </h3>

            <div className="flex justify-between items-center">
              <Link
                to={`/lessons/${lesson.id}`}
                className="btn-primary transform transition-all duration-300 hover:scale-105"
              >
                Bắt đầu học
              </Link>
              <div className="flex items-center text-sm text-slate-500">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                30 phút
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default LessonList;

