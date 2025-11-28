package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DetailedStatisticsDTO {
    // User growth over time
    private List<TimeSeriesData> userGrowth; // Số lượng user mới theo ngày/tuần/tháng
    
    // Lesson completions over time
    private List<TimeSeriesData> lessonCompletionsOverTime;
    
    // Test completions over time
    private List<TimeSeriesData> testCompletionsOverTime;
    
    // Daily active users
    private List<TimeSeriesData> dailyActiveUsers;
    
    // Average study time per day
    private List<TimeSeriesData> averageStudyTimePerDay;
    
    // Lesson popularity by level
    private Map<Integer, Long> lessonCompletionsByLevel;
    
    // Test popularity by level
    private Map<Integer, Long> testCompletionsByLevel;
    
    // Most popular lessons (top 10)
    private List<PopularItemDTO> popularLessons;
    
    // Most popular tests (top 10)
    private List<PopularItemDTO> popularTests;
    
    // User engagement metrics
    private EngagementMetricsDTO engagementMetrics;
    
    // Study frequency (days per week)
    private Map<String, Long> studyFrequencyDistribution;
    
    @Data
    public static class TimeSeriesData {
        private String date; // Format: YYYY-MM-DD
        private Long value;
        private String label; // Optional label
    }
    
    @Data
    public static class PopularItemDTO {
        private Long id;
        private String name;
        private int level;
        private long completionCount;
        private double averageScore;
        private long totalTimeSpent; // seconds
    }
    
    @Data
    public static class EngagementMetricsDTO {
        private double averageStudyHoursPerDay; // Trung bình giờ học mỗi ngày
        private double averageStudyDaysPerWeek; // Trung bình số ngày học mỗi tuần
        private long totalActiveDays; // Tổng số ngày có hoạt động
        private double retentionRate; // Tỷ lệ giữ chân (users active trong 7 ngày qua / total users)
        private long peakConcurrentUsers; // Số user đồng thời cao nhất (ước tính)
    }
}

