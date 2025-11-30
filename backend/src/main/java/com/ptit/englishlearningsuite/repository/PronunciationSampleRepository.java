package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.PronunciationSample;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PronunciationSampleRepository extends JpaRepository<PronunciationSample, Long> {
    List<PronunciationSample> findAllByCategoryIgnoreCase(String category);
}

