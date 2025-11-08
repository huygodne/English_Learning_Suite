import React from 'react';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  id: number;
  name: string;
  xp: number;
  rank: number;
  avatar?: string;
  highlight?: boolean;
}

interface EnhancedLeaderboardProps {
  entries?: LeaderboardEntry[];
  title?: string;
}

const EnhancedLeaderboard: React.FC<EnhancedLeaderboardProps> = ({
  entries = [
    { id: 1, name: 'Bạn', xp: 4280, rank: 1, avatar: '🧑‍🎓', highlight: true },
    { id: 2, name: 'Minh Anh', xp: 3990, rank: 2, avatar: '🦉' },
    { id: 3, name: 'Lan Chi', xp: 3625, rank: 3, avatar: '🌟' },
    { id: 4, name: 'Hoàng Dũng', xp: 3310, rank: 4, avatar: '🚀' },
    { id: 5, name: 'Quỳnh Mai', xp: 2980, rank: 5, avatar: '🎧' }
  ],
  title = 'Bảng Xếp Hạng'
}) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <motion.div
      className="rounded-3xl p-6 bg-white border border-slate-200 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span className="text-xl">🏆</span>
          {title}
        </h3>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          Tuần này
        </span>
      </div>

      <p className="text-sm text-slate-500 mb-4">Top 5 người dùng có XP cao nhất</p>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
              entry.highlight
                ? 'bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200 shadow-md'
                : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100 hover:shadow-md'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ 
              scale: entry.highlight ? 1 : 1.02,
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
            }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-500 text-white font-bold text-sm">
                {getRankIcon(entry.rank)}
              </div>
              <div className="flex items-center gap-2">
                {entry.avatar && (
                  <span className="text-2xl">{entry.avatar}</span>
                )}
                <div>
                  <p className={`text-sm font-semibold ${entry.highlight ? 'text-primary-700' : 'text-slate-900'}`}>
                    {entry.name}
                  </p>
                  <p className="text-xs text-slate-500">{entry.xp.toLocaleString()} XP</p>
                </div>
              </div>
            </div>
            {entry.highlight && (
              <span className="text-xs font-semibold text-primary-600 bg-primary-100 px-2 py-1 rounded-full">
                Bạn
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EnhancedLeaderboard;

