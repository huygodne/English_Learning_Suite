import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Grammar } from '../types';
import InteractiveQuestion from './InteractiveQuestion';

interface GrammarCardProps {
  grammar: Grammar;
  practiceQuestions?: Array<{
    id: number;
    questionText: string;
    questionType: string;
    explanation?: string;
    options: Array<{ id: number; optionText: string }>;
  }>;
  lessonId: number;
}

const GrammarCard: React.FC<GrammarCardProps> = ({ grammar, practiceQuestions, lessonId }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Find related practice question for this grammar (if any)
  const relatedQuestion = practiceQuestions?.find((q) => 
    q.questionType === 'MULTIPLE_CHOICE' || q.questionType === 'FILL_IN_BLANK' || q.questionType === 'TRUE_FALSE'
  );

  return (
    <div className="space-y-4">
      {/* Theory Card - Similar to Vocabulary FlipCard */}
      <div
        className="relative w-full h-64 cursor-pointer perspective"
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
      >
        <motion.div
          className="relative w-full h-full"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side - English Explanation */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl flex flex-col justify-between backface-hidden">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70 mb-2">
                Ngữ pháp
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/30">
                <h4 className="text-xl font-bold leading-tight">
                  {grammar.explanationEnglish.split('\n')[0] || grammar.explanationEnglish}
                </h4>
              </div>
              <p className="text-sm text-white/90 line-clamp-3">
                {grammar.explanationEnglish.length > 100 
                  ? grammar.explanationEnglish.substring(0, 100) + '...'
                  : grammar.explanationEnglish}
              </p>
            </div>
            <p className="text-xs text-white/70 text-center mt-4">
              Nhấn để xem giải thích tiếng Việt
            </p>
          </div>

          {/* Back Side - Vietnamese Explanation */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl flex flex-col justify-between backface-hidden"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70 mb-2">
                Giải thích tiếng Việt
              </p>
              <p className="text-lg font-semibold leading-relaxed">
                {grammar.explanationVietnamese}
              </p>
            </div>
            <p className="text-xs text-white/70 text-center mt-4">
              Nhấn lần nữa để quay lại mặt trước
            </p>
          </div>
        </motion.div>
      </div>

      {/* Interactive Check - Small quiz right below theory */}
      {relatedQuestion && (
        <div className="bg-white rounded-lg border-2 border-primary-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-semibold text-primary-600">✓ Kiểm tra nhanh</span>
            <span className="text-xs text-gray-500">(Chọn đúng để cộng Elo)</span>
          </div>
          <InteractiveQuestion
            questionId={relatedQuestion.id}
            questionText={relatedQuestion.questionText}
            questionType={relatedQuestion.questionType as 'FILL_IN_BLANK' | 'TRUE_FALSE' | 'MULTIPLE_CHOICE'}
            explanation={relatedQuestion.explanation}
            options={relatedQuestion.options}
            lessonId={lessonId}
            compact={true}
          />
        </div>
      )}
    </div>
  );
};

export default GrammarCard;

