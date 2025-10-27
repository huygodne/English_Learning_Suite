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
  UserTestProgress
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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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

  submitTest: async (submission: TestSubmission): Promise<{ score: number }> => {
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
};

// Admin Services
export const adminService = {
  getAllUsers: async (): Promise<AccountDTO[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
};

export default apiClient;
