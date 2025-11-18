package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.List;

@Data
public class TestDetailDTO {
    private Long id;
    private String name;
    private int level;
    private String audioUrl;
    private List<QuestionDTO> questions;
}