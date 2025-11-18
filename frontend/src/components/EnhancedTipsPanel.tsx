import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tip {
  id: number;
  type: 'tip' | 'notification';
  title: string;
  content: string;
  icon: string;
  color: string;
}

const EnhancedTipsPanel: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips: Tip[] = [
    {
      id: 1,
      type: 'tip',
      title: 'Mẹo giữ streak',
      content: 'Hoàn thành ít nhất một bài luyện tập mỗi ngày để giữ streak và nhận thêm XP thưởng. Lên lịch nhắc nhở trong ứng dụng để không bỏ lỡ!',
      icon: '🔥',
      color: 'from-red-400 to-orange-500'
    },
    {
      id: 2,
      type: 'tip',
      title: 'Mẹo học tập',
      content: 'Ôn tập từ vựng vào buổi sáng giúp ghi nhớ lâu hơn 40% so với các thời điểm khác trong ngày.',
      icon: '💡',
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 3,
      type: 'notification',
      title: 'Thông báo hệ thống',
      content: 'Bài học mới "Business English" đã được thêm vào. Hãy khám phá ngay!',
      icon: '📢',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      id: 4,
      type: 'tip',
      title: 'Mẹo học tập',
      content: 'Luyện phát âm 15 phút mỗi ngày sẽ cải thiện khả năng nói của bạn đáng kể sau 2 tuần.',
      icon: '🎯',
      color: 'from-emerald-400 to-teal-500'
    },
    {
      id: 5,
      type: 'tip',
      title: 'Thưởng streak',
      content: 'Mỗi 5 ngày streak liên tiếp, bạn sẽ nhận được +50 XP thưởng. Hãy duy trì chuỗi học tập của mình!',
      icon: '⭐',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  const currentTip = tips[currentTipIndex];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [tips.length]);

  return (
    <motion.div
      className="rounded-3xl p-6 bg-white border border-slate-200 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-xl">📬</span>
        Thông báo & Mẹo Vặt
      </h3>

      <div className="relative h-48 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTip.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 rounded-2xl p-5 bg-gradient-to-br ${currentTip.color} text-white`}
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{currentTip.icon}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">
                  {currentTip.title}
                </p>
                <p className="text-sm leading-relaxed">{currentTip.content}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-2 mt-4">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTipIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentTipIndex
                ? 'bg-primary-600 w-6'
                : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedTipsPanel;

