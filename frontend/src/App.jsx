import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { QuickPanelProvider, useQuickPanel } from './contexts/QuickPanelContext';
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
import LibraryPage from './pages/LibraryPage';
import RecommendedLessons from './pages/RecommendedLessons';
import HamburgerDrawer from './pages/home/components/HamburgerDrawer';

const AppContent = () => {
  const location = useLocation();
  const hideFloatingChatbot = ['/login', '/register'].includes(location.pathname);
  const { isAuthenticated, isAdmin } = useAuth();
  const { isOpen: quickPanelOpen, close: closeQuickPanel } = useQuickPanel();

  const hideQuickPanelRoutes = ['/login', '/register'];
  const showQuickPanel = isAuthenticated && !hideQuickPanelRoutes.includes(location.pathname);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuthenticated && isAdmin ? <AdminPage /> : <HomePage />}
        />
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
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/recommendations" element={<RecommendedLessons />} />
      </Routes>
      {/* Floating Chatbot - hiển thị khi không ở trang ngoài */}
      {!hideFloatingChatbot && <FloatingChatbot />}
      {showQuickPanel && (
        <HamburgerDrawer isOpen={quickPanelOpen} onClose={closeQuickPanel} />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ChatbotProvider>
        <QuickPanelProvider>
          <Router>
            <AppContent />
          </Router>
        </QuickPanelProvider>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;
