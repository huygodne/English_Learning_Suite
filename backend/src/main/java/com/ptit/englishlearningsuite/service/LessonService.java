package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.*;
import com.ptit.englishlearningsuite.entity.*;
import com.ptit.englishlearningsuite.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

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
}