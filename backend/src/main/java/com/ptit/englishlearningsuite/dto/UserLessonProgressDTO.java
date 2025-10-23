package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class UserLessonProgressDTO {
    private Long lessonId;
    private String lessonName;
    private int score;
    private boolean completed;
}