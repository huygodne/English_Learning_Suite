import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/api';
import { TestSummary } from '../types';
import ScenicBackground from '../components/ScenicBackground';

const TestsPage: React.FC = () => {
  const [allTests, setAllTests] = useState<TestSummary[]>([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const displayedTests = allTests.slice(0, displayedCount);
  const hasMore = allTests.length > displayedCount;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await testService.getAllTests();
        // Sort theo level (dễ -> khó) và process tên
        const processed = data
          .map(test => ({ ...test }))
          .sort((a, b) => a.level - b.level);
        setAllTests(processed);
      } catch (err: any) {
        setError('Không thể tải danh sách bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

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
      <ScenicBackground variant="sunset" />
      {/* Header */}
      <header className="bg-gradient-to-r from-secondary-600 to-primary-600 shadow-lg/60 glass relative z-10">
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
              <Link to="/tests" className="text-white bg-white/30 px-3 py-2 text-sm font-medium rounded-lg">
                Kiểm tra
              </Link>
              <Link to="/profile" className="text-white hover:text-primary-100 px-3 py-2 text-sm font-medium transition-colors duration-300 rounded-lg hover:bg-white/20">
                Hồ sơ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-contrast heading-glow mb-4">
            Bài kiểm tra
          </h1>
          <p className="text-xl text-gray-700/90">
            Đánh giá kiến thức và kỹ năng tiếng Anh của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedTests.map((test, index) => (
            <div 
              key={test.id} 
              className="card-feature group animate-fade-in-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  Kiểm tra
                </span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                  test.level === 1 
                    ? 'bg-green-100 text-green-800' 
                    : test.level === 2 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {test.level === 1 ? 'Easy' : test.level === 2 ? 'Medium' : 'Hard'}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {(() => { const i=Math.max(test.name.lastIndexOf(':'), test.name.lastIndexOf('-')); return i>=0 ? test.name.slice(i+1).trim() : test.name; })()}
              </h3>
              
              <div className="flex justify-between items-center">
                <Link
                  to={`/tests/${test.id}`}
                  className="btn-primary transform transition-all duration-300 hover:scale-110"
                >
                  Bắt đầu kiểm tra
                </Link>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  20 phút
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
              Xem thêm ({allTests.length - displayedCount} bài nữa)
            </button>
          </div>
        )}

        {allTests.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài kiểm tra</h3>
            <p className="text-gray-600">Hiện tại chưa có bài kiểm tra nào được tạo.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestsPage;
