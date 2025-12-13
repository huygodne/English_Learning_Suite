package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;

@Data
public class LessonRequestDTO {
    private String name;
    private int lessonNumber;
    private int level;
    private String audioUrl;

    private List<VocabularyDTO> vocabularies;
    private List<GrammarDTO> grammars;

    private List<ConversationRequestDTO> conversations;

    @Data
    public static class ConversationRequestDTO {
        private String title;
        private String audioUrl;
        private List<SentenceRequestDTO> sentences;
    }

    @Data
    public static class SentenceRequestDTO {
        private String characterName;
        private String textEnglish;
        private String textVietnamese;
    }
}