-- =================================================================
-- ENGLISH LEARNING SUITE - DATABASE SCHEMA
-- MySQL Database Schema hoàn chỉnh cho hệ thống học tiếng Anh
-- =================================================================

-- Xóa database cũ nếu tồn tại và tạo mới
DROP DATABASE IF EXISTS `englishwebsite`;
CREATE DATABASE `englishwebsite` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `englishwebsite`;

-- =================================================================
-- BẢNG 1: ACCOUNTS (Người dùng)
-- =================================================================
CREATE TABLE `accounts` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100),
    `phone_number` VARCHAR(20),
    `role` VARCHAR(20) NOT NULL DEFAULT 'USER',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_username` (`username`),
    INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 2: LESSONS (Bài học)
-- =================================================================
CREATE TABLE `lessons` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_number` INT NOT NULL,
    `level` INT NOT NULL DEFAULT 1 COMMENT '1=Easy, 2=Medium, 3=Hard',
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT COMMENT 'Mô tả bài học',
    `audio_url` VARCHAR(500),
    `image_url` VARCHAR(500) COMMENT 'Ảnh đại diện bài học',
    `estimated_duration` INT COMMENT 'Thời gian ước tính (phút)',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_lesson_number` (`lesson_number`),
    INDEX `idx_level` (`level`),
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 3: VOCABULARIES (Từ vựng)
-- =================================================================
CREATE TABLE `vocabularies` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `word_english` VARCHAR(255) NOT NULL,
    `phonetic_spelling` VARCHAR(100) COMMENT 'Phiên âm IPA',
    `vietnamese_meaning` VARCHAR(500) NOT NULL,
    `image_url` VARCHAR(500) COMMENT 'Ảnh minh họa từ vựng',
    `audio_url` VARCHAR(500) COMMENT 'File audio phát âm',
    `example_sentence_english` TEXT COMMENT 'Câu ví dụ tiếng Anh',
    `example_sentence_vietnamese` TEXT COMMENT 'Câu ví dụ tiếng Việt',
    `word_type` VARCHAR(50) COMMENT 'Loại từ: noun, verb, adjective, etc.',
    `difficulty_level` INT DEFAULT 1 COMMENT 'Độ khó: 1-5',
    `order_index` INT DEFAULT 0 COMMENT 'Thứ tự hiển thị trong bài học',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE,
    INDEX `idx_lesson_id` (`lesson_id`),
    INDEX `idx_word_english` (`word_english`),
    INDEX `idx_difficulty_level` (`difficulty_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 4: GRAMMARS (Ngữ pháp)
