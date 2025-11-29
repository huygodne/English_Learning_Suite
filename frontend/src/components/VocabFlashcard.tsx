import React from 'react';
import { Volume2 } from 'lucide-react';

interface VocabFlashcardProps {
  word: string;
  phonetic: string;
  rememberLevel: string;
  onFlip?: () => void;
  onPlayAudio?: () => void;
}

const VocabFlashcard: React.FC<VocabFlashcardProps> = ({
  word,
  phonetic,
  rememberLevel,
  onFlip,
  onPlayAudio,
}) => {
  return (
    <div
      className="w-72 h-48 rounded-3xl bg-gradient-to-br from-blue-500 via-sky-500 to-teal-400 text-white shadow-xl p-5 flex flex-col justify-between cursor-pointer select-none relative overflow-hidden"
      onClick={onFlip}
    >
      {/* subtle overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-white/10" />

      {/* Header */}
      <div className="relative z-10 space-y-1">
        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/70">
          TỪ VỰNG
        </p>
        <h2 className="text-xl font-bold leading-snug">{word}</h2>
        <p className="text-sm italic text-white/80">{phonetic}</p>
      </div>

      {/* Body */}
      <div className="relative z-10">
        <p className="text-xs text-white/90">Mức độ nhớ: {rememberLevel}</p>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlayAudio?.();
          }}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-md shadow-sm hover:bg-white/22 hover:border-white/30 transition-colors"
        >
          <Volume2 className="w-4 h-4" />
          <span>Nghe phát âm</span>
        </button>

        <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white/85">
          Click để lật
        </span>
      </div>
    </div>
  );
};

export default VocabFlashcard;


