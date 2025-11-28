import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/api';
import { TestDetail, AnswerSubmission, TestSubmission } from '../types';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';
import Breadcrumb from '../components/Breadcrumb';

const TEST_DURATION_SECONDS = 20 * 60;
const ALLOWED_QUESTION_TYPES = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE'];

const formatDuration = (seconds: number) => {
  if (!seconds || seconds <= 0) return '0 phút';
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) {
    return `${secs} giây`;
  }
  return `${minutes} phút ${secs.toString().padStart(2, '0')} giây`;
};

const TestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [answers, setAnswers] = useState<{ [questionId: number]: number | number[] }>({});
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(TEST_DURATION_SECONDS);
  const [timeWarning, setTimeWarning] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      if (id) {
        try {
          const data = await testService.getTestById(parseInt(id));
          setTest(data);
          setAnswers({});
        } catch (err: any) {
          setError('Không thể tải chi tiết bài kiểm tra');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTest();
  }, [id]);

  useEffect(() => {
    if (test) {
      setTimeRemaining(TEST_DURATION_SECONDS);
      setTimeWarning(false);
      setTimeExpired(false);
      setTimeSpentSeconds(0);
      setHasSubmitted(false);
      startTimeRef.current = Date.now();
    }
  }, [test?.id]);

  // Countdown timer
  useEffect(() => {
    if (showResult) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeExpired(true);
          submitTest({ autoSubmit: true });
          return 0;
        }
        if (prev === 61) {
          setTimeWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult]);

  const filteredQuestions = useMemo(() => {
    if (!test) return [];
    return test.questions.filter((question) => ALLOWED_QUESTION_TYPES.includes(question.questionType));
  }, [test]);

  const removedQuestionCount = useMemo(() => {
    if (!test) return 0;
    return test.questions.length - filteredQuestions.length;
  }, [test, filteredQuestions]);

  const handleAnswerSelect = (questionId: number, optionId: number, questionType: string) => {
    setAnswers(prev => {
      if (questionType === 'MULTIPLE_CHOICE') {
        // Multiple choice - allow multiple selections
        const currentAnswers = (prev[questionId] as number[]) || [];
        const isSelected = currentAnswers.includes(optionId);
        return {
          ...prev,
          [questionId]: isSelected
            ? currentAnswers.filter(id => id !== optionId)
            : [...currentAnswers, optionId]
        };
      } else {
        // Single choice - radio button behavior
        return {
          ...prev,
          [questionId]: optionId
        };
      }
    });
  };

  const questions = filteredQuestions;
  const totalQuestions = questions.length;

  const submitTest = async ({ autoSubmit = false }: { autoSubmit?: boolean } = {}) => {
    if (!test || !user || hasSubmitted || submitting) return;

    const unansweredQuestions = questions.filter(q => {
      const answer = answers[q.id];
      if (q.questionType === 'MULTIPLE_CHOICE') {
        return !answer || (Array.isArray(answer) && answer.length === 0);
      } else {
        return !answer;
      }
    });
    if (!autoSubmit && unansweredQuestions.length > 0) {
      alert(`Bạn còn ${unansweredQuestions.length} câu hỏi chưa trả lời. Vui lòng hoàn thành tất cả câu hỏi.`);
      return;
    }

    setSubmitting(true);

    try {
      const submission: TestSubmission = {
        testId: test.id,
        accountId: user.id,
        answers: Object.entries(answers).flatMap(([questionId, optionIds]) => {
          const ids = Array.isArray(optionIds) ? optionIds : [optionIds];
          return ids.map(optionId => ({
            questionId: parseInt(questionId),
            selectedOptionId: optionId
          }));
        }),
        timeSpentSeconds: (() => {
          const elapsed = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : TEST_DURATION_SECONDS - timeRemaining;
          return Math.max(1, elapsed);
        })()
      };

      const result = await testService.submitTest(submission);
      // Score is now returned as percentage (0-100)
      setScore(result.score);
      setShowResult(true);
      setTimeSpentSeconds(submission.timeSpentSeconds ?? 0);
      setHasSubmitted(true);
    } catch (err: any) {
      setError('Không thể nộp bài kiểm tra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

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

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài kiểm tra</h1>
          <Link to="/tests" className="btn-primary">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  if (showResult && score !== null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 animate-fade-in">
        <ScenicBackground variant="meadow" />
        <div className="card bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/30 border-2 border-primary-200 max-w-md w-full animate-scale-in shadow-soft-xl">
          <div className="text-center mb-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
              score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <span className={`text-3xl font-bold ${
                score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Math.min(score, 100)}
              </span>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {score >= 80 ? 'Xuất sắc!' : score >= 60 ? 'Khá tốt!' : 'Cần cải thiện'}
            </h1>
            
            <p className="text-gray-600 mb-6">
              {score >= 80 
                ? 'Bạn đã hoàn thành bài kiểm tra một cách xuất sắc!'
                : score >= 60 
                ? 'Kết quả khá tốt, hãy tiếp tục cố gắng!'
                : 'Hãy ôn tập lại và thử lại bài kiểm tra.'
              }
            </p>
          </div>
          
          <div className="space-y-4">
            <Link to="/tests" className="btn-primary w-full block text-center">
              Làm bài kiểm tra khác
            </Link>
            <Link to="/lessons" className="btn-secondary w-full block text-center">
              Học bài học
            </Link>
            <div className="text-center">
              <Link to="/profile" className="text-primary-600 hover:text-primary-700 font-medium inline-block">
                Xem tiến độ học tập
              </Link>
            </div>
            <p className="text-sm text-slate-500 text-center">
              Thời gian làm bài: {formatDuration(timeSpentSeconds)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter(q => {
    const answer = answers[q.id];
    if (q.questionType === 'MULTIPLE_CHOICE') {
      return answer && Array.isArray(answer) && answer.length > 0;
    } else {
      return !!answer;
    }
  }).length;
  const completionRatio = totalQuestions ? answeredCount / totalQuestions : 0;
  const completionPercent = Math.round(completionRatio * 100);

  return (
    <div className="relative min-h-screen animate-fade-in overflow-hidden">
      <ScenicBackground variant="lake" />
      {/* Header */}
      <SiteHeader active="tests" />

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center justify-between">
          <Breadcrumb
            items={[
              { label: 'Trang chủ', path: '/' },
              { label: 'Bài kiểm tra', path: '/tests' },
              { label: test ? test.name : 'Chi tiết bài kiểm tra' },
            ]}
          />
          {!showResult && (
            <Link
              to="/tests"
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-primary-200 hover:text-primary-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại danh sách
            </Link>
          )}
        </div>
      </div>

      {/* Character Illustration - Floating */}
      <div className="absolute top-32 right-8 z-10 hidden lg:block">
        <div className="relative animate-soft-float">
          <div className="w-32 h-32 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full flex items-center justify-center text-6xl shadow-lg border-4 border-white">
            📝
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-md whitespace-nowrap">
            Bạn có thể làm được!
          </div>
        </div>
      </div>

      {timeWarning && !timeExpired && !showResult && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-2xl text-sm font-semibold">
            ⏰ Còn dưới 1 phút, hãy kiểm tra và nộp bài ngay nhé!
          </div>
        </div>
      )}

      {timeExpired && !showResult && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-semibold">
            🕒 Hết giờ! Bài làm của bạn đã được tự động nộp.
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Test Header - Redesigned with different layout */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden animate-slide-in-up">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-extrabold mb-3 drop-shadow-lg">
                    {(() => { const i=Math.max(test.name.lastIndexOf(':'), test.name.lastIndexOf('-')); return i>=0 ? test.name.slice(i+1).trim() : test.name; })()}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full border border-white/30">
                      📋 Bài kiểm tra
                    </span>
                    <span className={`text-sm font-semibold px-4 py-1.5 rounded-full border ${
                      test.level === 1 
                        ? 'bg-green-500/30 border-green-300 text-white' 
                        : test.level === 2 
                        ? 'bg-yellow-500/30 border-yellow-300 text-white' 
                        : 'bg-red-500/30 border-red-300 text-white'
                    }`}>
                      {test.level === 1 ? '⭐ Dễ' : test.level === 2 ? '⭐⭐ Trung bình' : '⭐⭐⭐ Khó'}
                    </span>
                    <span className={`text-sm font-semibold px-4 py-1.5 rounded-full border flex items-center gap-2 ${
                      timeRemaining < 300 
                        ? 'bg-red-500/40 border-red-300 text-white' 
                        : 'bg-white/20 border-white/30 text-white'
                    }`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
                {test.audioUrl && (
                  <button
                    onClick={() => playAudio(test.audioUrl!)}
                    className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl border border-white/30 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                    </svg>
                    <span>Phát âm</span>
                  </button>
                )}
              </div>
              
              {/* Progress Bar - Redesigned */}
              <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold text-lg">
                    Tiến độ làm bài
                  </span>
                  <span className="text-white font-bold text-xl">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 h-4 rounded-full transition-all duration-500 shadow-lg relative overflow-hidden"
                    style={{ width: `${completionRatio * 100}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-white font-bold text-xl">
                    {completionPercent}% hoàn thành
                  </span>
                </div>
              </div>
            </div>
            {removedQuestionCount > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/15 px-4 py-2 rounded-2xl text-sm font-semibold text-white/90 border border-white/30">
                <span>ℹ️</span>
                <span>Đã loại bỏ {removedQuestionCount} câu hỏi sắp xếp chưa hỗ trợ.</span>
              </div>
            )}
          </div>
        </div>

        {/* Questions - Redesigned with staggered animation */}
          <div className="space-y-8">
          {questions.map((question, index) => (
            <div 
              key={question.id} 
              className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 hover:border-purple-300 transition-all duration-500 overflow-hidden animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.15}s`,
                opacity: 0,
                animationFillMode: 'forwards'
              }}
            >
              {/* Question Header */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {question.questionText}
                      </h3>
                      {question.questionType === 'MULTIPLE_CHOICE' && (
                        <span className="text-xs text-purple-600 font-semibold mt-1 inline-block bg-purple-100 px-2 py-0.5 rounded-full">
                          (Có thể chọn nhiều đáp án)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {question.imageUrl && (
                  <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={question.imageUrl} 
                      alt="Question" 
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                {question.answerOptions.map((option) => {
                  const isMultipleChoice = question.questionType === 'MULTIPLE_CHOICE';
                  const currentAnswers = answers[question.id];
                  const isSelected = isMultipleChoice
                    ? Array.isArray(currentAnswers) && currentAnswers.includes(option.id)
                    : currentAnswers === option.id;
                  
                  return (
                    <label 
                      key={option.id} 
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type={isMultipleChoice ? "checkbox" : "radio"}
                        name={`question-${question.id}`}
                        value={option.id}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.id, option.id, question.questionType)}
                        className="sr-only"
                      />
                      <div className={`mr-3 flex items-center justify-center ${
                        isMultipleChoice 
                          ? 'w-5 h-5 rounded border-2'
                          : 'w-4 h-4 rounded-full border-2'
                      } ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          isMultipleChoice ? (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )
                        )}
                      </div>
                      <span className="text-gray-900 flex-1">{option.optionText}</span>
                    </label>
                  );
                })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button - Redesigned */}
        <div className="mt-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 shadow-2xl animate-scale-in">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white">
              <div className="text-lg font-bold mb-1">
                {answeredCount === totalQuestions 
                  ? '🎉 Bạn đã hoàn thành tất cả câu hỏi!' 
                  : `⏳ Còn ${totalQuestions - answeredCount} câu hỏi chưa trả lời`
                }
              </div>
              <div className="text-sm text-white/80">
                {answeredCount === totalQuestions 
                  ? 'Sẵn sàng nộp bài và xem kết quả!' 
                  : 'Hãy hoàn thành tất cả câu hỏi trước khi nộp bài'
                }
              </div>
            </div>
            <button
              onClick={() => submitTest()}
              disabled={submitting || answeredCount !== totalQuestions}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                submitting || answeredCount !== totalQuestions
                  ? 'bg-white/20 text-white/50 cursor-not-allowed'
                  : 'bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 hover:shadow-xl'
              }`}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang nộp bài...
                </span>
              ) : (
                '📤 Nộp bài kiểm tra'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mt-4">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default TestDetailPage;
