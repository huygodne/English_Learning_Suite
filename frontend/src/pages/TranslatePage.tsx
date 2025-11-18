import React, { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import ScenicBackground from '../components/ScenicBackground';
import { translationService } from '../services/api';
import { TranslationResponse } from '../types';

const languageOptions = [
  { code: 'en', label: 'Tiếng Anh' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'fr', label: 'Tiếng Pháp' },
  { code: 'ja', label: 'Tiếng Nhật' },
  { code: 'ko', label: 'Tiếng Hàn' },
  { code: 'zh', label: 'Tiếng Trung' },
];

const TranslatePage: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('vi');
  const [text, setText] = useState('');
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [history, setHistory] = useState<TranslationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setResult(null);
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await translationService.translate({
        text,
        sourceLang,
        targetLang,
      });
      setResult(response);
      setHistory((prev) => [response, ...prev].slice(0, 6));
    } catch (err) {
      setError('Không thể dịch văn bản. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      <ScenicBackground variant="meadow" />
      <SiteHeader active="translate" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl border border-white/60 p-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Trung tâm dịch thuật</h1>
                <p className="text-slate-500 mt-1">
                  Sử dụng AI để dịch nhanh và chính xác hơn
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSwapLanguages}
                  className="p-2 rounded-2xl bg-slate-100 border border-slate-200 hover:bg-slate-200 transition-colors"
                >
                  ⇆
                </button>
                <select
                  className="rounded-2xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-300"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Nhập văn bản cần dịch..."
              className="w-full h-40 rounded-2xl border-2 border-slate-200 p-4 text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition-all"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleTranslate}
                disabled={loading || !text.trim()}
                className="btn-primary flex-1 text-center disabled:opacity-50"
              >
                {loading ? 'Đang dịch...' : 'Dịch văn bản'}
              </button>
              <button
                onClick={() => {
                  setText('');
                  setResult(null);
                }}
                className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
              >
                Xóa
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                {error}
              </div>
            )}

            {result && (
              <div className="rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-emerald-700">Bản dịch</h2>
                  <span className="text-sm text-emerald-500 font-semibold">
                    {result.provider} · {result.latencyMs}ms
                  </span>
                </div>
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{result.translatedText}</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl border border-white/60 p-5">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Lịch sử gần đây</h3>
              {history.length === 0 ? (
                <p className="text-sm text-slate-500">Chưa có bản dịch nào.</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <div key={`${item.translatedText}-${index}`} className="border border-slate-100 rounded-2xl p-3">
                      <p className="text-sm text-slate-500 mb-2">{item.provider} · {item.latencyMs}ms</p>
                      <p className="text-slate-700 line-clamp-3">{item.translatedText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl text-white p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-2">Mẹo dịch nhanh</h3>
              <ul className="text-sm space-y-2 text-white/90 list-disc list-inside">
                <li>Giữ câu ngắn gọn để AI dễ hiểu hơn.</li>
                <li>Thêm bối cảnh để bản dịch chính xác.</li>
                <li>Kiểm tra lại ngữ pháp sau khi dịch.</li>
              </ul>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TranslatePage;


