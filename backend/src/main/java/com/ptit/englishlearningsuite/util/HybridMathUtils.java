package com.ptit.englishlearningsuite.util;

/**
 * HYBRID RECOMMENDATION SYSTEM - MATH UTILITIES
 * 
 * Utility class chứa các hàm toán học cốt lõi cho hệ thống gợi ý lai:
 * - Elo Rating System: Đánh giá năng lực dựa trên kết quả thi đấu
 * - Vector Space Model: Tính toán độ tương đồng giữa user needs và lesson content
 * 
 * @author English Learning Suite Team
 */
public class HybridMathUtils {
    
    /**
     * K-factor cho Elo Rating System
     * K = 32 là giá trị chuẩn cho người mới bắt đầu và người có rating trung bình
     */
    private static final int K_FACTOR = 32;
    
    /**
     * Tính toán Elo Rating mới sau khi có kết quả thi đấu
     * 
     * Công thức Elo:
     * R' = R + K * (ActualScore - ExpectedScore)
     * 
     * Trong đó:
     * - R: Rating hiện tại
     * - K: K-factor (hệ số điều chỉnh)
     * - ActualScore: Điểm thực tế (1.0 = thắng, 0.5 = hòa, 0.0 = thua)
     * - ExpectedScore: Điểm kỳ vọng dựa trên rating
     * 
     * ExpectedScore được tính bằng:
     * ExpectedScore = 1 / (1 + 10^((RatingDoiThu - RatingHienTai) / 400))
     * 
     * @param currentRating Rating hiện tại của đối thủ
     * @param opponentRating Rating của đối thủ
     * @param actualScore Điểm thực tế (1.0 = thắng, 0.0 = thua)
     * @return Rating mới sau khi cập nhật
     */
    public static int calculateNewElo(int currentRating, int opponentRating, double actualScore) {
        // Tính Expected Score (xác suất thắng dựa trên rating)
        double expectedScore = calculateExpectedScore(currentRating, opponentRating);
        
        // Tính rating mới
        double newRating = currentRating + K_FACTOR * (actualScore - expectedScore);
        
        // Làm tròn và đảm bảo rating không âm
        return Math.max(0, (int) Math.round(newRating));
    }
    
    /**
     * Tính Expected Score (xác suất thắng) dựa trên rating
     * 
     * @param currentRating Rating hiện tại
     * @param opponentRating Rating đối thủ
     * @return Expected Score (0.0 - 1.0)
     */
    public static double calculateExpectedScore(int currentRating, int opponentRating) {
        // Công thức Elo: E = 1 / (1 + 10^((R_opponent - R_current) / 400))
        double ratingDiff = opponentRating - currentRating;
        double exponent = ratingDiff / 400.0;
        double denominator = 1.0 + Math.pow(10, exponent);
        
        return 1.0 / denominator;
    }
    
    /**
     * Tính Cosine Similarity giữa hai vector
     * 
     * Cosine Similarity đo độ tương đồng giữa hai vector trong không gian đa chiều.
     * Công thức: cos(θ) = (A · B) / (||A|| * ||B||)
     * 
     * Trong đó:
     * - A · B: Dot product (tích vô hướng) của hai vector
     * - ||A||: Độ dài (norm) của vector A
     * - ||B||: Độ dài (norm) của vector B
     * 
     * Kết quả: -1.0 đến 1.0
     * - 1.0: Hai vector hoàn toàn giống nhau
     * - 0.0: Hai vector vuông góc (không liên quan)
     * - -1.0: Hai vector đối nghịch hoàn toàn
     * 
     * @param vectorA Vector A (ví dụ: User Needs Vector)
     * @param vectorB Vector B (ví dụ: Lesson Content Vector)
     * @return Cosine Similarity (0.0 - 1.0, hoặc -1.0 nếu đối nghịch)
     * @throws IllegalArgumentException Nếu hai vector không cùng chiều dài
     */
    public static double calculateCosineSimilarity(double[] vectorA, double[] vectorB) {
        // Kiểm tra độ dài vector
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException(
                String.format("Vectors must have same length. A: %d, B: %d", 
                    vectorA.length, vectorB.length)
            );
        }
        
        // Tính dot product (A · B)
        double dotProduct = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
        }
        
        // Tính norm (độ dài) của vector A: ||A|| = sqrt(Σ(Ai²))
        double normA = 0.0;
        for (double value : vectorA) {
            normA += value * value;
        }
        normA = Math.sqrt(normA);
        
        // Tính norm của vector B: ||B|| = sqrt(Σ(Bi²))
        double normB = 0.0;
        for (double value : vectorB) {
            normB += value * value;
        }
        normB = Math.sqrt(normB);
        
        // Xử lý trường hợp chia cho 0 (vector zero)
        if (normA == 0.0 || normB == 0.0) {
            // Nếu cả hai vector đều là zero vector, trả về 0 (không tương đồng)
            // Nếu một trong hai là zero, cũng trả về 0
            return 0.0;
        }
        
        // Tính cosine similarity
        double cosineSimilarity = dotProduct / (normA * normB);
        
        // Đảm bảo kết quả nằm trong khoảng [-1, 1] (do lỗi làm tròn số)
        return Math.max(-1.0, Math.min(1.0, cosineSimilarity));
    }
    
    /**
     * Normalize vector về độ dài 1 (unit vector)
     * Hữu ích khi muốn so sánh vector chỉ dựa trên hướng, không phụ thuộc độ lớn
     * 
     * @param vector Vector cần normalize
     * @return Vector đã được normalize (cùng hướng, độ dài = 1)
     */
    public static double[] normalizeVector(double[] vector) {
        double norm = 0.0;
        for (double value : vector) {
            norm += value * value;
        }
        norm = Math.sqrt(norm);
        
        if (norm == 0.0) {
            // Vector zero, trả về vector zero
            return new double[vector.length];
        }
        
        double[] normalized = new double[vector.length];
        for (int i = 0; i < vector.length; i++) {
            normalized[i] = vector[i] / norm;
        }
        
        return normalized;
    }
}

