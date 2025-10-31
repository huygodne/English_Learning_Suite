import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import LessonsPage from './pages/LessonsPage';
import TestsPage from './pages/TestsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LessonDetailPage from './pages/LessonDetailPage';
import TestDetailPage from './pages/TestDetailPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/lessons" 
              element={
                <ProtectedRoute>
                  <LessonsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lessons/:id" 
              element={
                <ProtectedRoute>
                  <LessonDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tests" 
              element={
                <ProtectedRoute>
                  <TestsPage />
                </ProtectedRoute>
              } 
            />
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
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
