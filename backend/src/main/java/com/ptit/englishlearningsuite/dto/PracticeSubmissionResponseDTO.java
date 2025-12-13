package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class PracticeSubmissionResponseDTO {
    private boolean isCorrect;
    private Long correctAnswerId;
    private String correctAnswerText;
    private String explanation;
    private int newElo;
    private int eloChange;
}

