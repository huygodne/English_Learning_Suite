package com.ptit.englishlearningsuite.entity;

// Bỏ import lombok.Data;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode; // Thêm import
import lombok.Getter; // Thêm import
import lombok.Setter; // Thêm import
import lombok.ToString; // Thêm import
import java.util.Set;

@Entity
@Table(name = "lessons")
// THAY THẾ @Data BẰNG CÁC ANNOTATION SAU
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"vocabularies", "grammars", "conversations"}) // Loại trừ các thuộc tính gây lặp
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int lessonNumber;
    private int level;
    private String name;
    private String audioUrl;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private Set<Vocabulary> vocabularies;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private Set<Grammar> grammars;

    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL)
    private Set<Conversation> conversations;
}