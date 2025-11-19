# Hướng dẫn Setup Database

## 📋 Tổng quan

File `database_schema.sql` chứa cấu trúc database hoàn chỉnh cho hệ thống English Learning Suite, bao gồm:

- ✅ 17 bảng với đầy đủ relationships
- ✅ Foreign keys và constraints
- ✅ Indexes cho performance
- ✅ Dữ liệu mẫu để test

## 🚀 Cách sử dụng

### Bước 1: Backup database cũ (nếu có)

```bash
mysqldump -u root -p englishwebsite > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Bước 2: Chạy file SQL

**Cách 1: Sử dụng MySQL Command Line**
```bash
mysql -u root -p < database_schema.sql
```

**Cách 2: Sử dụng MySQL Workbench**
1. Mở MySQL Workbench
2. File → Open SQL Script → Chọn `database_schema.sql`
3. Click "Execute" (⚡)

**Cách 3: Sử dụng phpMyAdmin**
1. Đăng nhập phpMyAdmin
2. Chọn tab "SQL"
3. Copy toàn bộ nội dung file `database_schema.sql`
4. Paste vào và click "Go"

### Bước 3: Kiểm tra

```sql
USE englishwebsite;
SHOW TABLES;
SELECT COUNT(*) FROM accounts;
SELECT COUNT(*) FROM lessons;
SELECT COUNT(*) FROM vocabularies;
```

## 📊 Cấu trúc Database

### Các bảng chính:

1. **accounts** - Người dùng hệ thống
2. **lessons** - Bài học
3. **vocabularies** - Từ vựng
4. **grammars** - Ngữ pháp
5. **conversations** - Hội thoại
6. **sentences** - Câu trong hội thoại
7. **tests** - Bài kiểm tra
8. **questions** - Câu hỏi
9. **answer_options** - Đáp án
10. **lesson_progress** - Tiến độ bài học
11. **test_progress** - Tiến độ bài kiểm tra
12. **vocabulary_progress** - Tiến độ từ vựng
13. **chat_message** - Tin nhắn chatbot
14. **media_assets** - Kho media
15. **pronunciation_samples** - Mẫu phát âm
16. **game_sessions** - Phiên chơi game (MỚI)
17. **vocabulary_game_stats** - Thống kê game từ vựng (MỚI)

### Tính năng mới cho Game:

- **game_sessions**: Lưu trữ mỗi phiên chơi game của người dùng
  - Hỗ trợ nhiều loại game: flashcard, matching, blast, blocks
  - Lưu điểm số, thời gian, dữ liệu game dạng JSON
  
- **vocabulary_game_stats**: Thống kê chi tiết về từ vựng trong game
  - Số lần chơi, số lần đúng/sai
  - Thời gian trung bình
  - Hỗ trợ phân tích hiệu quả học tập

## 🔧 Cấu hình Application

Sau khi tạo database, cập nhật file `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/englishwebsite?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
```

**Lưu ý**: Đặt `ddl-auto=validate` để không tự động thay đổi schema.

## 📝 Dữ liệu mẫu

File SQL đã bao gồm:
- 2 tài khoản mẫu (admin, testuser)
- 3 bài học mẫu
- Từ vựng, ngữ pháp, hội thoại mẫu
- 2 bài kiểm tra với câu hỏi mẫu

## 🔐 Tài khoản mẫu

- **Admin**: 
  - Username: `admin`
  - Password: `admin123` (đã hash)
  
- **User**: 
  - Username: `testuser`
  - Password: `testuser123` (đã hash)

## ⚠️ Lưu ý quan trọng

1. **Backup trước khi chạy**: File SQL sẽ XÓA database cũ và tạo mới
2. **Encoding**: Database sử dụng `utf8mb4` để hỗ trợ emoji và ký tự đặc biệt
3. **Foreign Keys**: Tất cả foreign keys đều có `ON DELETE CASCADE` hoặc `ON DELETE SET NULL`
4. **Indexes**: Đã tối ưu indexes cho các truy vấn thường dùng

## 🎮 Hỗ trợ Game

Database đã được thiết kế để hỗ trợ các game học từ vựng:

- **Flashcard Game**: Sử dụng `vocabularies` và `vocabulary_progress`
- **Matching Game**: Sử dụng `vocabularies` và `vocabulary_game_stats`
- **Blast Game**: Sử dụng `game_sessions` để lưu điểm
- **Blocks Game**: Sử dụng `game_sessions` và `vocabulary_game_stats`

## 📈 Mở rộng trong tương lai

Database đã được thiết kế để dễ dàng mở rộng:
- Thêm các loại game mới vào `game_type`
- Thêm các loại câu hỏi mới vào `question_type`
- Thêm các trường metadata vào các bảng hiện có

## 🐛 Troubleshooting

**Lỗi: "Access denied"**
- Kiểm tra username/password MySQL
- Đảm bảo user có quyền CREATE DATABASE

**Lỗi: "Table already exists"**
- File SQL đã có `DROP DATABASE IF EXISTS`, nên sẽ tự động xóa database cũ

**Lỗi: "Foreign key constraint fails"**
- Đảm bảo chạy toàn bộ file SQL, không chỉ một phần

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Version MySQL (khuyến nghị >= 5.7 hoặc >= 8.0)
2. Quyền của user MySQL
3. Logs trong MySQL error log

