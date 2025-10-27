import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-up');
        }
      });
    }, observerOptions);

    const elementsToObserve = [
      heroRef.current,
      featuresRef.current,
      statsRef.current,
      howItWorksRef.current,
      testimonialsRef.current,
      ctaRef.current
    ].filter(Boolean);

    elementsToObserve.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Scroll direction detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setHamburgerMenuOpen(!hamburgerMenuOpen)}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-600">English Learning Suite</h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-2">
              <Link to="/" className="nav-link">
                Trang chủ
              </Link>
              <Link to="/lessons" className="nav-link">
                Bài học
              </Link>
              <Link to="/tests" className="nav-link">
                Kiểm tra
              </Link>
              <Link to="/profile" className="nav-link">
                Hồ sơ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-gray-700">Xin chào, {user?.fullName}</span>
                    <Link to="/admin" className="nav-link">
                    Admin
                  </Link>
                  <button 
                    onClick={logout}
                      className="nav-link"
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

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-primary-600 p-2 rounded-lg transition-colors duration-300"
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

        {/* Mobile menu */}
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
                    <div className="text-sm text-gray-700 mb-4">Xin chào, {user?.fullName}</div>
                    <Link to="/admin" className="block text-gray-700 hover:text-primary-600 py-2 text-base font-medium">
                      Admin
                    </Link>
                    <button 
                      onClick={logout}
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

      {/* Hero Section */}
      <div>
        <div ref={heroRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          {/* Floating Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 floating"></div>
            <div className="absolute top-40 right-20 w-16 h-16 bg-secondary-100 rounded-full opacity-20 floating-reverse"></div>
            <div className="absolute bottom-40 left-20 w-12 h-12 bg-green-100 rounded-full opacity-20 floating"></div>
            <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-200 rounded-full opacity-10 floating-reverse"></div>
          </div>
          
          <div className="text-center relative z-10 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
              Học tiếng Anh
              <span className="text-primary-600 block mt-2 text-glow">hiệu quả</span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
              Khám phá phương pháp học tiếng Anh hiện đại với hệ thống bài học đa dạng, 
              kiểm tra thông minh và theo dõi tiến độ chi tiết.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/register" className="btn-primary text-lg px-10 py-4 btn-glow pulse-animation">
                  Bắt đầu học ngay
                </Link>
                <Link to="/login" className="btn-outline text-lg px-10 py-4 btn-glow">
                  Đăng nhập
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Tại sao chọn chúng tôi?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Hệ thống học tập toàn diện với những tính năng độc đáo
              </p>
            </div>

            <div className={`features-container ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
                <div className="card-feature group text-center card-hover feature-card feature-card-left">
                  <div className="icon-container bg-primary-100 group-hover:bg-primary-200 bounce-gentle">
                    <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">Bài học đa dạng</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Từ vựng, ngữ pháp, hội thoại với nội dung phong phú và cập nhật liên tục
                  </p>
                </div>

                <div className="card-feature group text-center card-hover feature-card feature-card-center">
                  <div className="icon-container bg-secondary-100 group-hover:bg-secondary-200 bounce-gentle" style={{animationDelay: '0.5s'}}>
                    <svg className="w-10 h-10 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-secondary-600 transition-colors duration-300">Kiểm tra thông minh</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Hệ thống kiểm tra trắc nghiệm với đánh giá kết quả và gợi ý cải thiện
                  </p>
                </div>

                <div className="card-feature group text-center card-hover feature-card feature-card-right">
                  <div className="icon-container bg-green-100 group-hover:bg-green-200 bounce-gentle" style={{animationDelay: '1s'}}>
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">Theo dõi tiến độ</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Biểu đồ tiến độ học tập chi tiết giúp bạn theo dõi và cải thiện hiệu quả
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div ref={statsRef} className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Thành tựu của chúng tôi
              </h2>
              <p className="text-lg sm:text-xl text-primary-100 max-w-3xl mx-auto px-4">
                Hàng nghìn học viên đã tin tưởng và thành công cùng chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    10K+
                  </div>
                  <div className="text-primary-100 text-sm sm:text-base font-medium">
                    Học viên
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    500+
                  </div>
                  <div className="text-primary-100 text-sm sm:text-base font-medium">
                    Bài học
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    95%
                  </div>
                  <div className="text-primary-100 text-sm sm:text-base font-medium">
                    Hài lòng
                  </div>
                </div>
              </div>

              <div className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors duration-300">
                    24/7
                  </div>
                  <div className="text-primary-100 text-sm sm:text-base font-medium">
                    Hỗ trợ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div ref={howItWorksRef} className="bg-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Cách thức hoạt động
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Chỉ với 3 bước đơn giản, bạn có thể bắt đầu hành trình học tiếng Anh
              </p>
            </div>

            <div className={`how-it-works-container ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 lg:gap-20 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
                <div className="text-center group px-4 py-8 how-it-works-card how-it-works-card-left">
                  <div className="relative mb-10">
                    <div className="w-24 h-24 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary-200 transition-all duration-300 group-hover:scale-110">
                      <svg className="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                      1
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 group-hover:text-primary-600 transition-colors duration-300">
                    Đăng ký tài khoản
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                    Tạo tài khoản miễn phí và cung cấp thông tin cơ bản để chúng tôi có thể cá nhân hóa trải nghiệm học tập cho bạn.
                  </p>
                </div>

                <div className="text-center group px-4 py-8 how-it-works-card how-it-works-card-center">
                  <div className="relative mb-10">
                    <div className="w-24 h-24 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-secondary-200 transition-all duration-300 group-hover:scale-110">
                      <svg className="w-12 h-12 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-secondary-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                      2
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 group-hover:text-secondary-600 transition-colors duration-300">
                    Chọn bài học
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                    Khám phá thư viện bài học đa dạng từ cơ bản đến nâng cao, phù hợp với trình độ và mục tiêu của bạn.
                  </p>
                </div>

              <div className="text-center group px-4 py-8 how-it-works-card how-it-works-card-right">
                <div className="relative mb-10">
                  <div className="w-24 h-24 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-green-200 transition-all duration-300 group-hover:scale-110">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6 group-hover:text-green-600 transition-colors duration-300">
                  Theo dõi tiến độ
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                  Xem biểu đồ tiến độ chi tiết, nhận gợi ý cải thiện và đạt được mục tiêu học tập của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div ref={testimonialsRef} className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                Đánh giá từ học viên
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Những chia sẻ chân thực từ học viên đã thành công với chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-slide-in-up" style={{animationDelay: '0.5s'}}>
              <div className="card-feature group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-bold text-lg">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Anh Minh</h4>
                    <p className="text-gray-600 text-sm">Sinh viên</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Tôi đã cải thiện đáng kể khả năng tiếng Anh của mình nhờ hệ thống bài học đa dạng và phương pháp học tập hiệu quả."
                </p>
              </div>

              <div className="card-feature group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-secondary-600 font-bold text-lg">L</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Chị Lan</h4>
                    <p className="text-gray-600 text-sm">Nhân viên văn phòng</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Giao diện thân thiện và dễ sử dụng. Tôi có thể học mọi lúc mọi nơi, rất phù hợp với lịch trình bận rộn của tôi."
                </p>
              </div>

              <div className="card-feature group">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-600 font-bold text-lg">H</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Anh Hùng</h4>
                    <p className="text-gray-600 text-sm">Kỹ sư</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  ))}
                </div>
                <p className="text-gray-600 leading-relaxed">
                  "Hệ thống kiểm tra thông minh giúp tôi đánh giá chính xác trình độ và có kế hoạch học tập phù hợp."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div ref={ctaRef} className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-in-up">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Sẵn sàng bắt đầu hành trình học tiếng Anh?
              </h2>
              <p className="text-lg sm:text-xl text-primary-100 mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
                Tham gia cùng hàng nghìn học viên đã tin tưởng và thành công
              </p>
              <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-xl text-base sm:text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-soft-xl">
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">English Learning Suite</h3>
            <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto px-4">
              Nền tảng học tiếng Anh hiện đại và hiệu quả, giúp bạn chinh phục ngôn ngữ toàn cầu
            </p>
            <div className="flex justify-center space-x-6 mb-6 sm:mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </a>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 English Learning Suite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Hamburger Menu Dropdown */}
      {hamburgerMenuOpen && (
        <div className="fixed top-0 left-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="p-6">
            {/* Close Button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
              <button
                onClick={() => setHamburgerMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Lessons */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Bài học nhanh
              </h3>
              <div className="space-y-3">
                <Link to="/lessons" className="block p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📖</span>
                    <div>
                      <div className="font-semibold text-gray-900">Từ vựng cơ bản</div>
                      <div className="text-sm text-gray-600">50 từ thông dụng</div>
                    </div>
                  </div>
                </Link>
                <Link to="/lessons" className="block p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔤</span>
                    <div>
                      <div className="font-semibold text-gray-900">Ngữ pháp</div>
                      <div className="text-sm text-gray-600">Thì hiện tại đơn</div>
                    </div>
                  </div>
                </Link>
                <Link to="/lessons" className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💬</span>
                    <div>
                      <div className="font-semibold text-gray-900">Hội thoại</div>
                      <div className="text-sm text-gray-600">Chào hỏi cơ bản</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">📊</span>
                Tiến độ học tập
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Từ vựng</span>
                    <span className="text-sm text-gray-600">75%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 rounded-full h-2 w-3/4"></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Ngữ pháp</span>
                    <span className="text-sm text-gray-600">60%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary-600 rounded-full h-2 w-3/5"></div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-900">Hội thoại</span>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 rounded-full h-2 w-2/5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Goal */}
            <div className="mb-8">
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

            {/* Achievements */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-2">🏆</span>
                Thành tích
              </h3>
              <div className="space-y-2">
                <div className="flex items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xl mr-3">🥇</span>
                  <span className="text-sm text-gray-700">Học liên tiếp 7 ngày</span>
                </div>
                <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-xl mr-3">⭐</span>
                  <span className="text-sm text-gray-700">Hoàn thành 20 bài học</span>
                </div>
                <div className="flex items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-xl mr-3">🎯</span>
                  <span className="text-sm text-gray-700">Đạt điểm cao nhất</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {hamburgerMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setHamburgerMenuOpen(false)}
        ></div>
      )}

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <div className="scroll-arrow" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        <div className={`scroll-dot ${scrollDirection === 'up' ? 'active' : ''}`}></div>
        <div className={`scroll-dot ${scrollDirection === 'down' ? 'active' : ''}`}></div>
        <div className="scroll-arrow" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
