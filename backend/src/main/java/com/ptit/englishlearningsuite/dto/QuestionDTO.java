package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.Set;

@Data
public class QuestionDTO {
    private Long id;
    private String questionText;
    private String questionType;
    private String imageUrl;
    private Set<AnswerOptionDTO> answerOptions;
}