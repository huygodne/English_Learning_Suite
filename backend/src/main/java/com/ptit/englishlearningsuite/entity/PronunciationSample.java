package com.ptit.englishlearningsuite.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "pronunciation_samples")
@Getter
@Setter
public class PronunciationSample {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String term;
    private String ipa;
    private String description;
    private String imageUrl;
    private String audioUrl;
}



