import React, { useState } from 'react';

interface QuickTranslateProps {
  className?: string;
}

const QuickTranslate: React.FC<QuickTranslateProps> = ({ className = '' }) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translationDirection, setTranslationDirection] = useState<'en-vi' | 'vi-en'>('en-vi');

  const translateText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const langPair = translationDirection === 'en-vi' ? 'en|vi' : 'vi|en';
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`);
      const data = await response.json();
      
      if (data.responseStatus === 200) {
        setTranslatedText(data.responseData.translatedText);
      } else {
        throw new Error('Translation failed');
      }
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
    setError('');
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          Dịch nhanh
        </div>
        <button
          onClick={() => setTranslationDirection(prev => prev === 'en-vi' ? 'vi-en' : 'en-vi')}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          {translationDirection === 'en-vi' ? 'EN → VI' : 'VI → EN'}
        </button>
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhập văn bản {translationDirection === 'en-vi' ? 'tiếng Anh' : 'tiếng Việt'}:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Nhập văn bản ${translationDirection === 'en-vi' ? 'tiếng Anh' : 'tiếng Việt'} cần dịch...`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={translateText}
            disabled={loading || !text.trim()}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang dịch...' : 'Dịch'}
          </button>
          <button
            onClick={clearText}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            Xóa
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
            {error}
          </div>
        )}

        {translatedText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bản dịch {translationDirection === 'en-vi' ? 'tiếng Việt' : 'tiếng Anh'}:
            </label>
            <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
              {translatedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickTranslate;
