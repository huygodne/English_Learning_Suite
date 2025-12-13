package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty; // Thêm import này

@Data
public class AnswerOptionDTO {
    private Long id;
    private String optionText;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private boolean isCorrect;
}