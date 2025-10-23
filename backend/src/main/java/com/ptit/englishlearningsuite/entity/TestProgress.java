package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "test_progress")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"account", "test"}) // Loại trừ cả hai thuộc tính cha
public class TestProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    private int score;
}