import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { lessonService, userProgressService } from '../services/api';
import { LessonSummary, UserLessonProgress, UserTestProgress, UserProgressSummary } from '../types';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';
import RewardPopup, { RewardType } from '../components/RewardPopup';
import Breadcrumb from '../components/Breadcrumb';
import SkillRadarChart from '../components/SkillRadarChart';

const formatDuration = (seconds: number) => {
  if (!seconds || seconds <= 0) return '0 phút';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    const adjustedMinutes = minutes + Math.round(remainingSeconds / 60);
    return `${hours}h ${adjustedMinutes}m`;
  }

  const totalMinutes = Math.floor(seconds / 60);
  return totalMinutes > 0 ? `${totalMinutes} phút` : '1 phút';
};

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [lessonProgress, setLessonProgress] = useState<UserLessonProgress[]>([]);
  const [testProgress, setTestProgress] = useState<UserTestProgress[]>([]);
  const [summary, setSummary] = useState<UserProgressSummary | null>(null);
  const [allLessons, setAllLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRewards, setPendingRewards] = useState<Array<{ type: RewardType; amount?: number; badgeName?: string; message?: string }>>([]);
  const [activeReward, setActiveReward] = useState<{ type: RewardType; amount?: number; badgeName?: string; message?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'lessons' | 'tests' | 'achievements'>('overview');

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id || user.id === 0) {
        setLoading(false);
        return;
      }

      try {
        const [lessons, tests, summaryData, lessonSummaries] = await Promise.all([
          userProgressService.getLessonProgress(user.id),
          userProgressService.getTestProgress(user.id),
          userProgressService.getSummary(user.id),
          lessonService.getAllLessons()
        ]);
        setLessonProgress(lessons);
        setTestProgress(tests);
        setSummary(summaryData);
        setAllLessons(lessonSummaries);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setLessonProgress([]);
        setTestProgress([]);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  const completedLessons = summary?.completedLessons ?? lessonProgress.filter(l => l.isCompleted).length;
  const totalLessons = summary?.totalLessons ?? (allLessons.length || lessonProgress.length);
  const averageTestScore = testProgress.length > 0
    ? testProgress.reduce((sum, t) => sum + t.score, 0) / testProgress.length
    : 0;
  const bestScore = testProgress.length > 0 ? Math.max(...testProgress.map((t) => t.score)) : 0;
  const totalXP = completedLessons * 120 + Math.round(averageTestScore * 4);
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const xpInCurrentLevel = totalXP % 1000;
  const xpToNextLevel = 1000 - xpInCurrentLevel;
  const streakDays = summary?.currentStreak ?? Math.max(0, completedLessons);
  const longestStreak = summary?.longestStreak ?? streakDays;
  const lessonTimeSpentSeconds = summary?.lessonTimeSpentSeconds ?? 0;
  const testTimeSpentSeconds = summary?.testTimeSpentSeconds ?? 0;
  
  // Calculate statistics
  const perfectScores = testProgress.filter(t => t.score === 100).length;
  const excellentScores = testProgress.filter(t => t.score >= 90).length;
  const goodScores = testProgress.filter(t => t.score >= 80).length;
  const improvementRate = testProgress.length > 1 
    ? ((testProgress[testProgress.length - 1]?.score || 0) - (testProgress[0]?.score || 0)) / testProgress.length
    : 0;

  const skillData = useMemo(() => {
    const grammar = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    const vocabulary = completedLessons * 4; // xấp xỉ số lượng từ / vốn từ
    const listening = lessonTimeSpentSeconds / 60; // mỗi phút ~1%

    return {
      grammar: Math.min(100, Math.round(grammar)),
      vocabulary: Math.min(100, Math.round(vocabulary)),
      listening: Math.min(100, Math.round(listening))
    };
  }, [completedLessons, totalLessons, lessonTimeSpentSeconds]);

  const mergedLessons = useMemo(() => {
    if (allLessons.length === 0) {
      return lessonProgress.map((progress, index) => ({
        order: index + 1,
        lessonId: progress.lessonId,
        lessonName: progress.lessonName,
        isCompleted: progress.isCompleted,
        completedAt: progress.completedAt,
      }));
    }

    const progressMap = new Map(lessonProgress.map((progress) => [progress.lessonId, progress]));
    return allLessons.map((lesson, index) => {
      const progress = progressMap.get(lesson.id);
      return {
        order: lesson.lessonNumber ?? index + 1,
        lessonId: lesson.id,
        lessonName: lesson.name,
        isCompleted: progress?.isCompleted ?? false,
        completedAt: progress?.completedAt,
      };
    });
  }, [allLessons, lessonProgress]);

  useEffect(() => {
    if (!lessonProgress.length && !testProgress.length) return;

    const rewards: Array<{ type: RewardType; amount?: number; badgeName?: string; message?: string }> = [];

    // Chỉ hiển thị popup XP một lần cho mỗi lần đăng nhập
    const xpSeenKey = user?.id ? `xpRewardSeen_${user.id}` : null;
    const hasSeenXPReward = xpSeenKey ? sessionStorage.getItem(xpSeenKey) === 'true' : false;

    if (completedLessons > 0 && !hasSeenXPReward) {
      rewards.push({
        type: 'xp',
        amount: completedLessons * 15,
        message: 'Tiếp tục hoàn thành bài học để tích lũy kinh nghiệm nhé!'
      });
    }

    if (bestScore >= 95) {
      rewards.push({
        type: 'badge',
        badgeName: 'Huy hiệu Siêu Sao 🎖️',
        message: 'Bạn đạt điểm gần như tuyệt đối! Hãy duy trì phong độ này.'
      });
    } else if (averageTestScore >= 85) {
      rewards.push({
        type: 'badge',
        badgeName: 'Huy hiệu Chăm chỉ 💪',
        message: 'Điểm số của bạn rất ấn tượng, tiếp tục luyện tập nhé!'
      });
    }

    setPendingRewards(rewards);
  }, [completedLessons, averageTestScore, bestScore, lessonProgress.length, testProgress.length, user?.id]);

  useEffect(() => {
    if (activeReward || pendingRewards.length === 0) return;
    const [next, ...rest] = pendingRewards;
    setActiveReward(next);
    setPendingRewards(rest);
  }, [pendingRewards, activeReward]);

  // Achievements
  const achievements = useMemo(() => {
    const ach: Array<{ id: number; name: string; icon: string; description: string; unlocked: boolean }> = [];
    if (completedLessons >= 10) ach.push({ id: 1, name: 'Học viên Chăm chỉ', icon: '📚', description: 'Hoàn thành 10 bài học', unlocked: true });
    if (completedLessons >= 25) ach.push({ id: 2, name: 'Học viên Xuất sắc', icon: '🌟', description: 'Hoàn thành 25 bài học', unlocked: true });
    if (testProgress.length >= 5) ach.push({ id: 3, name: 'Kiểm tra viên', icon: '📝', description: 'Hoàn thành 5 bài kiểm tra', unlocked: true });
    if (bestScore >= 95) ach.push({ id: 4, name: 'Thiên tài', icon: '🎖️', description: 'Đạt điểm 95 trở lên', unlocked: true });
    if (streakDays >= 7) ach.push({ id: 5, name: 'Ngọn lửa bền bỉ', icon: '🔥', description: 'Giữ streak 7 ngày', unlocked: true });
    if (streakDays >= 30) ach.push({ id: 6, name: 'Bậc thầy kiên trì', icon: '💎', description: 'Giữ streak 30 ngày', unlocked: true });
    return ach;
  }, [completedLessons, testProgress.length, bestScore, streakDays]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
          <p className="mt-6 text-gray-700 text-lg font-semibold">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 max-w-md">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa đăng nhập</h2>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem thông tin profile</p>
          <Link 
            to="/login" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-300 to-pink-300 text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-200"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ScenicBackground variant="lake" className="opacity-90" />
      <SiteHeader active="profile" className="relative z-10" />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative z-10">
        <Breadcrumb />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-200/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <RewardPopup
          isOpen={Boolean(activeReward)}
          rewardType={activeReward?.type ?? 'xp'}
          amount={activeReward?.amount}
          badgeName={activeReward?.badgeName}
          message={activeReward?.message}
          onClose={() => {
            if (activeReward?.type === 'xp' && user?.id) {
              const xpSeenKey = `xpRewardSeen_${user.id}`;
              sessionStorage.setItem(xpSeenKey, 'true');
            }
            setActiveReward(null);
          }}
        />

        {/* Profile Header - Enhanced */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 rounded-3xl p-8 md:p-10 text-gray-800 shadow-2xl relative overflow-hidden">
            {/* Animated background */}
            <motion.div
              className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full -mr-32 -mt-32"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/30 rounded-full -ml-24 -mb-24"
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.25, 0.2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <motion.div
                className="w-32 h-32 bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold border-4 border-white/50 shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                <span className="relative z-10 text-gray-800">
                  {user?.fullName && user.fullName.length > 0 
                    ? user.fullName.charAt(0).toUpperCase() 
                    : user?.username && user.username.length > 0
                    ? user.username.charAt(0).toUpperCase()
                    : '👤'}
                </span>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg text-gray-800">
                  {user?.fullName || user?.username || 'Người dùng'}
                </h1>
                <p className="text-xl text-gray-700 mb-4">
                  {user?.username ? `@${user.username}` : 'Chưa có username'}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="bg-white/50 backdrop-blur-sm text-gray-800 text-sm font-semibold px-4 py-2 rounded-full border border-white/50">
                    {user?.role || 'USER'}
                  </span>
                  <span className="bg-white/50 backdrop-blur-sm text-gray-800 text-sm font-semibold px-4 py-2 rounded-full border border-white/50 flex items-center gap-2">
                    <span>🔥</span>
                    <span>Streak: {streakDays} ngày</span>
                  </span>
                  <span className="bg-white/50 backdrop-blur-sm text-gray-800 text-sm font-semibold px-4 py-2 rounded-full border border-white/50 flex items-center gap-2">
                    <span>⭐</span>
                    <span>Level {currentLevel}</span>
                  </span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="w-full md:w-64 bg-white/40 backdrop-blur-sm border border-white/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 text-sm font-semibold">Tiến độ Level</span>
                  <span className="text-gray-800 font-bold">{xpInCurrentLevel}/1000 XP</span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200 h-3 rounded-full relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${(xpInCurrentLevel / 1000) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </motion.div>
                </div>
                <p className="text-gray-700 text-xs mt-2 text-center">
                  Còn {xpToNextLevel} XP để lên Level {currentLevel + 1}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards - Enhanced */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-8">
          <motion.div
            className="bg-white rounded-2xl p-6 text-gray-800 shadow-md relative overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-1">{completedLessons}/{totalLessons}</div>
              <div className="text-sm text-gray-700">Bài học</div>
              <div className="text-xs text-gray-600 mt-1">Hoàn thành</div>
            </div>

          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 text-gray-800 shadow-md relative overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-1">{testProgress.length}</div>
              <div className="text-sm text-gray-700">Bài kiểm tra</div>
              <div className="text-xs text-gray-600 mt-1">Đã làm</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 text-gray-800 shadow-md relative overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-1">
                {isNaN(averageTestScore) ? '0.0' : Math.min(averageTestScore, 100).toFixed(1)}
              </div>
              <div className="text-sm text-gray-700">Điểm TB</div>
              <div className="text-xs text-gray-600 mt-1">Tất cả bài</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 text-gray-800 shadow-md relative overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-1">{isNaN(bestScore) ? '0' : bestScore}</div>
              <div className="text-sm text-gray-700">Điểm cao nhất</div>
              <div className="text-xs text-gray-600 mt-1">Xuất sắc!</div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-6 text-gray-800 shadow-md relative overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"></div>
            <div className="relative z-10">
              <div className="text-3xl font-bold mb-1">{formatDuration(lessonTimeSpentSeconds)}</div>
              <div className="text-sm text-gray-700">Thời gian học</div>
              <div className="text-xs text-gray-600 mt-1">Tổng cộng</div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/50">
            {[
              { id: 'overview', label: 'Tổng quan', icon: '📊' },
              { id: 'lessons', label: 'Bài học', icon: '📚' },
              { id: 'tests', label: 'Kiểm tra', icon: '📝' },
              { id: 'achievements', label: 'Thành tích', icon: '🏆' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 md:flex-none px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-gray-800 shadow-lg scale-105 border border-purple-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Detailed Statistics & Skill chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <SkillRadarChart data={skillData} />
                </div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>📈</span>
                      Thống kê nổi bật
                    </h3>
                    <div className="space-y-3">
                      <motion.div 
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-gray-700 font-medium flex items-center gap-2">
                          <span className="text-lg">💯</span>
                          Điểm hoàn hảo
                        </span>
                        <span className="text-green-600 font-bold text-xl">{perfectScores}</span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-gray-700 font-medium flex items-center gap-2">
                          <span className="text-lg">⭐</span>
                          Điểm xuất sắc (≥90)
                        </span>
                        <span className="text-blue-600 font-bold text-xl">{excellentScores}</span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-md transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-gray-700 font-medium flex items-center gap-2">
                          <span className="text-lg">🔥</span>
                          Chuỗi dài nhất
                        </span>
                        <span className="text-orange-600 font-bold text-xl">{longestStreak} ngày</span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span>🎯</span>
                      Mục tiêu tuần này
                    </h3>
                    <div className="space-y-3">
                      <motion.div 
                        className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 hover:shadow-md transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-primary-700 flex items-center gap-2">
                            <span>📚</span>
                            Hoàn thành 3 bài học
                          </span>
                          <span className="text-xs text-primary-600 font-bold">{Math.min(completedLessons, 3)}/3</span>
                        </div>
                        <div className="w-full bg-primary-200 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((completedLessons / 3) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                          </motion.div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-green-700 flex items-center gap-2">
                            <span>📝</span>
                            Đạt ≥85% ở 2 bài kiểm tra
                          </span>
                          <span className="text-xs text-green-600 font-bold">{testProgress.filter(t => t.score >= 85).length}/2</span>
                        </div>
                        <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((testProgress.filter(t => t.score >= 85).length / 2) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                          </motion.div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-md transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                            <span>🔥</span>
                            Giữ streak 7 ngày
                          </span>
                          <span className="text-xs text-purple-600 font-bold">{Math.min(streakDays, 7)}/7</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((streakDays / 7) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🕐</span>
                  Hoạt động gần đây
                </h3>
                <div className="space-y-3">
                  {testProgress.slice(-5).reverse().map((test, index) => (
                    <motion.div 
                      key={test.id} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl hover:shadow-md transition-all border border-gray-100"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                          isNaN(test.score) ? 'bg-gray-100 text-gray-600' :
                          test.score >= 90 ? 'bg-green-100 text-green-600' :
                          test.score >= 80 ? 'bg-blue-100 text-blue-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {isNaN(test.score) ? '📋' :
                           test.score >= 90 ? '🎉' : 
                           test.score >= 80 ? '👍' : '📝'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{test.testName || 'Bài kiểm tra không tên'}</p>
                          <p className="text-sm text-gray-600">
                            {test.completedAt 
                              ? new Date(test.completedAt).toLocaleDateString('vi-VN', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })
                              : 'Chưa có ngày'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          isNaN(test.score) ? 'text-gray-600' :
                          test.score >= 90 ? 'text-green-600' :
                          test.score >= 80 ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>
                          {isNaN(test.score) ? 'N/A' : Math.min(test.score, 100)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {testProgress.length === 0 && (
                    <p className="text-gray-600 text-center py-8">Chưa có hoạt động nào</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'lessons' && (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📚</span>
                    Tiến độ bài học
                  </h2>
                  <span className="text-sm text-gray-600">
                    {completedLessons}/{totalLessons} hoàn thành
                  </span>
                </div>
                {mergedLessons.length > 0 ? (
                  <div className="space-y-4">
                    {mergedLessons.map((lesson, index) => (
                      <motion.div
                        key={lesson.lessonId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg group"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                            lesson.isCompleted 
                              ? 'bg-gradient-to-br from-green-200 to-emerald-200 text-gray-800 border border-green-300' 
                              : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600'
                          }`}>
                            {lesson.isCompleted ? '✓' : lesson.order}
                          </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-purple-400 transition-colors">
                            {lesson.lessonName || `Bài học ${index + 1}`}
                          </h3>
                            <p className="text-sm text-gray-600">
                              {lesson.isCompleted 
                                ? `Hoàn thành ${lesson.completedAt ? new Date(lesson.completedAt).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  }) : 'gần đây'}`
                                : 'Chưa hoàn thành'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {lesson.isCompleted ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 rounded-xl font-semibold flex items-center gap-2">
                              <span>✓</span>
                              Hoàn thành
                            </span>
                          ) : (
                            <Link 
                              to={`/lessons/${lesson.lessonId}`} 
                              className="px-6 py-2 bg-gradient-to-r from-purple-300 to-pink-300 text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-200"
                            >
                              Tiếp tục
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-gray-600 text-lg mb-2">Chưa có tiến độ bài học nào</p>
                    <p className="text-gray-500 text-sm mb-6">Hãy bắt đầu học để xem tiến độ của bạn!</p>
                    <Link 
                      to="/lessons" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-300 to-pink-300 text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-200"
                    >
                      Xem bài học
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'tests' && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📝</span>
                    Kết quả kiểm tra
                  </h2>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Điểm trung bình</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {isNaN(averageTestScore) ? '0.0' : Math.min(averageTestScore, 100).toFixed(1)}
                    </p>
                  </div>
                </div>
                {testProgress.length > 0 ? (
                  <div className="space-y-4">
                    {testProgress.map((test, index) => (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg"
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold ${
                            test.score >= 90 ? 'bg-gradient-to-br from-green-200 to-emerald-200 text-gray-800 border border-green-300' :
                            test.score >= 80 ? 'bg-gradient-to-br from-blue-200 to-cyan-200 text-gray-800 border border-blue-300' :
                            test.score >= 60 ? 'bg-gradient-to-br from-yellow-200 to-orange-200 text-gray-800 border border-yellow-300' :
                            'bg-gradient-to-br from-rose-200 to-pink-200 text-gray-800 border border-rose-300'
                          }`}>
                            {test.score >= 90 ? '🎉' : test.score >= 80 ? '👍' : test.score >= 60 ? '📝' : '💪'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{test.testName || 'Bài kiểm tra không tên'}</h3>
                            <p className="text-sm text-gray-600">
                              {test.completedAt 
                                ? new Date(test.completedAt).toLocaleDateString('vi-VN', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })
                                : 'Chưa có ngày'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-3xl font-bold ${
                            test.score >= 90 ? 'text-green-600' :
                            test.score >= 80 ? 'text-blue-600' :
                            test.score >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {isNaN(test.score) ? '0' : Math.min(test.score, 100)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {isNaN(test.score) ? 'Chưa có điểm' :
                             test.score >= 90 ? 'Xuất sắc' :
                             test.score >= 80 ? 'Tốt' :
                             test.score >= 60 ? 'Khá' : 'Cần cải thiện'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <p className="text-gray-600 text-lg mb-2">Chưa có kết quả kiểm tra nào</p>
                    <p className="text-gray-500 text-sm mb-6">Hãy làm bài kiểm tra để xem kết quả của bạn!</p>
                    <Link 
                      to="/tests" 
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-300 to-pink-300 text-gray-800 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-200"
                    >
                      Xem bài kiểm tra
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <span>🏆</span>
                  Thành tích
                </h2>
                {achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 rounded-2xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl text-center relative overflow-hidden"
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/30 rounded-full -mr-10 -mt-10"></div>
                        <div className="relative z-10">
                          <motion.div 
                            className="text-5xl mb-3"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            {achievement.icon}
                          </motion.div>
                          <h3 className="font-bold text-gray-900 mb-2 text-lg">{achievement.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                          {achievement.unlocked && (
                            <motion.div 
                              className="mt-3 inline-block px-4 py-2 bg-gradient-to-r from-green-200 to-emerald-200 text-gray-800 rounded-full text-xs font-semibold shadow-md border border-green-300"
                              whileHover={{ scale: 1.1 }}
                            >
                              ✓ Đã mở khóa
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-gray-600 text-lg mb-2">Chưa có thành tích nào</p>
                    <p className="text-gray-500 text-sm">Hãy bắt đầu học để mở khóa thành tích!</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProfilePage;
