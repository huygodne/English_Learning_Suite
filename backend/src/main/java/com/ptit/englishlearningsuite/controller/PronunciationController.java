package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.PronunciationSampleDTO;
import com.ptit.englishlearningsuite.service.PronunciationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/pronunciations")
public class PronunciationController {

    @Autowired
    private PronunciationService pronunciationService;

    @GetMapping
    public ResponseEntity<List<PronunciationSampleDTO>> findByCategory(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(pronunciationService.findByCategory(category));
    }
}

