import React, { useState } from 'react';
import { translationService } from '../services/api';

interface QuickTranslateProps {
  className?: string;
}

const QuickTranslate: React.FC<QuickTranslateProps> = ({ className = '' }) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [provider, setProvider] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translationDirection, setTranslationDirection] = useState<'en-vi' | 'vi-en'>('en-vi');

  const translateText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const sourceLang = translationDirection === 'en-vi' ? 'en' : 'vi';
      const targetLang = translationDirection === 'en-vi' ? 'vi' : 'en';

      const response = await translationService.translate({
        text,
        sourceLang,
        targetLang,
      });

      setTranslatedText(response.translatedText);
      setProvider(response.provider);
    } catch (err) {
      setError('Không thể dịch văn bản. Vui lòng thử lại.');
      console.error('Translation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearText = () => {
    setText('');
    setTranslatedText('');
    setProvider('');
    setError('');
  };

  return (
    <div className={`bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-2xl shadow-soft-xl border-2 border-primary-100 p-6 transition-all duration-300 hover:shadow-soft-2xl hover:border-primary-200 ${className}`}>
      <h3 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <span>Dịch nhanh</span>
        </div>
        <button
          onClick={() => setTranslationDirection(prev => prev === 'en-vi' ? 'vi-en' : 'en-vi')}
          className="text-sm bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold px-4 py-2 rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {translationDirection === 'en-vi' ? 'EN → VI' : 'VI → EN'}
        </button>
      </h3>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-500"></span>
            Nhập văn bản {translationDirection === 'en-vi' ? 'tiếng Anh' : 'tiếng Việt'}:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Nhập văn bản ${translationDirection === 'en-vi' ? 'tiếng Anh' : 'tiếng Việt'} cần dịch...`}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-primary-400 resize-none bg-white transition-all duration-300 hover:border-primary-300"
            rows={4}
          />
        </div>

        <div className="flex space-x-3">
          <button
            onClick={translateText}
            disabled={loading || !text.trim()}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang dịch...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Dịch
              </>
            )}
          </button>
          <button
            onClick={clearText}
            className="px-5 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
          >
            Xóa
          </button>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium animate-scale-in flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {translatedText && (
          <div className="animate-fade-in">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary-500"></span>
              Bản dịch {translationDirection === 'en-vi' ? 'tiếng Việt' : 'tiếng Anh'}:
            </label>
            <div className="w-full px-4 py-4 bg-gradient-to-br from-secondary-50 to-primary-50 border-2 border-secondary-200 rounded-xl text-gray-900 font-medium shadow-inner">
              {translatedText}
            </div>
            {provider && (
              <p className="text-xs text-gray-500 mt-2">
                Nguồn dịch: {provider}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickTranslate;
