package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class LessonProgressDTO {
    private Long lessonId;
    private Long accountId;
    private int score; // Điểm đạt được ở phần quiz từ vựng
    private boolean isCompleted;
}