import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userProgressService } from '../services/api';
import { UserLessonProgress, UserTestProgress } from '../types';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';
import RewardPopup, { RewardType } from '../components/RewardPopup';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [lessonProgress, setLessonProgress] = useState<UserLessonProgress[]>([]);
  const [testProgress, setTestProgress] = useState<UserTestProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingRewards, setPendingRewards] = useState<Array<{ type: RewardType; amount?: number; badgeName?: string; message?: string }>>([]);
  const [activeReward, setActiveReward] = useState<{ type: RewardType; amount?: number; badgeName?: string; message?: string } | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id || user.id === 0) {
        setLoading(false);
        return;
      }

      try {
        const [lessons, tests] = await Promise.all([
          userProgressService.getLessonProgress(user.id),
          userProgressService.getTestProgress(user.id)
        ]);
        setLessonProgress(lessons);
        setTestProgress(tests);
      } catch (error) {
        console.error('Error fetching progress:', error);
        setLessonProgress([]);
        setTestProgress([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  const completedLessons = lessonProgress.filter(l => l.isCompleted).length;
  const totalLessons = lessonProgress.length;
  const averageTestScore = testProgress.length > 0
    ? testProgress.reduce((sum, t) => sum + t.score, 0) / testProgress.length
    : 0;
  const bestScore = testProgress.length > 0 ? Math.max(...testProgress.map((t) => t.score)) : 0;

  useEffect(() => {
    if (!lessonProgress.length && !testProgress.length) return;

    const rewards: Array<{ type: RewardType; amount?: number; badgeName?: string; message?: string }> = [];

    if (completedLessons > 0) {
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
  }, [completedLessons, averageTestScore, bestScore, lessonProgress.length, testProgress.length]);

  useEffect(() => {
    if (activeReward || pendingRewards.length === 0) return;
    const [next, ...rest] = pendingRewards;
    setActiveReward(next);
    setPendingRewards(rest);
  }, [pendingRewards, activeReward]);

  const leaderboardData = useMemo(() => {
    const mock = [
      { id: 1, name: 'Bạn', xp: completedLessons * 120 + Math.round(averageTestScore * 4), streak: Math.max(1, completedLessons), avatar: '🧑‍🎓', highlight: true },
      { id: 2, name: 'Minh Anh', xp: 4280, streak: 17, avatar: '🦉' },
      { id: 3, name: 'Lan Chi', xp: 3990, streak: 14, avatar: '🌟' },
      { id: 4, name: 'Hoàng Dũng', xp: 3625, streak: 12, avatar: '🚀' },
      { id: 5, name: 'Quỳnh Mai', xp: 3310, streak: 9, avatar: '🎧' }
    ];

    return mock
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
      .sort((a, b) => b.xp - a.xp);
  }, [completedLessons, averageTestScore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ScenicBackground variant="sunset" className="opacity-90" />
      <SiteHeader active="profile" className="relative z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_120%_at_10%_0%,rgba(255,255,255,0.75),transparent_70%),radial-gradient(90%_140%_at_90%_100%,rgba(99,102,241,0.3),transparent_65%),linear-gradient(180deg,rgba(255,228,230,0.4)0%,rgba(221,214,254,0.4)100%)]" />
        <RewardPopup
          isOpen={Boolean(activeReward)}
          rewardType={activeReward?.type ?? 'xp'}
          amount={activeReward?.amount}
          badgeName={activeReward?.badgeName}
          message={activeReward?.message}
          onClose={() => setActiveReward(null)}
        />

        <div className="card bg-white/75 border border-white/60 backdrop-blur-xl mb-8 animate-fade-in transform transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600">
                {user?.fullName?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-contrast heading-glow">{user?.fullName}</h1>
              <p className="text-gray-600">@{user?.username}</p>
              <span className="inline-block bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full mt-2">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-white/75 border border-white/50 backdrop-blur-xl text-center animate-fade-in-up transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {completedLessons}/{totalLessons}
            </div>
            <div className="text-gray-600">Bài học hoàn thành</div>
          </div>

          <div className="card bg-white/75 border border-white/50 backdrop-blur-xl text-center animate-fade-in-up transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="text-3xl font-bold text-secondary-600 mb-2">
              {testProgress.length}
            </div>
            <div className="text-gray-600">Bài kiểm tra đã làm</div>
          </div>

          <div className="card bg-white/75 border border-white/50 backdrop-blur-xl text-center animate-fade-in-up transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {averageTestScore.toFixed(1)}%
            </div>
            <div className="text-gray-600">Điểm trung bình</div>
          </div>
        </div>

        <div className="card bg-white/80 border border-white/50 backdrop-blur-xl mb-8 animate-fade-in transform transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tiến độ bài học</h2>
          {lessonProgress.length > 0 ? (
            <div className="space-y-4">
              {lessonProgress.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-fade-in-up transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{lesson.lessonName}</h3>
                    <p className="text-sm text-gray-600">
                      {lesson.isCompleted ? 'Hoàn thành' : 'Chưa hoàn thành'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {lesson.isCompleted ? (
                      <span className="text-green-600 font-medium">✓ Hoàn thành</span>
                    ) : (
                      <Link to={`/lessons/${lesson.lessonId}`} className="btn-primary">
                        Tiếp tục
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">Chưa có tiến độ bài học nào.</p>
          )}
        </div>

        <div className="card bg-white/80 border border-white/50 backdrop-blur-xl mb-8 animate-fade-in transform transition-all duration-300 hover:scale-[1.01]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bảng xếp hạng</h2>
              <p className="text-sm text-gray-500">Cạnh tranh cùng bạn bè và duy trì streak của bạn.</p>
            </div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 bg-primary-50 px-4 py-2 rounded-xl">
              🔥 Chuỗi hiện tại: {Math.max(1, completedLessons)} ngày
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="bg-gradient-to-br from-white/80 via-primary-50/80 to-secondary-50/70 border border-white/60 rounded-2xl p-6 shadow-inner">
              <ul className="space-y-3">
                {leaderboardData.map((entry) => (
                  <li
                    key={entry.id}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 gap-4 ${
                      entry.highlight
                        ? 'border-primary-200 bg-white shadow-[0_12px_30px_-20px_rgba(59,130,246,0.6)]'
                        : 'border-slate-200 bg-white/70'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center">
                        {entry.rank}
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/80 to-indigo-500/80 flex items-center justify-center text-2xl">
                        {entry.avatar}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900">{entry.name}</p>
                        <p className="text-xs text-slate-500">Chuỗi: {entry.streak} ngày</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">{entry.xp.toLocaleString()} XP</p>
                      <p className="text-xs text-slate-400">+120 XP tuần này</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/85 border border-white/50 backdrop-blur-xl rounded-2xl p-6 space-y-4 shadow-soft">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Mẹo giữ streak</h3>
                <p className="text-sm text-slate-600">
                  Hoàn thành ít nhất một bài luyện tập mỗi ngày để giữ streak và nhận thêm XP thưởng. Lên lịch nhắc nhở trong ứng dụng để không bỏ lỡ!
                </p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-secondary-100 to-emerald-100 p-4">
                <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.3em]">Thưởng streak</h4>
                <p className="text-2xl font-bold text-emerald-700 mt-2">+50 XP</p>
                <p className="text-xs text-emerald-600 mt-1">Mỗi 5 ngày streak</p>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-primary-100/80 to-sky-200/90 p-4 space-y-2">
                <p className="text-sm font-medium text-primary-700">Mục tiêu tuần này</p>
                <ul className="text-sm text-primary-600 space-y-1">
                  <li>• Hoàn thành 3 bài học kỹ năng nghe</li>
                  <li>• Đạt ít nhất 85 điểm ở 2 bài kiểm tra</li>
                  <li>• Ôn lại 20 từ vựng bằng Flashcard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white/80 border border-white/50 backdrop-blur-xl animate-fade-in transform transition-all duration-300 hover:scale-[1.01]">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kết quả kiểm tra</h2>
          {testProgress.length > 0 ? (
            <div className="space-y-4">
              {testProgress.map((test, index) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-fade-in-up transform transition-all duration-300 hover:scale-[1.02] hover:bg-gray-100"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                    <p className="text-sm text-gray-600">
                      Điểm: {test.score}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      test.score >= 80 ? 'text-green-600' :
                      test.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {test.score}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {test.score >= 80 ? 'Xuất sắc' :
                       test.score >= 60 ? 'Khá' : 'Cần cải thiện'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">Chưa có kết quả kiểm tra nào.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
