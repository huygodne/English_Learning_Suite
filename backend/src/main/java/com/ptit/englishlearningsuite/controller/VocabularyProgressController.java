package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.VocabularyProgressDTO;
import com.ptit.englishlearningsuite.service.VocabularyProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vocabulary-progress")
public class VocabularyProgressController {

    @Autowired
    private VocabularyProgressService vocabularyProgressService;

    @PostMapping("/{vocabularyId}/remember")
    public ResponseEntity<VocabularyProgressDTO> toggleRemembered(@PathVariable Long vocabularyId,
                                                                  @RequestParam(defaultValue = "true") boolean remembered) {
        return ResponseEntity.ok(vocabularyProgressService.toggleRemembered(vocabularyId, remembered));
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<List<VocabularyProgressDTO>> getLessonProgress(@PathVariable Long lessonId) {
        return ResponseEntity.ok(vocabularyProgressService.getProgressForLesson(lessonId));
    }
}












