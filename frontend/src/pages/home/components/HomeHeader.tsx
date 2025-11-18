import React from 'react';
import { Link } from 'react-router-dom';

type HomeHeaderProps = {
  isAuthenticated: boolean;
  userName?: string;
  onLogout: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  onToggleHamburgerMenu: () => void;
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  isAuthenticated,
  userName,
  onLogout,
  mobileMenuOpen,
  onToggleMobileMenu,
  onToggleHamburgerMenu
}) => (
  <header className="relative z-40 bg-white/70 backdrop-blur-xl border-b border-white/60 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div className="flex items-center">
          <button
            onClick={onToggleHamburgerMenu}
            className="mr-4 p-2 rounded-xl border border-transparent hover:border-primary-100 hover:bg-primary-50/60 text-primary-600 transition-all duration-300"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold text-lg">
                EL
              </span>
              <h1 className="text-2xl font-bold text-slate-800">English Learning Suite</h1>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex space-x-2">
          <Link to="/" className="text-primary-600 bg-primary-50 px-3 py-2 text-sm font-semibold rounded-xl">
            Trang chủ
          </Link>
          <Link
            to="/lessons"
            className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-primary-50"
          >
            Bài học
          </Link>
          <Link
            to="/tests"
            className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-primary-50"
          >
            Kiểm tra
          </Link>
          <Link
            to="/profile"
            className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-primary-50"
          >
            Hồ sơ
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-slate-500">Xin chào, {userName}</span>
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
                <button onClick={onLogout} className="nav-link">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary">
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={onToggleMobileMenu}
              className="text-slate-700 hover:text-primary-600 p-2 rounded-xl border border-transparent hover:border-primary-200 transition-all duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    {mobileMenuOpen && (
      <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
        <div className="px-4 py-6 space-y-4">
          <Link to="/" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
            Trang chủ
          </Link>
          <Link to="/lessons" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
            Bài học
          </Link>
          <Link to="/tests" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
            Kiểm tra
          </Link>
          <Link to="/profile" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
            Hồ sơ
          </Link>
          <div className="border-t border-gray-200 pt-4">
            {isAuthenticated ? (
              <>
                <div className="text-sm text-gray-700 mb-4">Xin chào, {userName}</div>
                <Link to="/admin" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                  Admin
                </Link>
                <button
                  onClick={onLogout}
                  className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium w-full text-left"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary w-full text-center mt-4">
                  Đăng ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )}
  </header>
);

export default HomeHeader;

