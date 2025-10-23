package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.Set;

@Data
public class LessonDetailDTO {
    private Long id;
    private int lessonNumber;
    private int level;
    private String name;
    private String audioUrl;
    // Đảm bảo các dòng này dùng đúng tên DTO
    private Set<VocabularyDTO> vocabularies;
    private Set<GrammarDTO> grammars;
    private Set<ConversationDTO> conversations;
}