package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserTestProgressDTO {
    private Long id;
    private Long accountId;
    private Long testId;
    private String testName;
    private int score;
    private Integer timeSpentSeconds;
    private LocalDateTime completedAt;
}