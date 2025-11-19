import React, { useMemo } from 'react';

export type MascotMood =
  | 'idle'
  | 'peek'
  | 'typing'
  | 'curious'
  | 'happy'
  | 'sad'
  | 'wave';

type AccentTone = 'primary' | 'secondary' | 'emerald';

interface AnimatedMascotProps {
  mood?: MascotMood;
  headline?: string;
  subline?: string;
  bubbleText?: string | null;
  accentTone?: AccentTone;
  className?: string;
  size?: 'md' | 'lg';
  floating?: boolean;
}

const MOOD_PRESETS: Record<MascotMood, {
  eyeLeftScale: number;
  eyeRightScale: number;
  mouthCurve: number;
  defaultSpeech: string;
}> = {
  idle: {
    eyeLeftScale: 1,
    eyeRightScale: 1,
    mouthCurve: 0,
    defaultSpeech: 'Chào bạn! Tôi là Robot học tập! 🤖',
  },
  peek: {
    eyeLeftScale: 1,
    eyeRightScale: 1,
    mouthCurve: 0,
    defaultSpeech: 'Tôi sẽ không nhìn đâu! Bảo mật tối đa! 🔒',
  },
  typing: {
    eyeLeftScale: 1,
    eyeRightScale: 1,
    mouthCurve: 0,
    defaultSpeech: 'Đang xử lý thông tin... ⚡',
  },
  curious: {
    eyeLeftScale: 1.1,
    eyeRightScale: 1.1,
    mouthCurve: 0,
    defaultSpeech: 'Hmm... Có gì đó thú vị đây! 🤔',
  },
  happy: {
    eyeLeftScale: 1.2,
    eyeRightScale: 1.2,
    mouthCurve: -8,
    defaultSpeech: 'Tuyệt vời! Bạn làm tốt lắm! 🎉✨',
  },
  sad: {
    eyeLeftScale: 0.9,
    eyeRightScale: 0.9,
    mouthCurve: 8,
    defaultSpeech: 'Ôi không... Hãy thử lại nhé! 😢',
  },
  wave: {
    eyeLeftScale: 1,
    eyeRightScale: 1,
    mouthCurve: -4,
    defaultSpeech: 'Hẹn gặp lại! Nhớ luyện tập nhé! 👋',
  },
};

const DEFAULT_BUBBLE: Record<MascotMood, string> = Object.fromEntries(
  Object.entries(MOOD_PRESETS).map(([key, value]) => [key, value.defaultSpeech])
) as Record<MascotMood, string>;

const AnimatedMascot: React.FC<AnimatedMascotProps> = ({
  mood = 'idle',
  headline,
  subline,
  bubbleText,
  accentTone = 'primary',
  className = '',
  size = 'lg',
  floating = true,
}) => {
  const preset = useMemo(() => MOOD_PRESETS[mood] ?? MOOD_PRESETS.idle, [mood]);
  const speechBubble = bubbleText === null ? null : bubbleText ?? DEFAULT_BUBBLE[mood];
  const scale = size === 'lg' ? 1 : 0.75;

  const robotKey = useMemo(() => `robot-${mood}`, [mood]);
  const styleId = useMemo(() => `robot-styles-${Math.random().toString(36).slice(2)}`, []);
  
  return (
    <div
      className={`relative ${floating ? 'animate-soft-float' : ''} ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      <style id={styleId}>{`
        .robot-simple {
          width: 280px;
          height: 380px;
          position: relative;
          margin: 0 auto;
          animation: robotBreathe 3s ease-in-out infinite !important;
          animation-play-state: running !important;
          animation-delay: 0s !important;
          will-change: transform;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }

        @keyframes robotBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        /* Color palette - Cute Robot */
        :root {
          --light-gray: #E8E8E8;
          --dark-blue: #2C3E7A;
          --bright-blue: #00BFFF;
          --glow-blue: #00D4FF;
          --black: #000000;
        }

        /* Head - Rounded oval, wider than tall */
        .robot-head {
          width: 154px;
          height: 119px;
          background: var(--light-gray);
          border-radius: 77px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 2px 4px rgba(255, 255, 255, 0.7),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1);
          animation: headFloat 4s ease-in-out infinite;
          z-index: 1;
        }
        
        /* Cat ears - rounded and slightly pointed */
        .robot-head::before {
          content: "";
          position: absolute;
          top: -16px;
          left: 28px;
          width: 28px;
          height: 34px;
          background: var(--light-gray);
          border-radius: 50% 50% 0 0;
          clip-path: polygon(0% 100%, 30% 0%, 70% 0%, 100% 100%);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.7);
        }
        
        .robot-head::after {
          content: "";
          position: absolute;
          top: -16px;
          right: 28px;
          width: 28px;
          height: 34px;
          background: var(--light-gray);
          border-radius: 50% 50% 0 0;
          clip-path: polygon(0% 100%, 30% 0%, 70% 0%, 100% 100%);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.7);
        }
        
        /* Dark blue faceplate mask - covers entire face */
        .robot-faceplate {
          position: absolute;
          top: 11px;
          left: 8px;
          right: 8px;
          bottom: 8px;
          background: var(--dark-blue);
          border-radius: 70px 70px 63px 63px;
          z-index: 2;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.4);
        }
        
        /* Side speaker details - below cat ears */
        .robot-side-detail {
          position: absolute;
          top: 25px;
          width: 14px;
          height: 20px;
          background: var(--dark-blue);
          border-radius: 7px;
          z-index: 1;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .robot-side-detail.left {
          left: -7px;
        }
        .robot-side-detail.right {
          right: -7px;
        }

        @keyframes headFloat {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(-3px) rotate(1deg); }
        }
        
        .robot-head {
          animation-play-state: running !important;
          will-change: transform;
        }

        ${mood === 'happy' ? `
        .robot-head {
          animation: headFloat 4s ease-in-out infinite, headHappy 0.6s ease infinite;
        }
        @keyframes headHappy {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(-5px) rotate(-2deg); }
        }
        ` : ''}

        ${mood === 'sad' ? `
        .robot-head {
          animation: headFloat 4s ease-in-out infinite, headSad 3s ease-in-out infinite;
        }
        @keyframes headSad {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(-2deg); }
          50% { transform: translateX(-50%) translateY(2px) rotate(-4deg); }
        }
        ` : ''}

