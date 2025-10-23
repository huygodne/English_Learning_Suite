package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.Set;

@Data
public class TestDetailDTO {
    private Long id;
    private String name;
    private int level;
    private String audioUrl;
    private Set<QuestionDTO> questions;
}