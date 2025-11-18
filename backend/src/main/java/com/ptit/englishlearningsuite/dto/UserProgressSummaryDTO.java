package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserProgressSummaryDTO {
    private Long accountId;
    private long totalLessons;
    private int completedLessons;
    private long totalTests;
    private int completedTests;
    private double averageTestScore;
    private int currentStreak;
    private int longestStreak;
    private long lessonTimeSpentSeconds;
    private long testTimeSpentSeconds;
    private LocalDateTime lastLessonCompletedAt;
    private LocalDateTime lastTestCompletedAt;
}





