package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"lessonProgresses", "testProgresses"})
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String fullName;

    private String phoneNumber;

    @OneToMany(mappedBy = "account")
    private Set<LessonProgress> lessonProgresses;

    @OneToMany(mappedBy = "account")
    private Set<TestProgress> testProgresses;

    @Column(nullable = false)
    private String role;

    @Column(name = "elo_rating")
    private Integer eloRating = 1000;

    @Column(name = "grammar_proficiency")
    private Double grammarProficiency = 0.0;

    @Column(name = "vocab_proficiency")
    private Double vocabProficiency = 0.0;

    @Column(name = "listening_proficiency")
    private Double listeningProficiency = 0.0;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        // Khởi tạo giá trị mặc định cho recommendation system
        if (eloRating == null) {
            eloRating = 1000;
        }
        if (grammarProficiency == null) {
            grammarProficiency = 0.0;
        }
        if (vocabProficiency == null) {
            vocabProficiency = 0.0;
        }
        if (listeningProficiency == null) {
            listeningProficiency = 0.0;
        }
    }
}