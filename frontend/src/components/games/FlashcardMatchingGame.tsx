import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Vocabulary } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

type Card = {
  cardId: string;
  pairId: number;
  side: 'word' | 'meaning';
  label: string;
  imageUrl?: string;
  phonetic?: string;
};

export interface FlashcardMatchingGameProps {
  vocabularies: Vocabulary[];
}

const clampPairs = (vocabularies: Vocabulary[]) => {
  if (vocabularies.length <= 6) return vocabularies;
  return vocabularies.slice(0, 6);
};

// Demo data for testing when backend is not available
const DEMO_VOCABULARIES: Vocabulary[] = [
  {
    id: 1,
    wordEnglish: 'Painting a house',
    phoneticSpelling: '/ˈpeɪntɪŋ ə haʊs/',
    vietnameseMeaning: 'Sơn nhà',
    imageUrl: undefined,
  },
  {
    id: 2,
    wordEnglish: 'Department',
    phoneticSpelling: '/dɪˈpɑːrtmənt/',
    vietnameseMeaning: 'Bộ phận, phòng ban',
    imageUrl: undefined,
  },
  {
    id: 3,
    wordEnglish: 'Conference',
    phoneticSpelling: '/ˈkɑːnfərəns/',
    vietnameseMeaning: 'Hội nghị',
    imageUrl: undefined,
  },
  {
    id: 4,
    wordEnglish: 'Post office',
    phoneticSpelling: '/poʊst ˈɔːfɪs/',
    vietnameseMeaning: 'Bưu điện',
    imageUrl: undefined,
  },
  {
    id: 5,
    wordEnglish: 'Delivery time',
    phoneticSpelling: '/dɪˈlɪvəri taɪm/',
    vietnameseMeaning: 'Thời gian giao hàng',
    imageUrl: undefined,
  },
  {
    id: 6,
    wordEnglish: 'One-bedroom apartment',
    phoneticSpelling: '/wʌn ˈbedruːm əˈpɑːrtmənt/',
    vietnameseMeaning: 'Căn hộ một phòng ngủ',
    imageUrl: undefined,
  },
];

