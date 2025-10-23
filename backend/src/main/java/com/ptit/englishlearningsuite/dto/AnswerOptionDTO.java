package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class AnswerOptionDTO {
    private Long id;
    private String optionText;
    // Chúng ta không trả về "isCorrect" để người dùng không thể gian lận
}