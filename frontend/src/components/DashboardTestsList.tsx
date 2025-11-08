import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TestSummary } from '../types';

interface DashboardTestsListProps {
  tests: TestSummary[];
  loading?: boolean;
  maxItems?: number;
}

const DashboardTestsList: React.FC<DashboardTestsListProps> = ({
  tests = [],
  loading = false,
  maxItems = 5
}) => {
  const displayedTests = tests.slice(0, maxItems);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">Chưa có bài kiểm tra nào</p>
      </div>
    );
  }

  const getLevelColor = (level: number) => {
    if (level === 1) return 'from-green-400 to-emerald-500';
    if (level === 2) return 'from-yellow-400 to-amber-500';
    return 'from-red-400 to-rose-500';
  };

  const getLevelText = (level: number) => {
    if (level === 1) return 'Dễ';
    if (level === 2) return 'Trung bình';
    return 'Khó';
  };

  return (
    <div className="space-y-3">
      {displayedTests.map((test, index) => {
        const cleanName = (() => {
          const i = Math.max(test.name.lastIndexOf(':'), test.name.lastIndexOf('-'));
          return i >= 0 ? test.name.slice(i + 1).trim() : test.name;
        })();

        return (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <Link to={`/tests/${test.id}`}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-white to-red-50 border border-red-200 hover:border-red-300 hover:shadow-md transition-all duration-300 group">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getLevelColor(test.level)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  ✓
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-red-600 transition-colors">
                    {cleanName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      test.level === 1
                        ? 'bg-green-100 text-green-700'
                        : test.level === 2
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {getLevelText(test.level)}
                    </span>
                    <span className="text-xs text-slate-500">• Kiểm tra</span>
                  </div>
                </div>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                  className="flex-shrink-0"
                >
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </div>
            </Link>
          </motion.div>
        );
      })}
      {tests.length > maxItems && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: maxItems * 0.1 }}
        >
          <Link
            to="/tests"
            className="block text-center py-3 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
          >
            Xem tất cả ({tests.length} bài kiểm tra) →
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardTestsList;

