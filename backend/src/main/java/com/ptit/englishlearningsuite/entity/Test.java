package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import java.util.Set;

@Entity
@Table(name = "tests")
// THAY THẾ @Data
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = "questions")
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int level;
    private String audioUrl;

    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL)
    private Set<Question> questions;
}