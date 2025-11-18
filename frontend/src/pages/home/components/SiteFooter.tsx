import React from 'react';

const SiteFooter: React.FC = () => (
  <footer className="relative overflow-hidden bg-slate-950 text-white py-16">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.4),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.35),transparent_55%)]" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white font-semibold text-xl">
              EL
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold">English Learning Suite</h3>
          </div>
          <p className="text-white/70 max-w-xl leading-relaxed mb-8">
            Nền tảng học tiếng Anh được thiết kế cho người Việt với giáo trình hiện đại, công nghệ AI đồng hành và cộng đồng hỗ trợ
            nhiệt tình.
          </p>
          <div className="flex flex-wrap items-center gap-5 mb-8 text-white/60">
            <span className="text-sm uppercase tracking-[0.3em]">Kết nối</span>
            <a href="#" className="hover:text-white transition-colors">
              Facebook
            </a>
            <a href="#" className="hover:text-white transition-colors">
              YouTube
            </a>
            <a href="#" className="hover:text-white transition-colors">
              TikTok
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Blog
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm text-white/70">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Về chúng tôi</p>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Lộ trình học
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.35em] text-white/50">Tài nguyên</p>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Tài liệu miễn phí
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Workshop sắp tới
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cộng đồng Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hỗ trợ kỹ thuật
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
        <p>© 2024 English Learning Suite. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <a href="#" className="hover:text-white transition-colors">
            Điều khoản
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Bảo mật
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Cookies
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;

