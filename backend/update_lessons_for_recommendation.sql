-- ============================================================
-- SCRIPT CẬP NHẬT CÁC BÀI HỌC ĐÃ CÓ VỚI CÁC TRƯỜNG CHO AI GỢI Ý
-- Chạy script này sau khi đã chạy update_recommendation_fields.sql
-- ============================================================

USE `englishwebsite`;

-- ============================================================
-- CẬP NHẬT CÁC BÀI HỌC VỚI difficulty_rating, weights và is_active
-- ============================================================

-- LEVEL 1: TỪ LOẠI & THÌ CƠ BẢN (difficulty: 1100-1220, grammar: 0.4, vocab: 0.4, listening: 0.2)
UPDATE lessons SET 
  difficulty_rating = 1100, grammar_weight = 0.4, vocab_weight = 0.4, listening_weight = 0.2, is_active = TRUE
WHERE id = 1 AND lesson_number = 1;

UPDATE lessons SET 
  difficulty_rating = 1120, grammar_weight = 0.4, vocab_weight = 0.4, listening_weight = 0.2, is_active = TRUE
WHERE id = 2 AND lesson_number = 2;

UPDATE lessons SET 
  difficulty_rating = 1140, grammar_weight = 0.4, vocab_weight = 0.4, listening_weight = 0.2, is_active = TRUE
WHERE id = 3 AND lesson_number = 3;

UPDATE lessons SET 
  difficulty_rating = 1160, grammar_weight = 0.4, vocab_weight = 0.4, listening_weight = 0.2, is_active = TRUE
WHERE id = 4 AND lesson_number = 4;

UPDATE lessons SET 
  difficulty_rating = 1180, grammar_weight = 0.4, vocab_weight = 0.4, listening_weight = 0.2, is_active = TRUE
WHERE id = 5 AND lesson_number = 5;

UPDATE lessons SET 
  difficulty_rating = 1200, grammar_weight = 0.4, vocab_weight = 0.4, listening_weight = 0.2, is_active = TRUE
WHERE id = 6 AND lesson_number = 6;

-- LEVEL 2: THÌ QUÁ KHỨ, TƯƠNG LAI & CẤU TRÚC CÂU (difficulty: 1300-1450, grammar: 0.35, vocab: 0.35, listening: 0.3)
UPDATE lessons SET 
  difficulty_rating = 1300, grammar_weight = 0.35, vocab_weight = 0.35, listening_weight = 0.3, is_active = TRUE
WHERE id = 7 AND lesson_number = 7;

UPDATE lessons SET 
  difficulty_rating = 1330, grammar_weight = 0.35, vocab_weight = 0.35, listening_weight = 0.3, is_active = TRUE
WHERE id = 8 AND lesson_number = 8;

UPDATE lessons SET 
  difficulty_rating = 1360, grammar_weight = 0.35, vocab_weight = 0.35, listening_weight = 0.3, is_active = TRUE
WHERE id = 9 AND lesson_number = 9;

UPDATE lessons SET 
  difficulty_rating = 1390, grammar_weight = 0.35, vocab_weight = 0.35, listening_weight = 0.3, is_active = TRUE
WHERE id = 10 AND lesson_number = 10;

UPDATE lessons SET 
  difficulty_rating = 1420, grammar_weight = 0.35, vocab_weight = 0.35, listening_weight = 0.3, is_active = TRUE
WHERE id = 11 AND lesson_number = 11;

UPDATE lessons SET 
  difficulty_rating = 1450, grammar_weight = 0.35, vocab_weight = 0.35, listening_weight = 0.3, is_active = TRUE
WHERE id = 12 AND lesson_number = 12;

-- LEVEL 3: NÂNG CAO (MỆNH ĐỀ & SỰ HÒA HỢP) (difficulty: 1500-1740, grammar: 0.3, vocab: 0.3, listening: 0.4)
UPDATE lessons SET 
  difficulty_rating = 1500, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 13 AND lesson_number = 13;

