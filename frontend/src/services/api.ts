import axios from 'axios';
import { 
  LoginRequest, 
  LoginResponse, 
  Account, 
  AccountDTO, 
  LessonSummary, 
  LessonDetail, 
  TestSummary, 
  TestDetail, 
  TestSubmission,
  UserLessonProgress,
  UserTestProgress,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  VocabularyProgress,
  PronunciationSample,
  TranslationPayload,
  TranslationResponse,
  UserProgressSummary,
  MediaAsset,
  AdminDashboard
} from '../types';

// Cấu hình axios base URL
const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log error để debug
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    if (error.response?.status === 401 || error.response?.status === 403) {
      // 401: Unauthorized - token không hợp lệ hoặc hết hạn
      // 403: Forbidden - không có quyền truy cập (thường do chưa đăng nhập)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Chỉ redirect nếu không phải đang ở trang login/register
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  login: async (loginRequest: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', loginRequest);
    return response.data;
  },

  register: async (account: Account): Promise<AccountDTO> => {
    const response = await apiClient.post('/auth/register', account);
    return response.data;
  },

  getCurrentUser: async (): Promise<AccountDTO> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Lesson Services
export const lessonService = {
  getAllLessons: async (): Promise<LessonSummary[]> => {
    const response = await apiClient.get('/lessons');
    return response.data;
  },

  getLessonById: async (id: number): Promise<LessonDetail> => {
    const response = await apiClient.get(`/lessons/${id}`);
    return response.data;
  },
};

// Test Services
export const testService = {
  getAllTests: async (): Promise<TestSummary[]> => {
    const response = await apiClient.get('/tests');
    return response.data;
  },

  getTestById: async (id: number): Promise<TestDetail> => {
    const response = await apiClient.get(`/tests/${id}`);
    return response.data;
  },

  submitTest: async (submission: TestSubmission & { timeSpentSeconds?: number }): Promise<{ score: number }> => {
    const response = await apiClient.post('/tests/submit', submission);
    return response.data;
  },
};

// User Progress Services
export const userProgressService = {
  getLessonProgress: async (accountId: number): Promise<UserLessonProgress[]> => {
    const response = await apiClient.get(`/users/${accountId}/progress/lessons`);
    return response.data;
  },

  getTestProgress: async (accountId: number): Promise<UserTestProgress[]> => {
    const response = await apiClient.get(`/users/${accountId}/progress/tests`);
    return response.data;
  },

  getSummary: async (accountId: number): Promise<UserProgressSummary> => {
    const response = await apiClient.get(`/users/${accountId}/progress/summary`);
    return response.data;
  },
};

export const translationService = {
  translate: async (payload: TranslationPayload): Promise<TranslationResponse> => {
    const response = await apiClient.post('/translate', payload);
    return response.data;
  },
};

export const vocabularyProgressService = {
  markRemembered: async (vocabularyId: number, remembered = true): Promise<VocabularyProgress> => {
    const response = await apiClient.post(`/vocabulary-progress/${vocabularyId}/remember`, null, {
      params: { remembered },
    });
    return response.data;
  },
  getLessonProgress: async (lessonId: number): Promise<VocabularyProgress[]> => {
    const response = await apiClient.get(`/vocabulary-progress/lessons/${lessonId}`);
    return response.data;
  },
};

export const pronunciationService = {
  listSamples: async (category?: string): Promise<PronunciationSample[]> => {
    const response = await apiClient.get('/pronunciations', {
      params: category ? { category } : {},
    });
    return response.data;
  },
};

export const progressService = {
  completeLesson: async (payload: { lessonId: number; score: number; isCompleted: boolean; timeSpentSeconds?: number }): Promise<void> => {
    await apiClient.post('/progress/lessons/complete', payload);
  },
};

// Admin Services
export const adminService = {
  getAllUsers: async (): Promise<AccountDTO[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  getDashboard: async (): Promise<AdminDashboard> => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },
};

export const mediaService = {
  upload: async (payload: { file: File; type: 'IMAGE' | 'AUDIO' | 'VIDEO'; category?: string; description?: string }): Promise<MediaAsset> => {
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('type', payload.type);
    if (payload.category) formData.append('category', payload.category);
    if (payload.description) formData.append('description', payload.description);
    const response = await apiClient.post('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  list: async (): Promise<MediaAsset[]> => {
    const response = await apiClient.get('/media');
    return response.data;
  },

  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },
};

// Chatbot Services
export const chatbotService = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/chatbot/send', request);
    return response.data;
  },

  getChatHistory: async (): Promise<ChatMessage[]> => {
    const response = await apiClient.get('/chatbot/history');
    return response.data;
  },
};

export default apiClient;