/* Eyes - Bright glowing blue circles, prominent */
        .robot-eyes {
          position: absolute;
          top: 53px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 28px;
          z-index: 3;
        }

        .robot-eye {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, var(--glow-blue) 0%, var(--bright-blue) 60%, var(--bright-blue) 100%);
          box-shadow: 
            0 0 14px var(--bright-blue),
            0 0 25px rgba(0, 191, 255, 0.7),
            0 0 35px rgba(0, 212, 255, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.5),
            inset 0 -1px 3px rgba(0, 0, 0, 0.2);
          animation: eyeGlow 2s ease-in-out infinite;
          animation-play-state: running !important;
          will-change: box-shadow;
        }
        
        @keyframes eyeGlow {
          0%, 100% { 
            box-shadow: 
              0 0 14px var(--bright-blue),
              0 0 25px rgba(0, 191, 255, 0.7),
              0 0 35px rgba(0, 212, 255, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.5);
          }
          50% { 
            box-shadow: 
              0 0 20px var(--bright-blue),
              0 0 34px rgba(0, 191, 255, 0.9),
              0 0 45px rgba(0, 212, 255, 0.6),
              inset 0 2px 4px rgba(255, 255, 255, 0.6);
          }
        }

        .robot-eye {
          animation: eyeBlink 5s cubic-bezier(0.4, 0, 0.2, 1) infinite, eyeGlow 2s ease-in-out infinite !important;
          animation-play-state: running !important;
        }

        @keyframes eyeBlink {
          0%, 82%, 100% {
            height: 16px;
            border-radius: 50%;
          }
          86% {
            height: 2px;
            border-radius: 50%;
          }
          88% {
            height: 2px;
            border-radius: 50%;
          }
          90% {
            height: 16px;
            border-radius: 50%;
          }
        }

        /* Mouth - Cat smile shape (W shape) */
        .robot-mouth {
          width: 24px;
          height: 12px;
          position: absolute;
          bottom: 35px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }

        .robot-mouth::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 3px;
          background: var(--black);
          border-radius: 2px;
          clip-path: polygon(0% 100%, 25% 0%, 50% 100%, 75% 0%, 100% 100%);
        }

        ${mood === 'happy' ? `
        .robot-mouth::before {
          clip-path: polygon(0% 100%, 20% 0%, 50% 100%, 80% 0%, 100% 100%);
          height: 4px;
        }
        ` : ''}

        ${mood === 'sad' ? `
        .robot-mouth::before {
          clip-path: polygon(0% 0%, 25% 100%, 50% 0%, 75% 100%, 100% 0%);
        }
        ` : ''}

        /* Body - Plump rounded egg/pear shape, wider at bottom */
        .robot-body {
          width: 140px;
          height: 168px;
          background: var(--light-gray);
          border-radius: 70px 70px 84px 84px;
          position: absolute;
          top: 112px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 
            0 4px 12px rgba(0, 0, 0, 0.15),
            inset 0 2px 4px rgba(255, 255, 255, 0.7),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1);
          animation: bodySway 5s ease-in-out infinite;
          z-index: 1;
        }
        
        /* D-shape chest panel - straight top, curved bottom */
        .robot-chest-panel {
          position: absolute;
          top: 35px;
          left: 50%;
          transform: translateX(-50%);
          width: 70px;
          height: 63px;
          background: var(--bright-blue);
          border: 3.5px solid var(--dark-blue);
          border-top: none;
          border-radius: 0 0 35px 35px;
          z-index: 2;
          box-shadow: 
            0 0 14px rgba(0, 191, 255, 0.7),
            0 0 22px rgba(0, 212, 255, 0.4),
            inset 0 2px 6px rgba(255, 255, 255, 0.5),
            inset 0 -2px 4px rgba(0, 0, 0, 0.2);
          animation: chestGlow 2s ease-in-out infinite;
        }
        
        @keyframes chestGlow {
          0%, 100% { 
            box-shadow: 
              0 0 14px rgba(0, 191, 255, 0.7),
              0 0 22px rgba(0, 212, 255, 0.4),
              inset 0 2px 6px rgba(255, 255, 255, 0.5);
          }
          50% { 
            box-shadow: 
              0 0 20px rgba(0, 191, 255, 0.9),
              0 0 31px rgba(0, 212, 255, 0.6),
              inset 0 2px 6px rgba(255, 255, 255, 0.6);
          }
        }
        

        /* Legs - Short stubby dark blue boots, positioned close together */
        .robot-legs {
          position: absolute;
          top: 273px;
          left: 50%;
          transform: translateX(-50%);
          width: 112px;
          height: 70px;
          display: flex;
          justify-content: space-between;
          gap: 22px;
          z-index: 0;
        }
        
        .robot-leg {
          width: 39px;
          height: 63px;
          background: var(--dark-blue);
          border-radius: 20px 20px 25px 25px;
          position: relative;
          animation: legBounce 2.8s ease-in-out infinite;
          box-shadow: 
            0 4px 12px rgba(0,0,0,0.2),
            inset 0 2px 4px rgba(0, 0, 0, 0.4),
            inset 0 -2px 4px rgba(255, 255, 255, 0.1);
        }
        .robot-leg.right { animation-delay: 0.25s; }

        @keyframes legBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }

        @keyframes bodySway {
          0%, 100% { transform: translateX(-50%) translateY(0) rotate(0deg); }
          50% { transform: translateX(-50%) translateY(2px) rotate(0.5deg); }
        }
        
        .robot-body {
          animation-play-state: running !important;
          will-change: transform;
        }

      `}</style>
      
      <div 
        className="robot-simple" 
        key={robotKey}
        style={{ 
          animationPlayState: 'running',
          animationName: 'robotBreathe',
          animationDuration: '3s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite'
        }}
      >
        {/* Head with cat ears */}
        <div className="robot-head">
          {/* Dark blue faceplate */}
          <div className="robot-faceplate"></div>
          
          {/* Side speaker details */}
          <div className="robot-side-detail left"></div>
          <div className="robot-side-detail right"></div>
          
          {/* Eyes - Bright glowing blue */}
          <div className="robot-eyes">
            <div className="robot-eye left"></div>
            <div className="robot-eye right"></div>
          </div>
        </div>
        
        {/* Body - Plump rounded egg shape */}
        <div className="robot-body">
          {/* D-shape chest panel */}
          <div className="robot-chest-panel"></div>
        </div>

        {/* Legs - Dark blue boots */}
        <div className="robot-legs">
          <div className="robot-leg left"></div>
          <div className="robot-leg right"></div>
        </div>
      </div>

      {speechBubble && (
        <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 w-64 animate-fade-in z-50">
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 px-5 py-4 text-sm font-medium text-white shadow-lg transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <span>{speechBubble}</span>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-4 w-4 rotate-45 rounded-sm bg-gradient-to-br from-blue-500 to-green-500" />
        </div>
      )}

      {headline && (
        <div className="mt-6 text-center animate-fade-in">
          <h3 className="text-lg font-semibold text-slate-900">{headline}</h3>
          {subline && <p className="text-sm text-slate-600 mt-1">{subline}</p>}
        </div>
      )}
    </div>
  );
};

export default AnimatedMascot;


