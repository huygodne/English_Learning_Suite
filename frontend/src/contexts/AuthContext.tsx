import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, Account } from '../types';
import { authService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Kiểm tra token và user trong localStorage khi app khởi động
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      
      // Lưu token vào localStorage
      localStorage.setItem('token', response.jwt);
      setToken(response.jwt);
      
      // Lấy thông tin user từ API
      try {
        const userInfo = await authService.getCurrentUser();
        
        if (userInfo && userInfo.id) {
          const userData: User = {
            id: userInfo.id,
            username: userInfo.username,
            fullName: userInfo.fullName,
            role: userInfo.role
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } else {
          throw new Error('Failed to get user information');
        }
      } catch (error) {
        console.error('Error getting current user:', error);
        throw error;
      }
    } catch (error) {
      // Xóa token nếu không lấy được user info
      localStorage.removeItem('token');
      setToken(null);
      throw error;
    }
  };

  const register = async (account: Account) => {
    try {
      const response = await authService.register(account);
      
      // Sau khi đăng ký thành công, tự động đăng nhập
      await login(account.username, account.password!);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
