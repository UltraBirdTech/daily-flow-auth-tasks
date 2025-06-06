
import { useState, useEffect } from 'react';

interface User {
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // For demo purposes, we'll simulate authentication
    // In a real app, this would connect to your backend/Supabase
    console.log('Login attempt:', { email, password });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = { email };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const signup = async (email: string, password: string) => {
    // For demo purposes, we'll simulate user creation
    console.log('Signup attempt:', { email, password });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = { email };
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  };
};
