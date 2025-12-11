-- ============================================================
-- BƯỚC 1: LÀM SẠCH DỮ LIỆU CŨ (Giữ lại User, xóa nội dung học)
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE answer_options; -- Xóa tạm để tránh lỗi liên kết cũ
TRUNCATE TABLE questions;
TRUNCATE TABLE tests;
TRUNCATE TABLE sentences;
TRUNCATE TABLE conversations;
TRUNCATE TABLE grammars;
TRUNCATE TABLE vocabularies;
TRUNCATE TABLE lessons;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- BƯỚC 2: TẠO DANH SÁCH 25 BÀI HỌC THEO LỘ TRÌNH NGỮ PHÁP
-- ============================================================
INSERT INTO lessons (id, lesson_number, level, name, audio_url) VALUES 
-- LEVEL 1: TỪ LOẠI & THÌ CƠ BẢN
(1, 1, 1, 'Nouns & Articles (Danh từ & Mạo từ)', 'audio/l1.mp3'),
(2, 2, 1, 'Pronouns & Present Simple (Đại từ & HT Đơn)', 'audio/l2.mp3'),
(3, 3, 1, 'Verbs & Present Continuous (Động từ & HT Tiếp diễn)', 'audio/l3.mp3'),
(4, 4, 1, 'Adjectives & Comparisons (Tính từ & So sánh)', 'audio/l4.mp3'),
(5, 5, 1, 'Adverbs & Word Order (Trạng từ & Trật tự từ)', 'audio/l5.mp3'),
(6, 6, 1, 'Prepositions & Conjunctions (Giới từ & Liên từ)', 'audio/l6.mp3'),

-- LEVEL 2: THÌ QUÁ KHỨ, TƯƠNG LAI & CẤU TRÚC CÂU
(7, 7, 2, 'Past Simple (Quá khứ đơn)', 'audio/l7.mp3'),
(8, 8, 2, 'Future & Be Going To (Tương lai đơn & Gần)', 'audio/l8.mp3'),
(9, 9, 2, 'Passive Voice (Câu bị động)', 'audio/l9.mp3'),
(10, 10, 2, 'Conditional Sentences (Câu điều kiện)', 'audio/l10.mp3'),
(11, 11, 2, 'Relative Clauses (Mệnh đề quan hệ)', 'audio/l11.mp3'),
(12, 12, 2, 'Reported Speech (Câu tường thuật)', 'audio/l12.mp3'),

-- LEVEL 3: NÂNG CAO (MỆNH ĐỀ & SỰ HÒA HỢP)
(13, 13, 3, 'Subject-Verb Agreement (Hòa hợp Chủ-Vị)', 'audio/l13.mp3'),
(14, 14, 3, 'Parallel Structure (Cấu trúc song song)', 'audio/l14.mp3'),
(15, 15, 3, 'Noun Clauses (Mệnh đề danh từ)', 'audio/l15.mp3'),
(16, 16, 3, 'Adverbial Clauses (Mệnh đề trạng ngữ)', 'audio/l16.mp3'),
(17, 17, 3, 'Sequence of Tenses (Sự phối hợp thì)', 'audio/l17.mp3'),
(18, 18, 3, 'Connectors & Linking Words (Từ nối)', 'audio/l18.mp3'),

-- LEVEL 4 & 5: CÁC CHỦ ĐỀ THỰC HÀNH KHÁC
(19, 19, 4, 'Perfect Tenses (Các thì hoàn thành)', 'audio/l19.mp3'),
(20, 20, 4, 'Modal Verbs (Động từ khuyết thiếu)', 'audio/l20.mp3'),
(21, 21, 4, 'Gerunds & Infinitives (V-ing & To V)', 'audio/l21.mp3'),
(22, 22, 5, 'Inversion (Đảo ngữ)', 'audio/l22.mp3'),
(23, 23, 5, 'Phrasal Verbs (Cụm động từ)', 'audio/l23.mp3'),
(24, 24, 5, 'Idioms (Thành ngữ)', 'audio/l24.mp3'),
(25, 25, 5, 'Collocations (Các cụm từ cố định)', 'audio/l25.mp3');

-- ============================================================
-- BƯỚC 3: CHI TIẾT NỘI DUNG (TỪ BÀI 1 ĐẾN BÀI 4)
-- ============================================================

-- --- BÀI 1: DANH TỪ & MẠO TỪ (NOUNS & ARTICLES) ---
-- 10 Từ vựng
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(1, 'Apple', '/ˈæp.l̩/', 'Quả táo (Danh từ đếm được)', 'I have an apple.', 'Tôi có một quả táo.'),
(1, 'Water', '/ˈwɔː.tər/', 'Nước (Danh từ không đếm được)', 'Water is essential.', 'Nước rất cần thiết.'),
(1, 'The Sun', '/ðə sʌn/', 'Mặt trời (Dùng mạo từ The)', 'The sun is hot.', 'Mặt trời thì nóng.'),
(1, 'Student', '/ˈstjuː.dənt/', 'Học sinh', 'He is a student.', 'Cậu ấy là một học sinh.'),
(1, 'Hour', '/ˈaʊər/', 'Giờ (Dùng "an")', 'Wait an hour.', 'Đợi một tiếng nhé.'),
(1, 'University', '/ˌjuː.nɪˈvɜː.sə.ti/', 'Đại học (Dùng "a")', 'A university in Hanoi.', 'Một trường đại học ở Hà Nội.'),
(1, 'Information', '/ˌɪn.fəˈmeɪ.ʃən/', 'Thông tin (Không đếm được)', 'I need some information.', 'Tôi cần một vài thông tin.'),
(1, 'Women', '/ˈwɪm.ɪn/', 'Phụ nữ (Số nhiều bất quy tắc)', 'Two women are talking.', 'Hai người phụ nữ đang nói chuyện.'),
(1, 'City', '/ˈsɪt.i/', 'Thành phố', 'Hanoi is a big city.', 'Hà Nội là một thành phố lớn.'),
(1, 'Knowledge', '/ˈnɒl.ɪdʒ/', 'Kiến thức', 'Knowledge is power.', 'Kiến thức là sức mạnh.');

-- Ngữ pháp (Mạo từ & Danh từ)
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(1, 'Articles: A/An vs The', 'Mạo từ bất định (A/An) dùng cho vật chưa xác định. "An" dùng trước nguyên âm (u,e,o,a,i) nhưng dựa trên cách phát âm (vd: An hour, A university). Mạo từ xác định (The) dùng cho vật duy nhất (The sun) hoặc vật đã được nhắc đến.'),
(1, 'Nouns: Countable vs Uncountable', 'Danh từ đếm được (Book -> Books) và Không đếm được (Water, Rice - Không thêm "s").');

