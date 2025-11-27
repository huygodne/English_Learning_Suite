package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;

@Data
public class TestRequestDTO {
    private String name;
    private int level;
    private String audioUrl;

    // Danh sách câu hỏi đính kèm
    private List<QuestionRequestDTO> questions;

    // Class con nội bộ để hứng dữ liệu câu hỏi + đáp án
    @Data
    public static class QuestionRequestDTO {
        private String questionText;
        private String questionType; // MULTIPLE_CHOICE, FILL_IN_BLANK...
        private String imageUrl;
        private List<AnswerOptionDTO> answerOptions;
    }
}