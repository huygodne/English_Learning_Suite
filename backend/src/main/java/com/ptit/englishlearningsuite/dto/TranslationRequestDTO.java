package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class TranslationRequestDTO {
    private String text;
    private String sourceLang;
    private String targetLang;
}






