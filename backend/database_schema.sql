-- =================================================================
-- FIXED SCRIPT: REALISTIC DATA SEEDING (SAFE IDs)
-- Tác vụ: Xóa sạch dữ liệu cũ và nạp dữ liệu với logic ID an toàn tuyệt đối
-- =================================================================

USE `englishwebsite`;

-- 1. DỌN DẸP DỮ LIỆU CŨ (CLEANUP)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `lesson_progress`;
TRUNCATE TABLE `test_progress`;
TRUNCATE TABLE `vocabulary_progress`;
TRUNCATE TABLE `vocabulary_game_stats`;
TRUNCATE TABLE `game_sessions`;
TRUNCATE TABLE `answer_options`;
TRUNCATE TABLE `questions`;
TRUNCATE TABLE `sentences`;
TRUNCATE TABLE `conversations`;
TRUNCATE TABLE `grammars`;
TRUNCATE TABLE `vocabularies`;
TRUNCATE TABLE `tests`;
TRUNCATE TABLE `lessons`;
SET FOREIGN_KEY_CHECKS = 1;

-- =================================================================
-- 2. BẮT ĐẦU NẠP DỮ LIỆU (DATA INSERTION)
-- =================================================================

-- -----------------------------------------------------------------
-- LEVEL 1: EASY (LESSON 1-4)
-- -----------------------------------------------------------------

-- === LESSON 1: GREETINGS ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (1, 1, 1, 'Greetings & Introductions', 'Học cách chào hỏi, giới thiệu tên tuổi và quốc tịch.', 850, 0.3, 0.5, 0.2);

-- Từ vựng L1
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(1, 'Hello', 'Xin chào', 'interjection', 1),
(1, 'Goodbye', 'Tạm biệt', 'interjection', 1),
(1, 'Name', 'Tên', 'noun', 1),
(1, 'Nice', 'Tốt/Đẹp', 'adjective', 1),
(1, 'Meet', 'Gặp gỡ', 'verb', 1),
(1, 'Morning', 'Buổi sáng', 'noun', 1),
(1, 'Afternoon', 'Buổi chiều', 'noun', 1),
(1, 'Evening', 'Buổi tối', 'noun', 1),
(1, 'Friend', 'Bạn bè', 'noun', 1),
(1, 'Thanks', 'Cảm ơn', 'interjection', 1);

-- Ngữ pháp L1 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(1, 'Verb To Be (Am/Is/Are)', 'I am, You are, He/She is.', 'Động từ tobe dùng để giới thiệu bản thân.', 'I am a student.'),
(1, 'Possessive Adjectives', 'My, Your, His, Her.', 'Tính từ sở hữu.', 'My name is John.'),
(1, 'Greetings', 'Hello, Hi, Good morning, Good afternoon, Good evening.', 'Các cách chào hỏi theo thời gian trong ngày.', 'Good morning, teacher!'),
(1, 'Introducing Yourself', 'I am... / My name is...', 'Cách giới thiệu bản thân.', 'My name is Anna. I am from Vietnam.'),
(1, 'Asking Names', 'What is your name? / What is his/her name?', 'Cách hỏi tên người khác.', 'What is your name? My name is Tom.');

-- [FIXED] Câu hỏi Ngữ pháp L1 (Mỗi câu hỏi và mỗi đáp án là một INSERT riêng biệt)
-- Câu 1: "Choose correct form: She ___ a teacher."
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'Choose correct form: She ___ a teacher.', 'MULTIPLE_CHOICE', 10);
SET @q1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_id, 'is', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_id, 'are', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_id, 'am', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_id, 'be', FALSE);

-- Câu 2: "Choose correct word: ___ name is Lisa."
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'Choose correct word: ___ name is Lisa.', 'MULTIPLE_CHOICE', 10);
SET @q2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_id, 'My', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_id, 'I', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_id, 'Me', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_id, 'You', FALSE);

-- Câu 3: Grammar question for "Greetings"
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'Which greeting is used in the morning?', 'MULTIPLE_CHOICE', 10);
SET @q1_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g3_id, 'Good morning', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g3_id, 'Good evening', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g3_id, 'Good night', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g3_id, 'Good afternoon', FALSE);

-- Câu 4: Grammar question for "Introducing Yourself"
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'Complete: ___ name is Peter.', 'MULTIPLE_CHOICE', 10);
SET @q1_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g4_id, 'My', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g4_id, 'Me', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g4_id, 'I', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g4_id, 'Mine', FALSE);

-- Câu 5: Grammar question for "Asking Names"
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'What is the correct way to ask someone''s name?', 'MULTIPLE_CHOICE', 10);
SET @q1_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g5_id, 'What is your name?', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g5_id, 'What your name?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g5_id, 'What name is you?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_g5_id, 'Your name what?', FALSE);


-- Hội thoại L1 (5 conversations)
-- Conversation 1: First Meeting
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (1, 1, 'First Meeting', 'Gặp gỡ lần đầu');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(1, 'Tom', 'Hello, I am Tom.', 'Chào, tôi là Tom.', 1),
(1, 'Jerry', 'Hi Tom, nice to meet you.', 'Chào Tom, rất vui được gặp bạn.', 2);

-- Conversation 2: Morning Greeting
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (2, 1, 'Morning Greeting', 'Chào buổi sáng');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(2, 'Teacher', 'Good morning, class!', 'Chào buổi sáng, cả lớp!', 1),
(2, 'Students', 'Good morning, teacher!', 'Chào buổi sáng, thầy/cô!', 2);

-- Conversation 3: Asking Name
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (3, 1, 'Asking Name', 'Hỏi tên');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(3, 'A', 'What is your name?', 'Tên bạn là gì?', 1),
(3, 'B', 'My name is Lisa.', 'Tên tôi là Lisa.', 2);

-- Conversation 4: Saying Goodbye
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (4, 1, 'Saying Goodbye', 'Chào tạm biệt');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(4, 'Friend1', 'Goodbye, see you tomorrow!', 'Tạm biệt, hẹn gặp ngày mai!', 1),
(4, 'Friend2', 'Goodbye, have a nice day!', 'Tạm biệt, chúc một ngày tốt lành!', 2);

-- Conversation 5: Meeting a Friend
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (5, 1, 'Meeting a Friend', 'Gặp bạn');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(5, 'Anna', 'Hi, nice to meet you!', 'Xin chào, rất vui được gặp bạn!', 1),
(5, 'Bob', 'Nice to meet you too!', 'Tôi cũng rất vui được gặp bạn!', 2);

-- Câu hỏi Hội thoại L1 (5 questions)
-- Question 1: "What did Jerry say?"
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'What did Jerry say?', 'MULTIPLE_CHOICE', 10);
SET @q1_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c1_id, 'Nice to meet you', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c1_id, 'Goodbye', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c1_id, 'Who are you?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c1_id, 'Im sad', FALSE);

-- Question 2: Conversation 2
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'What do students say in the morning?', 'MULTIPLE_CHOICE', 10);
SET @q1_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c2_id, 'Good morning, teacher!', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c2_id, 'Good evening, teacher!', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c2_id, 'Good night, teacher!', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c2_id, 'Good afternoon, teacher!', FALSE);

-- Question 3: Conversation 3
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'What is Lisa''s response?', 'MULTIPLE_CHOICE', 10);
SET @q1_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c3_id, 'My name is Lisa.', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c3_id, 'I name is Lisa.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c3_id, 'Me name is Lisa.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c3_id, 'Name is Lisa.', FALSE);

-- Question 4: Conversation 4
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'What does Friend2 say?', 'MULTIPLE_CHOICE', 10);
SET @q1_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c4_id, 'Goodbye, have a nice day!', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c4_id, 'Hello, have a nice day!', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c4_id, 'Hi, have a nice day!', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c4_id, 'Thanks, have a nice day!', FALSE);

-- Question 5: Conversation 5
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (1, NULL, 'What does Bob reply?', 'MULTIPLE_CHOICE', 10);
SET @q1_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c5_id, 'Nice to meet you too!', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c5_id, 'Nice to meet you!', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c5_id, 'Nice meet you!', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q1_c5_id, 'Nice to you!', FALSE);


-- === LESSON 2: FAMILY ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (2, 2, 1, 'My Family', 'Từ vựng về gia đình và mô tả người thân.', 900, 0.2, 0.7, 0.1);

INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(2, 'Father', 'Bố', 'noun', 1), (2, 'Mother', 'Mẹ', 'noun', 1), (2, 'Brother', 'Anh em trai', 'noun', 1), (2, 'Sister', 'Chị em gái', 'noun', 1),
(2, 'Grandmother', 'Bà', 'noun', 1), (2, 'Grandfather', 'Ông', 'noun', 1), (2, 'Parents', 'Bố mẹ', 'noun', 1), (2, 'Uncle', 'Chú/Bác', 'noun', 1),
(2, 'Aunt', 'Cô/Dì', 'noun', 1), (2, 'Cousin', 'Anh chị em họ', 'noun', 1);

-- Ngữ pháp L2 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(2, 'Have/Has got', 'I have got a brother. She has got a sister.', 'Cấu trúc diễn tả sở hữu.', 'He has got two uncles.'),
(2, 'Family Members', 'Father, Mother, Brother, Sister, etc.', 'Các thành viên trong gia đình.', 'My father is a doctor.'),
(2, 'Possessive ''s', 'Tom''s father, Mary''s mother', 'Sở hữu cách với dấu nháy đơn.', 'This is John''s sister.'),
(2, 'This/That', 'This is my brother. That is my sister.', 'Cách chỉ người/vật gần/xa.', 'This is my family photo.'),
(2, 'Who questions', 'Who is this? Who is that?', 'Câu hỏi về người.', 'Who is that man?');

