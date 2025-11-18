import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { testService, userProgressService } from '../services/api';
import { TestSummary, UserTestProgress } from '../types';
import { useAuth } from '../contexts/AuthContext';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';

const TestsPage: React.FC = () => {
  const { user } = useAuth();
  const [allTests, setAllTests] = useState<TestSummary[]>([]);
  const [completedTests, setCompletedTests] = useState<UserTestProgress[]>([]);
  const [displayedCount, setDisplayedCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const displayedTests = allTests.slice(0, displayedCount);
  const hasMore = allTests.length > displayedCount;
  
  // Get completed test IDs
  const completedTestIds = new Set(completedTests.map(t => t.testId));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsData, progressData] = await Promise.all([
          testService.getAllTests(),
          user?.id ? userProgressService.getTestProgress(user.id).catch(() => []) : Promise.resolve([])
        ]);
        
        // Sort theo level (dễ -> khó) và process tên
        const processed = testsData
          .map(test => ({ ...test }))
          .sort((a, b) => a.level - b.level);
        setAllTests(processed);
        setCompletedTests(progressData);
      } catch (err: any) {
        setError('Không thể tải danh sách bài kiểm tra');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const completedCount = completedTests.length;
  const totalTests = allTests.length;
  const progressPercentage = totalTests > 0 ? (completedCount / totalTests) * 100 : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ScenicBackground variant="sunset" />
      {/* Header */}
      <SiteHeader active="tests" className="relative z-10" />

      {/* Multiple Character Illustrations - Floating */}
      <div className="absolute top-32 right-8 z-10 hidden lg:block space-y-4">
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
          <div className="w-32 h-32 bg-gradient-to-br from-purple-100 via-pink-100 to-rose-100 rounded-full flex items-center justify-center text-6xl shadow-2xl border-4 border-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
            <span className="relative z-10">📚</span>
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md whitespace-nowrap">
            Hãy thử sức!
          </div>
        </motion.div>
        
        {completedCount > 0 && (
          <motion.div 
            className="relative"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 rounded-full flex items-center justify-center text-5xl shadow-xl border-4 border-white">
              🏆
            </div>
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-gray-700 shadow-md whitespace-nowrap">
              {completedCount} bài
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-200/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header with Gradient - Enhanced */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
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
            <motion.div 
              className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/20 rounded-full"
              animate={{ 
                x: [0, 20, 0],
                y: [0, -20, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="relative z-10 text-center">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Bài kiểm tra
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Đánh giá kiến thức và kỹ năng tiếng Anh của bạn qua các bài kiểm tra đa dạng
              </motion.p>
              
              {/* Progress Bar with Shimmer Effect - Enhanced */}
              {totalTests > 0 && (
                <motion.div 
                  className="mt-8 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="bg-white/40 backdrop-blur-sm border-2 border-white/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    {/* Background gradient animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-200/30 via-pink-200/30 to-rose-200/30 animate-[gradientShift_3s_ease_infinite]"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📊</span>
                          </div>
                          <div>
                            <span className="text-gray-800 font-semibold text-lg block">
                              Đã làm
                            </span>
                            <span className="text-gray-700 text-sm">
                              Tiến độ hoàn thành
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-800 font-bold text-3xl block">
                            {completedCount}
                          </span>
                          <span className="text-gray-700 text-sm">
                            / {totalTests} bài
                          </span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-white/50 rounded-full h-6 overflow-hidden shadow-inner">
                        <motion.div 
                          className="bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200 h-6 rounded-full shadow-lg relative overflow-hidden"
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"></div>
                          {/* Progress text overlay */}
                          {progressPercentage > 15 && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800">
                              {Math.round(progressPercentage)}%
                            </span>
                          )}
                        </motion.div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-300 shadow-lg"></div>
                          <span className="text-gray-700 text-sm">Hoàn thành</span>
                        </div>
                        <span className="text-gray-700 text-sm font-medium">
                          {Math.round(progressPercentage)}% hoàn thành
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-6 py-4 rounded-xl mb-8 shadow-lg animate-fade-in">
            {error}
          </div>
        )}

        {/* Test Cards with Gradient Headers - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayedTests.map((test, index) => {
            const isCompleted = completedTestIds.has(test.id);
            const testProgress = completedTests.find(t => t.testId === test.id);
            
            return (
              <motion.div 
                key={test.id} 
                className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 hover:border-purple-300 transition-all duration-500 overflow-hidden group relative"
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                {/* Completed Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 z-20 bg-gradient-to-r from-green-200 to-emerald-200 text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-green-300">
                    <span>✓</span>
                    <span>Hoàn thành</span>
                  </div>
                )}
                
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-r from-purple-200 via-pink-200 to-rose-200 px-6 py-5 relative overflow-hidden">
                  {/* Animated decorative circles */}
                  <motion.div 
                    className="absolute top-0 right-0 w-24 h-24 bg-white/30 rounded-full -mr-12 -mt-12"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.3, 0.2]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div 
                    className="absolute bottom-0 left-0 w-16 h-16 bg-white/30 rounded-full -ml-8 -mb-8"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.25, 0.2]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  />
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Number Badge with animation */}
                      <motion.div 
                        className="w-12 h-12 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-800 font-bold text-lg shadow-lg border-2 border-white/50 relative overflow-hidden"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                        <span className="relative z-10">{index + 1}</span>
                      </motion.div>
                      <div>
                        <span className="bg-white/50 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full border border-white/50 block mb-1">
                          📋 Kiểm tra
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border block ${
                          test.level === 1 
                            ? 'bg-green-200/50 border-green-300 text-gray-800' 
                            : test.level === 2 
                            ? 'bg-yellow-200/50 border-yellow-300 text-gray-800' 
                            : 'bg-rose-200/50 border-rose-300 text-gray-800'
                        }`}>
                          {test.level === 1 ? '⭐ Dễ' : test.level === 2 ? '⭐⭐ Trung bình' : '⭐⭐⭐ Khó'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {(() => { const i=Math.max(test.name.lastIndexOf(':'), test.name.lastIndexOf('-')); return i>=0 ? test.name.slice(i+1).trim() : test.name; })()}
                  </h3>
                  
                  {/* Score display if completed */}
                  {isCompleted && testProgress && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-700">Điểm số:</span>
                        <span className="text-lg font-bold text-green-600">{Math.min(testProgress.score, 100)}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">20 phút</span>
                  </div>
                  
                  <Link
                    to={`/tests/${test.id}`}
                    className="block w-full bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 text-gray-800 font-bold py-4 px-6 rounded-xl text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden group/btn border border-purple-200"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isCompleted ? 'Làm lại' : 'Bắt đầu kiểm tra'}
                      <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Load More Button with Gradient */}
        {hasMore && (
          <div className="text-center mt-12 animate-fade-in">
            <button
              onClick={() => setDisplayedCount(prev => prev + 10)}
              className="bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 text-gray-800 font-bold py-4 px-8 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-purple-300/50 relative overflow-hidden group border border-purple-200"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Xem thêm ({allTests.length - displayedCount} bài nữa)</span>
                <svg className="w-5 h-5 transform group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        )}

        {allTests.length === 0 && !error && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Chưa có bài kiểm tra</h3>
            <p className="text-lg text-gray-600 max-w-md mx-auto">Hiện tại chưa có bài kiểm tra nào được tạo. Vui lòng quay lại sau.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TestsPage;
