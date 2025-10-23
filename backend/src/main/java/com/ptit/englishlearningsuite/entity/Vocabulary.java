package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "vocabularies")
// THAY THẾ @Data
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = "lesson") // Loại trừ thuộc tính lesson
public class Vocabulary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    private String wordEnglish;
    private String phoneticSpelling;
    private String vietnameseMeaning;
}