package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "lesson_progress")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"account", "lesson"})
public class LessonProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private int score; // Điểm từ vựng
    private boolean isCompleted;


}