-- =================================================================
CREATE TABLE `grammars` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `title` VARCHAR(255) COMMENT 'Tiêu đề điểm ngữ pháp',
    `explanation_english` TEXT NOT NULL,
    `explanation_vietnamese` TEXT NOT NULL,
    `example_sentences` TEXT COMMENT 'Các câu ví dụ (JSON hoặc text)',
    `order_index` INT DEFAULT 0 COMMENT 'Thứ tự hiển thị trong bài học',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE,
    INDEX `idx_lesson_id` (`lesson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 5: CONVERSATIONS (Hội thoại)
-- =================================================================
CREATE TABLE `conversations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `lesson_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `audio_url` VARCHAR(500),
    `description` TEXT COMMENT 'Mô tả ngắn về hội thoại',
    `order_index` INT DEFAULT 0 COMMENT 'Thứ tự hiển thị trong bài học',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE,
    INDEX `idx_lesson_id` (`lesson_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 6: SENTENCES (Câu trong hội thoại)
-- =================================================================
CREATE TABLE `sentences` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT NOT NULL,
    `character_name` VARCHAR(50) NOT NULL COMMENT 'Tên nhân vật (A, B, Anna, Bob, etc.)',
    `text_english` TEXT NOT NULL,
    `text_vietnamese` TEXT NOT NULL,
    `audio_url` VARCHAR(500) COMMENT 'Audio riêng cho câu này',
    `order_index` INT DEFAULT 0 COMMENT 'Thứ tự trong hội thoại',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE CASCADE,
    INDEX `idx_conversation_id` (`conversation_id`),
    INDEX `idx_order_index` (`order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 7: TESTS (Bài kiểm tra)
-- =================================================================
CREATE TABLE `tests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `level` INT NOT NULL DEFAULT 1,
    `description` TEXT COMMENT 'Mô tả bài kiểm tra',
    `audio_url` VARCHAR(500),
    `duration_minutes` INT COMMENT 'Thời gian làm bài (phút)',
    `total_questions` INT DEFAULT 0,
    `passing_score` INT DEFAULT 60 COMMENT 'Điểm đạt (0-100)',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_level` (`level`),
    INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 8: QUESTIONS (Câu hỏi trong bài kiểm tra)
-- =================================================================
CREATE TABLE `questions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `test_id` BIGINT NOT NULL,
    `question_text` TEXT NOT NULL,
    `question_type` VARCHAR(50) NOT NULL COMMENT 'MULTIPLE_CHOICE, TRUE_FALSE, FILL_IN_BLANK, ARRANGE_SENTENCE',
    `image_url` VARCHAR(500),
    `audio_url` VARCHAR(500),
    `points` INT DEFAULT 1 COMMENT 'Điểm số cho câu hỏi',
    `explanation` TEXT COMMENT 'Giải thích đáp án',
    `order_index` INT DEFAULT 0 COMMENT 'Thứ tự trong bài kiểm tra',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON DELETE CASCADE,
    INDEX `idx_test_id` (`test_id`),
    INDEX `idx_question_type` (`question_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 9: ANSWER_OPTIONS (Lựa chọn trả lời)
-- =================================================================
CREATE TABLE `answer_options` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `question_id` BIGINT NOT NULL,
    `option_text` VARCHAR(500) NOT NULL,
    `is_correct` BOOLEAN DEFAULT FALSE,
    `order_index` INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`question_id`) REFERENCES `questions`(`id`) ON DELETE CASCADE,
    INDEX `idx_question_id` (`question_id`),
    INDEX `idx_is_correct` (`is_correct`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 10: LESSON_PROGRESS (Tiến độ bài học)
-- =================================================================
CREATE TABLE `lesson_progress` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `account_id` BIGINT NOT NULL,
    `lesson_id` BIGINT NOT NULL,
    `score` INT DEFAULT 0 COMMENT 'Điểm từ vựng (0-100)',
    `is_completed` BOOLEAN DEFAULT FALSE,
    `time_spent_seconds` INT DEFAULT 0 COMMENT 'Thời gian học (giây)',
    `completed_at` TIMESTAMP NULL COMMENT 'Thời điểm hoàn thành',
    `last_accessed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_account_lesson` (`account_id`, `lesson_id`),
    INDEX `idx_account_id` (`account_id`),
    INDEX `idx_lesson_id` (`lesson_id`),
    INDEX `idx_is_completed` (`is_completed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 11: TEST_PROGRESS (Tiến độ bài kiểm tra)
-- =================================================================
CREATE TABLE `test_progress` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `account_id` BIGINT NOT NULL,
    `test_id` BIGINT NOT NULL,
    `score` INT NOT NULL COMMENT 'Điểm số (0-100)',
    `time_spent_seconds` INT DEFAULT 0,
    `completed_at` TIMESTAMP NULL,
    `answers_json` TEXT COMMENT 'Lưu câu trả lời dạng JSON',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`test_id`) REFERENCES `tests`(`id`) ON DELETE CASCADE,
    INDEX `idx_account_id` (`account_id`),
    INDEX `idx_test_id` (`test_id`),
    INDEX `idx_completed_at` (`completed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 12: VOCABULARY_PROGRESS (Tiến độ từ vựng)
-- =================================================================
CREATE TABLE `vocabulary_progress` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `account_id` BIGINT NOT NULL,
    `vocabulary_id` BIGINT NOT NULL,
    `remembered` BOOLEAN DEFAULT FALSE COMMENT 'Đã nhớ từ này chưa',
    `mastery_level` INT DEFAULT 0 COMMENT 'Mức độ thành thạo (0-5)',
    `review_count` INT DEFAULT 0 COMMENT 'Số lần đã ôn tập',
    `last_reviewed_at` TIMESTAMP NULL,
    `next_review_at` TIMESTAMP NULL COMMENT 'Thời điểm nên ôn lại (Spaced Repetition)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabularies`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_account_vocabulary` (`account_id`, `vocabulary_id`),
    INDEX `idx_account_id` (`account_id`),
    INDEX `idx_vocabulary_id` (`vocabulary_id`),
    INDEX `idx_remembered` (`remembered`),
    INDEX `idx_next_review_at` (`next_review_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 13: CHAT_MESSAGE (Tin nhắn chatbot)
-- =================================================================
CREATE TABLE `chat_message` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `account_id` BIGINT NOT NULL,
    `message_content` TEXT NOT NULL,
    `sender` VARCHAR(10) NOT NULL COMMENT 'USER hoặc BOT',
    `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE,
    INDEX `idx_account_id` (`account_id`),
    INDEX `idx_timestamp` (`timestamp`),
    INDEX `idx_sender` (`sender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 14: MEDIA_ASSETS (Kho media)
-- =================================================================
CREATE TABLE `media_assets` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `original_filename` VARCHAR(255) NOT NULL,
    `stored_filename` VARCHAR(255) NOT NULL,
    `content_type` VARCHAR(100) NOT NULL,
    `type` VARCHAR(20) NOT NULL COMMENT 'IMAGE, AUDIO, VIDEO',
    `category` VARCHAR(100) COMMENT 'Phân loại: vocabulary, lesson, conversation, etc.',
    `description` TEXT,
    `public_url` VARCHAR(500) NOT NULL,
    `file_size` BIGINT COMMENT 'Kích thước file (bytes)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_type` (`type`),
    INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 15: PRONUNCIATION_SAMPLES (Mẫu phát âm)
-- =================================================================
CREATE TABLE `pronunciation_samples` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `category` VARCHAR(100) COMMENT 'Phân loại: vowels, consonants, diphthongs, etc.',
    `term` VARCHAR(255) NOT NULL COMMENT 'Từ hoặc âm thanh',
    `ipa` VARCHAR(100) COMMENT 'Ký hiệu IPA',
    `description` TEXT COMMENT 'Mô tả cách phát âm',
    `image_url` VARCHAR(500) COMMENT 'Hình ảnh minh họa vị trí lưỡi, môi',
    `audio_url` VARCHAR(500) COMMENT 'File audio phát âm',
    `order_index` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 16: GAME_SESSIONS (Phiên chơi game) - MỚI
-- =================================================================
CREATE TABLE `game_sessions` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `account_id` BIGINT NOT NULL,
    `lesson_id` BIGINT COMMENT 'Game liên quan đến bài học nào',
    `game_type` VARCHAR(50) NOT NULL COMMENT 'flashcard, matching, blast, blocks, etc.',
    `score` INT DEFAULT 0,
    `time_spent_seconds` INT DEFAULT 0,
    `completed` BOOLEAN DEFAULT FALSE,
    `game_data_json` TEXT COMMENT 'Dữ liệu game (câu trả lời, thời gian, etc.)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `completed_at` TIMESTAMP NULL,
    FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`lesson_id`) REFERENCES `lessons`(`id`) ON DELETE SET NULL,
    INDEX `idx_account_id` (`account_id`),
    INDEX `idx_lesson_id` (`lesson_id`),
    INDEX `idx_game_type` (`game_type`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- BẢNG 17: VOCABULARY_GAME_STATS (Thống kê game từ vựng) - MỚI
-- =================================================================
CREATE TABLE `vocabulary_game_stats` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `account_id` BIGINT NOT NULL,
    `vocabulary_id` BIGINT NOT NULL,
    `game_type` VARCHAR(50) NOT NULL,
    `times_played` INT DEFAULT 0 COMMENT 'Số lần chơi',
    `times_correct` INT DEFAULT 0 COMMENT 'Số lần trả lời đúng',
    `times_incorrect` INT DEFAULT 0 COMMENT 'Số lần trả lời sai',
    `average_time_seconds` DECIMAL(10,2) COMMENT 'Thời gian trung bình (giây)',
    `last_played_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`vocabulary_id`) REFERENCES `vocabularies`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_account_vocab_game` (`account_id`, `vocabulary_id`, `game_type`),
    INDEX `idx_account_id` (`account_id`),
    INDEX `idx_vocabulary_id` (`vocabulary_id`),
    INDEX `idx_game_type` (`game_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- DỮ LIỆU MẪU (SAMPLE DATA)
-- =================================================================

-- Tài khoản mẫu
-- Mật khẩu: admin123 (đã hash bằng BCrypt)
INSERT INTO `accounts` (`username`, `password`, `full_name`, `role`) VALUES
('admin', '$2a$10$Qktiagu59ee0qVAUE5O8KOQRDUIyevteKYhr6xcrpyDkTInGK9I/6', 'Administrator', 'ADMIN'),
('testuser', '$2a$10$g.jV/nAGUS2yY.4qBNo5fedTfXG9nprb3s1gMCXtE7gdwOBweVjCe', 'Test User', 'USER');

-- Bài học mẫu
INSERT INTO `lessons` (`lesson_number`, `level`, `name`, `description`, `audio_url`, `estimated_duration`) VALUES
(1, 1, 'Greetings and Introductions', 'Học cách chào hỏi và giới thiệu bản thân', 'audio/lesson1.mp3', 30),
(2, 1, 'Family Members', 'Học từ vựng về các thành viên trong gia đình', 'audio/lesson2.mp3', 25),
(3, 2, 'Daily Activities', 'Học từ vựng về các hoạt động hàng ngày', 'audio/lesson3.mp3', 35);

-- Từ vựng mẫu cho bài học 1
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `phonetic_spelling`, `vietnamese_meaning`, `example_sentence_english`, `example_sentence_vietnamese`, `word_type`, `order_index`) VALUES
(1, 'Hello', '/həˈloʊ/', 'Xin chào', 'Hello, how are you?', 'Xin chào, bạn khỏe không?', 'interjection', 1),
(1, 'Goodbye', '/ˌɡʊdˈbaɪ/', 'Tạm biệt', 'Goodbye, see you tomorrow!', 'Tạm biệt, hẹn gặp lại ngày mai!', 'interjection', 2),
(1, 'Thank you', '/θæŋk juː/', 'Cảm ơn', 'Thank you for your help.', 'Cảm ơn bạn đã giúp đỡ.', 'phrase', 3),
(1, 'You''re welcome', '/jʊr ˈwɛlkəm/', 'Không có gì', 'You''re welcome!', 'Không có gì!', 'phrase', 4);

-- Từ vựng mẫu cho bài học 2
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `phonetic_spelling`, `vietnamese_meaning`, `example_sentence_english`, `example_sentence_vietnamese`, `word_type`, `order_index`) VALUES
(2, 'Family', '/ˈfæməli/', 'Gia đình', 'I love my family.', 'Tôi yêu gia đình tôi.', 'noun', 1),
(2, 'Father', '/ˈfɑːðər/', 'Bố', 'My father is a teacher.', 'Bố tôi là giáo viên.', 'noun', 2),
(2, 'Mother', '/ˈmʌðər/', 'Mẹ', 'My mother cooks well.', 'Mẹ tôi nấu ăn rất ngon.', 'noun', 3),
(2, 'Brother', '/ˈbrʌðər/', 'Anh/Em trai', 'I have one brother.', 'Tôi có một người anh trai.', 'noun', 4),
(2, 'Sister', '/ˈsɪstər/', 'Chị/Em gái', 'My sister is studying.', 'Chị tôi đang học.', 'noun', 5);

-- Ngữ pháp mẫu
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `order_index`) VALUES
(1, 'Simple Greetings', 'Simple greetings are used to start a conversation.', 'Các câu chào đơn giản được dùng để bắt đầu một cuộc hội thoại.', 1),
(1, 'The verb "to be"', 'The verb "to be" (am/is/are) is used to describe states and conditions.', 'Động từ "to be" (am/is/are) được dùng để mô tả trạng thái và điều kiện.', 2);

-- Hội thoại mẫu
INSERT INTO `conversations` (`lesson_id`, `title`, `audio_url`, `order_index`) VALUES
(1, 'Meeting a new friend', 'audio/convo1.mp3', 1);

-- Câu trong hội thoại
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(1, 'Anna', 'Hello!', 'Xin chào!', 1),
(1, 'Bob', 'Hi! My name is Bob. What''s your name?', 'Chào bạn! Tên tôi là Bob. Tên bạn là gì?', 2),
(1, 'Anna', 'My name is Anna. Nice to meet you.', 'Tên tôi là Anna. Rất vui được gặp bạn.', 3),
(1, 'Bob', 'Nice to meet you too.', 'Tôi cũng rất vui được gặp bạn.', 4);

-- Bài kiểm tra mẫu
INSERT INTO `tests` (`name`, `level`, `description`, `duration_minutes`, `total_questions`, `passing_score`) VALUES
('Level 1 - Midterm Exam', 1, 'Bài kiểm tra giữa kỳ cho level 1', 30, 10, 60),
('Level 1 - Final Exam', 1, 'Bài kiểm tra cuối kỳ cho level 1', 45, 15, 70);

-- Câu hỏi mẫu cho Test 1
INSERT INTO `questions` (`test_id`, `question_text`, `question_type`, `points`, `order_index`) VALUES
(1, 'Which word means "Tạm biệt"?', 'MULTIPLE_CHOICE', 10, 1),
(1, 'Choose the correct sentence:', 'MULTIPLE_CHOICE', 10, 2),
(1, 'What is "Father" in English?', 'MULTIPLE_CHOICE', 10, 3);

-- Đáp án cho câu hỏi 1
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`, `order_index`) VALUES
(1, 'Hello', FALSE, 1),
(1, 'Goodbye', TRUE, 2),
(1, 'Family', FALSE, 3);

-- Đáp án cho câu hỏi 2
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`, `order_index`) VALUES
(2, 'My name are Anna.', FALSE, 1),
(2, 'My name is Anna.', TRUE, 2),
(2, 'My name am Anna.', FALSE, 3);

-- Đáp án cho câu hỏi 3
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`, `order_index`) VALUES
(3, 'Mother', FALSE, 1),
(3, 'Father', TRUE, 2),
(3, 'Thank you', FALSE, 3);

-- =================================================================
-- KẾT THÚC
-- =================================================================

-- Hiển thị thông tin database
SELECT 'Database created successfully!' AS message;
SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema = 'englishwebsite';

