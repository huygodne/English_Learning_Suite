import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userProgressService } from '../services/api';
import { UserLessonProgress, UserTestProgress } from '../types';
import ScenicBackground from '../components/ScenicBackground';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [lessonProgress, setLessonProgress] = useState<UserLessonProgress[]>([]);
  const [testProgress, setTestProgress] = useState<UserTestProgress[]>([]);
  const [loading, setLoading] = useState(true);

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

  const completedLessons = lessonProgress.filter(l => l.isCompleted).length;
  const totalLessons = lessonProgress.length;
  const averageTestScore = testProgress.length > 0 
    ? testProgress.reduce((sum, t) => sum + t.score, 0) / testProgress.length 
    : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ScenicBackground variant="mountain" />
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 shadow-lg/60 glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white hover:text-primary-100 transition-colors duration-300">
                English Learning Suite
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20">
                Trang chủ
              </Link>
              <Link to="/lessons" className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20">
                Bài học
              </Link>
              <Link to="/tests" className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20">
                Kiểm tra
              </Link>
              <Link to="/profile" className="text-white bg-white/30 px-3 py-2 text-sm font-medium rounded-lg">
                Hồ sơ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white">Xin chào, {user?.fullName}</span>
              <button 
                onClick={logout}
                className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Profile Header */}
        <div className="card mb-8 animate-fade-in transform transition-all duration-300 hover:scale-[1.01]">
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

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center animate-fade-in-up transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {completedLessons}/{totalLessons}
            </div>
            <div className="text-gray-600">Bài học hoàn thành</div>
          </div>
          
          <div className="card text-center animate-fade-in-up transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="text-3xl font-bold text-secondary-600 mb-2">
              {testProgress.length}
            </div>
            <div className="text-gray-600">Bài kiểm tra đã làm</div>
          </div>
          
          <div className="card text-center animate-fade-in-up transform transition-all duration-300 hover:scale-105" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {averageTestScore.toFixed(1)}%
            </div>
            <div className="text-gray-600">Điểm trung bình</div>
          </div>
        </div>

        {/* Lesson Progress */}
        <div className="card mb-8 animate-fade-in transform transition-all duration-300 hover:scale-[1.01]">
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

        {/* Test Results */}
        <div className="card animate-fade-in transform transition-all duration-300 hover:scale-[1.01]">
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
