package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sentences")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = "conversation")
public class Sentence {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "conversation_id", nullable = false)
    private Conversation conversation;

    private String characterName; // Tên nhân vật nói (A, B,...)
    private String textEnglish;
    private String textVietnamese;
}