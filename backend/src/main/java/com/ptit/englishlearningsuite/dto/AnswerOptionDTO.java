package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty; // Thêm import này

@Data
public class AnswerOptionDTO {
    private Long id;
    private String optionText;

    // Thêm lại trường này với annotation WRITE_ONLY
    // Admin gửi lên thì nhận, nhưng khi trả về cho User thì ẩn đi
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private boolean isCorrect;
}