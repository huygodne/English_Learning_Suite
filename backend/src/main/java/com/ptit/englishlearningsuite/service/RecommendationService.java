package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Lesson;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.LessonRepository;
import com.ptit.englishlearningsuite.util.HybridMathUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * HYBRID RECOMMENDATION SYSTEM SERVICE
 * 
 * Hệ thống gợi ý lai kết hợp 2 phương pháp:
 * 1. Elo Rating System (Collaborative Filtering): Lọc bài học theo độ khó phù hợp
 * 2. Vector Space Model (Content-Based Filtering): Xếp hạng theo nhu cầu học tập
 * 
 * Quy trình:
 * - Giai đoạn 1: Lọc bài học có difficultyRating nằm trong khoảng [eloRating - 150, eloRating + 150]
 * - Giai đoạn 2: Tính Cosine Similarity giữa User Needs Vector và Lesson Content Vector
 * - Kết quả: Top 5 bài học có similarity cao nhất
 * 
 * @author English Learning Suite Team
 */
@Service
public class RecommendationService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private LessonRepository lessonRepository;

    /**
     * Lấy danh sách bài học được gợi ý cho user (chỉ trả về Lesson entities)
     * 
     * @param accountId ID của user
     * @return Danh sách Top 5 bài học được gợi ý, sắp xếp theo similarity giảm dần
     */
    @Transactional(readOnly = true)
    public List<Lesson> getRecommendedLessons(Long accountId) {
        // Bước 1: Lấy thông tin Account
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));

        // Lấy Elo Rating của user (mặc định 1500 nếu null)
        int userEloRating = account.getEloRating() != null ? account.getEloRating() : 1500;

        // Bước 2: Lấy danh sách tất cả bài học đang active
        List<Lesson> allActiveLessons = lessonRepository.findAll().stream()
                .filter(lesson -> {
                    // Chỉ lấy bài học đang active
                    return lesson.getIsActive() != null && lesson.getIsActive();
                })
                .collect(Collectors.toList());

        // GIAI ĐOẠN 1: ADAPTIVE FILTERING (Lọc theo độ khó)
        // Chỉ lấy các lesson có difficultyRating nằm trong khoảng [eloRating - 150, eloRating + 150]
        List<Lesson> filteredLessons = allActiveLessons.stream()
                .filter(lesson -> {
                    int lessonDifficulty = lesson.getDifficultyRating() != null 
                            ? lesson.getDifficultyRating() 
                            : 1500; // Mặc định 1500 nếu null
                    
                    // Lọc bài học có độ khó phù hợp với năng lực user
                    return lessonDifficulty >= (userEloRating - 150) 
                        && lessonDifficulty <= (userEloRating + 150);
                })
                .collect(Collectors.toList());

        // Nếu không có bài học nào phù hợp, mở rộng khoảng tìm kiếm
        if (filteredLessons.isEmpty()) {
            filteredLessons = allActiveLessons.stream()
                    .filter(lesson -> {
                        int lessonDifficulty = lesson.getDifficultyRating() != null 
                                ? lesson.getDifficultyRating() 
                                : 1500;
                        // Mở rộng khoảng: [eloRating - 300, eloRating + 300]
                        return lessonDifficulty >= (userEloRating - 300) 
                            && lessonDifficulty <= (userEloRating + 300);
                    })
                    .collect(Collectors.toList());
        }

        // GIAI ĐOẠN 2: CONTENT-BASED FILTERING (Xếp hạng theo nhu cầu)
        // Tạo User Needs Vector
        double[] userNeedsVector = createUserNeedsVector(account);

        // Tính similarity cho từng lesson và sắp xếp
        List<LessonWithSimilarity> lessonsWithSimilarity = filteredLessons.stream()
                .map(lesson -> {
                    // Tạo Lesson Content Vector
                    double[] lessonVector = createLessonVector(lesson);
                    
                    // Tính Cosine Similarity
                    double similarity = HybridMathUtils.calculateCosineSimilarity(
                            userNeedsVector, 
                            lessonVector
                    );
                    
                    return new LessonWithSimilarity(lesson, similarity);
                })
                .sorted((a, b) -> Double.compare(b.similarity, a.similarity)) // Sắp xếp giảm dần
                .collect(Collectors.toList());

        // Trả về Top 5 bài học
        return lessonsWithSimilarity.stream()
                .limit(5)
                .map(lws -> lws.lesson)
                .collect(Collectors.toList());
    }

    /**
     * Lấy danh sách bài học được gợi ý kèm similarity score
     * 
     * @param accountId ID của user
     * @return Danh sách Top 5 bài học với similarity score
     */
    @Transactional(readOnly = true)
    public List<LessonWithSimilarity> getRecommendedLessonsWithSimilarity(Long accountId) {
        // Bước 1: Lấy thông tin Account
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));

        // Lấy Elo Rating của user (mặc định 1500 nếu null)
        int userEloRating = account.getEloRating() != null ? account.getEloRating() : 1500;

        // Bước 2: Lấy danh sách tất cả bài học đang active
        List<Lesson> allActiveLessons = lessonRepository.findAll().stream()
                .filter(lesson -> {
                    // Chỉ lấy bài học đang active
                    return lesson.getIsActive() != null && lesson.getIsActive();
                })
                .collect(Collectors.toList());

        // GIAI ĐOẠN 1: ADAPTIVE FILTERING (Lọc theo độ khó)
        List<Lesson> filteredLessons = allActiveLessons.stream()
                .filter(lesson -> {
                    int lessonDifficulty = lesson.getDifficultyRating() != null 
                            ? lesson.getDifficultyRating() 
                            : 1500;
                    return lessonDifficulty >= (userEloRating - 150) 
                        && lessonDifficulty <= (userEloRating + 150);
                })
                .collect(Collectors.toList());

        // Nếu không có bài học nào phù hợp, mở rộng khoảng tìm kiếm
        if (filteredLessons.isEmpty()) {
            filteredLessons = allActiveLessons.stream()
                    .filter(lesson -> {
                        int lessonDifficulty = lesson.getDifficultyRating() != null 
                                ? lesson.getDifficultyRating() 
                                : 1500;
                        return lessonDifficulty >= (userEloRating - 300) 
                            && lessonDifficulty <= (userEloRating + 300);
                    })
                    .collect(Collectors.toList());
        }

        // GIAI ĐOẠN 2: CONTENT-BASED FILTERING
        double[] userNeedsVector = createUserNeedsVector(account);

        // Tính similarity cho từng lesson và sắp xếp
        List<LessonWithSimilarity> lessonsWithSimilarity = filteredLessons.stream()
                .map(lesson -> {
                    double[] lessonVector = createLessonVector(lesson);
                    double similarity = HybridMathUtils.calculateCosineSimilarity(
                            userNeedsVector, 
                            lessonVector
                    );
                    return new LessonWithSimilarity(lesson, similarity);
                })
                .sorted((a, b) -> Double.compare(b.similarity, a.similarity))
                .collect(Collectors.toList());

        // Trả về Top 5 bài học với similarity
        return lessonsWithSimilarity.stream()
                .limit(5)
                .collect(Collectors.toList());
    }

    /**
     * Tạo User Needs Vector dựa trên proficiency của user
     * 
     * Logic: User càng yếu kỹ năng nào thì nhu cầu học kỹ năng đó càng cao
     * 
     * Vector có 3 chiều:
     * - v_grammar = 1.0 - grammarProficiency
     * - v_vocab = 1.0 - vocabProficiency
     * - v_listening = 1.0 - listeningProficiency
     * 
     * @param account Account của user
     * @return User Needs Vector [grammar, vocab, listening]
     */
    private double[] createUserNeedsVector(Account account) {
        double grammarNeed = 1.0 - (account.getGrammarProficiency() != null 
                ? account.getGrammarProficiency() 
                : 0.0);
        double vocabNeed = 1.0 - (account.getVocabProficiency() != null 
                ? account.getVocabProficiency() 
                : 0.0);
        double listeningNeed = 1.0 - (account.getListeningProficiency() != null 
                ? account.getListeningProficiency() 
                : 0.0);

        // Đảm bảo giá trị nằm trong khoảng [0.0, 1.0]
        grammarNeed = Math.max(0.0, Math.min(1.0, grammarNeed));
        vocabNeed = Math.max(0.0, Math.min(1.0, vocabNeed));
        listeningNeed = Math.max(0.0, Math.min(1.0, listeningNeed));

        return new double[]{grammarNeed, vocabNeed, listeningNeed};
    }

    /**
     * Tạo Lesson Content Vector từ các weight của lesson
     * 
     * Vector có 3 chiều:
     * - grammarWeight
     * - vocabWeight
     * - listeningWeight
     * 
     * @param lesson Lesson cần tạo vector
     * @return Lesson Content Vector [grammar, vocab, listening]
     */
    private double[] createLessonVector(Lesson lesson) {
        double grammarWeight = lesson.getGrammarWeight() != null 
                ? lesson.getGrammarWeight() 
                : 0.33;
        double vocabWeight = lesson.getVocabWeight() != null 
                ? lesson.getVocabWeight() 
                : 0.33;
        double listeningWeight = lesson.getListeningWeight() != null 
                ? lesson.getListeningWeight() 
                : 0.34;

        // Đảm bảo giá trị hợp lệ
        grammarWeight = Math.max(0.0, Math.min(1.0, grammarWeight));
        vocabWeight = Math.max(0.0, Math.min(1.0, vocabWeight));
        listeningWeight = Math.max(0.0, Math.min(1.0, listeningWeight));

        return new double[]{grammarWeight, vocabWeight, listeningWeight};
    }

    /**
     * Xử lý kết quả học bài và cập nhật feedback loop
     * 
     * Feedback Loop bao gồm:
     * 1. Cập nhật Elo Rating cho User và Difficulty Rating cho Lesson
     * 2. Cập nhật Proficiency của User dựa trên weight của lesson
     * 
     * @param accountId ID của user
     * @param lessonId ID của lesson
     * @param isPassed true nếu user pass bài học, false nếu fail
     */
    @Transactional
    public void processLessonResult(Long accountId, Long lessonId, boolean isPassed) {
        // Lấy Account và Lesson
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + accountId));
        
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        // Khởi tạo giá trị mặc định nếu null
        int userElo = account.getEloRating() != null ? account.getEloRating() : 1500;
        int lessonDifficulty = lesson.getDifficultyRating() != null 
                ? lesson.getDifficultyRating() 
                : 1500;

        // =================================================================
        // PHẦN 1: CẬP NHẬT ELO RATING
        // =================================================================
        // Coi User và Lesson là 2 đối thủ trong trận đấu
        // Nếu User pass: User thắng (actualScore = 1.0), Lesson thua (actualScore = 0.0)
        // Nếu User fail: User thua (actualScore = 0.0), Lesson thắng (actualScore = 1.0)

        double userActualScore = isPassed ? 1.0 : 0.0;
        double lessonActualScore = isPassed ? 0.0 : 1.0;

        // Cập nhật Elo Rating cho User
        int newUserElo = HybridMathUtils.calculateNewElo(userElo, lessonDifficulty, userActualScore);
        account.setEloRating(newUserElo);

        // Cập nhật Difficulty Rating cho Lesson
        int newLessonDifficulty = HybridMathUtils.calculateNewElo(
                lessonDifficulty, 
                userElo, 
                lessonActualScore
        );
        lesson.setDifficultyRating(newLessonDifficulty);

        // =================================================================
        // PHẦN 2: CẬP NHẬT PROFICIENCY CỦA USER
        // =================================================================
        // Cập nhật proficiency dựa trên kết quả (tăng khi đúng, giảm khi sai)
        // Lấy weight của lesson
        double grammarWeight = lesson.getGrammarWeight() != null 
                ? lesson.getGrammarWeight() 
                : 0.33;
        double vocabWeight = lesson.getVocabWeight() != null 
                ? lesson.getVocabWeight() 
                : 0.33;
        double listeningWeight = lesson.getListeningWeight() != null 
                ? lesson.getListeningWeight() 
                : 0.34;

        // Hệ số thay đổi proficiency (có thể điều chỉnh)
        // Khi đúng: tăng proficiency
        // Khi sai: giảm proficiency (với hệ số nhỏ hơn để tránh giảm quá nhanh)
        double improvementFactor = isPassed ? 0.05 : -0.02; // Giảm ít hơn khi sai

        // Cập nhật Grammar Proficiency
        double currentGrammar = account.getGrammarProficiency() != null 
                ? account.getGrammarProficiency() 
                : 0.0;
        double newGrammar = currentGrammar + (grammarWeight * improvementFactor);
        account.setGrammarProficiency(Math.max(0.0, Math.min(1.0, newGrammar))); // Giới hạn trong [0.0, 1.0]

        // Cập nhật Vocab Proficiency
        double currentVocab = account.getVocabProficiency() != null 
                ? account.getVocabProficiency() 
                : 0.0;
        double newVocab = currentVocab + (vocabWeight * improvementFactor);
        account.setVocabProficiency(Math.max(0.0, Math.min(1.0, newVocab)));

        // Cập nhật Listening Proficiency
        double currentListening = account.getListeningProficiency() != null 
                ? account.getListeningProficiency() 
                : 0.0;
        double newListening = currentListening + (listeningWeight * improvementFactor);
        account.setListeningProficiency(Math.max(0.0, Math.min(1.0, newListening)));

        // Lưu tất cả thay đổi xuống database
        accountRepository.save(account);
        lessonRepository.save(lesson);
    }

    /**
     * Inner class để lưu Lesson kèm Similarity score
     * Public để có thể truy cập từ controller
     */
    public static class LessonWithSimilarity {
        public Lesson lesson;
        public double similarity;

        public LessonWithSimilarity(Lesson lesson, double similarity) {
            this.lesson = lesson;
            this.similarity = similarity;
        }
    }
}

