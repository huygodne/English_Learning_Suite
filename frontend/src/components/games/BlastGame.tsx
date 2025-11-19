import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Vocabulary } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface BlastGameProps {
  vocabularies: Vocabulary[];
}

type Question = {
  id: number;
  word: string;
  phonetic?: string;
  meaning: string;
  imageUrl?: string;
};

type Option = {
  id: number;
  label: string;
  meaning: string;
  imageUrl?: string;
  phonetic?: string;
  x: number;
  y: number;
};

type LaserShot = {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: 'green' | 'red';
  active: boolean;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
};

const pickQuestions = (vocabularies: Vocabulary[]): Question[] => {
  const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 12).map((vocab) => ({
    id: vocab.id,
    word: vocab.wordEnglish,
    phonetic: vocab.phoneticSpelling,
    meaning: vocab.vietnameseMeaning,
    imageUrl: vocab.imageUrl,
  }));
};

// Demo data
const DEMO_VOCABULARIES_BLAST: Vocabulary[] = [
  { id: 1, wordEnglish: 'Thank you', phoneticSpelling: '/θæŋk ju:/', vietnameseMeaning: 'Cảm ơn' },
  { id: 2, wordEnglish: 'Hello', phoneticSpelling: '/həˈloʊ/', vietnameseMeaning: 'Xin chào' },
  { id: 3, wordEnglish: "You're welcome", phoneticSpelling: '/jʊr ˈwelkəm/', vietnameseMeaning: 'Không có gì' },
  { id: 4, wordEnglish: 'Goodbye', phoneticSpelling: '/ɡʊdˈbaɪ/', vietnameseMeaning: 'Tạm biệt' },
  { id: 5, wordEnglish: 'Post office', phoneticSpelling: '/poʊst ˈɔːfɪs/', vietnameseMeaning: 'Bưu điện' },
  { id: 6, wordEnglish: 'Sweeping a walkway', phoneticSpelling: '/ˈswiːpɪŋ ə ˈwɔːkweɪ/', vietnameseMeaning: 'Quét lối đi' },
];

