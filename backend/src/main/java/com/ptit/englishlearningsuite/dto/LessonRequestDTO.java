package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;

@Data
public class LessonRequestDTO {
    private String name;
    private int lessonNumber;
    private int level;
    private String audioUrl; // Audio giới thiệu bài học (nếu có)

    private List<VocabularyDTO> vocabularies;
    private List<GrammarDTO> grammars;

    // [MỚI] Thêm danh sách hội thoại
    private List<ConversationRequestDTO> conversations;

    // --- Class con để hứng dữ liệu Hội thoại ---
    @Data
    public static class ConversationRequestDTO {
        private String title;
        private String audioUrl; // Audio của cả đoạn hội thoại
        private List<SentenceRequestDTO> sentences;
    }

    // --- Class con để hứng dữ liệu từng câu thoại ---
    @Data
    public static class SentenceRequestDTO {
        private String characterName;   // Ví dụ: "Tom", "Mary"
        private String textEnglish;
        private String textVietnamese;
    }
}