-- Câu hỏi Ngữ pháp L2 (5 questions)
-- Question 1: "My mother ___ a sister."
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'My mother ___ a sister.', 'MULTIPLE_CHOICE', 10);
SET @q2_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g1_id, 'has got', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g1_id, 'have got', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g1_id, 'is', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g1_id, 'are', FALSE);

-- Question 2: Family Members
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'What is the word for "Bố" in English?', 'MULTIPLE_CHOICE', 10);
SET @q2_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g2_id, 'Father', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g2_id, 'Mother', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g2_id, 'Brother', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g2_id, 'Sister', FALSE);

-- Question 3: Possessive 's
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'Complete: This is ___ father.', 'MULTIPLE_CHOICE', 10);
SET @q2_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g3_id, 'Tom''s', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g3_id, 'Toms', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g3_id, 'Tom', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g3_id, 'Toms''', FALSE);

-- Question 4: This/That
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'Complete: ___ is my grandmother.', 'MULTIPLE_CHOICE', 10);
SET @q2_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g4_id, 'This', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g4_id, 'These', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g4_id, 'Those', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g4_id, 'They', FALSE);

-- Question 5: Who questions
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'What is the correct question?', 'MULTIPLE_CHOICE', 10);
SET @q2_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g5_id, 'Who is this?', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g5_id, 'What is this?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g5_id, 'Where is this?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_g5_id, 'When is this?', FALSE);

-- Hội thoại L2 (5 conversations)
-- Conversation 1: Family Photo
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (6, 2, 'Family Photo', 'Xem ảnh gia đình');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(6, 'A', 'Who is this?', 'Đây là ai?', 1),
(6, 'B', 'This is my mother.', 'Đây là mẹ tôi.', 2);

-- Conversation 2: Introducing Family
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (7, 2, 'Introducing Family', 'Giới thiệu gia đình');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(7, 'A', 'This is my family.', 'Đây là gia đình tôi.', 1),
(7, 'B', 'How many people are in your family?', 'Gia đình bạn có bao nhiêu người?', 2),
(7, 'A', 'We have five people.', 'Chúng tôi có năm người.', 3);

-- Conversation 3: Talking about Parents
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (8, 2, 'Talking about Parents', 'Nói về bố mẹ');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(8, 'A', 'Who is that?', 'Đó là ai?', 1),
(8, 'B', 'That is my father.', 'Đó là bố tôi.', 2);

-- Conversation 4: Siblings
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (9, 2, 'Siblings', 'Anh chị em');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(9, 'A', 'Do you have any brothers?', 'Bạn có anh em trai không?', 1),
(9, 'B', 'Yes, I have one brother.', 'Có, tôi có một anh trai.', 2);

-- Conversation 5: Grandparents
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (10, 2, 'Grandparents', 'Ông bà');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(10, 'A', 'This is my grandmother.', 'Đây là bà tôi.', 1),
(10, 'B', 'She looks very kind.', 'Bà ấy trông rất hiền.', 2);

-- Câu hỏi Hội thoại L2 (5 questions)
-- Question 1: Conversation 1
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'What is the answer to "Who is this?"', 'MULTIPLE_CHOICE', 10);
SET @q2_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c1_id, 'This is my mother.', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c1_id, 'This is my father.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c1_id, 'This is my brother.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c1_id, 'This is my sister.', FALSE);

-- Question 2: Conversation 2
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'How many people are in the family?', 'MULTIPLE_CHOICE', 10);
SET @q2_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c2_id, 'Five', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c2_id, 'Four', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c2_id, 'Three', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c2_id, 'Six', FALSE);

-- Question 3: Conversation 3
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'Who is that?', 'MULTIPLE_CHOICE', 10);
SET @q2_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c3_id, 'That is my father.', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c3_id, 'That is my mother.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c3_id, 'That is my brother.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c3_id, 'That is my sister.', FALSE);

-- Question 4: Conversation 4
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'How many brothers does B have?', 'MULTIPLE_CHOICE', 10);
SET @q2_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c4_id, 'One', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c4_id, 'Two', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c4_id, 'Three', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c4_id, 'None', FALSE);

-- Question 5: Conversation 5
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (2, NULL, 'What does B say about the grandmother?', 'MULTIPLE_CHOICE', 10);
SET @q2_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c5_id, 'She looks very kind.', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c5_id, 'She looks very old.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c5_id, 'She looks very young.', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q2_c5_id, 'She looks very tall.', FALSE);

-- === LESSON 3: DAILY ROUTINE ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (3, 3, 1, 'Daily Routine', 'Hoạt động hàng ngày', 950, 0.3, 0.5, 0.2);

-- Từ vựng L3 (10 words)
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(3, 'Wake up', 'Thức dậy', 'verb', 1), (3, 'Brush', 'Đánh răng', 'verb', 1), (3, 'Breakfast', 'Bữa sáng', 'noun', 1), (3, 'School', 'Trường học', 'noun', 1),
(3, 'Lunch', 'Bữa trưa', 'noun', 1), (3, 'Homework', 'Bài tập về nhà', 'noun', 1), (3, 'Dinner', 'Bữa tối', 'noun', 1), (3, 'Sleep', 'Ngủ', 'verb', 1),
(3, 'Shower', 'Tắm', 'verb', 1), (3, 'Exercise', 'Tập thể dục', 'verb', 1);

-- Ngữ pháp L3 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(3, 'Present Simple', 'I wake up at 7 AM. She goes to school.', 'Thì hiện tại đơn diễn tả thói quen.', 'I brush my teeth every morning.'),
(3, 'Daily Activities', 'Wake up, brush teeth, have breakfast, go to school.', 'Các hoạt động hàng ngày.', 'I have breakfast at 8 AM.'),
(3, 'Time Expressions', 'At 7 AM, in the morning, in the afternoon, in the evening.', 'Các cách diễn đạt thời gian.', 'I go to school in the morning.'),
(3, 'Frequency Adverbs', 'Always, usually, often, sometimes, never.', 'Trạng từ tần suất.', 'I always brush my teeth.'),
(3, 'Routine Questions', 'What time do you wake up? When do you have breakfast?', 'Câu hỏi về thói quen.', 'What time do you go to bed?');

-- Câu hỏi Ngữ pháp L3 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'I ___ up at 7 AM every day.', 'MULTIPLE_CHOICE', 10);
SET @q3_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g1_id, 'wake', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g1_id, 'wakes', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g1_id, 'waking', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g1_id, 'woke', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'She ___ to school in the morning.', 'MULTIPLE_CHOICE', 10);
SET @q3_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g2_id, 'goes', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g2_id, 'go', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g2_id, 'going', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g2_id, 'went', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'What time do you have breakfast?', 'MULTIPLE_CHOICE', 10);
SET @q3_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g3_id, 'At 8 AM', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g3_id, 'In 8 AM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g3_id, 'On 8 AM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g3_id, 'For 8 AM', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'I ___ brush my teeth in the morning.', 'MULTIPLE_CHOICE', 10);
SET @q3_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g4_id, 'always', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g4_id, 'alwaysly', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g4_id, 'all time', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g4_id, 'everytime', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'When do you do your homework?', 'MULTIPLE_CHOICE', 10);
SET @q3_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g5_id, 'In the evening', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g5_id, 'At the evening', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g5_id, 'On the evening', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_g5_id, 'For the evening', FALSE);

-- Hội thoại L3 (5 conversations)
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (11, 3, 'Morning Routine', 'Thói quen buổi sáng');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(11, 'A', 'What time do you wake up?', 'Bạn thức dậy lúc mấy giờ?', 1),
(11, 'B', 'I wake up at 7 AM.', 'Tôi thức dậy lúc 7 giờ sáng.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (12, 3, 'Breakfast Time', 'Giờ ăn sáng');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(12, 'A', 'Do you have breakfast?', 'Bạn có ăn sáng không?', 1),
(12, 'B', 'Yes, I always have breakfast at 8 AM.', 'Có, tôi luôn ăn sáng lúc 8 giờ.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (13, 3, 'School Day', 'Ngày đi học');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(13, 'A', 'When do you go to school?', 'Bạn đi học khi nào?', 1),
(13, 'B', 'I go to school in the morning.', 'Tôi đi học vào buổi sáng.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (14, 3, 'Evening Activities', 'Hoạt động buổi tối');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(14, 'A', 'What do you do in the evening?', 'Bạn làm gì vào buổi tối?', 1),
(14, 'B', 'I do my homework and have dinner.', 'Tôi làm bài tập và ăn tối.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (15, 3, 'Bedtime', 'Giờ đi ngủ');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(15, 'A', 'What time do you go to bed?', 'Bạn đi ngủ lúc mấy giờ?', 1),
(15, 'B', 'I go to bed at 10 PM.', 'Tôi đi ngủ lúc 10 giờ tối.', 2);

-- Câu hỏi Hội thoại L3 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'What time does B wake up?', 'MULTIPLE_CHOICE', 10);
SET @q3_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c1_id, '7 AM', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c1_id, '8 AM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c1_id, '6 AM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c1_id, '9 AM', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'When does B have breakfast?', 'MULTIPLE_CHOICE', 10);
SET @q3_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c2_id, 'At 8 AM', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c2_id, 'At 7 AM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c2_id, 'At 9 AM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c2_id, 'At 10 AM', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'When does B go to school?', 'MULTIPLE_CHOICE', 10);
SET @q3_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c3_id, 'In the morning', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c3_id, 'In the afternoon', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c3_id, 'In the evening', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c3_id, 'At night', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'What does B do in the evening?', 'MULTIPLE_CHOICE', 10);
SET @q3_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c4_id, 'Do homework and have dinner', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c4_id, 'Watch TV', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c4_id, 'Play games', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c4_id, 'Go to school', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (3, NULL, 'What time does B go to bed?', 'MULTIPLE_CHOICE', 10);
SET @q3_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c5_id, '10 PM', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c5_id, '9 PM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c5_id, '11 PM', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q3_c5_id, '12 PM', FALSE);

