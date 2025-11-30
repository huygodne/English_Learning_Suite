import React, { useState } from 'react';
import { AnswerSubmissionResponse } from '../types';
import { lessonService } from '../services/api';

interface InteractiveQuestionProps {
  questionId: number;
  questionText: string;
  questionType: 'FILL_IN_BLANK' | 'TRUE_FALSE' | 'MULTIPLE_CHOICE';
  correctAnswer?: string; // Optional, will be received from API response
  explanation?: string;
  options?: Array<{ id: number; optionText: string }>; // For MULTIPLE_CHOICE
  lessonId: number;
  onAnswerSubmit?: (isCorrect: boolean, newElo: number) => void;
  compact?: boolean; // For small quiz in GrammarCard
}

const InteractiveQuestion: React.FC<InteractiveQuestionProps> = ({
  questionId,
  questionText,
  questionType,
  correctAnswer,
  explanation,
  options = [],
  lessonId,
  onAnswerSubmit,
  compact = false,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newElo, setNewElo] = useState<number | null>(null);
  const [eloChange, setEloChange] = useState<number>(0);
  const [showEloToast, setShowEloToast] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [responseCorrectAnswer, setResponseCorrectAnswer] = useState<string>('');
  const [responseExplanation, setResponseExplanation] = useState<string>('');
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (questionType === 'MULTIPLE_CHOICE') {
      if (!selectedOptionId) return;
    } else {
      if (!userAnswer.trim()) return;
    }

    setSubmitting(true);

    try {
      let submission: any = { questionId };

      if (questionType === 'FILL_IN_BLANK') {
        // For fill in blank, send text answer
        submission.textAnswer = userAnswer;
      } else if (questionType === 'TRUE_FALSE') {
        // For true/false, we need to find the option that matches the answer
        // This is a simplified approach - in real implementation, you'd have actual option IDs
        submission.selectedOptionId = userAnswer.toLowerCase() === 'true' ? 1 : 2;
      } else if (questionType === 'MULTIPLE_CHOICE') {
        // For multiple choice, use selectedOptionId
        if (selectedOptionId) {
          submission.selectedOptionId = selectedOptionId;
        } else {
          throw new Error('Please select an option');
        }
      }

      const response: AnswerSubmissionResponse = await lessonService.submitAnswer(lessonId, submission);

      setIsAnswered(true);
      setIsCorrect(response.correct);
      setNewElo(response.newElo);
      setEloChange(response.eloChange || 0);
      setShowExplanation(true);
      setResponseCorrectAnswer(response.correctAnswer || '');
      setResponseExplanation(response.explanation || '');

      // Show celebration animation if correct
      if (response.correct) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }

      if (onAnswerSubmit) {
        onAnswerSubmit(response.correct, response.newElo);
      }

      // Show Elo toast
      if (response.newElo !== undefined) {
        setShowEloToast(true);
        setTimeout(() => setShowEloToast(false), 3000);
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      alert('Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setUserAnswer('');
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setNewElo(null);
    setEloChange(0);
    setResponseCorrectAnswer('');
    setResponseExplanation('');
  };

  const handleOptionClick = async (optionId: number) => {
    if (isAnswered || submitting) return;
    
    setSelectedOptionId(optionId);
    // Auto-submit for multiple choice in compact mode
    if (compact) {
      setSubmitting(true);
      try {
        const response: AnswerSubmissionResponse = await lessonService.submitAnswer(lessonId, {
          questionId,
          selectedOptionId: optionId,
        });

        setIsAnswered(true);
        setIsCorrect(response.correct);
        setNewElo(response.newElo);
        setEloChange(response.eloChange || 0);
        setShowExplanation(true);
        setResponseCorrectAnswer(response.correctAnswer || '');
        setResponseExplanation(response.explanation || '');

        if (response.correct) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
        }

        if (onAnswerSubmit) {
          onAnswerSubmit(response.correct, response.newElo);
        }

        if (response.newElo !== undefined) {
          setShowEloToast(true);
          setTimeout(() => setShowEloToast(false), 3000);
        }
      } catch (error: any) {
        console.error('Error submitting answer:', error);
        alert('Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (questionType === 'FILL_IN_BLANK') {
    // Replace blanks with input fields
    const parts = questionText.split('___');
    const hasBlank = questionText.includes('___');

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 relative">
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        {showEloToast && newElo !== null && (
          <div className="fixed top-4 right-4 z-50 animate-bounce">
            <div className={`px-6 py-3 rounded-lg shadow-lg font-semibold ${
              eloChange > 0 
                ? 'bg-emerald-600 text-white' 
                : eloChange < 0
                ? 'bg-red-600 text-white'
                : 'bg-gray-600 text-white'
            }`}>
              {eloChange > 0 ? '🚀' : eloChange < 0 ? '📉' : '➡️'} 
              Elo {eloChange > 0 ? '+' : ''}{eloChange} ({newElo})
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Điền từ còn thiếu:</h4>
          <div className="flex flex-wrap items-center gap-2 text-lg">
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                <span>{part}</span>
                {index < parts.length - 1 && (
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    disabled={isAnswered}
                    className={`px-3 py-2 border-2 rounded-lg font-semibold text-center min-w-[100px] ${
                      isAnswered
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 focus:border-primary-500 focus:outline-none'
                    }`}
                    placeholder="?"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {!isAnswered && (
          <button
            onClick={handleSubmit}
            disabled={(!userAnswer.trim() && questionType !== 'MULTIPLE_CHOICE') || submitting}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Đang kiểm tra...' : 'Kiểm tra'}
          </button>
        )}

        {isAnswered && (
          <div className="space-y-3">
            <div
              className={`p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <span className={`font-bold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Đúng!' : 'Sai!'}
                </span>
              </div>
              {!isCorrect && responseCorrectAnswer && (
                <p className="text-gray-700 text-sm">
                  <strong>Đáp án đúng:</strong> {responseCorrectAnswer}
                </p>
              )}
              {(responseExplanation || explanation) && (
                <p className="text-gray-700 text-sm mt-2">{responseExplanation || explanation}</p>
              )}
            </div>
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Làm lại
            </button>
          </div>
        )}
      </div>
    );
  }

  // MULTIPLE_CHOICE question type
  if (questionType === 'MULTIPLE_CHOICE' && options.length > 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 ${compact ? 'p-4' : 'p-6'} space-y-4 relative`}>
        {/* Celebration Animation */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        )}

        {showEloToast && newElo !== null && (
          <div className="fixed top-4 right-4 z-50 animate-bounce">
            <div className={`px-6 py-3 rounded-lg shadow-lg font-semibold ${
              eloChange > 0 
                ? 'bg-emerald-600 text-white' 
                : eloChange < 0
                ? 'bg-red-600 text-white'
                : 'bg-gray-600 text-white'
            }`}>
              {eloChange > 0 ? '🚀' : eloChange < 0 ? '📉' : '➡️'} 
              Elo {eloChange > 0 ? '+' : ''}{eloChange} ({newElo})
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
            {compact ? questionText : 'Chọn đáp án đúng:'}
          </h4>
          {!compact && <p className="text-lg text-gray-800">{questionText}</p>}
        </div>

        {!isAnswered && (
          <div className="space-y-3">
            <div className="space-y-2">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    if (compact) {
                      handleOptionClick(option.id);
                    } else {
                      setSelectedOptionId(option.id);
                    }
                  }}
                  disabled={submitting}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                    selectedOptionId === option.id
                      ? 'bg-primary-100 border-primary-500 text-primary-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${submitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                >
                  {option.optionText}
                </button>
              ))}
            </div>
            {!compact && (
              <button
                onClick={handleSubmit}
                disabled={!selectedOptionId || submitting}
                className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Đang kiểm tra...' : 'Kiểm tra'}
              </button>
            )}
          </div>
        )}

        {isAnswered && (
          <div className="space-y-3">
            <div
              className={`p-4 rounded-lg ${
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✓' : '✗'}
                </span>
                <span className={`font-bold ${compact ? 'text-base' : 'text-lg'} ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? 'Đúng!' : 'Sai!'}
                </span>
              </div>
              {!isCorrect && responseCorrectAnswer && (
                <p className="text-gray-700 text-sm">
                  <strong>Đáp án đúng:</strong> {responseCorrectAnswer}
                </p>
              )}
              {(responseExplanation || explanation) && (
                <p className="text-gray-700 text-sm mt-2">{responseExplanation || explanation}</p>
              )}
            </div>
            {!compact && (
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Làm lại
              </button>
            )}
          </div>
        )}

        {submitting && (
          <div className="text-center text-gray-600">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-2">Đang kiểm tra...</span>
          </div>
        )}
      </div>
    );
  }

  // TRUE_FALSE question type
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-6xl animate-bounce">🎉</div>
        </div>
      )}

      {showEloToast && newElo && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
            Elo +{newElo - 1500}! ({newElo})
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-semibold text-gray-900">Câu hỏi đúng/sai:</h4>
        <p className="text-lg text-gray-800">{questionText}</p>
      </div>

      {!isAnswered && (
        <div className="flex gap-4">
          <button
            onClick={() => {
              setUserAnswer('true');
              handleSubmit();
            }}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Đúng
          </button>
          <button
            onClick={() => {
              setUserAnswer('false');
              handleSubmit();
            }}
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Sai
          </button>
        </div>
      )}

      {isAnswered && (
        <div className="space-y-3">
          <div
            className={`p-4 rounded-lg ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-2xl ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? '✓' : '✗'}
              </span>
              <span className={`font-bold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 'Đúng!' : 'Sai!'}
              </span>
            </div>
              {!isCorrect && responseCorrectAnswer && (
                <p className="text-gray-700 text-sm">
                  <strong>Đáp án đúng:</strong> {responseCorrectAnswer}
                </p>
              )}
              {(responseExplanation || explanation) && (
                <p className="text-gray-700 text-sm mt-2">{responseExplanation || explanation}</p>
              )}
          </div>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
};

export default InteractiveQuestion;

