package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VocabularyProgressDTO {
    private Long vocabularyId;
    private boolean remembered;
    private int masteryLevel;
    private Integer reviewCount;
    private LocalDateTime lastReviewedAt;
}












