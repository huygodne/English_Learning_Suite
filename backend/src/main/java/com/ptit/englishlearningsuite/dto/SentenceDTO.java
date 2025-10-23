package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class SentenceDTO {
    private Long id;
    private String characterName;
    private String textEnglish;
    private String textVietnamese;
}