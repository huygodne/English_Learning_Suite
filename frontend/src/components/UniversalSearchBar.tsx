import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { lessonService, testService, translationService } from '../services/api';
import { LessonSummary, TestSummary } from '../types';

interface UniversalSearchBarProps {
  className?: string;
}

const UniversalSearchBar: React.FC<UniversalSearchBarProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    lessons: LessonSummary[];
    tests: TestSummary[];
  }>({ lessons: [], tests: [] });
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const [translationText, setTranslationText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translationDirection, setTranslationDirection] = useState<'en-vi' | 'vi-en'>('en-vi');
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search lessons and tests
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults({ lessons: [], tests: [] });
        return;
      }

      try {
        const [lessons, tests] = await Promise.all([
          lessonService.getAllLessons(),
          testService.getAllTests()
        ]);

        const query = searchQuery.toLowerCase();
        const filteredLessons = lessons.filter(
          lesson => lesson.name.toLowerCase().includes(query)
        ).slice(0, 5);
        const filteredTests = tests.filter(
          test => test.name.toLowerCase().includes(query)
        ).slice(0, 5);

        setSearchResults({ lessons: filteredLessons, tests: filteredTests });
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If no results found, show translate modal
      if (searchResults.lessons.length === 0 && searchResults.tests.length === 0) {
        setTranslationText(searchQuery);
        setShowTranslateModal(true);
        setIsFocused(false);
      } else if (searchResults.lessons.length > 0) {
        navigate(`/lessons/${searchResults.lessons[0].id}`);
        setSearchQuery('');
        setIsFocused(false);
      } else if (searchResults.tests.length > 0) {
        navigate(`/tests/${searchResults.tests[0].id}`);
        setSearchQuery('');
        setIsFocused(false);
      }
    }
  };

  const handleTranslate = async () => {
    if (!translationText.trim()) return;

    setTranslationLoading(true);
    try {
      const sourceLang = translationDirection === 'en-vi' ? 'en' : 'vi';
      const targetLang = translationDirection === 'en-vi' ? 'vi' : 'en';

      const response = await translationService.translate({
        text: translationText,
        sourceLang,
        targetLang,
      });

      setTranslatedText(response.translatedText);
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedText('Không thể dịch văn bản. Vui lòng thử lại.');
    } finally {
      setTranslationLoading(false);
    }
  };

  const hasResults = searchResults.lessons.length > 0 || searchResults.tests.length > 0;

  return (
    <>
      <div ref={searchRef} className={`relative ${className}`}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Tìm kiếm bài học, kiểm tra hoặc dịch..."
            className="w-full max-w-md px-4 py-2 pl-10 pr-10 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setIsFocused(false);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>

        {/* Search Results Dropdown */}
        {isFocused && searchQuery && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
            {hasResults ? (
              <div className="p-2">
                {searchResults.lessons.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Bài học</div>
                    {searchResults.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          navigate(`/lessons/${lesson.id}`);
                          setSearchQuery('');
                          setIsFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <div className="font-medium text-slate-900">{lesson.name}</div>
                        <div className="text-xs text-slate-500">Cấp độ {lesson.level}</div>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.tests.length > 0 && (
                  <div className="mt-2">
                    <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase">Bài kiểm tra</div>
                    {searchResults.tests.map((test) => (
                      <button
                        key={test.id}
                        onClick={() => {
                          navigate(`/tests/${test.id}`);
                          setSearchQuery('');
                          setIsFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        <div className="font-medium text-slate-900">{test.name}</div>
                        <div className="text-xs text-slate-500">Cấp độ {test.level}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-slate-600 mb-3">Không tìm thấy kết quả</p>
                <button
                  onClick={() => {
                    setTranslationText(searchQuery);
                    setShowTranslateModal(true);
                    setIsFocused(false);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Dịch "{searchQuery}"
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Translation Modal */}
      {showTranslateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Dịch nhanh</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTranslationDirection(prev => prev === 'en-vi' ? 'vi-en' : 'en-vi')}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {translationDirection === 'en-vi' ? 'EN → VI' : 'VI → EN'}
                  </button>
                  <button
                    onClick={() => {
                      setShowTranslateModal(false);
                      setTranslationText('');
                      setTranslatedText('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Văn bản {translationDirection === 'en-vi' ? 'tiếng Anh' : 'tiếng Việt'}
                  </label>
                  <textarea
                    value={translationText}
                    onChange={(e) => setTranslationText(e.target.value)}
                    placeholder={`Nhập văn bản ${translationDirection === 'en-vi' ? 'tiếng Anh' : 'tiếng Việt'}...`}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none"
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleTranslate}
                  disabled={translationLoading || !translationText.trim()}
                  className="w-full px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {translationLoading ? 'Đang dịch...' : 'Dịch'}
                </button>

                {translatedText && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bản dịch {translationDirection === 'en-vi' ? 'tiếng Việt' : 'tiếng Anh'}
                    </label>
                    <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900">
                      {translatedText}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniversalSearchBar;


