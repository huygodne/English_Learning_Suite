package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserLessonProgressDTO {
    private Long id;
    private Long accountId;
    private Long lessonId;
    private String lessonName;
    private boolean isCompleted;
    private Integer timeSpentSeconds;
    private LocalDateTime completedAt;
}