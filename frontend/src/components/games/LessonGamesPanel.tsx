import React, { useState, useEffect } from 'react';
import { Vocabulary } from '../../types';
import FlashcardMatchingGame from './FlashcardMatchingGame';
import BlastGame from './BlastGame';

interface LessonGamesPanelProps {
  vocabularies: Vocabulary[];
  initialGame?: 'flashcard' | 'blast';
}

const games = [
  { id: 'flashcard', label: 'Ghép thẻ', color: 'text-primary-600', accent: 'bg-primary-100' },
  { id: 'blast', label: 'Blast', color: 'text-indigo-600', accent: 'bg-indigo-100' },
] as const;

const LessonGamesPanel: React.FC<LessonGamesPanelProps> = ({ vocabularies, initialGame = 'flashcard' }) => {
  const [activeGame, setActiveGame] = useState<(typeof games)[number]['id']>(initialGame);
  
  // Update active game when initialGame prop changes
  useEffect(() => {
    if (initialGame && ['flashcard', 'blast'].includes(initialGame)) {
      setActiveGame(initialGame);
    }
  }, [initialGame]);

  return (
    <section className="mt-8">
      <div className="rounded-3xl bg-white/95 shadow-soft-xl border border-slate-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase text-primary-500">Mini games</p>
            <h2 className="text-2xl font-bold text-slate-900">Luyện tập tương tác</h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              Luyện trí nhớ và phản xạ ngay với dữ liệu bài học — mọi thứ chạy trên trình duyệt nên vào game tức thì.
            </p>
          </div>
          <div className="inline-flex rounded-2xl bg-slate-50 p-1 border border-slate-200 shadow-inner">
            {games.map((game) => {
              const isActive = activeGame === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => setActiveGame(game.id)}
                  className={`px-4 py-2 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                    isActive ? `${game.accent} ${game.color} shadow-sm` : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {game.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 py-6 sm:px-6 sm:py-8 bg-gradient-to-b from-white to-slate-50">
          {activeGame === 'flashcard' && <FlashcardMatchingGame vocabularies={vocabularies} />}
          {activeGame === 'blast' && <BlastGame vocabularies={vocabularies} />}
        </div>
      </div>
    </section>
  );
};

export default LessonGamesPanel;


