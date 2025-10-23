package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class LessonSummaryDTO {
    private Long id;
    private int lessonNumber;
    private int level;
    private String name;
}