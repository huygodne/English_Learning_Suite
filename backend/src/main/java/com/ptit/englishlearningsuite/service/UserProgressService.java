package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.UserLessonProgressDTO;
import com.ptit.englishlearningsuite.dto.UserTestProgressDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.LessonProgressRepository;
import com.ptit.englishlearningsuite.repository.TestProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserProgressService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private TestProgressRepository testProgressRepository;

    public List<UserLessonProgressDTO> getLessonProgressByAccountId(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return lessonProgressRepository.findAllByAccount(account).stream()
                .map(progress -> {
                    UserLessonProgressDTO dto = new UserLessonProgressDTO();
                    dto.setLessonId(progress.getLesson().getId());
                    dto.setLessonName(progress.getLesson().getName());
                    dto.setScore(progress.getScore());
                    dto.setCompleted(progress.isCompleted());
                    return dto;
                }).collect(Collectors.toList());
    }

    public List<UserTestProgressDTO> getTestProgressByAccountId(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return testProgressRepository.findAllByAccount(account).stream()
                .map(progress -> {
                    UserTestProgressDTO dto = new UserTestProgressDTO();
                    dto.setTestId(progress.getTest().getId());
                    dto.setTestName(progress.getTest().getName());
                    dto.setScore(progress.getScore());
                    return dto;
                }).collect(Collectors.toList());
    }
}