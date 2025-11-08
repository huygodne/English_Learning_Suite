import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelProgressCardProps {
  currentLevel: number;
  currentXP: number;
  xpToNextLevel: number;
  onLevelUp?: () => void;
}

const LevelProgressCard: React.FC<LevelProgressCardProps> = ({
  currentLevel = 5,
  currentXP = 1250,
  xpToNextLevel = 2000,
  onLevelUp
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const progress = (currentXP / xpToNextLevel) * 100;
  const canLevelUp = currentXP >= xpToNextLevel;

  const handleLevelUp = () => {
    if (canLevelUp && onLevelUp) {
      // Create particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);

      // Clear particles after animation
      setTimeout(() => setParticles([]), 2000);

      onLevelUp();
    }
  };

  return (
    <motion.div
      className="relative rounded-3xl p-6 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 border border-amber-200/50 shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">⭐</span>
        Tiến độ Cấp độ
      </h3>

      <div className="relative z-10 space-y-4">
        {/* Level Display */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Cấp độ hiện tại</p>
            <p className="text-4xl font-bold text-slate-900">Level {currentLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600">XP</p>
            <p className="text-2xl font-bold text-amber-600">{currentXP.toLocaleString()}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-600">
            <span>{currentXP} XP</span>
            <span>{xpToNextLevel} XP</span>
          </div>
        </div>

        {/* Level Up Button */}
        {canLevelUp && (
          <motion.button
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLevelUp}
          >
            🎉 Level Up!
          </motion.button>
        )}

        {/* Particle Emitter */}
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                zIndex: 20
              }}
              initial={{ opacity: 1, scale: 1, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0,
                y: -100,
                x: (Math.random() - 0.5) * 100
              }}
              transition={{
                duration: 2,
                ease: 'easeOut'
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LevelProgressCard;

