package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Lesson;
import com.ptit.englishlearningsuite.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByAccountAndLesson(Account account, Lesson lesson);
    List<LessonProgress> findAllByAccount(Account account);
}