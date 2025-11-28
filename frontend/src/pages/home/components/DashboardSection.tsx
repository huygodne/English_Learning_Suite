import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TodayGoalCard from '../../../components/TodayGoalCard';
import QuickAccessButtons from '../../../components/QuickAccessButtons';
import DashboardLessonsList from '../../../components/DashboardLessonsList';
import DashboardTestsList from '../../../components/DashboardTestsList';
import EnhancedLeaderboard from '../../../components/EnhancedLeaderboard';
import { LessonSummary, TestSummary } from '../../../types';

type DashboardSectionProps = {
  userName?: string;
  lessons: LessonSummary[];
  tests: TestSummary[];
  lessonsLoading: boolean;
  testsLoading: boolean;
  onNavigateToLessons: () => void;
};

const DashboardSection: React.FC<DashboardSectionProps> = ({
  userName,
  lessons,
  tests,
  lessonsLoading,
  testsLoading,
  onNavigateToLessons
}) => {
  const nextLesson = lessons[0];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Chào mừng trở lại, {userName}!
        </h2>
        <p className="text-slate-600">
          Hôm nay bạn cần làm gì? Bắt đầu từ những mục tiêu quan trọng nhất bên dưới.
        </p>
      </div>

      {/* Main layout: 70/30 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left column: action-focused */}
        <motion.div
          className="space-y-6 lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Continue learning hero */}
          <div className="rounded-3xl p-6 bg-white/90 border border-slate-200 shadow-[0_12px_40px_rgba(15,23,42,0.06)] flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-1">
                Tiếp tục học
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {nextLesson ? nextLesson.name : 'Bắt đầu bài học đầu tiên của bạn'}
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                Hoàn thành bài học hôm nay để duy trì tiến độ và giữ vững phong độ học tập.
              </p>
              <Link
                to={nextLesson ? `/lessons/${nextLesson.id}` : '/lessons'}
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow-md hover:bg-primary-700 transition-colors"
              >
                Học ngay
                <span className="ml-2 text-lg">→</span>
              </Link>
            </div>
          </div>

          <TodayGoalCard
            srsTasks={{
              vocabularyToReview: 12,
              newLessons: 3
            }}
            onStartReview={onNavigateToLessons}
          />

          <QuickAccessButtons />
        </motion.div>

        {/* Right column: weekly goals, leaderboard, etc. */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EnhancedLeaderboard />
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className="rounded-3xl p-6 bg-white border border-slate-200 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Bài học gần đây
            </h3>
            <Link
              to="/lessons"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>
          <DashboardLessonsList lessons={lessons} loading={lessonsLoading} maxItems={5} />
        </motion.div>

        <motion.div
          className="rounded-3xl p-6 bg-white border border-slate-200 shadow-lg"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-2xl">📝</span>
              Bài kiểm tra
            </h3>
            <Link
              to="/tests"
              className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
            >
              Xem tất cả →
            </Link>
          </div>
          <DashboardTestsList tests={tests} loading={testsLoading} maxItems={5} />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default DashboardSection;

