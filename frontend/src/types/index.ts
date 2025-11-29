// Types cho Authentication
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
}

export interface Account {
  id: number;
  username: string;
  password?: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
}

export interface AccountDTO {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

// Types cho Lessons
export interface LessonSummary {
  id: number;
  lessonNumber: number;
  level: number;
  name: string;
}

export interface LessonDetail {
  id: number;
  lessonNumber: number;
  level: number;
  name: string;
  audioUrl?: string;
  vocabularies: Vocabulary[];
  grammars: Grammar[];
  conversations: Conversation[];
}

// Types cho Vocabulary
export interface Vocabulary {
  id: number;
  wordEnglish: string;
  phoneticSpelling: string;
  vietnameseMeaning: string;
  imageUrl?: string;
  audioUrl?: string;
  exampleSentenceEnglish?: string;
  exampleSentenceVietnamese?: string;
}

// Types cho Grammar
export interface Grammar {
  id: number;
  explanationEnglish: string;
  explanationVietnamese: string;
}

// Types cho Conversation
export interface Conversation {
  id: number;
  title: string;
  audioUrl?: string;
  sentences: Sentence[];
}

export interface Sentence {
  id: number;
  characterName: string;
  textEnglish: string;
  textVietnamese: string;
}

// Types cho Tests
export interface TestSummary {
  id: number;
  name: string;
  level: number;
}

export interface TestDetail {
  id: number;
  name: string;
  level: number;
  audioUrl?: string;
  questions: Question[];
}

export interface Question {
  id: number;
  questionText: string;
  questionType: string;
  imageUrl?: string;
  answerOptions: AnswerOption[];
}

export interface AnswerOption {
  id: number;
  optionText: string;
}

export interface AnswerSubmission {
  questionId: number;
  selectedOptionId: number;
}

export interface TestSubmission {
  testId: number;
  accountId: number;
  answers: AnswerSubmission[];
  timeSpentSeconds?: number;
}

// Types cho Progress
export interface UserLessonProgress {
  id: number;
  accountId: number;
  lessonId: number;
  lessonName: string;
  isCompleted: boolean;
  completedAt?: string;
  timeSpentSeconds?: number;
}

export interface UserTestProgress {
  id: number;
  accountId: number;
  testId: number;
  testName: string;
  score: number;
  completedAt?: string;
  timeSpentSeconds?: number;
}

export interface VocabularyProgress {
  vocabularyId: number;
  remembered: boolean;
  masteryLevel: number;
  reviewCount?: number;
  lastReviewedAt?: string;
}

export interface UserProgressSummary {
  accountId: number;
  totalLessons: number;
  completedLessons: number;
  totalTests: number;
  completedTests: number;
  averageTestScore: number;
  currentStreak: number;
  longestStreak: number;
  lessonTimeSpentSeconds: number;
  testTimeSpentSeconds: number;
  lastLessonCompletedAt?: string;
  lastTestCompletedAt?: string;
}

export interface PronunciationSample {
  id: number;
  category: string;
  term: string;
  ipa: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
}

export interface TranslationResponse {
  translatedText: string;
  provider: string;
  latencyMs: number;
}

export interface TranslationPayload {
  text: string;
  sourceLang: string;
  targetLang: string;
}

export interface MediaAsset {
  id: number;
  originalFilename: string;
  storedFilename: string;
  contentType: string;
  type: 'IMAGE' | 'AUDIO' | 'VIDEO';
  category?: string;
  description?: string;
  publicUrl: string;
  createdAt: string;
}

export interface AdminDashboard {
  totalUsers: number;
  adminUsers: number;
  learnerUsers: number;
  totalLessons: number;
  totalTests: number;
  totalMediaAssets: number;
}

export interface AdminAccountPayload {
  username: string;
  fullName: string;
  password?: string;
  role: 'ADMIN' | 'USER';
}

// Types cho API Response
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Types cho User Context
export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<User>;
  register: (account: Account) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// Types cho Chatbot
export interface ChatMessage {
  id: number;
  messageContent: string;
  sender: 'USER' | 'BOT';
  timestamp: string;
}

export interface ChatRequest {
  userMessage: string;
}

export interface ChatResponse {
  botReply: string;
}

// Request DTOs for Admin
export interface VocabularyRequest {
  wordEnglish: string;
  phoneticSpelling: string;
  vietnameseMeaning: string;
  imageUrl?: string;
  audioUrl?: string;
  exampleSentenceEnglish?: string;
  exampleSentenceVietnamese?: string;
}

export interface GrammarRequest {
  explanationEnglish: string;
  explanationVietnamese: string;
}

export interface SentenceRequest {
  characterName: string;
  textEnglish: string;
  textVietnamese: string;
}

export interface ConversationRequest {
  title: string;
  audioUrl?: string;
  sentences: SentenceRequest[];
}

export interface LessonRequestDTO {
  name: string;
  lessonNumber: number;
  level: number;
  audioUrl?: string;
  vocabularies: VocabularyRequest[];
  grammars: GrammarRequest[];
  conversations: ConversationRequest[];
}

export interface AnswerOptionRequest {
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionRequest {
  questionText: string;
  questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'ARRANGE_SENTENCE';
  imageUrl?: string;
  answerOptions: AnswerOptionRequest[];
}

export interface TestRequestDTO {
  name: string;
  level: number;
  audioUrl?: string;
  questions: QuestionRequest[];
}

// Statistics Types
export interface StatisticsDTO {
  totalUsers: number;
  activeUsers: number;
  totalLessons: number;
  totalTests: number;
  totalMediaAssets: number;
  totalLessonCompletions: number;
  averageLessonScore: number;
  totalLessonTimeSpent: number;
  lessonCompletionsByLevel: Record<number, number>;
  totalTestCompletions: number;
  averageTestScore: number;
  totalTestTimeSpent: number;
  testCompletionsByLevel: Record<number, number>;
  topLessons: LessonStatisticsDTO[];
  topTests: TestStatisticsDTO[];
  topUsers: UserStatisticsDTO[];
}

export interface LessonStatisticsDTO {
  lessonId: number;
  lessonName: string;
  lessonNumber: number;
  level: number;
  completionCount: number;
  averageScore: number;
}

export interface TestStatisticsDTO {
  testId: number;
  testName: string;
  level: number;
  completionCount: number;
  averageScore: number;
}

export interface UserStatisticsDTO {
  userId: number;
  username: string;
  fullName: string;
  completedLessons: number;
  completedTests: number;
  averageTestScore: number;
  xp: number;
}

// Detailed Statistics Types
export interface DetailedStatisticsDTO {
  userGrowth: TimeSeriesData[];
  lessonCompletionsOverTime: TimeSeriesData[];
  testCompletionsOverTime: TimeSeriesData[];
  dailyActiveUsers: TimeSeriesData[];
  averageStudyTimePerDay: TimeSeriesData[];
  lessonCompletionsByLevel: Record<number, number>;
  testCompletionsByLevel: Record<number, number>;
  popularLessons: PopularItemDTO[];
  popularTests: PopularItemDTO[];
  engagementMetrics: EngagementMetricsDTO;
  studyFrequencyDistribution: Record<string, number>;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface PopularItemDTO {
  id: number;
  name: string;
  level: number;
  completionCount: number;
  averageScore: number;
  totalTimeSpent: number;
}

export interface EngagementMetricsDTO {
  averageStudyHoursPerDay: number;
  averageStudyDaysPerWeek: number;
  totalActiveDays: number;
  retentionRate: number;
  peakConcurrentUsers: number;
}