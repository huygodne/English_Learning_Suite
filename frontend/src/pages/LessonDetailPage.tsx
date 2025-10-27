import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lessonService } from '../services/api';
import { LessonDetail } from '../types';
import QuickTranslate from '../components/QuickTranslate';

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar' | 'conversation'>('vocabulary');

  useEffect(() => {
    const fetchLesson = async () => {
      if (id) {
        try {
          const data = await lessonService.getLessonById(parseInt(id));
          setLesson(data);
        } catch (err: any) {
          setError('Không thể tải chi tiết bài học');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLesson();
  }, [id]);

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

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy bài học</h1>
          <Link to="/lessons" className="btn-primary">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

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
              <Link to="/lessons" className="text-primary-600 px-3 py-2 text-sm font-medium">
                Bài học
              </Link>
              <Link to="/tests" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Kiểm tra
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Lesson Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{lesson.name}</h1>
              <div className="flex items-center space-x-4">
                <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                  Bài {lesson.lessonNumber}
                </span>
                <span className="bg-secondary-100 text-secondary-800 text-sm font-medium px-3 py-1 rounded-full">
                  Cấp độ {lesson.level}
                </span>
              </div>
            </div>
            {lesson.audioUrl && (
              <button
                onClick={() => playAudio(lesson.audioUrl!)}
                className="btn-primary flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
                <span>Phát âm</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="card mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('vocabulary')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'vocabulary'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Từ vựng ({lesson.vocabularies.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('grammar')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'grammar'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Ngữ pháp ({lesson.grammars.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('conversation')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'conversation'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Hội thoại ({lesson.conversations.length})
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card">
              {activeTab === 'vocabulary' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Từ vựng</h3>
                  {lesson.vocabularies.length > 0 ? (
                    lesson.vocabularies.map((vocab) => (
                      <div key={vocab.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900">{vocab.wordEnglish}</h4>
                            <p className="text-gray-600 italic">{vocab.phoneticSpelling}</p>
                            <p className="text-gray-800 mt-2">{vocab.vietnameseMeaning}</p>
                          </div>
                          <button
                            onClick={() => {
                              const utterance = new SpeechSynthesisUtterance(vocab.wordEnglish);
                              utterance.lang = 'en-US';
                              speechSynthesis.speak(utterance);
                            }}
                            className="ml-4 p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">Chưa có từ vựng nào trong bài học này.</p>
                  )}
                </div>
              )}

              {activeTab === 'grammar' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ngữ pháp</h3>
                  {lesson.grammars.length > 0 ? (
                    lesson.grammars.map((grammar) => (
                      <div key={grammar.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="space-y-3">
                          <h4 className="text-lg font-semibold text-gray-900">Giải thích tiếng Anh:</h4>
                          <p className="text-gray-800">{grammar.explanationEnglish}</p>
                          <h4 className="text-lg font-semibold text-gray-900">Giải thích tiếng Việt:</h4>
                          <p className="text-gray-800">{grammar.explanationVietnamese}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">Chưa có nội dung ngữ pháp nào trong bài học này.</p>
                  )}
                </div>
              )}

              {activeTab === 'conversation' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Hội thoại</h3>
                  {lesson.conversations.length > 0 ? (
                    lesson.conversations.map((conversation) => (
                      <div key={conversation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{conversation.title}</h4>
                          {conversation.audioUrl && (
                            <button
                              onClick={() => playAudio(conversation.audioUrl!)}
                              className="btn-primary flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                              </svg>
                              <span>Phát âm</span>
                            </button>
                          )}
                        </div>
                        <div className="space-y-3">
                          {conversation.sentences.map((sentence) => (
                            <div key={sentence.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-start space-x-3">
                                <span className="font-semibold text-primary-600 min-w-0 flex-shrink-0">
                                  {sentence.characterName}:
                                </span>
                                <div className="flex-1">
                                  <p className="text-gray-900 mb-1">{sentence.textEnglish}</p>
                                  <p className="text-gray-600 text-sm">{sentence.textVietnamese}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">Chưa có hội thoại nào trong bài học này.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <QuickTranslate />
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetailPage;