-- === LESSON 4: COLORS & CLOTHES ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (4, 4, 1, 'Colors & Clothes', 'Màu sắc và quần áo', 1000, 0.2, 0.6, 0.2);

-- Từ vựng L4 (10 words)
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(4, 'Red', 'Đỏ', 'adjective', 1), (4, 'Blue', 'Xanh dương', 'adjective', 1), (4, 'Green', 'Xanh lá', 'adjective', 1), (4, 'Yellow', 'Vàng', 'adjective', 1),
(4, 'Shirt', 'Áo sơ mi', 'noun', 1), (4, 'Pants', 'Quần dài', 'noun', 1), (4, 'Dress', 'Váy', 'noun', 1), (4, 'Shoes', 'Giày', 'noun', 1),
(4, 'Hat', 'Mũ', 'noun', 1), (4, 'Socks', 'Tất', 'noun', 1);

-- Ngữ pháp L4 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(4, 'Colors', 'Red, blue, green, yellow, black, white.', 'Các màu sắc cơ bản.', 'I like red.'),
(4, 'Clothing Items', 'Shirt, pants, dress, shoes, hat.', 'Các loại quần áo.', 'I wear a blue shirt.'),
(4, 'What color?', 'What color is your shirt? It is blue.', 'Câu hỏi về màu sắc.', 'What color are your shoes?'),
(4, 'Wear/Put on', 'I wear a red dress. She puts on her shoes.', 'Cách diễn đạt mặc quần áo.', 'I wear blue pants.'),
(4, 'This/That with colors', 'This red shirt, that blue dress.', 'Kết hợp màu sắc với this/that.', 'I like this green hat.');

-- Câu hỏi Ngữ pháp L4 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'What color is the sky?', 'MULTIPLE_CHOICE', 10);
SET @q4_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g1_id, 'Blue', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g1_id, 'Red', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g1_id, 'Green', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g1_id, 'Yellow', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'I ___ a red shirt.', 'MULTIPLE_CHOICE', 10);
SET @q4_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g2_id, 'wear', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g2_id, 'wears', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g2_id, 'wearing', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g2_id, 'wore', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'What color ___ your dress?', 'MULTIPLE_CHOICE', 10);
SET @q4_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g3_id, 'is', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g3_id, 'are', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g3_id, 'am', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g3_id, 'be', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'She ___ on her shoes.', 'MULTIPLE_CHOICE', 10);
SET @q4_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g4_id, 'puts', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g4_id, 'put', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g4_id, 'putting', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g4_id, 'putted', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'I like ___ blue hat.', 'MULTIPLE_CHOICE', 10);
SET @q4_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g5_id, 'this', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g5_id, 'these', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g5_id, 'that', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_g5_id, 'those', FALSE);

-- Hội thoại L4 (5 conversations)
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (16, 4, 'Talking about Colors', 'Nói về màu sắc');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(16, 'A', 'What color is your shirt?', 'Áo sơ mi của bạn màu gì?', 1),
(16, 'B', 'It is blue.', 'Nó màu xanh dương.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (17, 4, 'Buying Clothes', 'Mua quần áo');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(17, 'A', 'I like this red dress.', 'Tôi thích chiếc váy đỏ này.', 1),
(17, 'B', 'It looks nice on you.', 'Nó trông đẹp trên bạn.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (18, 4, 'Describing Clothes', 'Mô tả quần áo');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(18, 'A', 'What are you wearing?', 'Bạn đang mặc gì?', 1),
(18, 'B', 'I am wearing a green shirt and blue pants.', 'Tôi đang mặc áo xanh lá và quần xanh dương.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (19, 4, 'Favorite Color', 'Màu yêu thích');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(19, 'A', 'What is your favorite color?', 'Màu yêu thích của bạn là gì?', 1),
(19, 'B', 'My favorite color is yellow.', 'Màu yêu thích của tôi là vàng.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (20, 4, 'Getting Dressed', 'Mặc quần áo');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(20, 'A', 'Put on your shoes.', 'Đi giày vào.', 1),
(20, 'B', 'OK, I am putting on my shoes now.', 'Được, tôi đang đi giày.', 2);

-- Câu hỏi Hội thoại L4 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'What color is B''s shirt?', 'MULTIPLE_CHOICE', 10);
SET @q4_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c1_id, 'Blue', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c1_id, 'Red', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c1_id, 'Green', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c1_id, 'Yellow', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'What does A like?', 'MULTIPLE_CHOICE', 10);
SET @q4_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c2_id, 'A red dress', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c2_id, 'A blue shirt', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c2_id, 'A green hat', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c2_id, 'Yellow shoes', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'What is B wearing?', 'MULTIPLE_CHOICE', 10);
SET @q4_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c3_id, 'A green shirt and blue pants', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c3_id, 'A red dress', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c3_id, 'Blue shoes', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c3_id, 'A yellow hat', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'What is B''s favorite color?', 'MULTIPLE_CHOICE', 10);
SET @q4_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c4_id, 'Yellow', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c4_id, 'Red', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c4_id, 'Blue', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c4_id, 'Green', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (4, NULL, 'What is B doing?', 'MULTIPLE_CHOICE', 10);
SET @q4_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c5_id, 'Putting on shoes', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c5_id, 'Wearing a shirt', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c5_id, 'Buying a dress', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q4_c5_id, 'Taking off hat', FALSE);


-- -----------------------------------------------------------------
-- LEVEL 2: MEDIUM (LESSON 5-8)
-- -----------------------------------------------------------------

-- === LESSON 5: TRAVEL & AIRPORT ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (5, 5, 2, 'Travel & Airport', 'Thủ tục sân bay và đặt vé.', 1100, 0.4, 0.4, 0.2);

INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(5, 'Passport', 'Hộ chiếu', 'noun', 2), (5, 'Ticket', 'Vé', 'noun', 2), (5, 'Luggage', 'Hành lý', 'noun', 2), (5, 'Gate', 'Cổng', 'noun', 2),
(5, 'Boarding', 'Lên máy bay', 'noun', 2), (5, 'Delayed', 'Bị hoãn', 'adjective', 2), (5, 'Arrival', 'Đến nơi', 'noun', 2), (5, 'Departure', 'Khởi hành', 'noun', 2),
(5, 'Customs', 'Hải quan', 'noun', 2), (5, 'Seat', 'Chỗ ngồi', 'noun', 2);

-- Ngữ pháp L5 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(5, 'Future Simple (Will)', 'Use "Will" for future actions.', 'Thì tương lai đơn.', 'I will travel to Japan.'),
(5, 'Modals (May/Can)', 'May I see your passport?', 'Động từ khuyết thiếu để yêu cầu lịch sự.', 'Can you help me?'),
(5, 'Airport Vocabulary', 'Passport, ticket, luggage, gate, boarding.', 'Từ vựng sân bay.', 'Show me your passport, please.'),
(5, 'Asking for Help', 'Can you help me? Could you please...?', 'Cách yêu cầu giúp đỡ.', 'Could you help me with my luggage?'),
(5, 'Flight Information', 'Departure time, arrival time, gate number.', 'Thông tin chuyến bay.', 'What time does the flight depart?');

-- Câu hỏi Ngữ pháp L5 (5 questions)
-- Question 1: "The plane ___ arrive at 9 PM."
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'The plane ___ arrive at 9 PM.', 'MULTIPLE_CHOICE', 10);
SET @q5_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q5_g1_id, 'will', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q5_g1_id, 'did', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q5_g1_id, 'is', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q5_g1_id, 'has', FALSE);

-- Question 2: Modals
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, '___ I see your ticket?', 'MULTIPLE_CHOICE', 10);
SET @q5_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g2_id, 'May', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g2_id, 'Must', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g2_id, 'Should', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g2_id, 'Will', FALSE);

-- Question 3: Airport Vocabulary
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'What do you need to show at the airport?', 'MULTIPLE_CHOICE', 10);
SET @q5_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g3_id, 'Passport', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g3_id, 'Phone', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g3_id, 'Book', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g3_id, 'Pen', FALSE);

-- Question 4: Asking for Help
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'Complete: ___ you help me with my luggage?', 'MULTIPLE_CHOICE', 10);
SET @q5_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g4_id, 'Can', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g4_id, 'Will', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g4_id, 'Do', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g4_id, 'Are', FALSE);

-- Question 5: Flight Information
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'What time does the flight ___?', 'MULTIPLE_CHOICE', 10);
SET @q5_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g5_id, 'depart', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g5_id, 'departs', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g5_id, 'departing', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_g5_id, 'departed', FALSE);

