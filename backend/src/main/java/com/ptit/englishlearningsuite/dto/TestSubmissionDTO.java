package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.List;

@Data
public class TestSubmissionDTO {
    private Long testId;
    private List<AnswerSubmissionDTO> answers;
    private Integer timeSpentSeconds;
}