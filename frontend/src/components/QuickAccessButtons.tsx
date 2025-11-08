import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface QuickAccessButtonProps {
  icon: string;
  label: string;
  description: string;
  to: string;
  gradient: string;
  delay?: number;
}

const QuickAccessButton: React.FC<QuickAccessButtonProps> = ({
  icon,
  label,
  description,
  to,
  gradient,
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link to={to}>
        <motion.div
          className={`relative rounded-2xl p-5 bg-gradient-to-br ${gradient} border border-white/20 shadow-lg overflow-hidden group cursor-pointer`}
          whileHover={{ scale: 1.05, y: -4 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'linear'
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                {icon}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white mb-1">{label}</h4>
                <p className="text-sm text-white/80">{description}</p>
              </div>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const QuickAccessButtons: React.FC = () => {
  const buttons: Omit<QuickAccessButtonProps, 'delay'>[] = [
    {
      icon: '🎤',
      label: 'Luyện Phát âm',
      description: 'Cải thiện phát âm',
      to: '/pronunciation',
      gradient: 'from-purple-500 via-pink-500 to-rose-500'
    },
    {
      icon: '🤖',
      label: 'Chatbot AI',
      description: 'Trò chuyện thông minh',
      to: '/chatbot',
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500'
    },
    {
      icon: '🌐',
      label: 'Dịch nhanh',
      description: 'Dịch tức thì',
      to: '/translate',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">⚡</span>
        Lối đi Nhanh
      </h3>
      {buttons.map((button, index) => (
        <QuickAccessButton
          key={button.to}
          {...button}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default QuickAccessButtons;

