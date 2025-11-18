package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.TranslationRequestDTO;
import com.ptit.englishlearningsuite.dto.TranslationResponseDTO;
import com.ptit.englishlearningsuite.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/translate")
public class TranslationController {

    @Autowired
    private TranslationService translationService;

    @PostMapping
    public ResponseEntity<TranslationResponseDTO> translate(@RequestBody TranslationRequestDTO request) {
        return ResponseEntity.ok(translationService.translate(request));
    }
}




