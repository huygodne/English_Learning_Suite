package com.ptit.englishlearningsuite.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TranslationResponseDTO {
    private String translatedText;
    private String provider;
    private long latencyMs;
}












