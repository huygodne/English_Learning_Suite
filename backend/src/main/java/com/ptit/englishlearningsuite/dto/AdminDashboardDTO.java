package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class AdminDashboardDTO {
    private long totalUsers;
    private long adminUsers;
    private long learnerUsers;
    private long totalLessons;
    private long totalTests;
    private long totalMediaAssets;
}


