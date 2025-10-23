package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.List;

@Data
public class TestSubmissionDTO {
    private Long testId;
    private Long accountId; // THÊM DÒNG NÀY
    private List<AnswerSubmissionDTO> answers;
}