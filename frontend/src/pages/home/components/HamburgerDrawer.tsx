import React from 'react';
import { Link } from 'react-router-dom';

type HamburgerDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const HamburgerDrawer: React.FC<HamburgerDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="flex-shrink-0 p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🛠️</span>
                Công cụ học tập
              </h3>
              <div className="space-y-3">
                <Link
                  to="/library"
                  onClick={onClose}
                  className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📚</span>
                    <div>
                      <div className="font-semibold text-gray-900">Thư viện</div>
                      <div className="text-sm text-gray-600">Tài liệu và tài nguyên học tập</div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/translate"
                  onClick={onClose}
                  className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🌐</span>
                    <div>
                      <div className="font-semibold text-gray-900">Dịch thuật</div>
                      <div className="text-sm text-gray-600">Dịch văn bản nhanh chóng</div>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/pronunciation"
                  onClick={onClose}
                  className="block p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-300"
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎤</span>
                    <div>
                      <div className="font-semibold text-gray-900">Phát âm</div>
                      <div className="text-sm text-gray-600">Luyện phát âm chuẩn</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Bài học nhanh
              </h3>
              <div className="space-y-3">
                {[
                  { emoji: '📖', title: 'Từ vựng cơ bản', desc: '50 từ thông dụng', color: 'bg-primary-50 hover:bg-primary-100' },
                  { emoji: '🔤', title: 'Ngữ pháp', desc: 'Thì hiện tại đơn', color: 'bg-secondary-50 hover:bg-secondary-100' },
                  { emoji: '💬', title: 'Hội thoại', desc: 'Chào hỏi cơ bản', color: 'bg-green-50 hover:bg-green-100' }
                ].map((lesson) => (
                  <Link
                    key={lesson.title}
                    to="/lessons"
                    onClick={onClose}
                    className={`block p-3 rounded-lg transition-colors duration-300 ${lesson.color}`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{lesson.emoji}</span>
                      <div>
                        <div className="font-semibold text-gray-900">{lesson.title}</div>
                        <div className="text-sm text-gray-600">{lesson.desc}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Tiến độ học tập
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Từ vựng', value: '75%', color: 'bg-primary-600', width: 'w-3/4' },
                  { label: 'Ngữ pháp', value: '60%', color: 'bg-secondary-600', width: 'w-3/5' },
                  { label: 'Hội thoại', value: '45%', color: 'bg-green-600', width: 'w-2/5' }
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">{item.label}</span>
                      <span className="text-sm text-gray-600">{item.value}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div className={`${item.color} rounded-full h-2 ${item.width}`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🎯</span>
                Mục tiêu hôm nay
              </h3>
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
                <p className="text-gray-700 mb-3">Học 10 từ mới và làm 1 bài kiểm tra</p>
                <div className="bg-white rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full h-2 w-3/4"></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                Thành tích
              </h3>
              <div className="space-y-2">
                {[
                  { badge: '🥇', text: 'Học liên tiếp 7 ngày', color: 'bg-yellow-50' },
                  { badge: '⭐', text: 'Hoàn thành 20 bài học', color: 'bg-blue-50' },
                  { badge: '🎯', text: 'Đạt điểm cao nhất', color: 'bg-green-50' }
                ].map((achievement) => (
                  <div key={achievement.text} className={`flex items-center p-2 rounded-lg ${achievement.color}`}>
                    <span className="text-xl mr-3">{achievement.badge}</span>
                    <span className="text-sm text-gray-700">{achievement.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}></div>
    </>
  );
};

export default HamburgerDrawer;

