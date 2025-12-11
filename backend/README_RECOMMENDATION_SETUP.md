# Hướng dẫn cập nhật Database cho Hệ thống AI Gợi ý

## 📋 Tổng quan

Để hệ thống AI gợi ý hoạt động với database mới, bạn cần thực hiện các bước sau:

## 🚀 Các bước thực hiện

### Bước 1: Chạy script tạo cấu trúc database

Chạy file `database_schema.sql` để tạo dữ liệu bài học cơ bản.

### Bước 2: Thêm các cột cần thiết

Chạy file `update_recommendation_fields.sql` để thêm các cột sau vào database:

**Bảng `accounts`:**
- `elo_rating` (INT, DEFAULT 1500)
- `grammar_proficiency` (DOUBLE, DEFAULT 0.0)
- `vocab_proficiency` (DOUBLE, DEFAULT 0.0)
- `listening_proficiency` (DOUBLE, DEFAULT 0.0)

**Bảng `lessons`:**
- `difficulty_rating` (INT, DEFAULT 1500)
- `grammar_weight` (DOUBLE, DEFAULT 0.33)
- `vocab_weight` (DOUBLE, DEFAULT 0.33)
- `listening_weight` (DOUBLE, DEFAULT 0.34)
- `is_active` (BOOLEAN, DEFAULT TRUE)

### Bước 3: Cập nhật giá trị cho các bài học

Chạy file `update_lessons_for_recommendation.sql` để cập nhật các giá trị:
- `difficulty_rating` dựa trên level và lesson_number
- `grammar_weight`, `vocab_weight`, `listening_weight` dựa trên level
- `is_active = TRUE` cho tất cả bài học

## 📊 Giá trị mặc định

### Difficulty Rating theo Level:
- **Level 1**: 1100-1220 (tăng dần theo lesson_number)
- **Level 2**: 1300-1450
- **Level 3**: 1500-1740
- **Level 4**: 1800-1950
- **Level 5**: 2000-2150

### Weights theo Level:
- **Level 1**: Grammar 0.4, Vocab 0.4, Listening 0.2
- **Level 2**: Grammar 0.35, Vocab 0.35, Listening 0.3
- **Level 3**: Grammar 0.3, Vocab 0.3, Listening 0.4
- **Level 4**: Grammar 0.3, Vocab 0.3, Listening 0.4
- **Level 5**: Grammar 0.25, Vocab 0.3, Listening 0.45

## ✅ Kiểm tra

Sau khi chạy các script, kiểm tra bằng các lệnh sau:

```sql
-- Kiểm tra các cột đã được thêm vào accounts
DESCRIBE accounts;

-- Kiểm tra các cột đã được thêm vào lessons
DESCRIBE lessons;

-- Kiểm tra giá trị đã được cập nhật
SELECT id, lesson_number, level, name, difficulty_rating, grammar_weight, vocab_weight, listening_weight, is_active 
FROM lessons 
LIMIT 5;

-- Kiểm tra accounts có các trường recommendation
SELECT id, username, elo_rating, grammar_proficiency, vocab_proficiency, listening_proficiency 
FROM accounts 
LIMIT 5;
```

## 🔧 Lưu ý

- Script `update_recommendation_fields.sql` sử dụng dynamic SQL để kiểm tra cột đã tồn tại trước khi thêm
- Script `update_lessons_for_recommendation.sql` sẽ cập nhật tất cả bài học, kể cả những bài đã có giá trị
- Nếu database đã có các cột này, chỉ cần chạy `update_lessons_for_recommendation.sql`

