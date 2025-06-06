
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import TodoList from '@/components/TodoList';

const Index = () => {
  const { user, isLoading, login, signup, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onLogin={login} onSignup={signup} />;
  }

  return <TodoList user={user} onLogout={logout} />;
};

export default Index;
