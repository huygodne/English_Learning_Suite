# Hướng dẫn tạo API Key Google Gemini

## Bước 1: Truy cập Google AI Studio

1. Mở trình duyệt và truy cập: **https://aistudio.google.com/app/apikey**
2. Đăng nhập bằng tài khoản Google của bạn (hoặc tài khoản Google của bạn bạn nếu họ cho phép)

## Bước 2: Tạo API Key mới

### Cách 1: Tạo từ trang chủ Google AI Studio

1. Sau khi đăng nhập, bạn sẽ thấy trang **"Get API key"**
2. Click vào nút **"Get API Key"** hoặc **"Create API Key"**
3. Nếu chưa có project, Google sẽ yêu cầu:
   - Chọn project có sẵn, HOẶC
   - Click **"Create project"** để tạo project mới
4. Chọn project và click **"Create API key in new project"** hoặc **"Create API key"**

### Cách 2: Tạo từ Google Cloud Console

1. Truy cập: **https://console.cloud.google.com/**
2. Chọn hoặc tạo project mới
3. Vào **"APIs & Services"** > **"Credentials"**
4. Click **"Create Credentials"** > **"API Key"**
5. Copy API key được tạo

## Bước 3: Copy API Key

1. Sau khi tạo xong, Google sẽ hiển thị API key của bạn
2. **QUAN TRỌNG:** Copy API key ngay lập tức vì bạn sẽ không thể xem lại sau này
3. API key có dạng: `AIzaSy...` (khoảng 39 ký tự)

## Bước 4: Cập nhật vào project

### Cách 1: Cập nhật trực tiếp vào application.properties

1. Mở file: `backend/src/main/resources/application.properties`
2. Tìm dòng:
   ```properties
   gemini.api.key=AIzaSyApLvkL1k0iDyViHLFyKl7mHKH-4XWZVbE
   ```
3. Thay thế bằng API key mới:
   ```properties
   gemini.api.key=API_KEY_MỚI_CỦA_BẠN_Ở_ĐÂY
   ```
4. Lưu file

### Cách 2: Sử dụng Environment Variable (Khuyến nghị)

**Windows PowerShell:**
```powershell
$env:GEMINI_API_KEY="your_new_api_key_here"
```

**Windows CMD:**
```cmd
set GEMINI_API_KEY=your_new_api_key_here
```

**Linux/Mac:**
```bash
export GEMINI_API_KEY=your_new_api_key_here
```

Sau đó cập nhật `application.properties`:
```properties
gemini.api.key=${GEMINI_API_KEY:YOUR_API_KEY_HERE}
```

## Bước 5: Khởi động lại Backend

1. Dừng backend nếu đang chạy (Ctrl+C)
2. Khởi động lại:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   hoặc nếu dùng IDE, restart application

## Bước 6: Kiểm tra

1. Mở trình duyệt: **http://localhost:5173/chatbot** (hoặc port frontend của bạn)
2. Gửi một tin nhắn test, ví dụ: "Xin chào"
3. Nếu chatbot trả lời được → **Thành công!** ✅
4. Nếu vẫn báo lỗi → Kiểm tra lại API key và restart backend

## Lưu ý quan trọng

### ⚠️ Bảo mật API Key

- **KHÔNG** commit API key lên Git (file `application.properties` đã được thêm vào `.gitignore`)
- **KHÔNG** chia sẻ API key công khai
- **KHÔNG** đặt API key trong code Java
- Chỉ sử dụng trong file cấu hình local hoặc environment variables

### 🔒 Giới hạn API Key (Tùy chọn nhưng khuyến nghị)

1. Truy cập: **https://console.cloud.google.com/apis/credentials**
2. Click vào API key vừa tạo
3. Có thể thiết lập:
   - **Application restrictions**: Giới hạn IP hoặc domain
   - **API restrictions**: Chỉ cho phép Gemini API
   - **Quota**: Giới hạn số lượng request

### 💰 Chi phí

- Google Gemini có **free tier** với giới hạn nhất định
- Kiểm tra quota tại: **https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas**
- Nếu vượt quá free tier, sẽ có chi phí (rất thấp)

## Troubleshooting

### Lỗi: "API key not valid"
- Kiểm tra lại API key đã copy đúng chưa
- Đảm bảo không có khoảng trắng thừa
- Kiểm tra API key đã được enable chưa trong Google Cloud Console

### Lỗi: "403 Forbidden"
- API key có thể bị rò rỉ → Tạo API key mới
- API key không có quyền truy cập → Kiểm tra trong Google Cloud Console

### Lỗi: "429 Too Many Requests"
- Đã vượt quá quota → Đợi một lúc hoặc nâng cấp plan

### Chatbot không hoạt động
- Kiểm tra backend đã chạy chưa
- Kiểm tra API key trong `application.properties`
- Xem log của backend để biết lỗi cụ thể

## Tham khảo thêm

- Google AI Studio: https://aistudio.google.com/
- Gemini API Documentation: https://ai.google.dev/docs
- Google Cloud Console: https://console.cloud.google.com/
















