package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.LessonProgressDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Lesson;
import com.ptit.englishlearningsuite.entity.LessonProgress;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.LessonRepository;
import com.ptit.englishlearningsuite.repository.LessonProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LessonProgressService {

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public LessonProgress completeLesson(LessonProgressDTO progressDto) {
        // Tìm người dùng và bài học tương ứng
        Account account = accountRepository.findById(progressDto.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Lesson lesson = lessonRepository.findById(progressDto.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Tìm tiến trình cũ, nếu không có thì tạo mới
        LessonProgress progress = lessonProgressRepository.findByAccountAndLesson(account, lesson)
                .orElse(new LessonProgress());

        progress.setAccount(account);
        progress.setLesson(lesson);
        progress.setScore(progressDto.getScore());
        progress.setCompleted(progressDto.isCompleted());

        // Lưu vào CSDL
        return lessonProgressRepository.save(progress);
    }
}