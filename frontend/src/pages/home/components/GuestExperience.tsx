import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedMascot from '../../../components/AnimatedMascot';

type SectionRefs = {
  heroRef: React.RefObject<HTMLDivElement>;
  featuresRef: React.RefObject<HTMLDivElement>;
  statsRef: React.RefObject<HTMLDivElement>;
  howItWorksRef: React.RefObject<HTMLDivElement>;
  testimonialsRef: React.RefObject<HTMLDivElement>;
  ctaRef: React.RefObject<HTMLDivElement>;
};

type GuestExperienceProps = {
  isAuthenticated: boolean;
  userName?: string;
  sectionRefs: SectionRefs;
  scrollDirection: 'up' | 'down' | null;
};

const GuestExperience: React.FC<GuestExperienceProps> = ({
  isAuthenticated,
  userName,
  sectionRefs,
  scrollDirection
}) => {
  if (isAuthenticated) {
    return null;
  }

  const { heroRef, featuresRef, statsRef, howItWorksRef, testimonialsRef, ctaRef } = sectionRefs;

  return (
    <>
      <section ref={heroRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28">
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-[48px] bg-white/65 shadow-[0_40px_120px_-30px_rgba(79,70,229,0.35)] border border-white/60">
          <div className="aurora-layer" />
          <div className="grid-overlay" />
          <span className="orbital-dot" style={{ top: '14%', left: '8%' }} />
          <span className="orbital-dot" style={{ top: '12%', right: '6%', animationDelay: '0.6s' }} />
          <span className="orbital-dot" style={{ bottom: '10%', left: '18%', animationDelay: '1.2s' }} />
          <span className="sparkle" style={{ top: '20%', right: '30%' }} />
          <span className="sparkle" style={{ bottom: '18%', left: '40%', animationDelay: '1.6s' }} />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div className="text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/70 border border-white/80 shadow-soft backdrop-blur">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-sm font-semibold">
                🌱
              </span>
              <p className="text-sm sm:text-base font-semibold uppercase tracking-[0.28em] text-primary-700">
                LỘ TRÌNH KÈM CẶP TỪNG BƯỚC
              </p>
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-3xl xl:text-4xl font-extrabold text-contrast leading-tight text-center lg:text-left">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-500 uppercase tracking-tight whitespace-nowrap">
                  HỌC TIẾNG ANH
                </span>
                <span className="block uppercase tracking-tight whitespace-nowrap">HIỆU QUẢ & BỀN VỮNG</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-600/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-center lg:text-left tracking-wide">
                Khám phá trải nghiệm học cá nhân hóa với giáo trình sinh động, luyện tập đa giác quan và bảng điều khiển tiến độ
                trực quan giúp bạn luôn hào hứng mỗi ngày.
              </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-4 md:justify-start justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white rounded-2xl bg-gradient-to-r from-primary-500 via-indigo-500 to-secondary-500 shadow-[0_20px_45px_-20px_rgba(79,70,229,0.65)] transition-transform duration-300 hover:scale-[1.02]"
                  >
                    Bắt đầu miễn phí
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-primary-700 hover:text-primary-900 rounded-2xl border border-primary-200 bg-white/70 backdrop-blur hover:border-primary-400 transition-all duration-300"
                  >
                    Đăng nhập
                  </Link>
                </>
              ) : (
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/70 border border-white/80 shadow-soft text-slate-600">
                  <span className="text-xl">👋</span>
                  <div className="text-left">
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Chào mừng trở lại</p>
                    <p className="text-base font-semibold text-slate-700">{userName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center md:justify-start gap-3 text-left">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((item) => (
                    <span
                      key={item}
                      className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary-400 via-indigo-400 to-fuchsia-300 text-white text-sm font-semibold"
                      style={{ filter: 'saturate(1.2)' }}
                    >
                      {item === 4 ? '+9' : item}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Cộng đồng năng động</p>
                  <p className="text-base font-medium text-slate-600">12.500+ học viên luyện tập mỗi ngày</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-start lg:items-end gap-6 lg:gap-8 mt-8 lg:mt-12">
            <div className="flex justify-start lg:justify-start w-full lg:w-auto">
              <div className="relative max-w-md lg:max-w-lg -ml-4 lg:ml-0">
                <div className="absolute -top-8 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary-400/50 to-white/40 blur-2xl animate-[float_7s_ease-in-out_infinite]" />
                <div className="absolute -bottom-6 -right-10 w-36 h-36 rounded-full bg-gradient-to-br from-fuchsia-300/50 via-primary-400/30 to-white/30 blur-3xl animate-[floatReverse_8s_ease-in-out_infinite]" />
                <AnimatedMascot
                  mood="happy"
                  size="lg"
                  className="scale-95 md:scale-100 drop-shadow-[0_35px_60px_rgba(79,70,229,0.28)]"
                  bubbleText="Cùng luyện tập mỗi ngày nhé! ✨"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:gap-6 w-full lg:w-auto lg:flex-1 max-w-sm">
              <div className="floating-panel rounded-3xl p-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Tiến độ nhanh</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>Từ vựng</span>
                    <span className="text-primary-600">82%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200/70">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: '82%' }}></div>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>Kỹ năng nghe</span>
                    <span className="text-secondary-500">68%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-200/70">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-teal-400" style={{ width: '68%' }}></div>
                  </div>
                </div>
              </div>

              <div className="floating-panel rounded-3xl p-6 animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-3">Hôm nay</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>Chuỗi ngày</span>
                    <span className="text-emerald-500">+7 ngày</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>Bài học hoàn thành</span>
                    <span className="text-primary-600">03</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>Điểm trung bình</span>
                    <span className="text-amber-500">9.2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="relative py-24 bg-gradient-day overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-70 bg-[radial-gradient(60%_120%_at_0%_0%,rgba(255,255,255,0.6),transparent_70%),radial-gradient(60%_120%_at_100%_0%,rgba(255,255,255,0.5),transparent_75%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-900">
          <div className="text-center mb-16 sm:mb-20 animate-slide-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 sm:mb-5">
              Nâng tầm hành trình học tập của bạn
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Một hệ sinh thái học tiếng Anh hiện đại với công nghệ cá nhân hóa, nội dung sống động và hỗ trợ tận tâm.
            </p>
          </div>

          <div className={`features-container ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-slide-in-up" style={{ animationDelay: '0.15s' }}>
              <article className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-primary-500 via-indigo-500 to-sky-500 text-white shadow-[0_35px_70px_-30px_rgba(37,99,235,0.65)] feature-card feature-card-left">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.45), transparent 55%)' }}></div>
                <div className="relative flex flex-col gap-6">
                  <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur text-2xl">📚</span>
                  <div>
                    <h3 className="text-2xl font-semibold mb-3">Giáo trình đa dạng</h3>
                    <p className="text-base leading-relaxed text-white/85">
                      500+ bài học được viết bởi chuyên gia, từ phát âm, luyện nghe đến tiếng Anh giao tiếp chuyên sâu, sắp xếp theo lộ trình rõ ràng.
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-white/30">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((avatar) => (
                        <span key={avatar} className="w-9 h-9 rounded-full border border-white/40 bg-white/30 backdrop-blur text-xs font-semibold flex items-center justify-center">
                          {avatar === 3 ? '+20' : `B${avatar}`}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-white/80">Nội dung cập nhật mỗi tuần</p>
                  </div>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-3xl p-8 bg-white shadow-soft-xl border border-slate-200/60 feature-card feature-card-center">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-primary-100 blur-3xl" />
                <div className="relative flex flex-col gap-6">
                  <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary-200 to-emerald-300 text-2xl">🤖</span>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">AI Coach đồng hành</h3>
                    <p className="text-base leading-relaxed text-slate-600">
                      Chấm bài viết tự động, gợi ý sửa lỗi phát âm và đề xuất chủ đề hội thoại phù hợp với mục tiêu của bạn trong từng buổi học.
                    </p>
                  </div>
                  <ul className="relative space-y-3 text-sm text-slate-500">
                    <li className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600">✓</span>
                      Chấm điểm phát âm thời gian thực
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600">✓</span>
                      Gợi ý từ vựng theo ngữ cảnh bài học
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-secondary-100 text-secondary-600">✓</span>
                      Lưu lịch sử đối thoại và phản hồi chi tiết
                    </li>
                  </ul>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-white via-primary-50 to-sky-50 shadow-[0_35px_70px_-35px_rgba(14,165,233,0.6)] border border-slate-100 feature-card feature-card-right text-slate-900">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.18),transparent_60%)]" />
                <div className="relative flex flex-col gap-6">
                  <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-200 via-indigo-200 to-secondary-200 text-2xl">📈</span>
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">Bảng điều khiển trực quan</h3>
                    <p className="text-base leading-relaxed text-slate-600">
                      Theo dõi tiến độ từng kỹ năng với biểu đồ sinh động, nhận thông báo nhắc học và lộ trình điều chỉnh dựa trên dữ liệu thực tế.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-2xl bg-white/80 border border-white/60 p-4 text-left">
                      <p className="text-xs uppercase tracking-widest text-primary-500 mb-2">Mốc tháng</p>
                      <p className="text-2xl font-bold text-slate-900">+43%</p>
                      <p className="text-xs text-slate-500">Thời lượng học</p>
                    </div>
                    <div className="rounded-2xl bg-white/80 border border-white/60 p-4 text-left">
                      <p className="text-xs uppercase tracking-widest text-secondary-500 mb-2">Điểm trung bình</p>
                      <p className="text-2xl font-bold text-slate-900">9.0</p>
                      <p className="text-xs text-slate-500">Tăng 1.8 điểm</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section ref={statsRef} className="relative py-20 text-white bg-gradient-sunset overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(90% 120% at 50% 0%, rgba(255,255,255,0.25) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Cộng đồng học tập không ngừng phát triển</h2>
            <p className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto">
              Chúng tôi đồng hành cùng bạn bằng dữ liệu thực tế và hỗ trợ liên tục để đảm bảo bạn luôn tiến bộ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 animate-slide-in-up" style={{ animationDelay: '0.25s' }}>
            {[
              { label: 'Học viên tích cực', value: '12K+', accent: 'from-emerald-400 to-emerald-500' },
              { label: 'Bài học chuyên sâu', value: '620+', accent: 'from-sky-400 to-indigo-400' },
              { label: 'Tỉ lệ hài lòng', value: '96%', accent: 'from-amber-400 to-orange-400' },
              { label: 'Phiên hỗ trợ/tháng', value: '2.4K', accent: 'from-fuchsia-400 to-pink-400' }
            ].map((stat, idx) => (
              <div key={stat.label} className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-white/40 to-white/5">
                <div className="relative rounded-3xl bg-white/10 backdrop-blur-xl p-8 h-full flex flex-col justify-between">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15">
                    <span className={`inline-flex w-10 h-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} text-white font-semibold text-lg`}>{idx + 1}</span>
                  </div>
                  <div>
                    <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
                    <p className="text-sm uppercase tracking-[0.35em] text-white/50">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={howItWorksRef} className="relative py-20 bg-gradient-twilight overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-[0.35] bg-[radial-gradient(80%_120%_at_0%_0%,rgba(255,255,255,0.9),transparent_70%),radial-gradient(80%_120%_at_100%_100%,rgba(255,255,255,0.8),transparent_70%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-slate-900">
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">Lộ trình học 3 bước rõ ràng</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Mỗi bước đều được tối ưu để bạn bắt đầu nhanh chóng, duy trì động lực và nhìn thấy kết quả cụ thể.
            </p>
          </div>

          <div className={`how-it-works-container ${scrollDirection ? `scroll-${scrollDirection}` : ''}`}>
            <div className="relative animate-slide-in-up" style={{ animationDelay: '0.35s' }}>
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-primary-200 via-indigo-200 to-transparent" />
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-10">
                {[
                  {
                    step: '01',
                    title: 'Khởi động & khám phá',
                    description: 'Đăng ký tài khoản, làm bài kiểm tra đầu vào và nhận đánh giá chi tiết, từ đó hệ thống tự gợi ý lộ trình phù hợp.',
                    icon: '✨'
                  },
                  {
                    step: '02',
                    title: 'Học tập chủ động',
                    description: 'Chọn bài học được cá nhân hóa, kết hợp video tương tác, bài tập nghe - nói và trò chuyện cùng AI coach.',
                    icon: '🧠'
                  },
                  {
                    step: '03',
                    title: 'Đo lường và bứt phá',
                    description: 'Theo dõi tiến độ, mở khóa huy hiệu, nhận nhắc nhở thông minh và điều chỉnh lộ trình dựa trên dữ liệu học tập thực tế.',
                    icon: '🚀'
                  }
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className={`relative px-6 py-10 how-it-works-card ${index === 0 ? 'how-it-works-card-left' : index === 1 ? 'how-it-works-card-center' : 'how-it-works-card-right'}`}
                  >
                    <div className="absolute inset-0 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80" />
                    <div className="absolute inset-0 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.08) 0%, rgba(34,211,238,0.05) 100%)' }} />
                    <div className="relative z-10 flex flex-col gap-6 text-left">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-white/60 text-2xl shadow-soft">{item.icon}</span>
                        <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-semibold tracking-[0.3em]">
                          {item.step}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                        <p className="text-base text-slate-600 leading-relaxed">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600">★</span>
                        Tư vấn cá nhân hóa trong suốt hành trình
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={testimonialsRef} className="relative py-20 bg-gradient-night text-white overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30 bg-[radial-gradient(60%_110%_at_30%_10%,rgba(255,255,255,0.4),transparent_70%),radial-gradient(70%_140%_at_70%_20%,rgba(59,130,246,0.45),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Học viên nói gì về chúng tôi</h2>
            <p className="text-lg sm:text-xl text-slate-200 max-w-3xl mx-auto">Những câu chuyện truyền cảm hứng từ cộng đồng học viên luôn nỗ lực mỗi ngày.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 animate-slide-in-up" style={{ animationDelay: '0.45s' }}>
            <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-primary-500 through-indigo-500 to-sky-500 text-white p-10 shadow-[0_40px_90px_-35px_rgba(59,130,246,0.55)]">
              <span className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
              <span className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl">🎓</div>
                  <div>
                    <h4 className="text-xl font-semibold">Nguyễn Anh Minh</h4>
                    <p className="text-white/70 text-sm">Sinh viên Kinh tế Quốc dân</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-200">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg leading-relaxed">
                  “Sau 3 tháng học với English Learning Suite, điểm IELTS Speaking của tôi tăng từ 6.0 lên 7.0. Các bài luyện phát âm với AI giúp tôi tự tin hơn rất nhiều khi giao tiếp.”
                </p>
                <div className="inline-flex items-center gap-3 text-sm text-white/80">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur">🔥</span>
                  Chuỗi học 45 ngày liên tiếp
                </div>
              </div>
            </div>

            <div className="space-y-6 text-slate-900">
              {[
                {
                  name: 'Trần Ngọc Lan',
                  role: 'Nhân viên Marketing',
                  quote: 'Tôi tranh thủ luyện nghe và làm quiz mọi lúc rảnh rỗi. Bảng điều khiển giúp tôi biết chính xác cần tập trung kỹ năng nào.',
                  emoji: '💼'
                },
                {
                  name: 'Phạm Quang Hùng',
                  role: 'Kỹ sư phần mềm',
                  quote: 'Các bài kiểm tra định kỳ và đánh giá chi tiết giúp tôi đặt mục tiêu rõ ràng. Giờ tôi tự tin trình bày với khách hàng quốc tế.',
                  emoji: '🛠️'
                },
                {
                  name: 'Lê Thị Mai',
                  role: 'Giáo viên tiếng Anh',
                  quote: 'Kho bài giảng phong phú và luôn cập nhật. Tôi còn dùng tài liệu tại đây để hỗ trợ học sinh của mình.',
                  emoji: '📖'
                }
              ].map((item) => (
                <article key={item.name} className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 backdrop-blur p-6 shadow-soft">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-xl">
                      {item.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900">{item.name}</h4>
                          <p className="text-sm text-slate-500">{item.role}</p>
                        </div>
                        <svg className="w-6 h-6 text-primary-200" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M7.17 6A5.17 5.17 0 002 11.17v6.66A.17.17 0 002.17 18h6.66A.17.17 0 009 17.83V11.17A5.17 5.17 0 003.83 6H7.17zm13 0A5.17 5.17 0 0015 11.17v6.66a.17.17 0 00.17.17h6.66A.17.17 0 0022 17.83V11.17A5.17 5.17 0 0016.83 6h3.34z" />
                        </svg>
                      </div>
                      <p className="mt-4 text-slate-600 leading-relaxed">“{item.quote}”</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={ctaRef} className="relative py-20 bg-gradient-dawn text-slate-900 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ backgroundImage: 'radial-gradient(90% 120% at 10% 0%, rgba(255,255,255,0.75) 0%, transparent 70%), radial-gradient(80% 100% at 90% 100%, rgba(255,255,255,0.6) 0%, transparent 65%)' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-slide-in-up">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/15 backdrop-blur-lg border border-white/30 mb-8">
            <span className="text-2xl">🚀</span>
            <span className="text-sm uppercase tracking-[0.4em] font-semibold">Sẵn sàng bứt phá</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Bắt đầu hành trình tiếng Anh của bạn ngay hôm nay
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
            Tạo tài khoản miễn phí, trải nghiệm giáo trình cao cấp và nhận bản đánh giá kỹ năng chi tiết chỉ trong vài phút.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 via-indigo-600 to-secondary-500 rounded-2xl shadow-[0_30px_60px_-25px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:scale-[1.03]"
            >
              Đăng ký miễn phí
            </Link>
            <Link
              to="/lessons"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-primary-600 border border-primary-200 rounded-2xl bg-white/70 backdrop-blur hover:bg-white transition-all duration-300"
            >
              Xem trước bài học
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default GuestExperience;

