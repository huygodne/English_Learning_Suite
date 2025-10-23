package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.*;
import com.ptit.englishlearningsuite.entity.*;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import com.ptit.englishlearningsuite.repository.QuestionRepository;
import com.ptit.englishlearningsuite.repository.TestProgressRepository;
import com.ptit.englishlearningsuite.repository.TestRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        // Tìm người dùng và bài test trong CSDL
        Account account = accountRepository.findById(submission.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Test test = testRepository.findById(submission.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        int score = 0;
        List<Question> questions = questionRepository.findAllById(
                submission.getAnswers().stream().map(a -> a.getQuestionId()).toList()
        );

        for (AnswerSubmissionDTO userAnswer : submission.getAnswers()) {
            Question question = questions.stream()
                    .filter(q -> q.getId().equals(userAnswer.getQuestionId()))
                    .findFirst().orElse(null);

            if (question != null) {
                AnswerOption correctOption = question.getAnswerOptions().stream()
                        .filter(AnswerOption::isCorrect)
                        .findFirst().orElse(null);

                if (correctOption != null && correctOption.getId().equals(userAnswer.getSelectedOptionId())) {
                    score++;
                }
            }
        }

        // Tạo hoặc cập nhật tiến trình làm bài
        TestProgress progress = testProgressRepository.findByAccountAndTest(account, test)
                .orElse(new TestProgress()); // Tìm progress cũ, nếu không có thì tạo mới

        progress.setAccount(account);
        progress.setTest(test);
        progress.setScore(score); // Cập nhật điểm số mới

        testProgressRepository.save(progress); // Lưu vào CSDL

        return score;
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