-- Hội thoại L5 (5 conversations)
-- Conversation 1: Check-in Counter
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (21, 5, 'Check-in Counter', 'Tại quầy làm thủ tục');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(21, 'Staff', 'May I have your passport?', 'Cho tôi xem hộ chiếu.', 1),
(21, 'Guest', 'Here you go.', 'Của bạn đây.', 2);

-- Conversation 2: Asking about Gate
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (22, 5, 'Asking about Gate', 'Hỏi về cổng');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(22, 'Passenger', 'What gate is my flight?', 'Chuyến bay của tôi ở cổng nào?', 1),
(22, 'Staff', 'Gate 12, please go to gate 12.', 'Cổng 12, vui lòng đi đến cổng 12.', 2);

-- Conversation 3: Delayed Flight
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (23, 5, 'Delayed Flight', 'Chuyến bay bị hoãn');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(23, 'Announcement', 'Flight 123 is delayed by 30 minutes.', 'Chuyến bay 123 bị hoãn 30 phút.', 1),
(23, 'Passenger', 'Oh no, I have a meeting!', 'Ồ không, tôi có cuộc họp!', 2);

-- Conversation 4: Boarding
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (24, 5, 'Boarding', 'Lên máy bay');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(24, 'Staff', 'Boarding now for flight 456.', 'Bắt đầu lên máy bay cho chuyến 456.', 1),
(24, 'Passenger', 'Thank you!', 'Cảm ơn!', 2);

-- Conversation 5: Customs
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (25, 5, 'Customs', 'Hải quan');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(25, 'Officer', 'Do you have anything to declare?', 'Bạn có gì cần khai báo không?', 1),
(25, 'Traveler', 'No, nothing to declare.', 'Không, không có gì để khai báo.', 2);

-- Câu hỏi Hội thoại L5 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'What does the staff ask for?', 'MULTIPLE_CHOICE', 10);
SET @q5_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c1_id, 'Passport', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c1_id, 'Ticket', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c1_id, 'Luggage', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c1_id, 'Phone', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'What gate is the flight?', 'MULTIPLE_CHOICE', 10);
SET @q5_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c2_id, 'Gate 12', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c2_id, 'Gate 10', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c2_id, 'Gate 15', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c2_id, 'Gate 20', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'How long is the flight delayed?', 'MULTIPLE_CHOICE', 10);
SET @q5_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c3_id, '30 minutes', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c3_id, '15 minutes', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c3_id, '1 hour', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c3_id, '45 minutes', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'What flight is boarding?', 'MULTIPLE_CHOICE', 10);
SET @q5_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c4_id, 'Flight 456', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c4_id, 'Flight 123', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c4_id, 'Flight 789', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c4_id, 'Flight 321', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (5, NULL, 'What does the officer ask?', 'MULTIPLE_CHOICE', 10);
SET @q5_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c5_id, 'Do you have anything to declare?', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c5_id, 'Where are you going?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c5_id, 'What is your name?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q5_c5_id, 'How are you?', FALSE);


-- === LESSON 6: RESTAURANT & FOOD ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (6, 6, 2, 'Restaurant & Food', 'Gọi món và văn hóa ăn uống.', 1150, 0.2, 0.6, 0.2);

INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(6, 'Menu', 'Thực đơn', 'noun', 2), (6, 'Order', 'Gọi món', 'verb', 2), (6, 'Delicious', 'Ngon', 'adjective', 2), (6, 'Spicy', 'Cay', 'adjective', 2),
(6, 'Bill', 'Hóa đơn', 'noun', 2), (6, 'Waiter', 'Bồi bàn', 'noun', 2), (6, 'Chef', 'Đầu bếp', 'noun', 2), (6, 'Dessert', 'Tráng miệng', 'noun', 2),
(6, 'Main course', 'Món chính', 'noun', 2), (6, 'Drink', 'Đồ uống', 'noun', 2);

-- Ngữ pháp L6 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(6, 'Would like', 'I would like a pizza.', 'Dùng để gọi món lịch sự.', 'Would you like some water?'),
(6, 'Food Vocabulary', 'Menu, order, delicious, spicy, bill, waiter.', 'Từ vựng về nhà hàng.', 'The food is delicious.'),
(6, 'Asking for Menu', 'Can I see the menu? May I have the menu?', 'Cách xin thực đơn.', 'Can I see the menu, please?'),
(6, 'Ordering Food', 'I would like... I will have...', 'Cách gọi món.', 'I would like a burger.'),
(6, 'Asking about Food', 'What would you like? What do you recommend?', 'Câu hỏi về món ăn.', 'What would you like to eat?');

-- Câu hỏi Ngữ pháp L6 (5 questions)
-- Question 1: "I ___ like a cup of tea."
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'I ___ like a cup of tea.', 'MULTIPLE_CHOICE', 10);
SET @q6_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q6_g1_id, 'would', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q6_g1_id, 'want', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q6_g1_id, 'can', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q6_g1_id, 'do', FALSE);

-- Question 2: Food Vocabulary
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'What do you call the list of food in a restaurant?', 'MULTIPLE_CHOICE', 10);
SET @q6_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g2_id, 'Menu', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g2_id, 'List', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g2_id, 'Paper', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g2_id, 'Book', FALSE);

-- Question 3: Asking for Menu
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'Complete: ___ I see the menu?', 'MULTIPLE_CHOICE', 10);
SET @q6_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g3_id, 'Can', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g3_id, 'Will', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g3_id, 'Do', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g3_id, 'Are', FALSE);

-- Question 4: Ordering Food
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'Complete: I ___ like a burger.', 'MULTIPLE_CHOICE', 10);
SET @q6_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g4_id, 'would', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g4_id, 'will', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g4_id, 'can', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g4_id, 'want', FALSE);

-- Question 5: Asking about Food
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'What ___ you like to eat?', 'MULTIPLE_CHOICE', 10);
SET @q6_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g5_id, 'would', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g5_id, 'will', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g5_id, 'do', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_g5_id, 'are', FALSE);

-- Hội thoại L6 (5 conversations)
-- Conversation 1: Ordering Food
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (26, 6, 'Ordering Food', 'Gọi món ăn');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(26, 'Waiter', 'Are you ready to order?', 'Quý khách gọi món chưa?', 1),
(26, 'Customer', 'Yes, I would like the steak.', 'Vâng, cho tôi món bít tết.', 2);

-- Conversation 2: Asking for Menu
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (27, 6, 'Asking for Menu', 'Xin thực đơn');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(27, 'Customer', 'Can I see the menu, please?', 'Cho tôi xem thực đơn được không?', 1),
(27, 'Waiter', 'Of course, here is the menu.', 'Tất nhiên, đây là thực đơn.', 2);

-- Conversation 3: Asking for Recommendation
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (28, 6, 'Asking for Recommendation', 'Hỏi gợi ý');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(28, 'Customer', 'What do you recommend?', 'Bạn gợi ý món gì?', 1),
(28, 'Waiter', 'The pasta is very delicious.', 'Món pasta rất ngon.', 2);

-- Conversation 4: Paying the Bill
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (29, 6, 'Paying the Bill', 'Thanh toán');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(29, 'Customer', 'Can I have the bill, please?', 'Cho tôi hóa đơn được không?', 1),
(29, 'Waiter', 'Here is your bill.', 'Đây là hóa đơn của bạn.', 2);

-- Conversation 5: Complimenting Food
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (30, 6, 'Complimenting Food', 'Khen món ăn');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(30, 'Customer', 'The food is delicious!', 'Món ăn rất ngon!', 1),
(30, 'Waiter', 'Thank you very much!', 'Cảm ơn bạn rất nhiều!', 2);

-- Câu hỏi Hội thoại L6 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'What does the customer order?', 'MULTIPLE_CHOICE', 10);
SET @q6_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c1_id, 'Steak', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c1_id, 'Pizza', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c1_id, 'Pasta', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c1_id, 'Burger', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'What does the customer ask for?', 'MULTIPLE_CHOICE', 10);
SET @q6_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c2_id, 'The menu', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c2_id, 'The bill', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c2_id, 'Water', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c2_id, 'Food', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'What does the waiter recommend?', 'MULTIPLE_CHOICE', 10);
SET @q6_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c3_id, 'Pasta', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c3_id, 'Steak', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c3_id, 'Pizza', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c3_id, 'Burger', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'What does the customer ask for at the end?', 'MULTIPLE_CHOICE', 10);
SET @q6_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c4_id, 'The bill', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c4_id, 'The menu', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c4_id, 'More food', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c4_id, 'Water', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (6, NULL, 'What does the customer say about the food?', 'MULTIPLE_CHOICE', 10);
SET @q6_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c5_id, 'It is delicious', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c5_id, 'It is bad', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c5_id, 'It is spicy', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q6_c5_id, 'It is cold', FALSE);

-- === LESSON 7: HOBBIES & SPORTS ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (7, 7, 2, 'Hobbies & Sports', 'Sở thích và thể thao', 1200, 0.3, 0.5, 0.2);

-- Từ vựng L7 (10 words)
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(7, 'Football', 'Bóng đá', 'noun', 2), (7, 'Basketball', 'Bóng rổ', 'noun', 2), (7, 'Swimming', 'Bơi lội', 'noun', 2), (7, 'Reading', 'Đọc sách', 'noun', 2),
(7, 'Music', 'Âm nhạc', 'noun', 2), (7, 'Dancing', 'Khiêu vũ', 'noun', 2), (7, 'Drawing', 'Vẽ', 'noun', 2), (7, 'Playing', 'Chơi', 'verb', 2),
(7, 'Watching', 'Xem', 'verb', 2), (7, 'Listening', 'Nghe', 'verb', 2);

