package com.ptit.englishlearningsuite.dto;

import lombok.Data;

/**
 * DTO for answer submission response
 */
@Data
public class AnswerSubmissionResponseDTO {
    private boolean correct;
    private int newElo;
    private int eloChange; // Change in Elo rating (can be positive or negative)
    private String explanation;
    private String correctAnswer; // Correct answer text for display
}

