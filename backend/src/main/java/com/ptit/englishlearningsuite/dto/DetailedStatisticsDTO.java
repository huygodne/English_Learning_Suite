package com.ptit.englishlearningsuite.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class DetailedStatisticsDTO {
    private List<TimeSeriesData> userGrowth; // Số lượng user mới theo ngày/tuần/tháng
    
    private List<TimeSeriesData> lessonCompletionsOverTime;

    private List<TimeSeriesData> testCompletionsOverTime;
    
    private List<TimeSeriesData> dailyActiveUsers;
    
    private List<TimeSeriesData> averageStudyTimePerDay;
    
    private Map<Integer, Long> lessonCompletionsByLevel;
    
    private Map<Integer, Long> testCompletionsByLevel;
    
    private List<PopularItemDTO> popularLessons;
    
    private List<PopularItemDTO> popularTests;
    
    private EngagementMetricsDTO engagementMetrics;
    
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
        private double averageStudyHoursPerDay;
        private double averageStudyDaysPerWeek;
        private long totalActiveDays;
        private double retentionRate;
        private long peakConcurrentUsers;
    }
}