-- Hội thoại
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (1, 1, 'At the Grocery Store', 'audio/c1.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(1, 'Alice', 'I need to buy an apple and some water.', 'Tôi cần mua một quả táo và ít nước.'),
(1, 'Bob', 'Look! The apples here are very fresh.', 'Nhìn kìa! Những quả táo ở đây rất tươi.'),
(1, 'Alice', 'Yes, and the water is on that shelf.', 'Ừ, và nước thì ở trên cái kệ kia.');

-- --- BÀI 2: ĐẠI TỪ & THÌ HIỆN TẠI ĐƠN (PRONOUNS & PRESENT SIMPLE) ---
-- 10 Từ vựng
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(2, 'I', '/aɪ/', 'Tôi (Đại từ nhân xưng)', 'I am a teacher.', 'Tôi là giáo viên.'),
(2, 'Them', '/ðem/', 'Họ (Tân ngữ)', 'I give them a gift.', 'Tôi tặng họ một món quà.'),
(2, 'Myself', '/maɪˈself/', 'Chính tôi (Đại từ phản thân)', 'I look at myself.', 'Tôi nhìn chính mình.'),
(2, 'Hers', '/hɜːz/', 'Của cô ấy (Đại từ sở hữu)', 'This bag is hers.', 'Cái túi này là của cô ấy.'),
(2, 'Always', '/ˈɔːl.weɪz/', 'Luôn luôn (Trạng từ tần suất)', 'He always runs.', 'Anh ấy luôn chạy bộ.'),
(2, 'Usually', '/ˈjuː.ʒu.ə.li/', 'Thường xuyên', 'I usually sleep late.', 'Tôi thường ngủ muộn.'),
(2, 'Work', '/wɜːk/', 'Làm việc', 'She works at a bank.', 'Cô ấy làm việc tại ngân hàng.'),
(2, 'Study', '/ˈstʌd.i/', 'Học tập', 'We study English.', 'Chúng tôi học tiếng Anh.'),
(2, 'Go', '/ɡəʊ/', 'Đi', 'He goes to school.', 'Anh ấy đi học (thêm es).'),
(2, 'Have', '/hæv/', 'Có', 'She has a cat.', 'Cô ấy có một con mèo (biến đổi).');

-- Ngữ pháp
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(2, 'Present Simple Tense', 'Thì hiện tại đơn diễn tả sự thật hiển nhiên hoặc thói quen. Công thức: S + V(s/es). Với He/She/It động từ thêm s/es (Work -> Works, Go -> Goes).'),
(2, 'Pronouns Types', 'Đại từ nhân xưng (I, You, He), Tân ngữ (Me, You, Him), Sở hữu (Mine, Yours, His).');

-- Hội thoại
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (2, 2, 'Daily Habits', 'audio/c2.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(2, 'Tom', 'What do you usually do on Sundays?', 'Bạn thường làm gì vào Chủ nhật?'),
(2, 'Jerry', 'I usually visit my parents. They live nearby.', 'Tôi thường thăm bố mẹ. Họ sống gần đây.'),
(2, 'Tom', 'Does your brother go with you?', 'Anh trai bạn có đi cùng không?'),
(2, 'Jerry', 'Yes, he always goes with me.', 'Có, anh ấy luôn đi cùng tôi.');

-- --- BÀI 3: ĐỘNG TỪ & HIỆN TẠI TIẾP DIỄN (VERBS & PRESENT CONTINUOUS) ---
-- 10 Từ vựng
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(3, 'Run', '/rʌn/', 'Chạy (Động từ)', 'He is running.', 'Anh ấy đang chạy.'),
(3, 'Eat', '/iːt/', 'Ăn', 'They are eating lunch.', 'Họ đang ăn trưa.'),
(3, 'Sleep', '/sliːp/', 'Ngủ', 'The baby is sleeping.', 'Em bé đang ngủ.'),
(3, 'Write', '/raɪt/', 'Viết', 'I am writing an email.', 'Tôi đang viết email.'),
(3, 'Listen', '/ˈlɪs.ən/', 'Nghe', 'Are you listening?', 'Bạn có đang nghe không?'),
(3, 'Now', '/naʊ/', 'Bây giờ (Dấu hiệu nhận biết)', 'Do it now.', 'Làm ngay bây giờ đi.'),
(3, 'At the moment', '/æt ðə ˈməʊ.mənt/', 'Ngay lúc này', 'She is busy at the moment.', 'Lúc này cô ấy đang bận.'),
(3, 'Look', '/lʊk/', 'Nhìn kìa!', 'Look! The bus is coming.', 'Nhìn kìa! Xe buýt đang tới.'),
(3, 'Watch', '/wɒtʃ/', 'Xem', 'We are watching TV.', 'Chúng tôi đang xem TV.'),
(3, 'Cook', '/kʊk/', 'Nấu ăn', 'Dad is cooking dinner.', 'Bố đang nấu bữa tối.');

-- Ngữ pháp
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(3, 'Present Continuous Tense', 'Thì hiện tại tiếp diễn tả hành động đang xảy ra. Công thức: S + am/is/are + V-ing. Dấu hiệu: Now, Look!, Listen!, At the moment.'),
(3, 'Action Verbs vs State Verbs', 'Động từ chỉ hành động (Run, Eat) dùng được tiếp diễn. Động từ chỉ trạng thái (Love, Know, Need) thường KHÔNG dùng V-ing.');

-- Hội thoại
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (3, 3, 'Phone Call', 'audio/c3.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(3, 'Mom', 'Where are you, John?', 'Con đang ở đâu thế John?'),
(3, 'John', 'I am at the library. I am studying.', 'Con đang ở thư viện. Con đang học bài.'),
(3, 'Mom', 'Are you eating anything?', 'Con có đang ăn gì không?'),
(3, 'John', 'No, I am not eating. I am reading a book.', 'Không, con không ăn. Con đang đọc sách.');

-- --- BÀI 4: TÍNH TỪ & CÂU SO SÁNH (ADJECTIVES & COMPARISONS) ---
-- 10 Từ vựng
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(4, 'Tall', '/tɔːl/', 'Cao (Tính từ)', 'He is taller than me.', 'Anh ấy cao hơn tôi.'),
(4, 'Short', '/ʃɔːt/', 'Thấp/Ngắn', 'This pencil is short.', 'Cây bút chì này ngắn.'),
(4, 'Beautiful', '/ˈbjuː.tɪ.fəl/', 'Đẹp (Tính từ dài)', 'She is the most beautiful girl.', 'Cô ấy là cô gái đẹp nhất.'),
(4, 'Fast', '/fɑːst/', 'Nhanh', 'A car is faster than a bike.', 'Ô tô nhanh hơn xe đạp.'),
(4, 'Expensive', '/ɪkˈspen.sɪv/', 'Đắt tiền', 'This watch is expensive.', 'Cái đồng hồ này đắt tiền.'),
(4, 'Good', '/ɡʊd/', 'Tốt', 'He is a good student.', 'Cậu ấy là học sinh giỏi.'),
(4, 'Better', '/ˈbet.ər/', 'Tốt hơn (Bất quy tắc)', 'This one is better.', 'Cái này tốt hơn.'),
(4, 'Best', '/best/', 'Tốt nhất', 'You are the best.', 'Bạn là tuyệt nhất.'),
(4, 'Bad', '/bæd/', 'Tệ', 'The weather is bad.', 'Thời tiết tệ quá.'),
(4, 'Interesting', '/ˈɪn.trə.stɪŋ/', 'Thú vị', 'The movie is interesting.', 'Bộ phim rất thú vị.');

-- Ngữ pháp
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(4, 'Comparative Sentences', 'So sánh hơn: Tính từ ngắn + ER + than (Taller than). Tính từ dài + MORE + adj + than (More beautiful than).'),
(4, 'Superlative Sentences', 'So sánh nhất: The + Tính từ ngắn + EST (The tallest). The MOST + Tính từ dài (The most expensive). Bất quy tắc: Good -> Better -> Best.');

-- Hội thoại
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (4, 4, 'Shopping for Clothes', 'audio/c4.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(4, 'Customer', 'This shirt is nice, but it is expensive.', 'Cái áo này đẹp, nhưng đắt quá.'),
(4, 'Shopkeeper', 'How about this blue one? It is cheaper.', 'Cái màu xanh này thì sao? Nó rẻ hơn đấy.'),
(4, 'Customer', 'Yes, but the red one is the most beautiful.', 'Ừ, nhưng cái màu đỏ là đẹp nhất.');

-- --- BÀI 5: TRẠNG TỪ & TRẬT TỰ TỪ (ADVERBS & WORD ORDER) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(5, 'Quickly', '/ˈkwɪk.li/', 'Một cách nhanh chóng (Trạng từ)', 'He runs quickly.', 'Anh ấy chạy nhanh.'),
(5, 'Happily', '/ˈhæp.ɪ.li/', 'Một cách vui vẻ', 'They lived happily.', 'Họ sống vui vẻ.'),
(5, 'Well', '/wel/', 'Tốt (Trạng từ của Good)', 'She sings well.', 'Cô ấy hát hay.'),
(5, 'Carefully', '/ˈkeə.fəl.i/', 'Một cách cẩn thận', 'Drive carefully.', 'Lái xe cẩn thận nhé.'),
(5, 'Hard', '/hɑːd/', 'Chăm chỉ/Vất vả (Tính/Trạng từ giống nhau)', 'He works hard.', 'Anh ấy làm việc chăm chỉ.'),
(5, 'Never', '/ˈnev.ər/', 'Không bao giờ', 'I never smoke.', 'Tôi không bao giờ hút thuốc.'),
(5, 'Often', '/ˈɒf.ən/', 'Thường xuyên', 'Do you often travel?', 'Bạn có hay đi du lịch không?'),
(5, 'Yesterday', '/ˈjes.tə.deɪ/', 'Hôm qua (Trạng từ thời gian)', 'I saw him yesterday.', 'Tôi thấy anh ấy hôm qua.'),
(5, 'Here', '/hɪər/', 'Ở đây (Trạng từ nơi chốn)', 'Come here.', 'Lại đây.'),
(5, 'Really', '/ˈrɪə.li/', 'Thực sự (Trạng từ mức độ)', 'I am really tired.', 'Tôi thực sự mệt.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(5, 'Adverbs of Manner', 'Trạng từ chỉ cách thức thường đứng sau động từ. Cấu trúc: Adj + ly (Quick -> Quickly). Bất quy tắc: Good -> Well, Hard -> Hard.'),
(5, 'Word Order (S-V-O)', 'Trật tự từ cơ bản: Chủ ngữ (S) + Trạng từ tần suất + Động từ (V) + Tân ngữ (O) + Trạng từ nơi chốn + Trạng từ thời gian. (VD: He always plays soccer here on Sundays).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (5, 5, 'How do you do it?', 'audio/c5.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(5, 'Anna', 'You speak English very well.', 'Bạn nói tiếng Anh giỏi quá.'),
(5, 'Ben', 'Thanks. I study hard every day.', 'Cảm ơn. Tôi học chăm chỉ mỗi ngày.'),
(5, 'Anna', 'Do you learn quickly?', 'Bạn học có nhanh không?'),
(5, 'Ben', 'No, I learn slowly but carefully.', 'Không, tôi học chậm nhưng cẩn thận.');


-- --- BÀI 6: GIỚI TỪ & LIÊN TỪ (PREPOSITIONS & CONJUNCTIONS) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(6, 'In', '/ɪn/', 'Trong (Giới từ)', 'The cat is in the box.', 'Con mèo ở trong hộp.'),
(6, 'On', '/ɒn/', 'Trên', 'The book is on the table.', 'Quyển sách ở trên bàn.'),
(6, 'At', '/æt/', 'Tại (Thời gian/Địa điểm cụ thể)', 'Meet me at 5 PM.', 'Gặp tôi lúc 5 giờ chiều.'),
(6, 'Under', '/ˈʌn.dər/', 'Dưới', 'Under the tree.', 'Ở dưới gốc cây.'),
(6, 'And', '/ænd/', 'Và (Liên từ)', 'You and I.', 'Bạn và tôi.'),
(6, 'But', '/bʌt/', 'Nhưng', 'I like it, but it is expensive.', 'Tôi thích nó, nhưng nó đắt.'),
(6, 'Because', '/bɪˈkɒz/', 'Bởi vì', 'I stay home because it rains.', 'Tôi ở nhà vì trời mưa.'),
(6, 'So', '/səʊ/', 'Vì vậy/Nên', 'He was sick, so he slept.', 'Anh ấy ốm nên anh ấy đã ngủ.'),
(6, 'Although', '/ɔːlˈðəʊ/', 'Mặc dù', 'Although he is old, he runs fast.', 'Mặc dù ông ấy già, ông ấy chạy nhanh.'),
(6, 'Between', '/bɪˈtwiːn/', 'Ở giữa', 'Between A and B.', 'Ở giữa A và B.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(6, 'Prepositions of Time/Place', 'IN (Tháng, Năm, Mùa, Trong phòng), ON (Ngày, Thứ, Trên bề mặt), AT (Giờ giấc, Địa điểm nhỏ).'),
(6, 'Conjunctions (FANBOYS)', 'Liên từ kết hợp: And (thêm vào), But (ngược lại), So (kết quả), Because (nguyên nhân).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (6, 6, 'Meeting Plan', 'audio/c6.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(6, 'Tom', 'Are we meeting on Monday or Tuesday?', 'Chúng ta gặp nhau vào thứ Hai hay thứ Ba?'),
(6, 'Lisa', 'On Monday, at 7 PM.', 'Vào thứ Hai, lúc 7 giờ tối.'),
(6, 'Tom', 'I am busy then, so can we meet in the afternoon?', 'Lúc đó tôi bận, nên chúng ta gặp buổi chiều được không?');


-- --- BÀI 7: QUÁ KHỨ ĐƠN (PAST SIMPLE) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(7, 'Went', '/went/', 'Đã đi (Qúa khứ của Go)', 'I went to Paris.', 'Tôi đã đi Paris.'),
(7, 'Did', '/dɪd/', 'Đã làm (Qúa khứ của Do)', 'I did my homework.', 'Tôi đã làm bài tập.'),
(7, 'Was/Were', '/wɒz/', 'Đã là/Đã ở (Qúa khứ của To Be)', 'He was happy.', 'Anh ấy đã rất vui.'),
(7, 'Bought', '/bɔːt/', 'Đã mua (Qúa khứ của Buy)', 'She bought a car.', 'Cô ấy đã mua xe.'),
(7, 'Saw', '/sɔː/', 'Đã thấy (Qúa khứ của See)', 'I saw a ghost.', 'Tôi đã thấy ma.'),
(7, 'Yesterday', '/ˈjes.tə.deɪ/', 'Hôm qua', 'Yesterday was fun.', 'Hôm qua rất vui.'),
(7, 'Last night', '/lɑːst naɪt/', 'Tối qua', 'I slept late last night.', 'Tối qua tôi ngủ muộn.'),
(7, 'Ago', '/əˈɡəʊ/', 'Cách đây', 'Two years ago.', 'Cách đây 2 năm.'),
(7, 'Visited', '/ˈvɪz.ɪ.tɪd/', 'Đã thăm (Có quy tắc)', 'We visited the museum.', 'Chúng tôi đã thăm bảo tàng.'),
(7, 'Played', '/pleɪd/', 'Đã chơi (Có quy tắc)', 'He played soccer.', 'Anh ấy đã chơi bóng đá.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(7, 'Past Simple Tense', 'Diễn tả hành động đã chấm dứt trong quá khứ. Động từ có quy tắc thêm -ED (Play -> Played). Bất quy tắc phải học thuộc (Go -> Went, See -> Saw). Dấu hiệu: Yesterday, Last..., Ago.'),
(7, 'Negative & Question', 'Phủ định: Didn''t + V_nguyên_thể. Nghi vấn: Did + S + V_nguyên_thể?');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (7, 7, 'Last Weekend', 'audio/c7.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(7, 'A', 'Where did you go yesterday?', 'Hôm qua bạn đi đâu?'),
(7, 'B', 'I went to the cinema and saw a movie.', 'Tôi đi rạp chiếu phim và xem một bộ phim.'),
(7, 'A', 'Was it good?', 'Nó có hay không?'),
(7, 'B', 'Yes, it was amazing.', 'Có, nó tuyệt lắm.');


-- --- BÀI 8: TƯƠNG LAI & BE GOING TO ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(8, 'Will', '/wɪl/', 'Sẽ (Tương lai)', 'I will help you.', 'Tôi sẽ giúp bạn.'),
(8, 'Tomorrow', '/təˈmɒr.əʊ/', 'Ngày mai', 'See you tomorrow.', 'Gặp bạn ngày mai.'),
(8, 'Next week', '/nekst wiːk/', 'Tuần tới', 'I travel next week.', 'Tôi đi du lịch tuần tới.'),
(8, 'Plan', '/plæn/', 'Kế hoạch', 'What is your plan?', 'Kế hoạch của bạn là gì?'),
(8, 'Hope', '/həʊp/', 'Hy vọng', 'I hope it rains.', 'Tôi hy vọng trời mưa.'),
(8, 'Predict', '/prɪˈdɪkt/', 'Dự đoán', 'Predict the future.', 'Dự đoán tương lai.'),
(8, 'Probably', '/ˈprɒb.ə.bli/', 'Có lẽ', 'I will probably go.', 'Có lẽ tôi sẽ đi.'),
(8, 'Flight', '/flaɪt/', 'Chuyến bay', 'The flight is at 9.', 'Chuyến bay lúc 9 giờ.'),
(8, 'Intention', '/ɪnˈten.ʃən/', 'Ý định', 'My intention is to study.', 'Ý định của tôi là học tập.'),
(8, 'Soon', '/suːn/', 'Sớm thôi', 'Get well soon.', 'Sớm bình phục nhé.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(8, 'Future Simple (Will)', 'Dùng Will + V cho quyết định ngay lúc nói hoặc dự đoán không căn cứ. (I think it will rain).'),
(8, 'Be Going To', 'Dùng Am/Is/Are + Going to + V cho kế hoạch đã định trước hoặc dự đoán có căn cứ. (Look at the clouds! It is going to rain).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (8, 8, 'Summer Plans', 'audio/c8.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(8, 'John', 'What are you going to do this summer?', 'Bạn định làm gì hè này?'),
(8, 'Mary', 'I am going to travel to Japan. I bought the tickets.', 'Tôi định đi Nhật. Tôi mua vé rồi.'),
(8, 'John', 'Wow. I will probably just stay home.', 'Chà. Tôi chắc sẽ chỉ ở nhà thôi.');

-- --- BÀI 9: CÂU BỊ ĐỘNG (PASSIVE VOICE) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(9, 'Built', '/bɪlt/', 'Được xây dựng (P2)', 'The house was built.', 'Ngôi nhà được xây dựng.'),
(9, 'Written', '/ˈrɪt.ən/', 'Được viết (P2)', 'The book was written by him.', 'Sách được viết bởi anh ấy.'),
(9, 'Made', '/meɪd/', 'Được làm (P2)', 'Made in Vietnam.', 'Sản xuất tại Việt Nam.'),
(9, 'Stolen', '/ˈstəʊ.lən/', 'Bị trộm (P2)', 'My car was stolen.', 'Xe tôi bị trộm.'),
(9, 'Cleaned', '/kliːnd/', 'Được dọn dẹp', 'The room is cleaned daily.', 'Phòng được dọn hàng ngày.'),
(9, 'Done', '/dʌn/', 'Được hoàn thành (P2)', 'The work is done.', 'Công việc đã xong.'),
(9, 'Invented', '/ɪnˈven.tɪd/', 'Được phát minh', 'The bulb was invented by Edison.', 'Bóng đèn do Edison phát minh.'),
(9, 'Discovered', '/dɪˈskʌv.əd/', 'Được khám phá', 'America was discovered.', 'Châu Mỹ đã được khám phá.'),
(9, 'Broken', '/ˈbrəʊ.kən/', 'Bị vỡ (P2)', 'The glass is broken.', 'Cái ly bị vỡ.'),
(9, 'By', '/baɪ/', 'Bởi (Chỉ tác nhân)', 'Written by Shakespeare.', 'Viết bởi Shakespeare.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(9, 'Passive Voice Structure', 'Cấu trúc: To Be + V(p2). Dùng khi muốn nhấn mạnh vào đối tượng chịu tác động hơn là người thực hiện. (VD: The letter was sent).'),
(9, 'By + Agent', 'Dùng "By" để chỉ người thực hiện hành động nếu cần thiết (By the police, By me...).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (9, 9, 'The Broken Vase', 'audio/c9.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(9, 'Mom', 'What happened here?', 'Chuyện gì xảy ra ở đây?'),
(9, 'Son', 'The vase was broken, mom.', 'Cái bình bị vỡ rồi mẹ ạ.'),
(9, 'Mom', 'Was it broken by the cat?', 'Có phải bị con mèo làm vỡ không?'),
(9, 'Son', 'Yes, it was pushed off the table.', 'Vâng, nó bị đẩy khỏi bàn.');

-- --- BÀI 10: CÂU ĐIỀU KIỆN (CONDITIONAL SENTENCES) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(10, 'If', '/ɪf/', 'Nếu', 'If you study, you pass.', 'Nếu bạn học, bạn đậu.'),
(10, 'Unless', '/ənˈles/', 'Trừ khi (Nếu không)', 'Unless you run, you will be late.', 'Trừ khi bạn chạy, bạn sẽ muộn.'),
(10, 'Pass', '/pɑːs/', 'Đậu (kỳ thi)', 'Pass the exam.', 'Đậu kỳ thi.'),
(10, 'Fail', '/feɪl/', 'Trượt', 'Fail the test.', 'Trượt bài kiểm tra.'),
(10, 'Rich', '/rɪtʃ/', 'Giàu có', 'If I were rich...', 'Nếu tôi giàu...'),
(10, 'Would', '/wʊd/', 'Sẽ (Quá khứ/Giả định)', 'I would go.', 'Tôi sẽ đi.'),
(10, 'Truth', '/truːθ/', 'Sự thật', 'Tell the truth.', 'Nói sự thật.'),
(10, 'Imagine', '/ɪˈmædʒ.ɪn/', 'Tưởng tượng', 'Imagine if you could fly.', 'Tưởng tượng nếu bạn biết bay.'),
(10, 'Real', '/rɪəl/', 'Thật', 'Is it real?', 'Nó có thật không?'),
(10, 'Possible', '/ˈpɒs.ə.bəl/', 'Có thể xảy ra', 'It is possible.', 'Nó có khả năng xảy ra.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(10, 'Type 1 (Real Present)', 'Điều kiện có thể xảy ra ở hiện tại/tương lai. [If + S + V(hiện tại), S + Will + V]. (If it rains, I will stay home).'),
(10, 'Type 2 (Unreal Present)', 'Điều kiện không có thật ở hiện tại. [If + S + V(quá khứ), S + Would + V]. (If I were you, I would buy it).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (10, 10, 'Dreaming', 'audio/c10.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(10, 'A', 'What would you do if you won the lottery?', 'Bạn sẽ làm gì nếu trúng số?'),
(10, 'B', 'If I won a million dollars, I would travel the world.', 'Nếu tôi trúng 1 triệu đô, tôi sẽ đi vòng quanh thế giới.'),
(10, 'A', 'If you travel, will you take me?', 'Nếu bạn đi, bạn sẽ đưa tôi đi cùng chứ?'),
(10, 'B', 'Maybe if you are nice!', 'Có thể nếu bạn ngoan!');

-- --- BÀI 11: MỆNH ĐỀ QUAN HỆ (RELATIVE CLAUSES) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(11, 'Who', '/huː/', 'Người mà (Thay cho người)', 'The man who called.', 'Người đàn ông đã gọi.'),
(11, 'Which', '/wɪtʃ/', 'Cái mà (Thay cho vật)', 'The car which I bought.', 'Cái xe tôi đã mua.'),
(11, 'That', '/ðæt/', 'Người/Cái mà (Đa năng)', 'The book that I read.', 'Quyển sách tôi đã đọc.'),
(11, 'Whose', '/huːz/', 'Của người mà (Sở hữu)', 'The boy whose dad is a doctor.', 'Cậu bé có bố là bác sĩ.'),
(11, 'Where', '/weər/', 'Nơi mà', 'The place where we met.', 'Nơi chúng ta gặp nhau.'),
(11, 'When', '/wen/', 'Khi mà', 'The day when I was born.', 'Ngày tôi sinh ra.'),
(11, 'Person', '/ˈpɜː.sən/', 'Người', 'He is a nice person.', 'Anh ấy là người tốt.'),
(11, 'Thing', '/θɪŋ/', 'Vật/Thứ', 'It is a good thing.', 'Đó là một điều tốt.'),
(11, 'Reason', '/ˈriː.zən/', 'Lý do', 'The reason why.', 'Lý do tại sao.'),
(11, 'Identify', '/aɪˈden.tɪ.faɪ/', 'Xác định', 'Identify the thief.', 'Nhận diện kẻ trộm.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(11, 'Relative Pronouns', 'Who (người), Which (vật), That (cả hai), Whose (sở hữu). Dùng để nối câu và giải thích rõ hơn về danh từ đứng trước.'),
(11, 'Defining vs Non-defining', 'Mệnh đề xác định (bắt buộc có) và Mệnh đề không xác định (có dấu phẩy, chỉ để bổ sung thông tin). (VD: My dad, who is 50, is a doctor).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (11, 11, 'Lost Item', 'audio/c11.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(11, 'Police', 'Can you describe the bag that you lost?', 'Cô có thể mô tả cái túi cô bị mất không?'),
(11, 'Lady', 'It is the bag which has a red star on it.', 'Đó là cái túi có ngôi sao đỏ ở trên.'),
(11, 'Police', 'Is this the man who stole it?', 'Đây có phải người đàn ông đã trộm nó không?');

-- --- BÀI 12: CÂU TƯỜNG THUẬT (REPORTED SPEECH) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(12, 'Say/Said', '/sed/', 'Nói/Đã nói', 'He said he was tired.', 'Anh ấy nói anh ấy mệt.'),
(12, 'Tell/Told', '/təʊld/', 'Kể/Bảo', 'She told me to go.', 'Cô ấy bảo tôi đi.'),
(12, 'Ask/Asked', '/ɑːskt/', 'Hỏi/Yêu cầu', 'He asked where I lived.', 'Anh ấy hỏi tôi sống ở đâu.'),
(12, 'Report', '/rɪˈpɔːt/', 'Báo cáo/Tường thuật', 'Report the news.', 'Tường thuật tin tức.'),
(12, 'Direct', '/daɪˈrekt/', 'Trực tiếp', 'Direct speech.', 'Lời nói trực tiếp.'),
(12, 'Previous', '/ˈpriː.vi.əs/', 'Trước đó', 'The previous day.', 'Ngày trước đó.'),
(12, 'Following', '/ˈfɒl.əʊ.ɪŋ/', 'Tiếp theo', 'The following week.', 'Tuần tiếp theo.'),
(12, 'Order', '/ˈɔː.dər/', 'Ra lệnh', 'He ordered him to stop.', 'Anh ta ra lệnh cho hắn dừng lại.'),
(12, 'Advise', '/ədˈvaɪz/', 'Khuyên bảo', 'He advised me to study.', 'Anh ấy khuyên tôi học.'),
(12, 'Whether', '/ˈweð.ər/', 'Liệu rằng (Dùng trong câu hỏi Yes/No)', 'He asked whether I liked it.', 'Anh ấy hỏi liệu tôi có thích nó không.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(12, 'Backshift Rules (Lùi thì)', 'Khi chuyển sang gián tiếp, lùi 1 thì: Hiện tại -> Quá khứ, Quá khứ -> Quá khứ hoàn thành, Will -> Would, Can -> Could.'),
(12, 'Time & Place Changes', 'Now -> Then, Here -> There, Tomorrow -> The following day, Yesterday -> The previous day.');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (12, 12, 'Gossip', 'audio/c12.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(12, 'A', 'What did Sarah say?', 'Sarah đã nói gì?'),
(12, 'B', 'She said that she was getting married.', 'Cô ấy nói rằng cô ấy sắp kết hôn.'),
(12, 'A', 'Really? She told me she was single last week!', 'Thật á? Tuần trước cô ấy bảo tôi là cô ấy độc thân mà!');

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- PHẦN 3: LEVEL 3 - NÂNG CAO (TIẾP TỤC TỪ BÀI 13)
-- ============================================================

-- --- BÀI 13: SỰ HÒA HỢP CHỦ NGỮ & ĐỘNG TỪ (SUBJECT-VERB AGREEMENT) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(13, 'Everyone', '/ˈev.ri.wʌn/', 'Mọi người (Đi với V số ít)', 'Everyone is here.', 'Mọi người đều ở đây.'),
(13, 'Everything', '/ˈev.ri.θɪŋ/', 'Mọi thứ (Đi với V số ít)', 'Everything looks good.', 'Mọi thứ trông có vẻ ổn.'),
(13, 'Nobody', '/ˈnəʊ.bɒd.i/', 'Không ai (Đi với V số ít)', 'Nobody knows the answer.', 'Không ai biết câu trả lời.'),
(13, 'Team', '/tiːm/', 'Đội (Danh từ tập hợp)', 'The team is winning.', 'Đội đang chiến thắng.'),
(13, 'Police', '/pəˈliːs/', 'Cảnh sát (Luôn số nhiều)', 'The police are coming.', 'Cảnh sát đang tới.'),
(13, 'News', '/njuːz/', 'Tin tức (Luôn số ít)', 'The news is bad.', 'Tin tức này tệ quá.'),
(13, 'Mathematics', '/ˌmæθˈmæt.ɪks/', 'Toán học (Môn học - Số ít)', 'Mathematics is difficult.', 'Toán học rất khó.'),
(13, 'Glasses', '/ˈɡlɑː.sɪz/', 'Kính mắt (Luôn số nhiều)', 'My glasses are broken.', 'Kính của tôi bị vỡ.'),
(13, 'Furniture', '/ˈfɜː.nɪ.tʃər/', 'Nội thất (Không đếm được - Số ít)', 'The furniture is new.', 'Nội thất còn mới.'),
(13, 'Cattle', '/ˈkæt.əl/', 'Gia súc (Luôn số nhiều)', 'The cattle are eating.', 'Gia súc đang ăn.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(13, 'Basic Rules', 'Chủ ngữ số ít -> Động từ số ít (thêm s/es). Chủ ngữ số nhiều -> Động từ số nhiều (nguyên thể).'),
(13, 'Special Cases', 'Các đại từ bất định (Everyone, Someone, Nothing...) luôn chia số ít. Các danh từ tập hợp (News, Maths, Physics) chia số ít. Police, Cattle, Glasses luôn chia số nhiều.');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (13, 13, 'The News', 'audio/c13.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(13, 'A', 'Have you heard the news? It is shocking.', 'Bạn nghe tin chưa? Sốc lắm.'),
(13, 'B', 'No, nobody tells me anything.', 'Chưa, chả ai nói gì với tôi cả.'),
(13, 'A', 'The police are investigating a crime nearby.', 'Cảnh sát đang điều tra một vụ án gần đây.');

-- --- BÀI 14: CẤU TRÚC SONG SONG (PARALLEL STRUCTURE) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(14, 'Hiking', '/ˈhaɪ.kɪŋ/', 'Đi bộ đường dài', 'I like hiking and swimming.', 'Tôi thích đi bộ và bơi lội.'),
(14, 'Neither', '/ˈnaɪ.ðər/', 'Không... (cũng không)', 'Neither Tom nor Jerry.', 'Không phải Tom cũng chẳng phải Jerry.'),
(14, 'Nor', '/nɔːr/', 'Cũng không', 'I neither smoke nor drink.', 'Tôi không hút thuốc cũng không uống rượu.'),
(14, 'Either', '/ˈaɪ.ðər/', 'Hoặc...', 'Either you or me.', 'Hoặc bạn hoặc tôi.'),
(14, 'Not only', '/nɒt ˈəʊn.li/', 'Không những...', 'Not only smart...', 'Không những thông minh...'),
(14, 'But also', '/bʌt ˈɔːl.səʊ/', 'Mà còn...', '...but also kind.', '...mà còn tốt bụng.'),
(14, 'Prefer', '/prɪˈfɜːr/', 'Thích hơn', 'I prefer walking to running.', 'Tôi thích đi bộ hơn chạy.'),
(14, 'Both', '/bəʊθ/', 'Cả hai', 'Both red and blue.', 'Cả màu đỏ và xanh.'),
(14, 'Swimming', '/ˈswɪm.ɪŋ/', 'Bơi lội', 'He enjoys swimming.', 'Anh ấy thích bơi.'),
(14, 'Cooking', '/ˈkʊk.ɪŋ/', 'Nấu ăn', 'Cooking is fun.', 'Nấu ăn rất vui.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(14, 'Parallelism Rule', 'Trong câu liệt kê, các thành phần phải cùng dạng (V-ing đi với V-ing, To V đi với To V, Danh từ đi với Danh từ). Sai: I like swimming and to cook. Đúng: I like swimming and cooking.'),
(14, 'Paired Conjunctions', 'Cấu trúc cặp: Neither...nor, Either...or, Not only...but also, Both...and. Động từ chia theo chủ ngữ gần nhất (với or/nor).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (14, 14, 'Hobbies', 'audio/c14.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(14, 'Tom', 'What do you like doing?', 'Bạn thích làm gì?'),
(14, 'Anna', 'I like reading, writing, and painting.', 'Tôi thích đọc, viết và vẽ.'),
(14, 'Tom', 'Not only do you read, but you also write? Wow.', 'Bạn không những đọc mà còn viết nữa à? Wow.');

-- --- BÀI 15: MỆNH ĐỀ DANH TỪ (NOUN CLAUSES) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(15, 'Believe', '/bɪˈliːv/', 'Tin rằng', 'I believe that he is right.', 'Tôi tin rằng anh ấy đúng.'),
(15, 'Wonder', '/ˈwʌn.dər/', 'Tự hỏi', 'I wonder where she is.', 'Tôi tự hỏi cô ấy ở đâu.'),
(15, 'Fact', '/fækt/', 'Sự thật', 'The fact that he left.', 'Sự thật là anh ấy đã đi.'),
(15, 'Doubt', '/daʊt/', 'Nghi ngờ', 'I doubt if it is true.', 'Tôi nghi ngờ liệu nó có đúng không.'),
(15, 'Explain', '/ɪkˈspleɪn/', 'Giải thích', 'Explain why you did it.', 'Giải thích tại sao bạn làm vậy.'),
(15, 'Guess', '/ɡes/', 'Đoán', 'Guess what I bought.', 'Đoán xem tôi mua gì.'),
(15, 'Certain', '/ˈsɜː.tən/', 'Chắc chắn', 'I am certain that we won.', 'Tôi chắc chắn chúng ta đã thắng.'),
(15, 'Realize', '/ˈrɪə.laɪz/', 'Nhận ra', 'I realized that I was lost.', 'Tôi nhận ra mình đã bị lạc.'),
(15, 'Forget', '/fəˈɡet/', 'Quên', 'Don''t forget what I said.', 'Đừng quên những gì tôi nói.'),
(15, 'Sure', '/ʃɔːr/', 'Chắc chắn', 'Are you sure who he is?', 'Bạn có chắc anh ta là ai không?');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(15, 'Definition', 'Mệnh đề danh từ đóng vai trò như một danh từ (làm chủ ngữ hoặc tân ngữ). Thường bắt đầu bằng: That, What, Where, When, Why, How, Whether/If.'),
(15, 'Structure', 'S + V + (Wh-word/That + S + V). Ví dụ: I know [where he lives]. (Không đảo ngữ trong mệnh đề danh từ).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (15, 15, 'The Secret', 'audio/c15.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(15, 'A', 'Do you know why she is crying?', 'Bạn có biết tại sao cô ấy khóc không?'),
(15, 'B', 'I guess that she failed the exam.', 'Tôi đoán rằng cô ấy trượt bài thi.'),
(15, 'A', 'That explains why she is sad.', 'Điều đó giải thích tại sao cô ấy buồn.');

-- --- BÀI 16: MỆNH ĐỀ TRẠNG NGỮ (ADVERBIAL CLAUSES) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(16, 'While', '/waɪl/', 'Trong khi', 'While I was sleeping...', 'Trong khi tôi đang ngủ...'),
(16, 'Whereas', '/weərˈæz/', 'Trong khi (Ngược lại)', 'He is rich whereas I am poor.', 'Anh ấy giàu trong khi tôi nghèo.'),
(16, 'Since', '/sɪns/', 'Vì/Từ khi', 'Since he is lazy...', 'Vì anh ấy lười...'),
(16, 'Provided', '/prəˈvaɪ.dɪd/', 'Miễn là', 'Provided that you pay.', 'Miễn là bạn trả tiền.'),
(16, 'Unless', '/ənˈles/', 'Trừ khi', 'Unless you hurry.', 'Trừ khi bạn nhanh lên.'),
(16, 'As soon as', '/æz suːn æz/', 'Ngay khi', 'Call me as soon as you arrive.', 'Gọi tôi ngay khi bạn tới.'),
(16, 'Until', '/ənˈtɪl/', 'Cho đến khi', 'Wait until I come.', 'Đợi cho đến khi tôi đến.'),
(16, 'Whenever', '/wenˈev.ər/', 'Bất cứ khi nào', 'Visit me whenever you want.', 'Thăm tôi bất cứ khi nào bạn muốn.'),
(16, 'Even if', '/ˈiː.vən ɪf/', 'Ngay cả khi', 'Even if it rains, I go.', 'Ngay cả khi trời mưa, tôi vẫn đi.'),
(16, 'In case', '/ɪn keɪs/', 'Phòng khi', 'Take an umbrella in case it rains.', 'Mang ô phòng khi trời mưa.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(16, 'Types of Adverbial Clauses', 'Chỉ thời gian (When, While, Until), Nguyên nhân (Because, Since), Điều kiện (If, Unless), Nhượng bộ (Although), Mục đích (So that).'),
(16, 'Position', 'Có thể đứng đầu câu (dùng dấu phẩy) hoặc cuối câu. (Because I was sick, I stayed home = I stayed home because I was sick).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (16, 16, 'Making Plans', 'audio/c16.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(16, 'A', 'I will wait here until you finish.', 'Tôi sẽ đợi ở đây cho đến khi bạn xong.'),
(16, 'B', 'Thanks. Take this key in case you need to enter.', 'Cảm ơn. Cầm chìa khóa này phòng khi bạn cần vào trong.'),
(16, 'A', 'Call me as soon as you are done.', 'Gọi tôi ngay khi bạn xong nhé.');

-- --- BÀI 17: SỰ PHỐI HỢP THÌ (SEQUENCE OF TENSES) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(17, 'Before', '/bɪˈfɔːr/', 'Trước khi', 'Before I came, he had left.', 'Trước khi tôi đến, anh ấy đã đi rồi.'),
(17, 'After', '/ˈɑːf.tər/', 'Sau khi', 'After I ate, I slept.', 'Sau khi ăn, tôi ngủ.'),
(17, 'By the time', '/baɪ ðə taɪm/', 'Vào lúc/Trước lúc', 'By the time we arrived...', 'Trước lúc chúng tôi tới...'),
(17, 'Arrive', '/əˈraɪv/', 'Đến', 'When he arrived, I was cooking.', 'Khi anh ấy đến, tôi đang nấu ăn.'),
(17, 'Leave', '/liːv/', 'Rời đi', 'The train had left.', 'Tàu đã rời đi.'),
(17, 'Meanwhile', '/ˈmiːn.waɪl/', 'Trong khi đó', 'Meanwhile, she was reading.', 'Trong khi đó, cô ấy đang đọc sách.'),
(17, 'During', '/ˈdʒʊə.rɪŋ/', 'Trong suốt', 'During the summer.', 'Trong suốt mùa hè.'),
(17, 'Already', '/ɔːlˈred.i/', 'Rồi', 'I had already finished.', 'Tôi đã xong rồi.'),
(17, 'Just', '/dʒʌst/', 'Vừa mới', 'He has just left.', 'Anh ấy vừa mới đi.'),
(17, 'Then', '/ðen/', 'Sau đó', 'I ate, then I worked.', 'Tôi ăn, sau đó tôi làm việc.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(17, 'Past & Past Perfect', 'Hành động xảy ra trước 1 hành động khác trong quá khứ dùng Quá khứ hoàn thành. (When I arrived, he HAD left).'),
(17, 'Past Continuous & Simple', 'Hành động đang xảy ra (Qúa khứ tiếp diễn) thì hành động khác chen vào (Qúa khứ đơn). (I WAS sleeping when he called).');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (17, 17, 'The Accident', 'audio/c17.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(17, 'Police', 'What were you doing when the accident happened?', 'Anh đang làm gì khi tai nạn xảy ra?'),
(17, 'Witness', 'I was walking down the street when I saw the car.', 'Tôi đang đi bộ xuống phố thì tôi thấy cái xe.'),
(17, 'Police', 'Had the driver seen you?', 'Tài xế có thấy anh trước đó không?');

-- --- BÀI 18: TỪ NỐI (CONNECTORS & LINKING WORDS) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning, example_sentence_english, example_sentence_vietnamese) VALUES 
(18, 'However', '/haʊˈev.ər/', 'Tuy nhiên', 'He is old. However, he is strong.', 'Ông ấy già. Tuy nhiên, ông ấy khỏe.'),
(18, 'Therefore', '/ˈðeə.fɔːr/', 'Vì vậy', 'It rained. Therefore, we stayed home.', 'Trời mưa. Vì vậy, chúng tôi ở nhà.'),
(18, 'Moreover', '/ˌmɔːˈrəʊ.vər/', 'Hơn nữa', 'He is rich. Moreover, he is handsome.', 'Anh ấy giàu. Hơn nữa còn đẹp trai.'),
(18, 'Otherwise', '/ˈʌð.ə.waɪz/', 'Nếu không thì', 'Study hard, otherwise you fail.', 'Học chăm đi, nếu không bạn sẽ trượt.'),
(18, 'Despite', '/dɪˈspaɪt/', 'Mặc dù (cộng Noun/Ving)', 'Despite the rain...', 'Mặc dù trời mưa...'),
(18, 'Consequently', '/ˈkɒn.sɪ.kwənt.li/', 'Hậu quả là', 'He missed the bus. Consequently, he was late.', 'Anh ấy lỡ xe. Hậu quả là anh ấy bị muộn.'),
(18, 'Furthermore', '/ˌfɜː.ðəˈmɔːr/', 'Thêm vào đó', 'Furthermore, it is free.', 'Thêm vào đó, nó miễn phí.'),
(18, 'Thus', '/ðʌs/', 'Như vậy/Do đó', 'Thus, we conclude...', 'Do đó, chúng tôi kết luận...'),
(18, 'In addition', '/ɪn əˈdɪʃ.ən/', 'Ngoài ra', 'In addition, I like pizza.', 'Ngoài ra, tôi thích pizza.'),
(18, 'On the other hand', '/ɒn ði ˈʌð.ər hænd/', 'Mặt khác', 'On the other hand, it is cheap.', 'Mặt khác, nó rẻ.');

INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(18, 'Linking Words Usage', 'Dùng để nối các ý hoặc các câu văn. However/Therefore thường đứng đầu câu và có dấu phẩy. Despite/In spite of + Danh từ/V-ing. Although + Mệnh đề.'),
(18, 'Adding & Contrasting', 'Thêm ý: Moreover, Furthermore, In addition. Đối lập: However, Nevertheless, On the other hand.');

INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (18, 18, 'Debate', 'audio/c18.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(18, 'A', 'I think we should buy a car.', 'Tôi nghĩ ta nên mua xe ô tô.'),
(18, 'B', 'Cars are useful. However, they are expensive.', 'Xe hơi hữu ích. Tuy nhiên, chúng đắt đỏ.'),
(18, 'A', 'True. Otherwise, we have to take the bus every day.', 'Đúng. Nếu không thì ngày nào ta cũng phải bắt xe buýt.');

-- ============================================================
-- PHẦN 4: LEVEL 4 & 5 (BÀI 19 - 25)
-- ============================================================

-- --- BÀI 19: CÁC THÌ HOÀN THÀNH (PERFECT TENSES) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning) VALUES 
(19, 'Recently', '...','Gần đây'), (19, 'Lately', '...','Mới đây'), (19, 'Yet', '...','Chưa (dùng trong câu phủ định/nghi vấn)'),
(19, 'Experience', '...','Kinh nghiệm'), (19, 'Ever', '...','Đã từng'), (19, 'Never', '...','Chưa từng'),
(19, 'Result', '...','Kết quả'), (19, 'Finish', '...','Hoàn thành'), (19, 'Since', '...','Kể từ khi'), (19, 'For', '...','Trong khoảng (thời gian)');
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(19, 'Present Perfect', 'S + Have/Has + P2. Diễn tả hành động vừa xảy ra, lặp lại nhiều lần, hoặc bắt đầu trong quá khứ kéo dài đến hiện tại.'),
(19, 'Past Perfect', 'S + Had + P2. Diễn tả hành động xảy ra trước một hành động khác trong quá khứ.');
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (19, 19, 'Job Interview', 'audio/c19.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(19, 'Interviewer', 'Have you ever worked in a team?', 'Bạn đã bao giờ làm việc nhóm chưa?'),
(19, 'Candidate', 'Yes, I have worked in many teams since 2020.', 'Rồi, tôi đã làm việc trong nhiều nhóm từ năm 2020.');

-- --- BÀI 20: ĐỘNG TỪ KHUYẾT THIẾU (MODAL VERBS) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning) VALUES 
(20, 'Must', '...','Phải (Bắt buộc)'), (20, 'Should', '...','Nên (Khuyên)'), (20, 'Can', '...','Có thể (Khả năng)'),
(20, 'May', '...','Có lẽ (Xác suất 50%)'), (20, 'Might', '...','Có lẽ (Xác suất thấp hơn)'), (20, 'Ought to', '...','Nên'),
(20, 'Permission', '...','Sự cho phép'), (20, 'Ability', '...','Khả năng'), (20, 'Obligation', '...','Nghĩa vụ'), (20, 'Advice', '...','Lời khuyên');
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(20, 'Modals of Obligation', 'Must (Bắt buộc chủ quan), Have to (Bắt buộc khách quan/Luật lệ).'),
(20, 'Modals of Advice', 'Should/Ought to (Khuyên nên làm gì). Better (Nên làm nếu không sẽ có hậu quả).');
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (20, 20, 'Doctor Advice', 'audio/c20.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(20, 'Doc', 'You must stop smoking.', 'Anh bắt buộc phải bỏ thuốc.'),
(20, 'Patient', 'I know I should, but it is hard.', 'Tôi biết tôi nên làm thế, nhưng khó quá.');

-- --- BÀI 21: GERUNDS & INFINITIVES (V-ING & TO V) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning) VALUES 
(21, 'Enjoy', '...','Thích (Enjoy + Ving)'), (21, 'Avoid', '...','Tránh (Avoid + Ving)'), (21, 'Decide', '...','Quyết định (Decide + To V)'),
(21, 'Plan', '...','Lên kế hoạch (Plan + To V)'), (21, 'Suggest', '...','Gợi ý (Suggest + Ving)'), (21, 'Promise', '...','Hứa (Promise + To V)'),
(21, 'Mind', '...','Phiền (Mind + Ving)'), (21, 'Refuse', '...','Từ chối (Refuse + To V)'), (21, 'Keep', '...','Tiếp tục (Keep + Ving)'), (21, 'Want', '...','Muốn (Want + To V)');
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(21, 'Verbs + V-ing', 'Một số động từ theo sau là V-ing: Enjoy, Avoid, Suggest, Mind, Keep, Finish.'),
(21, 'Verbs + To V', 'Một số động từ theo sau là To V: Want, Decide, Plan, Promise, Refuse, Hope.');
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (21, 21, 'Weekend Plan', 'audio/c21.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(21, 'A', 'I suggest going to the cinema.', 'Tôi gợi ý đi xem phim.'),
(21, 'B', 'I decide to stay home instead.', 'Tôi quyết định ở nhà thì hơn.');

-- --- BÀI 22: ĐẢO NGỮ (INVERSION) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning) VALUES 
(22, 'Rarely', '...','Hiếm khi'), (22, 'Seldom', '...','Hiếm khi'), (22, 'Never', '...','Chưa bao giờ'),
(22, 'Hardly', '...','Hầu như không'), (22, 'Scarcely', '...','Vừa mới... thì...'), (22, 'No sooner', '...','Vừa mới... thì...'),
(22, 'Only', '...','Chỉ khi'), (22, 'Not until', '...','Mãi đến khi'), (22, 'Little', '...','Rất ít khi (phủ định)'), (22, 'Nowhere', '...','Không nơi nào');
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(22, 'Negative Adverbs Inversion', 'Khi trạng từ phủ định đứng đầu câu, phải đảo ngữ: Never have I seen such a thing. (Chưa bao giờ tôi thấy thứ như vậy).'),
(22, 'Only/Not until', 'Only when I arrived did I know. (Chỉ khi tôi đến tôi mới biết).');
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (22, 22, 'Surprise', 'audio/c22.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(22, 'A', 'Rarely do we see such a beautiful sunset.', 'Hiếm khi nào chúng ta thấy hoàng hôn đẹp thế này.'),
(22, 'B', 'Little did I know it would be this nice.', 'Tôi không hề biết là nó sẽ đẹp thế này.');

-- --- BÀI 23: CỤM ĐỘNG TỪ (PHRASAL VERBS) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning) VALUES 
(23, 'Give up', '...','Từ bỏ'), (23, 'Look for', '...','Tìm kiếm'), (23, 'Look after', '...','Chăm sóc'),
(23, 'Run out of', '...','Hết/Cạn kiệt'), (23, 'Put off', '...','Trì hoãn'), (23, 'Call off', '...','Hủy bỏ'),
(23, 'Turn on', '...','Bật'), (23, 'Turn off', '...','Tắt'), (23, 'Get up', '...','Thức dậy'), (23, 'Find out', '...','Tìm ra');
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(23, 'Definition', 'Cụm động từ gồm Động từ + Giới từ/Trạng từ, mang nghĩa khác với động từ gốc. (Look = Nhìn, Look after = Chăm sóc).'),
(23, 'Separable vs Inseparable', 'Một số cụm có thể tách rời (Turn the light on / Turn on the light). Một số không thể tách (Look after him).');
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (23, 23, 'Lost Key', 'audio/c23.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(23, 'A', 'What are you looking for?', 'Bạn đang tìm cái gì thế?'),
(23, 'B', 'I am looking for my keys. I can''t find out where they are.', 'Tôi đang tìm chìa khóa. Tôi không tìm ra chúng ở đâu.');

-- --- BÀI 24: THÀNH NGỮ (IDIOMS) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning) VALUES 
(24, 'Piece of cake', '...','Dễ ợt'), (24, 'Break a leg', '...','Chúc may mắn'), (24, 'Under the weather', '...','Cảm thấy không khỏe'),
(24, 'Cost an arm and a leg', '...','Rất đắt đỏ'), (24, 'Once in a blue moon', '...','Hiếm khi'), (24, 'Spill the beans', '...','Tiết lộ bí mật'),
(24, 'Hit the sack', '...','Đi ngủ'), (24, 'See eye to eye', '...','Đồng quan điểm'), (24, 'Let the cat out of the bag', '...','Lộ bí mật'), (24, 'Feeling blue', '...','Cảm thấy buồn');
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(24, 'Usage', 'Thành ngữ không thể dịch nghĩa đen từng từ (Piece of cake = Bánh ngọt -> Nghĩa bóng: Dễ dàng). Dùng thành ngữ giúp tiếng Anh tự nhiên hơn.'),
(24, 'Context', 'Thường dùng trong văn nói (Speaking) thân mật.');
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (24, 24, 'Exam Day', 'audio/c24.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(24, 'A', 'The exam was a piece of cake.', 'Bài thi dễ ợt.'),
(24, 'B', 'Really? I was feeling blue because I thought I failed.', 'Thật á? Tôi đang buồn thiu vì tưởng trượt.');

-- --- BÀI 25: COLLOCATIONS (CỤM TỪ CỐ ĐỊNH) ---
INSERT INTO vocabularies (lesson_id, word_english, phonetic_spelling, vietnamese_meaning) VALUES 
(25, 'Make a decision', '...','Ra quyết định'), (25, 'Do a favor', '...','Giúp đỡ'), (25, 'Pay attention', '...','Chú ý'),
(25, 'Take a break', '...','Nghỉ giải lao'), (25, 'Catch a cold', '...','Bị cảm lạnh'), (25, 'Keep a secret', '...','Giữ bí mật'),
(25, 'Save time', '...','Tiết kiệm thời gian'), (25, 'Waste money', '...','Lãng phí tiền'), (25, 'Have fun', '...','Vui vẻ'), (25, 'Make an effort', '...','Nỗ lực');
INSERT INTO grammars (lesson_id, explanation_english, explanation_vietnamese) VALUES 
(25, 'Make vs Do', 'Make: Tạo ra cái mới (Make a cake, Make a mistake). Do: Hành động, công việc (Do homework, Do exercise).'),
(25, 'Common Collocations', 'Các từ đi chung với nhau theo thói quen bản xứ: Pay attention (không dùng Give attention), Fast food (không dùng Quick food).');
INSERT INTO conversations (id, lesson_id, title, audio_url) VALUES (25, 25, 'Advice', 'audio/c25.mp3');
INSERT INTO sentences (conversation_id, character_name, text_english, text_vietnamese) VALUES 
(25, 'A', 'Please pay attention to what I say.', 'Làm ơn chú ý những gì tôi nói.'),
(25, 'B', 'Okay. Can you do me a favor?', 'Ok. Bạn giúp tôi một việc được không?');

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;
-- Xóa dữ liệu cũ để nạp mới cho sạch
TRUNCATE TABLE answer_options;
TRUNCATE TABLE questions;
TRUNCATE TABLE tests; 
-- (Nếu muốn giữ bài học thì KHÔNG truncate lessons/vocabularies)
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- KHỞI TẠO 15 BÀI KIỂM TRA
-- ============================================================
INSERT INTO tests (id, name, level, audio_url) VALUES 
(1, 'Test 1: Basic Grammar (Easy)', 1, 'audio/t1.mp3'),
(2, 'Test 2: Tenses Review (Easy)', 1, 'audio/t2.mp3'),
(3, 'Test 3: Nouns & Pronouns (Easy)', 1, 'audio/t3.mp3'),
(4, 'Test 4: Adjectives (Easy)', 1, 'audio/t4.mp3'),
(5, 'Test 5: Vocabulary Check (Easy)', 1, 'audio/t5.mp3'),
(6, 'Test 6: Passive & Future (Medium)', 2, 'audio/t6.mp3'),
(7, 'Test 7: Conditionals (Medium)', 2, 'audio/t7.mp3'),
(8, 'Test 8: Reported Speech (Medium)', 2, 'audio/t8.mp3'),
(9, 'Test 9: Relative Clauses (Medium)', 2, 'audio/t9.mp3'),
(10, 'Test 10: Mixed Grammar (Medium)', 2, 'audio/t10.mp3'),
(11, 'Test 11: Advanced Structure (Hard)', 3, 'audio/t11.mp3'),
(12, 'Test 12: Inversion & Emphasis (Hard)', 3, 'audio/t12.mp3'),
(13, 'Test 13: Idioms & Phrasal Verbs (Hard)', 3, 'audio/t13.mp3'),
(14, 'Test 14: Complex Clauses (Hard)', 3, 'audio/t14.mp3'),
(15, 'Test 15: Proficiency Final (Hard)', 3, 'audio/t15.mp3');

-- ============================================================
-- NỘI DUNG TEST 1 (EASY) - NGỮ PHÁP CƠ BẢN
-- ============================================================
-- Q1: Single Choice
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (1, 1, 'I ___ a student.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (1, 'am', 1), (1, 'is', 0), (1, 'are', 0);

-- Q2: True/False
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (2, 1, '"Apple" is a noun.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (2, 'True', 1), (2, 'False', 0);

-- Q3: Arrange Sentence
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (3, 1, 'Arrange: name / My / John / is', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (3, 'My', 1), (3, 'name', 1), (3, 'is', 1), (3, 'John', 1);

-- Q4: Multiple Choice (Chọn 2 đáp án đúng)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (4, 1, 'Select TWO vowels (nguyên âm):', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (4, 'A', 1), (4, 'B', 0), (4, 'E', 1), (4, 'Z', 0);

-- Q5: Fill in Blank
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (5, 1, 'She ___ (go) to school everyday.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (5, 'goes', 1);

-- Q6-Q10: Single Choice
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(6, 1, 'Which word is a verb?', 'SINGLE_CHOICE'),
(7, 1, 'He ___ not like pizza.', 'SINGLE_CHOICE'),
(8, 1, 'They ___ playing soccer now.', 'SINGLE_CHOICE'),
(9, 1, 'Choose the plural of "Child":', 'SINGLE_CHOICE'),
(10, 1, 'Is she beautiful? Yes, ___ is.', 'SINGLE_CHOICE');

INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(6, 'Run', 1), (6, 'Red', 0), (6, 'Big', 0),
(7, 'do', 0), (7, 'does', 1), (7, 'is', 0),
(8, 'is', 0), (8, 'are', 1), (8, 'am', 0),
(9, 'Childs', 0), (9, 'Children', 1), (9, 'Childes', 0),
(10, 'he', 0), (10, 'she', 1), (10, 'it', 0);

-- ============================================================
-- NỘI DUNG TEST 6 (MEDIUM) - BỊ ĐỘNG & TƯƠNG LAI
-- ============================================================
-- Q51: Arrange Sentence (Bị động)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (51, 6, 'Arrange: car / washed / The / was / dad / by', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(51, 'The', 1), (51, 'car', 1), (51, 'was', 1), (51, 'washed', 1), (51, 'by', 1), (51, 'dad', 1);

-- Q52: Single Choice (Will vs Going to)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (52, 6, 'Look at the clouds! It ___ rain.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (52, 'is going to', 1), (52, 'will', 0), (52, 'shall', 0);

-- Q53: True/False
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (53, 6, '"I will help you" is a prediction.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (53, 'True', 0), (53, 'False', 1); -- Nó là lời hứa/quyết định tức thì

-- Q54: Multiple Choice (Chọn câu đúng ngữ pháp)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (54, 6, 'Select ALL correct passive sentences:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(54, 'The cake was eaten.', 1), 
(54, 'The cake eaten was.', 0), 
(54, 'The letter is written by John.', 1);

-- Q55: Fill in Blank
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (55, 6, 'Passive: The house ___ (build) in 1990.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (55, 'was built', 1);

-- Q56-60: Single Choice
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(56, 6, 'This problem must ___ solved immediately.', 'SINGLE_CHOICE'),
(57, 6, 'I promise I ___ tell anyone.', 'SINGLE_CHOICE'),
(58, 6, 'Next year, I ___ 20 years old.', 'SINGLE_CHOICE'),
(59, 6, 'Active: "Someone stole my bag." -> Passive: "My bag ___."', 'SINGLE_CHOICE'),
(60, 6, 'Choose the correct form: "The room is ___ every day."', 'SINGLE_CHOICE');

INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(56, 'be', 1), (56, 'been', 0), (56, 'being', 0),
(57, 'won''t', 1), (57, 'don''t', 0), (57, 'not', 0),
(58, 'will be', 1), (58, 'am going to be', 0), (58, 'am', 0),
(59, 'was stolen', 1), (59, 'is stolen', 0), (59, 'stole', 0),
(60, 'cleaned', 1), (60, 'clean', 0), (60, 'cleaning', 0);

-- ============================================================
-- NỘI DUNG TEST 11 (HARD) - ADVANCED STRUCTURE
-- ============================================================
-- Q101: Inversion (Đảo ngữ - Fill in blank)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (101, 11, 'Never ___ (I / see) such a beautiful bird.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (101, 'have I seen', 1);

-- Q102: Single Choice (Idioms)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (102, 11, 'The exam was a piece of ___. (Very easy)', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (102, 'cake', 1), (102, 'candy', 0), (102, 'pie', 0), (102, 'pizza', 0);

-- Q103: Multiple Choice (Phrasal Verbs - Chọn 2 nghĩa đúng)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (103, 11, 'Which words can replace "GIVE UP"?', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(103, 'Stop doing something', 1), 
(103, 'Quit', 1), 
(103, 'Continue', 0), 
(103, 'Start', 0);

-- Q104: Arrange Sentence (Conditional Type 3 - Đảo ngữ)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (104, 11, 'Arrange: known / Had / I / would / come / I / have', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(104, 'Had', 1), (104, 'I', 1), (104, 'known', 1), (104, 'I', 1), (104, 'would', 1), (104, 'have', 1), (104, 'come', 1);

-- Q105: Single Choice (Relative Clause - Advanced)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (105, 11, 'The man, ___ I spoke to, is my boss.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (105, 'whom', 1), (105, 'who', 0), (105, 'which', 0), (105, 'that', 0); -- Whom chuẩn ngữ pháp trong non-defining

-- Q106-110: Mixed Advanced
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(106, 11, 'No sooner had I arrived ___ the phone rang.', 'SINGLE_CHOICE'),
(107, 11, 'I wish I ___ (know) the answer yesterday.', 'SINGLE_CHOICE'),
(108, 11, 'It is high time we ___ home.', 'SINGLE_CHOICE'),
(109, 11, 'Neither the teacher nor the students ___ aware of the fire.', 'SINGLE_CHOICE'),
(110, 11, 'Select the correct collocation: "___ an effort"', 'SINGLE_CHOICE');

INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(106, 'than', 1), (106, 'when', 0), (106, 'then', 0),
(107, 'had known', 1), (107, 'knew', 0), (107, 'know', 0),
(108, 'went', 1), (108, 'go', 0), (108, 'gone', 0),
(109, 'were', 1), (109, 'was', 0), (109, 'is', 0),
(110, 'Make', 1), (110, 'Do', 0), (110, 'Create', 0);

-- ============================================================
-- NỘI DUNG TEST 15 (HARD) - FINAL PROFICIENCY
-- ============================================================
-- Q141: Fill in blank (Cleft Sentence)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (141, 15, 'It was Tom ___ broke the window.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (141, 'who', 1);

-- Q142: Single Choice (Advanced Vocab)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (142, 15, 'His explanation was completely ___. (Unbelievable)', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (142, 'implausible', 1), (142, 'impossible', 0), (142, 'imperfect', 0);

-- Q143: Multiple Choice (Synonyms)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (143, 15, 'Select synonyms for "IMPORTANT":', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(143, 'Crucial', 1), 
(143, 'Essential', 1), 
(143, 'Trivial', 0), 
(143, 'Minor', 0);

-- Q144: Arrange Sentence (Inversion with 'Not only')
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (144, 15, 'Arrange: he / Not / play / only / does / piano / well', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(144, 'Not', 1), (144, 'only', 1), (144, 'does', 1), (144, 'he', 1), (144, 'play', 1), (144, 'piano', 1), (144, 'well', 1);

-- Q145: Single Choice (Tag Question)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES (145, 15, 'Let''s go for a walk, ___?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES (145, 'shall we', 1), (145, 'will we', 0), (145, 'don''t we', 0);

-- Q146-150: Final Mix
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(146, 15, 'Hardly had I slept when the phone ___.', 'SINGLE_CHOICE'),
(147, 15, 'He suggested ___ for a walk.', 'SINGLE_CHOICE'),
(148, 15, 'Despite ___ tired, he kept working.', 'SINGLE_CHOICE'),
(149, 15, 'I would rather you ___ smoke here.', 'SINGLE_CHOICE'),
(150, 15, 'By the time you arrive, I ___ finished.', 'SINGLE_CHOICE');

INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(146, 'rang', 1), (146, 'ring', 0), (146, 'rung', 0),
(147, 'going', 1), (147, 'to go', 0), (147, 'go', 0),
(148, 'being', 1), (148, 'be', 0), (148, 'was', 0),
(149, 'didn''t', 1), (149, 'don''t', 0), (149, 'not', 0),
(150, 'will have', 1), (150, 'will', 0), (150, 'have', 0);

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 2 (Nếu chưa có trong bảng tests)
-- ============================================================
-- Lưu ý: Nếu bạn đã chạy lệnh tạo Tests trước đó rồi thì dòng này có thể báo trùng ID, 
-- nhưng không sao, MySQL sẽ bỏ qua hoặc bạn có thể xóa dòng INSERT INTO tests này đi.
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(2, 'Test 2: Tenses Review (Easy)', 1, 'audio/test2.mp3');

-- ============================================================
-- XÓA CÂU HỎI CŨ CỦA TEST 2 (ĐỂ TRÁNH TRÙNG LẶP)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 11 AND 20;
DELETE FROM questions WHERE id BETWEEN 11 AND 20;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 2 (ID 11 -> 20)
-- ============================================================

-- Câu 11: Hiện tại tiếp diễn (Dấu hiệu "Look!")
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(11, 2, 'Look! The bus ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(11, 'come', 0), 
(11, 'is coming', 1), 
(11, 'came', 0);

-- Câu 12: Quá khứ đơn (To Be - born)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(12, 2, 'I ___ born in 2000.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(12, 'was', 1), 
(12, 'were', 0), 
(12, 'am', 0);

-- Câu 13: Điền từ (Quá khứ đơn phủ định)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(13, 2, 'She ___ (not/go) to school yesterday.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(13, 'did not go', 1);

-- Câu 14: Hiện tại đơn (Thói quen - every summer)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(14, 2, 'We ___ to the beach every summer.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(14, 'go', 1), 
(14, 'going', 0), 
(14, 'went', 0);

-- Câu 15: Sắp xếp câu (Hiện tại tiếp diễn)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(15, 2, 'Arrange: playing / They / now / soccer / are', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(15, 'They', 1), 
(15, 'are', 1), 
(15, 'playing', 1), 
(15, 'soccer', 1), 
(15, 'now', 1);

-- Câu 16: Đúng/Sai (Ngữ pháp sai: "goed")
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(16, 2, 'True or False: "I goed to the cinema" is correct.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(16, 'True', 0), 
(16, 'False', 1);

-- Câu 17: Hiện tại tiếp diễn (at the moment)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(17, 2, 'He ___ his homework at the moment.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(17, 'is doing', 1), 
(17, 'does', 0), 
(17, 'did', 0);

-- Câu 18: Câu hỏi Quá khứ đơn (When did...)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(18, 2, 'When ___ you buy this car?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(18, 'did', 1), 
(18, 'do', 0), 
(18, 'were', 0);

-- Câu 19: Chọn nhiều đáp án (Dấu hiệu thì Quá khứ)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(19, 2, 'Select TWO signal words for Past Simple:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(19, 'Yesterday', 1), 
(19, 'Now', 0), 
(19, 'Ago', 1), 
(19, 'Tomorrow', 0);

-- Câu 20: Quá khứ đơn (Động từ to be số nhiều)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(20, 2, 'Where ___ you and Tom last night?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(20, 'was', 0), 
(20, 'were', 1), 
(20, 'are', 0);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 3 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(3, 'Test 3: Nouns & Pronouns (Easy)', 1, 'audio/test3.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 3 (ID 21-30)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 21 AND 30;
DELETE FROM questions WHERE id BETWEEN 21 AND 30;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 3 (ID 21 -> 30)
-- ============================================================

-- Câu 21: Danh từ số nhiều bất quy tắc (Person -> People)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(21, 3, 'There are five ___ in the room.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(21, 'person', 0), 
(21, 'people', 1), 
(21, 'persons', 0);

-- Câu 22: Đại từ sở hữu (Mine)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(22, 3, 'This book belongs to me. It is ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(22, 'my', 0), 
(22, 'mine', 1), 
(22, 'me', 0);

-- Câu 23: Đại từ phản thân (Herself)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(23, 3, 'She looked at ___ in the mirror.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(23, 'herself', 1), 
(23, 'himself', 0), 
(23, 'her', 0);

-- Câu 24: Từ để hỏi (What name)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(24, 3, '___ is your name?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(24, 'What', 1), 
(24, 'Who', 0), 
(24, 'Which', 0);

-- Câu 25: Sắp xếp câu (Sở hữu cách)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(25, 3, 'Arrange: car / This / my / father''s / is', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(25, 'This', 1), 
(25, 'is', 1), 
(25, 'my', 1), 
(25, 'father''s', 1), 
(25, 'car', 1);

-- Câu 26: Chọn nhiều đáp án (Danh từ không đếm được)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(26, 3, 'Select TWO Uncountable Nouns:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(26, 'Water', 1), 
(26, 'Apple', 0), 
(26, 'Information', 1), 
(26, 'Table', 0);

-- Câu 27: Lượng từ (Any trong câu phủ định)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(27, 3, 'I don''t have ___ money.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(27, 'any', 1), 
(27, 'some', 0), 
(27, 'many', 0);

-- Câu 28: Liên từ đôi (Both...and)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(28, 3, '___ Tom and Jerry are friends.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(28, 'Both', 1), 
(28, 'Neither', 0), 
(28, 'Either', 0);

-- Câu 29: Điền từ (Tính từ sở hữu - Your)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(29, 3, 'Is this ___ (you) pen?', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(29, 'your', 1);

-- Câu 30: Đúng/Sai (Chính tả số nhiều)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(30, 3, 'True or False: "Childs" is the plural of "Child".', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(30, 'True', 0), 
(30, 'False', 1);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 4 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(4, 'Test 4: Adjectives & Comparisons (Easy)', 1, 'audio/test4.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 4 (ID 31-40)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 31 AND 40;
DELETE FROM questions WHERE id BETWEEN 31 AND 40;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 4 (ID 31 -> 40)
-- ============================================================

-- Câu 31: Trạng từ bất quy tắc (Fast -> Fast)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(31, 4, 'He runs very ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(31, 'fast', 1), 
(31, 'fastly', 0), 
(31, 'fastness', 0);

-- Câu 32: So sánh hơn bất quy tắc (Good -> Better)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(32, 4, 'This movie is ___ than the other one.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(32, 'good', 0), 
(32, 'better', 1), 
(32, 'best', 0);

-- Câu 33: So sánh nhất (Tính từ dài)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(33, 4, 'She is the ___ girl in the class.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(33, 'beautiful', 0), 
(33, 'more beautiful', 0), 
(33, 'most beautiful', 1);

-- Câu 34: Điền từ (Tính từ đuôi -ed chỉ cảm xúc)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(34, 4, 'I am ___ (tired) because I worked all day.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(34, 'tired', 1);

-- Câu 35: Sắp xếp câu (Trật tự tính từ: Ý kiến -> Màu sắc)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(35, 4, 'Arrange: beautiful / has / She / eyes / blue', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(35, 'She', 1), 
(35, 'has', 1), 
(35, 'beautiful', 1), 
(35, 'blue', 1), 
(35, 'eyes', 1);

-- Câu 36: Trạng từ chỉ cách thức (Good -> Well)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(36, 4, 'He speaks English ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(36, 'good', 0), 
(36, 'well', 1), 
(36, 'goodly', 0);

-- Câu 37: Đúng/Sai (Ngữ pháp so sánh sai)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(37, 4, 'True or False: "He is more fast than me" is correct.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(37, 'True', 0), 
(37, 'False', 1);

-- Câu 38: Chọn nhiều đáp án (Từ đồng nghĩa - Happy)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(38, 4, 'Select TWO synonyms for "Happy":', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(38, 'Glad', 1), 
(38, 'Sad', 0), 
(38, 'Joyful', 1), 
(38, 'Angry', 0);

-- Câu 39: Trạng từ bổ nghĩa cho tính từ
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(39, 4, 'The test was ___ easy.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(39, 'surprise', 0), 
(39, 'surprisingly', 1), 
(39, 'surprising', 0);

-- Câu 40: So sánh hơn (Tính từ dài - Expensive)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(40, 4, 'Gold is ___ expensive than silver.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(40, 'more', 1), 
(40, 'much', 0), 
(40, 'many', 0);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 5 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(5, 'Test 5: Vocabulary Check (Easy)', 1, 'audio/test5.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 5 (ID 41-50)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 41 AND 50;
DELETE FROM questions WHERE id BETWEEN 41 AND 50;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 5 (ID 41 -> 50)
-- ============================================================

-- Câu 41: Trái nghĩa (Hot)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(41, 5, 'Opposite of "Hot"?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(41, 'Cold', 1), 
(41, 'Warm', 0), 
(41, 'Cool', 0);

-- Câu 42: Từ vựng nghề nghiệp (Hospital)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(42, 5, 'A ___ works in a hospital.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(42, 'Teacher', 0), 
(42, 'Doctor', 1), 
(42, 'Farmer', 0);

-- Câu 43: Từ vựng màu sắc (Banana)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(43, 5, 'Which color is a banana?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(43, 'Red', 0), 
(43, 'Yellow', 1), 
(43, 'Blue', 0);

-- Câu 44: Chọn nhiều đáp án (Động vật)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(44, 5, 'Select TWO animals:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(44, 'Cat', 1), 
(44, 'Table', 0), 
(44, 'Dog', 1), 
(44, 'Car', 0);

-- Câu 45: Từ vựng thời gian (Breakfast)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(45, 5, 'I eat breakfast in the ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(45, 'morning', 1), 
(45, 'evening', 0), 
(45, 'night', 0);

-- Câu 46: Dịch thuật (Gia đình)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(46, 5, 'Translate: "Gia đình"', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(46, 'Family', 1), 
(46, 'Friend', 0), 
(46, 'School', 0);

-- Câu 47: Sắp xếp câu (Want to drink)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(47, 5, 'Arrange: drink / I / water / to / want', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(47, 'I', 1), 
(47, 'want', 1), 
(47, 'to', 1), 
(47, 'drink', 1), 
(47, 'water', 1);

-- Câu 48: Từ vựng gia đình (Aunt)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(48, 5, 'My mother''s sister is my ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(48, 'Uncle', 0), 
(48, 'Aunt', 1), 
(48, 'Cousin', 0);

-- Câu 49: Từ vựng bộ phận cơ thể (Ears)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(49, 5, 'We use "ears" to ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(49, 'see', 0), 
(49, 'hear', 1), 
(49, 'touch', 0);

-- Câu 50: Đúng/Sai (Kiến thức chung)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(50, 5, 'True or False: "Sunday" is a month.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(50, 'True', 0), 
(50, 'False', 1);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 5 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(5, 'Test 5: Vocabulary Check (Easy)', 1, 'audio/test5.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 5 (ID 41-50)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 41 AND 50;
DELETE FROM questions WHERE id BETWEEN 41 AND 50;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 5 (ID 41 -> 50)
-- ============================================================

-- Câu 41: Trái nghĩa (Hot)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(41, 5, 'Opposite of "Hot"?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(41, 'Cold', 1), 
(41, 'Warm', 0), 
(41, 'Cool', 0);

-- Câu 42: Từ vựng nghề nghiệp (Hospital)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(42, 5, 'A ___ works in a hospital.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(42, 'Teacher', 0), 
(42, 'Doctor', 1), 
(42, 'Farmer', 0);

-- Câu 43: Từ vựng màu sắc (Banana)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(43, 5, 'Which color is a banana?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(43, 'Red', 0), 
(43, 'Yellow', 1), 
(43, 'Blue', 0);

-- Câu 44: Chọn nhiều đáp án (Động vật)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(44, 5, 'Select TWO animals:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(44, 'Cat', 1), 
(44, 'Table', 0), 
(44, 'Dog', 1), 
(44, 'Car', 0);

-- Câu 45: Từ vựng thời gian (Breakfast)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(45, 5, 'I eat breakfast in the ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(45, 'morning', 1), 
(45, 'evening', 0), 
(45, 'night', 0);

-- Câu 46: Dịch thuật (Gia đình)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(46, 5, 'Translate: "Gia đình"', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(46, 'Family', 1), 
(46, 'Friend', 0), 
(46, 'School', 0);

-- Câu 47: Sắp xếp câu (Want to drink)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(47, 5, 'Arrange: drink / I / water / to / want', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(47, 'I', 1), 
(47, 'want', 1), 
(47, 'to', 1), 
(47, 'drink', 1), 
(47, 'water', 1);

-- Câu 48: Từ vựng gia đình (Aunt)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(48, 5, 'My mother''s sister is my ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(48, 'Uncle', 0), 
(48, 'Aunt', 1), 
(48, 'Cousin', 0);

-- Câu 49: Từ vựng bộ phận cơ thể (Ears)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(49, 5, 'We use "ears" to ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(49, 'see', 0), 
(49, 'hear', 1), 
(49, 'touch', 0);

-- Câu 50: Đúng/Sai (Kiến thức chung)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(50, 5, 'True or False: "Sunday" is a month.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(50, 'True', 0), 
(50, 'False', 1);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 7 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(7, 'Test 7: Conditionals (Medium)', 2, 'audio/test7.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 7 (ID 61-70)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 61 AND 70;
DELETE FROM questions WHERE id BETWEEN 61 AND 70;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 7 (ID 61 -> 70)
-- ============================================================

-- Câu 61: Điều kiện loại 1 (Will)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(61, 7, 'If it rains, I ___ stay home.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(61, 'will', 1), 
(61, 'would', 0), 
(61, 'had', 0);

-- Câu 62: Điều kiện loại 2 (If I were you)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(62, 7, 'If I were you, I ___ buy that car.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(62, 'will', 0), 
(62, 'would', 1), 
(62, 'am', 0);

-- Câu 63: Đúng/Sai (Lý thuyết loại 2)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(63, 7, 'True or False: Type 2 conditional describes real situations in the present.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(63, 'True', 0), 
(63, 'False', 1); -- Sai, loại 2 là không có thật (unreal)

-- Câu 64: Cấu trúc Unless (Trừ khi)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(64, 7, 'Unless you hurry, you ___ miss the bus.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(64, 'will', 1), 
(64, 'would', 0), 
(64, 'won''t', 0);

-- Câu 65: Sắp xếp câu (Loại 2 - If I were rich)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(65, 7, 'Arrange: rich / If / I / were / travel / would / I', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(65, 'If', 1), 
(65, 'I', 1), 
(65, 'were', 1), 
(65, 'rich', 1), 
(65, 'I', 1), 
(65, 'would', 1), 
(65, 'travel', 1);

-- Câu 66: Điều kiện loại 0 (Sự thật hiển nhiên)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(66, 7, 'If you mix red and blue, you ___ purple.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(66, 'get', 1), 
(66, 'will get', 0), 
(66, 'got', 0);

-- Câu 67: Chọn nhiều đáp án (Câu đúng ngữ pháp)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(67, 7, 'Select TWO correct conditional sentences:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(67, 'If I go, I will buy it.', 1),       -- Loại 1 đúng
(67, 'If I go, I would buy it.', 0),      -- Sai
(67, 'If I went, I would buy it.', 1),    -- Loại 2 đúng
(67, 'If I went, I will buy it.', 0);     -- Sai

-- Câu 68: Điền từ (Chia động từ loại 2)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(68, 7, 'If she ___ (study) harder, she would pass the exam.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(68, 'studied', 1);

-- Câu 69: Điều kiện loại 2 (Động từ bất quy tắc See -> Saw)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(69, 7, 'What would you do if you ___ a ghost?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(69, 'see', 0), 
(69, 'saw', 1), 
(69, 'seen', 0);

-- Câu 70: Điều kiện loại 1 (Vế If chia hiện tại đơn)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(70, 7, 'I will call you if he ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(70, 'comes', 1), 
(70, 'will come', 0), 
(70, 'came', 0);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 8 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(8, 'Test 8: Reported Speech (Medium)', 2, 'audio/test8.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 8 (ID 71-80)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 71 AND 80;
DELETE FROM questions WHERE id BETWEEN 71 AND 80;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 8 (ID 71 -> 80)
-- ============================================================

-- Câu 71: Lùi thì (Hiện tại đơn -> Quá khứ đơn)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(71, 8, 'He said: "I am tired." -> He said he ___ tired.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(71, 'was', 1), 
(71, 'is', 0), 
(71, 'were', 0);

-- Câu 72: Câu mệnh lệnh (Imperative -> To V)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(72, 8, 'She told me ___ close the door.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(72, 'to', 1), 
(72, 'not', 0), 
(72, 'don''t', 0);

-- Câu 73: Câu hỏi Yes/No (Will -> Would)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(73, 8, 'Direct: "Will you go?" -> Reported: He asked if I ___ go.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(73, 'would', 1), 
(73, 'will', 0), 
(73, 'did', 0);

-- Câu 74: Đúng/Sai (Đổi trạng từ thời gian)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(74, 8, 'True or False: In reported speech, "Tomorrow" becomes "The previous day".', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(74, 'True', 0), 
(74, 'False', 1); -- Sai, phải là "The following day" hoặc "The next day"

-- Câu 75: Chọn nhiều đáp án (Động từ trần thuật)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(75, 8, 'Select TWO common reporting verbs:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(75, 'Told', 1), 
(75, 'Talked', 0), 
(75, 'Asked', 1), 
(75, 'Spoke', 0);

-- Câu 76: Trật tự từ trong câu hỏi gián tiếp (Wh-question)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(76, 8, 'He asked me where ___.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(76, 'I lived', 1), 
(76, 'did I live', 0), 
(76, 'do I live', 0);

-- Câu 77: Sắp xếp câu (Cấu trúc Said that)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(77, 8, 'Arrange: said / She / that / she / happy / was', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(77, 'She', 1), 
(77, 'said', 1), 
(77, 'that', 1), 
(77, 'she', 1), 
(77, 'was', 1), 
(77, 'happy', 1);

-- Câu 78: Lùi thì Modal Verbs (Can -> Could)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(78, 8, 'Direct: "I can swim." -> Reported: He said he ___ swim.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(78, 'could', 1), 
(78, 'can', 0), 
(78, 'able', 0);

-- Câu 79: Điền từ (Từ nối If/Whether)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(79, 8, 'She asked: "Do you like it?" -> She asked ___ I liked it.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(79, 'if', 1); 
-- Lưu ý: Backend nên chấp nhận cả 'whether', nhưng ở đây ta set 1 đáp án chuẩn 'if' cho dễ.

-- Câu 80: Phân biệt Say và Tell
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(80, 8, 'He ___ me that he was busy.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(80, 'told', 1), 
(80, 'said', 0), 
(80, 'asked', 0);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 9 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(9, 'Test 9: Relative Clauses (Medium)', 2, 'audio/test9.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 9 (ID 81-90)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 81 AND 90;
DELETE FROM questions WHERE id BETWEEN 81 AND 90;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 9 (ID 81 -> 90)
-- ============================================================

-- Câu 81: Đại từ quan hệ chỉ người (Chủ ngữ)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(81, 9, 'The man ___ called yesterday is here.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(81, 'who', 1), 
(81, 'which', 0), 
(81, 'whose', 0);

-- Câu 82: Đại từ quan hệ chỉ vật
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(82, 9, 'This is the book ___ I bought.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(82, 'which', 1), 
(82, 'who', 0), 
(82, 'where', 0);

-- Câu 83: Trạng từ quan hệ chỉ lý do
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(83, 9, 'Do you know the reason ___ he left?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(83, 'why', 1), 
(83, 'which', 0), 
(83, 'who', 0);

-- Câu 84: Chọn nhiều đáp án (Đại từ chỉ người)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(84, 9, 'Select TWO relative pronouns used for people:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(84, 'Who', 1), 
(84, 'Which', 0), 
(84, 'Whom', 1), 
(84, 'Where', 0);

-- Câu 85: Đại từ quan hệ chỉ sở hữu (Whose)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(85, 9, 'The boy ___ father is a doctor is my friend.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(85, 'whose', 1), 
(85, 'who', 0), 
(85, 'which', 0);

-- Câu 86: Sắp xếp câu (Mệnh đề quan hệ chỉ nơi chốn)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(86, 9, 'Arrange: house / This / the / is / where / live / I', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(86, 'This', 1), 
(86, 'is', 1), 
(86, 'the', 1), 
(86, 'house', 1), 
(86, 'where', 1), 
(86, 'I', 1), 
(86, 'live', 1);

-- Câu 87: Đúng/Sai (Quy tắc dùng "That" trong mệnh đề không xác định)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(87, 9, 'True or False: We can use "That" after a comma (Non-defining clause).', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(87, 'True', 0), 
(87, 'False', 1); -- Sai, không dùng "that" sau dấu phẩy

-- Câu 88: Điền từ (Sở hữu)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(88, 9, 'I met a girl ___ (possessive) name was Sarah.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(88, 'whose', 1);

-- Câu 89: Đại từ quan hệ (Vật/Nơi chốn - Cần phân biệt)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(89, 9, 'The city ___ we visited was beautiful.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(89, 'which', 1), -- Vì "visited" tác động trực tiếp lên "city" (tân ngữ), không phải "in the city"
(89, 'where', 0), 
(89, 'who', 0);

-- Câu 90: Nối câu
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(90, 9, 'Combine: "I saw the dog. The dog bit me." -> "I saw the dog ___ bit me."', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(90, 'which', 1), 
(90, 'who', 0), 
(90, 'it', 0);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 9 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(9, 'Test 9: Relative Clauses (Medium)', 2, 'audio/test9.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 9 (ID 81-90)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 81 AND 90;
DELETE FROM questions WHERE id BETWEEN 81 AND 90;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 9 (ID 81 -> 90)
-- ============================================================

-- Câu 81: Đại từ quan hệ chỉ người (Chủ ngữ)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(81, 9, 'The man ___ called yesterday is here.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(81, 'who', 1), 
(81, 'which', 0), 
(81, 'whose', 0);

-- Câu 82: Đại từ quan hệ chỉ vật
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(82, 9, 'This is the book ___ I bought.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(82, 'which', 1), 
(82, 'who', 0), 
(82, 'where', 0);

-- Câu 83: Trạng từ quan hệ chỉ lý do
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(83, 9, 'Do you know the reason ___ he left?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(83, 'why', 1), 
(83, 'which', 0), 
(83, 'who', 0);

-- Câu 84: Chọn nhiều đáp án (Đại từ chỉ người)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(84, 9, 'Select TWO relative pronouns used for people:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(84, 'Who', 1), 
(84, 'Which', 0), 
(84, 'Whom', 1), 
(84, 'Where', 0);

-- Câu 85: Đại từ quan hệ chỉ sở hữu (Whose)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(85, 9, 'The boy ___ father is a doctor is my friend.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(85, 'whose', 1), 
(85, 'who', 0), 
(85, 'which', 0);

-- Câu 86: Sắp xếp câu (Mệnh đề quan hệ chỉ nơi chốn)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(86, 9, 'Arrange: house / This / the / is / where / live / I', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(86, 'This', 1), 
(86, 'is', 1), 
(86, 'the', 1), 
(86, 'house', 1), 
(86, 'where', 1), 
(86, 'I', 1), 
(86, 'live', 1);

-- Câu 87: Đúng/Sai (Quy tắc dùng "That" trong mệnh đề không xác định)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(87, 9, 'True or False: We can use "That" after a comma (Non-defining clause).', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(87, 'True', 0), 
(87, 'False', 1); -- Sai, không dùng "that" sau dấu phẩy

-- Câu 88: Điền từ (Sở hữu)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(88, 9, 'I met a girl ___ (possessive) name was Sarah.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(88, 'whose', 1);

-- Câu 89: Đại từ quan hệ (Vật/Nơi chốn - Cần phân biệt)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(89, 9, 'The city ___ we visited was beautiful.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(89, 'which', 1), -- Vì "visited" tác động trực tiếp lên "city" (tân ngữ), không phải "in the city"
(89, 'where', 0), 
(89, 'who', 0);

-- Câu 90: Nối câu
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(90, 9, 'Combine: "I saw the dog. The dog bit me." -> "I saw the dog ___ bit me."', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(90, 'which', 1), 
(90, 'who', 0), 
(90, 'it', 0); -- Phải có dấu chấm phẩy ở đây

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 11 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(11, 'Test 11: Advanced Structure (Hard)', 3, 'audio/test11.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 11 (ID 101-110)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 101 AND 110;
DELETE FROM questions WHERE id BETWEEN 101 AND 110;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 11 (ID 101 -> 110)
-- ============================================================

-- Câu 101: Đảo ngữ với Never (Fill in blank)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(101, 11, 'Never ___ (I / see) such a beautiful bird.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(101, 'have I seen', 1);

-- Câu 102: Thành ngữ (Idiom - Piece of cake)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(102, 11, 'The exam was a piece of ___. (Very easy)', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(102, 'cake', 1), 
(102, 'candy', 0), 
(102, 'pie', 0), 
(102, 'pizza', 0);

-- Câu 103: Chọn nhiều đáp án (Phrasal Verb - Give up)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(103, 11, 'Select TWO meanings/synonyms for "GIVE UP":', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(103, 'Stop doing something', 1), 
(103, 'Quit', 1), 
(103, 'Continue', 0), 
(103, 'Start', 0);

-- Câu 104: Sắp xếp câu (Đảo ngữ câu điều kiện loại 3)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(104, 11, 'Arrange: known / Had / I / would / come / I / have', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(104, 'Had', 1), 
(104, 'I', 1), 
(104, 'known', 1), 
(104, 'I', 1), 
(104, 'would', 1), 
(104, 'have', 1), 
(104, 'come', 1);

-- Câu 105: Mệnh đề quan hệ (Whom - Tân ngữ chỉ người)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(105, 11, 'The man, ___ I spoke to, is my boss.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(105, 'whom', 1), 
(105, 'who', 0), 
(105, 'which', 0), 
(105, 'that', 0);

-- Câu 106: Cấu trúc đảo ngữ (No sooner... than)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(106, 11, 'No sooner had I arrived ___ the phone rang.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(106, 'than', 1), 
(106, 'when', 0), 
(106, 'then', 0);

-- Câu 107: Câu ước (Wish + Quá khứ hoàn thành)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(107, 11, 'I wish I ___ (know) the answer yesterday.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(107, 'had known', 1), 
(107, 'knew', 0), 
(107, 'know', 0);

-- Câu 108: Cấu trúc giả định (It's high time + Past Simple)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(108, 11, 'It is high time we ___ home.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(108, 'went', 1), 
(108, 'go', 0), 
(108, 'gone', 0);

-- Câu 109: Sự hòa hợp chủ ngữ (Neither...nor)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(109, 11, 'Neither the teacher nor the students ___ aware of the fire.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(109, 'were', 1), -- Chia theo chủ ngữ gần nhất (students - số nhiều)
(109, 'was', 0), 
(109, 'is', 0);

-- Câu 110: Collocation (Make an effort)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(110, 11, 'Select the correct collocation: "___ an effort"', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(110, 'Make', 1), 
(110, 'Do', 0), 
(110, 'Create', 0);

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 12 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(12, 'Test 12: Inversion & Emphasis (Hard)', 3, 'audio/test12.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 12 (ID 111-120)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 111 AND 120;
DELETE FROM questions WHERE id BETWEEN 111 AND 120;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 12 (ID 111 -> 120)
-- ============================================================

-- Câu 111: Đảo ngữ với Rarely (Điền từ)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(111, 12, 'Rarely ___ (I / eat) sushi.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(111, 'do I eat', 1);

-- Câu 112: Đảo ngữ với Little (Biết ít/không biết gì)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(112, 12, '___ did I know the truth about him.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(112, 'Little', 1), 
(112, 'Small', 0), 
(112, 'Few', 0);

-- Câu 113: Đảo ngữ với Not only (Đảo to be)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(113, 12, 'Not only ___ smart, but also kind.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(113, 'is he', 1), 
(113, 'he is', 0), 
(113, 'he be', 0);

-- Câu 114: Sắp xếp câu (On no account - Không đời nào)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(114, 12, 'Arrange: account / On / no / you / leave / should', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(114, 'On', 1), 
(114, 'no', 1), 
(114, 'account', 1), 
(114, 'should', 1), 
(114, 'you', 1), 
(114, 'leave', 1);

-- Câu 115: Câu chẻ (Cleft Sentence - It was... that)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(115, 12, 'It was in Paris ___ we met, not London.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(115, 'that', 1), 
(115, 'where', 0), 
(115, 'when', 0);

-- Câu 116: Chọn nhiều đáp án (Trạng từ phủ định dùng đảo ngữ)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(116, 12, 'Select TWO negative adverbs used in inversion:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(116, 'Seldom', 1), 
(116, 'Always', 0), 
(116, 'Hardly', 1), 
(116, 'Often', 0);

-- Câu 117: Đảo ngữ giới từ chỉ nơi chốn (Here comes...)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(117, 12, '___ comes the bus!', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(117, 'Here', 1), 
(117, 'There', 0), 
(117, 'Where', 0);

-- Câu 118: Đảo ngữ với Only when
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(118, 12, 'Only when I called her ___ she answer.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(118, 'did', 1), 
(118, 'does', 0), 
(118, 'do', 0);

-- Câu 119: Đảo ngữ với So... that
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(119, 12, 'So beautiful ___ that everyone looked at her.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(119, 'was she', 1), 
(119, 'she was', 0), 
(119, 'is she', 0);

-- Câu 120: Đúng/Sai (Đảo ngữ với đại từ)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(120, 12, 'True or False: "Here comes he" is correct.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(120, 'True', 0), 
(120, 'False', 1); 
-- Giải thích: Với đại từ (he/she/it), không đảo ngữ động từ ra trước. Phải là "Here he comes".

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 13 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(13, 'Test 13: Idioms & Phrasal Verbs (Hard)', 3, 'audio/test13.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 13 (ID 121-130)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 121 AND 130;
DELETE FROM questions WHERE id BETWEEN 121 AND 130;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 13 (ID 121 -> 130)
-- ============================================================

-- Câu 121: Phrasal Verb (Quit -> Give up)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(121, 13, 'He decided to ___ smoking. (Quit)', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(121, 'give up', 1), 
(121, 'give in', 0), 
(121, 'give out', 0);

-- Câu 122: Phrasal Verb (Cancel -> Call off)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(122, 13, 'The meeting was ___ due to rain. (Cancelled)', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(122, 'called off', 1), 
(122, 'put off', 0), 
(122, 'taken off', 0);

-- Câu 123: Chọn nhiều đáp án (Idioms mang nghĩa Chúc may mắn)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(123, 13, 'Select TWO idioms meaning "Good luck":', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(123, 'Break a leg', 1), 
(123, 'Fingers crossed', 1), 
(123, 'Miss the boat', 0), 
(123, 'Cold feet', 0);

-- Câu 124: Giới từ đi với Look forward (to)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(124, 13, 'I am looking ___ to the holiday.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(124, 'forward', 1), 
(124, 'for', 0), 
(124, 'after', 0);

-- Câu 125: Sắp xếp câu (Thành ngữ: Spill the beans - Lộ bí mật)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(125, 13, 'Arrange: beans / He / the / spilled', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(125, 'He', 1), 
(125, 'spilled', 1), 
(125, 'the', 1), 
(125, 'beans', 1);

-- Câu 126: Phrasal Verb (Đón ai đó - Pick up)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(126, 13, 'Can you ___ me up at the airport?', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(126, 'pick', 1), 
(126, 'take', 0), 
(126, 'get', 0);

-- Câu 127: Điền từ (Idiom: Cost an arm and a leg - Rất đắt)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(127, 13, 'It costs an ___ and a leg.', 'FILL_IN_BLANK');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(127, 'arm', 1);

-- Câu 128: Idiom (See eye to eye - Đồng quan điểm)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(128, 13, 'I don''t see ___ to eye with him.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(128, 'eye', 1), 
(128, 'ear', 0), 
(128, 'nose', 0);

-- Câu 129: Phrasal Verb (Hết sạch - Run out of)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(129, 13, 'We ran ___ of gas.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(129, 'out', 1), 
(129, 'away', 0), 
(129, 'over', 0);

-- Câu 130: Đúng/Sai (Nghĩa của Break a leg)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(130, 13, 'True or False: "Break a leg" means getting hurt.', 'TRUE_FALSE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(130, 'True', 0), 
(130, 'False', 1); -- Sai, nó có nghĩa là Chúc may mắn

SET FOREIGN_KEY_CHECKS = 1;

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- TẠO BÀI TEST SỐ 14 (Nếu chưa có)
-- ============================================================
INSERT IGNORE INTO tests (id, name, level, audio_url) VALUES 
(14, 'Test 14: Complex Clauses (Hard)', 3, 'audio/test14.mp3');

-- ============================================================
-- XÓA DỮ LIỆU CŨ CỦA TEST 14 (ID 131-140)
-- ============================================================
DELETE FROM answer_options WHERE question_id BETWEEN 131 AND 140;
DELETE FROM questions WHERE id BETWEEN 131 AND 140;

-- ============================================================
-- NỘI DUNG CÂU HỎI TEST 14 (ID 131 -> 140)
-- ============================================================

-- Câu 131: Rút gọn mệnh đề cùng chủ ngữ (Feeling tired)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(131, 14, '___ tired, he went to bed early.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(131, 'Feeling', 1), 
(131, 'Felt', 0), 
(131, 'To feel', 0);

-- Câu 132: Câu giả định với Suggest (Suggest + S + (should) V-bare)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(132, 14, 'I suggest that he ___ a doctor immediately.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(132, 'see', 1), 
(132, 'sees', 0), 
(132, 'saw', 0);

-- Câu 133: Chọn nhiều đáp án (Câu giả định đúng)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(133, 14, 'Select TWO sentences using correct Subjunctive Mood:', 'MULTIPLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(133, 'I wish I were rich.', 1), 
(133, 'I insist he stay here.', 1), 
(133, 'I wish I am rich.', 0), 
(133, 'It is vital that she goes.', 0); -- Phải là "go"

-- Câu 134: Phân từ hoàn thành (Having + P2)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(134, 14, '___ seen the movie twice, I didn''t want to go again.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(134, 'Having', 1), 
(134, 'Have', 0), 
(134, 'Had', 0);

-- Câu 135: Sắp xếp câu (Đảo ngữ điều kiện loại 3)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(135, 14, 'Arrange: known / I / had / truth / the / If', 'ARRANGE_SENTENCE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(135, 'If', 1), 
(135, 'I', 1), 
(135, 'had', 1), 
(135, 'known', 1), 
(135, 'the', 1), 
(135, 'truth', 1);

-- Câu 136: Cấu trúc tính từ + That + S + V-bare (It is essential)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(136, 14, 'It is essential that she ___ on time.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(136, 'be', 1), 
(136, 'is', 0), 
(136, 'was', 0);

-- Câu 137: Giới từ + V-ing (Despite being)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(137, 14, 'Despite ___ late, he finished the job.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(137, 'being', 1), 
(137, 'be', 0), 
(137, 'is', 0);

-- Câu 138: Liên từ thời gian (While vs During)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(138, 14, '___ walking down the street, I met John.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(138, 'While', 1), 
(138, 'During', 0), 
(138, 'Since', 0);

-- Câu 139: Cấu trúc As if/As though (Như thể là - Unreal)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(139, 14, 'He talks as if he ___ the boss.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(139, 'were', 1), 
(139, 'was', 0), 
(139, 'is', 0);

-- Câu 140: Cụm từ cố định (Given the...)
INSERT INTO questions (id, test_id, question_text, question_type) VALUES 
(140, 14, 'Given the ___, we should stop now.', 'SINGLE_CHOICE');
INSERT INTO answer_options (question_id, option_text, is_correct) VALUES 
(140, 'situation', 1), 
(140, 'place', 0), 
(140, 'time', 0);

SET FOREIGN_KEY_CHECKS = 1;

