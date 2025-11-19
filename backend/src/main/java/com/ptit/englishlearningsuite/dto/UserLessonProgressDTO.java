package com.ptit.englishlearningsuite.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserLessonProgressDTO {
    private Long id;
    private Long accountId;
    private Long lessonId;
    private String lessonName;
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    private Integer timeSpentSeconds;
    private LocalDateTime completedAt;
}