import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { lessonService, userProgressService } from '../services/api';
import { LessonSummary, UserLessonProgress } from '../types';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';
import LessonList from '../components/LessonList';
import { useAuth } from '../contexts/AuthContext';

const LessonsPage: React.FC = () => {
  const [allLessons, setAllLessons] = useState<LessonSummary[]>([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<UserLessonProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const displayedLessons = allLessons.slice(0, displayedCount);
  const hasMore = allLessons.length > displayedCount;
  
  const activityParam = searchParams.get('activity');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await lessonService.getAllLessons();
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

  // Redirect to first lesson with activity param if activity is specified
  useEffect(() => {
    if (activityParam && allLessons.length > 0 && !loading) {
      const firstLesson = allLessons[0];
      const validActivities = ['flashcard', 'blast', 'blocks'];
      if (validActivities.includes(activityParam)) {
        navigate(`/lessons/${firstLesson.id}?activity=${activityParam}`, { replace: true });
      }
    }
  }, [activityParam, allLessons, loading, navigate]);

  useEffect(() => {
    if (!user?.id) {
      setProgress([]);
      return;
    }
    const fetchProgress = async () => {
      setProgressLoading(true);
      try {
        const data = await userProgressService.getLessonProgress(user.id);
        setProgress(data);
      } catch (err) {
        console.error('Không thể tải tiến độ bài học của bạn', err);
      } finally {
        setProgressLoading(false);
      }
    };
    fetchProgress();
  }, [user?.id]);

  const progressByLesson = useMemo(() => {
    const map: Record<number, UserLessonProgress> = {};
    progress.forEach((item) => {
      map[item.lessonId] = item;
    });
    return map;
  }, [progress]);

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
      <SiteHeader active="lessons" className="relative z-10" />

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

        <LessonList lessons={displayedLessons} progressByLesson={progressByLesson} loadingProgress={progressLoading} />

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
