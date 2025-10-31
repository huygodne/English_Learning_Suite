package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class UserLessonProgressDTO {
    private Long id;
    private Long accountId;
    private Long lessonId;
    private String lessonName;
    private boolean isCompleted;
}