-- Ngữ pháp L7 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(7, 'Like + Gerund', 'I like playing football. She likes reading books.', 'Thích làm gì với động từ thêm -ing.', 'I like swimming.'),
(7, 'What do you like?', 'What do you like to do? What are your hobbies?', 'Câu hỏi về sở thích.', 'What do you like to do in your free time?'),
(7, 'Sports Vocabulary', 'Football, basketball, swimming, tennis.', 'Từ vựng về thể thao.', 'I play football every weekend.'),
(7, 'Hobby Expressions', 'In my free time, I like... My hobby is...', 'Cách diễn đạt sở thích.', 'In my free time, I like reading.'),
(7, 'Frequency with Hobbies', 'I always play football. I sometimes go swimming.', 'Tần suất với sở thích.', 'I often play basketball.');

-- Câu hỏi Ngữ pháp L7 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'I like ___ football.', 'MULTIPLE_CHOICE', 10);
SET @q7_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g1_id, 'playing', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g1_id, 'play', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g1_id, 'plays', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g1_id, 'played', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'What do you like to ___?', 'MULTIPLE_CHOICE', 10);
SET @q7_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g2_id, 'do', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g2_id, 'does', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g2_id, 'doing', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g2_id, 'did', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'I ___ basketball every weekend.', 'MULTIPLE_CHOICE', 10);
SET @q7_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g3_id, 'play', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g3_id, 'plays', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g3_id, 'playing', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g3_id, 'played', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'Complete: In my free time, I like ___.', 'MULTIPLE_CHOICE', 10);
SET @q7_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g4_id, 'reading', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g4_id, 'read', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g4_id, 'reads', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g4_id, 'readed', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'I ___ go swimming.', 'MULTIPLE_CHOICE', 10);
SET @q7_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g5_id, 'sometimes', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g5_id, 'sometime', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g5_id, 'some time', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_g5_id, 'some times', FALSE);

-- Hội thoại L7 (5 conversations)
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (31, 7, 'Talking about Hobbies', 'Nói về sở thích');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(31, 'A', 'What do you like to do?', 'Bạn thích làm gì?', 1),
(31, 'B', 'I like playing football.', 'Tôi thích chơi bóng đá.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (32, 7, 'Sports Discussion', 'Thảo luận về thể thao');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(32, 'A', 'Do you play any sports?', 'Bạn có chơi môn thể thao nào không?', 1),
(32, 'B', 'Yes, I play basketball.', 'Có, tôi chơi bóng rổ.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (33, 7, 'Free Time Activities', 'Hoạt động thời gian rảnh');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(33, 'A', 'What do you do in your free time?', 'Bạn làm gì trong thời gian rảnh?', 1),
(33, 'B', 'I like reading books and listening to music.', 'Tôi thích đọc sách và nghe nhạc.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (34, 7, 'Favorite Sport', 'Môn thể thao yêu thích');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(34, 'A', 'What is your favorite sport?', 'Môn thể thao yêu thích của bạn là gì?', 1),
(34, 'B', 'My favorite sport is swimming.', 'Môn thể thao yêu thích của tôi là bơi lội.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (35, 7, 'Weekend Activities', 'Hoạt động cuối tuần');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(35, 'A', 'What do you do on weekends?', 'Bạn làm gì vào cuối tuần?', 1),
(35, 'B', 'I usually play football with my friends.', 'Tôi thường chơi bóng đá với bạn bè.', 2);

-- Câu hỏi Hội thoại L7 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'What does B like to do?', 'MULTIPLE_CHOICE', 10);
SET @q7_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c1_id, 'Playing football', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c1_id, 'Playing basketball', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c1_id, 'Swimming', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c1_id, 'Reading', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'What sport does B play?', 'MULTIPLE_CHOICE', 10);
SET @q7_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c2_id, 'Basketball', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c2_id, 'Football', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c2_id, 'Swimming', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c2_id, 'Tennis', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'What does B do in free time?', 'MULTIPLE_CHOICE', 10);
SET @q7_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c3_id, 'Reading books and listening to music', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c3_id, 'Playing football', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c3_id, 'Watching TV', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c3_id, 'Swimming', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'What is B''s favorite sport?', 'MULTIPLE_CHOICE', 10);
SET @q7_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c4_id, 'Swimming', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c4_id, 'Football', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c4_id, 'Basketball', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c4_id, 'Tennis', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (7, NULL, 'What does B do on weekends?', 'MULTIPLE_CHOICE', 10);
SET @q7_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c5_id, 'Plays football with friends', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c5_id, 'Plays basketball alone', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c5_id, 'Goes swimming', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q7_c5_id, 'Reads books', FALSE);

-- === LESSON 8: SHOPPING ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (8, 8, 2, 'Shopping', 'Mua sắm và mặc cả', 1250, 0.2, 0.6, 0.2);

-- Từ vựng L8 (10 words)
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(8, 'Shop', 'Cửa hàng', 'noun', 2), (8, 'Buy', 'Mua', 'verb', 2), (8, 'Sell', 'Bán', 'verb', 2), (8, 'Price', 'Giá', 'noun', 2),
(8, 'Money', 'Tiền', 'noun', 2), (8, 'Cheap', 'Rẻ', 'adjective', 2), (8, 'Expensive', 'Đắt', 'adjective', 2), (8, 'Discount', 'Giảm giá', 'noun', 2),
(8, 'Size', 'Kích cỡ', 'noun', 2), (8, 'Try on', 'Thử', 'verb', 2);

-- Ngữ pháp L8 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(8, 'How much?', 'How much is this? How much does it cost?', 'Câu hỏi về giá.', 'How much is this shirt?'),
(8, 'Can I...?', 'Can I try this on? Can I see that?', 'Cách yêu cầu lịch sự.', 'Can I try on this dress?'),
(8, 'Shopping Vocabulary', 'Buy, sell, price, cheap, expensive, discount.', 'Từ vựng mua sắm.', 'This shirt is too expensive.'),
(8, 'Asking about Size', 'What size do you wear? Do you have size M?', 'Hỏi về kích cỡ.', 'What size is this?'),
(8, 'Bargaining', 'Can you give me a discount? Is there a sale?', 'Mặc cả, hỏi giảm giá.', 'Can you make it cheaper?');

-- Câu hỏi Ngữ pháp L8 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, '___ much is this shirt?', 'MULTIPLE_CHOICE', 10);
SET @q8_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g1_id, 'How', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g1_id, 'What', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g1_id, 'Where', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g1_id, 'When', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, '___ I try this on?', 'MULTIPLE_CHOICE', 10);
SET @q8_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g2_id, 'Can', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g2_id, 'Will', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g2_id, 'Do', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g2_id, 'Are', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'This shirt is too ___.', 'MULTIPLE_CHOICE', 10);
SET @q8_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g3_id, 'expensive', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g3_id, 'expensively', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g3_id, 'expense', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g3_id, 'expenses', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'What ___ do you wear?', 'MULTIPLE_CHOICE', 10);
SET @q8_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g4_id, 'size', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g4_id, 'sizes', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g4_id, 'sized', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g4_id, 'sizing', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'Can you give me a ___?', 'MULTIPLE_CHOICE', 10);
SET @q8_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g5_id, 'discount', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g5_id, 'discounts', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g5_id, 'discounting', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_g5_id, 'discounted', FALSE);

-- Hội thoại L8 (5 conversations)
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (36, 8, 'Asking Price', 'Hỏi giá');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(36, 'Customer', 'How much is this shirt?', 'Chiếc áo này giá bao nhiêu?', 1),
(36, 'Shopkeeper', 'It is 50 dollars.', 'Nó giá 50 đô la.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (37, 8, 'Trying on Clothes', 'Thử quần áo');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(37, 'Customer', 'Can I try this on?', 'Tôi có thể thử cái này không?', 1),
(37, 'Shopkeeper', 'Of course, the fitting room is over there.', 'Tất nhiên, phòng thử đồ ở đằng kia.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (38, 8, 'Asking about Size', 'Hỏi về kích cỡ');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(38, 'Customer', 'Do you have this in size M?', 'Bạn có cái này cỡ M không?', 1),
(38, 'Shopkeeper', 'Yes, we have size M.', 'Có, chúng tôi có cỡ M.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (39, 8, 'Bargaining', 'Mặc cả');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(39, 'Customer', 'Can you give me a discount?', 'Bạn có thể giảm giá cho tôi không?', 1),
(39, 'Shopkeeper', 'I can give you 10% off.', 'Tôi có thể giảm 10% cho bạn.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (40, 8, 'Buying Decision', 'Quyết định mua');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(40, 'Customer', 'I will take it.', 'Tôi sẽ lấy nó.', 1),
(40, 'Shopkeeper', 'Great! That will be 45 dollars.', 'Tuyệt! Tổng cộng 45 đô la.', 2);

-- Câu hỏi Hội thoại L8 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'How much is the shirt?', 'MULTIPLE_CHOICE', 10);
SET @q8_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c1_id, '50 dollars', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c1_id, '40 dollars', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c1_id, '60 dollars', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c1_id, '45 dollars', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'What does the customer want to do?', 'MULTIPLE_CHOICE', 10);
SET @q8_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c2_id, 'Try it on', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c2_id, 'Buy it', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c2_id, 'Return it', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c2_id, 'Exchange it', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'What size does the customer ask for?', 'MULTIPLE_CHOICE', 10);
SET @q8_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c3_id, 'Size M', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c3_id, 'Size S', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c3_id, 'Size L', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c3_id, 'Size XL', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'What discount does the shopkeeper offer?', 'MULTIPLE_CHOICE', 10);
SET @q8_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c4_id, '10%', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c4_id, '5%', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c4_id, '15%', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c4_id, '20%', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (8, NULL, 'How much does the customer pay?', 'MULTIPLE_CHOICE', 10);
SET @q8_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c5_id, '45 dollars', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c5_id, '50 dollars', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c5_id, '40 dollars', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q8_c5_id, '55 dollars', FALSE);


