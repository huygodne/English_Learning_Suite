import React from 'react';

type Variant = 'mountain' | 'meadow' | 'sunset' | 'lake';

interface ScenicBackgroundProps {
  variant?: Variant;
  className?: string;
}

const ScenicBackground: React.FC<ScenicBackgroundProps> = ({ variant = 'mountain', className = '' }) => {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`} aria-hidden>
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{
        background: variant === 'sunset'
          ? 'linear-gradient(180deg, #ff9a9e 0%, #fad0c4 35%, #fbc2eb 70%, #a18cd1 100%)'
          : 'linear-gradient(180deg, #cce7ff 0%, #e6f3ff 45%, #ffffff 100%)'
      }} />

      {/* Soft clouds */}
      <svg className="absolute inset-x-0 top-0 w-full h-64 opacity-70" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path fill="#ffffff" fillOpacity="0.7" d="M0,192L48,165.3C96,139,192,85,288,85.3C384,85,480,139,576,138.7C672,139,768,85,864,85.3C960,85,1056,139,1152,165.3C1248,192,1344,192,1392,192L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      </svg>

      {/* Scenic layers */}
      {variant === 'mountain' && (
        <>
          <svg className="absolute bottom-0 w-[140%] -left-10 h-80 text-emerald-300/70" viewBox="0 0 900 300" preserveAspectRatio="none">
            <path fill="currentColor" d="M0 262l30-16c30-16 90-48 150-48s120 32 180 32 120-32 180-48 120-16 180 0 120 48 180 64v54H0z"/>
          </svg>
          <svg className="absolute bottom-0 w-[140%] -right-10 h-96 text-emerald-400" viewBox="0 0 900 300" preserveAspectRatio="none">
            <path fill="currentColor" d="M0 230l40-20c40-20 120-60 200-60s160 40 240 40 160-40 240-60 160-20 240 0v170H0z"/>
          </svg>
          <svg className="absolute bottom-0 w-full h-60 text-emerald-600" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,170.7C672,192,768,256,864,266.7C960,277,1056,235,1152,213.3C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </>
      )}

      {variant === 'meadow' && (
        <>
          <svg className="absolute bottom-0 w-full h-64 text-lime-400" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,256L40,256C80,256,160,256,240,245.3C320,235,400,213,480,192C560,171,640,149,720,149.3C800,149,880,171,960,176C1040,181,1120,171,1200,186.7C1280,203,1360,245,1400,266.7L1440,288L1440,320L0,320Z" />
          </svg>
          <svg className="absolute bottom-0 w-full h-72 text-lime-500" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,288L48,277.3C96,267,192,245,288,213.3C384,181,480,139,576,128C672,117,768,139,864,160C960,181,1056,203,1152,202.7C1248,203,1344,181,1392,170.7L1440,160L1440,320L0,320Z" />
          </svg>
          <div className="absolute inset-x-0 bottom-16 h-8 bg-gradient-to-r from-lime-300/40 via-emerald-300/40 to-teal-300/40 blur-xl" />
        </>
      )}

      {variant === 'sunset' && (
        <>
          <svg className="absolute bottom-0 w-full h-64 text-orange-300/80" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,288L60,277.3C120,267,240,245,360,234.7C480,224,600,224,720,224C840,224,960,224,1080,213.3C1200,203,1320,181,1380,170.7L1440,160L1440,320L0,320Z" />
          </svg>
          <svg className="absolute bottom-0 w-full h-80 text-rose-400/90" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,288L48,261.3C96,235,192,181,288,186.7C384,192,480,256,576,272C672,288,768,256,864,234.7C960,213,1056,203,1152,202.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L0,320Z" />
          </svg>
        </>
      )}

      {variant === 'lake' && (
        <>
          <svg className="absolute bottom-24 w-full h-40 text-teal-200 animate-[wave_8s_ease-in-out_infinite]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,245.3C384,267,480,277,576,261.3C672,245,768,203,864,170.7C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L0,320Z" />
          </svg>
          <svg className="absolute bottom-0 w-full h-48 text-teal-400/90 animate-[wave_6s_ease-in-out_infinite_reverse]" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,288L60,288C120,288,240,288,360,261.3C480,235,600,181,720,181.3C840,181,960,235,1080,240C1200,245,1320,203,1380,181.3L1440,160L1440,320L0,320Z" />
          </svg>
          <div className="absolute inset-x-0 bottom-8 h-8 bg-gradient-to-r from-cyan-300/40 via-sky-300/40 to-teal-300/40 blur-xl" />
        </>
      )}

      {/* Floating birds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-10 w-3 h-3 bg-rose-400 rounded-full animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute top-36 right-16 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-[floatReverse_7s_ease-in-out_infinite]" />
        <div className="absolute top-48 left-1/3 w-2.5 h-2.5 bg-sky-400 rounded-full animate-[float_8s_ease-in-out_infinite]" />
      </div>

      {/* Foreground plants/flowers for more details */}
      <svg className="absolute bottom-0 left-0 w-full h-24 opacity-90" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <g>
          <path fill="#84cc16" d="M0 120h1440V96c-80 0-160 16-240 16s-160-16-240-16-160 16-240 16-160-16-240-16-160 16-240 16S80 96 0 96z"/>
          {/* Simple flower dots */}
          <circle cx="120" cy="92" r="3" fill="#f472b6" />
          <circle cx="240" cy="98" r="3" fill="#f59e0b" />
          <circle cx="380" cy="94" r="3" fill="#38bdf8" />
          <circle cx="520" cy="100" r="3" fill="#f472b6" />
          <circle cx="760" cy="96" r="3" fill="#f59e0b" />
          <circle cx="980" cy="100" r="3" fill="#38bdf8" />
          <circle cx="1210" cy="96" r="3" fill="#f472b6" />
        </g>
      </svg>
    </div>
  );
};

export default ScenicBackground;


