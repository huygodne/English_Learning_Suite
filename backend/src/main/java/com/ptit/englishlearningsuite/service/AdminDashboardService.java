package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.AdminDashboardDTO;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.MediaAssetRepository;
import com.ptit.englishlearningsuite.repository.LessonRepository;
import com.ptit.englishlearningsuite.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminDashboardService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private MediaAssetRepository mediaAssetRepository;

    public AdminDashboardDTO getDashboard() {
        AdminDashboardDTO dto = new AdminDashboardDTO();
        long totalUsers = accountRepository.count();
        long adminUsers = accountRepository.countByRoleIgnoreCase("ADMIN");

        dto.setTotalUsers(totalUsers);
        dto.setAdminUsers(adminUsers);
        dto.setLearnerUsers(totalUsers - adminUsers);
        dto.setTotalLessons(lessonRepository.count());
        dto.setTotalTests(testRepository.count());
        dto.setTotalMediaAssets(mediaAssetRepository.count());
        return dto;
    }
}
