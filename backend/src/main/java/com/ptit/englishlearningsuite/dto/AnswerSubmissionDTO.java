package com.ptit.englishlearningsuite.dto;

import lombok.Data;

/**
 * DTO for submitting practice question answers
 */
@Data
public class AnswerSubmissionDTO {
    private Long questionId;
    private Long selectedOptionId; // For multiple choice and true/false questions
    private String textAnswer; // For fill-in-blank questions
}

