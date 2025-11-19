import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type NavKey = 'home' | 'lessons' | 'tests' | 'profile' | 'library' | 'pronunciation';

interface SiteHeaderProps {
  active?: NavKey;
  className?: string;
}

const navItems: Array<{ key: NavKey; label: string; to: string }> = [
  { key: 'home', label: 'Trang chủ', to: '/' },
  { key: 'lessons', label: 'Bài học', to: '/lessons' },
  { key: 'tests', label: 'Kiểm tra', to: '/tests' },
  { key: 'library', label: 'Thư viện', to: '/library' },
  { key: 'pronunciation', label: 'Phát âm', to: '/pronunciation' },
  { key: 'profile', label: 'Hồ sơ', to: '/profile' }
];

const SiteHeader: React.FC<SiteHeaderProps> = ({ active, className = '' }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className={`relative z-[30] bg-white/75 backdrop-blur-xl border-b border-white/60 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold text-lg">
              EL
            </span>
            <span className="text-2xl font-bold text-slate-800">English Learning Suite</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = active === item.key;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm font-medium text-slate-500">Xin chào, {user?.fullName}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-xl border border-slate-200 hover:border-primary-200 hover:text-primary-600 transition-colors duration-300"
                >
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

          <button
            className="md:hidden p-2 rounded-xl border border-transparent text-slate-700 hover:text-primary-600 hover:border-primary-200 transition-all duration-300"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
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

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {navItems.map((item) => {
              const isActive = active === item.key;
              return (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block text-base font-semibold rounded-xl px-3 py-2 transition-colors duration-300 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="border-t border-slate-200 pt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-semibold text-slate-600 rounded-xl hover:text-primary-600 hover:bg-primary-50 transition-colors duration-300"
                >
                  Đăng xuất
                </button>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-base font-semibold text-slate-600 rounded-xl px-3 py-2 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-300"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center btn-primary"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;

