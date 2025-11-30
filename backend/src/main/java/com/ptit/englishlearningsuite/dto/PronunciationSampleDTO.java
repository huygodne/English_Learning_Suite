package com.ptit.englishlearningsuite.dto;

import com.ptit.englishlearningsuite.entity.PronunciationSample;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PronunciationSampleDTO {
    private Long id;
    private String category;
    private String term;
    private String ipa;
    private String description;
    private String imageUrl;
    private String audioUrl;

    public static PronunciationSampleDTO fromEntity(PronunciationSample sample) {
        PronunciationSampleDTO dto = new PronunciationSampleDTO();
        dto.setId(sample.getId());
        dto.setCategory(sample.getCategory());
        dto.setTerm(sample.getTerm());
        dto.setIpa(sample.getIpa());
        dto.setDescription(sample.getDescription());
        dto.setImageUrl(sample.getImageUrl());
        dto.setAudioUrl(sample.getAudioUrl());
        return dto;
    }
}

