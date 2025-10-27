import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { testService } from '../services/api';
import { TestDetail, AnswerSubmission, TestSubmission } from '../types';

const TestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [test, setTest] = useState<TestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchTest = async () => {
      if (id) {
        try {
          const data = await testService.getTestById(parseInt(id));
          setTest(data);
        } catch (err: any) {
          setError('Không thể tải chi tiết bài kiểm tra');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTest();
  }, [id]);

  const handleAnswerSelect = (questionId: number, optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const submitTest = async () => {
    if (!test || !user) return;

    const unansweredQuestions = test.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      alert(`Bạn còn ${unansweredQuestions.length} câu hỏi chưa trả lời. Vui lòng hoàn thành tất cả câu hỏi.`);
      return;
    }

    setSubmitting(true);

    try {
      const submission: TestSubmission = {
        testId: test.id,
        accountId: user.id,
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId: parseInt(questionId),
          selectedOptionId: optionId
        }))
      };

      const result = await testService.submitTest(submission);
      setScore(result.score);
      setShowResult(true);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <span className={`text-3xl font-bold ${
              score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {score}%
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
          
          <div className="space-y-3">
            <Link to="/tests" className="btn-primary w-full">
              Làm bài kiểm tra khác
            </Link>
            <Link to="/lessons" className="btn-secondary w-full">
              Học bài học
            </Link>
            <Link to="/profile" className="text-primary-600 hover:text-primary-700 font-medium">
              Xem tiến độ học tập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = test.questions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                English Learning Suite
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Trang chủ
              </Link>
              <Link to="/lessons" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Bài học
              </Link>
              <Link to="/tests" className="text-primary-600 px-3 py-2 text-sm font-medium">
                Kiểm tra
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Test Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{test.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                  Bài kiểm tra
                </span>
                <span className="bg-secondary-100 text-secondary-800 text-sm font-medium px-3 py-1 rounded-full">
                  Cấp độ {test.level}
                </span>
              </div>
            </div>
            {test.audioUrl && (
              <button
                onClick={() => playAudio(test.audioUrl!)}
                className="btn-primary flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
                <span>Phát âm</span>
              </button>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-800">
                  Tiến độ: {answeredCount}/{totalQuestions} câu hỏi
                </span>
                <div className="w-32 bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm text-blue-600">
                {Math.round((answeredCount / totalQuestions) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {test.questions.map((question, index) => (
            <div key={question.id} className="card">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Câu {index + 1}: {question.questionText}
                </h3>
                {question.imageUrl && (
                  <img 
                    src={question.imageUrl} 
                    alt="Question" 
                    className="max-w-full h-auto rounded-lg mb-4"
                  />
                )}
              </div>
              
              <div className="space-y-3">
                {question.answerOptions.map((option) => (
                  <label 
                    key={option.id} 
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      answers[question.id] === option.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleAnswerSelect(question.id, option.id)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[question.id] === option.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[question.id] === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option.optionText}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="card mt-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {answeredCount === totalQuestions 
                ? 'Bạn đã hoàn thành tất cả câu hỏi!' 
                : `Còn ${totalQuestions - answeredCount} câu hỏi chưa trả lời`
              }
            </div>
            <button
              onClick={submitTest}
              disabled={submitting || answeredCount !== totalQuestions}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Đang nộp bài...' : 'Nộp bài kiểm tra'}
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
