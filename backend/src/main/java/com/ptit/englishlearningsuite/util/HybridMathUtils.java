package com.ptit.englishlearningsuite.util;

public class HybridMathUtils {
    private static final int K_FACTOR = 32;
    public static int calculateNewElo(int currentRating, int opponentRating, double actualScore) {
        // Tính Expected Score (xác suất thắng dựa trên rating)
        double expectedScore = calculateExpectedScore(currentRating, opponentRating);
        
        // Tính rating mới
        double newRating = currentRating + K_FACTOR * (actualScore - expectedScore);
        
        // Làm tròn và đảm bảo rating không âm
        return Math.max(0, (int) Math.round(newRating));
    }

    public static double calculateExpectedScore(int currentRating, int opponentRating) {
        // Công thức Elo: E = 1 / (1 + 10^((R_opponent - R_current) / 400))
        double ratingDiff = opponentRating - currentRating;
        double exponent = ratingDiff / 400.0;
        double denominator = 1.0 + Math.pow(10, exponent);
        
        return 1.0 / denominator;
    }
    
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

