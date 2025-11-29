import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { lessonService } from '../../../services/api';
import { LessonSummary, LessonDetail, Vocabulary, Grammar } from '../../../types';

type HamburgerDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

type DailyQuest = {
  id: string;
  label: string;
};

type LibraryItem = {
  id: number;
  type: 'vocabulary' | 'grammar';
  english: string;
  vietnamese: string;
  phonetic?: string;
  lessonName: string;
};

const DAILY_QUESTS: DailyQuest[] = [
  { id: 'lesson', label: 'Hoàn thành 1 bài học' },
  { id: 'test', label: 'Làm 1 bài kiểm tra' },
  { id: 'review', label: 'Ôn lại 5 từ vựng' }
];

const SCRATCHPAD_KEY = 'els_scratchpad';
const QUESTS_LIST_KEY = 'els_quests_list';
const QUESTS_STATE_KEY = 'els_quests_state';
const DARK_MODE_KEY = 'els_dark_mode';

const HamburgerDrawer: React.FC<HamburgerDrawerProps> = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();

  const [scratchpad, setScratchpad] = useState('');
  const [quests, setQuests] = useState<DailyQuest[]>(DAILY_QUESTS);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [quickSearch, setQuickSearch] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [fontScale, setFontScale] = useState<'normal' | 'large'>('normal');
  const [newQuestLabel, setNewQuestLabel] = useState('');
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<LibraryItem[]>([]);

  // Khởi tạo dark mode từ localStorage (áp dụng cho bảng nhanh, và nếu cần cho toàn app)
  useEffect(() => {
    const savedDarkMode = localStorage.getItem(DARK_MODE_KEY);
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(DARK_MODE_KEY, 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(DARK_MODE_KEY, 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!isOpen) return;

    const savedScratchpad = localStorage.getItem(SCRATCHPAD_KEY);
    const savedQuestsList = localStorage.getItem(QUESTS_LIST_KEY);
    const savedQuestsState = localStorage.getItem(QUESTS_STATE_KEY);

    if (savedScratchpad) {
      setScratchpad(savedScratchpad);
    }

    if (savedQuestsList) {
      try {
        const parsedList = JSON.parse(savedQuestsList);
        if (Array.isArray(parsedList)) {
          setQuests(parsedList);
        }
      } catch {
        setQuests(DAILY_QUESTS);
      }
    } else {
      setQuests(DAILY_QUESTS);
    }

    if (savedQuestsState) {
      try {
        const parsedState = JSON.parse(savedQuestsState);
        if (Array.isArray(parsedState)) {
          setCompletedQuests(parsedState);
        }
      } catch {
        // ignore parse error
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem(SCRATCHPAD_KEY, scratchpad);
  }, [scratchpad, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem(QUESTS_LIST_KEY, JSON.stringify(quests));
  }, [quests, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    localStorage.setItem(QUESTS_STATE_KEY, JSON.stringify(completedQuests));
  }, [completedQuests, isOpen]);

  if (!isOpen) {
    return null;
  }

  const toggleQuest = (id: string) => {
    setCompletedQuests((prev) =>
      prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]
    );
  };

  const handleAddQuest = () => {
    const label = newQuestLabel.trim();
    if (!label) return;
    const id = `custom_${Date.now()}`;
    setQuests((prev) => [...prev, { id, label }]);
    setNewQuestLabel('');
  };

  const handleRemoveQuest = (id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
    setCompletedQuests((prev) => prev.filter((q) => q !== id));
  };

  const handleQuickSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSearch.trim()) return;

    const query = quickSearch.trim().toLowerCase();

    // Nếu chưa có dữ liệu thư viện, tải nhanh từ backend (tương tự LibraryPage nhưng rút gọn)
    if (libraryItems.length === 0 && !libraryLoading) {
      try {
        setLibraryLoading(true);
        setLibraryError(null);
        const lessons: LessonSummary[] = await lessonService.getAllLessons();
        const lessonDetailsPromises = lessons.map((lesson) =>
          lessonService.getLessonById(lesson.id).catch(() => null)
        );
        const lessonDetails = await Promise.all(lessonDetailsPromises);

        const items: LibraryItem[] = [];
        lessonDetails.forEach((lesson: LessonDetail | null) => {
          if (!lesson) return;

          if (lesson.vocabularies) {
            lesson.vocabularies.forEach((vocab: Vocabulary) => {
              items.push({
                id: vocab.id,
                type: 'vocabulary',
                english: vocab.wordEnglish,
                vietnamese: vocab.vietnameseMeaning,
                phonetic: vocab.phoneticSpelling,
                lessonName: lesson.name
              });
            });
          }

          if (lesson.grammars) {
            lesson.grammars.forEach((grammar: Grammar) => {
              items.push({
                id: grammar.id,
                type: 'grammar',
                english: grammar.explanationEnglish,
                vietnamese: grammar.explanationVietnamese,
                lessonName: lesson.name
              });
            });
          }
        });

        setLibraryItems(items);
      } catch (err) {
        console.error('Không thể tải dữ liệu thư viện nhanh', err);
        setLibraryError('Không thể tải dữ liệu thư viện');
      } finally {
        setLibraryLoading(false);
      }
    }

    const baseItems = libraryItems;
    if (baseItems.length === 0) return;

    const filtered = baseItems.filter((item) => {
      return (
        item.english.toLowerCase().includes(query) ||
        item.vietnamese.toLowerCase().includes(query)
      );
    });

    setSearchResults(filtered.slice(0, 5));
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-80 h-full shadow-2xl z-[75] transform transition-transform duration-300 ease-in-out flex flex-col ${
          darkMode ? 'bg-slate-900 text-slate-50 border-r border-slate-800' : 'bg-white text-gray-900'
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bảng nhanh</h2>
              <p className="text-xs text-gray-500 mt-1">
                Công cụ & tiến độ cá nhân, không rời khỏi trang hiện tại
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6 text-sm">
            {/* Quick tools */}
            <section className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Công cụ nhanh
              </h3>

              <form onSubmit={handleQuickSearchSubmit} className="space-y-2">
                <label className="block text-[11px] font-medium text-gray-600">
                  Tra nhanh trong thư viện
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    placeholder="Nhập từ hoặc cụm từ..."
                    className="flex-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    Dịch
                  </button>
                </div>
                <p className="text-[11px] text-gray-500">
                  Kết quả sẽ hiển thị ngay bên dưới, không rời khỏi trang hiện tại.
                </p>

                <div className="mt-2 space-y-1">
                  {libraryLoading && (
                    <p className="text-[11px] text-gray-500">Đang tải dữ liệu thư viện...</p>
                  )}
                  {libraryError && (
                    <p className="text-[11px] text-red-500">{libraryError}</p>
                  )}
                  {!libraryLoading && searchResults.length > 0 && (
                    <ul className="rounded-lg border border-blue-100 bg-blue-50/40 divide-y divide-blue-100 max-h-40 overflow-y-auto">
                      {searchResults.map((item) => (
                        <li key={`${item.type}-${item.id}`} className="px-2.5 py-1.5 text-[11px]">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 truncate">
                                {item.english}
                              </p>
                              <p className="text-[10px] text-slate-600 truncate">
                                {item.vietnamese}
                              </p>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                              {item.type === 'vocabulary' ? 'Từ vựng' : 'Ngữ pháp'}
                            </span>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                            📖 {item.lessonName}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!libraryLoading && searchResults.length === 0 && quickSearch.trim() && !libraryError && (
                    <p className="text-[11px] text-gray-500">Không tìm thấy mục nào phù hợp.</p>
                  )}
                </div>
              </form>

              <div className="rounded-xl border border-purple-100 bg-purple-50/70 px-3 py-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-purple-800">Sổ tay ghi chú</p>
                  <span className="text-[10px] text-purple-600">Lưu trên máy</span>
                </div>
                <textarea
                  rows={3}
                  value={scratchpad}
                  onChange={(e) => setScratchpad(e.target.value)}
                  placeholder="Ghi lại cấu trúc câu, từ mới, ví dụ..."
                  className="w-full resize-none rounded-lg border border-purple-100 bg-white/80 px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                />
              </div>

              <div className="rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-amber-900">Nhiệm vụ hôm nay</p>
                  <span className="text-[10px] text-amber-700">
                    {completedQuests.length}/{quests.length} hoàn thành
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {quests.map((quest) => (
                    <li key={quest.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleQuest(quest.id)}
                          className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                            completedQuests.includes(quest.id)
                              ? 'border-amber-600 bg-amber-600 text-white'
                              : 'border-amber-400 bg-white text-transparent'
                          }`}
                        >
                          ✓
                        </button>
                        <span
                          className={`text-[11px] ${
                            completedQuests.includes(quest.id)
                              ? 'text-amber-700 line-through opacity-70'
                              : 'text-amber-900'
                          }`}
                        >
                          {quest.label}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuest(quest.id)}
                        className="text-[10px] text-amber-400 hover:text-amber-700 px-1"
                        aria-label="Xóa nhiệm vụ"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={newQuestLabel}
                    onChange={(e) => setNewQuestLabel(e.target.value)}
                    placeholder="Thêm nhiệm vụ mới..."
                    className="flex-1 rounded-lg border border-amber-200 px-2 py-1 text-[11px] outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuest}
                    className="rounded-lg bg-amber-500 px-2 py-1 text-[11px] font-semibold text-white hover:bg-amber-600"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 bg-black bg-opacity-50 z-[74]" onClick={onClose}></div>
    </>
  );
};

export default HamburgerDrawer;

