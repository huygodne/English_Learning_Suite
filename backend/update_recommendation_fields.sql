-- ============================================================
-- SCRIPT CẬP NHẬT DATABASE CHO HỆ THỐNG AI GỢI Ý
-- Chạy script này sau khi đã có database schema cơ bản
-- ============================================================

USE `englishwebsite`;

-- ============================================================
-- BƯỚC 1: THÊM CÁC CỘT CẦN THIẾT VÀO BẢNG accounts
-- ============================================================

-- Kiểm tra và thêm cột elo_rating nếu chưa có
SET @dbname = DATABASE();
SET @tablename = 'accounts';
SET @columnname = 'elo_rating';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 1500')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Kiểm tra và thêm cột grammar_proficiency nếu chưa có
SET @columnname = 'grammar_proficiency';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DOUBLE DEFAULT 0.0')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Kiểm tra và thêm cột vocab_proficiency nếu chưa có
SET @columnname = 'vocab_proficiency';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DOUBLE DEFAULT 0.0')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Kiểm tra và thêm cột listening_proficiency nếu chưa có
SET @columnname = 'listening_proficiency';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DOUBLE DEFAULT 0.0')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================================
-- BƯỚC 2: THÊM CÁC CỘT CẦN THIẾT VÀO BẢNG lessons
-- ============================================================

SET @tablename = 'lessons';

-- Kiểm tra và thêm cột difficulty_rating nếu chưa có
SET @columnname = 'difficulty_rating';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' INT DEFAULT 1500')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Kiểm tra và thêm cột grammar_weight nếu chưa có
SET @columnname = 'grammar_weight';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DOUBLE DEFAULT 0.33')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Kiểm tra và thêm cột vocab_weight nếu chưa có
SET @columnname = 'vocab_weight';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DOUBLE DEFAULT 0.33')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Kiểm tra và thêm cột listening_weight nếu chưa có
SET @columnname = 'listening_weight';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' DOUBLE DEFAULT 0.34')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Kiểm tra và thêm cột is_active nếu chưa có
SET @columnname = 'is_active';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (COLUMN_NAME = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' BOOLEAN DEFAULT TRUE')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================================
-- BƯỚC 3: CẬP NHẬT GIÁ TRỊ MẶC ĐỊNH CHO accounts
-- ============================================================

-- Cập nhật elo_rating = 1500 cho các user chưa có giá trị
UPDATE accounts 
SET elo_rating = 1500 
WHERE elo_rating IS NULL;

-- Cập nhật proficiency = 0.0 cho các user chưa có giá trị
UPDATE accounts 
SET grammar_proficiency = 0.0 
WHERE grammar_proficiency IS NULL;

UPDATE accounts 
SET vocab_proficiency = 0.0 
WHERE vocab_proficiency IS NULL;

UPDATE accounts 
SET listening_proficiency = 0.0 
WHERE listening_proficiency IS NULL;

-- ============================================================
-- BƯỚC 4: CẬP NHẬT GIÁ TRỊ CHO lessons DỰA TRÊN LEVEL
-- ============================================================

-- Level 1 (Easy): difficulty_rating = 1000-1200, grammar_weight = 0.4, vocab_weight = 0.4, listening_weight = 0.2
UPDATE lessons 
SET 
  difficulty_rating = CASE level
    WHEN 1 THEN 1100 + (lesson_number * 20)  -- 1100-1220
    WHEN 2 THEN 1300 + (lesson_number - 6) * 30  -- 1300-1450
    WHEN 3 THEN 1500 + (lesson_number - 12) * 40  -- 1500-1740
    WHEN 4 THEN 1800 + (lesson_number - 18) * 50  -- 1800-1950
    WHEN 5 THEN 2000 + (lesson_number - 22) * 50  -- 2000-2150
    ELSE 1500
  END,
  grammar_weight = CASE level
    WHEN 1 THEN 0.4  -- Level 1 tập trung ngữ pháp và từ vựng
    WHEN 2 THEN 0.35
    WHEN 3 THEN 0.3
    WHEN 4 THEN 0.3
    WHEN 5 THEN 0.25
    ELSE 0.33
  END,
  vocab_weight = CASE level
    WHEN 1 THEN 0.4  -- Level 1 tập trung ngữ pháp và từ vựng
    WHEN 2 THEN 0.35
    WHEN 3 THEN 0.3
    WHEN 4 THEN 0.3
    WHEN 5 THEN 0.3
    ELSE 0.33
  END,
  listening_weight = CASE level
    WHEN 1 THEN 0.2  -- Level 1 ít nghe hơn
    WHEN 2 THEN 0.3
    WHEN 3 THEN 0.4
    WHEN 4 THEN 0.4
    WHEN 5 THEN 0.45
    ELSE 0.34
  END,
  is_active = TRUE
WHERE difficulty_rating IS NULL OR grammar_weight IS NULL OR vocab_weight IS NULL OR listening_weight IS NULL OR is_active IS NULL;

-- ============================================================
-- BƯỚC 5: CẬP NHẬT CÁC INSERT STATEMENTS TRONG database_schema.sql
-- (Cần cập nhật thủ công các INSERT INTO lessons)
-- ============================================================

-- Script này sẽ cập nhật các bài học đã có trong database
-- Nếu bạn đang sử dụng database_schema.sql mới, các INSERT đã có đầy đủ trường
-- Nếu bạn đang sử dụng database cũ, chạy script này để cập nhật

SELECT 'Database updated successfully for AI Recommendation System!' AS Status;

