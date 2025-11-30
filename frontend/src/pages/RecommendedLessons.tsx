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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ScenicBackground variant="mountain" />
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ScenicBackground variant="mountain" />
      <SiteHeader active="recommendations" />
      <Breadcrumb items={[{ label: 'Trang chủ', path: '/' }, { label: 'Gợi ý thông minh', path: '/recommendations' }]} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Section A: User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Hệ Thống Gợi Ý Thông Minh
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column: User Info */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <h3 className="text-xl font-semibold mb-4">Thông Tin Người Dùng</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-indigo-100 text-sm">Tên</p>
                    <p className="text-2xl font-bold">{userStats?.fullName || user?.fullName || 'Chưa xác định'}</p>
                  </div>
                  <div>
                    <p className="text-indigo-100 text-sm">Điểm Elo Hiện Tại</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-2xl font-bold text-white ${getEloBadgeColor(
                        userStats?.eloRating || 1500
                      )}`}
                    >
                      {userStats?.eloRating || 1500}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Radar Chart */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Vector Năng Lực (Nhu Cầu Học Tập)
              </h3>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar
                      name="Proficiency"
                      dataKey="value"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.6}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No data available
                </div>
              )}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-gray-600">Ngữ Pháp</p>
                  <p className="font-bold text-purple-600">
                    {((userStats?.grammarProficiency || 0) * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Từ Vựng</p>
                  <p className="font-bold text-blue-600">
                    {((userStats?.vocabProficiency || 0) * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Nghe Hiểu</p>
                  <p className="font-bold text-green-600">
                    {((userStats?.listeningProficiency || 0) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section B: Recommended Lessons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            📚 Bài Học Được Gợi Ý (Top 5)
          </h2>

          {recommendedLessons.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <p className="text-gray-600 text-lg">Không có bài học nào được gợi ý.</p>
            </div>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
                  >
                    {/* Lesson Image Placeholder */}
                    <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <span className="text-6xl text-white opacity-80">📖</span>
                    </div>

                    <div className="p-5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{lesson.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">Bài #{lesson.lessonNumber} • Cấp độ {lesson.level}</p>

                      {/* Difficulty Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-gray-700">Độ Khó:</span>
                        <span className="text-sm font-bold">
                          {lesson.difficultyRating || 1500} ({difficultyInfo.text})
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${difficultyInfo.color} bg-opacity-20`}>
                          {difficultyInfo.text}
                        </span>
                      </div>

                      {/* Compatibility Score */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-700">Độ Phù Hợp:</span>
                          <span className="text-lg font-bold text-indigo-600">{similarityPercent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${similarityPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Focus Tag */}
                      {focusTag && (
                        <div className="mb-3">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${focusTag.color}`}>
                            {focusTag.text}
                          </span>
                        </div>
                      )}

                      {/* Simulation Buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleSimulate(lesson.id, true)}
                          disabled={simulating === lesson.id}
                          className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          {simulating === lesson.id ? '⏳' : '✓'} Mô Phỏng ĐÚNG
                        </button>
                        <button
                          onClick={() => handleSimulate(lesson.id, false)}
                          disabled={simulating === lesson.id}
                          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          {simulating === lesson.id ? '⏳' : '✗'} Mô Phỏng SAI
                        </button>
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

