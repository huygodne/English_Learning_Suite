package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.VocabularyProgressDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Vocabulary;
import com.ptit.englishlearningsuite.entity.VocabularyProgress;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.VocabularyProgressRepository;
import com.ptit.englishlearningsuite.repository.VocabularyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VocabularyProgressService {

    @Autowired
    private VocabularyProgressRepository vocabularyProgressRepository;

    @Autowired
    private VocabularyRepository vocabularyRepository;

    @Autowired
    private AccountRepository accountRepository;

    public VocabularyProgressDTO toggleRemembered(Long vocabularyId, boolean remembered) {
        VocabularyProgress progress = upsertProgress(vocabularyId);
        progress.setRemembered(remembered);
        progress.setLastReviewedAt(LocalDateTime.now());
        if (remembered) {
            progress.setMasteryLevel(Math.min(progress.getMasteryLevel() + 1, 5));
        }
        progress.setReviewCount(progress.getReviewCount() + 1);
        vocabularyProgressRepository.save(progress);
        return toDto(progress);
    }

    public List<VocabularyProgressDTO> getProgressForLesson(Long lessonId) {
        Account account = getCurrentAccount();
        return vocabularyProgressRepository.findAllByAccountAndVocabularyLessonId(account, lessonId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private VocabularyProgress upsertProgress(Long vocabularyId) {
        Account account = getCurrentAccount();
        Vocabulary vocabulary = vocabularyRepository.findById(vocabularyId)
                .orElseThrow(() -> new IllegalArgumentException("Vocabulary not found"));

        return vocabularyProgressRepository.findByAccountAndVocabulary(account, vocabulary)
                .orElseGet(() -> {
                    VocabularyProgress progress = new VocabularyProgress();
                    progress.setAccount(account);
                    progress.setVocabulary(vocabulary);
                    progress.setMasteryLevel(0);
                    progress.setReviewCount(0);
                    return progress;
                });
    }

    private VocabularyProgressDTO toDto(VocabularyProgress progress) {
        VocabularyProgressDTO dto = new VocabularyProgressDTO();
        dto.setVocabularyId(progress.getVocabulary().getId());
        dto.setRemembered(progress.isRemembered());
        dto.setMasteryLevel(progress.getMasteryLevel());
        dto.setReviewCount(progress.getReviewCount());
        dto.setLastReviewedAt(progress.getLastReviewedAt());
        return dto;
    }

    private Account getCurrentAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        return accountRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));
    }
}












