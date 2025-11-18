# Hướng dẫn cấu hình Chatbot (Google Gemini API)

## Vấn đề: API Key bị rò rỉ

Nếu bạn gặp lỗi `403 Forbidden: Your API key was reported as leaked`, điều này có nghĩa là API key hiện tại đã bị Google phát hiện là đã bị rò rỉ và không thể sử dụng được nữa.

## Giải pháp: Tạo API Key mới

### Bước 1: Tạo API Key mới từ Google AI Studio

1. Truy cập: https://aistudio.google.com/app/apikey
2. Đăng nhập bằng tài khoản Google của bạn
3. Click vào nút **"Create API Key"** hoặc **"Get API Key"**
4. Chọn project hoặc tạo project mới
5. Copy API key mới được tạo

### Bước 2: Cập nhật API Key

Có 2 cách để cập nhật API key:

#### Cách 1: Sử dụng Environment Variable (Khuyến nghị)

1. Tạo file `application-local.properties` trong thư mục `backend/src/main/resources/` (file này sẽ không bị commit lên git)
2. Thêm dòng sau vào file:
```properties
gemini.api.key=YOUR_NEW_API_KEY_HERE
```

#### Cách 2: Cập nhật trực tiếp trong application.properties

1. Mở file `backend/src/main/resources/application.properties`
2. Tìm dòng `gemini.api.key=`
3. Thay thế giá trị bằng API key mới của bạn:
```properties
gemini.api.key=YOUR_NEW_API_KEY_HERE
```

**⚠️ LƯU Ý QUAN TRỌNG:**
- **KHÔNG** commit file `application.properties` lên git nếu nó chứa API key thật
- File `application.properties` đã được thêm vào `.gitignore` để tránh rò rỉ
- Sử dụng file `application.properties.example` làm template

### Bước 3: Khởi động lại Backend

Sau khi cập nhật API key, khởi động lại Spring Boot application:

```bash
cd backend
mvn spring-boot:run
```

## Kiểm tra

1. Mở trang chatbot: http://localhost:5173/chatbot
2. Gửi một tin nhắn test
3. Nếu chatbot trả lời được, nghĩa là cấu hình đã thành công!

## Bảo mật API Key

- ✅ **Nên làm:**
  - Sử dụng environment variables
  - Sử dụng file `application-local.properties` (không commit)
  - Giới hạn API key trong Google Cloud Console (chỉ cho phép domain/IP cụ thể)
  - Đặt quota/rate limit cho API key

- ❌ **Không nên:**
  - Commit API key lên public repository
  - Chia sẻ API key công khai
  - Sử dụng API key không giới hạn

## Troubleshooting

### Lỗi 403 Forbidden
- API key đã bị rò rỉ → Tạo API key mới
- API key không có quyền truy cập → Kiểm tra trong Google Cloud Console

### Lỗi 429 Too Many Requests
- Đã vượt quá quota → Đợi một lúc hoặc nâng cấp plan

### Lỗi 400 Bad Request
- URL API không đúng → Kiểm tra lại `gemini.api.url` trong application.properties

## Tham khảo

- Google AI Studio: https://aistudio.google.com/
- Gemini API Documentation: https://ai.google.dev/docs

