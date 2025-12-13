package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class StatisticsDTO {
    private long totalUsers;
    private long activeUsers;
    private long totalLessons;
    private long totalTests;
    private long totalMediaAssets;
    
    private long totalLessonCompletions;
    private double averageLessonScore;
    private long totalLessonTimeSpent;
    private Map<Integer, Long> lessonCompletionsByLevel;
    
    private long totalTestCompletions;
    private double averageTestScore;
    private long totalTestTimeSpent; // Tổng thời gian làm test (giây)
    private Map<Integer, Long> testCompletionsByLevel; // Số test hoàn thành theo cấp độ
    
    // Top bài học phổ biến
    private List<LessonStatisticsDTO> topLessons;
    
    // Top bài kiểm tra phổ biến
    private List<TestStatisticsDTO> topTests;
    
    // Thống kê người dùng
    private List<UserStatisticsDTO> topUsers;
    
    @Data
    public static class LessonStatisticsDTO {
        private Long lessonId;
        private String lessonName;
        private int lessonNumber;
        private int level;
        private long completionCount;
        private double averageScore;
    }
    
    @Data
    public static class TestStatisticsDTO {
        private Long testId;
        private String testName;
        private int level;
        private long completionCount;
        private double averageScore;
    }
    
    @Data
    public static class UserStatisticsDTO {
        private Long userId;
        private String username;
        private String fullName;
        private long completedLessons;
        private long completedTests;
        private double averageTestScore;
        private long xp; // XP ước tính từ hoạt động học tập
    }
}

