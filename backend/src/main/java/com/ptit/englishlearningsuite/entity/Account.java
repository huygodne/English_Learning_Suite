package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "accounts")
@Getter
@Setter
@ToString
@EqualsAndHashCode(exclude = {"lessonProgresses", "testProgresses"}) // Loại trừ các danh sách con
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String fullName;

    private String phoneNumber;

    @OneToMany(mappedBy = "account")
    private Set<LessonProgress> lessonProgresses;

    @OneToMany(mappedBy = "account")
    private Set<TestProgress> testProgresses;

    @Column(nullable = false) // Đảm bảo role không được null
    private String role;
}