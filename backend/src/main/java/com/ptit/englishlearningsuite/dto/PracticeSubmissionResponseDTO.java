package com.ptit.englishlearningsuite.dto;

import lombok.Data;

/**
 * DTO for practice submission response
 * Returns feedback and updated Elo rating
 */
@Data
public class PracticeSubmissionResponseDTO {
    private boolean isCorrect;
    private Long correctAnswerId; // ID of the correct answer option
    private String correctAnswerText; // Text of the correct answer
    private String explanation; // Explanation for the answer
    private int newElo; // Updated Elo rating after processing
    private int eloChange; // Change in Elo (positive or negative)
}

