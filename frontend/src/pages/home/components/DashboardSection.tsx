import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TodayGoalCard from '../../../components/TodayGoalCard';
import QuickAccessButtons from '../../../components/QuickAccessButtons';
import SkillRadarChart from '../../../components/SkillRadarChart';
import LevelProgressCard from '../../../components/LevelProgressCard';
import EnhancedLeaderboard from '../../../components/EnhancedLeaderboard';
import EnhancedTipsPanel from '../../../components/EnhancedTipsPanel';
import DashboardLessonsList from '../../../components/DashboardLessonsList';
import DashboardTestsList from '../../../components/DashboardTestsList';
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
}) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
  >
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Chào mừng trở lại, {userName}!</h2>
      <p className="text-slate-600">Tiếp tục hành trình học tập của bạn ngay hôm nay</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.5fr] gap-6">
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TodayGoalCard
          srsTasks={{
            vocabularyToReview: 12,
            newLessons: 3
          }}
          onStartReview={onNavigateToLessons}
        />
        <QuickAccessButtons />
        <Link
          to="/library"
          className="block rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 text-white p-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/70">Thư viện</p>
              <h3 className="text-2xl font-bold mt-1">Khám phá tài liệu</h3>
              <p className="text-sm text-white/80 mt-1">
                Truy cập nhanh giáo trình, bài đọc và tài nguyên thực hành.
              </p>
            </div>
            <div className="flex items-center gap-3 text-lg font-semibold">
              Mở ngay
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                →
              </span>
            </div>
          </div>
        </Link>
      </motion.div>

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SkillRadarChart
          data={{
            grammar: 75,
            vocabulary: 82,
            listening: 68,
            speaking: 65
          }}
          loading={false}
        />

        <LevelProgressCard currentLevel={5} currentXP={1250} xpToNextLevel={2000} onLevelUp={() => {}} />
      </motion.div>

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <EnhancedLeaderboard />
        <EnhancedTipsPanel />
      </motion.div>
    </div>

    <motion.div
      className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <motion.div
        className="rounded-3xl p-6 bg-white border border-slate-200 shadow-lg"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            Bài học gần đây
          </h3>
          <Link to="/lessons" className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Xem tất cả →
          </Link>
        </div>
        <DashboardLessonsList lessons={lessons} loading={lessonsLoading} maxItems={5} />
      </motion.div>

      <motion.div
        className="rounded-3xl p-6 bg-white border border-slate-200 shadow-lg"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            Bài kiểm tra
          </h3>
          <Link to="/tests" className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">
            Xem tất cả →
          </Link>
        </div>
        <DashboardTestsList tests={tests} loading={testsLoading} maxItems={5} />
      </motion.div>
    </motion.div>
  </motion.section>
);

export default DashboardSection;

