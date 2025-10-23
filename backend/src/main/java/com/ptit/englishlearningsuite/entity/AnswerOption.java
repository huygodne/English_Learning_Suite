package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "answer_options")
// THAY THẾ @Data
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = "question")
public class AnswerOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    private String optionText;
    private boolean isCorrect;
}