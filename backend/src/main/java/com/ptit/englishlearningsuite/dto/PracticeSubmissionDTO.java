package com.ptit.englishlearningsuite.dto;

import lombok.Data;

/**
 * DTO for submitting practice question answers during interactive lessons
 */
@Data
public class PracticeSubmissionDTO {
    private Long questionId;
    private Long selectedOptionId; // For multiple choice questions
    private String textAnswer; // For text-based questions (optional)
}

