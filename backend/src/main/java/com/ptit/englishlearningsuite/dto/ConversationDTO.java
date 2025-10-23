package com.ptit.englishlearningsuite.dto;

import lombok.Data;

import java.util.Set;

@Data
public class ConversationDTO {
    private Long id;
    private String title;
    private String audioUrl;
    private Set<SentenceDTO> sentences;
}