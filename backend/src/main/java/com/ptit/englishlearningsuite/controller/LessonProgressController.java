package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.LessonProgressDTO;
import com.ptit.englishlearningsuite.service.LessonProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress/lessons")
public class LessonProgressController {

    @Autowired
    private LessonProgressService lessonProgressService;

    @PostMapping("/complete")
    public ResponseEntity<?> completeLesson(@RequestBody LessonProgressDTO progressDto) {
        try {
            lessonProgressService.completeLesson(progressDto);
            return ResponseEntity.ok().body("Lesson progress saved successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving lesson progress: " + e.getMessage());
        }
    }
}