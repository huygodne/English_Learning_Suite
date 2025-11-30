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

/**
 * HYBRID RECOMMENDATION SYSTEM CONTROLLER
 * 
 * Controller xử lý các API endpoint cho hệ thống gợi ý lai:
 * - GET /api/recommendations: Lấy danh sách bài học được gợi ý cho user đang đăng nhập
 * - POST /api/recommendations/simulate: API test để simulate kết quả học bài
 * 
 * @author English Learning Suite Team
 */
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @Autowired
    private AccountRepository accountRepository;

    /**
     * GET /api/recommendations
     * 
     * Lấy danh sách bài học được gợi ý cho user
     * 
     * Hệ thống sẽ:
     * 1. Lọc bài học theo độ khó phù hợp với Elo Rating của user (Adaptive Filtering)
     * 2. Xếp hạng bài học theo Cosine Similarity giữa User Needs và Lesson Content (Content-Based Filtering)
     * 3. Trả về Top 5 bài học phù hợp nhất
     * 
     * @param userId (Optional) ID của user. Nếu không có, sẽ lấy user đang đăng nhập hoặc user đầu tiên
     * @return Danh sách Top 5 bài học được gợi ý
     */
    @GetMapping
    public ResponseEntity<?> getRecommendedLessons(@RequestParam(required = false) Long userId) {
        try {
            Account account = null;
            
            // Nếu có userId trong query parameter, sử dụng userId đó
            if (userId != null) {
                account = accountRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            } else {
                // Thử lấy user từ Security Context
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated()) {
                    String username = authentication.getName();
                    account = accountRepository.findByUsername(username).orElse(null);
                }
                
                // Nếu vẫn không có user, lấy user đầu tiên (demo user)
                if (account == null) {
                    account = accountRepository.findAll().stream()
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("No users found in database"));
                }
            }

            // Lấy danh sách bài học được gợi ý kèm similarity score
            List<RecommendationService.LessonWithSimilarity> lessonsWithSimilarity = 
                    recommendationService.getRecommendedLessonsWithSimilarity(account.getId());

            // Chuyển đổi sang RecommendedLessonDTO
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

    /**
     * GET /api/recommendations/user-stats
     * 
     * Lấy thông tin stats của user (Elo, Proficiency)
     * 
     * @param userId (Optional) ID của user. Nếu không có, sẽ lấy user đang đăng nhập hoặc user đầu tiên
     * @return User stats với Elo Rating và các Proficiency
     */
    @GetMapping("/user-stats")
    public ResponseEntity<?> getUserStats(@RequestParam(required = false) Long userId) {
        try {
            Account account = null;
            
            // Nếu có userId trong query parameter, sử dụng userId đó
            if (userId != null) {
                account = accountRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
            } else {
                // Thử lấy user từ Security Context
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated()) {
                    String username = authentication.getName();
                    account = accountRepository.findByUsername(username).orElse(null);
                }
                
                // Nếu vẫn không có user, lấy user đầu tiên (demo user)
                if (account == null) {
                    account = accountRepository.findAll().stream()
                            .findFirst()
                            .orElseThrow(() -> new RuntimeException("No users found in database"));
                }
            }

            // Tạo response object
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

    /**
     * POST /api/recommendations/simulate
     * 
     * API để test nhanh hệ thống recommendation
     * Nhận vào userId, lessonId, và kết quả (pass/fail) để kích hoạt feedback loop
     * 
     * Sau khi gọi API này:
     * - Elo Rating của user và Difficulty Rating của lesson sẽ được cập nhật
     * - Proficiency của user (grammar, vocab, listening) sẽ được cập nhật nếu pass
     * 
     * @param request DTO chứa userId, lessonId, isPassed
     * @return Thông báo kết quả và các chỉ số đã được cập nhật
     */
    @PostMapping("/simulate")
    public ResponseEntity<?> simulateLessonResult(@RequestBody SimulateLessonResultDTO request) {
        try {
            // Validate input
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

            // Lấy Account và Lesson để hiển thị thông tin trước khi cập nhật
            Account account = accountRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Account not found with id: " + request.getUserId()));

            // Lưu giá trị cũ để so sánh
            int oldElo = account.getEloRating() != null ? account.getEloRating() : 1500;
            double oldGrammar = account.getGrammarProficiency() != null ? account.getGrammarProficiency() : 0.0;
            double oldVocab = account.getVocabProficiency() != null ? account.getVocabProficiency() : 0.0;
            double oldListening = account.getListeningProficiency() != null ? account.getListeningProficiency() : 0.0;

            // Xử lý kết quả (cập nhật Elo và Proficiency)
            recommendationService.processLessonResult(
                    request.getUserId(),
                    request.getLessonId(),
                    request.getIsPassed()
            );

            // Lấy lại Account sau khi cập nhật
            account = accountRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Account not found after update"));

            // Tạo response message
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

    /**
     * Chuyển đổi LessonWithSimilarity sang RecommendedLessonDTO
     */
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

