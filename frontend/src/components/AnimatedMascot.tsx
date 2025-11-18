import React, { useMemo, useState, useEffect } from 'react';

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
  coveringEyes?: boolean;
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
  coveringEyes = false,
}) => {
  const preset = useMemo(() => MOOD_PRESETS[mood] ?? MOOD_PRESETS.idle, [mood]);
  const speechBubble = bubbleText === null ? null : bubbleText ?? DEFAULT_BUBBLE[mood];
  const scale = size === 'lg' ? 1 : 0.75;
  
  // Use state with stable initialization to ensure consistency
  const [handCoverMode, setHandCoverMode] = useState<'none' | 'one' | 'two'>('none');
  
  useEffect(() => {
    setHandCoverMode(coveringEyes ? 'two' : 'none');
  }, [coveringEyes]);
  
  const robotKey = useMemo(() => `robot-${coveringEyes}-${handCoverMode}`, [coveringEyes, handCoverMode]);
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

        ${!coveringEyes ? `
        .robot-eye {
          animation: eyeBlink 5s cubic-bezier(0.4, 0, 0.2, 1) infinite, eyeGlow 2s ease-in-out infinite !important;
          animation-play-state: running !important;
        }
        ` : ''}

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

        /* Eyes animation when hands cover */
        ${coveringEyes ? `
        .robot-eye {
          opacity: 1;
          animation: eyeCoveredState 2.2s linear infinite, eyeGlow 2s ease-in-out infinite !important;
          animation-play-state: running !important;
        }
          /* Overlay che mắt từ trên xuống khi chớp */
        .robot-eye::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--dark-blue);
          border-radius: 50%;
          z-index: 3;
          transform-origin: top;
          transform: scaleY(0);
          animation: blinkFromTop 2.2s ease-in-out infinite;
        }
        @keyframes eyeCoveredState {
          /* 0-50%: Tay che - mắt nhắm */
          0%, 49.99% {
            height: 2px;
            border-radius: 50%;
            background: var(--black);
          }
          /* 50%: Tay hạ xuống - mắt mở */
          50%, 100% {
            height: 16px;
            border-radius: 50%;
            background: var(--black);
          }
        }
        @keyframes blinkFromTop {
          /* 0-50%: Tay che - KHÔNG chớp mắt */
          0%, 50% { transform: scaleY(0); }
          /* 50-75%: Tay hạ và đưa lên lại - KHÔNG chớp mắt */
          75% { transform: scaleY(0); }
          /* 75-85%: Sau khi tay đã đưa lên, mới chớp mắt */
          77% { transform: scaleY(1); }
          78% { transform: scaleY(0); }
          80% { transform: scaleY(1); }
          81% { transform: scaleY(0); }
          /* 85-100%: Giữ mở cho đến cuối chu kỳ */
          100% { transform: scaleY(0); }
        }
        ` : ''}

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

        /* Arms - Short stubby rounded, dark blue shoulder, light gray with mitten */
        .robot-arms {
          position: absolute;
          top: 133px;
          left: 50%;
          transform: translateX(-50%);
          width: 224px;
          height: 63px;
          z-index: 1;
        }

        .robot-arm {
          position: absolute;
          width: 22px;
          height: 56px;
        }

        /* Dark blue shoulder joint - small rounded circle */
        .robot-arm::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 25px;
          height: 25px;
          background: var(--dark-blue);
          border-radius: 50%;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Light gray arm with segmentation lines */
        .robot-arm::after {
          content: "";
          position: absolute;
          top: 22px;
          left: 50%;
          transform: translateX(-50%);
          width: 22px;
          height: 42px;
          background: var(--light-gray);
          border-radius: 11px;
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.7),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1),
            0 2px 6px rgba(0, 0, 0, 0.15);
        }

        /* Curved segmentation lines on outer side of arm */
        .robot-arm {
          position: relative;
        }
        .robot-arm.left::after {
          background-image: 
            radial-gradient(ellipse at 120% 30%, rgba(0,0,0,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 120% 70%, rgba(0,0,0,0.1) 0%, transparent 50%),
            var(--light-gray);
        }
        .robot-arm.right::after {
          background-image: 
            radial-gradient(ellipse at -20% 30%, rgba(0,0,0,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at -20% 70%, rgba(0,0,0,0.1) 0%, transparent 50%),
            var(--light-gray);
        }

        /* Mitten hand - simple rounded */
        .robot-hand {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 25px;
          height: 22px;
          background: var(--light-gray);
          border-radius: 13px 13px 10px 10px;
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.7),
            0 2px 4px rgba(0, 0, 0, 0.15);
        }

        .robot-arm.left {
          left: -25px;
          transform: rotate(-12deg);
          transform-origin: top center;
          ${!coveringEyes ? 'animation: armFloat 3s ease-in-out infinite; opacity: 1; display: block;' : 'opacity: 0 !important; pointer-events: none; display: none !important;'}
        }

        .robot-arm.right {
          right: -25px;
          transform: rotate(12deg);
          transform-origin: top center;
          ${!coveringEyes ? 'animation: armFloat 3s ease-in-out infinite; opacity: 1; display: block;' : 'opacity: 0 !important; pointer-events: none; display: none !important;'}
        }
        
        ${coveringEyes ? `
        .robot-arms {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
        }
        ` : ''}

        @keyframes armFloat {
          0%, 100% { transform: translateY(0) rotate(var(--arm-rotate, -12deg)); }
          50% { transform: translateY(-2px) rotate(calc(var(--arm-rotate, -12deg) + 2deg)); }
        }

        ${mood === 'happy' && !coveringEyes ? `
        .robot-arm.left {
          animation: armFloat 3s ease-in-out infinite, armWave 0.8s ease infinite !important;
          --arm-rotate: -12deg;
          animation-play-state: running !important;
          will-change: transform;
        }
        .robot-arm.right {
          animation: armFloat 3s ease-in-out infinite, armWave 0.8s ease infinite !important;
          --arm-rotate: 12deg;
          animation-play-state: running !important;
          will-change: transform;
        }
        @keyframes armWave {
          0%, 100% { transform: rotate(var(--arm-rotate)) translateY(0); }
          50% { transform: rotate(calc(var(--arm-rotate) - 10deg)) translateY(-3px); }
        }
        ` : ''}

        /* Covering Hands - TAY ĐƯA LÊN CHE MẮT */
        .robot-covering-hands {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 150px;
          height: 150px;
          z-index: 15;
          pointer-events: none;
          opacity: 1;
          visibility: visible;
        }

        ${coveringEyes ? `
        .robot-covering-hands {
          display: block;
        }
        ` : `
        .robot-covering-hands {
          display: none;
        }
        `}

        .covering-hand {
          position: absolute;
          width: 50px;
          height: 60px;
          background: var(--light-gray);
          border: 2.8px solid rgba(0, 0, 0, 0.1);
          border-radius: 25px 25px 6px 25px;
          box-shadow: 
            0 6px 16px rgba(0, 0, 0, 0.25),
            inset 0 2px 4px rgba(255, 255, 255, 0.6),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1);
          z-index: 15;
          animation-play-state: running !important;
          animation-delay: 0s !important;
          will-change: transform, opacity;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          opacity: 1 !important;
          visibility: visible !important;
        }


        ${handCoverMode === 'one' ? `
        .covering-hand.left {
          left: 0px !important;
          top: 30px !important;
          width: 60px !important;
          height: 70px !important;
          border-radius: 30px 30px 8px 30px;
          transform-origin: bottom center;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
          animation: handMoveUpFromBodyLeft 0.8s ease-out forwards, handPeekMoveLeft 2.5s ease-in-out infinite 0.8s !important;
          animation-play-state: running !important;
          animation-fill-mode: both !important;
          animation-delay: 0s, 0.8s !important;
        }
        .covering-hand.right.peek-right {
          display: block !important;
          visibility: visible !important;
          right: 0px !important;
          top: 30px !important;
          width: 60px !important;
          height: 70px !important;
          border-radius: 30px 30px 30px 8px;
          transform-origin: bottom center;
          opacity: 1 !important;
          animation: handMoveUpFromBodyRight 0.8s ease-out forwards, handPeekPeek 2.5s ease-in-out infinite 0.8s !important;
          animation-play-state: running !important;
          animation-fill-mode: both !important;
          animation-delay: 0s, 0.8s !important;
        }
        ` : handCoverMode === 'two' ? `
        .covering-hand.left {
          left: 10px !important;
          top: 30px !important;
          width: 60px !important;
          height: 70px !important;
          border-radius: 30px 30px 8px 30px;
          transform-origin: bottom center;
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
          animation: handMoveUpFromBodyLeft 0.8s ease-out forwards, handPeekMoveLeft 2.5s ease-in-out infinite 0.8s !important;
          animation-play-state: running !important;
          animation-fill-mode: both !important;
          animation-delay: 0s, 0.8s !important;
        }
        .covering-hand.right {
          display: block !important;
          visibility: visible !important;
          right: 10px !important;
          top: 30px !important;
          width: 60px !important;
          height: 70px !important;
          border-radius: 30px 30px 30px 8px;
          transform-origin: bottom center;
          opacity: 1 !important;
          animation: handMoveUpFromBodyRight 0.8s ease-out forwards, handPeekMoveRight 2.5s ease-in-out infinite 0.8s !important;
          animation-play-state: running !important;
          animation-fill-mode: both !important;
          animation-delay: 0s, 0.8s !important;
        }
        ` : ''}
        @keyframes handMoveUpFromBodyLeft {
          0% {
            opacity: 0;
            transform: translateY(70px) translateX(-40px) rotate(-35deg) scale(0.8);
          }
          40% {
            opacity: 0.7;
            transform: translateY(35px) translateX(-20px) rotate(-5deg) scale(0.9);
          }
          70% {
            opacity: 0.95;
            transform: translateY(12px) translateX(-5px) rotate(10deg) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(18deg) scale(1);
          }
        }
        @keyframes handMoveUpFromBodyRight {
          0% {
            opacity: 0;
            transform: translateY(70px) translateX(40px) rotate(35deg) scale(0.8);
          }
          40% {
            opacity: 0.7;
            transform: translateY(35px) translateX(20px) rotate(5deg) scale(0.9);
          }
          70% {
            opacity: 0.95;
            transform: translateY(12px) translateX(5px) rotate(-10deg) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(0) rotate(-18deg) scale(1);
          }
        }
        /* Tay trái di chuyển lên xuống - hướng vào trong, che hết mắt */
        @keyframes handPeekMoveLeft {
          0% {
            transform: translateY(0) translateX(0) rotate(18deg) scale(1);
            opacity: 1;
          }
          45% {
            transform: translateY(0) translateX(0) rotate(18deg) scale(1);
            opacity: 1;
          }
          49% {
            transform: translateY(0) translateX(0) rotate(18deg) scale(1);
            opacity: 1;
          }
          /* 1.25s: Tay hạ xuống NHANH về vị trí cánh tay */
          50% {
            transform: translateY(75px) translateX(-40px) rotate(-30deg) scale(0.8);
            opacity: 0.9;
          }
          52% {
            transform: translateY(75px) translateX(-40px) rotate(-30deg) scale(0.8);
            opacity: 0.9;
          }
          /* 1.25-1.56s: Tay ở vị trí cánh tay */
          62% {
            transform: translateY(75px) translateX(-40px) rotate(-30deg) scale(0.8);
            opacity: 0.9;
          }
          /* 1.56-2.5s: Tay từ từ đưa lên lại từ thân - hướng vào trong */
          65% {
            transform: translateY(75px) translateX(-40px) rotate(-30deg) scale(0.8);
            opacity: 0.9;
          }
          75% {
            transform: translateY(38px) translateX(-20px) rotate(5deg) scale(0.92);
            opacity: 0.95;
          }
          85% {
            transform: translateY(18px) translateX(-8px) rotate(15deg) scale(0.96);
            opacity: 0.98;
          }
          95% {
            transform: translateY(6px) translateX(-2px) rotate(17deg) scale(0.99);
            opacity: 0.99;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(18deg) scale(1);
            opacity: 1;
          }
        }
        /* Tay phải di chuyển lên xuống - hướng vào trong, che hết mắt */
        @keyframes handPeekMoveRight {
          0% {
            transform: translateY(0) translateX(0) rotate(-18deg) scale(1);
            opacity: 1;
          }
          45% {
            transform: translateY(0) translateX(0) rotate(-18deg) scale(1);
            opacity: 1;
          }
          49% {
            transform: translateY(0) translateX(0) rotate(-18deg) scale(1);
            opacity: 1;
          }
          /* 1.25s: Tay hạ xuống NHANH về vị trí cánh tay */
          50% {
            transform: translateY(75px) translateX(40px) rotate(30deg) scale(0.8);
            opacity: 0.9;
          }
          52% {
            transform: translateY(75px) translateX(40px) rotate(30deg) scale(0.8);
            opacity: 0.9;
          }
          /* 1.25-1.56s: Tay ở vị trí cánh tay */
          62% {
            transform: translateY(75px) translateX(40px) rotate(30deg) scale(0.8);
            opacity: 0.9;
          }
          /* 1.56-2.5s: Tay từ từ đưa lên lại từ thân - hướng vào trong */
          65% {
            transform: translateY(75px) translateX(40px) rotate(30deg) scale(0.8);
            opacity: 0.9;
          }
          75% {
            transform: translateY(38px) translateX(20px) rotate(-5deg) scale(0.92);
            opacity: 0.95;
          }
          85% {
            transform: translateY(18px) translateX(8px) rotate(-15deg) scale(0.96);
            opacity: 0.98;
          }
          95% {
            transform: translateY(6px) translateX(2px) rotate(-17deg) scale(0.99);
            opacity: 0.99;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(-18deg) scale(1);
            opacity: 1;
          }
        }

        /* Animation tay phải XÒE để nhìn trộm - hướng vào trong, che một phần mắt */
        @keyframes handPeekPeek {
          /* 0-1.25s: Tay phải XÒE RA một chút nhưng vẫn hướng vào trong */
          0% {
            transform: translateX(20px) translateY(0) rotate(-20deg) scale(1);
            opacity: 0.6;
          }
          10% {
            transform: translateX(22px) translateY(-2px) rotate(-22deg) scale(1);
            opacity: 0.58;
          }
          20% {
            transform: translateX(20px) translateY(0) rotate(-20deg) scale(1);
            opacity: 0.6;
          }
          30% {
            transform: translateX(18px) translateY(2px) rotate(-18deg) scale(1);
            opacity: 0.62;
          }
          40% {
            transform: translateX(20px) translateY(0) rotate(-20deg) scale(1);
            opacity: 0.6;
          }
          49% {
            transform: translateX(22px) translateY(-2px) rotate(-22deg) scale(1);
            opacity: 0.58;
          }
          /* 1.25s: Tay hạ xuống về vị trí cánh tay */
          50% {
            transform: translateX(25px) translateY(75px) rotate(30deg) scale(0.8);
            opacity: 0.4;
          }
          51% {
            transform: translateX(25px) translateY(75px) rotate(30deg) scale(0.8);
            opacity: 0.4;
          }
          /* 1.25-1.56s: Tay ở vị trí cánh tay */
          62.5% {
            transform: translateX(25px) translateY(75px) rotate(30deg) scale(0.8);
            opacity: 0.4;
          }
          /* 1.56-2.5s: Tay từ từ đưa lên lại từ thân - hướng vào trong */
          63% {
            transform: translateX(25px) translateY(75px) rotate(30deg) scale(0.8);
            opacity: 0.4;
          }
          70% {
            transform: translateX(23px) translateY(38px) rotate(-5deg) scale(0.92);
            opacity: 0.5;
          }
          80% {
            transform: translateX(21px) translateY(18px) rotate(-18deg) scale(0.96);
            opacity: 0.58;
          }
          90% {
            transform: translateX(20px) translateY(6px) rotate(-19deg) scale(0.99);
            opacity: 0.59;
          }
          100% {
            transform: translateX(20px) translateY(0) rotate(-20deg) scale(1);
            opacity: 0.6;
          }
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
          
          {/* Covering Hands - TAY ĐƯA LÊN CHE MẮT */}
          {coveringEyes && handCoverMode !== 'none' && (
            <div 
              className="robot-covering-hands" 
              key={`hands-${handCoverMode}`}
              style={{
                display: 'block',
                visibility: 'visible',
                opacity: 1
              }}
            >
              <div className="covering-hand left"></div>
              {handCoverMode === 'two' && (
                <div className="covering-hand right"></div>
              )}
              {handCoverMode === 'one' && (
                <div className="covering-hand right peek-right"></div>
              )}
            </div>
          )}
        </div>
        
        {/* Body - Plump rounded egg shape */}
        <div className="robot-body">
          {/* D-shape chest panel */}
          <div className="robot-chest-panel"></div>
        </div>
        
        {/* Regular Arms (only show when not covering eyes) */}
        <div className="robot-arms">
          <div className="robot-arm left">
            <div className="robot-hand"></div>
          </div>
          <div className="robot-arm right">
            <div className="robot-hand"></div>
          </div>
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


