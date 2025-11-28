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

import java.util.*;
import java.util.stream.Collectors;

import com.ptit.englishlearningsuite.dto.TestDetailDTO;
import com.ptit.englishlearningsuite.dto.QuestionDTO;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestService {

    private static final Set<String> SUPPORTED_QUESTION_TYPES = Set.of("MULTIPLE_CHOICE", "SINGLE_CHOICE");

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
                submission.getAnswers().stream().map(AnswerSubmissionDTO::getQuestionId).distinct().toList()
        );

        // Group answers by questionId to handle MULTIPLE_CHOICE correctly
        Map<Long, List<Long>> answersByQuestion = submission.getAnswers().stream()
                .collect(Collectors.groupingBy(
                        AnswerSubmissionDTO::getQuestionId,
                        Collectors.mapping(AnswerSubmissionDTO::getSelectedOptionId, Collectors.toList())
                ));

        // Improved scoring logic that supports:
        // 1. SINGLE_CHOICE: Check if selected option is correct
        // 2. MULTIPLE_CHOICE: Check if all selected options match all correct options (exact match)
        for (Question question : questions) {
            List<Long> userSelectedOptions = answersByQuestion.getOrDefault(question.getId(), List.of());
            
            // Get all correct answer options for this question
            List<Long> correctOptionIds = question.getAnswerOptions().stream()
                    .filter(AnswerOption::isCorrect)
                    .map(AnswerOption::getId)
                    .sorted()
                    .collect(Collectors.toList());

            boolean isCorrect = false;
            
            if ("MULTIPLE_CHOICE".equals(question.getQuestionType())) {
                // For MULTIPLE_CHOICE: Check if selected options exactly match correct options
                // Both sets must have the same size and contain the same elements
                List<Long> sortedUserOptions = userSelectedOptions.stream().sorted().collect(Collectors.toList());
                if (sortedUserOptions.size() == correctOptionIds.size() && 
                    sortedUserOptions.equals(correctOptionIds)) {
                    isCorrect = true;
                }
            } else {
                // For SINGLE_CHOICE: Check if the single selected option is correct
                if (userSelectedOptions.size() == 1 && 
                    correctOptionIds.contains(userSelectedOptions.get(0))) {
                    isCorrect = true;
                }
            }
            
            if (isCorrect) {
                score++;
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
        // Store score as percentage (0-100), ensure it never exceeds 100
        int scorePercentage = Math.min((score * 100) / totalQuestions, 100);
        progress.setScore(scorePercentage);

        progress.setTimeSpentSeconds(submission.getTimeSpentSeconds());
        progress.setCompletedAt(java.time.LocalDateTime.now());

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
                .filter(question -> SUPPORTED_QUESTION_TYPES.contains(question.getQuestionType()))
                .sorted(Comparator.comparing(Question::getId))
                .map(this::convertQuestionToDto)
                .collect(Collectors.toList()));
        return dto;
    }

    private QuestionDTO convertQuestionToDto(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType());
        dto.setImageUrl(question.getImageUrl());
        dto.setAnswerOptions(question.getAnswerOptions().stream()
                .sorted(Comparator.comparing(AnswerOption::getId))
                .map(this::convertAnswerOptionToDto)
                .collect(Collectors.toList()));
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

    @Transactional
    public Test createTest(TestRequestDTO req) {
        Test test = new Test();
        test.setName(req.getName());
        test.setLevel(req.getLevel());
        test.setAudioUrl(req.getAudioUrl());

        Test savedTest = testRepository.save(test);

        if (req.getQuestions() != null) {
            for (TestRequestDTO.QuestionRequestDTO qDto : req.getQuestions()) {
                Question q = new Question();
                q.setTest(savedTest); // Gắn cha
                q.setQuestionText(qDto.getQuestionText());
                q.setQuestionType(qDto.getQuestionType());
                q.setImageUrl(qDto.getImageUrl());

                // Khởi tạo Set nếu chưa có (để tránh NullPointerException)
                if (q.getAnswerOptions() == null) {
                    q.setAnswerOptions(new HashSet<>());
                }

                // [QUAN TRỌNG] Lưu danh sách đáp án
                if (qDto.getAnswerOptions() != null) {
                    for (AnswerOptionDTO aDto : qDto.getAnswerOptions()) {
                        AnswerOption a = new AnswerOption();
                        a.setQuestion(q); // Gắn câu hỏi cha
                        a.setOptionText(aDto.getOptionText());
                        // Trường này lấy từ JSON (nhờ @JsonProperty(access = WRITE_ONLY))
                        a.setCorrect(aDto.isCorrect());

                        // Thêm vào danh sách đáp án của câu hỏi
                        q.getAnswerOptions().add(a);
                    }
                }

                // Lưu câu hỏi (Cascade sẽ tự lưu luôn AnswerOption nếu Entity Question cấu hình đúng)
                questionRepository.save(q);
            }
        }
        return savedTest;
    }

    // --- [UPDATE] SỬA BÀI KIỂM TRA (FULL LOGIC) ---
    @Transactional
    public Test updateTest(Long id, TestRequestDTO req) {
        // 1. Tìm bài test cũ
        Test test = testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found with id: " + id));

        // 2. Cập nhật thông tin chung
        test.setName(req.getName());
        test.setLevel(req.getLevel());
        if (req.getAudioUrl() != null && !req.getAudioUrl().isEmpty()) {
            test.setAudioUrl(req.getAudioUrl());
        }

        // 3. Cập nhật DANH SÁCH CÂU HỎI (Questions)
        if (req.getQuestions() != null) {
            // Xóa hết câu hỏi cũ (orphanRemoval sẽ xóa trong DB)
            test.getQuestions().clear();

            for (TestRequestDTO.QuestionRequestDTO qDto : req.getQuestions()) {
                Question q = new Question();
                q.setTest(test); // Gán cha
                q.setQuestionText(qDto.getQuestionText());
                q.setQuestionType(qDto.getQuestionType());
                q.setImageUrl(qDto.getImageUrl());

                // Xử lý ĐÁP ÁN (Answer Options) của câu hỏi
                // Lưu ý: Entity Question cần có @OneToMany cascade ALL tới AnswerOption
                if (qDto.getAnswerOptions() != null) {
                    // Nếu list answerOptions trong Question chưa khởi tạo thì tạo mới
                    // if (q.getAnswerOptions() == null) q.setAnswerOptions(new java.util.HashSet<>());

                    for (AnswerOptionDTO aDto : qDto.getAnswerOptions()) {
                        AnswerOption a = new AnswerOption();
                        a.setQuestion(q); // Gắn cha (Question)
                        a.setOptionText(aDto.getOptionText());
                        // Giả sử trong AnswerOptionDTO có trường isCorrect (boolean)
                        // Nếu DTO bạn chưa có thì nhớ thêm vào DTO nhé!
                        a.setCorrect(aDto.isCorrect());

                        q.getAnswerOptions().add(a);
                    }
                }

                test.getQuestions().add(q);
            }
        }

        return testRepository.save(test);
    }

    // --- [DELETE] XÓA BÀI TEST ---
    public void deleteTest(Long id) {
        // Cascade sẽ xóa luôn Questions và Answers
        testRepository.deleteById(id);
    }
}