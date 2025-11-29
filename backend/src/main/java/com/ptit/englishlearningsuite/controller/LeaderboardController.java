package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.StatisticsDTO;
import com.ptit.englishlearningsuite.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private StatisticsService statisticsService;

    /**
     * Trả về danh sách top người dùng theo XP (tính từ số bài học & bài test đã hoàn thành).
     * Endpoint này dành cho tất cả người dùng đã đăng nhập, không yêu cầu quyền ADMIN.
     */
    @GetMapping("/xp")
    public List<StatisticsDTO.UserStatisticsDTO> getXpLeaderboard() {
        return statisticsService.getStatistics().getTopUsers();
    }
}


