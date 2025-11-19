import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedMascot, { MascotMood } from '../components/AnimatedMascot';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [isWaving, setIsWaving] = useState(false);
  const waveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const triggerWave = () => {
    if (waveTimeoutRef.current) {
      clearTimeout(waveTimeoutRef.current);
    }
    setIsWaving(true);
    waveTimeoutRef.current = window.setTimeout(() => {
      setIsWaving(false);
    }, 1800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Trigger friendly wave when user interacts with the fields
    if (name === 'password') {
      if (value.length > 0) {
        triggerWave();
        setMascotMood('peek');
      } else if (!formData.username) {
        setMascotMood('idle');
      }
    } else if (name === 'username') {
      if (value.length > 0) {
        setMascotMood('typing');
        if (formData.password.length > 0) {
          triggerWave();
        }
      } else if (!formData.password) {
        setMascotMood('idle');
      }
    }
  };

  useEffect(() => {
    if (error) {
      setMascotMood('sad');
      setIsWaving(false);
    }
  }, [error]);

  useEffect(() => {
    return () => {
      if (waveTimeoutRef.current) {
        clearTimeout(waveTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setMascotMood('typing');

    try {
      await login(formData.username, formData.password);
      setMascotMood('happy');
      triggerWave();
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data || 'Đăng nhập thất bại');
      setMascotMood('sad');
      setIsWaving(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <style>{`
        /* Space Background */
        .space-background {
          position: fixed;
          inset: 0;
          background: #0a0e27;
          z-index: 0;
        }
        
        /* Twinkling stars */
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .star-small {
          width: 2px;
          height: 2px;
        }
        
        .star-medium {
          width: 3px;
          height: 3px;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        /* 5-pointed yellow star */
        .star-yellow {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 12px solid #FFD700;
          transform: rotate(35deg);
          animation: starTwinkle 2s ease-in-out infinite;
        }
        
        .star-yellow::before {
          content: "";
          position: absolute;
          left: -8px;
          top: -4px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 12px solid #FFD700;
          transform: rotate(-70deg);
        }
        
        .star-yellow::after {
          content: "";
          position: absolute;
          left: -8px;
          top: 4px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #FFD700;
          transform: rotate(35deg);
        }
        
        /* 4-pointed white star */
        .star-white-4 {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid white;
          transform: rotate(45deg);
          animation: starTwinkle 2.5s ease-in-out infinite;
        }
        
        .star-white-4::before {
          content: "";
          position: absolute;
          left: -6px;
          top: 0;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 10px solid white;
          transform: rotate(-90deg);
        }
        
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.6; transform: rotate(35deg) scale(1); }
          50% { opacity: 1; transform: rotate(35deg) scale(1.1); }
        }
        
        /* Saturn-like planet */
        .planet-saturn {
          position: absolute;
          bottom: 80px;
          left: 60px;
          width: 120px;
          height: 120px;
        }
        
        .planet-saturn-body {
          width: 100px;
          height: 100px;
          background: linear-gradient(to bottom, 
            #FF8C42 0%,
            #FF7F50 20%,
            #FF6B35 40%,
            #FF8C42 60%,
            #FF7F50 80%,
            #FF6B35 100%
          );
          border-radius: 50%;
          position: absolute;
          bottom: 0;
          left: 10px;
          box-shadow: 
            inset -20px -20px 40px rgba(0,0,0,0.3),
            inset 20px 20px 40px rgba(255,255,255,0.2),
            0 0 30px rgba(255,140,66,0.3);
        }
        
        .planet-saturn-rings {
          position: absolute;
          top: -20px;
          left: -10px;
          width: 140px;
          height: 140px;
          border: 8px solid #FFD700;
          border-radius: 50%;
          transform: rotate(-15deg);
          box-shadow: 
            0 0 20px rgba(255,215,0,0.5),
            inset 0 0 20px rgba(255,215,0,0.2);
        }
        
        .planet-saturn-rings::before {
          content: "";
          position: absolute;
          top: -15px;
          left: -15px;
          width: 170px;
          height: 170px;
          border: 6px solid rgba(255,215,0,0.6);
          border-radius: 50%;
        }
        
        /* Blue planet */
        .planet-blue {
          position: absolute;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 80px;
        }
        
        .planet-blue-body {
          width: 80px;
          height: 80px;
          background: radial-gradient(circle at 30% 30%, 
            #87CEEB 0%,
            #6BB6FF 50%,
            #4A90E2 100%
          );
          border-radius: 50%;
          box-shadow: 
            inset -15px -15px 30px rgba(0,0,0,0.3),
            inset 15px 15px 30px rgba(255,255,255,0.2),
            0 0 25px rgba(107,182,255,0.4);
          position: relative;
        }
        
        .planet-blue-body::before {
          content: "";
          position: absolute;
          top: 20px;
          left: 30px;
          width: 15px;
          height: 15px;
          background: #2E5C8A;
          border-radius: 50%;
        }
        
        .planet-blue-body::after {
          content: "";
          position: absolute;
          bottom: 25px;
          right: 20px;
          width: 20px;
          height: 20px;
          background: #2E5C8A;
          border-radius: 50%;
        }
        
        .planet-blue-ring {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 90px;
          height: 90px;
          border: 2px solid rgba(255,255,255,0.4);
          border-radius: 50%;
          transform: rotate(10deg);
        }
        
        /* Moon */
        .moon {
          position: absolute;
          top: 80px;
          right: 100px;
          width: 100px;
          height: 100px;
          background: #E8E8E8;
          border-radius: 50%;
          box-shadow: 
            inset -20px -20px 40px rgba(0,0,0,0.2),
            inset 20px 20px 40px rgba(255,255,255,0.3),
            0 0 30px rgba(232,232,232,0.3);
        }
        
        .moon-crater {
          position: absolute;
          background: #C0C0C0;
          border-radius: 50%;
          box-shadow: inset 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .moon-crater-1 { top: 20px; left: 30px; width: 18px; height: 18px; }
        .moon-crater-2 { top: 35px; right: 25px; width: 12px; height: 12px; }
        .moon-crater-3 { bottom: 30px; left: 20px; width: 15px; height: 15px; }
        .moon-crater-4 { bottom: 25px; right: 30px; width: 10px; height: 10px; }
        .moon-crater-5 { top: 50px; left: 50px; width: 14px; height: 14px; }
        .moon-crater-6 { top: 60px; right: 40px; width: 8px; height: 8px; }
        
        /* Shooting stars */
        .shooting-star {
          position: absolute;
          width: 2px;
          height: 60px;
          background: linear-gradient(to bottom, white, transparent);
          transform-origin: top;
          animation: shootStar 8s linear infinite;
        }
        
        .shooting-star::before {
          content: "";
          position: absolute;
          top: 0;
          left: -2px;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px white;
        }
        
        @keyframes shootStar {
          0% {
            opacity: 0;
            transform: translateX(0) translateY(0) rotate(-45deg);
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(200px) translateY(200px) rotate(-45deg);
          }
        }
        
        .shooting-star-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .shooting-star-2 {
          top: 15%;
          left: 15%;
          animation-delay: 2s;
        }
        
        .shooting-star-3 {
          top: 120px;
          left: 52%;
          animation-delay: 4s;
        }
        
        .shooting-star-4 {
          top: 100px;
          right: 120px;
          animation-delay: 6s;
        }
        
        /* Rocket */
        .rocket {
          position: absolute;
          bottom: 100px;
          right: 80px;
          width: 60px;
          height: 120px;
          animation: rocketFloat 3s ease-in-out infinite;
        }
        
        .rocket-body {
          width: 40px;
          height: 100px;
          background: white;
          border-radius: 20px 20px 5px 5px;
          position: relative;
          box-shadow: 
            0 0 20px rgba(255,255,255,0.3),
            inset 0 0 20px rgba(255,255,255,0.1);
        }
        
        .rocket-nose {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-right: 20px solid transparent;
          border-bottom: 20px solid #FF4444;
        }
        
        .rocket-window {
          position: absolute;
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 12px;
          background: #87CEEB;
          border: 2px solid #4A90E2;
          border-radius: 50%;
          box-shadow: inset 0 0 10px rgba(74,144,226,0.5);
        }
        
        .rocket-window-2 {
          top: 45px;
          width: 10px;
          height: 10px;
        }
        
        .rocket-window-3 {
          top: 65px;
          width: 10px;
          height: 10px;
        }
        
        .rocket-flames {
          position: absolute;
          bottom: -40px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 15px solid transparent;
          border-right: 15px solid transparent;
          border-top: 40px solid #FF8C42;
          animation: flameFlicker 0.3s ease-in-out infinite;
        }
        
        .rocket-flames::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: -12px;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 30px solid #FFD700;
        }
        
        @keyframes rocketFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes flameFlicker {
          0%, 100% { transform: translateX(-50%) scaleY(1); }
          50% { transform: translateX(-50%) scaleY(1.1); }
        }
      `}</style>
      
      {/* Space Background */}
      <div className="space-background">
        {/* Small twinkling stars */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={`star-${i}`}
            className="star star-small"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Medium stars */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`star-m-${i}`}
            className="star star-medium"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Yellow 5-pointed stars */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`star-y-${i}`}
            className="star-yellow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
        
        {/* White 4-pointed stars */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`star-w-${i}`}
            className="star-white-4"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2.5}s`,
            }}
          />
        ))}
        
        {/* Saturn-like planet */}
        <Link to="/lessons" className="planet-saturn group">
          <div className="planet-saturn-rings group-hover:scale-110 transition-transform duration-300"></div>
          <div className="planet-saturn-body"></div>
          <span className="planet-callout">Bài học</span>
        </Link>
        
        {/* Blue planet */}
        <Link to="/library" className="planet-blue group">
          <div className="planet-blue-ring group-hover:scale-110 transition-transform duration-300"></div>
          <div className="planet-blue-body"></div>
          <span className="planet-callout">Thư viện</span>
        </Link>
        
        {/* Moon */}
        <div className="moon">
          <div className="moon-crater moon-crater-1"></div>
          <div className="moon-crater moon-crater-2"></div>
          <div className="moon-crater moon-crater-3"></div>
          <div className="moon-crater moon-crater-4"></div>
          <div className="moon-crater moon-crater-5"></div>
          <div className="moon-crater moon-crater-6"></div>
        </div>
        
        {/* Shooting stars */}
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>
        <div className="shooting-star shooting-star-4"></div>
        
        {/* Rocket */}
        <Link to="/tests" className="rocket group">
          <div className="rocket-body">
            <div className="rocket-nose"></div>
            <div className="rocket-window"></div>
            <div className="rocket-window rocket-window-2"></div>
            <div className="rocket-window rocket-window-3"></div>
          </div>
          <div className="rocket-flames group-hover:scale-110 transition-transform duration-300"></div>
          <span className="planet-callout">Kiểm tra</span>
        </Link>
      </div>

      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 relative z-10">
        {/* Mascot Section */}
        <div className="hidden lg:flex flex-1 justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <AnimatedMascot
            mood={mascotMood}
            isWaving={isWaving}
            accentTone="primary"
            size="lg"
            floating={true}
            bubbleText={
              error ? 'Ôi không, thử lại nhé! 😢' :
              loading ? 'Đang kiểm tra... ⚡' :
              mascotMood === 'happy' ? 'Tuyệt vời! Đăng nhập thành công! 🎉' :
              mascotMood === 'typing' ? 'Đang nhập thông tin... 👀' :
              isWaving ? 'Xin chào! 👋' :
              'Chào bạn! Hãy điền thông tin để đăng nhập nhé!'
            }
          />
        </div>

        {/* Form Section */}
        <div className="w-full lg:max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-bounce-gentle">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              Đăng nhập
            </h2>
            <p className="text-lg text-white/80">
              Chào mừng bạn quay trở lại!
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
            <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
                  placeholder="Nhập tên đăng nhập"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => {
                    if (formData.password.length > 0) {
                      triggerWave();
                    }
                    setMascotMood('typing');
                  }}
                  onBlur={() => {
                    if (!formData.password && !formData.username && !error) {
                      setMascotMood('idle');
                    }
                  }}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 hover:bg-white/15 focus:bg-white/15"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => {
                      triggerWave();
                      setMascotMood('peek');
                    }}
                    onBlur={() => {
                      if (!error && formData.password.length === 0 && formData.username.length === 0) {
                        setMascotMood('idle');
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-200 px-4 py-3 rounded-xl animate-scale-in transform transition-all duration-300">
                <div className="flex items-center">
                  <span className="text-xl mr-2">😢</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex justify-center items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-white/70">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="font-medium text-blue-300 hover:text-blue-200 transition-colors duration-300">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
