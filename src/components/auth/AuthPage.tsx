
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-md mb-8">
        <h1 className="text-3xl font-bold text-center text-todo-purple mb-2">
          ToDoリストアプリ
        </h1>
        <p className="text-gray-600 text-center">
          効率的にタスクを管理して、生産性を向上させましょう
        </p>
      </div>
      
      {isLogin ? (
        <LoginForm onSwitch={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
