package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.PronunciationSample;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PronunciationSampleRepository extends JpaRepository<PronunciationSample, Long> {
    List<PronunciationSample> findAllByCategoryIgnoreCase(String category);
    boolean existsByCategoryIgnoreCaseAndTermIgnoreCase(String category, String term);
}


