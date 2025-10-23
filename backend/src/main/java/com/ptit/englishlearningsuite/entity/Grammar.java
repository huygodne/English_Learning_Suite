package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "grammars")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = "lesson")
public class Grammar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(columnDefinition = "TEXT")
    private String explanationEnglish;

    @Column(columnDefinition = "TEXT")
    private String explanationVietnamese;
}