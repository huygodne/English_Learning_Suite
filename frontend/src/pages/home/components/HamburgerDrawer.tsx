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
      <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-[75] transform transition-transform duration-300 ease-in-out flex flex-col">
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
            <nav className="space-y-3">
              <Link
                to="/"
                onClick={onClose}
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <span className="font-semibold text-gray-900">Trang chủ</span>
                </div>
              </Link>
              <Link
                to="/lessons"
                onClick={onClose}
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📚</span>
                  <span className="font-semibold text-gray-900">Bài học</span>
                </div>
              </Link>
              <Link
                to="/tests"
                onClick={onClose}
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📝</span>
                  <span className="font-semibold text-gray-900">Bài kiểm tra</span>
                </div>
              </Link>
              <Link
                to="/library"
                onClick={onClose}
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <span className="font-semibold text-gray-900">Thư viện</span>
                </div>
              </Link>
              <Link
                to="/profile"
                onClick={onClose}
                className="block p-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <span className="font-semibold text-gray-900">Hồ sơ</span>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 bg-black bg-opacity-50 z-[74]" onClick={onClose}></div>
    </>
  );
};

export default HamburgerDrawer;

