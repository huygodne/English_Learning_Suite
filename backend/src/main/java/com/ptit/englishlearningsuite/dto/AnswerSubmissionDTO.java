package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class AnswerSubmissionDTO {
    private Long questionId;
    private Long selectedOptionId; // ID của lựa chọn mà người dùng đã chọn
}