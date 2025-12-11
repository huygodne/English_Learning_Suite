import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TodayGoalCard from '../../../components/TodayGoalCard';
import DashboardLessonsList from '../../../components/DashboardLessonsList';
import DashboardTestsList from '../../../components/DashboardTestsList';
import EnhancedLeaderboard from '../../../components/EnhancedLeaderboard';
import { LessonSummary, TestSummary, UserLessonProgress, UserTestProgress, UserProgressSummary } from '../../../types';

type DashboardSectionProps = {
  userName?: string;
  lessons: LessonSummary[];
  tests: TestSummary[];
  lessonsLoading: boolean;
  testsLoading: boolean;
  summary?: UserProgressSummary;
  summaryLoading?: boolean;
  lessonProgress?: UserLessonProgress[];
  testProgress?: UserTestProgress[];
  onNavigateToLessons: () => void;
};

const DashboardSection: React.FC<DashboardSectionProps> = ({
  userName,
  lessons,
  tests,
  lessonsLoading,
  testsLoading,
  summary,
  summaryLoading,
  lessonProgress = [],
  testProgress = [],
  onNavigateToLessons
}) => {
  // Tìm bài học tiếp theo chưa hoàn thành
  const completedLessonIds = React.useMemo(() => {
    return new Set(lessonProgress.filter(p => p.isCompleted).map(p => p.lessonId));
  }, [lessonProgress]);

  const nextLesson = React.useMemo(() => {
    // Tìm bài học đầu tiên chưa hoàn thành
    return lessons.find(lesson => !completedLessonIds.has(lesson.id)) || null;
  }, [lessons, completedLessonIds]);

  const [activeTab, setActiveTab] = React.useState<'lessons' | 'tests'>('lessons');

  // Tính toán dữ liệu từ summary (thay cho mock cứng)
  const completedLessons = summary?.completedLessons ?? 0;
  const completedTests = summary?.completedTests ?? 0;
  // Định nghĩa đơn giản: mỗi bài học = 10 XP, mỗi bài kiểm tra = 20 XP
  const totalXp = completedLessons * 10 + completedTests * 20;
  const currentStreak = summary?.currentStreak ?? 0;

  // Tập hợp các ngày có hoạt động (học bài hoặc làm bài kiểm tra)
  const activityDates = React.useMemo(() => {
    const dates = new Set<string>();
    const addDate = (iso?: string) => {
      if (!iso) return;
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return;
      const key = d.toISOString().slice(0, 10); // yyyy-mm-dd
      dates.add(key);
    };

    lessonProgress.forEach((p) => addDate(p.completedAt));
    testProgress.forEach((p) => addDate(p.completedAt));

    return dates;
  }, [lessonProgress, testProgress]);

  // Tính các ngày trong tuần hiện tại (T2-CN)
  const weekDays = React.useMemo(() => {
    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const today = new Date();
    const jsDay = today.getDay(); // 0=CN,1=T2,...6=T7
    const diffToMonday = jsDay === 0 ? -6 : 1 - jsDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    return labels.map((label, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const key = d.toISOString().slice(0, 10);
      return { label, key };
    });
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      {/* Header + stats */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-1">
              Chào mừng trở lại, {userName}!
            </h2>
            <p className="text-slate-600">
              Giữ nhịp học mỗi ngày để XP và streak của bạn không ngừng tăng lên.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-white/80 border border-amber-200 px-3 py-2 shadow-sm">
              <span className="text-lg">⭐</span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-amber-600">
                  Tổng XP
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {summaryLoading ? 'Đang tải...' : `${totalXp.toLocaleString()} XP`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-white/80 border border-emerald-200 px-3 py-2 shadow-sm">
              <span className="text-lg">🔥</span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-600">
                  Chuỗi ngày học
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {summaryLoading ? 'Đang tải...' : `${currentStreak} ngày liên tiếp`}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main layout: 12-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* Left column (main content) */}
        <motion.div
          className="grid gap-5 lg:col-span-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Hero: tiếp tục học */}
          {nextLesson ? (
            <div className="rounded-3xl p-6 bg-gradient-to-br from-primary-500/10 via-primary-50 to-secondary-50 border border-primary-100 shadow-lg flex flex-col md:flex-row md:items-center gap-5">
              <div className="flex-1 space-y-2">
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-[0.3em]">
                  Tiếp tục học
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {nextLesson.lessonNumber ? `Bài ${nextLesson.lessonNumber}: ` : ''}{nextLesson.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Hoàn thành bài học hôm nay để duy trì chuỗi ngày học và mở khóa thêm nhiều nội dung thú vị.
                </p>

                <Link
                  to={`/lessons/${nextLesson.id}`}
                  className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow hover:bg-primary-700 transition-colors w-full sm:w-auto"
                >
                  Học ngay
                  <span className="ml-2 text-lg">→</span>
                </Link>
              </div>
              <div className="min-w-[200px] self-stretch rounded-2xl bg-white/80 border border-primary-100 px-5 py-5 flex flex-col justify-center text-sm text-primary-700 shadow-sm">
                <span className="text-xs uppercase tracking-widest text-primary-400 mb-1">
                  Bài tiếp theo
                </span>
                {nextLesson.lessonNumber && (
                  <span className="text-lg font-bold text-primary-600 mb-1">
                    Bài {nextLesson.lessonNumber}
                  </span>
                )}
                <span className="text-base font-semibold text-slate-900 mb-1">
                  Cấp độ {nextLesson.level}
                </span>
                <span className="text-xs text-slate-500">
                  Thời lượng ~ {nextLesson.duration || '20 phút'}
                </span>
                <div className="mt-4 rounded-xl bg-primary-50/70 px-3 py-2">
                  <p className="text-[11px] text-primary-700">
                    Gợi ý: Học 2–3 bài/ngày để hoàn thành mục tiêu tuần của bạn.
                  </p>
                </div>
              </div>
            </div>
          ) : lessons.length > 0 ? (
            <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-500/10 via-emerald-50 to-green-50 border border-emerald-100 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.3em] mb-1">
                    Chúc mừng!
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Bạn đã hoàn thành tất cả bài học
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    Hãy tiếp tục ôn tập hoặc khám phá các bài kiểm tra để củng cố kiến thức của bạn.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to="/lessons"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold shadow hover:bg-emerald-700 transition-colors"
                    >
                      Xem lại bài học
                      <span className="ml-2 text-lg">→</span>
                    </Link>
                    <Link
                      to="/tests"
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-emerald-600 text-sm font-semibold border border-emerald-200 hover:bg-emerald-50 transition-colors"
                    >
                      Làm bài kiểm tra
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl p-6 bg-gradient-to-br from-primary-500/10 via-primary-50 to-secondary-50 border border-primary-100 shadow-lg">
              <div className="flex-1 space-y-2">
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-[0.3em]">
                  Bắt đầu học
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  Bắt đầu bài học đầu tiên của bạn
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Khám phá các bài học mới và bắt đầu hành trình học tiếng Anh của bạn ngay hôm nay.
                </p>
                <Link
                  to="/lessons"
                  className="mt-4 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-semibold shadow hover:bg-primary-700 transition-colors w-full sm:w-auto"
                >
                  Xem danh sách bài học
                  <span className="ml-2 text-lg">→</span>
                </Link>
              </div>
            </div>
          )}

          {/* Review section: chỉ một ô mục tiêu hôm nay dẫn tới bài học */}
          <div className="grid grid-cols-1 gap-5">
            <TodayGoalCard
              className="h-full"
              srsTasks={{
                // Tạm thời dùng số liệu xuất phát từ tổng bài học: số bài còn lại chưa hoàn thành
                vocabularyToReview: 0,
                newLessons: Math.max(0, (summary?.totalLessons ?? 0) - completedLessons)
              }}
              suggestedLessons={lessons}
              onStartReview={onNavigateToLessons}
            />
          </div>
        </motion.div>

        {/* Right column: leaderboard + lịch streak bên dưới */}
        <motion.div
          className="lg:col-span-4 space-y-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <EnhancedLeaderboard />

          {/* Lịch streak tuần này – chiều cao tăng nhẹ để cân với ô mục tiêu */}
          <div className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg">📆</span>
                Lịch streak tuần này
              </h3>
              <span className="text-[11px] text-slate-500">T2 - CN</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px]">
              {weekDays.map(({ label, key }) => {
                const isActive = activityDates.has(key);
                return (
                  <div
                    key={key}
                    className={`rounded-full px-1.5 py-1 ${
                      isActive
                        ? 'bg-emerald-500 text-white font-semibold'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section with tabs */}
      <motion.div
        className="mt-2 rounded-2xl p-5 bg-white border border-slate-200 shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Hoạt động gần đây</h3>
              <p className="text-xs text-slate-500">
                Xem nhanh những bài học và bài kiểm tra bạn vừa hoàn thành.
              </p>
            </div>
          </div>

          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab('lessons')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-colors ${
                activeTab === 'lessons'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-slate-600 hover:text-primary-600'
              }`}
            >
              Bài học
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-1.5 rounded-full font-semibold transition-colors ${
                activeTab === 'tests'
                  ? 'bg-white text-rose-700 shadow-sm'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              Bài kiểm tra
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-2 pt-4">
          {activeTab === 'lessons' ? (
            <DashboardLessonsList lessons={lessons} loading={lessonsLoading} maxItems={5} />
          ) : (
            <DashboardTestsList tests={tests} loading={testsLoading} maxItems={5} />
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            to="/lessons"
            className="text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
          >
            Xem tất cả bài học
            <span>→</span>
          </Link>
          <Link
            to="/tests"
            className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
          >
            Xem tất cả bài kiểm tra
            <span>→</span>
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default DashboardSection;

