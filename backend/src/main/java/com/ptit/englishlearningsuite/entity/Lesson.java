package com.ptit.englishlearningsuite.entity;

// Bỏ import lombok.Data;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode; // Thêm import
import lombok.Getter; // Thêm import
import lombok.Setter; // Thêm import
import lombok.ToString; // Thêm import
import java.util.Set;

@Entity
@Table(name = "lessons")
// THAY THẾ @Data BẰNG CÁC ANNOTATION SAU
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"vocabularies", "grammars", "conversations", "practiceQuestions"}) // Loại trừ các thuộc tính gây lặp
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int lessonNumber;
    private int level;
    private String name;
    private String audioUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    // =================================================================
    // HYBRID RECOMMENDATION SYSTEM FIELDS
    // =================================================================
    
    /**
     * Difficulty Rating: Độ khó của bài học (Elo rating của bài học)
     * Giá trị mặc định: 1500 (mức trung bình)
     * Được cập nhật động dựa trên kết quả của người học
     */
    @Column(name = "difficulty_rating")
    private Integer difficultyRating = 1500;
    
    /**
     * Grammar Weight: Trọng số ngữ pháp của bài học (0.0 - 1.0)
     * Tổng 3 weight (grammar + vocab + listening) nên bằng 1.0
     */
    @Column(name = "grammar_weight")
    private Double grammarWeight = 0.33;
    
    /**
     * Vocabulary Weight: Trọng số từ vựng của bài học (0.0 - 1.0)
     */
    @Column(name = "vocab_weight")
    private Double vocabWeight = 0.33;
    
    /**
     * Listening Weight: Trọng số nghe hiểu của bài học (0.0 - 1.0)
     */
    @Column(name = "listening_weight")
    private Double listeningWeight = 0.34;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Vocabulary> vocabularies;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Grammar> grammars;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Conversation> conversations;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Question> practiceQuestions;
}