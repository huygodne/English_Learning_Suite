package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class UserTestProgressDTO {
    private Long testId;
    private String testName;
    private int score;
}