package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class UserTestProgressDTO {
    private Long id;
    private Long accountId;
    private Long testId;
    private String testName;
    private int score;
}