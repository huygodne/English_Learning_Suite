import React from 'react';
import { Link } from 'react-router-dom';

type Prompt = {
  id: string;
  title: string;
  badge: string;
  emoji: string;
  highlight: string;
  lesson: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
  tip: string;
  cta: { label: string; query: string };
};

const prompts: Prompt[] = [
  {
    id: 'flashcard',
    title: 'Prompt A · Flashcard Matching',
    badge: 'Ghép thẻ',
    emoji: '🃏',
    highlight: 'Khởi động cùng bài học “Greetings & Introductions” và tìm cặp thẻ đúng.',
    lesson: 'Greetings & Introductions',
    steps: [
      {
        title: 'Chọn bài học',
        description: "Mở bài 'Greetings & Introductions', sau đó nhấn nút quay lại/Menu để xem danh sách hoạt động.",
      },
      {
        title: 'Vào game Ghép thẻ',
        description: "Nhấn vào hoạt động 'Ghép thẻ' (Flashcard Matching) tương ứng với bài học.",
      },
      {
        title: 'Lật và ghép',
        description: 'Nhấp từng thẻ để lật và ghi nhớ. Tìm cặp từ vựng–định nghĩa trùng khớp.',
      },
      {
        title: 'Hoàn tất lượt chơi',
        description: "Khi ghép hết thẻ, nhấn 'Hoàn thành' hoặc 'Tiếp theo' để kết thúc.",
      },
    ],
    tip: 'Mẹo: Đọc to cặp từ vừa ghép để tăng khả năng ghi nhớ.',
    cta: { label: 'Chơi Flashcard Matching', query: 'activity=flashcard' },
  },
  {
    id: 'blast',
    title: 'Prompt B · Blast Game',
    badge: 'Bắn laze',
    emoji: '🚀',
    highlight: 'Tiếp tục luyện phản xạ với game Blast dựa trên từ vựng vừa học.',
    lesson: 'Vocabulary review',
    steps: [
      {
        title: 'Quay lại danh sách hoạt động',
        description: 'Sau khi ghép thẻ, quay lại màn hình hoạt động của bài học.',
      },
      {
        title: 'Chọn game Blast',
        description: "Tìm mục 'Blast' (Camp Bomb Listening/Bắn laze) và bắt đầu.",
      },
      {
        title: 'Nhắm mục tiêu',
        description: "Di chuyển con trỏ/tiêu điểm, bắn vào đáp án khớp với từ được hỏi (ví dụ '/kɔːrtjɑːrd/ Sân').",
      },
      {
        title: 'Kết thúc lượt',
        description: "Chơi đến khi hoàn tất hoặc hết thời gian, rồi nhấn quay lại/Home.",
      },
    ],
    tip: 'Giữ nhịp nhanh nhưng chính xác: sai quá nhiều sẽ mất combo điểm.',
    cta: { label: 'Bắt đầu game Blast', query: 'activity=blast' },
  },
  {
    id: 'blocks',
    title: 'Prompt C · Blocks Game',
    badge: 'Xếp hình',
    emoji: '🧩',
    highlight: 'Hoàn thiện chuỗi hoạt động bằng game Blocks để luyện viết từ/cụm.',
    lesson: 'Vocabulary spelling practice',
    steps: [
      {
        title: 'Mở lại danh sách hoạt động',
        description: "Sau game Blast, trở về menu hoạt động và chọn game 'Blocks'.",
      },
      {
        title: 'Quan sát gợi ý',
        description: "Đọc hình ảnh, phiên âm hoặc định nghĩa hiện ra (ví dụ: '/hæŋɪŋ ʌp ə ʃɜːrt/ Treo áo lên').",
      },
      {
        title: 'Nhập đáp án tiếng Anh',
        description: "Điền cụm từ tương ứng vào ô 'Nhập câu trả lời của bạn' (ví dụ: 'Hanging up a shirt').",
      },
      {
        title: 'Hoàn thành vòng chơi',
        description: 'Lặp lại cho tới khi hết danh sách từ, rồi nhấn nút thoát để về màn hình chính.',
      },
    ],
    tip: 'Kiểm tra chính tả thật kỹ: hệ thống phân biệt chữ hoa, chữ thường và dấu cách.',
    cta: { label: 'Luyện với Blocks', query: 'activity=blocks' },
  },
];

const LessonActivitiesGuide: React.FC = () => {
  return (
    <section className="card-feature mb-12 sm:mb-16 shadow-lg shadow-slate-200/60 border border-white/80 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary-500">Lesson activities</p>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Chuỗi hoạt động gợi ý</h2>
          <p className="text-base text-slate-600 mt-3 max-w-2xl">
            Làm theo ba prompt dưới đây để hoàn thành đầy đủ hành trình luyện tập cho bài học. Mỗi hoạt động cung cấp
            một kỹ năng riêng: ghi nhớ nhanh, phản xạ nghe — chọn và luyện chính tả/viết.
          </p>
        </div>
        <div className="bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-md">
          <p className="text-xs uppercase tracking-[0.4em] text-white/70">Flow đề xuất</p>
          <p className="text-lg font-semibold">Flashcard → Blast → Blocks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <article
            key={prompt.id}
            className="relative flex flex-col h-full rounded-3xl bg-gradient-to-br from-white to-slate-50 border border-slate-100 p-6 shadow-inner"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span role="img" aria-hidden="false" aria-label={prompt.badge} className="text-3xl">
                  {prompt.emoji}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500 font-semibold">{prompt.badge}</p>
                  <h3 className="text-lg font-bold text-slate-900">{prompt.title}</h3>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                {prompt.lesson}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{prompt.highlight}</p>
            <ol className="space-y-4 flex-1">
              {prompt.steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 inline-flex w-7 h-7 items-center justify-center rounded-full bg-primary-600 text-white text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="text-sm text-slate-600">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 text-white text-sm">
              <p className="font-semibold">Ghi nhớ</p>
              <p>{prompt.tip}</p>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Tiếp tục</p>
                <p className="text-sm font-semibold text-slate-900">{prompt.lesson}</p>
              </div>
              <Link
                to={`/lessons?${prompt.cta.query}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary-600 text-white text-sm font-semibold px-4 py-2 hover:bg-primary-700 transition-colors"
              >
                {prompt.cta.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default LessonActivitiesGuide;


