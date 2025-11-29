import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { leaderboardService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { UserStatisticsDTO } from '../types';

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
  entries: propEntries,
  title = 'Bảng Xếp Hạng'
}) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(propEntries || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (propEntries && propEntries.length > 0) {
      setEntries(propEntries);
      return;
    }

    let isMounted = true;

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: UserStatisticsDTO[] = await leaderboardService.getTopUsersByXp();
        if (!isMounted) return;

        const mapped: LeaderboardEntry[] = data
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 5)
          .map((u, index) => ({
            id: u.userId,
            name: u.fullName || u.username,
            xp: u.xp,
            rank: index + 1,
            highlight: user?.id === u.userId
          }));

        setEntries(mapped);
      } catch (err) {
        console.error('Không thể tải bảng xếp hạng', err);
        if (isMounted) setError('Không thể tải bảng xếp hạng');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [propEntries, user?.id]);
  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading && !entries) {
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
        <p className="text-sm text-slate-500">Đang tải bảng xếp hạng...</p>
      </motion.div>
    );
  }

  if (error && !entries) {
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
        </div>
        <p className="text-sm text-red-500">{error}</p>
      </motion.div>
    );
  }

  if (!entries || entries.length === 0) {
    return null;
  }

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

      <div className="space-y-3">
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

