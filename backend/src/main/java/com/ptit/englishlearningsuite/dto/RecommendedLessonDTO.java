package com.ptit.englishlearningsuite.dto;

import lombok.Data;

/**
 * DTO cho Recommended Lesson với đầy đủ thông tin cho Hybrid Recommendation System
 */
@Data
public class RecommendedLessonDTO {
    private Long id;
    private int lessonNumber;
    private int level;
    private String name;
    
    // Recommendation System Fields
    private Integer difficultyRating;
    private Double grammarWeight;
    private Double vocabWeight;
    private Double listeningWeight;
    private Double similarity; // Cosine similarity score (0.0 - 1.0)
}

