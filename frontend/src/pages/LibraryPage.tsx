import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { lessonService } from '../services/api';
import { LessonSummary, LessonDetail, Vocabulary, Grammar } from '../types';
import ScenicBackground from '../components/ScenicBackground';
import SiteHeader from '../components/SiteHeader';
import Breadcrumb from '../components/Breadcrumb';

interface LibraryItem {
  id: number;
  type: 'vocabulary' | 'grammar';
  english: string;
  vietnamese: string;
  phonetic?: string;
  lessonName: string;
  lessonId: number;
}

const LibraryPage: React.FC = () => {
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'vocabulary' | 'grammar'>('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const lessons: LessonSummary[] = await lessonService.getAllLessons();
        
        // Fetch all lesson details
        const lessonDetailsPromises = lessons.map(lesson => 
          lessonService.getLessonById(lesson.id).catch(() => null)
        );
        
        const lessonDetails = await Promise.all(lessonDetailsPromises);
        
        // Aggregate all vocabularies and grammars
        const items: LibraryItem[] = [];
        
        lessonDetails.forEach((lesson: LessonDetail | null) => {
          if (!lesson) return;
          
          // Add vocabularies
          if (lesson.vocabularies) {
            lesson.vocabularies.forEach((vocab: Vocabulary) => {
              items.push({
                id: vocab.id,
                type: 'vocabulary',
                english: vocab.wordEnglish,
                vietnamese: vocab.vietnameseMeaning,
                phonetic: vocab.phoneticSpelling,
                lessonName: lesson.name,
                lessonId: lesson.id
              });
            });
          }
          
          // Add grammars
          if (lesson.grammars) {
            lesson.grammars.forEach((grammar: Grammar) => {
              items.push({
                id: grammar.id,
                type: 'grammar',
                english: grammar.explanationEnglish,
                vietnamese: grammar.explanationVietnamese,
                lessonName: lesson.name,
                lessonId: lesson.id
              });
            });
          }
        });
        
        // Sort alphabetically by English text
        items.sort((a, b) => a.english.localeCompare(b.english));
        
        setLibraryItems(items);
      } catch (err: any) {
        setError('Không thể tải dữ liệu thư viện');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const speakWord = (word: string) => {
    if (!word) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = 
      item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vietnamese.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  // Group items by first letter for dictionary-style display
  const groupedItems = filteredItems.reduce((acc, item) => {
    const firstLetter = item.english.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(item);
    return acc;
  }, {} as Record<string, LibraryItem[]>);

  const sortedLetters = Object.keys(groupedItems).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ScenicBackground />
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-slate-700">Đang tải thư viện...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <ScenicBackground />
        <SiteHeader />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ScenicBackground />
      <SiteHeader active="library" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb />
        </div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            📚 Thư Viện Từ Điển
          </h1>
          <p className="text-lg text-slate-600">
            Tổng hợp tất cả từ vựng và ngữ pháp từ các bài học
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Tổng cộng: {libraryItems.length} mục ({libraryItems.filter(i => i.type === 'vocabulary').length} từ vựng, {libraryItems.filter(i => i.type === 'grammar').length} ngữ pháp)
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tìm kiếm
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm từ vựng hoặc ngữ pháp..."
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter */}
            <div className="md:w-64">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Loại
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'vocabulary' | 'grammar')}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">Tất cả</option>
                <option value="vocabulary">Từ vựng</option>
                <option value="grammar">Ngữ pháp</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Dictionary Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-white/20">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600">Không tìm thấy kết quả nào</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedLetters.map((letter) => (
                <motion.div
                  key={letter}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-slate-200 pb-6 last:border-b-0"
                >
                  <h2 className="text-3xl font-bold text-blue-600 mb-4 sticky top-0 bg-white/80 backdrop-blur-sm py-2 z-10">
                    {letter}
                  </h2>
                  <div className="grid gap-4">
                    {groupedItems[letter].map((item) => (
                      <motion.div
                        key={`${item.type}-${item.id}`}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-r from-slate-50 to-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-slate-900">
                                {item.type === 'vocabulary' ? item.english : item.english.substring(0, 100) + (item.english.length > 100 ? '...' : '')}
                              </h3>
                              {item.type === 'vocabulary' && item.phonetic && (
                                <span className="text-sm text-slate-500 italic">
                                  /{item.phonetic}/
                                </span>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                item.type === 'vocabulary' 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {item.type === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp'}
                              </span>
                            </div>
                            <p className="text-slate-600 mb-2">
                              {item.vietnamese}
                            </p>
                            <p className="text-xs text-slate-400">
                              📖 Bài học: {item.lessonName}
                            </p>
                          </div>
                          {item.type === 'vocabulary' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                speakWord(item.english);
                              }}
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                              title="Phát âm"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    {selectedItem.english}
                  </h2>
                  {selectedItem.phonetic && (
                    <p className="text-lg text-slate-500 italic mb-2">
                      /{selectedItem.phonetic}/
                    </p>
                  )}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedItem.type === 'vocabulary' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {selectedItem.type === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 mb-2">Nghĩa tiếng Việt:</h3>
                  <p className="text-lg text-slate-700 leading-relaxed">
                    {selectedItem.vietnamese}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    📖 Bài học: <span className="font-semibold text-slate-700">{selectedItem.lessonName}</span>
                  </p>
                </div>
                
                {selectedItem.type === 'vocabulary' && (
                  <button
                    onClick={() => speakWord(selectedItem.english)}
                    className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Phát âm
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LibraryPage;

