package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Set;

@Entity
@Table(name = "conversations")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = "lesson")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private String title;
    private String audioUrl;

    @OneToMany(mappedBy = "conversation", cascade = CascadeType.ALL)
    private Set<Sentence> sentences;
}