import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FlipCard = ({ frontContent, backContent, className = '' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleToggle = () => {
    setIsFlipped((prev) => !prev);
  };

  return (
    <div
      className={`w-72 h-48 perspective cursor-pointer select-none ${className}`}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleToggle();
        }
      }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-500 via-indigo-500 to-secondary-400 shadow-xl flex flex-col justify-between px-5 py-6 text-white backface-hidden">
          {frontContent}
        </div>

        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-purple-500 to-primary-500 shadow-xl flex flex-col justify-between px-5 py-6 text-white backface-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;

