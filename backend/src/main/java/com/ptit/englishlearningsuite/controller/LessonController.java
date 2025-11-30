package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.*;
import com.ptit.englishlearningsuite.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    /**
     * POST /api/lessons/{id}/submit-practice
     * 
     * Submit answer for a practice question during an interactive lesson.
     * This endpoint:
     * 1. Validates the answer
     * 2. IMMEDIATELY calls processLessonResult to update User Elo and Lesson Difficulty
     * 3. Returns feedback including isCorrect, correctAnswer, explanation, and newElo
     * 
     * This allows continuous Elo tracking during the lesson, not just at the end.
     * 
     * @param id Lesson ID
     * @param submission Practice submission containing questionId and selectedOptionId
     * @return Practice submission response with feedback and updated Elo
     */
    @PostMapping("/{id}/submit-practice")
    public ResponseEntity<?> submitPractice(
            @PathVariable Long id,
            @RequestBody PracticeSubmissionDTO submission) {
        try {
            // Validate input
            if (submission.getQuestionId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: questionId is required");
            }
            if (submission.getSelectedOptionId() == null && 
                (submission.getTextAnswer() == null || submission.getTextAnswer().trim().isEmpty())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: selectedOptionId or textAnswer is required");
            }

            PracticeSubmissionResponseDTO response = lessonService.submitPractice(id, submission);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    /**
     * POST /api/lessons/{id}/submit-answer
     * 
     * Submit answer for a practice question during an interactive lesson.
     * This endpoint:
     * 1. Validates the answer
     * 2. IMMEDIATELY calls processLessonResult to update User Elo and Lesson Difficulty
     * 3. Returns feedback including correct, newElo, and explanation
     * 
     * @param id Lesson ID
     * @param submission Answer submission containing questionId and selectedOptionId
     * @return Answer submission response with feedback and updated Elo
     */
    @PostMapping("/{id}/submit-answer")
    public ResponseEntity<?> submitAnswer(
            @PathVariable Long id,
            @RequestBody AnswerSubmissionDTO submission) {
        try {
            // Validate input
            if (submission.getQuestionId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: questionId is required");
            }
            if (submission.getSelectedOptionId() == null && 
                (submission.getTextAnswer() == null || submission.getTextAnswer().trim().isEmpty())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: selectedOptionId or textAnswer is required");
            }

            AnswerSubmissionResponseDTO response = lessonService.submitAnswer(id, submission);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }
}