-- -----------------------------------------------------------------
-- LEVEL 3: HARD (LESSON 9-12)
-- -----------------------------------------------------------------

-- === LESSON 9: TECHNOLOGY ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (9, 9, 3, 'Technology & AI', 'Từ vựng công nghệ cao và trí tuệ nhân tạo.', 1400, 0.4, 0.5, 0.1);

INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(9, 'Software', 'Phần mềm', 'noun', 3), (9, 'Database', 'Cơ sở dữ liệu', 'noun', 3), (9, 'Algorithm', 'Thuật toán', 'noun', 3), (9, 'Encryption', 'Mã hóa', 'noun', 3),
(9, 'Network', 'Mạng lưới', 'noun', 3), (9, 'Artificial Intelligence', 'Trí tuệ nhân tạo', 'noun', 3), (9, 'Cybersecurity', 'An ninh mạng', 'noun', 3), (9, 'Cloud', 'Đám mây', 'noun', 3),
(9, 'Developer', 'Lập trình viên', 'noun', 3), (9, 'Update', 'Cập nhật', 'verb', 3);

-- Ngữ pháp L9 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(9, 'Passive Voice', 'The data was processed by AI.', 'Câu bị động.', 'The file is being uploaded.'),
(9, 'Technology Vocabulary', 'Software, database, algorithm, encryption, network.', 'Từ vựng công nghệ.', 'I use this software every day.'),
(9, 'Present Perfect Passive', 'The system has been updated. The data has been saved.', 'Thì hiện tại hoàn thành bị động.', 'The website has been fixed.'),
(9, 'Technical Questions', 'How does this work? What is this used for?', 'Câu hỏi kỹ thuật.', 'How does the algorithm work?'),
(9, 'Giving Instructions', 'Click here. Press this button. Save the file.', 'Đưa ra hướng dẫn.', 'Click the save button.');

-- Câu hỏi Ngữ pháp L9 (5 questions)
-- Question 1: "The website ___ by the team yesterday."
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'The website ___ by the team yesterday.', 'MULTIPLE_CHOICE', 10);
SET @q9_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q9_g1_id, 'was built', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q9_g1_id, 'build', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q9_g1_id, 'is building', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q9_g1_id, 'builds', FALSE);

-- Question 2: Technology Vocabulary
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'What is "Phần mềm" in English?', 'MULTIPLE_CHOICE', 10);
SET @q9_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g2_id, 'Software', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g2_id, 'Hardware', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g2_id, 'Database', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g2_id, 'Network', FALSE);

-- Question 3: Present Perfect Passive
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'The system ___ updated.', 'MULTIPLE_CHOICE', 10);
SET @q9_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g3_id, 'has been', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g3_id, 'has', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g3_id, 'is', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g3_id, 'was', FALSE);

-- Question 4: Technical Questions
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, '___ does this software work?', 'MULTIPLE_CHOICE', 10);
SET @q9_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g4_id, 'How', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g4_id, 'What', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g4_id, 'Where', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g4_id, 'When', FALSE);

-- Question 5: Giving Instructions
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'Complete: ___ the save button.', 'MULTIPLE_CHOICE', 10);
SET @q9_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g5_id, 'Click', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g5_id, 'Clicks', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g5_id, 'Clicking', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_g5_id, 'Clicked', FALSE);

-- Hội thoại L9 (5 conversations)
-- Conversation 1: IT Support
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (41, 9, 'IT Support', 'Hỗ trợ kỹ thuật');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(41, 'User', 'My computer is freezing.', 'Máy tính tôi bị treo.', 1),
(41, 'IT', 'Have you tried restarting it?', 'Bạn đã thử khởi động lại chưa?', 2);

-- Conversation 2: Software Installation
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (42, 9, 'Software Installation', 'Cài đặt phần mềm');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(42, 'User', 'How do I install this software?', 'Làm thế nào để cài đặt phần mềm này?', 1),
(42, 'Tech', 'Click the install button and follow the instructions.', 'Nhấp vào nút cài đặt và làm theo hướng dẫn.', 2);

-- Conversation 3: System Update
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (43, 9, 'System Update', 'Cập nhật hệ thống');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(43, 'User', 'The system needs an update.', 'Hệ thống cần cập nhật.', 1),
(43, 'Admin', 'The update has been installed automatically.', 'Bản cập nhật đã được cài đặt tự động.', 2);

-- Conversation 4: Data Backup
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (44, 9, 'Data Backup', 'Sao lưu dữ liệu');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(44, 'User', 'How do I backup my data?', 'Làm thế nào để sao lưu dữ liệu?', 1),
(44, 'Tech', 'Your data is automatically saved to the cloud.', 'Dữ liệu của bạn được tự động lưu lên đám mây.', 2);

-- Conversation 5: Network Problem
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (45, 9, 'Network Problem', 'Vấn đề mạng');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(45, 'User', 'I cannot connect to the network.', 'Tôi không thể kết nối mạng.', 1),
(45, 'IT', 'Check your network settings and restart the router.', 'Kiểm tra cài đặt mạng và khởi động lại router.', 2);

-- Câu hỏi Hội thoại L9 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'What is the problem?', 'MULTIPLE_CHOICE', 10);
SET @q9_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c1_id, 'Computer is freezing', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c1_id, 'Computer is slow', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c1_id, 'Computer is broken', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c1_id, 'Computer is off', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'What should the user do?', 'MULTIPLE_CHOICE', 10);
SET @q9_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c2_id, 'Click install button and follow instructions', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c2_id, 'Restart computer', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c2_id, 'Delete software', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c2_id, 'Call IT support', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'How was the update installed?', 'MULTIPLE_CHOICE', 10);
SET @q9_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c3_id, 'Automatically', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c3_id, 'Manually', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c3_id, 'By IT staff', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c3_id, 'By user', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'Where is the data saved?', 'MULTIPLE_CHOICE', 10);
SET @q9_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c4_id, 'To the cloud', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c4_id, 'To the computer', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c4_id, 'To USB', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c4_id, 'To CD', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (9, NULL, 'What should the user check?', 'MULTIPLE_CHOICE', 10);
SET @q9_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c5_id, 'Network settings and restart router', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c5_id, 'Computer settings', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c5_id, 'Software settings', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q9_c5_id, 'Internet browser', FALSE);


-- === LESSON 10: ENVIRONMENT ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (10, 10, 3, 'Environment', 'Môi trường và biến đổi khí hậu.', 1450, 0.3, 0.5, 0.2);

INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(10, 'Pollution', 'Ô nhiễm', 'noun', 3), (10, 'Global Warming', 'Nóng lên toàn cầu', 'noun', 3), (10, 'Recycle', 'Tái chế', 'verb', 3), (10, 'Protect', 'Bảo vệ', 'verb', 3),
(10, 'Energy', 'Năng lượng', 'noun', 3), (10, 'Climate', 'Khí hậu', 'noun', 3), (10, 'Waste', 'Rác thải', 'noun', 3), (10, 'Solar', 'Năng lượng mặt trời', 'adjective', 3),
(10, 'Forest', 'Rừng', 'noun', 3), (10, 'Carbon', 'Carbon', 'noun', 3);

-- Ngữ pháp L10 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(10, 'Conditional Type 1', 'If we pollute, the earth will suffer.', 'Câu điều kiện loại 1.', 'If it rains, we will stay home.'),
(10, 'Environment Vocabulary', 'Pollution, global warming, recycle, protect, energy.', 'Từ vựng môi trường.', 'We need to protect the environment.'),
(10, 'Should/Must for Advice', 'We should recycle. We must protect nature.', 'Should/Must để đưa lời khuyên.', 'We should use less plastic.'),
(10, 'Cause and Effect', 'Pollution causes global warming. Cutting trees causes problems.', 'Nguyên nhân và hậu quả.', 'Pollution causes health problems.'),
(10, 'Environmental Actions', 'Recycle, reduce, reuse, protect, save energy.', 'Các hành động bảo vệ môi trường.', 'We should recycle more.');

-- Câu hỏi Ngữ pháp L10 (5 questions)
-- Question 1: "If we cut down trees, oxygen ___ decrease."
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'If we cut down trees, oxygen ___ decrease.', 'MULTIPLE_CHOICE', 10);
SET @q10_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q10_g1_id, 'will', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q10_g1_id, 'would', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q10_g1_id, 'did', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@q10_g1_id, 'had', FALSE);

-- Question 2: Environment Vocabulary
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'What is "Ô nhiễm" in English?', 'MULTIPLE_CHOICE', 10);
SET @q10_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g2_id, 'Pollution', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g2_id, 'Protection', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g2_id, 'Recycling', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g2_id, 'Energy', FALSE);

