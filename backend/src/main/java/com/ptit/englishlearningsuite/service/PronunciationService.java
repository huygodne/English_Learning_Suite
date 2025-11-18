package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.PronunciationSampleDTO;
import com.ptit.englishlearningsuite.entity.PronunciationSample;
import com.ptit.englishlearningsuite.repository.PronunciationSampleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PronunciationService {

    @Autowired
    private PronunciationSampleRepository pronunciationSampleRepository;

    public List<PronunciationSampleDTO> findByCategory(String category) {
        List<PronunciationSample> samples = category == null || category.isBlank()
                ? pronunciationSampleRepository.findAll()
                : pronunciationSampleRepository.findAllByCategoryIgnoreCase(category);

        return samples.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private PronunciationSampleDTO toDto(PronunciationSample sample) {
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




