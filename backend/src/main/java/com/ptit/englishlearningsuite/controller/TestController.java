package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.TestDetailDTO;
import com.ptit.englishlearningsuite.dto.TestRequestDTO;
import com.ptit.englishlearningsuite.dto.TestSubmissionDTO;
import com.ptit.englishlearningsuite.dto.TestSummaryDTO;
import com.ptit.englishlearningsuite.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    @Autowired
    private TestService testService;

    @GetMapping
    public List<TestSummaryDTO> getAllTests() {
        return testService.getAllTests();
    }

    // ENDPOINT MỚI
    @GetMapping("/{id}")
    public ResponseEntity<TestDetailDTO> getTestDetails(@PathVariable Long id) {
        try {
            TestDetailDTO testDto = testService.getTestById(id);
            return ResponseEntity.ok(testDto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody TestSubmissionDTO submission) {
        try {
            int score = testService.submitTest(submission);
            // Trả về một đối tượng JSON chứa điểm số
            Map<String, Integer> response = Collections.singletonMap("score", score);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing submission: " + e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTest(@RequestBody TestRequestDTO request) {
        return ResponseEntity.ok(testService.createTest(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTest(@PathVariable Long id, @RequestBody TestRequestDTO request) {
        return ResponseEntity.ok(testService.updateTest(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
        return ResponseEntity.ok("Deleted Test ID: " + id);
    }
}