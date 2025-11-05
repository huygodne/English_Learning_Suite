package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.*;
import com.ptit.englishlearningsuite.entity.*;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.QuestionRepository;
import com.ptit.englishlearningsuite.repository.TestProgressRepository;
import com.ptit.englishlearningsuite.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.ptit.englishlearningsuite.dto.TestDetailDTO;
import com.ptit.englishlearningsuite.dto.QuestionDTO;

@Service
public class TestService {

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AccountRepository accountRepository; // Thêm AccountRepository

    @Autowired
    private TestProgressRepository testProgressRepository;

    public List<TestSummaryDTO> getAllTests() {
        return testRepository.findAll().stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    // PHƯƠNG THỨC MỚI
    public TestDetailDTO getTestById(Long id) {
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found with id: " + id));
        return convertToDetailDto(test);
    }

    public int submitTest(TestSubmissionDTO submission) {
        // Lấy username của người dùng đang đăng nhập từ token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        // Tìm Account entity dựa trên username
        Account account = accountRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + currentUsername));

        // Tìm bài test
        Test test = testRepository.findById(submission.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        int score = 0;
        List<Question> questions = questionRepository.findAllById(
                submission.getAnswers().stream().map(AnswerSubmissionDTO::getQuestionId).toList()
        );

        // Improved scoring logic that supports:
        // 1. Multiple correct answers (check if selected option is among correct ones)
        // 2. Ordering questions (for now, treat as multiple choice but can be extended)
        for (AnswerSubmissionDTO userAnswer : submission.getAnswers()) {
            Question question = questions.stream()
                    .filter(q -> q.getId().equals(userAnswer.getQuestionId()))
                    .findFirst().orElse(null);

            if (question != null) {
                // Get all correct answer options for this question
                List<Long> correctOptionIds = question.getAnswerOptions().stream()
                        .filter(AnswerOption::isCorrect)
                        .map(AnswerOption::getId)
                        .toList();

                // Check if user's selected answer is among the correct ones
                if (!correctOptionIds.isEmpty() && correctOptionIds.contains(userAnswer.getSelectedOptionId())) {
                    score++;
                }
                // For ordering questions (questionType = "ORDERING"), we would need to check the order
                // For now, treat ordering questions same as multiple choice with multiple correct answers
            }
        }
        
        // Calculate percentage score (score out of total questions)
        int totalQuestions = questions.size();
        if (totalQuestions == 0) {
            return 0;
        }


        // Lưu tiến trình (dùng Account entity thay vì accountId)
        TestProgress progress = testProgressRepository.findByAccountAndTest(account, test)
                .orElse(new TestProgress());

        progress.setAccount(account);
        progress.setTest(test);
        // Store score as percentage (0-100)
        int scorePercentage = (score * 100) / totalQuestions;
        progress.setScore(scorePercentage);

        testProgressRepository.save(progress);

        return scorePercentage;
    }


    // --- CÁC HÀM CHUYỂN ĐỔI ---
    private TestDetailDTO convertToDetailDto(Test test) {
        TestDetailDTO dto = new TestDetailDTO();
        dto.setId(test.getId());
        dto.setName(test.getName());
        dto.setLevel(test.getLevel());
        dto.setAudioUrl(test.getAudioUrl());
        dto.setQuestions(test.getQuestions().stream()
                .map(this::convertQuestionToDto).collect(Collectors.toSet()));
        return dto;
    }

    private QuestionDTO convertQuestionToDto(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType());
        dto.setImageUrl(question.getImageUrl());
        dto.setAnswerOptions(question.getAnswerOptions().stream()
                .map(this::convertAnswerOptionToDto).collect(Collectors.toSet()));
        return dto;
    }

    private AnswerOptionDTO convertAnswerOptionToDto(AnswerOption option) {
        AnswerOptionDTO dto = new AnswerOptionDTO();
        dto.setId(option.getId());
        dto.setOptionText(option.getOptionText());
        return dto;
    }

    private TestSummaryDTO convertToSummaryDto(Test test) {
        TestSummaryDTO dto = new TestSummaryDTO();
        dto.setId(test.getId());
        dto.setName(test.getName());
        dto.setLevel(test.getLevel());
        return dto;
    }
}