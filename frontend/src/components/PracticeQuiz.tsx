import React, { useState } from 'react';
import { PracticeQuestion, AnswerSubmissionResponse } from '../types';
import { lessonService } from '../services/api';

interface PracticeQuizProps {
  questions: PracticeQuestion[];
  lessonId: number;
}

interface QuestionState {
  selectedOptionId: number | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  explanation: string;
  newElo: number | null;
  oldElo: number | null;
}

const PracticeQuiz: React.FC<PracticeQuizProps> = ({ questions, lessonId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showEloToast, setShowEloToast] = useState(false);
  const [eloMessage, setEloMessage] = useState('');
  const [currentElo, setCurrentElo] = useState<number | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Chưa có câu hỏi luyện tập nào trong bài học này.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const questionState = questionStates[currentQuestion.id] || {
    selectedOptionId: null,
    isAnswered: false,
    isCorrect: null,
    explanation: '',
    newElo: null,
    oldElo: null,
  };

  const handleOptionClick = async (optionId: number) => {
    if (questionState.isAnswered || submitting) return;

    setSubmitting(true);

    try {
      const response: AnswerSubmissionResponse = await lessonService.submitAnswer(lessonId, {
        questionId: currentQuestion.id,
        selectedOptionId: optionId,
      });

      // Get old Elo (from previous question or current state)
      const oldElo = currentElo || questionState.oldElo || 1500;

      // Update question state
      const newState: QuestionState = {
        selectedOptionId: optionId,
        isAnswered: true,
        isCorrect: response.correct,
        explanation: response.explanation || '',
        newElo: response.newElo,
        oldElo: oldElo,
      };

      setQuestionStates((prev) => ({
        ...prev,
        [currentQuestion.id]: newState,
      }));

      // Update current Elo for next question
      if (response.newElo) {
        setCurrentElo(response.newElo);
      }

      // Show Elo update toast
      if (response.newElo) {
        const change = response.newElo - oldElo;
        if (change !== 0) {
          setEloMessage(
            change > 0
              ? `Elo +${change}! (${response.newElo})`
              : `Elo ${change} (${response.newElo})`
          );
          setShowEloToast(true);
          setTimeout(() => setShowEloToast(false), 3000);
        }
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      alert('Có lỗi xảy ra khi gửi câu trả lời. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getOptionButtonClass = (optionId: number) => {
    if (!questionState.isAnswered) {
      return questionState.selectedOptionId === optionId
        ? 'bg-primary-100 border-primary-500 text-primary-700'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    }

    // After answered
    if (questionState.selectedOptionId === optionId) {
      return questionState.isCorrect
        ? 'bg-green-500 border-green-600 text-white'
        : 'bg-red-500 border-red-600 text-white';
    }

    return 'bg-gray-100 border-gray-300 text-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Elo Toast */}
      {showEloToast && (
        <div className="fixed top-4 right-4 z-50 animate-bounce">
          <div className="bg-primary-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold">
            {eloMessage}
          </div>
        </div>
      )}

      {/* Question Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          Câu hỏi {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentQuestionIndex === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Trước
          </button>
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              currentQuestionIndex === questions.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            Tiếp theo
          </button>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        {/* Question Image */}
        {currentQuestion.imageUrl && (
          <div className="mb-4">
            <img
              src={currentQuestion.imageUrl}
              alt="Question"
              className="w-full max-w-md mx-auto rounded-lg"
            />
          </div>
        )}

        {/* Question Text */}
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.questionText}
        </h3>

        {/* Answer Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={questionState.isAnswered || submitting}
              className={`w-full text-left px-6 py-4 rounded-lg border-2 font-medium transition-all duration-200 ${
                getOptionButtonClass(option.id)
              } ${questionState.isAnswered || submitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option.optionText}
            </button>
          ))}
        </div>

        {/* Feedback Message */}
        {questionState.isAnswered && (
          <div className={`mt-6 p-4 rounded-lg ${
            questionState.isCorrect
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-2xl ${questionState.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {questionState.isCorrect ? '✓' : '✗'}
              </span>
              <span className={`font-bold text-lg ${
                questionState.isCorrect ? 'text-green-700' : 'text-red-700'
              }`}>
                {questionState.isCorrect ? 'Đúng!' : 'Sai!'}
              </span>
            </div>
            {questionState.explanation && (
              <p className="text-gray-700 text-sm mt-2">{questionState.explanation}</p>
            )}
          </div>
        )}

        {/* Loading State */}
        {submitting && (
          <div className="mt-4 text-center text-gray-600">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <span className="ml-2">Đang xử lý...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeQuiz;

