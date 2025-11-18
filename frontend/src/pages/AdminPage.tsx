import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService, mediaService } from '../services/api';
import { AccountDTO, AdminDashboard, MediaAsset } from '../types';
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

  const totalUsersCount = dashboard?.totalUsers ?? users.length;
  const adminCount = dashboard?.adminUsers ?? users.filter(u => u.role === 'ADMIN').length;
  const learnerCount = dashboard?.learnerUsers ?? (totalUsersCount - adminCount);
  const totalLessonsCount = dashboard?.totalLessons ?? 0;
  const totalTestsCount = dashboard?.totalTests ?? 0;
  const totalMediaCount = dashboard?.totalMediaAssets ?? mediaAssets.length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, dashboardData, mediaData] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getDashboard(),
          mediaService.list()
        ]);
        setUsers(usersData);
        setDashboard(dashboardData);
        setMediaAssets(mediaData);
      } catch (err: any) {
        setError('Không thể tải dữ liệu quản trị');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium">
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
              <Link to="/admin" className="text-primary-600 px-3 py-2 text-sm font-medium">
                Admin
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Xin chào, {user?.fullName}</span>
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
            <button className="btn-primary">
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
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'ADMIN' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-4">
                          Sửa
                        </button>
                        <button className="text-red-600 hover:text-red-900">
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
              <button className="btn-primary">Quản lý</button>
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
              <button className="btn-secondary">Quản lý</button>
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
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                Xem báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Media Management */}
        <div className="card mt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kho nội dung media</h2>
              <p className="text-gray-600 text-sm">Quản lý hình ảnh, âm thanh và video dùng trong khóa học</p>
            </div>
            <div className="text-sm text-gray-600">
              Tổng cộng: <span className="font-semibold">{totalMediaCount}</span> tệp
            </div>
          </div>

          <form onSubmit={handleUploadMedia} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Loại nội dung</label>
                <select
                  value={mediaForm.type}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, type: e.target.value as 'IMAGE' | 'AUDIO' | 'VIDEO' }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                >
                  <option value="IMAGE">Ảnh</option>
                  <option value="AUDIO">Âm thanh</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Chủ đề</label>
                <input
                  type="text"
                  value={mediaForm.category}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Ví dụ: Hội họa, Hội thoại..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-1 block">Mô tả</label>
                <input
                  type="text"
                  value={mediaForm.description}
                  onChange={(e) => setMediaForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn cho nội dung"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-300 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <button
                type="submit"
                disabled={uploadingMedia}
                className="px-6 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {uploadingMedia ? 'Đang tải lên...' : 'Tải lên nội dung'}
              </button>
            </div>
            {mediaError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm">
                {mediaError}
              </div>
            )}
          </form>

          {mediaAssets.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Chưa có nội dung nào.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Loại</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Chủ đề</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Mô tả</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-600">Xem nhanh</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {mediaAssets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="px-4 py-3 font-semibold text-gray-900">{asset.type}</td>
                      <td className="px-4 py-3 text-gray-700">{asset.category || 'Chưa đặt'}</td>
                      <td className="px-4 py-3 text-gray-600">{asset.description || '—'}</td>
                      <td className="px-4 py-3">
                        <a href={asset.publicUrl} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline">
                          Xem nội dung
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteMedia(asset.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
