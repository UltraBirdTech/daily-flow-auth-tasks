
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for our context
type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create the Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user database for demo
const MOCK_USERS_KEY = 'todo_app_users';

const getMockUsers = (): Record<string, User & { password: string }> => {
  const usersJson = localStorage.getItem(MOCK_USERS_KEY);
  if (!usersJson) return {};
  return JSON.parse(usersJson);
};

const saveMockUsers = (users: Record<string, User & { password: string }>) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('todo_app_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    try {
      const users = getMockUsers();
      const matchedUser = Object.values(users).find(u => u.email === email);

      if (!matchedUser) {
        toast.error('ユーザーが見つかりません');
        return false;
      }

      if (matchedUser.password !== password) {
        toast.error('パスワードが間違っています');
        return false;
      }

      const { password: _, ...userWithoutPassword } = matchedUser;
      
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      // Store user in localStorage
      localStorage.setItem('todo_app_user', JSON.stringify(userWithoutPassword));
      toast.success('ログインしました');
      return true;
    } catch (error) {
      toast.error('ログインに失敗しました');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));

    try {
      const users = getMockUsers();
      
      // Check if email already exists
      if (Object.values(users).some(u => u.email === email)) {
        toast.error('このメールアドレスは既に登録されています');
        return false;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        name,
        password
      };

      // Save to "database"
      users[newUser.id] = newUser;
      saveMockUsers(users);

      // Log in the user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      // Store user in localStorage
      localStorage.setItem('todo_app_user', JSON.stringify(userWithoutPassword));
      
      toast.success('アカウントが作成されました');
      return true;
    } catch (error) {
      toast.error('アカウント作成に失敗しました');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('todo_app_user');
    toast.success('ログアウトしました');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
