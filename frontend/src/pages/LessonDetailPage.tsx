import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { lessonService, progressService, vocabularyProgressService } from '../services/api';
import { LessonDetail, VocabularyProgress } from '../types';
import QuickTranslate from '../components/QuickTranslate';
import FlipCard from '../components/FlipCard';
import ScenicBackground from '../components/ScenicBackground';
import LessonGamesPanel from '../components/games/LessonGamesPanel';
import SiteHeader from '../components/SiteHeader';

const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'grammar' | 'conversation'>('vocabulary');
  const [studyTime, setStudyTime] = useState(0);
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  const [savingProgress, setSavingProgress] = useState(false);
  const [vocabProgress, setVocabProgress] = useState<Record<number, VocabularyProgress>>({});
  const [rememberingId, setRememberingId] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [completionState, setCompletionState] = useState<'idle' | 'saved' | 'completed'>('idle');
  const [vocabReviewMode, setVocabReviewMode] = useState<'all' | 'unremembered'>('all');
  const navigate = useNavigate();
  const studyTimeRef = useRef(0);
  const hasSavedRef = useRef(false);
  
  const activityParam = searchParams.get('activity');
  const gamesPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to games panel when activity param is present and lesson is loaded
  useEffect(() => {
    if (activityParam && lesson && gamesPanelRef.current) {
      setTimeout(() => {
        gamesPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [activityParam, lesson]);

  useEffect(() => {
    studyTimeRef.current = studyTime;
  }, [studyTime]);

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

  useEffect(() => {
    const fetchVocabProgress = async () => {
      if (!lesson?.id) return;
      try {
        const data = await vocabularyProgressService.getLessonProgress(lesson.id);
        const map: Record<number, VocabularyProgress> = {};
        data.forEach((item) => {
          map[item.vocabularyId] = item;
        });
        setVocabProgress(map);
      } catch (err) {
        console.error('Không thể tải tiến độ từ vựng', err);
      }
    };

    fetchVocabProgress();
  }, [lesson?.id]);

  const vocabList = useMemo(() => {
    if (!lesson) return [];
    if (vocabReviewMode === 'unremembered') {
      return lesson.vocabularies.filter((vocab) => !(vocabProgress[vocab.id]?.remembered));
    }
    return lesson.vocabularies;
  }, [lesson, vocabProgress, vocabReviewMode]);

  const unrememberedCount = useMemo(() => {
    if (!lesson) return 0;
    return lesson.vocabularies.filter((vocab) => !(vocabProgress[vocab.id]?.remembered)).length;
  }, [lesson, vocabProgress]);
  const totalVocab = lesson?.vocabularies.length ?? 0;
  const learnedCount = Math.max(0, totalVocab - unrememberedCount);
  const learnedPercent = totalVocab > 0 ? Math.round((learnedCount / totalVocab) * 100) : 0;
  const studyTimeLabel = `${Math.floor(studyTime / 60)}:${(studyTime % 60).toString().padStart(2, '0')}`;
  const completionLabel =
    completionState === 'completed' ? 'Hoàn thành' : completionState === 'saved' ? 'Đã lưu' : 'Đang học';
  const completionBadgeClass =
    completionState === 'completed'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : completionState === 'saved'
      ? 'bg-amber-50 text-amber-700 border-amber-100'
      : 'bg-slate-50 text-slate-600 border-slate-100';

  useEffect(() => {
    setCurrentVocabIndex(0);
  }, [activeTab]);

  useEffect(() => {
    setCurrentVocabIndex(0);
  }, [lesson?.id]);

  useEffect(() => {
    setCurrentVocabIndex(0);
  }, [vocabReviewMode]);

  useEffect(() => {
    if (currentVocabIndex >= vocabList.length && vocabList.length > 0) {
      setCurrentVocabIndex(vocabList.length - 1);
    }
  }, [vocabList.length, currentVocabIndex]);

  const buildCompletedAtPayload = useCallback(() => {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 19);
  }, []);

  const persistProgress = useCallback(async (completed: boolean, exitAfter: boolean) => {
    if (!lesson) return;
    setSavingProgress(true);
    try {
      await progressService.completeLesson({
        lessonId: lesson.id,
        score: completed ? 100 : 0,
        isCompleted: completed,
        timeSpentSeconds: studyTimeRef.current,
        completedAt: buildCompletedAtPayload(),
      });
      hasSavedRef.current = true;
      setStatusMessage({
        type: 'success',
        text: completed ? 'Bạn đã hoàn thành bài học!' : 'Tiến độ đã được lưu.',
      });
      setCompletionState(completed ? 'completed' : 'saved');
      if (exitAfter) {
        navigate('/lessons');
      }
    } catch (err) {
      console.error('Không thể lưu tiến độ bài học', err);
      setStatusMessage({
        type: 'error',
        text: completed ? 'Không thể hoàn thành bài học. Vui lòng thử lại.' : 'Lưu tiến độ thất bại. Kiểm tra kết nối và thử lại.',
      });
    } finally {
      setSavingProgress(false);
    }
  }, [lesson, navigate, buildCompletedAtPayload]);

  useEffect(() => {
    if (!statusMessage) return;
    const timeout = setTimeout(() => setStatusMessage(null), 4000);
    return () => clearTimeout(timeout);
  }, [statusMessage]);

  useEffect(() => {
    return () => {
      if (lesson && !hasSavedRef.current) {
        progressService.completeLesson({
          lessonId: lesson.id,
          score: 0,
          isCompleted: false,
          timeSpentSeconds: studyTimeRef.current,
          completedAt: new Date().toISOString(),
        }).catch(() => {});
      }
    };
  }, [lesson]);

  const playAudio = (audioUrl: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(console.error);
    }
  };

  const speakWord = (word: string) => {
    if (!word) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const handleVocabularyAudio = (word: string, audioUrl?: string) => {
    if (audioUrl) {
      playAudio(audioUrl);
      return;
    }
    speakWord(word);
  };

  const handleReviewRestart = (mode: 'all' | 'unremembered') => {
    if (mode === 'unremembered' && unrememberedCount === 0) {
      setStatusMessage({
        type: 'error',
        text: 'Bạn đã ghi nhớ tất cả từ vựng! Không còn từ chưa nhớ.',
      });
      return;
    }
    setVocabReviewMode(mode);
    setCurrentVocabIndex(0);
    setStatusMessage({
      type: 'success',
      text: mode === 'all' ? 'Đã bắt đầu ôn lại toàn bộ từ vựng.' : 'Đang ôn lại những từ chưa nhớ.',
    });
  };

  const handleToggleRemembered = async (vocabularyId: number, remembered: boolean) => {
    try {
      setRememberingId(vocabularyId);
      const updated = await vocabularyProgressService.markRemembered(vocabularyId, remembered);
      setVocabProgress((prev) => ({ ...prev, [vocabularyId]: updated }));
    } catch (err) {
      console.error('Không thể cập nhật ghi nhớ từ vựng', err);
    } finally {
      setRememberingId(null);
    }
  };

  const handleSaveProgress = () => persistProgress(false, false);
  const handleCompleteAndExit = () => persistProgress(true, true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center">
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
    <div className="relative min-h-screen">
      <ScenicBackground variant="lake" />
      {statusMessage && (
        <div
          className={`fixed top-24 right-6 z-[90] px-4 py-3 rounded-2xl shadow-lg border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {statusMessage.text}
        </div>
      )}
      {/* Header - Use SiteHeader component for consistency */}
      <SiteHeader active="lessons" />
      {/* Action buttons bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex items-center gap-3 justify-end py-4">
          <button
            onClick={handleSaveProgress}
            disabled={savingProgress}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-primary-200 hover:text-primary-600 transition-colors disabled:opacity-50"
          >
            Lưu tiến độ
          </button>
          <button
            onClick={handleCompleteAndExit}
            disabled={savingProgress || completionState === 'completed'}
            className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {completionState === 'completed' ? 'Đã hoàn thành' : 'Hoàn thành & Thoát'}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="md:hidden flex flex-col sm:flex-row gap-3 mb-6">
          <button
            onClick={handleSaveProgress}
            disabled={savingProgress}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-primary-200 hover:text-primary-600 transition-colors disabled:opacity-50"
          >
            Lưu tiến độ
          </button>
          <button
            onClick={handleCompleteAndExit}
            disabled={savingProgress || completionState === 'completed'}
            className="w-full px-4 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {completionState === 'completed' ? 'Đã hoàn thành' : 'Hoàn thành & Thoát'}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8">
          <div className="space-y-8">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{(() => { const i=Math.max(lesson.name.lastIndexOf(':'), lesson.name.lastIndexOf('-')); return i>=0 ? lesson.name.slice(i+1).trim() : lesson.name; })()}</h1>
                  <div className="flex items-center flex-wrap gap-3">
                    <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                      Bài {lesson.lessonNumber}
                    </span>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      lesson.level === 1 
                        ? 'bg-green-100 text-green-800' 
                        : lesson.level === 2 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {lesson.level === 1 ? 'Easy' : lesson.level === 2 ? 'Medium' : 'Hard'}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {studyTimeLabel}
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

            <div className="card">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
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

            <div className="card">
              {activeTab === 'vocabulary' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Từ vựng</h3>
                  {vocabList.length > 0 ? (
                    <>
                      {(() => {
                        const vocab = vocabList[currentVocabIndex] ?? null;
                        if (!vocab) return null;
                        const total = vocabList.length;
                        const hasPrev = currentVocabIndex > 0;
                        const hasNext = currentVocabIndex < total - 1;
                        const vocabState = vocabProgress[vocab.id];
                        const isRemembered = vocabState?.remembered ?? false;
                        const masteryLevel = vocabState?.masteryLevel ?? 0;
                        const reviewCount = vocabState?.reviewCount ?? 0;
                        const audioButtonLabel = vocab.audioUrl ? 'Nghe bản thu' : 'Nghe phát âm';

                        return (
                          <div className="flex flex-col items-center gap-6">
                            <FlipCard
                              key={vocab.id}
                              className="mx-auto"
                              frontContent={
                                <div className="h-full flex flex-col gap-3">
                                  {vocab.imageUrl && (
                                    <div className="h-32 w-full rounded-xl overflow-hidden">
                                      <img
                                        src={vocab.imageUrl}
                                        alt={vocab.wordEnglish}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70 mb-2">
                                      Từ vựng
                                    </p>
                                    <h4 className="text-2xl font-bold leading-tight">{vocab.wordEnglish}</h4>
                                    <p className="text-white/80 italic mt-1">{vocab.phoneticSpelling}</p>
                                    <p className="text-xs text-white/70 mt-2">
                                      Mức độ nhớ: <span className="font-semibold">{masteryLevel}/5</span>
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <button
                                      type="button"
                                      className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl transition-colors duration-300"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleVocabularyAudio(vocab.wordEnglish, vocab.audioUrl);
                                      }}
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                      </svg>
                                      {audioButtonLabel}
                                    </button>
                                    <span className="text-xs uppercase tracking-[0.35em] text-white/60">
                                      Click để lật
                                    </span>
                                  </div>
                                </div>
                              }
                              backContent={
                                <div className="h-full flex flex-col justify-between">
                                  <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70 mb-2">
                                      Nghĩa tiếng Việt
                                    </p>
                                    <p className="text-lg font-semibold leading-relaxed">
                                      {vocab.vietnameseMeaning}
                                    </p>
                                    {vocab.exampleSentenceEnglish && (
                                      <div className="mt-4">
                                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70 mb-2">
                                          Ví dụ
                                        </p>
                                        <p className="text-sm leading-relaxed">{vocab.exampleSentenceEnglish}</p>
                                        {vocab.exampleSentenceVietnamese && (
                                          <p className="text-xs text-white/80 mt-1">{vocab.exampleSentenceVietnamese}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-xs text-white/60">
                                    Nhấn lần nữa để quay lại mặt trước.
                                  </p>
                                </div>
                              }
                            />
                            <div className="w-full max-w-sm">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleToggleRemembered(vocab.id, !isRemembered);
                                }}
                                disabled={rememberingId === vocab.id}
                                className={`w-full px-4 py-2 rounded-xl font-semibold transition-colors duration-300 ${
                                  isRemembered
                                    ? 'bg-emerald-200 text-emerald-800 border border-emerald-300'
                                    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                                } ${rememberingId === vocab.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                              >
                                {isRemembered ? 'Đã nhớ' : 'Đánh dấu đã nhớ'}
                              </button>
                              {reviewCount > 0 && (
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                  Đã ôn {reviewCount} lần
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <button
                                type="button"
                                onClick={() => setCurrentVocabIndex((prev) => Math.max(prev - 1, 0))}
                                disabled={!hasPrev}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                                  hasPrev
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                Trước
                              </button>
                              <span className="text-sm text-gray-500">
                                {currentVocabIndex + 1}/{total}
                              </span>
                              <button
                                type="button"
                                onClick={() => setCurrentVocabIndex((prev) => Math.min(prev + 1, total - 1))}
                                disabled={!hasNext}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-300 ${
                                  hasNext
                                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                                    : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                Tiếp theo
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <p className="text-gray-600 text-center py-8">
                      {vocabReviewMode === 'unremembered'
                        ? 'Tuyệt vời! Bạn đã đánh dấu nhớ tất cả từ vựng.'
                        : 'Chưa có từ vựng nào trong bài học này.'}
                    </p>
                  )}
                  {vocabList.length > 0 && currentVocabIndex === vocabList.length - 1 && (
                    <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                      <p className="text-sm text-slate-600">
                        Bạn đã hoàn thành lượt học với {vocabReviewMode === 'unremembered' ? 'những từ chưa nhớ' : 'toàn bộ từ vựng'}.
                        Chọn một lựa chọn bên dưới để ôn lại:
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleReviewRestart('all')}
                          className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors"
                        >
                          Ôn lại tất cả
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReviewRestart('unremembered')}
                          disabled={unrememberedCount === 0}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                            unrememberedCount === 0
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          Ôn lại từ chưa nhớ ({unrememberedCount})
                        </button>
                      </div>
                    </div>
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
            {lesson && lesson.vocabularies && lesson.vocabularies.length > 0 && (
              <div ref={gamesPanelRef}>
                <LessonGamesPanel 
                  vocabularies={lesson.vocabularies} 
                  initialGame={activityParam && ['flashcard', 'blast'].includes(activityParam) ? activityParam as 'flashcard' | 'blast' : undefined}
                />
              </div>
            )}
          </div>

          <div className="space-y-6 xl:sticky xl:top-32">
            <QuickTranslate className="w-full" />
            <div className="card space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Tiến độ bài học</h3>
                <span className="text-sm font-bold text-primary-600">{learnedPercent}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  style={{ width: `${learnedPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 rounded-2xl bg-primary-50 border border-primary-100">
                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Thời gian</p>
                  <p className="text-lg font-bold text-primary-900 mt-1">{studyTimeLabel}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Đã nhớ</p>
                  <p className="text-lg font-bold text-emerald-900 mt-1">{learnedCount}/{totalVocab}</p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Chưa nhớ</p>
                  <p className="text-lg font-bold text-amber-900 mt-1">{unrememberedCount}</p>
                </div>
                <div className={`p-3 rounded-2xl border ${completionBadgeClass}`}>
                  <p className="text-xs font-semibold uppercase tracking-wide">Trạng thái</p>
                  <p className="text-lg font-bold mt-1">{completionLabel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LessonDetailPage;
