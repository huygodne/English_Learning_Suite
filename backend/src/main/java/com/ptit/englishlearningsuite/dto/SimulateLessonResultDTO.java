package com.ptit.englishlearningsuite.dto;

import lombok.Data;

/**
 * DTO cho API simulate lesson result (testing)
 */
@Data
public class SimulateLessonResultDTO {
    private Long userId;
    private Long lessonId;
    private Boolean isPassed;
}

