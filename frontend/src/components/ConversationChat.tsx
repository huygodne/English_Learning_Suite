import React, { useState } from 'react';
import { Conversation, Sentence } from '../types';
import { playAudio } from '../utils/audioUtils';
import InteractiveQuestion from './InteractiveQuestion';

interface ConversationChatProps {
  conversation: Conversation;
  practiceQuestions?: Array<{
    id: number;
    questionText: string;
    questionType: string;
    explanation?: string;
    options: Array<{ id: number; optionText: string }>;
  }>;
  lessonId: number;
}

const ConversationChat: React.FC<ConversationChatProps> = ({ 
  conversation, 
  practiceQuestions, 
  lessonId 
}) => {
  const [practiceMode, setPracticeMode] = useState(false);
  const [hiddenWords, setHiddenWords] = useState<Record<number, string[]>>({});

  // Find related practice question for this conversation
  const relatedQuestion = practiceQuestions?.find((q) => 
    q.questionType === 'FILL_IN_BLANK' || q.questionType === 'MULTIPLE_CHOICE'
  );

  // Toggle practice mode
  const togglePracticeMode = () => {
    setPracticeMode(!practiceMode);
    if (!practiceMode) {
      // When enabling practice mode, hide some keywords (simplified: hide 1-2 words per sentence)
      const newHiddenWords: Record<number, string[]> = {};
      conversation.sentences.forEach((sentence) => {
        const words = sentence.textEnglish.split(' ').filter(w => w.length > 3);
        if (words.length > 2) {
          // Hide 1-2 random words
          const wordsToHide = words.slice(0, Math.min(2, Math.floor(words.length / 3)));
          newHiddenWords[sentence.id] = wordsToHide;
        }
      });
      setHiddenWords(newHiddenWords);
    } else {
      setHiddenWords({});
    }
  };

  // Render sentence with hidden words in practice mode
  const renderSentence = (sentence: Sentence) => {
    if (!practiceMode || !hiddenWords[sentence.id] || hiddenWords[sentence.id].length === 0) {
      return <span>{sentence.textEnglish}</span>;
    }

    const words = sentence.textEnglish.split(' ');
    const hidden = hiddenWords[sentence.id];
    
    return (
      <>
        {words.map((word, index) => {
          const cleanWord = word.replace(/[.,!?;:]/g, '');
          const isHidden = hidden.includes(cleanWord);
          if (isHidden) {
            return (
              <span key={index} className="inline-block mx-1">
                <input
                  type="text"
                  placeholder="?"
                  className="w-16 px-2 py-1 border-2 border-dashed border-primary-400 rounded text-center text-sm focus:border-primary-600 focus:outline-none bg-white"
                />
              </span>
            );
          }
          return <span key={index}>{word} </span>;
        })}
      </>
    );
  };

  return (
    <div className="space-y-4">
      {/* Conversation Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{conversation.title}</h4>
        <div className="flex items-center gap-3">
          {conversation.audioUrl && (
            <button
              onClick={() => playAudio(conversation.audioUrl!)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
              <span>Phát âm</span>
            </button>
          )}
          
          {/* Practice Mode Toggle */}
          <button
            onClick={togglePracticeMode}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              practiceMode
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span>{practiceMode ? '✓' : '○'}</span>
            <span>Luyện tập</span>
          </button>
        </div>
      </div>

      {/* Chat Interface - Messenger/Zalo Style with Avatars */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-4 space-y-3 min-h-[300px] max-h-[500px] overflow-y-auto">
        {conversation.sentences.map((sentence, index) => {
          const isEven = index % 2 === 0;
          const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(sentence.characterName)}&background=${isEven ? '3b82f6' : '8b5cf6'}&color=fff&size=128&bold=true`;
          
          return (
            <div
              key={sentence.id}
              className={`flex ${isEven ? 'justify-start' : 'justify-end'} items-start gap-2 animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {isEven && (
                <img
                  src={avatarUrl}
                  alt={sentence.characterName}
                  className="w-10 h-10 rounded-full flex-shrink-0 shadow-md"
                />
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                  isEven
                    ? 'bg-white text-gray-900 rounded-tl-sm'
                    : 'bg-primary-600 text-white rounded-tr-sm'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${
                    isEven ? 'text-primary-600' : 'text-white/90'
                  }`}>
                    {sentence.characterName}
                  </span>
                  <span className={`text-xs ${isEven ? 'text-gray-400' : 'text-white/70'}`}>•</span>
                  <span className={`text-xs ${isEven ? 'text-gray-400' : 'text-white/70'}`}>Vừa xong</span>
                </div>
                <div className={`text-sm leading-relaxed ${
                  isEven ? 'text-gray-800' : 'text-white'
                }`}>
                  {practiceMode ? (
                    <div className="flex flex-wrap items-center">
                      {renderSentence(sentence)}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{sentence.textEnglish}</p>
                  )}
                </div>
                {!practiceMode && (
                  <p className={`text-xs mt-2 italic ${
                    isEven ? 'text-gray-500' : 'text-white/80'
                  }`}>
                    {sentence.textVietnamese}
                  </p>
                )}
              </div>
              {!isEven && (
                <img
                  src={avatarUrl}
                  alt={sentence.characterName}
                  className="w-10 h-10 rounded-full flex-shrink-0 shadow-md"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Context Check Card - Practice Question at the bottom */}
      {relatedQuestion && (
        <div className="mt-6 bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-xl border-2 border-primary-200 p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <div>
              <h5 className="text-base font-bold text-gray-900">Kiểm tra ngữ cảnh</h5>
              <p className="text-xs text-gray-600">Trả lời đúng để tăng Elo!</p>
            </div>
          </div>
          <InteractiveQuestion
            questionId={relatedQuestion.id}
            questionText={relatedQuestion.questionText}
            questionType={relatedQuestion.questionType as 'FILL_IN_BLANK' | 'TRUE_FALSE' | 'MULTIPLE_CHOICE'}
            explanation={relatedQuestion.explanation}
            options={relatedQuestion.options}
            lessonId={lessonId}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationChat;

