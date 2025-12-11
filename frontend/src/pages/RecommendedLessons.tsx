import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { recommendationService } from '../services/api';
import { UserStats, RecommendedLesson } from '../types';
import Toast from '../components/Toast';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';
import Breadcrumb from '../components/Breadcrumb';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

const RecommendedLessons: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recommendedLessons, setRecommendedLessons] = useState<RecommendedLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState<number | null>(null); // lessonId being simulated
  const [toast, setToast] = useState<ToastState | null>(null);

  // Fetch user stats and recommendations
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Refresh data when page becomes visible (user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        fetchData();
      }
    };

    const handleFocus = () => {
      if (user?.id) {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Nếu có user đăng nhập, sử dụng user.id, nếu không thì để null (backend sẽ dùng user đầu tiên)
      const userId = user?.id || undefined;
      
      const [stats, lessons] = await Promise.all([
        recommendationService.getUserStats(userId),
        recommendationService.getRecommendedLessons(userId),
      ]);
      setUserStats(stats);
      setRecommendedLessons(lessons);
    } catch (error) {
      console.error('Error fetching data:', error);
      setToast({ message: 'Không thể tải dữ liệu. Vui lòng thử lại.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulate = async (lessonId: number, isPassed: boolean) => {
    // Sử dụng userId từ userStats nếu có, nếu không thì dùng user.id hoặc userId mặc định
    const userId = userStats?.id || user?.id || 1;

    try {
      setSimulating(lessonId);
      const response = await recommendationService.simulateLessonResult({
        userId: userId,
        lessonId,
        isPassed,
      });

      // Parse response to extract Elo change
      const eloMatch = response.match(/Elo Rating: (\d+) \(Δ(-?\d+)\)/);
      const eloChange = eloMatch ? parseInt(eloMatch[2]) : 0;

      setToast({
        message: `Elo Updated! User: ${eloChange > 0 ? '+' : ''}${eloChange}`,
        type: isPassed ? 'success' : 'info',
      });

      // Refresh data after simulation
      await fetchData();
    } catch (error) {
      console.error('Error simulating lesson result:', error);
      setToast({ message: 'Không thể simulate. Vui lòng thử lại.', type: 'error' });
    } finally {
      setSimulating(null);
    }
  };

  // Prepare radar chart data
  const radarData = userStats
    ? [
        {
          subject: 'Grammar',
          value: (userStats.grammarProficiency * 100).toFixed(0),
          fullMark: 100,
        },
        {
          subject: 'Vocabulary',
          value: (userStats.vocabProficiency * 100).toFixed(0),
          fullMark: 100,
        },
        {
          subject: 'Listening',
          value: (userStats.listeningProficiency * 100).toFixed(0),
          fullMark: 100,
        },
      ]
    : [];

  // Get Elo badge color
  const getEloBadgeColor = (elo: number) => {
    if (elo >= 1800) return 'bg-purple-600';
    if (elo >= 1600) return 'bg-blue-600';
    if (elo >= 1400) return 'bg-green-600';
    if (elo >= 1200) return 'bg-yellow-600';
    return 'bg-orange-600';
  };

  // Get difficulty comparison text
  const getDifficultyText = (lessonDifficulty: number, userElo: number) => {
    const diff = lessonDifficulty - userElo;
    if (diff > 100) return { text: 'Khó hơn', color: 'text-red-600' };
    if (diff < -100) return { text: 'Dễ hơn', color: 'text-green-600' };
    return { text: 'Phù hợp', color: 'text-blue-600' };
  };

  // Get focus tag based on lesson weights
  const getFocusTag = (lesson: RecommendedLesson) => {
    if (!lesson.grammarWeight || !lesson.vocabWeight || !lesson.listeningWeight) return null;
    
    const maxWeight = Math.max(lesson.grammarWeight, lesson.vocabWeight, lesson.listeningWeight);
    if (maxWeight === lesson.grammarWeight) return { text: 'Trọng Tâm: Ngữ Pháp', color: 'bg-purple-500' };
    if (maxWeight === lesson.vocabWeight) return { text: 'Trọng Tâm: Từ Vựng', color: 'bg-blue-500' };
    return { text: 'Trọng Tâm: Nghe Hiểu', color: 'bg-green-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 relative overflow-hidden">
        <ScenicBackground variant="mountain" />
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[60vh] relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
          </div>
            <p className="text-gray-700 text-xl font-semibold">Đang phân tích dữ liệu AI...</p>
            <p className="text-gray-500 text-sm mt-2">Vui lòng đợi trong giây lát</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100">
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(196, 181, 253, 0.4), rgba(251, 207, 232, 0.4), rgba(255, 228, 230, 0.4))',
          }}
          animate={{
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        {/* Additional animated layers */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-pink-200/30 to-purple-200/30"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-bl from-rose-200/30 to-pink-200/30"
          animate={{
            opacity: [0.2, 0.35, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Large Blob Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1 - Top Left */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Blob 2 - Top Right */}
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-pink-300/30 to-rose-300/30 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Blob 3 - Bottom Left */}
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Blob 4 - Bottom Right */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-tl from-rose-300/25 to-pink-300/25 rounded-full blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Blob 5 - Center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-300/20 via-pink-300/20 to-rose-300/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Radial Gradient Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Particles - Enhanced */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              background: i % 3 === 0 
                ? 'rgba(139, 92, 246, 0.4)' 
                : i % 3 === 1 
                ? 'rgba(236, 72, 153, 0.4)' 
                : 'rgba(251, 113, 133, 0.4)',
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
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

      {/* Sparkle Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute"
            style={{
              width: '4px',
              height: '4px',
              background: 'white',
              borderRadius: '50%',
              boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.8)',
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [null, (Math.random() - 0.5) * 100],
              x: [null, (Math.random() - 0.5) * 100],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <ScenicBackground variant="mountain" />
      <SiteHeader active="recommendations" />
      <Breadcrumb items={[{ label: 'Trang chủ', path: '/' }, { label: 'Gợi ý thông minh', path: '/recommendations' }]} />

      {/* Floating AI Character */}
      <div className="absolute top-32 right-8 z-10 hidden lg:block">
        <motion.div 
          className="relative"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-32 h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
            <span className="relative z-10">🤖</span>
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md whitespace-nowrap">
            AI đang phân tích!
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 rounded-3xl p-8 md:p-12 text-gray-800 shadow-2xl relative overflow-hidden">
            {/* Animated Background Elements */}
            <motion.div 
              className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full -mr-32 -mt-32"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/30 rounded-full -ml-24 -mb-24"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.25, 0.2]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            <div className="relative z-10">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                🤖 Hệ Thống Gợi Ý Thông Minh
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                AI phân tích năng lực và đề xuất bài học phù hợp nhất với bạn
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Section A: User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-2 border-purple-100"
        >
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column: User Info */}
            <div className="space-y-4">
              <motion.div 
                className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                      👤
                    </div>
                    <h3 className="text-2xl font-bold">Thông Tin Người Dùng</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-purple-100 text-sm font-medium mb-1">Tên</p>
                      <p className="text-2xl md:text-3xl font-bold">{userStats?.fullName || user?.fullName || 'Chưa xác định'}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-purple-100 text-sm font-medium mb-2">Điểm Elo Hiện Tại</p>
                    <span
                        className={`inline-block px-5 py-3 rounded-xl text-2xl md:text-3xl font-bold text-white shadow-lg ${getEloBadgeColor(
                        userStats?.eloRating || 1500
                      )}`}
                    >
                      {userStats?.eloRating || 1500}
                    </span>
                  </div>
                </div>
              </div>
              </motion.div>
            </div>

            {/* Right Column: Radar Chart */}
            <motion.div 
              className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 md:p-8 shadow-xl border-2 border-purple-100"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl">
                  📊
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                  Vector Năng Lực
              </h3>
              </div>
              {radarData.length > 0 ? (
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4">
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                      <PolarGrid stroke="#cbd5e1" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} 
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]} 
                        tick={{ fill: '#64748b', fontSize: 11 }} 
                      />
                    <Radar
                      name="Proficiency"
                      dataKey="value"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.7}
                        strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">📊</span>
                    <p>Chưa có dữ liệu</p>
                  </div>
                </div>
              )}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-gray-600 text-xs font-medium mb-1">Ngữ Pháp</p>
                  <p className="font-bold text-lg text-purple-600">
                    {((userStats?.grammarProficiency || 0) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-gray-600 text-xs font-medium mb-1">Từ Vựng</p>
                  <p className="font-bold text-lg text-blue-600">
                    {((userStats?.vocabProficiency || 0) * 100).toFixed(0)}%
                  </p>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center">
                  <p className="text-gray-600 text-xs font-medium mb-1">Nghe Hiểu</p>
                  <p className="font-bold text-lg text-green-600">
                    {((userStats?.listeningProficiency || 0) * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Section B: Recommended Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <motion.h2 
              className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              📚 Bài Học Được Gợi Ý
            </motion.h2>
            <motion.p 
              className="text-gray-600 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              Top {recommendedLessons.length} bài học phù hợp nhất với bạn
            </motion.p>
          </div>

          {recommendedLessons.length === 0 ? (
            <motion.div 
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border-2 border-purple-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 text-lg font-medium">Không có bài học nào được gợi ý.</p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedLessons.map((lesson, index) => {
                const difficultyInfo = getDifficultyText(
                  lesson.difficultyRating || 1500,
                  userStats?.eloRating || 1500
                );
                const focusTag = getFocusTag(lesson);
                const similarityPercent = ((lesson.similarity || 0) * 100).toFixed(1);

                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-100 group"
                  >
                    {/* Lesson Header with Gradient */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-rose-400 flex items-center justify-center overflow-hidden">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <motion.span 
                        className="text-7xl text-white relative z-10"
                        animate={{ 
                          rotate: [0, 5, -5, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        📖
                      </motion.span>
                      {/* Rank Badge */}
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center font-bold text-purple-600 shadow-lg">
                        #{index + 1}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                        Bài {lesson.lessonNumber}: {lesson.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          Bài #{lesson.lessonNumber}
                        </span>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          Cấp độ {lesson.level}
                        </span>
                      </div>

                      {/* Compatibility Score - Enhanced */}
                      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <span>🎯</span> Độ Phù Hợp
                          </span>
                          <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {similarityPercent}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                          <motion.div
                            className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 h-3 rounded-full relative overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: `${similarityPercent}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Difficulty Badge - Enhanced */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <span>⚡</span> Độ Khó
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-800">
                              {lesson.difficultyRating || 1500}
                            </span>
                            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${difficultyInfo.color} bg-opacity-20 border ${difficultyInfo.color.replace('text-', 'border-')}`}>
                              {difficultyInfo.text}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Focus Tag - Enhanced */}
                      {focusTag && (
                        <div className="mb-4">
                          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-lg ${focusTag.color}`}>
                            <span>✨</span>
                            {focusTag.text}
                          </span>
                        </div>
                      )}

                      {/* Simulation Buttons - Enhanced */}
                      <div className="flex gap-3 mt-6">
                        <motion.button
                          onClick={() => handleSimulate(lesson.id, true)}
                          disabled={simulating === lesson.id}
                          whileHover={{ scale: simulating !== lesson.id ? 1.05 : 1 }}
                          whileTap={{ scale: simulating !== lesson.id ? 0.95 : 1 }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm shadow-lg disabled:shadow-none relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {simulating === lesson.id ? (
                              <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <span>✓</span> Mô Phỏng ĐÚNG
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </motion.button>
                        <motion.button
                          onClick={() => handleSimulate(lesson.id, false)}
                          disabled={simulating === lesson.id}
                          whileHover={{ scale: simulating !== lesson.id ? 1.05 : 1 }}
                          whileTap={{ scale: simulating !== lesson.id ? 0.95 : 1 }}
                          className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 text-sm shadow-lg disabled:shadow-none relative overflow-hidden group"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {simulating === lesson.id ? (
                              <>
                                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <span>✗</span> Mô Phỏng SAI
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default RecommendedLessons;