const FlashcardMatchingGame: React.FC<FlashcardMatchingGameProps> = ({ vocabularies }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMatchAnimation, setShowMatchAnimation] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Use demo data if vocabularies array is empty
  const effectiveVocabularies = vocabularies.length >= 2 ? vocabularies : DEMO_VOCABULARIES;
  const canPlay = effectiveVocabularies.length >= 2;
  const storageKey = useMemo(() => {
    const id = user?.id ?? 'guest';
    return `els-highscore-flashcard-${id}`;
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
      oscillator.type = 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.18;
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.start(now);
      oscillator.stop(now + duration);
    },
    [getAudioContext, soundEnabled]
  );

  const playSuccess = useCallback(() => playTone(820, 0.3), [playTone]);
  const playError = useCallback(() => playTone(220, 0.35), [playTone]);
  const playStart = useCallback(() => playTone(560, 0.2), [playTone]);

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

  const generateCards = useMemo<Card[]>(() => {
    const selected = clampPairs(effectiveVocabularies);
    const deck: Card[] = selected.flatMap((vocab) => [
      {
        cardId: `${vocab.id}-word`,
        pairId: vocab.id,
        side: 'word',
        label: vocab.wordEnglish,
        phonetic: vocab.phoneticSpelling,
      },
      {
        cardId: `${vocab.id}-meaning`,
        pairId: vocab.id,
        side: 'meaning',
        label: vocab.vietnameseMeaning,
        imageUrl: vocab.imageUrl,
      },
    ]);
    return deck.sort(() => Math.random() - 0.5);
  }, [effectiveVocabularies]);

  useEffect(() => {
    setCards(generateCards);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setMoves(0);
    setScore(0);
    setSeconds(0);
    setActive(false);
    setCompleted(false);
    setShowMatchAnimation(null);
  }, [generateCards]);

  useEffect(() => {
    if (!active || completed) return;
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [active, completed]);

  useEffect(() => {
    if (matchedPairs.size === cards.length / 2 && cards.length > 0) {
      setCompleted(true);
      setActive(false);
    }
  }, [matchedPairs, cards]);

  useEffect(() => {
    if (completed) {
      updateBestScore(score);
    }
  }, [completed, score, updateBestScore]);

  const handleCardClick = (card: Card) => {
    if (!active || completed) return;
    if (selectedCards.includes(card.cardId)) return;
    if (matchedPairs.has(card.pairId)) return;
    if (selectedCards.length >= 2) return;

    const newSelected = [...selectedCards, card.cardId];
    setSelectedCards(newSelected);
    
    if (newSelected.length === 2) {
      const first = cards.find((c) => c.cardId === newSelected[0]);
      const second = cards.find((c) => c.cardId === newSelected[1]);
      setMoves((prev) => prev + 1);
      
      if (first && second && first.pairId === second.pairId && first.side !== second.side) {
        setMatchedPairs((prev) => new Set(prev).add(first.pairId));
        setScore((prev) => prev + 150);
        setShowMatchAnimation(first.pairId);
        playSuccess();
        setTimeout(() => {
          setShowMatchAnimation(null);
          setSelectedCards([]);
        }, 800);
      } else {
        setScore((prev) => Math.max(0, prev - 30));
        playError();
        setTimeout(() => {
          setSelectedCards([]);
        }, 1200);
      }
    }
  };

  const handleRestart = () => {
    setCards(generateCards.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setMoves(0);
    setScore(0);
    setSeconds(0);
    setCompleted(false);
    setActive(false);
    setShowMatchAnimation(null);
  };

  const startGame = () => {
    playStart();
    setActive(true);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setMoves(0);
    setScore(0);
    setSeconds(0);
    setCompleted(false);
    setShowMatchAnimation(null);
  };

  const formatScore = (num: number) => {
    return num.toLocaleString('vi-VN');
  };

  const handleQuit = () => {
    setActive(false);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setShowMatchAnimation(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl p-5 flex flex-wrap gap-4 items-center justify-between text-white shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ rotate: 15 }}
                  className="bg-blue-500/20 p-2 rounded-xl"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </motion.div>
                <span className="text-xl font-bold">Ghép thẻ</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent"
              >
                {formatScore(score)}
              </motion.div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-right">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Kỷ lục</p>
                <p className="text-lg font-semibold text-amber-300">{formatScore(bestScore)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSoundEnabled(!soundEnabled)}
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
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleQuit}
                className="p-2.5 hover:bg-red-500/20 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      {!active && (
        <div className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-soft-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-primary-500 font-semibold mb-2">Ghép thẻ</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Thử thách trí nhớ</h3>
            <p className="text-sm text-slate-500">
              Điểm cao nhất:{' '}
              <span className="font-semibold text-primary-600">
                {formatScore(bestScore)}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              disabled={!canPlay}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                canPlay
                  ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white hover:from-primary-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              Bắt đầu ghép thẻ
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-sm font-semibold text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-all"
            >
              Làm mới
            </motion.button>
            {vocabularies.length === 0 && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                ⚠️ Đang dùng dữ liệu demo.
              </span>
            )}
            {!canPlay && vocabularies.length > 0 && (
              <span className="text-sm text-red-500">Cần ít nhất 2 từ vựng để chơi.</span>
            )}
          </div>
        </div>
      )}

      {/* Game Board - Cards hiển thị ngay như ảnh đầu tiên */}
      {active && cards.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl p-6 shadow-2xl border border-white/10"
        >
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {cards
                .filter((card) => !matchedPairs.has(card.pairId))
                .map((card, index) => {
                  const isSelected = selectedCards.includes(card.cardId);
                  const isMatched = matchedPairs.has(card.pairId);
                  const isMatchAnimating = showMatchAnimation === card.pairId;
                  
                  return (
                    <motion.button
                      key={card.cardId}
                      initial={{ scale: 0, opacity: 0, rotate: -180 }}
                      animate={{ 
                        scale: isMatchAnimating ? [1, 1.2, 1] : 1, 
                        opacity: 1, 
                        rotate: 0,
                        y: isMatchAnimating ? [0, -10, 0] : 0,
                      }}
                      exit={{ scale: 0, opacity: 0, rotate: 180 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                      onClick={() => handleCardClick(card)}
                      disabled={isMatched || (selectedCards.length >= 2 && !isSelected)}
                      whileHover={!isMatched && selectedCards.length < 2 ? { scale: 1.05, y: -5 } : {}}
                      whileTap={!isMatched ? { scale: 0.95 } : {}}
                      className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                        isMatched
                          ? 'border-emerald-400 bg-emerald-500/20 opacity-50 cursor-not-allowed'
                          : isSelected
                          ? 'border-blue-400 bg-blue-500/40 scale-105 shadow-2xl shadow-blue-500/60 ring-4 ring-blue-300/50'
                          : 'border-white/30 bg-slate-800/60 hover:border-white/60 hover:bg-slate-700/70'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      style={{ minHeight: '160px' }}
                    >
                      {/* Glow effect when selected */}
                      {isSelected && (
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-xl"
                        />
                      )}
                      
                      {/* Match animation */}
                      {isMatchAnimating && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.5, 0] }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0 bg-gradient-to-br from-emerald-400/50 to-green-400/50 rounded-2xl"
                        />
                      )}

                      <div className="p-4 h-full flex flex-col items-center justify-center text-center text-white relative z-10">
                        {card.imageUrl && card.side === 'meaning' && (
                          <motion.img
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1 }}
                            src={card.imageUrl}
                            alt={card.label}
                            className="w-full h-24 object-cover rounded-xl mb-3 border-2 border-white/20"
                          />
                        )}
                        {card.phonetic && card.side === 'word' && (
                          <p className="text-xs text-white/80 mb-2 italic font-medium">{card.phonetic}</p>
                        )}
                        <p className="font-bold text-sm leading-tight break-words">
                          {card.label}
                        </p>
                        {card.side === 'word' && (
                          <p className="text-xs text-white/60 mt-2 font-medium">(n)</p>
                        )}
                      </div>

                      {/* Ripple effect on click */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 border-4 border-blue-400 rounded-2xl"
                        />
                      )}
                    </motion.button>
                  );
                })}
            </AnimatePresence>
          </div>

          {/* Stats bar */}
          {active && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-6 flex items-center justify-center gap-6 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Thời gian: {seconds}s</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Lượt: {moves}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">Điểm: {formatScore(score)}</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : !active && cards.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-50 border-2 border-slate-200 shadow-xl">
          <div className="text-6xl mb-4">🧠</div>
          <p className="text-2xl font-bold text-slate-700 mb-3">Sẵn sàng chơi Ghép thẻ?</p>
          <p className="text-base text-slate-500">Nhấn "Bắt đầu ghép thẻ" để bắt đầu game!</p>
        </div>
      ) : null}

      {completed && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 border-2 border-emerald-200 text-emerald-900 shadow-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className="text-4xl mb-4 text-center"
          >
            🎉
          </motion.div>
          <p className="font-bold text-2xl mb-3 text-center">Xuất sắc! Bạn đã ghép xong toàn bộ thẻ.</p>
          <div className="flex items-center justify-center gap-6 mb-6 text-center">
            <div>
              <p className="text-sm text-emerald-700 mb-1">Thời gian</p>
              <p className="font-bold text-xl">{seconds}s</p>
            </div>
            <div className="w-px h-12 bg-emerald-300"></div>
            <div>
              <p className="text-sm text-emerald-700 mb-1">Lượt lật</p>
              <p className="font-bold text-xl">{moves}</p>
            </div>
            <div className="w-px h-12 bg-emerald-300"></div>
            <div>
              <p className="text-sm text-emerald-700 mb-1">Điểm</p>
              <p className="font-bold text-xl">{formatScore(score)}</p>
              <p className="text-xs text-emerald-600 mt-1">Kỷ lục: {formatScore(bestScore)}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold hover:from-emerald-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
          >
            Chơi lại
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default FlashcardMatchingGame;
