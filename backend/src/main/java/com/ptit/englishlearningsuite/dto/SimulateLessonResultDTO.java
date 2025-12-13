package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class SimulateLessonResultDTO {
    private Long userId;
    private Long lessonId;
    private Boolean isPassed;
}

