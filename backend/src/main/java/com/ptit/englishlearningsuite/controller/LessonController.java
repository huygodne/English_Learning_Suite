package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.LessonDetailDTO;
import com.ptit.englishlearningsuite.dto.LessonRequestDTO;
import com.ptit.englishlearningsuite.dto.LessonSummaryDTO;
import com.ptit.englishlearningsuite.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping
    public List<LessonSummaryDTO> getAllLessons() {
        return lessonService.getAllLessons();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LessonDetailDTO> getLessonDetails(@PathVariable Long id) {
        try {
            LessonDetailDTO lessonDto = lessonService.getLessonById(id);
            return ResponseEntity.ok(lessonDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createLesson(@RequestBody LessonRequestDTO request) {
        return ResponseEntity.ok(lessonService.createLesson(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLesson(@PathVariable Long id, @RequestBody LessonRequestDTO request) {
        return ResponseEntity.ok(lessonService.updateLesson(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok("Deleted Lesson ID: " + id);
    }
}