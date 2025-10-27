import React, { useState } from 'react';

interface QuickTranslateProps {
  className?: string;
}

const QuickTranslate: React.FC<QuickTranslateProps> = ({ className = '' }) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const translateText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Sử dụng Google Translate API (cần API key)
      // Đây là một implementation đơn giản, trong thực tế cần cấu hình API key
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|vi`);
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
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        Dịch nhanh
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nhập văn bản tiếng Anh:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập văn bản cần dịch..."
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
              Bản dịch tiếng Việt:
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
