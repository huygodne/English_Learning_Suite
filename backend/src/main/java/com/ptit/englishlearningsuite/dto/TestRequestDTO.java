package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;

@Data
public class TestRequestDTO {
    private String name;
    private int level;
    private String audioUrl;

    private List<QuestionRequestDTO> questions;

    @Data
    public static class QuestionRequestDTO {
        private String questionText;
        private String questionType;
        private String imageUrl;
        private List<AnswerOptionDTO> answerOptions;
    }
}