-- Question 3: Should/Must
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'We ___ recycle more.', 'MULTIPLE_CHOICE', 10);
SET @q10_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g3_id, 'should', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g3_id, 'will', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g3_id, 'can', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g3_id, 'do', FALSE);

-- Question 4: Cause and Effect
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'Pollution ___ global warming.', 'MULTIPLE_CHOICE', 10);
SET @q10_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g4_id, 'causes', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g4_id, 'cause', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g4_id, 'causing', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g4_id, 'caused', FALSE);

-- Question 5: Environmental Actions
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'What should we do with plastic bottles?', 'MULTIPLE_CHOICE', 10);
SET @q10_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g5_id, 'Recycle', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g5_id, 'Throw away', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g5_id, 'Burn', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_g5_id, 'Bury', FALSE);

-- Hội thoại L10 (5 conversations)
-- Conversation 1: Recycling
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (46, 10, 'Recycling', 'Tái chế rác');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(46, 'A', 'Where should I put this bottle?', 'Tôi nên bỏ chai này ở đâu?', 1),
(46, 'B', 'Put it in the green bin for recycling.', 'Bỏ vào thùng xanh để tái chế.', 2);

-- Conversation 2: Saving Energy
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (47, 10, 'Saving Energy', 'Tiết kiệm năng lượng');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(47, 'A', 'We should save energy.', 'Chúng ta nên tiết kiệm năng lượng.', 1),
(47, 'B', 'Yes, let''s turn off the lights when not needed.', 'Đúng, hãy tắt đèn khi không cần.', 2);

-- Conversation 3: Protecting Nature
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (48, 10, 'Protecting Nature', 'Bảo vệ thiên nhiên');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(48, 'A', 'We must protect the forests.', 'Chúng ta phải bảo vệ rừng.', 1),
(48, 'B', 'I agree, forests are very important.', 'Tôi đồng ý, rừng rất quan trọng.', 2);

-- Conversation 4: Reducing Waste
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (49, 10, 'Reducing Waste', 'Giảm rác thải');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(49, 'A', 'How can we reduce waste?', 'Làm thế nào để giảm rác thải?', 1),
(49, 'B', 'We should use less plastic and recycle more.', 'Chúng ta nên dùng ít nhựa hơn và tái chế nhiều hơn.', 2);

-- Conversation 5: Climate Change
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (50, 10, 'Climate Change', 'Biến đổi khí hậu');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(50, 'A', 'Global warming is a serious problem.', 'Nóng lên toàn cầu là vấn đề nghiêm trọng.', 1),
(50, 'B', 'Yes, we need to take action now.', 'Đúng, chúng ta cần hành động ngay bây giờ.', 2);

-- Câu hỏi Hội thoại L10 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'Where should the bottle be put?', 'MULTIPLE_CHOICE', 10);
SET @q10_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c1_id, 'In the green bin for recycling', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c1_id, 'In the trash', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c1_id, 'On the ground', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c1_id, 'In the river', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'What should we do to save energy?', 'MULTIPLE_CHOICE', 10);
SET @q10_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c2_id, 'Turn off lights when not needed', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c2_id, 'Leave lights on', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c2_id, 'Use more electricity', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c2_id, 'Waste energy', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'What must we protect?', 'MULTIPLE_CHOICE', 10);
SET @q10_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c3_id, 'Forests', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c3_id, 'Pollution', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c3_id, 'Waste', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c3_id, 'Plastic', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'How can we reduce waste?', 'MULTIPLE_CHOICE', 10);
SET @q10_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c4_id, 'Use less plastic and recycle more', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c4_id, 'Use more plastic', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c4_id, 'Throw away everything', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c4_id, 'Burn all waste', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (10, NULL, 'What is a serious problem?', 'MULTIPLE_CHOICE', 10);
SET @q10_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c5_id, 'Global warming', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c5_id, 'Recycling', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c5_id, 'Saving energy', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q10_c5_id, 'Protecting forests', FALSE);

-- === LESSON 11: JOB INTERVIEW ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (11, 11, 3, 'Job Interview', 'Phỏng vấn xin việc', 1500, 0.3, 0.5, 0.2);

-- Từ vựng L11 (10 words)
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(11, 'Resume', 'Sơ yếu lý lịch', 'noun', 3), (11, 'Interview', 'Phỏng vấn', 'noun', 3), (11, 'Experience', 'Kinh nghiệm', 'noun', 3), (11, 'Qualification', 'Trình độ', 'noun', 3),
(11, 'Skill', 'Kỹ năng', 'noun', 3), (11, 'Position', 'Vị trí', 'noun', 3), (11, 'Salary', 'Lương', 'noun', 3), (11, 'Company', 'Công ty', 'noun', 3),
(11, 'Applicant', 'Ứng viên', 'noun', 3), (11, 'Employer', 'Nhà tuyển dụng', 'noun', 3);

-- Ngữ pháp L11 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(11, 'Present Perfect for Experience', 'I have worked in IT for 5 years. She has studied English.', 'Thì hiện tại hoàn thành cho kinh nghiệm.', 'I have worked as a teacher.'),
(11, 'Job Interview Questions', 'Tell me about yourself. Why do you want this job?', 'Câu hỏi phỏng vấn xin việc.', 'What are your strengths?'),
(11, 'Describing Skills', 'I am good at... I can... I have experience in...', 'Mô tả kỹ năng.', 'I am good at problem solving.'),
(11, 'Future Plans', 'I will... I am going to... I plan to...', 'Kế hoạch tương lai.', 'I plan to improve my skills.'),
(11, 'Professional Language', 'I would like to... I am interested in... I am looking for...', 'Ngôn ngữ chuyên nghiệp.', 'I am interested in this position.');

-- Câu hỏi Ngữ pháp L11 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'I ___ worked in IT for 5 years.', 'MULTIPLE_CHOICE', 10);
SET @q11_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g1_id, 'have', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g1_id, 'has', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g1_id, 'had', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g1_id, 'am', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'What is a common interview question?', 'MULTIPLE_CHOICE', 10);
SET @q11_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g2_id, 'Tell me about yourself', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g2_id, 'What is your name?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g2_id, 'How old are you?', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g2_id, 'Where do you live?', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'Complete: I am good ___ problem solving.', 'MULTIPLE_CHOICE', 10);
SET @q11_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g3_id, 'at', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g3_id, 'in', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g3_id, 'on', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g3_id, 'for', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'I ___ to improve my skills.', 'MULTIPLE_CHOICE', 10);
SET @q11_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g4_id, 'plan', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g4_id, 'plans', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g4_id, 'planning', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g4_id, 'planned', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'Complete: I am ___ in this position.', 'MULTIPLE_CHOICE', 10);
SET @q11_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g5_id, 'interested', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g5_id, 'interest', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g5_id, 'interesting', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_g5_id, 'interests', FALSE);

-- Hội thoại L11 (5 conversations)
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (51, 11, 'Interview Introduction', 'Giới thiệu phỏng vấn');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(51, 'Interviewer', 'Tell me about yourself.', 'Hãy giới thiệu về bản thân.', 1),
(51, 'Applicant', 'I have worked in IT for 5 years.', 'Tôi đã làm việc trong lĩnh vực IT được 5 năm.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (52, 11, 'Discussing Skills', 'Thảo luận kỹ năng');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(52, 'Interviewer', 'What are your strengths?', 'Điểm mạnh của bạn là gì?', 1),
(52, 'Applicant', 'I am good at problem solving and teamwork.', 'Tôi giỏi giải quyết vấn đề và làm việc nhóm.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (53, 11, 'Why This Job', 'Tại sao muốn công việc này');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(53, 'Interviewer', 'Why do you want this job?', 'Tại sao bạn muốn công việc này?', 1),
(53, 'Applicant', 'I am interested in this position and your company.', 'Tôi quan tâm đến vị trí này và công ty của bạn.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (54, 11, 'Future Plans', 'Kế hoạch tương lai');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(54, 'Interviewer', 'Where do you see yourself in 5 years?', 'Bạn thấy mình ở đâu trong 5 năm nữa?', 1),
(54, 'Applicant', 'I plan to improve my skills and grow with the company.', 'Tôi dự định cải thiện kỹ năng và phát triển cùng công ty.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (55, 11, 'Closing Interview', 'Kết thúc phỏng vấn');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(55, 'Interviewer', 'Do you have any questions?', 'Bạn có câu hỏi nào không?', 1),
(55, 'Applicant', 'Yes, what is the salary range for this position?', 'Có, mức lương cho vị trí này là bao nhiêu?', 2);

-- Câu hỏi Hội thoại L11 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'How long has the applicant worked in IT?', 'MULTIPLE_CHOICE', 10);
SET @q11_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c1_id, '5 years', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c1_id, '3 years', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c1_id, '7 years', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c1_id, '10 years', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'What are the applicant''s strengths?', 'MULTIPLE_CHOICE', 10);
SET @q11_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c2_id, 'Problem solving and teamwork', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c2_id, 'Coding and design', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c2_id, 'Writing and reading', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c2_id, 'Singing and dancing', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'Why does the applicant want this job?', 'MULTIPLE_CHOICE', 10);
SET @q11_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c3_id, 'Interested in position and company', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c3_id, 'Needs money', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c3_id, 'Wants to travel', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c3_id, 'Has no other choice', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'What does the applicant plan to do?', 'MULTIPLE_CHOICE', 10);
SET @q11_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c4_id, 'Improve skills and grow with company', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c4_id, 'Change jobs', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c4_id, 'Start own business', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c4_id, 'Retire', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (11, NULL, 'What does the applicant ask about?', 'MULTIPLE_CHOICE', 10);
SET @q11_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c5_id, 'Salary range', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c5_id, 'Working hours', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c5_id, 'Vacation days', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q11_c5_id, 'Company location', FALSE);

