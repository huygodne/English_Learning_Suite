package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;

@Data
public class PracticeQuestionDTO {
    private Long id;
    private String questionText;
    private String questionType;
    private String imageUrl;
    private List<OptionDTO> options; // Shuffled answer options
}

