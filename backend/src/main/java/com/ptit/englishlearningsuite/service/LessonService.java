package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.*;
import com.ptit.englishlearningsuite.entity.*;
import com.ptit.englishlearningsuite.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private SentenceRepository sentenceRepository;

    @Autowired
    private VocabularyRepository vocabularyRepository;

    @Autowired
    private GrammarRepository grammarRepository;

    public List<LessonSummaryDTO> getAllLessons() {
        return lessonRepository.findAll().stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    public LessonDetailDTO getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        return convertToDetailDto(lesson);
    }

    // --- CÁC HÀM CHUYỂN ĐỔI (MAPPER) ---

    private LessonSummaryDTO convertToSummaryDto(Lesson lesson) {
        LessonSummaryDTO dto = new LessonSummaryDTO();
        dto.setId(lesson.getId());
        dto.setLessonNumber(lesson.getLessonNumber());
        dto.setLevel(lesson.getLevel());
        dto.setName(lesson.getName());
        return dto;
    }

    private LessonDetailDTO convertToDetailDto(Lesson lesson) {
        LessonDetailDTO dto = new LessonDetailDTO();
        dto.setId(lesson.getId());
        dto.setLessonNumber(lesson.getLessonNumber());
        dto.setLevel(lesson.getLevel());
        dto.setName(lesson.getName());
        dto.setAudioUrl(lesson.getAudioUrl());

        // KIỂM TRA KỸ PHẦN NÀY
        // Chúng ta kiểm tra null để đảm bảo an toàn
        if (lesson.getVocabularies() != null) {
            dto.setVocabularies(lesson.getVocabularies().stream()
                    .map(this::convertVocabularyToDto).collect(Collectors.toSet()));
        } else {
            dto.setVocabularies(Collections.emptySet()); // Trả về danh sách rỗng nếu null
        }

        if (lesson.getGrammars() != null) {
            dto.setGrammars(lesson.getGrammars().stream()
                    .map(this::convertGrammarToDto).collect(Collectors.toSet()));
        } else {
            dto.setGrammars(Collections.emptySet());
        }

        if (lesson.getConversations() != null) {
            dto.setConversations(lesson.getConversations().stream()
                    .map(this::convertConversationToDto).collect(Collectors.toSet()));
        } else {
            dto.setConversations(Collections.emptySet());
        }

        return dto;
    }

    private VocabularyDTO convertVocabularyToDto(Vocabulary vocab) {
        VocabularyDTO dto = new VocabularyDTO();
        dto.setId(vocab.getId());
        dto.setWordEnglish(vocab.getWordEnglish());
        dto.setPhoneticSpelling(vocab.getPhoneticSpelling());
        dto.setVietnameseMeaning(vocab.getVietnameseMeaning());
        dto.setImageUrl(vocab.getImageUrl());
        dto.setAudioUrl(vocab.getAudioUrl());
        dto.setExampleSentenceEnglish(vocab.getExampleSentenceEnglish());
        dto.setExampleSentenceVietnamese(vocab.getExampleSentenceVietnamese());
        return dto;
    }

    private GrammarDTO convertGrammarToDto(Grammar grammar) {
        GrammarDTO dto = new GrammarDTO();
        dto.setId(grammar.getId());
        dto.setExplanationEnglish(grammar.getExplanationEnglish());
        dto.setExplanationVietnamese(grammar.getExplanationVietnamese());
        return dto;
    }

    private ConversationDTO convertConversationToDto(Conversation conv) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conv.getId());
        dto.setTitle(conv.getTitle());
        dto.setAudioUrl(conv.getAudioUrl());
        dto.setSentences(conv.getSentences().stream()
                .map(this::convertSentenceToDto).collect(Collectors.toSet()));
        return dto;
    }

    private SentenceDTO convertSentenceToDto(Sentence sentence) {
        SentenceDTO dto = new SentenceDTO();
        dto.setId(sentence.getId());
        dto.setCharacterName(sentence.getCharacterName());
        dto.setTextEnglish(sentence.getTextEnglish());
        dto.setTextVietnamese(sentence.getTextVietnamese());
        return dto;
    }

    @Transactional
    public Lesson createLesson(LessonRequestDTO req) {
        // 1. Lưu bài học chính
        Lesson lesson = new Lesson();
        lesson.setName(req.getName());
        lesson.setLessonNumber(req.getLessonNumber());
        lesson.setLevel(req.getLevel());
        lesson.setAudioUrl(req.getAudioUrl());
        Lesson savedLesson = lessonRepository.save(lesson);

        // 2. Lưu Từ vựng (Giữ nguyên code cũ)
        if (req.getVocabularies() != null) {
            for (VocabularyDTO vDto : req.getVocabularies()) {
                Vocabulary v = new Vocabulary();
                v.setLesson(savedLesson);
                v.setWordEnglish(vDto.getWordEnglish());
                v.setPhoneticSpelling(vDto.getPhoneticSpelling());
                v.setVietnameseMeaning(vDto.getVietnameseMeaning());
                v.setExampleSentenceEnglish(vDto.getExampleSentenceEnglish());
                v.setExampleSentenceVietnamese(vDto.getExampleSentenceVietnamese());
                v.setImageUrl(vDto.getImageUrl());
                v.setAudioUrl(vDto.getAudioUrl());
                vocabularyRepository.save(v);
            }
        }

        // 3. Lưu Ngữ pháp (Giữ nguyên code cũ)
        if (req.getGrammars() != null) {
            for (GrammarDTO gDto : req.getGrammars()) {
                Grammar g = new Grammar();
                g.setLesson(savedLesson);
                g.setExplanationEnglish(gDto.getExplanationEnglish());
                g.setExplanationVietnamese(gDto.getExplanationVietnamese());
                grammarRepository.save(g);
            }
        }

        // 4. [MỚI] Lưu Hội thoại & Câu thoại
        if (req.getConversations() != null) {
            for (LessonRequestDTO.ConversationRequestDTO cDto : req.getConversations()) {
                // Tạo đoạn hội thoại
                Conversation conv = new Conversation();
                conv.setLesson(savedLesson);
                conv.setTitle(cDto.getTitle());
                conv.setAudioUrl(cDto.getAudioUrl());
                Conversation savedConv = conversationRepository.save(conv);

                // Lưu các câu thoại bên trong đoạn hội thoại đó
                if (cDto.getSentences() != null) {
                    for (LessonRequestDTO.SentenceRequestDTO sDto : cDto.getSentences()) {
                        Sentence s = new Sentence();
                        s.setConversation(savedConv); // Gắn vào đoạn hội thoại cha
                        s.setCharacterName(sDto.getCharacterName());
                        s.setTextEnglish(sDto.getTextEnglish());
                        s.setTextVietnamese(sDto.getTextVietnamese());
                        sentenceRepository.save(s);
                    }
                }
            }
        }

        return savedLesson;
    }

    // --- [UPDATE] SỬA BÀI HỌC (FULL LOGIC) ---
    @Transactional
    public Lesson updateLesson(Long id, LessonRequestDTO req) {
        // 1. Tìm bài học cũ
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        // 2. Cập nhật thông tin cơ bản
        lesson.setName(req.getName());
        lesson.setLessonNumber(req.getLessonNumber());
        lesson.setLevel(req.getLevel());
        // Chỉ update audio nếu có file mới (tránh ghi đè null nếu admin không up lại audio)
        if (req.getAudioUrl() != null && !req.getAudioUrl().isEmpty()) {
            lesson.setAudioUrl(req.getAudioUrl());
        }

        // 3. Cập nhật TỪ VỰNG (Vocabularies)
        if (req.getVocabularies() != null) {
            // Xóa hết từ cũ (Nhờ orphanRemoval=true trong Entity, DB sẽ tự xóa record)
            lesson.getVocabularies().clear();

            // Thêm lại từ mới
            for (VocabularyDTO vDto : req.getVocabularies()) {
                Vocabulary v = new Vocabulary();
                v.setLesson(lesson); // Quan trọng: Gắn cha
                v.setWordEnglish(vDto.getWordEnglish());
                v.setPhoneticSpelling(vDto.getPhoneticSpelling());
                v.setVietnameseMeaning(vDto.getVietnameseMeaning());
                v.setExampleSentenceEnglish(vDto.getExampleSentenceEnglish());
                v.setExampleSentenceVietnamese(vDto.getExampleSentenceVietnamese());
                v.setImageUrl(vDto.getImageUrl());
                v.setAudioUrl(vDto.getAudioUrl());

                lesson.getVocabularies().add(v); // Add vào list của Entity
            }
        }

        // 4. Cập nhật NGỮ PHÁP (Grammars)
        if (req.getGrammars() != null) {
            lesson.getGrammars().clear();

            for (GrammarDTO gDto : req.getGrammars()) {
                Grammar g = new Grammar();
                g.setLesson(lesson);
                g.setExplanationEnglish(gDto.getExplanationEnglish());
                g.setExplanationVietnamese(gDto.getExplanationVietnamese());

                lesson.getGrammars().add(g);
            }
        }

        // 5. Cập nhật HỘI THOẠI (Conversations) - Phức tạp hơn vì có Sentences con
        if (req.getConversations() != null) {
            lesson.getConversations().clear();

            for (LessonRequestDTO.ConversationRequestDTO cDto : req.getConversations()) {
                Conversation conv = new Conversation();
                conv.setLesson(lesson);
                conv.setTitle(cDto.getTitle());
                conv.setAudioUrl(cDto.getAudioUrl());

                // Xử lý các câu thoại (Sentences) bên trong hội thoại
                // Lưu ý: Cần đảm bảo Entity Conversation có:
                // @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL, orphanRemoval = true)
                // private Set<Sentence> sentences = new HashSet<>();

                if (cDto.getSentences() != null) {
                    for (LessonRequestDTO.SentenceRequestDTO sDto : cDto.getSentences()) {
                        Sentence s = new Sentence();
                        s.setConversation(conv); // Gắn cha (Conversation)
                        s.setCharacterName(sDto.getCharacterName());
                        s.setTextEnglish(sDto.getTextEnglish());
                        s.setTextVietnamese(sDto.getTextVietnamese());

                        // Add sentence vào conversation
                        // (Bạn cần tạo getter/setter getSentences() trong Entity Conversation)
                        // Nếu getSentences() null thì khởi tạo mới
                        if (conv.getSentences() == null) conv.setSentences(new java.util.HashSet<>());
                        conv.getSentences().add(s);
                    }
                }

                lesson.getConversations().add(conv);
            }
        }

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}