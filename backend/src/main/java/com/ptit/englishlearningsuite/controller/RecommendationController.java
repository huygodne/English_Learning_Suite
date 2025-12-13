package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.RecommendedLessonDTO;
import com.ptit.englishlearningsuite.dto.SimulateLessonResultDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Lesson;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private AccountRepository accountRepository;

    @GetMapping
    public ResponseEntity<?> getRecommendedLessons(@RequestParam(required = false) Long userId) {
        try {
            Account account = null;
            
            if (userId != null) {
                account = accountRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            } else {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated()) {
                    String username = authentication.getName();
                    account = accountRepository.findByUsername(username).orElse(null);
                }
                
                if (account == null) {
                    account = accountRepository.findAll().stream()
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("No users found in database"));
                }
            }

            List<RecommendationService.LessonWithSimilarity> lessonsWithSimilarity =
                    recommendationService.getRecommendedLessonsWithSimilarity(account.getId());

            List<RecommendedLessonDTO> lessonDTOs = lessonsWithSimilarity.stream()
                    .map(this::convertToRecommendedDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(lessonDTOs);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    @GetMapping("/user-stats")
    public ResponseEntity<?> getUserStats(@RequestParam(required = false) Long userId) {
        try {
            Account account = null;
            
            if (userId != null) {
                account = accountRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            } else {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated()) {
                    String username = authentication.getName();
                    account = accountRepository.findByUsername(username).orElse(null);
                }
                
                if (account == null) {
                    account = accountRepository.findAll().stream()
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("No users found in database"));
                }
            }

            java.util.Map<String, Object> stats = new java.util.HashMap<>();
            stats.put("id", account.getId());
            stats.put("username", account.getUsername());
            stats.put("fullName", account.getFullName());
            stats.put("eloRating", account.getEloRating() != null ? account.getEloRating() : 1500);
            stats.put("grammarProficiency", account.getGrammarProficiency() != null ? account.getGrammarProficiency() : 0.0);
            stats.put("vocabProficiency", account.getVocabProficiency() != null ? account.getVocabProficiency() : 0.0);
            stats.put("listeningProficiency", account.getListeningProficiency() != null ? account.getListeningProficiency() : 0.0);

            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    @PostMapping("/simulate")
    public ResponseEntity<?> simulateLessonResult(@RequestBody SimulateLessonResultDTO request) {
        try {
            if (request.getUserId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: userId is required");
            }
            if (request.getLessonId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: lessonId is required");
            }
            if (request.getIsPassed() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: isPassed is required");
            }

            Account account = accountRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + request.getUserId()));

            int oldElo = account.getEloRating() != null ? account.getEloRating() : 1500;
            double oldGrammar = account.getGrammarProficiency() != null ? account.getGrammarProficiency() : 0.0;
            double oldVocab = account.getVocabProficiency() != null ? account.getVocabProficiency() : 0.0;
            double oldListening = account.getListeningProficiency() != null ? account.getListeningProficiency() : 0.0;

            recommendationService.processLessonResult(
                    request.getUserId(),
                    request.getLessonId(),
                    request.getIsPassed()
            );

            account = accountRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Account not found after update"));

            StringBuilder response = new StringBuilder();
            response.append("Simulation completed successfully!\n\n");
            response.append("=== BEFORE ===\n");
            response.append(String.format("Elo Rating: %d\n", oldElo));
            response.append(String.format("Grammar Proficiency: %.2f\n", oldGrammar));
            response.append(String.format("Vocab Proficiency: %.2f\n", oldVocab));
            response.append(String.format("Listening Proficiency: %.2f\n", oldListening));
            response.append("\n=== AFTER ===\n");
            response.append(String.format("Elo Rating: %d (Δ%d)\n", 
                    account.getEloRating(), 
                    account.getEloRating() - oldElo));
            response.append(String.format("Grammar Proficiency: %.2f (Δ%.2f)\n", 
                    account.getGrammarProficiency(),
                    account.getGrammarProficiency() - oldGrammar));
            response.append(String.format("Vocab Proficiency: %.2f (Δ%.2f)\n", 
                    account.getVocabProficiency(),
                    account.getVocabProficiency() - oldVocab));
            response.append(String.format("Listening Proficiency: %.2f (Δ%.2f)\n", 
                    account.getListeningProficiency(),
                    account.getListeningProficiency() - oldListening));
            response.append(String.format("\nResult: %s\n", request.getIsPassed() ? "PASSED" : "FAILED"));

            return ResponseEntity.ok(response.toString());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    private RecommendedLessonDTO convertToRecommendedDTO(RecommendationService.LessonWithSimilarity lws) {
        Lesson lesson = lws.lesson;
        RecommendedLessonDTO dto = new RecommendedLessonDTO();
        dto.setId(lesson.getId());
        dto.setLessonNumber(lesson.getLessonNumber());
        dto.setLevel(lesson.getLevel());
        dto.setName(lesson.getName());
        dto.setDifficultyRating(lesson.getDifficultyRating());
        dto.setGrammarWeight(lesson.getGrammarWeight());
        dto.setVocabWeight(lesson.getVocabWeight());
        dto.setListeningWeight(lesson.getListeningWeight());
        dto.setSimilarity(lws.similarity);
        return dto;
    }
}

