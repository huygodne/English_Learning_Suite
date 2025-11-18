package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Vocabulary;
import com.ptit.englishlearningsuite.entity.VocabularyProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VocabularyProgressRepository extends JpaRepository<VocabularyProgress, Long> {
    Optional<VocabularyProgress> findByAccountAndVocabulary(Account account, Vocabulary vocabulary);

    List<VocabularyProgress> findAllByAccountAndVocabularyLessonId(Account account, Long lessonId);
}




