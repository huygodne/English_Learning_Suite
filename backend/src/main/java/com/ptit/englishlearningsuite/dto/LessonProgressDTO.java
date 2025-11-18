package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LessonProgressDTO {
    private Long lessonId;
    private int score; // Điểm đạt được ở phần quiz từ vựng
    private boolean isCompleted;
    private Integer timeSpentSeconds;
    private LocalDateTime completedAt;
}