UPDATE lessons SET 
  difficulty_rating = 1540, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 14 AND lesson_number = 14;

UPDATE lessons SET 
  difficulty_rating = 1580, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 15 AND lesson_number = 15;

UPDATE lessons SET 
  difficulty_rating = 1620, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 16 AND lesson_number = 16;

UPDATE lessons SET 
  difficulty_rating = 1660, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 17 AND lesson_number = 17;

UPDATE lessons SET 
  difficulty_rating = 1700, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 18 AND lesson_number = 18;

-- LEVEL 4 & 5: CÁC CHỦ ĐỀ THỰC HÀNH KHÁC (difficulty: 1800-2150, grammar: 0.25-0.3, vocab: 0.3, listening: 0.4-0.45)
UPDATE lessons SET 
  difficulty_rating = 1800, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 19 AND lesson_number = 19;

UPDATE lessons SET 
  difficulty_rating = 1850, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 20 AND lesson_number = 20;

UPDATE lessons SET 
  difficulty_rating = 1900, grammar_weight = 0.3, vocab_weight = 0.3, listening_weight = 0.4, is_active = TRUE
WHERE id = 21 AND lesson_number = 21;

UPDATE lessons SET 
  difficulty_rating = 2000, grammar_weight = 0.25, vocab_weight = 0.3, listening_weight = 0.45, is_active = TRUE
WHERE id = 22 AND lesson_number = 22;

UPDATE lessons SET 
  difficulty_rating = 2050, grammar_weight = 0.25, vocab_weight = 0.3, listening_weight = 0.45, is_active = TRUE
WHERE id = 23 AND lesson_number = 23;

UPDATE lessons SET 
  difficulty_rating = 2100, grammar_weight = 0.25, vocab_weight = 0.3, listening_weight = 0.45, is_active = TRUE
WHERE id = 24 AND lesson_number = 24;

UPDATE lessons SET 
  difficulty_rating = 2150, grammar_weight = 0.25, vocab_weight = 0.3, listening_weight = 0.45, is_active = TRUE
WHERE id = 25 AND lesson_number = 25;

-- ============================================================
-- CẬP NHẬT TẤT CẢ CÁC BÀI HỌC KHÁC VỚI GIÁ TRỊ MẶC ĐỊNH
-- ============================================================
UPDATE lessons 
SET 
  difficulty_rating = CASE 
    WHEN level = 1 THEN 1100 + (lesson_number * 20)
    WHEN level = 2 THEN 1300 + ((lesson_number - 6) * 30)
    WHEN level = 3 THEN 1500 + ((lesson_number - 12) * 40)
    WHEN level = 4 THEN 1800 + ((lesson_number - 18) * 50)
    WHEN level = 5 THEN 2000 + ((lesson_number - 22) * 50)
    ELSE 1500
  END,
  grammar_weight = CASE 
    WHEN level = 1 THEN 0.4
    WHEN level = 2 THEN 0.35
    WHEN level = 3 THEN 0.3
    WHEN level = 4 THEN 0.3
    WHEN level = 5 THEN 0.25
    ELSE 0.33
  END,
  vocab_weight = CASE 
    WHEN level = 1 THEN 0.4
    WHEN level = 2 THEN 0.35
    WHEN level = 3 THEN 0.3
    WHEN level = 4 THEN 0.3
    WHEN level = 5 THEN 0.3
    ELSE 0.33
  END,
  listening_weight = CASE 
    WHEN level = 1 THEN 0.2
    WHEN level = 2 THEN 0.3
    WHEN level = 3 THEN 0.4
    WHEN level = 4 THEN 0.4
    WHEN level = 5 THEN 0.45
    ELSE 0.34
  END,
  is_active = TRUE
WHERE difficulty_rating IS NULL 
   OR grammar_weight IS NULL 
   OR vocab_weight IS NULL 
   OR listening_weight IS NULL 
   OR is_active IS NULL;

SELECT 'Lessons updated successfully for AI Recommendation System!' AS Status;

