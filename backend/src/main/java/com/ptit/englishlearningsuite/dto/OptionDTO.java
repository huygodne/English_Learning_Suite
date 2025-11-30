package com.ptit.englishlearningsuite.dto;

import lombok.Data;

/**
 * DTO for answer options in practice questions
 * Note: isCorrect is NOT included to prevent cheating
 */
@Data
public class OptionDTO {
    private Long id;
    private String optionText;
}

