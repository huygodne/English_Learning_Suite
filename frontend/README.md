# English Learning Suite - Frontend

Frontend của ứng dụng học tiếng Anh được xây dựng bằng ReactJS với Vite, TailwindCSS và các công nghệ hiện đại.

## 🚀 Tính năng chính

### 🔐 Xác thực người dùng
- **Đăng ký tài khoản**: Tạo tài khoản mới với thông tin cá nhân
- **Đăng nhập**: Xác thực bằng username/password với JWT token
- **Bảo vệ routes**: Protected routes cho các trang yêu cầu đăng nhập
- **Phân quyền admin**: Admin routes chỉ dành cho quản trị viên

### 📚 Chức năng học tập
- **Trang chủ**: Giao diện giới thiệu với thiết kế hiện đại
- **Danh sách bài học**: Hiển thị tất cả bài học với phân cấp độ
- **Chi tiết bài học**: 
  - Từ vựng với phát âm (Text-to-Speech)
  - Ngữ pháp với giải thích song ngữ
  - Hội thoại với audio và phụ đề
- **Bài kiểm tra**: Hệ thống trắc nghiệm với đánh giá kết quả
- **Theo dõi tiến độ**: Xem lịch sử học tập và điểm số

### 🛠️ Quản trị hệ thống
- **Quản lý người dùng**: CRUD operations cho tài khoản
- **Thống kê**: Dashboard với các chỉ số quan trọng
- **Quản lý nội dung**: Giao diện quản lý bài học và kiểm tra

### 🌐 Tính năng bổ sung
- **Dịch nhanh**: Component dịch văn bản Anh-Việt
- **Responsive design**: Tối ưu cho mọi thiết bị
- **Dark/Light mode**: Chế độ sáng/tối (có thể mở rộng)

## 🛠️ Công nghệ sử dụng

- **React 18**: Framework chính
- **Vite**: Build tool và dev server
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client cho API calls
- **Heroicons**: Icon library
- **Lucide React**: Additional icons

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Reusable components
│   ├── ProtectedRoute.tsx
│   └── QuickTranslate.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom hooks
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── LessonsPage.tsx
│   ├── LessonDetailPage.tsx
│   ├── TestsPage.tsx
│   ├── TestDetailPage.tsx
│   ├── ProfilePage.tsx
│   └── AdminPage.tsx
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
├── App.jsx             # Main App component
└── index.css           # Global styles
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- npm >= 8.0.0

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build cho production
```bash
npm run build
```

### Preview build
```bash
npm run preview
```

## 🔧 Cấu hình

### API Configuration
File `src/services/api.ts` chứa cấu hình API client:
- Base URL: `http://localhost:8080/api`
- JWT token được tự động thêm vào headers
- Interceptors xử lý authentication và errors

### Environment Variables
Tạo file `.env.local` để cấu hình:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key_here
```

## 🎨 UI/UX Design

### Color Palette
- **Primary**: Blue tones (#3b82f6, #2563eb, #1d4ed8)
- **Secondary**: Cyan tones (#0ea5e9, #0284c7, #0369a1)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Rounded corners với shadow
- **Buttons**: Primary, secondary variants
- **Forms**: Consistent input styling
- **Animations**: Smooth transitions và hover effects

## 🔌 API Integration

### Authentication Endpoints
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký

### Learning Endpoints
- `GET /api/lessons` - Danh sách bài học
- `GET /api/lessons/:id` - Chi tiết bài học
- `GET /api/tests` - Danh sách bài kiểm tra
- `GET /api/tests/:id` - Chi tiết bài kiểm tra
- `POST /api/tests/submit` - Nộp bài kiểm tra

### Progress Endpoints
- `GET /api/users/:id/progress/lessons` - Tiến độ bài học
- `GET /api/users/:id/progress/tests` - Tiến độ bài kiểm tra

### Admin Endpoints
- `GET /api/admin/users` - Danh sách người dùng

## 🧪 Testing

### Chạy tests
```bash
npm run test
```

### Coverage report
```bash
npm run test:coverage
```

## 📱 Responsive Design

- **Mobile First**: Thiết kế ưu tiên mobile
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🔒 Security

- **JWT Token**: Lưu trữ trong localStorage
- **Protected Routes**: Kiểm tra authentication
- **Role-based Access**: Phân quyền admin/user
- **Input Validation**: Client-side validation
- **XSS Protection**: Sanitize user input

## 🚀 Deployment

### Build optimization
- Code splitting với React.lazy()
- Tree shaking để giảm bundle size
- Image optimization
- CSS purging với TailwindCSS

### Production build
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

## 🆘 Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.