-- === LESSON 12: BUSINESS MEETING ===
INSERT INTO `lessons` (`id`, `lesson_number`, `level`, `name`, `description`, `difficulty_rating`, `grammar_weight`, `vocab_weight`, `listening_weight`) 
VALUES (12, 12, 3, 'Business Meeting', 'Họp kinh doanh', 1550, 0.3, 0.5, 0.2);

-- Từ vựng L12 (10 words)
INSERT INTO `vocabularies` (`lesson_id`, `word_english`, `vietnamese_meaning`, `word_type`, `difficulty_level`) VALUES
(12, 'Meeting', 'Cuộc họp', 'noun', 3), (12, 'Agenda', 'Chương trình', 'noun', 3), (12, 'Presentation', 'Thuyết trình', 'noun', 3), (12, 'Proposal', 'Đề xuất', 'noun', 3),
(12, 'Budget', 'Ngân sách', 'noun', 3), (12, 'Project', 'Dự án', 'noun', 3), (12, 'Deadline', 'Hạn chót', 'noun', 3), (12, 'Client', 'Khách hàng', 'noun', 3),
(12, 'Strategy', 'Chiến lược', 'noun', 3), (12, 'Decision', 'Quyết định', 'noun', 3);

-- Ngữ pháp L12 (5 grammar points)
INSERT INTO `grammars` (`lesson_id`, `title`, `explanation_english`, `explanation_vietnamese`, `example_sentences`) VALUES
(12, 'Business Meeting Phrases', 'Let''s start the meeting. I would like to discuss...', 'Cụm từ trong cuộc họp.', 'Let''s move on to the next topic.'),
(12, 'Making Suggestions', 'I suggest... I recommend... We should...', 'Đưa ra đề xuất.', 'I suggest we increase the budget.'),
(12, 'Asking for Opinions', 'What do you think? What is your opinion?', 'Hỏi ý kiến.', 'What do you think about this proposal?'),
(12, 'Agreeing/Disagreeing', 'I agree. I disagree. I think so too.', 'Đồng ý/Không đồng ý.', 'I agree with your suggestion.'),
(12, 'Summarizing', 'To summarize... In conclusion... Let me summarize...', 'Tóm tắt.', 'To summarize, we need to finish by Friday.');

-- Câu hỏi Ngữ pháp L12 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'Complete: Let''s ___ the meeting.', 'MULTIPLE_CHOICE', 10);
SET @q12_g1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g1_id, 'start', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g1_id, 'starts', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g1_id, 'starting', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g1_id, 'started', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'I ___ we increase the budget.', 'MULTIPLE_CHOICE', 10);
SET @q12_g2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g2_id, 'suggest', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g2_id, 'suggests', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g2_id, 'suggesting', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g2_id, 'suggested', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'What do you ___ about this?', 'MULTIPLE_CHOICE', 10);
SET @q12_g3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g3_id, 'think', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g3_id, 'thinks', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g3_id, 'thinking', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g3_id, 'thought', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'I ___ with your suggestion.', 'MULTIPLE_CHOICE', 10);
SET @q12_g4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g4_id, 'agree', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g4_id, 'agrees', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g4_id, 'agreeing', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g4_id, 'agreed', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'Complete: To ___, we need to finish by Friday.', 'MULTIPLE_CHOICE', 10);
SET @q12_g5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g5_id, 'summarize', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g5_id, 'summarizes', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g5_id, 'summarizing', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_g5_id, 'summarized', FALSE);

-- Hội thoại L12 (5 conversations)
INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (56, 12, 'Starting Meeting', 'Bắt đầu cuộc họp');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(56, 'Manager', 'Let''s start the meeting.', 'Hãy bắt đầu cuộc họp.', 1),
(56, 'Team', 'OK, we are ready.', 'Được, chúng tôi sẵn sàng.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (57, 12, 'Discussing Proposal', 'Thảo luận đề xuất');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(57, 'Manager', 'I suggest we increase the budget.', 'Tôi đề xuất tăng ngân sách.', 1),
(57, 'Team Member', 'I agree with your suggestion.', 'Tôi đồng ý với đề xuất của bạn.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (58, 12, 'Asking for Opinion', 'Hỏi ý kiến');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(58, 'Manager', 'What do you think about this proposal?', 'Bạn nghĩ gì về đề xuất này?', 1),
(58, 'Team Member', 'I think it is a good idea.', 'Tôi nghĩ đó là ý tưởng tốt.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (59, 12, 'Setting Deadline', 'Đặt hạn chót');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(59, 'Manager', 'We need to finish this project by Friday.', 'Chúng ta cần hoàn thành dự án này trước thứ Sáu.', 1),
(59, 'Team Member', 'That deadline is tight, but we can do it.', 'Hạn chót đó khá gấp, nhưng chúng ta có thể làm được.', 2);

INSERT INTO `conversations` (`id`, `lesson_id`, `title`, `description`) VALUES (60, 12, 'Closing Meeting', 'Kết thúc cuộc họp');
INSERT INTO `sentences` (`conversation_id`, `character_name`, `text_english`, `text_vietnamese`, `order_index`) VALUES
(60, 'Manager', 'To summarize, we will increase the budget and finish by Friday.', 'Tóm lại, chúng ta sẽ tăng ngân sách và hoàn thành trước thứ Sáu.', 1),
(60, 'Team', 'Understood. We will work on it.', 'Hiểu rồi. Chúng tôi sẽ làm việc đó.', 2);

-- Câu hỏi Hội thoại L12 (5 questions)
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'What does the manager want to do?', 'MULTIPLE_CHOICE', 10);
SET @q12_c1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c1_id, 'Start the meeting', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c1_id, 'End the meeting', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c1_id, 'Cancel the meeting', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c1_id, 'Postpone the meeting', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'What does the manager suggest?', 'MULTIPLE_CHOICE', 10);
SET @q12_c2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c2_id, 'Increase the budget', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c2_id, 'Decrease the budget', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c2_id, 'Keep the budget same', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c2_id, 'Cancel the budget', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'What does the team member think?', 'MULTIPLE_CHOICE', 10);
SET @q12_c3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c3_id, 'It is a good idea', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c3_id, 'It is a bad idea', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c3_id, 'It is too expensive', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c3_id, 'It is impossible', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'When is the deadline?', 'MULTIPLE_CHOICE', 10);
SET @q12_c4_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c4_id, 'Friday', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c4_id, 'Monday', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c4_id, 'Wednesday', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c4_id, 'Next week', FALSE);

INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (12, NULL, 'What is the summary?', 'MULTIPLE_CHOICE', 10);
SET @q12_c5_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c5_id, 'Increase budget and finish by Friday', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c5_id, 'Decrease budget and finish next week', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c5_id, 'Keep budget and finish next month', FALSE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES (@q12_c5_id, 'Cancel project', FALSE);


-- =================================================================
-- 3. TẠO BÀI KIỂM TRA (TESTS) CHO 12 BÀI HỌC
-- =================================================================

INSERT INTO `tests` (`id`, `name`, `level`, `passing_score`) VALUES 
(1, 'Test: Lesson 1', 1, 60), (2, 'Test: Lesson 2', 1, 60), (3, 'Test: Lesson 3', 1, 60), (4, 'Test: Lesson 4', 1, 60),
(5, 'Test: Lesson 5', 2, 70), (6, 'Test: Lesson 6', 2, 70), (7, 'Test: Lesson 7', 2, 70), (8, 'Test: Lesson 8', 2, 70),
(9, 'Test: Lesson 9', 3, 80), (10, 'Test: Lesson 10', 3, 80), (11, 'Test: Lesson 11', 3, 80), (12, 'Test: Lesson 12', 3, 80);

-- Chèn 1 câu hỏi mẫu cho mỗi bài Test (Mỗi câu hỏi và đáp án là INSERT riêng)
-- Test 1: "Hello means: "
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (NULL, 1, 'Hello means: ', 'MULTIPLE_CHOICE', 10);
SET @t1_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@t1_id, 'Xin chào', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@t1_id, 'Tạm biệt', FALSE);

-- Test 5: "Passport is used for: "
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (NULL, 5, 'Passport is used for: ', 'MULTIPLE_CHOICE', 10);
SET @t2_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@t2_id, 'Travel', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@t2_id, 'Cooking', FALSE);

-- Test 9: "AI stands for: "
INSERT INTO `questions` (`lesson_id`, `test_id`, `question_text`, `question_type`, `points`) 
VALUES (NULL, 9, 'AI stands for: ', 'MULTIPLE_CHOICE', 10);
SET @t3_id = LAST_INSERT_ID();
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@t3_id, 'Artificial Intelligence', TRUE);
INSERT INTO `answer_options` (`question_id`, `option_text`, `is_correct`) VALUES 
(@t3_id, 'Apple Inc', FALSE);

SELECT 'DATA SEEDING COMPLETE! 12 Realistic Lessons Created.' AS Status;