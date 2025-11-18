package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "vocabulary_progress")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"account", "vocabulary"})
public class VocabularyProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne(optional = false)
    @JoinColumn(name = "vocabulary_id")
    private Vocabulary vocabulary;

    private boolean remembered;

    private int masteryLevel;

    private int reviewCount;

    private LocalDateTime lastReviewedAt;
}






