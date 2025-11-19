import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingChatbot from './components/FloatingChatbot';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import LessonsPage from './pages/LessonsPage';
import TestsPage from './pages/TestsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LessonDetailPage from './pages/LessonDetailPage';
import TestDetailPage from './pages/TestDetailPage';
import PronunciationPage from './pages/PronunciationPage';
import ChatbotPage from './pages/ChatbotPage';
import LibraryPage from './pages/LibraryPage';

const AppContent = () => {
  const location = useLocation();
  const hideFloatingChatbot = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route 
          path="/lessons/:id" 
          element={
            <ProtectedRoute>
              <LessonDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/tests" element={<TestsPage />} />
        <Route 
          path="/tests/:id" 
          element={
            <ProtectedRoute>
              <TestDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chatbot" 
          element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          }
        />
        <Route path="/translate" element={<Navigate to="/lessons" replace />} />
        <Route 
          path="/pronunciation" 
          element={
            <ProtectedRoute>
              <PronunciationPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      {/* Floating Chatbot - hiển thị khi không ở trang ngoài */}
      {!hideFloatingChatbot && <FloatingChatbot />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <Router>
          <AppContent />
        </Router>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;
