package com.ptit.englishlearningsuite.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LessonProgressDTO {
    private Long lessonId;
    private int score;
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    private Integer timeSpentSeconds;
    private LocalDateTime completedAt;
}