import React, { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import ScenicBackground from '../components/ScenicBackground';
import Breadcrumb from '../components/Breadcrumb';
import { pronunciationService } from '../services/api';
import { PronunciationSample } from '../types';

const categories = ['Hội họa', 'Đời sống', 'Du lịch', 'Kinh doanh'];

const PronunciationPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Hội họa');
  const [samples, setSamples] = useState<PronunciationSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSamples = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await pronunciationService.listSamples(activeCategory);
        setSamples(data);
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu phát âm.');
      } finally {
        setLoading(false);
      }
    };

    fetchSamples();
  }, [activeCategory]);

  const handlePlayAudio = (audioUrl?: string) => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50 relative">
      <ScenicBackground variant="mountain" />
      <SiteHeader active="pronunciation" />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb />
        </div>
        <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl border border-white/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Thư viện phát âm</h1>
              <p className="text-slate-500 mt-1">
                Nghe và xem mẫu hình ảnh để ghi nhớ từ thuộc chủ đề {activeCategory.toLowerCase()}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-2xl border text-sm font-semibold transition-all ${
                    activeCategory === category
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'border-slate-200 text-slate-600 hover:border-primary-200 hover:text-primary-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white/90 backdrop-blur rounded-3xl p-10 text-center shadow-xl">
            <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto mb-4" />
            <p className="text-slate-500">Đang tải nội dung phát âm...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-600">{error}</div>
        ) : samples.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 text-center text-slate-500 shadow-xl">
            Chưa có mẫu phát âm cho chủ đề này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {samples.map((sample) => (
              <div
                key={sample.id}
                className="bg-white/90 backdrop-blur rounded-3xl p-5 shadow-lg border border-white/50 flex flex-col gap-4"
              >
                {sample.imageUrl && (
                  <div className="relative overflow-hidden rounded-2xl h-48">
                    <img
                      src={sample.imageUrl}
                      alt={sample.term}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{sample.term}</h2>
                    <p className="text-primary-600 font-semibold">{sample.ipa}</p>
                  </div>
                  <button
                    onClick={() => handlePlayAudio(sample.audioUrl)}
                    className="px-4 py-2 rounded-2xl bg-primary-50 text-primary-600 border border-primary-200 font-semibold hover:bg-primary-100 transition-colors"
                  >
                    Nghe
                  </button>
                </div>
                <p className="text-slate-600">{sample.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PronunciationPage;

