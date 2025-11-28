package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.DetailedStatisticsDTO;
import com.ptit.englishlearningsuite.dto.StatisticsDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Lesson;
import com.ptit.englishlearningsuite.entity.LessonProgress;
import com.ptit.englishlearningsuite.entity.Test;
import com.ptit.englishlearningsuite.entity.TestProgress;
import com.ptit.englishlearningsuite.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private MediaAssetRepository mediaAssetRepository;

    @Autowired
    private LessonProgressRepository lessonProgressRepository;

    @Autowired
    private TestProgressRepository testProgressRepository;

    public StatisticsDTO getStatistics() {
        StatisticsDTO stats = new StatisticsDTO();

        // Tổng quan
        long totalUsers = accountRepository.count();
        stats.setTotalUsers(totalUsers);
        stats.setTotalLessons(lessonRepository.count());
        stats.setTotalTests(testRepository.count());
        stats.setTotalMediaAssets(mediaAssetRepository.count());

        // Lấy tất cả progress
        List<LessonProgress> allLessonProgress = lessonProgressRepository.findAll();
        List<TestProgress> allTestProgress = testProgressRepository.findAll();

        // Tính active users (người dùng đã hoàn thành ít nhất 1 bài học hoặc test)
        Set<Long> activeUserIds = new HashSet<>();
        allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .forEach(lp -> activeUserIds.add(lp.getAccount().getId()));
        allTestProgress.forEach(tp -> activeUserIds.add(tp.getAccount().getId()));
        stats.setActiveUsers(activeUserIds.size());

        // Thống kê bài học
        List<LessonProgress> completedLessons = allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .collect(Collectors.toList());
        
        stats.setTotalLessonCompletions(completedLessons.size());
        
        if (!completedLessons.isEmpty()) {
            double avgScore = completedLessons.stream()
                    .mapToInt(LessonProgress::getScore)
                    .average()
                    .orElse(0.0);
            stats.setAverageLessonScore(Math.round(avgScore * 100.0) / 100.0);
            
            long totalTime = completedLessons.stream()
                    .filter(lp -> lp.getTimeSpentSeconds() != null)
                    .mapToLong(LessonProgress::getTimeSpentSeconds)
                    .sum();
            stats.setTotalLessonTimeSpent(totalTime);
            
            // Thống kê theo cấp độ
            Map<Integer, Long> completionsByLevel = completedLessons.stream()
                    .collect(Collectors.groupingBy(
                            lp -> lp.getLesson().getLevel(),
                            Collectors.counting()
                    ));
            stats.setLessonCompletionsByLevel(completionsByLevel);
        } else {
            stats.setAverageLessonScore(0.0);
            stats.setTotalLessonTimeSpent(0);
            stats.setLessonCompletionsByLevel(new HashMap<>());
        }

        // Thống kê bài kiểm tra
        stats.setTotalTestCompletions(allTestProgress.size());
        
        if (!allTestProgress.isEmpty()) {
            double avgScore = allTestProgress.stream()
                    .mapToInt(TestProgress::getScore)
                    .average()
                    .orElse(0.0);
            stats.setAverageTestScore(Math.round(avgScore * 100.0) / 100.0);
            
            long totalTime = allTestProgress.stream()
                    .filter(tp -> tp.getTimeSpentSeconds() != null)
                    .mapToLong(TestProgress::getTimeSpentSeconds)
                    .sum();
            stats.setTotalTestTimeSpent(totalTime);
            
            // Thống kê theo cấp độ
            Map<Integer, Long> completionsByLevel = allTestProgress.stream()
                    .collect(Collectors.groupingBy(
                            tp -> tp.getTest().getLevel(),
                            Collectors.counting()
                    ));
            stats.setTestCompletionsByLevel(completionsByLevel);
        } else {
            stats.setAverageTestScore(0.0);
            stats.setTotalTestTimeSpent(0);
            stats.setTestCompletionsByLevel(new HashMap<>());
        }

        // Top bài học phổ biến
        Map<Lesson, List<LessonProgress>> lessonProgressMap = completedLessons.stream()
                .collect(Collectors.groupingBy(LessonProgress::getLesson));
        
        List<StatisticsDTO.LessonStatisticsDTO> topLessons = lessonProgressMap.entrySet().stream()
                .map(entry -> {
                    Lesson lesson = entry.getKey();
                    List<LessonProgress> progresses = entry.getValue();
                    StatisticsDTO.LessonStatisticsDTO dto = new StatisticsDTO.LessonStatisticsDTO();
                    dto.setLessonId(lesson.getId());
                    dto.setLessonName(lesson.getName());
                    dto.setLessonNumber(lesson.getLessonNumber());
                    dto.setLevel(lesson.getLevel());
                    dto.setCompletionCount(progresses.size());
                    double avgScore = progresses.stream()
                            .mapToInt(LessonProgress::getScore)
                            .average()
                            .orElse(0.0);
                    dto.setAverageScore(Math.round(avgScore * 100.0) / 100.0);
                    return dto;
                })
                .sorted((a, b) -> Long.compare(b.getCompletionCount(), a.getCompletionCount()))
                .limit(10)
                .collect(Collectors.toList());
        stats.setTopLessons(topLessons);

        // Top bài kiểm tra phổ biến
        Map<Test, List<TestProgress>> testProgressMap = allTestProgress.stream()
                .collect(Collectors.groupingBy(TestProgress::getTest));
        
        List<StatisticsDTO.TestStatisticsDTO> topTests = testProgressMap.entrySet().stream()
                .map(entry -> {
                    Test test = entry.getKey();
                    List<TestProgress> progresses = entry.getValue();
                    StatisticsDTO.TestStatisticsDTO dto = new StatisticsDTO.TestStatisticsDTO();
                    dto.setTestId(test.getId());
                    dto.setTestName(test.getName());
                    dto.setLevel(test.getLevel());
                    dto.setCompletionCount(progresses.size());
                    double avgScore = progresses.stream()
                            .mapToInt(TestProgress::getScore)
                            .average()
                            .orElse(0.0);
                    dto.setAverageScore(Math.round(avgScore * 100.0) / 100.0);
                    return dto;
                })
                .sorted((a, b) -> Long.compare(b.getCompletionCount(), a.getCompletionCount()))
                .limit(10)
                .collect(Collectors.toList());
        stats.setTopTests(topTests);

        // Top người dùng
        Map<Account, List<LessonProgress>> userLessonMap = completedLessons.stream()
                .collect(Collectors.groupingBy(LessonProgress::getAccount));
        
        Map<Account, List<TestProgress>> userTestMap = allTestProgress.stream()
                .collect(Collectors.groupingBy(TestProgress::getAccount));
        
        Set<Account> allActiveAccounts = new HashSet<>();
        allActiveAccounts.addAll(userLessonMap.keySet());
        allActiveAccounts.addAll(userTestMap.keySet());
        
        List<StatisticsDTO.UserStatisticsDTO> topUsers = allActiveAccounts.stream()
                .map(account -> {
                    StatisticsDTO.UserStatisticsDTO dto = new StatisticsDTO.UserStatisticsDTO();
                    dto.setUserId(account.getId());
                    dto.setUsername(account.getUsername());
                    dto.setFullName(account.getFullName());
                    
                    long completedLessonsCount = userLessonMap.getOrDefault(account, Collections.emptyList()).size();
                    dto.setCompletedLessons(completedLessonsCount);
                    
                    List<TestProgress> userTests = userTestMap.getOrDefault(account, Collections.emptyList());
                    dto.setCompletedTests(userTests.size());
                    
                    if (!userTests.isEmpty()) {
                        double avgScore = userTests.stream()
                                .mapToInt(TestProgress::getScore)
                                .average()
                                .orElse(0.0);
                        dto.setAverageTestScore(Math.round(avgScore * 100.0) / 100.0);
                    } else {
                        dto.setAverageTestScore(0.0);
                    }
                    
                    return dto;
                })
                .sorted((a, b) -> {
                    // Sắp xếp theo tổng số bài học + test đã hoàn thành
                    long totalA = a.getCompletedLessons() + a.getCompletedTests();
                    long totalB = b.getCompletedLessons() + b.getCompletedTests();
                    return Long.compare(totalB, totalA);
                })
                .limit(10)
                .collect(Collectors.toList());
        stats.setTopUsers(topUsers);

        return stats;
    }

    public DetailedStatisticsDTO getDetailedStatistics() {
        DetailedStatisticsDTO detailed = new DetailedStatisticsDTO();
        
        // Lấy dữ liệu 30 ngày gần nhất
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(30);
        
        // 1. User growth over time (30 ngày)
        List<DetailedStatisticsDTO.TimeSeriesData> userGrowth = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            LocalDateTime dayStart = date.atStartOfDay();
            LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();
            
            long newUsers = accountRepository.countByCreatedAtBetween(dayStart, dayEnd);
            DetailedStatisticsDTO.TimeSeriesData data = new DetailedStatisticsDTO.TimeSeriesData();
            data.setDate(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
            data.setValue(newUsers);
            data.setLabel(date.format(DateTimeFormatter.ofPattern("dd/MM")));
            userGrowth.add(data);
        }
        detailed.setUserGrowth(userGrowth);
        
        // 2. Lesson completions over time
        List<DetailedStatisticsDTO.TimeSeriesData> lessonCompletions = new ArrayList<>();
        List<LessonProgress> allLessonProgress = lessonProgressRepository.findAll();
        Map<String, Long> lessonCompletionsByDate = allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .filter(lp -> lp.getCompletedAt() != null)
                .filter(lp -> lp.getCompletedAt().isAfter(startDate))
                .collect(Collectors.groupingBy(
                        lp -> lp.getCompletedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE),
                        Collectors.counting()
                ));
        
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            DetailedStatisticsDTO.TimeSeriesData data = new DetailedStatisticsDTO.TimeSeriesData();
            data.setDate(dateStr);
            data.setValue(lessonCompletionsByDate.getOrDefault(dateStr, 0L));
            data.setLabel(date.format(DateTimeFormatter.ofPattern("dd/MM")));
            lessonCompletions.add(data);
        }
        detailed.setLessonCompletionsOverTime(lessonCompletions);
        
        // 3. Test completions over time
        List<DetailedStatisticsDTO.TimeSeriesData> testCompletions = new ArrayList<>();
        List<TestProgress> allTestProgress = testProgressRepository.findAll();
        Map<String, Long> testCompletionsByDate = allTestProgress.stream()
                .filter(tp -> tp.getCompletedAt() != null)
                .filter(tp -> tp.getCompletedAt().isAfter(startDate))
                .collect(Collectors.groupingBy(
                        tp -> tp.getCompletedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE),
                        Collectors.counting()
                ));
        
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            DetailedStatisticsDTO.TimeSeriesData data = new DetailedStatisticsDTO.TimeSeriesData();
            data.setDate(dateStr);
            data.setValue(testCompletionsByDate.getOrDefault(dateStr, 0L));
            data.setLabel(date.format(DateTimeFormatter.ofPattern("dd/MM")));
            testCompletions.add(data);
        }
        detailed.setTestCompletionsOverTime(testCompletions);
        
        // 4. Daily active users (users who completed lesson or test on that day)
        List<DetailedStatisticsDTO.TimeSeriesData> dailyActiveUsers = new ArrayList<>();
        Map<String, Set<Long>> activeUsersByDate = new HashMap<>();
        
        allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .filter(lp -> lp.getCompletedAt() != null && lp.getCompletedAt().isAfter(startDate))
                .forEach(lp -> {
                    String dateStr = lp.getCompletedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                    activeUsersByDate.computeIfAbsent(dateStr, k -> new HashSet<>())
                            .add(lp.getAccount().getId());
                });
        
        allTestProgress.stream()
                .filter(tp -> tp.getCompletedAt() != null && tp.getCompletedAt().isAfter(startDate))
                .forEach(tp -> {
                    String dateStr = tp.getCompletedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                    activeUsersByDate.computeIfAbsent(dateStr, k -> new HashSet<>())
                            .add(tp.getAccount().getId());
                });
        
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            DetailedStatisticsDTO.TimeSeriesData data = new DetailedStatisticsDTO.TimeSeriesData();
            data.setDate(dateStr);
            data.setValue((long) activeUsersByDate.getOrDefault(dateStr, new HashSet<>()).size());
            data.setLabel(date.format(DateTimeFormatter.ofPattern("dd/MM")));
            dailyActiveUsers.add(data);
        }
        detailed.setDailyActiveUsers(dailyActiveUsers);
        
        // 5. Average study time per day (in hours)
        List<DetailedStatisticsDTO.TimeSeriesData> avgStudyTime = new ArrayList<>();
        Map<String, List<Long>> studyTimeByDate = new HashMap<>();
        
        allLessonProgress.stream()
                .filter(lp -> lp.getTimeSpentSeconds() != null && lp.getTimeSpentSeconds() > 0)
                .filter(lp -> lp.getCompletedAt() != null && lp.getCompletedAt().isAfter(startDate))
                .forEach(lp -> {
                    String dateStr = lp.getCompletedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                    studyTimeByDate.computeIfAbsent(dateStr, k -> new ArrayList<>())
                            .add(lp.getTimeSpentSeconds().longValue());
                });
        
        allTestProgress.stream()
                .filter(tp -> tp.getTimeSpentSeconds() != null && tp.getTimeSpentSeconds() > 0)
                .filter(tp -> tp.getCompletedAt() != null && tp.getCompletedAt().isAfter(startDate))
                .forEach(tp -> {
                    String dateStr = tp.getCompletedAt().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
                    studyTimeByDate.computeIfAbsent(dateStr, k -> new ArrayList<>())
                            .add(tp.getTimeSpentSeconds().longValue());
                });
        
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
            List<Long> times = studyTimeByDate.getOrDefault(dateStr, new ArrayList<>());
            double avgSeconds = times.isEmpty() ? 0 : times.stream().mapToLong(Long::longValue).average().orElse(0);
            double avgHours = avgSeconds / 3600.0;
            
            DetailedStatisticsDTO.TimeSeriesData data = new DetailedStatisticsDTO.TimeSeriesData();
            data.setDate(dateStr);
            data.setValue(Math.round(avgHours * 100)); // Store hours * 100 (e.g., 1.5 hours = 150)
            data.setLabel(date.format(DateTimeFormatter.ofPattern("dd/MM")));
            avgStudyTime.add(data);
        }
        detailed.setAverageStudyTimePerDay(avgStudyTime);
        
        // 6. Lesson completions by level
        Map<Integer, Long> lessonCompletionsByLevel = allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .collect(Collectors.groupingBy(
                        lp -> lp.getLesson().getLevel(),
                        Collectors.counting()
                ));
        detailed.setLessonCompletionsByLevel(lessonCompletionsByLevel);
        
        // 7. Test completions by level
        Map<Integer, Long> testCompletionsByLevel = allTestProgress.stream()
                .collect(Collectors.groupingBy(
                        tp -> tp.getTest().getLevel(),
                        Collectors.counting()
                ));
        detailed.setTestCompletionsByLevel(testCompletionsByLevel);
        
        // 8. Popular lessons
        Map<Lesson, List<LessonProgress>> lessonProgressMap = allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .collect(Collectors.groupingBy(LessonProgress::getLesson));
        
        List<DetailedStatisticsDTO.PopularItemDTO> popularLessons = lessonProgressMap.entrySet().stream()
                .map(entry -> {
                    Lesson lesson = entry.getKey();
                    List<LessonProgress> progresses = entry.getValue();
                    DetailedStatisticsDTO.PopularItemDTO dto = new DetailedStatisticsDTO.PopularItemDTO();
                    dto.setId(lesson.getId());
                    dto.setName(lesson.getName());
                    dto.setLevel(lesson.getLevel());
                    dto.setCompletionCount(progresses.size());
                    double avgScore = progresses.stream()
                            .mapToInt(LessonProgress::getScore)
                            .average()
                            .orElse(0.0);
                    dto.setAverageScore(Math.round(avgScore * 100.0) / 100.0);
                    long totalTime = progresses.stream()
                            .filter(lp -> lp.getTimeSpentSeconds() != null)
                            .mapToLong(lp -> lp.getTimeSpentSeconds())
                            .sum();
                    dto.setTotalTimeSpent(totalTime);
                    return dto;
                })
                .sorted((a, b) -> Long.compare(b.getCompletionCount(), a.getCompletionCount()))
                .limit(10)
                .collect(Collectors.toList());
        detailed.setPopularLessons(popularLessons);
        
        // 9. Popular tests
        Map<Test, List<TestProgress>> testProgressMap = allTestProgress.stream()
                .collect(Collectors.groupingBy(TestProgress::getTest));
        
        List<DetailedStatisticsDTO.PopularItemDTO> popularTests = testProgressMap.entrySet().stream()
                .map(entry -> {
                    Test test = entry.getKey();
                    List<TestProgress> progresses = entry.getValue();
                    DetailedStatisticsDTO.PopularItemDTO dto = new DetailedStatisticsDTO.PopularItemDTO();
                    dto.setId(test.getId());
                    dto.setName(test.getName());
                    dto.setLevel(test.getLevel());
                    dto.setCompletionCount(progresses.size());
                    double avgScore = progresses.stream()
                            .mapToInt(TestProgress::getScore)
                            .average()
                            .orElse(0.0);
                    dto.setAverageScore(Math.round(avgScore * 100.0) / 100.0);
                    long totalTime = progresses.stream()
                            .filter(tp -> tp.getTimeSpentSeconds() != null)
                            .mapToLong(tp -> tp.getTimeSpentSeconds())
                            .sum();
                    dto.setTotalTimeSpent(totalTime);
                    return dto;
                })
                .sorted((a, b) -> Long.compare(b.getCompletionCount(), a.getCompletionCount()))
                .limit(10)
                .collect(Collectors.toList());
        detailed.setPopularTests(popularTests);
        
        // 10. Engagement metrics
        DetailedStatisticsDTO.EngagementMetricsDTO engagement = new DetailedStatisticsDTO.EngagementMetricsDTO();
        
        // Calculate average study hours per day (last 30 days)
        long totalStudySeconds = allLessonProgress.stream()
                .filter(lp -> lp.getTimeSpentSeconds() != null && lp.getTimeSpentSeconds() > 0)
                .filter(lp -> lp.getCompletedAt() != null && lp.getCompletedAt().isAfter(startDate))
                .mapToLong(lp -> lp.getTimeSpentSeconds())
                .sum();
        totalStudySeconds += allTestProgress.stream()
                .filter(tp -> tp.getTimeSpentSeconds() != null && tp.getTimeSpentSeconds() > 0)
                .filter(tp -> tp.getCompletedAt() != null && tp.getCompletedAt().isAfter(startDate))
                .mapToLong(tp -> tp.getTimeSpentSeconds())
                .sum();
        
        double totalStudyHours = totalStudySeconds / 3600.0;
        engagement.setAverageStudyHoursPerDay(Math.round((totalStudyHours / 30.0) * 100.0) / 100.0);
        
        // Calculate average study days per week
        Set<LocalDate> activeDates = new HashSet<>();
        allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .filter(lp -> lp.getCompletedAt() != null && lp.getCompletedAt().isAfter(startDate))
                .forEach(lp -> activeDates.add(lp.getCompletedAt().toLocalDate()));
        allTestProgress.stream()
                .filter(tp -> tp.getCompletedAt() != null && tp.getCompletedAt().isAfter(startDate))
                .forEach(tp -> activeDates.add(tp.getCompletedAt().toLocalDate()));
        
        engagement.setTotalActiveDays(activeDates.size());
        engagement.setAverageStudyDaysPerWeek(Math.round((activeDates.size() / 4.285) * 100.0) / 100.0); // 30 days ≈ 4.285 weeks
        
        // Retention rate (users active in last 7 days / total users)
        LocalDateTime sevenDaysAgo = endDate.minusDays(7);
        Set<Long> recentActiveUserIds = new HashSet<>();
        allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .filter(lp -> lp.getCompletedAt() != null && lp.getCompletedAt().isAfter(sevenDaysAgo))
                .forEach(lp -> recentActiveUserIds.add(lp.getAccount().getId()));
        allTestProgress.stream()
                .filter(tp -> tp.getCompletedAt() != null && tp.getCompletedAt().isAfter(sevenDaysAgo))
                .forEach(tp -> recentActiveUserIds.add(tp.getAccount().getId()));
        
        long totalUsers = accountRepository.count();
        double retentionRate = totalUsers > 0 ? (recentActiveUserIds.size() * 100.0 / totalUsers) : 0;
        engagement.setRetentionRate(Math.round(retentionRate * 100.0) / 100.0);
        
        // Peak concurrent users (estimate based on max daily active users in last 30 days)
        long peakDailyActive = dailyActiveUsers.stream()
                .mapToLong(DetailedStatisticsDTO.TimeSeriesData::getValue)
                .max()
                .orElse(0);
        engagement.setPeakConcurrentUsers(peakDailyActive);
        
        detailed.setEngagementMetrics(engagement);
        
        // 11. Study frequency distribution (days per week)
        Map<Account, Set<LocalDate>> userActiveDates = new HashMap<>();
        allLessonProgress.stream()
                .filter(LessonProgress::isCompleted)
                .filter(lp -> lp.getCompletedAt() != null && lp.getCompletedAt().isAfter(startDate))
                .forEach(lp -> {
                    userActiveDates.computeIfAbsent(lp.getAccount(), k -> new HashSet<>())
                            .add(lp.getCompletedAt().toLocalDate());
                });
        allTestProgress.stream()
                .filter(tp -> tp.getCompletedAt() != null && tp.getCompletedAt().isAfter(startDate))
                .forEach(tp -> {
                    userActiveDates.computeIfAbsent(tp.getAccount(), k -> new HashSet<>())
                            .add(tp.getCompletedAt().toLocalDate());
                });
        
        Map<String, Long> frequencyDistribution = new HashMap<>();
        userActiveDates.values().forEach(dates -> {
            long daysPerWeek = Math.round(dates.size() / 4.285); // 30 days ≈ 4.285 weeks
            String category;
            if (daysPerWeek == 0) category = "0 ngày/tuần";
            else if (daysPerWeek <= 2) category = "1-2 ngày/tuần";
            else if (daysPerWeek <= 4) category = "3-4 ngày/tuần";
            else if (daysPerWeek <= 6) category = "5-6 ngày/tuần";
            else category = "7 ngày/tuần";
            
            frequencyDistribution.put(category, frequencyDistribution.getOrDefault(category, 0L) + 1);
        });
        detailed.setStudyFrequencyDistribution(frequencyDistribution);
        
        return detailed;
    }
}

