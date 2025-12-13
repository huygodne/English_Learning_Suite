package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.*;
import com.ptit.englishlearningsuite.entity.*;
import com.ptit.englishlearningsuite.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private SentenceRepository sentenceRepository;

    @Autowired
    private VocabularyRepository vocabularyRepository;

    @Autowired
    private GrammarRepository grammarRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AnswerOptionRepository answerOptionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private RecommendationService recommendationService;

    public List<LessonSummaryDTO> getAllLessons() {
        return lessonRepository.findAll().stream()
                .map(this::convertToSummaryDto)
                .collect(Collectors.toList());
    }

    public LessonDetailDTO getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        return convertToDetailDto(lesson);
    }


    private LessonSummaryDTO convertToSummaryDto(Lesson lesson) {
        LessonSummaryDTO dto = new LessonSummaryDTO();
        dto.setId(lesson.getId());
        dto.setLessonNumber(lesson.getLessonNumber());
        dto.setLevel(lesson.getLevel());
        dto.setName(lesson.getName());
        return dto;
    }

    private LessonDetailDTO convertToDetailDto(Lesson lesson) {
        LessonDetailDTO dto = new LessonDetailDTO();
        dto.setId(lesson.getId());
        dto.setLessonNumber(lesson.getLessonNumber());
        dto.setLevel(lesson.getLevel());
        dto.setName(lesson.getName());
        dto.setAudioUrl(lesson.getAudioUrl());

        if (lesson.getVocabularies() != null) {
            dto.setVocabularies(lesson.getVocabularies().stream()
                    .map(this::convertVocabularyToDto).collect(Collectors.toSet()));
        } else {
            dto.setVocabularies(Collections.emptySet()); // Trả về danh sách rỗng nếu null
        }

        if (lesson.getGrammars() != null) {
            dto.setGrammars(lesson.getGrammars().stream()
                    .map(this::convertGrammarToDto).collect(Collectors.toSet()));
        } else {
            dto.setGrammars(Collections.emptySet());
        }

        if (lesson.getConversations() != null) {
            dto.setConversations(lesson.getConversations().stream()
                    .map(this::convertConversationToDto).collect(Collectors.toSet()));
        } else {
            dto.setConversations(Collections.emptySet());
        }

        // Add practice questions with shuffled answer options
        if (lesson.getPracticeQuestions() != null) {
            dto.setPracticeQuestions(lesson.getPracticeQuestions().stream()
                    .map(this::convertToPracticeQuestionDto)
                    .collect(Collectors.toList()));
        } else {
            dto.setPracticeQuestions(Collections.emptyList());
        }

        return dto;
    }

    private VocabularyDTO convertVocabularyToDto(Vocabulary vocab) {
        VocabularyDTO dto = new VocabularyDTO();
        dto.setId(vocab.getId());
        dto.setWordEnglish(vocab.getWordEnglish());
        dto.setPhoneticSpelling(vocab.getPhoneticSpelling());
        dto.setVietnameseMeaning(vocab.getVietnameseMeaning());
        dto.setImageUrl(vocab.getImageUrl());
        dto.setAudioUrl(vocab.getAudioUrl());
        dto.setExampleSentenceEnglish(vocab.getExampleSentenceEnglish());
        dto.setExampleSentenceVietnamese(vocab.getExampleSentenceVietnamese());
        return dto;
    }

    private GrammarDTO convertGrammarToDto(Grammar grammar) {
        GrammarDTO dto = new GrammarDTO();
        dto.setId(grammar.getId());
        dto.setExplanationEnglish(grammar.getExplanationEnglish());
        dto.setExplanationVietnamese(grammar.getExplanationVietnamese());
        return dto;
    }

    private ConversationDTO convertConversationToDto(Conversation conv) {
        ConversationDTO dto = new ConversationDTO();
        dto.setId(conv.getId());
        dto.setTitle(conv.getTitle());
        dto.setAudioUrl(conv.getAudioUrl());
        dto.setSentences(conv.getSentences().stream()
                .map(this::convertSentenceToDto).collect(Collectors.toSet()));
        return dto;
    }

    private SentenceDTO convertSentenceToDto(Sentence sentence) {
        SentenceDTO dto = new SentenceDTO();
        dto.setId(sentence.getId());
        dto.setCharacterName(sentence.getCharacterName());
        dto.setTextEnglish(sentence.getTextEnglish());
        dto.setTextVietnamese(sentence.getTextVietnamese());
        return dto;
    }

    /**
     * Convert Question entity to PracticeQuestionDTO with shuffled answer options
     * Shuffling is done for multiple-choice questions to prevent memorization
     * Note: isCorrect is NOT included in the response to prevent cheating
     */
    private PracticeQuestionDTO convertToPracticeQuestionDto(Question question) {
        PracticeQuestionDTO dto = new PracticeQuestionDTO();
        dto.setId(question.getId());
        dto.setQuestionText(question.getQuestionText());
        dto.setQuestionType(question.getQuestionType());
        dto.setImageUrl(question.getImageUrl());

        // Convert answer options to OptionDTO (without isCorrect) and shuffle them
        if (question.getAnswerOptions() != null) {
            List<OptionDTO> options = question.getAnswerOptions().stream()
                    .map(this::convertToOptionDto)
                    .collect(Collectors.toList());

            // Shuffle answer options for multiple-choice questions
            if ("MULTIPLE_CHOICE".equalsIgnoreCase(question.getQuestionType())) {
                Collections.shuffle(options);
            }

            dto.setOptions(options);
        } else {
            dto.setOptions(Collections.emptyList());
        }

        return dto;
    }

    /**
     * Convert AnswerOption to OptionDTO (without isCorrect field)
     */
    private OptionDTO convertToOptionDto(AnswerOption option) {
        OptionDTO dto = new OptionDTO();
        dto.setId(option.getId());
        dto.setOptionText(option.getOptionText());
        // Note: isCorrect is intentionally NOT included to prevent cheating
        return dto;
    }

    @Transactional
    public Lesson createLesson(LessonRequestDTO req) {
        // 1. Lưu bài học chính
        Lesson lesson = new Lesson();
        lesson.setName(req.getName());
        lesson.setLessonNumber(req.getLessonNumber());
        lesson.setLevel(req.getLevel());
        lesson.setAudioUrl(req.getAudioUrl());
        Lesson savedLesson = lessonRepository.save(lesson);

        // 2. Lưu Từ vựng (Giữ nguyên code cũ)
        if (req.getVocabularies() != null) {
            for (VocabularyDTO vDto : req.getVocabularies()) {
                Vocabulary v = new Vocabulary();
                v.setLesson(savedLesson);
                v.setWordEnglish(vDto.getWordEnglish());
                v.setPhoneticSpelling(vDto.getPhoneticSpelling());
                v.setVietnameseMeaning(vDto.getVietnameseMeaning());
                v.setExampleSentenceEnglish(vDto.getExampleSentenceEnglish());
                v.setExampleSentenceVietnamese(vDto.getExampleSentenceVietnamese());
                v.setImageUrl(vDto.getImageUrl());
                v.setAudioUrl(vDto.getAudioUrl());
                vocabularyRepository.save(v);
            }
        }

        // 3. Lưu Ngữ pháp (Giữ nguyên code cũ)
        if (req.getGrammars() != null) {
            for (GrammarDTO gDto : req.getGrammars()) {
                Grammar g = new Grammar();
                g.setLesson(savedLesson);
                g.setExplanationEnglish(gDto.getExplanationEnglish());
                g.setExplanationVietnamese(gDto.getExplanationVietnamese());
                grammarRepository.save(g);
            }
        }

        // 4. [MỚI] Lưu Hội thoại & Câu thoại
        if (req.getConversations() != null) {
            for (LessonRequestDTO.ConversationRequestDTO cDto : req.getConversations()) {
                // Tạo đoạn hội thoại
                Conversation conv = new Conversation();
                conv.setLesson(savedLesson);
                conv.setTitle(cDto.getTitle());
                conv.setAudioUrl(cDto.getAudioUrl());
                Conversation savedConv = conversationRepository.save(conv);

                // Lưu các câu thoại bên trong đoạn hội thoại đó
                if (cDto.getSentences() != null) {
                    for (LessonRequestDTO.SentenceRequestDTO sDto : cDto.getSentences()) {
                        Sentence s = new Sentence();
                        s.setConversation(savedConv); // Gắn vào đoạn hội thoại cha
                        s.setCharacterName(sDto.getCharacterName());
                        s.setTextEnglish(sDto.getTextEnglish());
                        s.setTextVietnamese(sDto.getTextVietnamese());
                        sentenceRepository.save(s);
                    }
                }
            }
        }

        return savedLesson;
    }

    @Transactional
    public Lesson updateLesson(Long id, LessonRequestDTO req) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        lesson.setName(req.getName());
        lesson.setLessonNumber(req.getLessonNumber());
        lesson.setLevel(req.getLevel());
        if (req.getAudioUrl() != null && !req.getAudioUrl().isEmpty()) {
            lesson.setAudioUrl(req.getAudioUrl());
        }

        if (req.getVocabularies() != null) {
            lesson.getVocabularies().clear();

            for (VocabularyDTO vDto : req.getVocabularies()) {
                Vocabulary v = new Vocabulary();
                v.setLesson(lesson); // Quan trọng: Gắn cha
                v.setWordEnglish(vDto.getWordEnglish());
                v.setPhoneticSpelling(vDto.getPhoneticSpelling());
                v.setVietnameseMeaning(vDto.getVietnameseMeaning());
                v.setExampleSentenceEnglish(vDto.getExampleSentenceEnglish());
                v.setExampleSentenceVietnamese(vDto.getExampleSentenceVietnamese());
                v.setImageUrl(vDto.getImageUrl());
                v.setAudioUrl(vDto.getAudioUrl());

                lesson.getVocabularies().add(v); // Add vào list của Entity
            }
        }

        if (req.getGrammars() != null) {
            lesson.getGrammars().clear();

            for (GrammarDTO gDto : req.getGrammars()) {
                Grammar g = new Grammar();
                g.setLesson(lesson);
                g.setExplanationEnglish(gDto.getExplanationEnglish());
                g.setExplanationVietnamese(gDto.getExplanationVietnamese());

                lesson.getGrammars().add(g);
            }
        }

        if (req.getConversations() != null) {
            lesson.getConversations().clear();

            for (LessonRequestDTO.ConversationRequestDTO cDto : req.getConversations()) {
                Conversation conv = new Conversation();
                conv.setLesson(lesson);
                conv.setTitle(cDto.getTitle());
                conv.setAudioUrl(cDto.getAudioUrl());

                if (cDto.getSentences() != null) {
                    for (LessonRequestDTO.SentenceRequestDTO sDto : cDto.getSentences()) {
                        Sentence s = new Sentence();
                        s.setConversation(conv); // Gắn cha (Conversation)
                        s.setCharacterName(sDto.getCharacterName());
                        s.setTextEnglish(sDto.getTextEnglish());
                        s.setTextVietnamese(sDto.getTextVietnamese());

                        if (conv.getSentences() == null) conv.setSentences(new java.util.HashSet<>());
                        conv.getSentences().add(s);
                    }
                }

                lesson.getConversations().add(conv);
            }
        }

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    @Transactional
    public PracticeSubmissionResponseDTO submitPractice(Long lessonId, PracticeSubmissionDTO submission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Question question = questionRepository.findById(submission.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + submission.getQuestionId()));
        
        // Verify lesson exists
        if (!lessonRepository.existsById(lessonId)) {
            throw new RuntimeException("Lesson not found with id: " + lessonId);
        }

        // Verify question belongs to this lesson
        if (question.getLesson() == null || !question.getLesson().getId().equals(lessonId)) {
            throw new RuntimeException("Question does not belong to this lesson");
        }

        // Find correct answer
        AnswerOption correctAnswer = null;
        if (question.getAnswerOptions() != null) {
            correctAnswer = question.getAnswerOptions().stream()
                    .filter(AnswerOption::isCorrect)
                    .findFirst()
                    .orElse(null);
        }

        // Check if answer is correct
        boolean isCorrect = false;
        if (submission.getSelectedOptionId() != null && correctAnswer != null) {
            isCorrect = correctAnswer.getId().equals(submission.getSelectedOptionId());
        } else if (submission.getTextAnswer() != null && correctAnswer != null) {
            // For text-based questions, compare text (case-insensitive, trimmed)
            isCorrect = submission.getTextAnswer().trim().equalsIgnoreCase(correctAnswer.getOptionText().trim());
        }

        // Save old Elo for calculating change
        int oldElo = account.getEloRating() != null ? account.getEloRating() : 1000;

        // IMMEDIATELY call processLessonResult to update Elo and Difficulty
        // Treat each question as a mini-lesson: pass if correct, fail if incorrect
        recommendationService.processLessonResult(account.getId(), lessonId, isCorrect);

        // Get updated account to retrieve new Elo
        account = accountRepository.findById(account.getId())
                .orElseThrow(() -> new RuntimeException("Account not found after update"));
        int newElo = account.getEloRating() != null ? account.getEloRating() : 1000;
        int eloChange = newElo - oldElo;

        // Build response
        PracticeSubmissionResponseDTO response = new PracticeSubmissionResponseDTO();
        response.setCorrect(isCorrect);
        if (correctAnswer != null) {
            response.setCorrectAnswerId(correctAnswer.getId());
            response.setCorrectAnswerText(correctAnswer.getOptionText());
        }
        response.setExplanation(question.getExplanation());
        response.setNewElo(newElo);
        response.setEloChange(eloChange);

        return response;
    }

    @Transactional
    public AnswerSubmissionResponseDTO submitAnswer(Long lessonId, AnswerSubmissionDTO submission) {
        // Get current authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        String username = authentication.getName();
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        // Get question and verify lesson exists
        Question question = questionRepository.findById(submission.getQuestionId())
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + submission.getQuestionId()));
        
        // Verify lesson exists
        if (!lessonRepository.existsById(lessonId)) {
            throw new RuntimeException("Lesson not found with id: " + lessonId);
        }

        // Verify question belongs to this lesson
        if (question.getLesson() == null || !question.getLesson().getId().equals(lessonId)) {
            throw new RuntimeException("Question does not belong to this lesson");
        }

        // Find correct answer
        AnswerOption correctAnswer = null;
        if (question.getAnswerOptions() != null) {
            correctAnswer = question.getAnswerOptions().stream()
                    .filter(AnswerOption::isCorrect)
                    .findFirst()
                    .orElse(null);
        }

        // Check if answer is correct
        boolean isCorrect = false;
        if (submission.getSelectedOptionId() != null && correctAnswer != null) {
            // For multiple choice or true/false questions
            isCorrect = correctAnswer.getId().equals(submission.getSelectedOptionId());
        } else if (submission.getTextAnswer() != null && correctAnswer != null) {
            // For fill-in-blank questions, compare text (case-insensitive, trimmed)
            isCorrect = submission.getTextAnswer().trim().equalsIgnoreCase(correctAnswer.getOptionText().trim());
        }

        // Save old Elo for calculating change
        int oldElo = account.getEloRating() != null ? account.getEloRating() : 1000;

        // IMMEDIATELY call processLessonResult to update Elo and Difficulty
        // Treat each question as a mini-lesson: pass if correct, fail if incorrect
        recommendationService.processLessonResult(account.getId(), lessonId, isCorrect);

        // Get updated account to retrieve new Elo
        account = accountRepository.findById(account.getId())
                .orElseThrow(() -> new RuntimeException("Account not found after update"));
        int newElo = account.getEloRating() != null ? account.getEloRating() : 1000;
        int eloChange = newElo - oldElo;

        // Build response
        AnswerSubmissionResponseDTO response = new AnswerSubmissionResponseDTO();
        response.setCorrect(isCorrect);
        response.setNewElo(newElo);
        response.setEloChange(eloChange);
        response.setExplanation(question.getExplanation() != null ? question.getExplanation() : "");
        if (correctAnswer != null) {
            response.setCorrectAnswer(correctAnswer.getOptionText());
        }

        return response;
    }
}