import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { lessonService } from '../services/api';
import { LessonSummary } from '../types';
import ScenicBackground from '../components/ScenicBackground';

const LessonsPage: React.FC = () => {
  const [allLessons, setAllLessons] = useState<LessonSummary[]>([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const lessonsRef = useRef<HTMLDivElement>(null);
  
  const displayedLessons = allLessons.slice(0, displayedCount);
  const hasMore = allLessons.length > displayedCount;

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
      headerRef.current,
      lessonsRef.current
    ].filter(Boolean);

    elementsToObserve.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        console.log('Fetching lessons...');
        const data = await lessonService.getAllLessons();
        console.log('Lessons data:', data);
        // Sort theo level (dễ -> khó)
        const sorted = [...data].sort((a, b) => a.level - b.level);
        setAllLessons(sorted);
      } catch (err: any) {
        console.error('Error fetching lessons:', err);
        setError('Không thể tải danh sách bài học: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
          <p className="text-lg text-gray-600">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ScenicBackground variant="meadow" />
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg/60 glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-white hover:text-primary-100 transition-colors duration-300">
                English Learning Suite
              </Link>
            </div>
            <nav className="hidden md:flex space-x-2">
              <Link to="/" className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20">
                Trang chủ
              </Link>
              <Link to="/lessons" className="text-white bg-white/30 px-3 py-2 text-sm font-medium rounded-lg">
                Bài học
              </Link>
              <Link to="/tests" className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20">
                Kiểm tra
              </Link>
              <Link to="/profile" className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20">
                Hồ sơ
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-primary-600 p-2 rounded-lg transition-colors duration-300"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                Trang chủ
              </Link>
              <Link to="/lessons" className="block text-primary-600 py-2 text-base font-medium">
                Bài học
              </Link>
              <Link to="/tests" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                Kiểm tra
              </Link>
              <Link to="/profile" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                Hồ sơ
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-contrast heading-glow mb-4 sm:mb-6">
            Danh sách bài học
          </h1>
          <p className="text-lg sm:text-xl text-gray-700/90 max-w-3xl mx-auto px-4">
            Chọn bài học phù hợp với trình độ của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedLessons.map((lesson, index) => (
            <div 
              key={lesson.id} 
              className="card-feature group animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="bg-primary-100 text-primary-800 text-sm font-semibold px-4 py-2 rounded-xl">
                  Bài {lesson.lessonNumber}
                </span>
                <span className={`text-sm font-semibold px-4 py-2 rounded-xl ${
                  lesson.level === 1 
                    ? 'bg-green-100 text-green-800' 
                    : lesson.level === 2 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {lesson.level === 1 ? 'Easy' : lesson.level === 2 ? 'Medium' : 'Hard'}
                </span>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                {(() => { const i=Math.max(lesson.name.lastIndexOf(':'), lesson.name.lastIndexOf('-')); return i>=0 ? lesson.name.slice(i+1).trim() : lesson.name; })()}
              </h3>
              
              <div className="flex justify-between items-center">
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="btn-primary transform transition-all duration-300 hover:scale-110"
                >
                  Bắt đầu học
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  30 phút
                </div>
              </div>
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-12 animate-fade-in">
            <button
              onClick={() => setDisplayedCount(prev => prev + 10)}
              className="btn-primary transform transition-all duration-300 hover:scale-110 animate-bounce-gentle"
            >
              Xem thêm ({allLessons.length - displayedCount} bài nữa)
            </button>
          </div>
        )}

        {allLessons.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Chưa có bài học</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">Hiện tại chưa có bài học nào được tạo. Vui lòng quay lại sau.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LessonsPage;
