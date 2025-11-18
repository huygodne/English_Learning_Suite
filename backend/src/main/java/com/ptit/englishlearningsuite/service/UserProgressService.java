package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.UserLessonProgressDTO;
import com.ptit.englishlearningsuite.dto.UserProgressSummaryDTO;
import com.ptit.englishlearningsuite.dto.UserTestProgressDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.LessonProgress;
import com.ptit.englishlearningsuite.entity.TestProgress;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.LessonProgressRepository;
import com.ptit.englishlearningsuite.repository.LessonRepository;
import com.ptit.englishlearningsuite.repository.TestProgressRepository;
import com.ptit.englishlearningsuite.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserProgressService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private TestProgressRepository testProgressRepository;

    @Autowired
    private TestRepository testRepository;

    public List<UserLessonProgressDTO> getLessonProgressByAccountId(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return lessonProgressRepository.findAllByAccount(account).stream()
                .map(progress -> {
                    UserLessonProgressDTO dto = new UserLessonProgressDTO();
                    dto.setId(progress.getId());
                    dto.setAccountId(progress.getAccount().getId());
                    dto.setLessonId(progress.getLesson().getId());
                    dto.setLessonName(progress.getLesson().getName());
                    dto.setCompleted(progress.isCompleted());
                    dto.setTimeSpentSeconds(progress.getTimeSpentSeconds());
                    dto.setCompletedAt(progress.getCompletedAt());
                    return dto;
                }).collect(Collectors.toList());
    }

    public List<UserTestProgressDTO> getTestProgressByAccountId(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return testProgressRepository.findAllByAccount(account).stream()
                .map(progress -> {
                    UserTestProgressDTO dto = new UserTestProgressDTO();
                    dto.setId(progress.getId());
                    dto.setAccountId(progress.getAccount().getId());
                    dto.setTestId(progress.getTest().getId());
                    dto.setTestName(progress.getTest().getName());
                    dto.setScore(progress.getScore());
                    dto.setTimeSpentSeconds(progress.getTimeSpentSeconds());
                    dto.setCompletedAt(progress.getCompletedAt());
                    return dto;
                }).collect(Collectors.toList());
    }

    public UserProgressSummaryDTO getProgressSummary(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        List<LessonProgress> lessonProgresses = lessonProgressRepository.findAllByAccount(account);
        List<TestProgress> testProgresses = testProgressRepository.findAllByAccount(account);

        int completedLessons = (int) lessonProgresses.stream()
                .filter(LessonProgress::isCompleted)
                .count();

        long lessonTimeSpent = lessonProgresses.stream()
                .map(LessonProgress::getTimeSpentSeconds)
                .filter(Objects::nonNull)
                .mapToLong(Integer::longValue)
                .sum();

        long testTimeSpent = testProgresses.stream()
                .map(TestProgress::getTimeSpentSeconds)
                .filter(Objects::nonNull)
                .mapToLong(Integer::longValue)
                .sum();

        double averageScore = testProgresses.stream()
                .mapToInt(TestProgress::getScore)
                .average()
                .orElse(0);

        LocalDateStreak streak = computeStreak(lessonProgresses);

        UserProgressSummaryDTO summaryDTO = new UserProgressSummaryDTO();
        summaryDTO.setAccountId(accountId);
        summaryDTO.setTotalLessons(lessonRepository.count());
        summaryDTO.setCompletedLessons(completedLessons);
        summaryDTO.setTotalTests(testRepository.count());
        summaryDTO.setCompletedTests(testProgressRepository.countByAccount(account));
        summaryDTO.setAverageTestScore(averageScore);
        summaryDTO.setLessonTimeSpentSeconds(lessonTimeSpent);
        summaryDTO.setTestTimeSpentSeconds(testTimeSpent);
        summaryDTO.setCurrentStreak(streak.current);
        summaryDTO.setLongestStreak(streak.longest);
        summaryDTO.setLastLessonCompletedAt(lessonProgresses.stream()
                .map(LessonProgress::getCompletedAt)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null));
        summaryDTO.setLastTestCompletedAt(testProgresses.stream()
                .map(TestProgress::getCompletedAt)
                .filter(Objects::nonNull)
                .max(Comparator.naturalOrder())
                .orElse(null));
        return summaryDTO;
    }

    private LocalDateStreak computeStreak(List<LessonProgress> progresses) {
        Set<LocalDate> completionDates = progresses.stream()
                .filter(LessonProgress::isCompleted)
                .map(LessonProgress::getCompletedAt)
                .filter(Objects::nonNull)
                .map(LocalDate::from)
                .collect(Collectors.toSet());

        int longest = 0;
        int currentRun = 0;
        LocalDate previousDate = null;

        List<LocalDate> sortedDates = completionDates.stream()
                .sorted()
                .collect(Collectors.toList());

        for (LocalDate date : sortedDates) {
            if (previousDate == null || previousDate.plusDays(1).equals(date)) {
                currentRun++;
            } else {
                currentRun = 1;
            }
            longest = Math.max(longest, currentRun);
            previousDate = date;
        }

        int currentStreak = 0;
        if (!completionDates.isEmpty()) {
            LocalDate today = LocalDate.now();
            LocalDate pointer;
            if (completionDates.contains(today)) {
                pointer = today;
            } else if (completionDates.contains(today.minusDays(1))) {
                pointer = today.minusDays(1);
            } else {
                return new LocalDateStreak(0, longest);
            }
            while (completionDates.contains(pointer)) {
                currentStreak++;
                pointer = pointer.minusDays(1);
            }
        }

        return new LocalDateStreak(currentStreak, longest);
    }

    private record LocalDateStreak(int current, int longest) {}
}