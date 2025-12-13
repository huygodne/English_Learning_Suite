package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class RecommendedLessonDTO {
    private Long id;
    private int lessonNumber;
    private int level;
    private String name;
    
    private Integer difficultyRating;
    private Double grammarWeight;
    private Double vocabWeight;
    private Double listeningWeight;
    private Double similarity;
}