const BlastGame: React.FC<BlastGameProps> = ({ vocabularies }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [active, setActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [laserShots, setLaserShots] = useState<LaserShot[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showFeedback, setShowFeedback] = useState<{ type: 'correct' | 'wrong'; show: boolean }>({ type: 'correct', show: false });
  const [isLoading, setIsLoading] = useState(false);
  const [questionTransition, setQuestionTransition] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gunRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [optionDynamics, setOptionDynamics] = useState<Record<number, { x: number; y: number; vx: number; vy: number }>>({});
  const [bestScore, setBestScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const effectiveVocabularies = vocabularies.length >= 4 ? vocabularies : DEMO_VOCABULARIES_BLAST;
  const canPlay = effectiveVocabularies.length >= 4;
  const optionColors = ['#38bdf8', '#f97316', '#a3e635', '#f472b6'];
  const storageKey = useMemo(() => {
    const id = user?.id ?? 'guest';
    return `els-highscore-blast-${id}`;
  }, [user?.id]);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, duration = 0.25) => {
      if (!soundEnabled) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.2;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [getAudioContext, soundEnabled]
  );

  const playSuccess = useCallback(() => playTone(900, 0.25), [playTone]);
  const playError = useCallback(() => playTone(200, 0.4), [playTone]);
  const playStart = useCallback(() => playTone(520, 0.3), [playTone]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem(storageKey);
    setBestScore(saved ? parseInt(saved, 10) || 0 : 0);
  }, [storageKey]);

  const updateBestScore = useCallback(
    (latestScore: number) => {
      setBestScore((prev) => {
        if (latestScore > prev) {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(storageKey, String(latestScore));
          }
          return latestScore;
        }
        return prev;
      });
    },
    [storageKey]
  );

  const startGame = () => {
    playStart();
    setIsLoading(true);
    setTimeout(() => {
      const newQuestions = pickQuestions(effectiveVocabularies);
      setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setActive(true);
      setLaserShots([]);
      setParticles([]);
      setShowFeedback({ type: 'correct', show: false });
      setIsLoading(false);
    }, 500);
  };

  const stopGame = () => {
    setActive(false);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(60);
    setLaserShots([]);
    setParticles([]);
    setShowFeedback({ type: 'correct', show: false });
  };

  useEffect(() => {
    if (!active) return;
    if (timeLeft <= 0) {
      setActive(false);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [active, timeLeft]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (!active && questions.length > 0 && !isLoading) {
      updateBestScore(score);
    }
  }, [active, questions.length, isLoading, score, updateBestScore]);

  // Generate floating options with better positioning
  const options = useMemo<Option[]>(() => {
    if (!currentQuestion) return [];
    const remaining = effectiveVocabularies.filter((v) => v.id !== currentQuestion.id);
    const distractors = remaining.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions: Option[] = [
      {
        id: currentQuestion.id,
        label: currentQuestion.word,
        meaning: currentQuestion.meaning,
        imageUrl: currentQuestion.imageUrl,
        phonetic: currentQuestion.phonetic,
        x: 0,
        y: 0,
      },
      ...distractors.map((v) => ({
        id: v.id,
        label: v.wordEnglish,
        meaning: v.vietnameseMeaning,
        imageUrl: v.imageUrl,
        phonetic: v.phoneticSpelling,
        x: 0,
        y: 0,
      })),
    ];

    // Better positioning - spread across screen
    const positions = [
      { x: 20, y: 45 },
      { x: 42, y: 35 },
      { x: 64, y: 42 },
      { x: 82, y: 32 },
    ];

    return allOptions.map((opt, index) => ({
      ...opt,
      x: positions[index]?.x || 20 + (index * 25),
      y: positions[index]?.y || 30 + Math.random() * 10,
    }));
  }, [currentQuestion, effectiveVocabularies]);

  // Track mouse position for gun rotation
  useEffect(() => {
    if (!active || !gameAreaRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gameAreaRef.current || !gunRef.current) return;
      const rect = gameAreaRef.current.getBoundingClientRect();
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setMousePosition({ x: mouseX, y: mouseY });
    };

    gameAreaRef.current.addEventListener('mousemove', handleMouseMove);
    return () => {
      gameAreaRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [active]);

  // Calculate gun rotation angle
  const gunAngle = useMemo(() => {
    if (!gunRef.current || !gameAreaRef.current) return 0;
    const gunRect = gunRef.current.getBoundingClientRect();
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    
    const gunCenterX = gunRect.left + gunRect.width / 2 - gameRect.left;
    const gunCenterY = gunRect.top + gunRect.height / 2 - gameRect.top;
    
    const dx = mousePosition.x - gunCenterX;
    const dy = mousePosition.y - gunCenterY;
    
    return Math.atan2(dy, dx) * (180 / Math.PI);
  }, [mousePosition]);

  // Initialize option dynamics when question changes
  useEffect(() => {
    if (!currentQuestion || !options.length) return;
    const initial: Record<number, { x: number; y: number; vx: number; vy: number }> = {};
    options.forEach((opt, index) => {
      const rawSpeed = Math.random() * 0.05+0.05;
      const baseSpeed = (rawSpeed);
      initial[opt.id] = {
        x: opt.x,
        y: opt.y,
        vx: baseSpeed * (index % 2 === 0 ? 1 : -1),
        vy: baseSpeed * (index % 2 === 0 ? -1 : 1),
      };
    });
    setOptionDynamics(initial);
  }, [currentQuestion, options]);

  // Animate option bouncing
  useEffect(() => {
    if (!active || !options.length) return;

    const animate = () => {
      setOptionDynamics((prev) => {
        const nextState: typeof prev = { ...prev };
        options.forEach((opt) => {
          const dyn = prev[opt.id];
          if (!dyn) return;
          let newX = dyn.x + dyn.vx;
          let newY = dyn.y + dyn.vy;

          if (newX < 10 || newX > 90) {
            dyn.vx = -dyn.vx;
            newX = Math.max(10, Math.min(90, newX));
          }
          if (newY < 25 || newY > 70) {
            dyn.vy = -dyn.vy;
            newY = Math.max(25, Math.min(70, newY));
          }

          nextState[opt.id] = { ...dyn, x: newX, y: newY };
        });
        return nextState;
      });
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, options]);

  // Particle animation
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            life: p.life - 1,
            vy: p.vy + 0.2, // gravity
          }))
          .filter((p) => p.life > 0 && p.y < 1000);
        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particles.length]);

  const createParticles = (x: number, y: number, color: string) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10 - 3,
        color,
        life: 40 + Math.random() * 30,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);
  };

  const handleOptionClick = (option: Option) => {
    if (!active || !currentQuestion || laserShots.some(s => s.active) || questionTransition) return;
    
    if (!gunRef.current || !gameAreaRef.current) return;
    
    const gunRect = gunRef.current.getBoundingClientRect();
    const gameRect = gameAreaRef.current.getBoundingClientRect();
    
    const gunCenterX = gunRect.left + gunRect.width / 2 - gameRect.left;
    const gunCenterY = gunRect.top + gunRect.height / 2 - gameRect.top;
    
    // Calculate option position
    const dynamicX = optionDynamics[option.id]?.x ?? option.x;
    const dynamicY = optionDynamics[option.id]?.y ?? option.y;

    const optionX = (dynamicX / 100) * gameRect.width;
    const optionY = (dynamicY / 100) * gameRect.height;
    
    const isCorrect = option.id === currentQuestion.id;
    const laserColor = isCorrect ? 'green' : 'red';
    
    // Create laser shot
    const laserId = Date.now();
    setLaserShots(prev => [...prev, {
      id: laserId,
      fromX: gunCenterX,
      fromY: gunCenterY,
      toX: optionX,
      toY: optionY,
      color: laserColor,
      active: true,
    }]);
    
    // Create particles
    createParticles(optionX, optionY, laserColor);
    
    // Show feedback
    setShowFeedback({ type: isCorrect ? 'correct' : 'wrong', show: true });
    setTimeout(() => setShowFeedback({ type: isCorrect ? 'correct' : 'wrong', show: false }), 1500);
    
    // Remove laser after animation
    setTimeout(() => {
      setLaserShots(prev => prev.filter(s => s.id !== laserId));
    }, 1000);
    
    if (isCorrect) {
      playSuccess();
      setScore((prev) => prev + 120 + combo * 20);
      setCombo((prev) => prev + 1);
      setQuestionTransition(true);
      setTimeout(() => {
      if (currentIndex === questions.length - 1) {
        setActive(false);
          setQuestionTransition(false);
      } else {
        setCurrentIndex((prev) => prev + 1);
          setTimeout(() => setQuestionTransition(false), 300);
      }
      }, 1200);
    } else {
      playError();
      setCombo(0);
      setScore((prev) => Math.max(0, prev - 60));
      setQuestionTransition(true);
      setTimeout(() => {
        if (currentIndex === questions.length - 1) {
          setActive(false);
          setQuestionTransition(false);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setTimeout(() => setQuestionTransition(false), 300);
        }
      }, 1800);
    }
  };

  const progress = questions.length ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {!active && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-indigo-500 font-semibold mb-2">Blast</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Bắn hạ từ vựng</h3>
            <p className="text-sm text-slate-500">
              Điểm cao nhất: <span className="font-semibold text-indigo-600">{bestScore.toLocaleString('vi-VN')}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              disabled={!canPlay}
              className={`px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-lg ${
                canPlay 
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 hover:shadow-2xl transform hover:scale-105' 
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Bắt đầu Blast
              </span>
            </motion.button>
            {vocabularies.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200"
              >
                ⚠️ Đang dùng dữ liệu demo.
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center p-12"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"
            />
            <p className="text-slate-600 font-medium">Đang chuẩn bị game...</p>
          </div>
        </motion.div>
      )}

      {active && currentQuestion && (
        <motion.div
          ref={gameAreaRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #1e1b4b 100%)',
            minHeight: '750px',
            position: 'relative',
          }}
        >
          {/* Sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-200" />

          {/* Mountain layers */}
          <div className="absolute inset-x-0 top-16 h-72">
            <div
              className="absolute inset-x-0 h-full bg-gradient-to-r from-slate-200 to-slate-100 opacity-80"
              style={{ clipPath: 'polygon(0% 80%, 15% 55%, 30% 70%, 50% 40%, 70% 75%, 85% 50%, 100% 78%, 100% 100%, 0% 100%)' }}
            />
            <div
              className="absolute inset-x-0 h-full bg-gradient-to-r from-slate-300 to-slate-200 opacity-70"
              style={{ clipPath: 'polygon(0% 85%, 10% 60%, 28% 68%, 45% 45%, 65% 70%, 80% 50%, 100% 85%, 100% 100%, 0% 100%)' }}
            />
            <div
              className="absolute inset-x-0 h-full bg-gradient-to-r from-slate-400 to-slate-200 opacity-60"
              style={{ clipPath: 'polygon(0% 90%, 12% 65%, 32% 65%, 55% 50%, 75% 65%, 90% 55%, 100% 90%, 100% 100%, 0% 100%)' }}
            />
          </div>

          {/* Rolling hills */}
          <div className="absolute bottom-24 inset-x-0 h-40 bg-gradient-to-r from-emerald-400 to-lime-400 rounded-t-[45%]" />
          <div className="absolute bottom-10 inset-x-0 h-40 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-t-[50%]" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-r from-lime-600 to-emerald-600" />

          {/* Floating coins */}
          {[...Array(6)].map((_, idx) => (
            <motion.div
              key={`coin-${idx}`}
              className="absolute flex items-center justify-center w-12 h-12 rounded-full border-2 border-yellow-200 bg-gradient-to-br from-yellow-200 to-yellow-400 text-yellow-900 font-black shadow-lg"
              style={{
                left: `${15 + idx * 14}%`,
                bottom: `${80 + (idx % 2 ? 20 : 0)}px`,
              }}
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3 + idx, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
            >
              $
            </motion.div>
          ))}

          {/* Top Bar */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md px-6 py-4 flex items-center justify-between text-white border-b border-white/10 shadow-lg"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="bg-indigo-500/20 p-2 rounded-xl">
                <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Blast</span>
              <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <div className="text-sm text-white/90 font-medium bg-slate-700/50 px-4 py-1.5 rounded-lg">
              LESSON 1 (Camp Bomb Listening)
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSoundEnabled((prev) => !prev)}
                className="p-2.5 hover:bg-white/10 rounded-xl transition-colors"
              >
                {soundEnabled ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.707a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.707a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    <path d="M3.28 2.22a.75.75 0 00-1.06 1.06l14.5 14.5a.75.75 0 101.06-1.06L3.28 2.22z" />
                  </svg>
                )}
              </motion.button>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
                Kỷ lục: {bestScore.toLocaleString('vi-VN')}
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={stopGame}
                className="p-2.5 hover:bg-red-500/20 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute top-20 left-0 right-0 z-15 h-1 bg-slate-800/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            />
          </div>

          {/* Main Title Banner */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ y: -20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="absolute top-24 left-0 right-0 z-10 bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-slate-800/95 backdrop-blur-md py-10 border-y border-white/10"
            >
              <h2 className="text-6xl font-black text-white text-center drop-shadow-2xl mb-2">
                {currentQuestion.word}
              </h2>
              {currentQuestion.phonetic && (
                <p className="text-white/90 text-center mt-3 text-xl font-medium tracking-wide">{currentQuestion.phonetic}</p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Feedback Message */}
          <AnimatePresence>
            {showFeedback.show && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 px-10 py-6 rounded-3xl text-4xl font-black text-white shadow-2xl ${
                  showFeedback.type === 'correct' 
                    ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-green-500' 
                    : 'bg-gradient-to-r from-red-500 via-rose-500 to-red-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  {showFeedback.type === 'correct' ? (
                    <>
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 0.5 }}
                      >
                        ✓
                      </motion.span>
                      <span>Đúng!</span>
                    </>
                  ) : (
                    <>
                      <span>✗</span>
                      <span>Sai!</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Options */}
          <AnimatePresence>
            {!questionTransition && options.map((option, index) => (
              <motion.button
                key={`${option.id}-${currentIndex}`}
                initial={{ scale: 0, opacity: 0, y: 100, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, y: -100, rotate: 180 }}
                transition={{ 
                  delay: index * 0.15, 
                  type: 'spring', 
                  stiffness: 200,
                  damping: 15,
                }}
                onClick={() => handleOptionClick(option)}
                className="absolute z-10 group"
                style={{
                  left: `${optionDynamics[option.id]?.x ?? option.x}%`,
                  top: `${optionDynamics[option.id]?.y ?? option.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  className="relative w-28 h-28 flex flex-col items-center justify-center text-white font-black text-xl shadow-xl"
                  style={{
                    clipPath: 'polygon(50% 0%, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%)',
                    background: optionColors[index % optionColors.length],
                    border: '4px solid rgba(255,255,255,0.5)',
                  }}
                  animate={{
                    y: [0, -25, 15, -10, 0],
                    x: [0, 15, -10, 10, 0],
                    rotate: [0, 5, -3, 2, 0],
                  }}
                  transition={{
                    duration: 6 + index,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                >
                  <p className="text-base font-black text-center px-2">{option.meaning}</p>
                  <p className="text-xs font-semibold opacity-80 text-center px-2 mt-1">{option.phonetic || option.label}</p>
                </motion.div>
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Laser Shots */}
          {laserShots.map((laser) => (
            <svg
              key={laser.id}
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-30"
            >
              <defs>
                <linearGradient id={`laserGradient-${laser.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={laser.color === 'green' ? '#10b981' : '#ef4444'} stopOpacity="1" />
                  <stop offset="50%" stopColor={laser.color === 'green' ? '#34d399' : '#f87171'} stopOpacity="0.9" />
                  <stop offset="100%" stopColor={laser.color === 'green' ? '#10b981' : '#ef4444'} stopOpacity="1" />
                </linearGradient>
                <filter id={`glow-${laser.id}`}>
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <line
                x1={laser.fromX}
                y1={laser.fromY}
                x2={laser.toX}
                y2={laser.toY}
                stroke={`url(#laserGradient-${laser.id})`}
                strokeWidth="8"
                strokeLinecap="round"
                filter={`url(#glow-${laser.id})`}
                style={{
                  filter: `drop-shadow(0 0 16px ${laser.color === 'green' ? '#10b981' : '#ef4444'})`,
                }}
              />
              <motion.circle
                cx={laser.toX}
                cy={laser.toY}
                r="16"
                fill={laser.color === 'green' ? '#10b981' : '#ef4444'}
                animate={{ r: [16, 24, 16] }}
                transition={{ duration: 0.5, repeat: 2 }}
                style={{
                  filter: `drop-shadow(0 0 20px ${laser.color === 'green' ? '#10b981' : '#ef4444'})`,
                }}
              />
            </svg>
          ))}

          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2.5 h-2.5 rounded-full pointer-events-none z-25"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                backgroundColor: particle.color === 'green' ? '#10b981' : '#ef4444',
                opacity: particle.life / 70,
                boxShadow: `0 0 ${particle.life / 3}px ${particle.color === 'green' ? '#10b981' : '#ef4444'}`,
              }}
              animate={{
                scale: [1, 1.5, 0],
                opacity: [1, 0.5, 0],
              }}
              transition={{
                duration: particle.life / 60,
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Gun at bottom center */}
          <motion.div
            ref={gunRef}
            className="absolute bottom-4 left-1/2 z-20"
            style={{
              transform: `translate(-50%, 0) rotate(${gunAngle}deg)`,
              transformOrigin: 'center 65%',
            }}
            animate={{ y: [0, -1.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="relative w-40 h-44">
              {/* Tank barrel */}
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-t-full"
                style={{
                  bottom: '115px',
                  width: '24px',
                  height: '70px',
                  background: 'linear-gradient(180deg, #ffe08a 0%, #e4a937 80%)',
                  border: '3px solid #c17b1f',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.25)',
                }}
              />
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  bottom: '190px',
                  width: '30px',
                  height: '16px',
                  background: '#ffd36b',
                  border: '2px solid #c17b1f',
                }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />

              {/* Turret */}
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full"
                style={{
                  bottom: '90px',
                  width: '120px',
                  height: '60px',
                  background: 'linear-gradient(180deg, #f4b741 0%, #c07c24 90%)',
                  border: '5px solid #7a4b11',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                }}
              >
                <div className="text-white text-xl font-black">★</div>
              </div>

              {/* Tank body */}
              <div
                className="absolute left-1/2 -translate-x-1/2 rounded-[45px]"
                style={{
                  bottom: '40px',
                  width: '150px',
                  height: '70px',
                  background: 'linear-gradient(180deg, #a2b152 0%, #5c742d 90%)',
                  border: '5px solid #3f4c23',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
                }}
              />

              {/* Track base */}
              <div
                className="absolute left-1/2 -translate-x-1/2 flex items-center justify-around px-3 rounded-[35px]"
                style={{
                  bottom: '0px',
                  width: '170px',
                  height: '55px',
                  background: 'linear-gradient(180deg, #1f2937 0%, #0f172a 90%)',
                  border: '5px solid #162316',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.4)',
                }}
              >
                {[0, 1, 2, 3].map((wheel) => (
                  <motion.div
                    key={`wheel-${wheel}`}
                    className="rounded-full border-2 border-slate-900 flex items-center justify-center"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'linear-gradient(180deg, #d1d5db 0%, #6b7280 90%)',
                    }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3 + wheel * 0.3, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-3 h-3 rounded-full bg-amber-200 border border-slate-700" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Score/Timer/Combo at bottom */}
          <div className="absolute bottom-8 left-8 z-20 flex items-center gap-4">
            <motion.div
              animate={{ 
                scale: timeLeft <= 10 ? [1, 1.15, 1] : 1,
                boxShadow: timeLeft <= 10 ? [
                  '0 0 0px rgba(234, 179, 8, 0)',
                  '0 0 30px rgba(234, 179, 8, 0.8)',
                  '0 0 0px rgba(234, 179, 8, 0)',
                ] : '0 0 20px rgba(234, 179, 8, 0.5)',
              }}
              transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-black px-6 py-4 rounded-full font-black text-2xl shadow-2xl border-3 border-yellow-300"
            >
              {timeLeft.toString().padStart(2, '0')}
            </motion.div>
            
            {combo > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 text-white px-5 py-3 rounded-full font-black text-base shadow-xl border-2 border-purple-300"
              >
                COMBO ×{combo}
              </motion.div>
            )}
        </div>

          {/* Score at bottom right */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="absolute bottom-8 right-8 z-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white px-6 py-4 rounded-2xl font-black text-lg shadow-2xl border-2 border-indigo-300"
          >
            <div>Điểm: {score.toLocaleString()}</div>
            <p className="text-xs font-semibold text-indigo-100 mt-1">Kỷ lục: {bestScore.toLocaleString('vi-VN')}</p>
          </motion.div>
        </motion.div>
      )}

      {!active && questions.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 text-center rounded-3xl bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 border-2 border-slate-200 shadow-xl"
        >
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-2xl font-bold text-slate-700 mb-3">Sẵn sàng chơi Blast?</p>
          <p className="text-base text-slate-500">Nhấn "Bắt đầu Blast" để bắt đầu game!</p>
        </motion.div>
      )}

      {!active && questions.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-50 border-2 border-indigo-200 text-indigo-900 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-5xl mb-4 text-center"
          >
            🎯
          </motion.div>
          <p className="font-black text-2xl mb-4 text-center">Kết thúc lượt Blast</p>
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-indigo-700 mb-1 font-semibold">Điểm cuối</p>
              <p className="font-black text-3xl">{score.toLocaleString()}</p>
              <p className="text-xs text-indigo-600 mt-1">Kỷ lục: {bestScore.toLocaleString('vi-VN')}</p>
            </div>
            <div className="w-px h-16 bg-indigo-300"></div>
            <div className="text-center">
              <p className="text-sm text-indigo-700 mb-1 font-semibold">Câu đã luyện</p>
              <p className="font-black text-3xl">{currentIndex + 1}/{questions.length}</p>
            </div>
        </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white text-base font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl"
          >
            Chơi lại
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default BlastGame;
