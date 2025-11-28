import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService, mediaService, lessonService, testService } from '../services/api';
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  AccountDTO, 
  AdminDashboard, 
  MediaAsset,
  LessonSummary,
  LessonDetail,
  TestSummary,
  TestDetail,
  LessonRequestDTO,
  TestRequestDTO,
  VocabularyRequest,
  GrammarRequest,
  ConversationRequest,
  SentenceRequest,
  QuestionRequest,
  AnswerOptionRequest,
  StatisticsDTO,
  DetailedStatisticsDTO,
  AdminAccountPayload
} from '../types';
import ScenicBackground from '../components/ScenicBackground';

const AdminPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<AccountDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [mediaError, setMediaError] = useState('');
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaForm, setMediaForm] = useState({
    type: 'IMAGE' as 'IMAGE' | 'AUDIO' | 'VIDEO',
    category: '',
    description: ''
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormError, setUserFormError] = useState('');
  const [savingUser, setSavingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [userForm, setUserForm] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'USER' as 'ADMIN' | 'USER',
  });

  // Lessons management
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonRequestDTO>({
    name: '',
    lessonNumber: 1,
    level: 1,
    audioUrl: '',
    vocabularies: [],
    grammars: [],
    conversations: []
  });
  const [lessonFormError, setLessonFormError] = useState('');
  const [savingLesson, setSavingLesson] = useState(false);

  // Tests management
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTestId, setEditingTestId] = useState<number | null>(null);
  const [testForm, setTestForm] = useState<TestRequestDTO>({
    name: '',
    level: 1,
    audioUrl: '',
    questions: []
  });
  const [testFormError, setTestFormError] = useState('');
  const [savingTest, setSavingTest] = useState(false);
  const [activeManagementTab, setActiveManagementTab] = useState<'lessons' | 'tests' | 'statistics' | null>(null);
  const [statistics, setStatistics] = useState<StatisticsDTO | null>(null);
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [detailedStatistics, setDetailedStatistics] = useState<DetailedStatisticsDTO | null>(null);
  const [loadingDetailedStatistics, setLoadingDetailedStatistics] = useState(false);

  const totalUsersCount = dashboard?.totalUsers ?? users.length;
  const adminCount = dashboard?.adminUsers ?? users.filter(u => u.role === 'ADMIN').length;
  const learnerCount = dashboard?.learnerUsers ?? (totalUsersCount - adminCount);
  const totalLessonsCount = dashboard?.totalLessons ?? 0;
  const totalTestsCount = dashboard?.totalTests ?? 0;
  const totalMediaCount = dashboard?.totalMediaAssets ?? mediaAssets.length;

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải danh sách người dùng');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, dashboardData, mediaData, lessonsData, testsData] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getDashboard(),
          mediaService.list(),
          lessonService.getAllLessons(),
          testService.getAllTests()
        ]);
        setUsers(usersData);
        setDashboard(dashboardData);
        setMediaAssets(mediaData);
        setLessons(lessonsData);
        setTests(testsData);
      } catch (err: any) {
        setError('Không thể tải dữ liệu quản trị');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tự động load detailed statistics khi vào tab statistics
  useEffect(() => {
    if (activeManagementTab === 'statistics' && !detailedStatistics && !loadingDetailedStatistics) {
      loadDetailedStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeManagementTab]);

  const refreshMedia = async () => {
    try {
      const assets = await mediaService.list();
      setMediaAssets(assets);
    } catch (err) {
      setMediaError('Không thể tải danh sách media');
    }
  };

  const handleUploadMedia = async (event: React.FormEvent) => {
    event.preventDefault();
    setMediaError('');
    if (!selectedFile) {
      setMediaError('Vui lòng chọn file tải lên');
      return;
    }
    try {
      setUploadingMedia(true);
      await mediaService.upload({
        file: selectedFile,
        type: mediaForm.type,
        category: mediaForm.category,
        description: mediaForm.description
      });
      setSelectedFile(null);
      setMediaForm((prev) => ({ ...prev, description: '' }));
      await refreshMedia();
    } catch (err) {
      setMediaError('Không thể tải lên file.');
      console.error(err);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleDeleteMedia = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa nội dung này?')) return;
    try {
      await mediaService.remove(id);
      await refreshMedia();
    } catch (err) {
      setMediaError('Không thể xóa nội dung.');
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const openCreateUserModal = () => {
    setEditingUserId(null);
    setUserForm({
      username: '',
      fullName: '',
      password: '',
      role: 'USER'
    });
    setUserFormError('');
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (account: AccountDTO) => {
    setEditingUserId(account.id);
    setUserForm({
      username: account.username,
      fullName: account.fullName,
      password: '',
      role: account.role as 'ADMIN' | 'USER'
    });
    setUserFormError('');
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSavingUser(false);
    setUserFormError('');
  };

  const handleUserFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setUserFormError('');
    if (!userForm.username.trim() || !userForm.fullName.trim()) {
      setUserFormError('Vui lòng nhập đầy đủ tên đăng nhập và họ tên');
      return;
    }
    if (!editingUserId && !userForm.password.trim()) {
      setUserFormError('Vui lòng nhập mật khẩu cho người dùng mới');
      return;
    }
    try {
      setSavingUser(true);
      if (editingUserId) {
        const payload: Partial<AdminAccountPayload> = {
          username: userForm.username.trim(),
          fullName: userForm.fullName.trim(),
          role: userForm.role,
        };
        if (userForm.password.trim()) {
          payload.password = userForm.password.trim();
        }
        await adminService.updateUser(editingUserId, payload);
      } else {
        await adminService.createUser({
          username: userForm.username.trim(),
          fullName: userForm.fullName.trim(),
          password: userForm.password.trim(),
          role: userForm.role,
        });
      }
      await loadUsers();
      closeUserModal();
    } catch (err: any) {
      setUserFormError(err?.response?.data?.message || 'Không thể lưu người dùng');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      await adminService.deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError('Không thể xóa người dùng');
    }
  };

  // Lesson management functions
  const loadLessons = async () => {
    try {
      const data = await lessonService.getAllLessons();
      setLessons(data);
    } catch (err) {
      setError('Không thể tải danh sách bài học');
    }
  };

  const openCreateLessonModal = () => {
    setEditingLessonId(null);
    setLessonForm({
      name: '',
      lessonNumber: 1,
      level: 1,
      audioUrl: '',
      vocabularies: [],
      grammars: [],
      conversations: []
    });
    setLessonFormError('');
    setIsLessonModalOpen(true);
  };

  const openEditLessonModal = async (id: number) => {
    try {
      const lesson = await lessonService.getLessonById(id);
      setEditingLessonId(id);
      setLessonForm({
        name: lesson.name,
        lessonNumber: lesson.lessonNumber,
        level: lesson.level,
        audioUrl: lesson.audioUrl || '',
        vocabularies: lesson.vocabularies.map(v => ({
          wordEnglish: v.wordEnglish,
          phoneticSpelling: v.phoneticSpelling,
          vietnameseMeaning: v.vietnameseMeaning,
          imageUrl: v.imageUrl,
          audioUrl: v.audioUrl,
          exampleSentenceEnglish: v.exampleSentenceEnglish,
          exampleSentenceVietnamese: v.exampleSentenceVietnamese
        })),
        grammars: lesson.grammars.map(g => ({
          explanationEnglish: g.explanationEnglish,
          explanationVietnamese: g.explanationVietnamese
        })),
        conversations: lesson.conversations.map(c => ({
          title: c.title,
          audioUrl: c.audioUrl,
          sentences: c.sentences.map(s => ({
            characterName: s.characterName,
            textEnglish: s.textEnglish,
            textVietnamese: s.textVietnamese
          }))
        }))
      });
      setLessonFormError('');
      setIsLessonModalOpen(true);
    } catch (err) {
      setError('Không thể tải thông tin bài học');
    }
  };

  const closeLessonModal = () => {
    setIsLessonModalOpen(false);
    setSavingLesson(false);
    setLessonFormError('');
  };

  const handleLessonFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLessonFormError('');
    if (!lessonForm.name.trim()) {
      setLessonFormError('Vui lòng nhập tên bài học');
      return;
    }
    try {
      setSavingLesson(true);
      if (editingLessonId) {
        await lessonService.updateLesson(editingLessonId, lessonForm);
      } else {
        await lessonService.createLesson(lessonForm);
      }
      await loadLessons();
      const dashboardData = await adminService.getDashboard();
      setDashboard(dashboardData);
      closeLessonModal();
    } catch (err: any) {
      setLessonFormError(err?.response?.data?.message || 'Không thể lưu bài học');
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này? Tất cả từ vựng, ngữ pháp và hội thoại sẽ bị xóa.')) return;
    try {
      await lessonService.deleteLesson(id);
      await loadLessons();
      const dashboardData = await adminService.getDashboard();
      setDashboard(dashboardData);
    } catch (err) {
      setError('Không thể xóa bài học');
    }
  };

  // Test management functions
  const loadTests = async () => {
    try {
      const data = await testService.getAllTests();
      setTests(data);
    } catch (err) {
      setError('Không thể tải danh sách bài kiểm tra');
    }
  };

  const openCreateTestModal = () => {
    setEditingTestId(null);
    setTestForm({
      name: '',
      level: 1,
      audioUrl: '',
      questions: []
    });
    setTestFormError('');
    setIsTestModalOpen(true);
  };

  const openEditTestModal = async (id: number) => {
    try {
      const test = await testService.getTestById(id);
      setEditingTestId(id);
      // Note: We need to reconstruct with isCorrect flags, but backend doesn't return them
      // So we'll need to handle this differently - for now, we'll just load the basic structure
      setTestForm({
        name: test.name,
        level: test.level,
        audioUrl: test.audioUrl || '',
        questions: test.questions.map(q => ({
          questionText: q.questionText,
          questionType: q.questionType as any,
          imageUrl: q.imageUrl,
          answerOptions: q.answerOptions.map(ao => ({
            optionText: ao.optionText,
            isCorrect: false // Backend doesn't return this, so we'll need to handle it
          }))
        }))
      });
      setTestFormError('');
      setIsTestModalOpen(true);
    } catch (err) {
      setError('Không thể tải thông tin bài kiểm tra');
    }
  };

  const closeTestModal = () => {
    setIsTestModalOpen(false);
    setSavingTest(false);
    setTestFormError('');
  };

  const handleTestFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTestFormError('');
    if (!testForm.name.trim()) {
      setTestFormError('Vui lòng nhập tên bài kiểm tra');
      return;
    }
    if (testForm.questions.length === 0) {
      setTestFormError('Vui lòng thêm ít nhất một câu hỏi');
      return;
    }
    try {
      setSavingTest(true);
      if (editingTestId) {
        await testService.updateTest(editingTestId, testForm);
      } else {
        await testService.createTest(testForm);
      }
      await loadTests();
      const dashboardData = await adminService.getDashboard();
      setDashboard(dashboardData);
      closeTestModal();
    } catch (err: any) {
      setTestFormError(err?.response?.data?.message || 'Không thể lưu bài kiểm tra');
    } finally {
      setSavingTest(false);
    }
  };

  const handleDeleteTest = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài kiểm tra này? Tất cả câu hỏi sẽ bị xóa.')) return;
    try {
      await testService.deleteTest(id);
      await loadTests();
      const dashboardData = await adminService.getDashboard();
      setDashboard(dashboardData);
    } catch (err) {
      setError('Không thể xóa bài kiểm tra');
    }
  };

  // Statistics functions
  const loadDetailedStatistics = async () => {
    setLoadingDetailedStatistics(true);
    try {
      const data = await adminService.getDetailedStatistics();
      setDetailedStatistics(data);
    } catch (err) {
      console.error('Error loading detailed statistics:', err);
    } finally {
      setLoadingDetailedStatistics(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setLoadingStatistics(true);
      const data = await adminService.getStatistics();
      setStatistics(data);
    } catch (err) {
      setError('Không thể tải thống kê');
    } finally {
      setLoadingStatistics(false);
    }
  };

  const handleViewStatistics = () => {
    setActiveManagementTab('statistics');
    if (!statistics) {
      loadStatistics();
    }
    if (!detailedStatistics) {
      loadDetailedStatistics();
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <ScenicBackground variant="meadow" />
      {/* Header */}
      <header className="glass shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                English Learning Suite
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-primary-600 px-3 py-2 text-sm font-medium">
                Trang chủ
              </Link>
              <Link to="/lessons" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Bài học
              </Link>
              <Link to="/tests" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Kiểm tra
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Hồ sơ
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <button 
                onClick={logout}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản trị hệ thống</h1>
          <p className="text-gray-600">Quản lý người dùng và nội dung học tập</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {totalUsersCount}
            </div>
            <div className="text-gray-600">Tổng người dùng</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-secondary-600 mb-2">
              {adminCount}
            </div>
            <div className="text-gray-600">Quản trị viên</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {learnerCount}
            </div>
            <div className="text-gray-600">Người dùng</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {totalLessonsCount}
            </div>
            <div className="text-gray-600">Bài học</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">
              {totalTestsCount}
            </div>
            <div className="text-gray-600">Bài kiểm tra</div>
          </div>

          <div className="card text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {totalMediaCount}
            </div>
            <div className="text-gray-600">Kho media</div>
          </div>
        </div>

        {/* User Management */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h2>
            <button className="btn-primary" onClick={openCreateUserModal}>
              Thêm người dùng
            </button>
          </div>

          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên đăng nhập
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Họ và tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((account) => (
                    <tr key={account.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          account.role === 'ADMIN' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {account.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-primary-600 hover:text-primary-900 mr-4"
                          onClick={() => openEditUserModal(account)}
                        >
                          Sửa
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteUser(account.id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có người dùng</h3>
              <p className="text-gray-600">Hiện tại chưa có người dùng nào trong hệ thống.</p>
            </div>
          )}
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="card hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý bài học</h3>
              <p className="text-gray-600 mb-4">Thêm, sửa, xóa bài học</p>
              <button 
                className="btn-primary"
                onClick={() => setActiveManagementTab('lessons')}
              >
                Quản lý
              </button>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quản lý bài kiểm tra</h3>
              <p className="text-gray-600 mb-4">Thêm, sửa, xóa bài kiểm tra</p>
              <button 
                className="btn-secondary"
                onClick={() => setActiveManagementTab('tests')}
              >
                Quản lý
              </button>
            </div>
          </div>

          <div className="card hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thống kê</h3>
              <p className="text-gray-600 mb-4">Xem báo cáo và thống kê</p>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                onClick={handleViewStatistics}
              >
                Xem báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Lessons Management */}
        {activeManagementTab === 'lessons' && (
          <div className="card mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý bài học</h2>
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => setActiveManagementTab(null)}
                >
                  Đóng
                </button>
                <button className="btn-primary" onClick={openCreateLessonModal}>
                  Thêm bài học
                </button>
              </div>
            </div>

            {lessons.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số bài
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên bài học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cấp độ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lesson.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lesson.lessonNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lesson.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {lesson.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-primary-600 hover:text-primary-900 mr-4"
                            onClick={() => openEditLessonModal(lesson.id)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteLesson(lesson.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có bài học nào.</p>
              </div>
            )}
          </div>
        )}

        {/* Tests Management */}
        {activeManagementTab === 'tests' && (
          <div className="card mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quản lý bài kiểm tra</h2>
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => setActiveManagementTab(null)}
                >
                  Đóng
                </button>
                <button className="btn-secondary" onClick={openCreateTestModal}>
                  Thêm bài kiểm tra
                </button>
              </div>
            </div>

            {tests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên bài kiểm tra
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cấp độ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tests.map((test) => (
                      <tr key={test.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-primary-600 hover:text-primary-900 mr-4"
                            onClick={() => openEditTestModal(test.id)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteTest(test.id)}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có bài kiểm tra nào.</p>
              </div>
            )}
          </div>
        )}

        {/* Statistics Management */}
        {activeManagementTab === 'statistics' && (
          <div className="card mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Thống kê hệ thống</h2>
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => setActiveManagementTab(null)}
                >
                  Đóng
                </button>
                <button 
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  onClick={() => {
                    loadStatistics();
                    loadDetailedStatistics();
                  }}
                  disabled={loadingStatistics || loadingDetailedStatistics}
                >
                  {loadingStatistics || loadingDetailedStatistics ? 'Đang tải...' : 'Làm mới'}
                </button>
              </div>
            </div>

            {loadingStatistics ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải thống kê...</p>
              </div>
            ) : statistics ? (
              <div className="space-y-6">
                {/* Tổng quan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-1">Tổng người dùng</div>
                    <div className="text-2xl font-bold text-blue-900">{statistics.totalUsers}</div>
                    <div className="text-xs text-blue-600 mt-1">Hoạt động: {statistics.activeUsers}</div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <div className="text-sm text-orange-600 font-medium mb-1">Tổng bài học</div>
                    <div className="text-2xl font-bold text-orange-900">{statistics.totalLessons}</div>
                    <div className="text-xs text-orange-600 mt-1">Đã hoàn thành: {statistics.totalLessonCompletions}</div>
                  </div>
                  <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <div className="text-sm text-pink-600 font-medium mb-1">Tổng bài kiểm tra</div>
                    <div className="text-2xl font-bold text-pink-900">{statistics.totalTests}</div>
                    <div className="text-xs text-pink-600 mt-1">Đã hoàn thành: {statistics.totalTestCompletions}</div>
                  </div>
                  <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                    <div className="text-sm text-indigo-600 font-medium mb-1">Kho media</div>
                    <div className="text-2xl font-bold text-indigo-900">{statistics.totalMediaAssets}</div>
                  </div>
                </div>

                {/* Thống kê bài học */}
                <div className="border rounded-lg p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Thống kê bài học</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Điểm trung bình</div>
                      <div className="text-2xl font-bold text-gray-900">{statistics.averageLessonScore.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tổng thời gian học</div>
                      <div className="text-2xl font-bold text-gray-900">{formatTime(statistics.totalLessonTimeSpent)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Hoàn thành theo cấp độ</div>
                      <div className="mt-2 space-y-1">
                        {Object.entries(statistics.lessonCompletionsByLevel).map(([level, count]) => (
                          <div key={level} className="text-sm">
                            <span className="font-medium">Cấp {level}:</span> <span className="text-gray-600">{count} bài</span>
                          </div>
                        ))}
                        {Object.keys(statistics.lessonCompletionsByLevel).length === 0 && (
                          <div className="text-sm text-gray-400">Chưa có dữ liệu</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {statistics.topLessons.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Top bài học phổ biến</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Tên bài học</th>
                              <th className="px-4 py-2 text-left">Cấp độ</th>
                              <th className="px-4 py-2 text-center">Số lần hoàn thành</th>
                              <th className="px-4 py-2 text-center">Điểm TB</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {statistics.topLessons.map((lesson) => (
                              <tr key={lesson.lessonId}>
                                <td className="px-4 py-2">{lesson.lessonName}</td>
                                <td className="px-4 py-2">Cấp {lesson.level}</td>
                                <td className="px-4 py-2 text-center">{lesson.completionCount}</td>
                                <td className="px-4 py-2 text-center">{lesson.averageScore.toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Thống kê bài kiểm tra */}
                <div className="border rounded-lg p-6 bg-white">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Thống kê bài kiểm tra</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Điểm trung bình</div>
                      <div className="text-2xl font-bold text-gray-900">{statistics.averageTestScore.toFixed(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Tổng thời gian làm bài</div>
                      <div className="text-2xl font-bold text-gray-900">{formatTime(statistics.totalTestTimeSpent)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Hoàn thành theo cấp độ</div>
                      <div className="mt-2 space-y-1">
                        {Object.entries(statistics.testCompletionsByLevel).map(([level, count]) => (
                          <div key={level} className="text-sm">
                            <span className="font-medium">Cấp {level}:</span> <span className="text-gray-600">{count} bài</span>
                          </div>
                        ))}
                        {Object.keys(statistics.testCompletionsByLevel).length === 0 && (
                          <div className="text-sm text-gray-400">Chưa có dữ liệu</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {statistics.topTests.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Top bài kiểm tra phổ biến</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left">Tên bài kiểm tra</th>
                              <th className="px-4 py-2 text-left">Cấp độ</th>
                              <th className="px-4 py-2 text-center">Số lần hoàn thành</th>
                              <th className="px-4 py-2 text-center">Điểm TB</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {statistics.topTests.map((test) => (
                              <tr key={test.testId}>
                                <td className="px-4 py-2">{test.testName}</td>
                                <td className="px-4 py-2">Cấp {test.level}</td>
                                <td className="px-4 py-2 text-center">{test.completionCount}</td>
                                <td className="px-4 py-2 text-center">{test.averageScore.toFixed(1)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Top người dùng */}
                {statistics.topUsers.length > 0 && (
                  <div className="border rounded-lg p-6 bg-white">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Top người dùng tích cực</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Tên đăng nhập</th>
                            <th className="px-4 py-2 text-left">Họ và tên</th>
                            <th className="px-4 py-2 text-center">Bài học đã hoàn thành</th>
                            <th className="px-4 py-2 text-center">Bài kiểm tra đã làm</th>
                            <th className="px-4 py-2 text-center">Điểm TB bài kiểm tra</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {statistics.topUsers.map((user) => (
                            <tr key={user.userId}>
                              <td className="px-4 py-2">{user.username}</td>
                              <td className="px-4 py-2">{user.fullName}</td>
                              <td className="px-4 py-2 text-center">{user.completedLessons}</td>
                              <td className="px-4 py-2 text-center">{user.completedTests}</td>
                              <td className="px-4 py-2 text-center">{user.averageTestScore.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Detailed Analytics với biểu đồ */}
                <div className="mt-8 border-t pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Phân tích chi tiết (30 ngày gần nhất)</h3>
                    <button
                      onClick={loadDetailedStatistics}
                      disabled={loadingDetailedStatistics}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingDetailedStatistics ? 'Đang tải...' : 'Làm mới'}
                    </button>
                  </div>
                  
                  {loadingDetailedStatistics ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Đang tải phân tích chi tiết...</p>
                    </div>
                  ) : detailedStatistics ? (
                    <div className="space-y-6">
                      {/* Engagement Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <div className="text-sm text-blue-600 font-medium mb-1">Giờ học TB/ngày</div>
                        <div className="text-2xl font-bold text-blue-900">
                          {detailedStatistics.engagementMetrics.averageStudyHoursPerDay.toFixed(2)}h
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <div className="text-sm text-green-600 font-medium mb-1">Ngày học TB/tuần</div>
                        <div className="text-2xl font-bold text-green-900">
                          {detailedStatistics.engagementMetrics.averageStudyDaysPerWeek.toFixed(1)}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <div className="text-sm text-purple-600 font-medium mb-1">Tỷ lệ giữ chân</div>
                        <div className="text-2xl font-bold text-purple-900">
                          {detailedStatistics.engagementMetrics.retentionRate.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                        <div className="text-sm text-orange-600 font-medium mb-1">Ngày hoạt động</div>
                        <div className="text-2xl font-bold text-orange-900">
                          {detailedStatistics.engagementMetrics.totalActiveDays}
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4 border border-pink-200">
                        <div className="text-sm text-pink-600 font-medium mb-1">User cao nhất/ngày</div>
                        <div className="text-2xl font-bold text-pink-900">
                          {detailedStatistics.engagementMetrics.peakConcurrentUsers}
                        </div>
                      </div>
                    </div>

                    {/* Biểu đồ 1: Tổng quan hoạt động - Kết hợp nhiều metrics theo thời gian */}
                    <div className="border rounded-lg p-6 bg-white">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Tổng quan hoạt động hệ thống (30 ngày gần nhất)
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Biểu đồ kết hợp: Tăng trưởng người dùng, Hoàn thành bài học, Hoàn thành bài kiểm tra, Người dùng hoạt động hàng ngày
                      </p>
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart 
                          data={detailedStatistics.userGrowth.map((ug, index) => {
                            const lessonData = detailedStatistics.lessonCompletionsOverTime[index] || { value: 0 };
                            const testData = detailedStatistics.testCompletionsOverTime[index] || { value: 0 };
                            const dauData = detailedStatistics.dailyActiveUsers[index] || { value: 0 };
                            return {
                              date: ug.label || ug.date,
                              userGrowth: ug.value,
                              lessonCompletions: lessonData.value,
                              testCompletions: testData.value,
                              dailyActiveUsers: dauData.value
                            };
                          })}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval="preserveStartEnd"
                          />
                          <YAxis yAxisId="left" label={{ value: 'Số lượng', angle: -90, position: 'insideLeft' }} />
                          <YAxis yAxisId="right" orientation="right" label={{ value: 'Người dùng', angle: 90, position: 'insideRight' }} />
                          <Tooltip 
                            formatter={(value: number, name: string) => {
                              if (name === 'dailyActiveUsers') return [value, 'Người dùng hoạt động'];
                              if (name === 'userGrowth') return [value, 'Người dùng mới'];
                              if (name === 'lessonCompletions') return [value, 'Bài học hoàn thành'];
                              if (name === 'testCompletions') return [value, 'Bài kiểm tra hoàn thành'];
                              return [value, name];
                            }}
                          />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="userGrowth" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            name="Người dùng mới"
                            dot={{ r: 3 }}
                          />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="lessonCompletions" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            name="Bài học hoàn thành"
                            dot={{ r: 3 }}
                          />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="testCompletions" 
                            stroke="#ec4899" 
                            strokeWidth={2}
                            name="Bài kiểm tra hoàn thành"
                            dot={{ r: 3 }}
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="dailyActiveUsers" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            name="Người dùng hoạt động/ngày"
                            dot={{ r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Biểu đồ 2: Phân tích hiệu suất - Combo chart kết hợp nhiều metrics */}
                    <div className="border rounded-lg p-6 bg-white">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Phân tích hiệu suất học tập & Phân bố theo cấp độ
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Biểu đồ kết hợp: Người dùng hoạt động (cột), Thời gian học trung bình (đường), Phân bố bài học/kiểm tra theo cấp độ
                      </p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Combo Chart: Daily Active Users + Average Study Time */}
                        <div>
                          <h5 className="text-md font-medium text-gray-700 mb-3">Hoạt động & Thời gian học</h5>
                          <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart 
                              data={detailedStatistics.dailyActiveUsers.map((dau, index) => {
                                const studyTime = detailedStatistics.averageStudyTimePerDay[index] || { value: 0 };
                                // Convert seconds to hours (value is in seconds, divide by 3600)
                                const studyTimeHours = typeof studyTime.value === 'number' ? (studyTime.value / 3600) : 0;
                                return {
                                  date: dau.label || dau.date,
                                  activeUsers: dau.value,
                                  studyTimeHours: Number(studyTimeHours.toFixed(2))
                                };
                              })}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                angle={-45}
                                textAnchor="end"
                                height={80}
                                interval="preserveStartEnd"
                              />
                              <YAxis yAxisId="left" label={{ value: 'Người dùng', angle: -90, position: 'insideLeft' }} />
                              <YAxis yAxisId="right" orientation="right" label={{ value: 'Giờ học', angle: 90, position: 'insideRight' }} />
                              <Tooltip 
                                formatter={(value: number | string, name: string) => {
                                  if (name === 'activeUsers') return [value, 'Người dùng hoạt động'];
                                  if (name === 'studyTimeHours') return [`${Number(value).toFixed(2)}h`, 'Thời gian học TB'];
                                  return [value, name];
                                }}
                              />
                              <Legend />
                              <Bar 
                                yAxisId="left"
                                dataKey="activeUsers" 
                                fill="#10b981" 
                                name="Người dùng hoạt động"
                              />
                              <Line 
                                yAxisId="right"
                                type="monotone" 
                                dataKey="studyTimeHours" 
                                stroke="#8b5cf6" 
                                strokeWidth={2}
                                name="Thời gian học TB (giờ)"
                                dot={{ r: 4 }}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Grouped Bar Chart: Completions by Level */}
                        <div>
                          <h5 className="text-md font-medium text-gray-700 mb-3">Hoàn thành theo cấp độ</h5>
                          <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart 
                              data={Object.keys({
                                ...detailedStatistics.lessonCompletionsByLevel,
                                ...detailedStatistics.testCompletionsByLevel
                              }).map(level => ({
                                level: `Cấp ${level}`,
                                lessons: detailedStatistics.lessonCompletionsByLevel[parseInt(level)] || 0,
                                tests: detailedStatistics.testCompletionsByLevel[parseInt(level)] || 0
                              }))}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="level" />
                              <YAxis label={{ value: 'Số lần hoàn thành', angle: -90, position: 'insideLeft' }} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="lessons" fill="#f59e0b" name="Bài học" />
                              <Bar dataKey="tests" fill="#ec4899" name="Bài kiểm tra" />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                  ) : (
                    <div className="text-center py-12 border rounded-lg bg-gray-50">
                      <p className="text-gray-500 mb-4">Chưa có dữ liệu phân tích chi tiết.</p>
                      <button
                        onClick={loadDetailedStatistics}
                        disabled={loadingDetailedStatistics}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm disabled:opacity-50"
                      >
                        {loadingDetailedStatistics ? 'Đang tải...' : 'Tải dữ liệu phân tích'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Chưa có dữ liệu thống kê.</p>
              </div>
            )}
          </div>
        )}

      </main>
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingUserId ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button onClick={closeUserModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            {userFormError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm mb-4">
                {userFormError}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleUserFormSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  disabled={savingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={userForm.fullName}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  disabled={savingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingUserId ? 'Mật khẩu (để trống nếu không đổi)' : 'Mật khẩu'}
                </label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  disabled={savingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm((prev) => ({ ...prev, role: e.target.value as 'ADMIN' | 'USER' }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  disabled={savingUser}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUserModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={savingUser}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
                  disabled={savingUser}
                >
                  {savingUser ? 'Đang lưu...' : editingUserId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingLessonId ? 'Cập nhật bài học' : 'Thêm bài học mới'}
              </h3>
              <button onClick={closeLessonModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            {lessonFormError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm mb-4">
                {lessonFormError}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleLessonFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài học *</label>
                  <input
                    type="text"
                    value={lessonForm.name}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                    disabled={savingLesson}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số bài học *</label>
                  <input
                    type="number"
                    value={lessonForm.lessonNumber}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, lessonNumber: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                    disabled={savingLesson}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ *</label>
                  <select
                    value={lessonForm.level}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                    disabled={savingLesson}
                    required
                  >
                    <option value={1}>1 - Dễ</option>
                    <option value={2}>2 - Trung bình</option>
                    <option value={3}>3 - Khó</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio</label>
                  <input
                    type="text"
                    value={lessonForm.audioUrl}
                    onChange={(e) => setLessonForm(prev => ({ ...prev, audioUrl: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                    disabled={savingLesson}
                    placeholder="https://example.com/audio/lesson1.mp3"
                  />
                </div>
              </div>

              {/* Vocabularies Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">Từ vựng</h4>
                  <button
                    type="button"
                    onClick={() => setLessonForm(prev => ({
                      ...prev,
                      vocabularies: [...prev.vocabularies, {
                        wordEnglish: '',
                        phoneticSpelling: '',
                        vietnameseMeaning: '',
                        imageUrl: '',
                        audioUrl: '',
                        exampleSentenceEnglish: '',
                        exampleSentenceVietnamese: ''
                      }]
                    }))}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    + Thêm từ vựng
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {lessonForm.vocabularies.map((vocab, idx) => (
                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Từ vựng #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setLessonForm(prev => ({
                            ...prev,
                            vocabularies: prev.vocabularies.filter((_, i) => i !== idx)
                          }))}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Từ tiếng Anh"
                          value={vocab.wordEnglish}
                          onChange={(e) => {
                            const newVocabs = [...lessonForm.vocabularies];
                            newVocabs[idx].wordEnglish = e.target.value;
                            setLessonForm(prev => ({ ...prev, vocabularies: newVocabs }));
                          }}
                          className="px-3 py-1 text-sm rounded border border-slate-200"
                        />
                        <input
                          type="text"
                          placeholder="Phiên âm"
                          value={vocab.phoneticSpelling}
                          onChange={(e) => {
                            const newVocabs = [...lessonForm.vocabularies];
                            newVocabs[idx].phoneticSpelling = e.target.value;
                            setLessonForm(prev => ({ ...prev, vocabularies: newVocabs }));
                          }}
                          className="px-3 py-1 text-sm rounded border border-slate-200"
                        />
                        <input
                          type="text"
                          placeholder="Nghĩa tiếng Việt"
                          value={vocab.vietnameseMeaning}
                          onChange={(e) => {
                            const newVocabs = [...lessonForm.vocabularies];
                            newVocabs[idx].vietnameseMeaning = e.target.value;
                            setLessonForm(prev => ({ ...prev, vocabularies: newVocabs }));
                          }}
                          className="px-3 py-1 text-sm rounded border border-slate-200"
                        />
                        <input
                          type="text"
                          placeholder="URL ảnh"
                          value={vocab.imageUrl || ''}
                          onChange={(e) => {
                            const newVocabs = [...lessonForm.vocabularies];
                            newVocabs[idx].imageUrl = e.target.value;
                            setLessonForm(prev => ({ ...prev, vocabularies: newVocabs }));
                          }}
                          className="px-3 py-1 text-sm rounded border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grammars Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">Ngữ pháp</h4>
                  <button
                    type="button"
                    onClick={() => setLessonForm(prev => ({
                      ...prev,
                      grammars: [...prev.grammars, {
                        explanationEnglish: '',
                        explanationVietnamese: ''
                      }]
                    }))}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    + Thêm ngữ pháp
                  </button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {lessonForm.grammars.map((grammar, idx) => (
                    <div key={idx} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Ngữ pháp #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setLessonForm(prev => ({
                            ...prev,
                            grammars: prev.grammars.filter((_, i) => i !== idx)
                          }))}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Giải thích tiếng Anh"
                          value={grammar.explanationEnglish}
                          onChange={(e) => {
                            const newGrammars = [...lessonForm.grammars];
                            newGrammars[idx].explanationEnglish = e.target.value;
                            setLessonForm(prev => ({ ...prev, grammars: newGrammars }));
                          }}
                          className="w-full px-3 py-1 text-sm rounded border border-slate-200"
                        />
                        <input
                          type="text"
                          placeholder="Giải thích tiếng Việt"
                          value={grammar.explanationVietnamese}
                          onChange={(e) => {
                            const newGrammars = [...lessonForm.grammars];
                            newGrammars[idx].explanationVietnamese = e.target.value;
                            setLessonForm(prev => ({ ...prev, grammars: newGrammars }));
                          }}
                          className="w-full px-3 py-1 text-sm rounded border border-slate-200"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversations Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">Hội thoại</h4>
                  <button
                    type="button"
                    onClick={() => setLessonForm(prev => ({
                      ...prev,
                      conversations: [...prev.conversations, {
                        title: '',
                        audioUrl: '',
                        sentences: []
                      }]
                    }))}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    + Thêm hội thoại
                  </button>
                </div>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {lessonForm.conversations.map((conv, convIdx) => (
                    <div key={convIdx} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Hội thoại #{convIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setLessonForm(prev => ({
                            ...prev,
                            conversations: prev.conversations.filter((_, i) => i !== convIdx)
                          }))}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Tiêu đề hội thoại"
                        value={conv.title}
                        onChange={(e) => {
                          const newConvs = [...lessonForm.conversations];
                          newConvs[convIdx].title = e.target.value;
                          setLessonForm(prev => ({ ...prev, conversations: newConvs }));
                        }}
                        className="w-full px-3 py-1 text-sm rounded border border-slate-200 mb-2"
                      />
                      <input
                        type="text"
                        placeholder="URL Audio"
                        value={conv.audioUrl || ''}
                        onChange={(e) => {
                          const newConvs = [...lessonForm.conversations];
                          newConvs[convIdx].audioUrl = e.target.value;
                          setLessonForm(prev => ({ ...prev, conversations: newConvs }));
                        }}
                        className="w-full px-3 py-1 text-sm rounded border border-slate-200 mb-2"
                      />
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newConvs = [...lessonForm.conversations];
                            newConvs[convIdx].sentences.push({
                              characterName: '',
                              textEnglish: '',
                              textVietnamese: ''
                            });
                            setLessonForm(prev => ({ ...prev, conversations: newConvs }));
                          }}
                          className="text-xs text-primary-600 hover:text-primary-800"
                        >
                          + Thêm câu
                        </button>
                        {conv.sentences.map((sent, sentIdx) => (
                          <div key={sentIdx} className="border rounded p-2 bg-white">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-gray-600">Câu #{sentIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newConvs = [...lessonForm.conversations];
                                  newConvs[convIdx].sentences = newConvs[convIdx].sentences.filter((_, i) => i !== sentIdx);
                                  setLessonForm(prev => ({ ...prev, conversations: newConvs }));
                                }}
                                className="text-red-600 hover:text-red-800 text-xs"
                              >
                                Xóa
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Tên nhân vật"
                              value={sent.characterName}
                              onChange={(e) => {
                                const newConvs = [...lessonForm.conversations];
                                newConvs[convIdx].sentences[sentIdx].characterName = e.target.value;
                                setLessonForm(prev => ({ ...prev, conversations: newConvs }));
                              }}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-200 mb-1"
                            />
                            <input
                              type="text"
                              placeholder="Câu tiếng Anh"
                              value={sent.textEnglish}
                              onChange={(e) => {
                                const newConvs = [...lessonForm.conversations];
                                newConvs[convIdx].sentences[sentIdx].textEnglish = e.target.value;
                                setLessonForm(prev => ({ ...prev, conversations: newConvs }));
                              }}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-200 mb-1"
                            />
                            <input
                              type="text"
                              placeholder="Câu tiếng Việt"
                              value={sent.textVietnamese}
                              onChange={(e) => {
                                const newConvs = [...lessonForm.conversations];
                                newConvs[convIdx].sentences[sentIdx].textVietnamese = e.target.value;
                                setLessonForm(prev => ({ ...prev, conversations: newConvs }));
                              }}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-200"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeLessonModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={savingLesson}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
                  disabled={savingLesson}
                >
                  {savingLesson ? 'Đang lưu...' : editingLessonId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 px-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingTestId ? 'Cập nhật bài kiểm tra' : 'Thêm bài kiểm tra mới'}
              </h3>
              <button onClick={closeTestModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            {testFormError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-sm mb-4">
                {testFormError}
              </div>
            )}
            <form className="space-y-4" onSubmit={handleTestFormSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài kiểm tra *</label>
                  <input
                    type="text"
                    value={testForm.name}
                    onChange={(e) => setTestForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                    disabled={savingTest}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cấp độ *</label>
                  <select
                    value={testForm.level}
                    onChange={(e) => setTestForm(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                    disabled={savingTest}
                    required
                  >
                    <option value={1}>1 - Dễ</option>
                    <option value={2}>2 - Trung bình</option>
                    <option value={3}>3 - Khó</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Audio</label>
                <input
                  type="text"
                  value={testForm.audioUrl}
                  onChange={(e) => setTestForm(prev => ({ ...prev, audioUrl: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                  disabled={savingTest}
                  placeholder="https://example.com/audio/test1_intro.mp3"
                />
              </div>

              {/* Questions Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-900">Câu hỏi</h4>
                  <button
                    type="button"
                    onClick={() => setTestForm(prev => ({
                      ...prev,
                      questions: [...prev.questions, {
                        questionText: '',
                        questionType: 'SINGLE_CHOICE',
                        imageUrl: '',
                        answerOptions: []
                      }]
                    }))}
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    + Thêm câu hỏi
                  </button>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {testForm.questions.map((question, qIdx) => (
                    <div key={qIdx} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between mb-3">
                        <span className="text-sm font-medium text-gray-700">Câu hỏi #{qIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setTestForm(prev => ({
                            ...prev,
                            questions: prev.questions.filter((_, i) => i !== qIdx)
                          }))}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nội dung câu hỏi"
                          value={question.questionText}
                          onChange={(e) => {
                            const newQuestions = [...testForm.questions];
                            newQuestions[qIdx].questionText = e.target.value;
                            setTestForm(prev => ({ ...prev, questions: newQuestions }));
                          }}
                          className="w-full px-3 py-2 text-sm rounded border border-slate-200"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={question.questionType}
                            onChange={(e) => {
                              const newQuestions = [...testForm.questions];
                              newQuestions[qIdx].questionType = e.target.value as any;
                              setTestForm(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            className="px-3 py-2 text-sm rounded border border-slate-200"
                          >
                            <option value="SINGLE_CHOICE">Trắc nghiệm 1 đáp án</option>
                            <option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều đáp án</option>
                            <option value="TRUE_FALSE">Đúng/Sai</option>
                            <option value="FILL_IN_BLANK">Điền từ</option>
                            <option value="ARRANGE_SENTENCE">Sắp xếp câu</option>
                          </select>
                          <input
                            type="text"
                            placeholder="URL ảnh (tùy chọn)"
                            value={question.imageUrl || ''}
                            onChange={(e) => {
                              const newQuestions = [...testForm.questions];
                              newQuestions[qIdx].imageUrl = e.target.value;
                              setTestForm(prev => ({ ...prev, questions: newQuestions }));
                            }}
                            className="px-3 py-2 text-sm rounded border border-slate-200"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-gray-700">Đáp án</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newQuestions = [...testForm.questions];
                                newQuestions[qIdx].answerOptions.push({
                                  optionText: '',
                                  isCorrect: false
                                });
                                setTestForm(prev => ({ ...prev, questions: newQuestions }));
                              }}
                              className="text-xs text-primary-600 hover:text-primary-800"
                            >
                              + Thêm đáp án
                            </button>
                          </div>
                          <div className="space-y-2">
                            {question.answerOptions.map((option, optIdx) => (
                              <div key={optIdx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Nội dung đáp án"
                                  value={option.optionText}
                                  onChange={(e) => {
                                    const newQuestions = [...testForm.questions];
                                    newQuestions[qIdx].answerOptions[optIdx].optionText = e.target.value;
                                    setTestForm(prev => ({ ...prev, questions: newQuestions }));
                                  }}
                                  className="flex-1 px-3 py-1 text-sm rounded border border-slate-200"
                                />
                                <label className="flex items-center gap-1 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={option.isCorrect}
                                    onChange={(e) => {
                                      const newQuestions = [...testForm.questions];
                                      newQuestions[qIdx].answerOptions[optIdx].isCorrect = e.target.checked;
                                      setTestForm(prev => ({ ...prev, questions: newQuestions }));
                                    }}
                                    className="rounded"
                                  />
                                  <span className="text-xs">Đúng</span>
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newQuestions = [...testForm.questions];
                                    newQuestions[qIdx].answerOptions = newQuestions[qIdx].answerOptions.filter((_, i) => i !== optIdx);
                                    setTestForm(prev => ({ ...prev, questions: newQuestions }));
                                  }}
                                  className="text-red-600 hover:text-red-800 text-xs px-2"
                                >
                                  Xóa
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeTestModal}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                  disabled={savingTest}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:opacity-60"
                  disabled={savingTest}
                >
                  {savingTest ? 'Đang lưu...' : editingTestId ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
