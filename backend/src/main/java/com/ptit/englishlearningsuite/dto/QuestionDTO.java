package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuestionDTO {
    private Long id;
    private String questionText;
    private String questionType;
    private String imageUrl;
    private String explanation;
    private List<AnswerOptionDTO> answerOptions;
}