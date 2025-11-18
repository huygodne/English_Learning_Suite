package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class VocabularyDTO {
    private Long id;
    private String wordEnglish;
    private String phoneticSpelling;
    private String vietnameseMeaning;
    private String imageUrl;
    private String audioUrl;
    private String exampleSentenceEnglish;
    private String exampleSentenceVietnamese;
}