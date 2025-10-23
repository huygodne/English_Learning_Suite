package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.UserLessonProgressDTO;
import com.ptit.englishlearningsuite.dto.UserTestProgressDTO;
import com.ptit.englishlearningsuite.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{accountId}/progress")
public class UserProgressController {

    @Autowired
    private UserProgressService userProgressService;

    @GetMapping("/lessons")
    public ResponseEntity<List<UserLessonProgressDTO>> getLessonProgress(@PathVariable Long accountId) {
        List<UserLessonProgressDTO> progressList = userProgressService.getLessonProgressByAccountId(accountId);
        return ResponseEntity.ok(progressList);
    }

    @GetMapping("/tests")
    public ResponseEntity<List<UserTestProgressDTO>> getTestProgress(@PathVariable Long accountId) {
        List<UserTestProgressDTO> progressList = userProgressService.getTestProgressByAccountId(accountId);
        return ResponseEntity.ok(progressList);
    }
}