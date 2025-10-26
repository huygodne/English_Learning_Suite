package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.LessonProgressDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Lesson;
import com.ptit.englishlearningsuite.entity.LessonProgress;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.LessonRepository;
import com.ptit.englishlearningsuite.repository.LessonProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
        // Lấy username của người dùng đang đăng nhập từ token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        // Tìm Account entity dựa trên username
        Account account = accountRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentUsername));

        // Tìm bài học
        Lesson lesson = lessonRepository.findById(progressDto.getLessonId())
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // Tìm tiến trình cũ hoặc tạo mới (dùng Account entity thay vì accountId)
        LessonProgress progress = lessonProgressRepository.findByAccountAndLesson(account, lesson)
                .orElse(new LessonProgress());

        progress.setAccount(account);
        progress.setLesson(lesson);
        progress.setScore(progressDto.getScore());
        progress.setCompleted(progressDto.isCompleted());

        return lessonProgressRepository.save(progress);
    }
}