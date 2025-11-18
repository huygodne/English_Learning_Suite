import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type RewardType = 'xp' | 'badge';

interface RewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  rewardType: RewardType;
  amount?: number;
  badgeName?: string;
  message?: string;
}

const RewardPopup: React.FC<RewardPopupProps> = ({
  isOpen,
  onClose,
  rewardType,
  amount,
  badgeName,
  message,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(onClose, 4200);
    return () => clearTimeout(timeout);
  }, [isOpen, onClose]);

  const isXP = rewardType === 'xp';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 20 } }}
            exit={{ scale: 0.8, opacity: 0, y: -20, transition: { duration: 0.2 } }}
            className="relative w-[min(90vw,420px)] rounded-3xl bg-white shadow-[0_25px_80px_-20px_rgba(30,64,175,0.45)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/15 via-indigo-500/10 to-secondary-400/15" />
            <div className="absolute -top-28 -right-24 w-64 h-64 bg-gradient-to-br from-secondary-400/30 to-primary-500/40 rounded-full blur-3xl" />
            <div className="relative px-8 pt-8 pb-10 flex flex-col items-center text-center gap-4">
              <motion.div
                initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1, transition: { delay: 0.12, type: 'spring', stiffness: 280 } }}
                className={`w-20 h-20 rounded-3xl shadow-lg flex items-center justify-center text-3xl ${
                  isXP ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white' : 'bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 text-white'
                }`}
              >
                {isXP ? '★' : '🏅'}
              </motion.div>
              <motion.h3
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.18, duration: 0.4 } }}
                className="text-2xl font-bold text-slate-900"
              >
                {isXP ? 'Bạn vừa nhận được XP!' : 'Bạn vừa mở khóa huy hiệu mới!'}
              </motion.h3>
              <motion.p
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1, transition: { delay: 0.26, duration: 0.35 } }}
                className="text-lg font-semibold text-primary-600"
              >
                {isXP ? `+${amount ?? 0} XP` : badgeName ?? 'Huy hiệu đặc biệt'}
              </motion.p>
              {(message || !isXP) && (
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.34, duration: 0.35 } }}
                  className="text-sm text-slate-500 max-w-xs"
                >
                  {message ?? 'Tiếp tục hoàn thành nhiệm vụ để thu thập thêm huy hiệu nhé!'}
                </motion.p>
              )}
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.42, duration: 0.3 } }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary-500/30"
              >
                Tiếp tục
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export type { RewardType };
export default RewardPopup;





