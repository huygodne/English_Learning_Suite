import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScenicBackground from '../components/ScenicBackground';
import AnimatedMascot from '../components/AnimatedMascot';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lessonService, testService } from '../services/api';
import { LessonSummary, TestSummary } from '../types';
import TodayGoalCard from '../components/TodayGoalCard';
import QuickAccessButtons from '../components/QuickAccessButtons';
import SkillRadarChart from '../components/SkillRadarChart';
import LevelProgressCard from '../components/LevelProgressCard';
import EnhancedLeaderboard from '../components/EnhancedLeaderboard';
import EnhancedTipsPanel from '../components/EnhancedTipsPanel';
import DashboardLessonsList from '../components/DashboardLessonsList';
import DashboardTestsList from '../components/DashboardTestsList';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Dashboard data
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [testsLoading, setTestsLoading] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-up');
        }
      });
    }, observerOptions);

    const elementsToObserve = [
      heroRef.current,
      featuresRef.current,
      statsRef.current,
      howItWorksRef.current,
      testimonialsRef.current,
      ctaRef.current
    ].filter(Boolean);

    elementsToObserve.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fetch lessons and tests for dashboard
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchDashboardData = async () => {
      setLessonsLoading(true);
      setTestsLoading(true);

      try {
        const [lessonsData, testsData] = await Promise.all([
          lessonService.getAllLessons().catch(() => []),
          testService.getAllTests().catch(() => [])
        ]);

        // Sort lessons by level
        const sortedLessons = [...lessonsData].sort((a, b) => a.level - b.level);
        setLessons(sortedLessons);

        // Sort tests by level
        const sortedTests = [...testsData].sort((a, b) => a.level - b.level);
        setTests(sortedTests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLessons([]);
        setTests([]);
      } finally {
        setLessonsLoading(false);
        setTestsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated]);

  return (
    <div className="relative min-h-screen">
      <ScenicBackground variant="mountain" />
      {/* Header */}
      <header className="relative z-40 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
                className="mr-4 p-2 rounded-xl border border-transparent hover:border-primary-100 hover:bg-primary-50/60 text-primary-600 transition-all duration-300"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex-shrink-0">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold text-lg">EL</span>
                  <h1 className="text-2xl font-bold text-slate-800">English Learning Suite</h1>
                </div>
              </div>
            </div>
            <nav className="hidden md:flex space-x-2">
              <Link to="/" className="text-primary-600 bg-primary-50 px-3 py-2 text-sm font-semibold rounded-xl">
                Trang chủ
              </Link>
              <Link to="/lessons" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-primary-50">
                Bài học
              </Link>
              <Link to="/tests" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-primary-50">
                Kiểm tra
              </Link>
              <Link to="/profile" className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-primary-50">
                Hồ sơ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm font-medium text-slate-500">Xin chào, {user?.fullName}</span>
                    <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                  <button 
                    onClick={logout}
                      className="nav-link"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                    <Link to="/login" className="nav-link">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Đăng ký
                  </Link>
                </>
              )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-slate-700 hover:text-primary-600 p-2 rounded-xl border border-transparent hover:border-primary-200 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                Trang chủ
              </Link>
              <Link to="/lessons" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                Bài học
              </Link>
              <Link to="/tests" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                Kiểm tra
              </Link>
              <Link to="/profile" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                Hồ sơ
              </Link>
              <div className="border-t border-gray-200 pt-4">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-gray-700 mb-4">Xin chào, {user?.fullName}</div>
                    <Link to="/admin" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                      Admin
                    </Link>
                    <button 
                      onClick={logout}
                      className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium w-full text-left"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                      Đăng nhập
                    </Link>
                    <Link to="/register" className="btn-primary w-full text-center mt-4">
                      Đăng ký
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Dashboard Section - Only show when authenticated */}
      <AnimatePresence>
        {isAuthenticated && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Chào mừng trở lại, {user?.fullName}! 👋
              </h2>
              <p className="text-slate-600">Tiếp tục hành trình học tập của bạn ngay hôm nay</p>
            </div>

            {/* 3 Column Grid Layout: 40% - 30% - 30% */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.5fr] gap-6">
              {/* Left Column (40%): Action Hub */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Today's Goal Card */}
                <TodayGoalCard
                  srsTasks={{
                    vocabularyToReview: 12,
                    newLessons: 3
                  }}
                  onStartReview={() => {
                    navigate('/lessons');
                  }}
                />

                {/* Quick Access Buttons */}
                <QuickAccessButtons />
              </motion.div>

              {/* Middle Column (30%): Progress Hub */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {/* Skill Radar Chart */}
                <SkillRadarChart
                  data={{
                    grammar: 75,
                    vocabulary: 82,
                    listening: 68,
                    speaking: 65
                  }}
                  loading={false}
                />

                {/* Level Progress Card */}
                <LevelProgressCard
                  currentLevel={5}
                  currentXP={1250}
                  xpToNextLevel={2000}
                  onLevelUp={() => {
                    // Handle level up logic here
                  }}
                />
              </motion.div>

              {/* Right Column (30%): Social & Info */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Leaderboard */}
                <EnhancedLeaderboard />

                {/* Tips Panel */}
                <EnhancedTipsPanel />
              </motion.div>
            </div>

            {/* Lessons and Tests Section - Below the 3 columns */}
            <motion.div
              className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Lessons List */}
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
                  <Link
                    to="/lessons"
                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    Xem tất cả →
                  </Link>
                </div>
                <DashboardLessonsList
                  lessons={lessons}
                  loading={lessonsLoading}
                  maxItems={5}
                />
              </motion.div>

              {/* Tests List */}
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
                  <Link
                    to="/tests"
                    className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    Xem tất cả →
                  </Link>
                </div>
                <DashboardTestsList
                  tests={tests}
                  loading={testsLoading}
                  maxItems={5}
                />
              </motion.div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Hero Section - Only show when NOT authenticated */}
      {!isAuthenticated && (
        <div>
          <section
            ref={heroRef}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28"
          >
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-[48px] bg-white/65 shadow-[0_40px_120px_-30px_rgba(79,70,229,0.35)] border border-white/60">
            <div className="aurora-layer" />
            <div className="grid-overlay" />
            <span className="orbital-dot" style={{ top: '14%', left: '8%' }} />
            <span className="orbital-dot" style={{ top: '12%', right: '6%', animationDelay: '0.6s' }} />
            <span className="orbital-dot" style={{ bottom: '10%', left: '18%', animationDelay: '1.2s' }} />
            <span className="sparkle" style={{ top: '20%', right: '30%' }} />
            <span className="sparkle" style={{ bottom: '18%', left: '40%', animationDelay: '1.6s' }} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 border border-white/80 shadow-soft backdrop-blur">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-semibold">
                  🌱
                </span>
                <p className="text-sm sm:text-base font-semibold uppercase tracking-[0.28em] text-primary-700">
                  LỘ TRÌNH KÈM CẶP TỪNG BƯỚC
                </p>
              </div>

              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-3xl xl:text-4xl font-extrabold text-contrast leading-tight text-center lg:text-left">
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 uppercase tracking-tight whitespace-nowrap">
                    HỌC TIẾNG ANH
                  </span>
                  <span className="block uppercase tracking-tight whitespace-nowrap">HIỆU QUẢ & BỀN VỮNG</span>
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-slate-600/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-center lg:text-left tracking-wide">
                  Khám phá trải nghiệm học cá nhân hóa với giáo trình sinh động, luyện tập đa giác quan
                  và bảng điều khiển tiến độ trực quan giúp bạn luôn hào hứng mỗi ngày.
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-4 md:justify-start justify-center">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-primary-500 via-indigo-500 to-secondary-500 shadow-[0_20px_45px_-20px_rgba(79,70,229,0.65)] transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Bắt đầu miễn phí
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-primary-700 hover:text-primary-900 rounded-2xl border border-primary-200 bg-white/70 backdrop-blur hover:border-primary-400 transition-all duration-300"
                    >
                      Đăng nhập
                    </Link>
                  </>
                ) : (
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/70 border border-white/80 shadow-soft text-slate-600">
                    <span className="text-xl">👋</span>
                    <div className="text-left">
                      <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Chào mừng trở lại</p>
                      <p className="text-base font-semibold text-slate-700">{user?.fullName}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center md:justify-start gap-3 text-left">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((item) => (
                      <span
                        key={item}
                        className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary-400 via-indigo-400 to-fuchsia-300 text-white text-sm font-semibold"
                        style={{ filter: 'saturate(1.2)' }}
                      >
                        {item === 4 ? '+9' : item}
                      </span>
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Cộng đồng năng động</p>
                    <p className="text-base font-medium text-slate-600">12.500+ học viên luyện tập mỗi ngày</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-start lg:items-end gap-6 lg:gap-8 mt-8 lg:mt-12">
              {/* Robot Mascot - Left side, slightly down */}
              <div className="flex justify-start lg:justify-start w-full lg:w-auto">
                <div className="relative max-w-md lg:max-w-lg -ml-4 lg:ml-0">
                  <div className="absolute -top-8 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary-400/50 to-white/40 blur-2xl animate-[float_7s_ease-in-out_infinite]" />
                  <div className="absolute -bottom-6 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-fuchsia-300/50 via-primary-400/30 to-white/30 blur-3xl animate-[floatReverse_8s_ease-in-out_infinite]" />
                  <AnimatedMascot
                    mood="happy"
                    size="lg"
                    className="scale-95 md:scale-100 drop-shadow-[0_35px_60px_rgba(79,70,229,0.28)]"
                    bubbleText="Cùng luyện tập mỗi ngày nhé! ✨"
                  />
                </div>
              </div>

              {/* Progress Cards - Vertical stack on the right */}
              <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-auto lg:flex-1 max-w-sm">
                {/* Tiến độ nhanh Card */}
                <div className="floating-panel rounded-3xl p-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Tiến độ nhanh</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                      <span>Từ vựng</span>
                      <span className="text-primary-600">82%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200/70">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: '82%' }}></div>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                      <span>Kỹ năng nghe</span>
                      <span className="text-secondary-500">68%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200/70">
                      <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-teal-400" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Hôm nay Card */}
                <div className="floating-panel rounded-3xl p-6 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Hôm nay</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                      <span>Chuỗi ngày</span>
                      <span className="text-emerald-500">+7 ngày</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                      <span>Bài học hoàn thành</span>
                      <span className="text-primary-600">03</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                      <span>Điểm trung bình</span>
                      <span className="text-amber-500">9.2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="relative py-24 bg-gradient-day overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-70 bg-[radial-gradient(60%_120%_at_0%_0%,rgba(255,255,255,0.6),transparent_70%),radial-gradient(60%_120%_at_100%_0%,rgba(255,255,255,0.5),transparent_75%)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-900">
            <div className="text-center mb-16 sm:mb-20 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-5">
                Nâng tầm hành trình học tập của bạn
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                Một hệ sinh thái học tiếng Anh hiện đại với công nghệ cá nhân hóa, nội dung sống động và hỗ trợ tận tâm.
              </p>
            </div>

            <div className={`features-container ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-slide-in-up" style={{ animationDelay: '0.15s' }}>
                <article className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary-500 via-indigo-500 to-sky-500 text-white shadow-[0_35px_70px_-30px_rgba(37,99,235,0.65)] feature-card feature-card-left">
                  <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 55%)' }}></div>
                  <div className="relative flex flex-col gap-6">
                    <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-2xl">
                      📚
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">Giáo trình đa dạng</h3>
                      <p className="text-base leading-relaxed text-white/85">
                        500+ bài học được viết bởi chuyên gia, từ phát âm, luyện nghe đến tiếng Anh giao tiếp chuyên sâu, sắp xếp theo lộ trình rõ ràng.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/30">
                      <div className="flex -space-x-3">
                        {[1, 2, 3].map((avatar) => (
                          <span key={avatar} className="w-9 h-9 rounded-full border border-white/40 bg-white/30 backdrop-blur text-xs font-semibold flex items-center justify-center">
                            {avatar === 3 ? '+20' : `B${avatar}`}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-white/80">Nội dung cập nhật mỗi tuần</p>
                    </div>
                  </div>
                </article>

                <article className="relative overflow-hidden rounded-3xl p-8 bg-white shadow-soft-xl border border-slate-200/60 feature-card feature-card-center">
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary-100 blur-3xl" />
                  <div className="relative flex flex-col gap-6">
                    <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-200 to-emerald-300 text-2xl">
                      🤖
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">AI Coach đồng hành</h3>
                      <p className="text-base leading-relaxed text-slate-600">
                        Chấm bài viết tự động, gợi ý sửa lỗi phát âm và đề xuất chủ đề hội thoại phù hợp với mục tiêu của bạn trong từng buổi học.
                      </p>
                    </div>
                    <ul className="relative space-y-3 text-sm text-slate-500">
                      <li className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600">✓</span>
                        Chấm điểm phát âm thời gian thực
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600">✓</span>
                        Gợi ý từ vựng theo ngữ cảnh bài học
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600">✓</span>
                        Lưu lịch sử đối thoại và phản hồi chi tiết
                      </li>
                    </ul>
                  </div>
                </article>

                <article className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-white via-primary-50 to-sky-50 shadow-[0_35px_70px_-35px_rgba(14,165,233,0.6)] border border-slate-100 feature-card feature-card-right text-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.18),transparent_60%)]" />
                  <div className="relative flex flex-col gap-6">
                    <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-200 via-indigo-200 to-secondary-200 text-2xl">
                      📈
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900 mb-3">Bảng điều khiển trực quan</h3>
                      <p className="text-base leading-relaxed text-slate-600">
                        Theo dõi tiến độ từng kỹ năng với biểu đồ sinh động, nhận thông báo nhắc học và lộ trình điều chỉnh dựa trên dữ liệu thực tế.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="rounded-2xl bg-white/80 border border-white/60 p-4 text-left">
                        <p className="text-xs uppercase tracking-widest text-primary-500 mb-2">Mốc tháng</p>
                        <p className="text-2xl font-bold text-slate-900">+43%</p>
                        <p className="text-xs text-slate-500">Thời lượng học</p>
                      </div>
                      <div className="rounded-2xl bg-white/80 border border-white/60 p-4 text-left">
                        <p className="text-xs uppercase tracking-widest text-secondary-500 mb-2">Điểm trung bình</p>
                        <p className="text-2xl font-bold text-slate-900">9.0</p>
                        <p className="text-xs text-slate-500">Tăng 1.8 điểm</p>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section ref={statsRef} className="relative py-20 text-white bg-gradient-sunset overflow-hidden">
          <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(90% 120% at 50% 0%, rgba(255,255,255,0.25) 0%, transparent 70%)' }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Cộng đồng học tập không ngừng phát triển
              </h2>
              <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
                Chúng tôi đồng hành cùng bạn bằng dữ liệu thực tế và hỗ trợ liên tục để đảm bảo bạn luôn tiến bộ.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 animate-slide-in-up" style={{ animationDelay: '0.25s' }}>
              {[
                { label: 'Học viên tích cực', value: '12K+', accent: 'from-emerald-400 to-emerald-500' },
                { label: 'Bài học chuyên sâu', value: '620+', accent: 'from-sky-400 to-indigo-400' },
                { label: 'Tỉ lệ hài lòng', value: '96%', accent: 'from-amber-400 to-orange-400' },
                { label: 'Phiên hỗ trợ/tháng', value: '2.4K', accent: 'from-fuchsia-400 to-pink-400' }
              ].map((stat, idx) => (
                <div key={stat.label} className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-white/40 to-white/5">
                  <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl p-8 h-full flex flex-col justify-between">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15">
                      <span className={`inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} text-white font-semibold text-lg`}>
                        {idx + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
                      <p className="text-sm uppercase tracking-[0.35em] text-white/50">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section ref={howItWorksRef} className="relative py-20 bg-gradient-twilight overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-[0.35] bg-[radial-gradient(80%_120%_at_0%_0%,rgba(255,255,255,0.9),transparent_70%),radial-gradient(80%_120%_at_100%_100%,rgba(255,255,255,0.8),transparent_70%)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-900">
            <div className="text-center mb-16 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Lộ trình học 3 bước rõ ràng
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
                Mỗi bước đều được tối ưu để bạn bắt đầu nhanh chóng, duy trì động lực và nhìn thấy kết quả cụ thể.
              </p>
            </div>

            <div className={`how-it-works-container ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}>
              <div className="relative animate-slide-in-up" style={{ animationDelay: '0.35s' }}>
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-primary-200 via-indigo-200 to-transparent" />
                <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-10">
                  {[
                    {
                      step: '01',
                      title: 'Khởi động & khám phá',
                      description: 'Đăng ký tài khoản, làm bài kiểm tra đầu vào và nhận đánh giá chi tiết, từ đó hệ thống tự gợi ý lộ trình phù hợp.',
                      icon: '✨',
                      accent: 'from-primary-100 to-indigo-100'
                    },
                    {
                      step: '02',
                      title: 'Học tập chủ động',
                      description: 'Chọn bài học được cá nhân hóa, kết hợp video tương tác, bài tập nghe - nói và trò chuyện cùng AI coach.',
                      icon: '🧠',
                      accent: 'from-secondary-100 to-emerald-100'
                    },
                    {
                      step: '03',
                      title: 'Đo lường và bứt phá',
                      description: 'Theo dõi tiến độ, mở khóa huy hiệu, nhận nhắc nhở thông minh và điều chỉnh lộ trình dựa trên dữ liệu học tập thực tế.',
                      icon: '🚀',
                      accent: 'from-sky-100 to-fuchsia-100'
                    }
                  ].map((item, index) => (
                    <div
                      key={item.step}
                      className={`relative px-6 py-10 how-it-works-card ${index === 0 ? 'how-it-works-card-left' : index === 1 ? 'how-it-works-card-center' : 'how-it-works-card-right'}`}
                    >
                      <div className="absolute inset-0 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80" />
                      <div className="absolute inset-0 rounded-3xl" style={{ background: `linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(34,211,238,0.05) 100%)` }} />
                      <div className="relative z-10 flex flex-col gap-6 text-left">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-white/60 text-2xl shadow-soft">{item.icon}</span>
                          <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold tracking-[0.3em]">
                            {item.step}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                          <p className="text-base text-slate-600 leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600">★</span>
                          Tư vấn cá nhân hóa trong suốt hành trình
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="relative py-20 bg-gradient-night text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(60%_110%_at_30%_10%,rgba(255,255,255,0.4),transparent_70%),radial-gradient(70%_140%_at_70%_20%,rgba(59,130,246,0.45),transparent_70%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                Học viên nói gì về chúng tôi
              </h2>
              <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">
                Những câu chuyện truyền cảm hứng từ cộng đồng học viên luôn nỗ lực mỗi ngày.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 animate-slide-in-up" style={{ animationDelay: '0.45s' }}>
              <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-primary-500 through-indigo-500 to-sky-500 text-white p-10 shadow-[0_40px_90px_-35px_rgba(59,130,246,0.55)]">
                <span className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
                <span className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">🎓</div>
                    <div>
                      <h4 className="text-xl font-semibold">Nguyễn Anh Minh</h4>
                      <p className="text-white/70 text-sm">Sinh viên Kinh tế Quốc dân</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-200">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed">
                    “Sau 3 tháng học với English Learning Suite, điểm IELTS Speaking của tôi tăng từ 6.0 lên 7.0. Các bài luyện phát âm với AI giúp tôi tự tin hơn rất nhiều khi giao tiếp.”
                  </p>
                  <div className="inline-flex items-center gap-3 text-sm text-white/80">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur">🔥</span>
                    Chuỗi học 45 ngày liên tiếp
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-slate-900">
                {[
                  {
                    name: 'Trần Ngọc Lan',
                    role: 'Nhân viên Marketing',
                    quote: 'Tôi tranh thủ luyện nghe và làm quiz mọi lúc rảnh rỗi. Bảng điều khiển giúp tôi biết chính xác cần tập trung kỹ năng nào.',
                    emoji: '💼'
                  },
                  {
                    name: 'Phạm Quang Hùng',
                    role: 'Kỹ sư phần mềm',
                    quote: 'Các bài kiểm tra định kỳ và đánh giá chi tiết giúp tôi đặt mục tiêu rõ ràng. Giờ tôi tự tin trình bày với khách hàng quốc tế.',
                    emoji: '🛠️'
                  },
                  {
                    name: 'Lê Thị Mai',
                    role: 'Giáo viên tiếng Anh',
                    quote: 'Kho bài giảng phong phú và luôn cập nhật. Tôi còn dùng tài liệu tại đây để hỗ trợ học sinh của mình.',
                    emoji: '📖'
                  }
                ].map((item) => (
                  <article key={item.name} className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 backdrop-blur p-6 shadow-soft">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xl">
                        {item.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900">{item.name}</h4>
                            <p className="text-sm text-slate-500">{item.role}</p>
                          </div>
                          <svg className="w-6 h-6 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.17 6A5.17 5.17 0 002 11.17v6.66A.17.17 0 002.17 18h6.66A.17.17 0 009 17.83V11.17A5.17 5.17 0 003.83 6H7.17zm13 0A5.17 5.17 0 0015 11.17v6.66a.17.17 0 00.17.17h6.66A.17.17 0 0022 17.83V11.17A5.17 5.17 0 0016.83 6h3.34z" />
                          </svg>
                        </div>
                        <p className="mt-4 text-slate-600 leading-relaxed">“{item.quote}”</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!isAuthenticated && (
          <section ref={ctaRef} className="relative py-20 bg-gradient-dawn text-slate-900 overflow-hidden">
            <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(90% 120% at 10% 0%, rgba(255,255,255,0.75) 0%, transparent 70%), radial-gradient(80% 100% at 90% 100%, rgba(255,255,255,0.6) 0%, transparent 65%)' }} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-in-up">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/15 backdrop-blur-lg border border-white/30 mb-8">
                <span className="text-2xl">🚀</span>
                <span className="text-sm uppercase tracking-[0.4em] font-semibold">Sẵn sàng bứt phá</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                Bắt đầu hành trình tiếng Anh của bạn ngay hôm nay
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
                Tạo tài khoản miễn phí, trải nghiệm giáo trình cao cấp và nhận bản đánh giá kỹ năng chi tiết chỉ trong vài phút.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 via-indigo-600 to-secondary-500 rounded-2xl shadow-[0_30px_60px_-25px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:scale-[1.03]"
                >
                  Đăng ký miễn phí
                </Link>
                <Link
                  to="/lessons"
                  className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-primary-600 border border-primary-200 rounded-2xl bg-white/70 backdrop-blur hover:bg-white transition-all duration-300"
                >
                  Xem trước bài học
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
      )}

      {/* Footer */}
      <footer className="relative overflow-hidden bg-slate-950 text-white py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.4),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.35),transparent_55%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold text-xl">EL</span>
                <h3 className="text-2xl sm:text-3xl font-bold">English Learning Suite</h3>
              </div>
              <p className="text-white/70 max-w-xl leading-relaxed mb-8">
                Nền tảng học tiếng Anh được thiết kế cho người Việt với giáo trình hiện đại, công nghệ AI đồng hành và cộng đồng hỗ trợ nhiệt tình.
              </p>
              <div className="flex flex-wrap items-center gap-5 mb-8 text-white/60">
                <span className="text-sm uppercase tracking-[0.3em]">Kết nối</span>
                <a href="#" className="hover:text-white transition-colors">Facebook</a>
                <a href="#" className="hover:text-white transition-colors">YouTube</a>
                <a href="#" className="hover:text-white transition-colors">TikTok</a>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm text-white/70">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">Về chúng tôi</p>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Lộ trình học</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Chính sách</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.35em] text-white/50">Tài nguyên</p>
                <ul className="space-y-3">
                  <li><a href="#" className="hover:text-white transition-colors">Tài liệu miễn phí</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Workshop sắp tới</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cộng đồng Discord</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Hỗ trợ kỹ thuật</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
            <p>© 2024 English Learning Suite. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Hamburger Menu Dropdown */}
      {hamburgerMenuOpen && (
        <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setHamburgerMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">

            {/* Tools Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🛠️</span>
                Công cụ học tập
              </h3>
              <div className="space-y-3">
                <Link to="/library" onClick={() => setHamburgerMenuOpen(false)} className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📚</span>
                    <div>
                      <div className="font-semibold text-gray-900">Thư viện</div>
                      <div className="text-sm text-gray-600">Tài liệu và tài nguyên học tập</div>
                    </div>
                  </div>
                </Link>
                <Link to="/translate" onClick={() => setHamburgerMenuOpen(false)} className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🌐</span>
                    <div>
                      <div className="font-semibold text-gray-900">Dịch thuật</div>
                      <div className="text-sm text-gray-600">Dịch văn bản nhanh chóng</div>
                    </div>
                  </div>
                </Link>
                <Link to="/pronunciation" onClick={() => setHamburgerMenuOpen(false)} className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎤</span>
                    <div>
                      <div className="font-semibold text-gray-900">Phát âm</div>
                      <div className="text-sm text-gray-600">Luyện phát âm chuẩn</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Quick Lessons */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Bài học nhanh
              </h3>
              <div className="space-y-3">
                <Link to="/lessons" className="block p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📖</span>
                    <div>
                      <div className="font-semibold text-gray-900">Từ vựng cơ bản</div>
                      <div className="text-sm text-gray-600">50 từ thông dụng</div>
                    </div>
                  </div>
                </Link>
                <Link to="/lessons" className="block p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔤</span>
                    <div>
                      <div className="font-semibold text-gray-900">Ngữ pháp</div>
                      <div className="text-sm text-gray-600">Thì hiện tại đơn</div>
                    </div>
                  </div>
                </Link>
                <Link to="/lessons" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💬</span>
                    <div>
                      <div className="font-semibold text-gray-900">Hội thoại</div>
                      <div className="text-sm text-gray-600">Chào hỏi cơ bản</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Tiến độ học tập
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Từ vựng</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 rounded-full h-2 w-3/4"></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Ngữ pháp</span>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary-600 rounded-full h-2 w-3/5"></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Hội thoại</span>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 rounded-full h-2 w-2/5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Goal */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Mục tiêu hôm nay
              </h3>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                <p className="text-gray-700 mb-3">Học 10 từ mới và làm 1 bài kiểm tra</p>
                <div className="bg-white rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full h-2 w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                Thành tích
              </h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xl mr-3">🥇</span>
                  <span className="text-sm text-gray-700">Học liên tiếp 7 ngày</span>
                </div>
                <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-xl mr-3">⭐</span>
                  <span className="text-sm text-gray-700">Hoàn thành 20 bài học</span>
                </div>
                <div className="flex items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-xl mr-3">🎯</span>
                  <span className="text-sm text-gray-700">Đạt điểm cao nhất</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {hamburgerMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setHamburgerMenuOpen(false)}
        ></div>
      )}

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        <div className={`scroll-dot ${scrollDirection === 'up' ? 'active' : ''}`}></div>
        <div className={`scroll-dot ${scrollDirection === 'down' ? 'active' : ''}`}></div>
        <div className="scroll-arrow" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
