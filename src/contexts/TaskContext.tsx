
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

// Define types
export type TaskPriority = 'high' | 'medium' | 'low';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  categoryId: string | null;
  dueDate: string | null;
  createdAt: string;
};

type TaskContextType = {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
};

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_1', name: '仕事', color: '#9b87f5' },
  { id: 'cat_2', name: '個人', color: '#F97316' },
  { id: 'cat_3', name: '買い物', color: '#0EA5E9' },
];

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load tasks and categories from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }

      const storedCategories = localStorage.getItem(`categories_${user.id}`);
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        // Set default categories for new users
        setCategories(DEFAULT_CATEGORIES);
        localStorage.setItem(`categories_${user.id}`, JSON.stringify(DEFAULT_CATEGORIES));
      }
    } else {
      // Clear tasks when user logs out
      setTasks([]);
      setCategories([]);
    }
  }, [user]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (user && categories.length > 0) {
      localStorage.setItem(`categories_${user.id}`, JSON.stringify(categories));
    }
  }, [categories, user]);

  const addTask = (task: Omit<Task, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newTask: Task = {
      ...task,
      id: `task_${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, newTask]);
    toast.success('タスクを追加しました');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
    toast.success('タスクを更新しました');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    toast.success('タスクを削除しました');
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      color,
    };
    setCategories([...categories, newCategory]);
    toast.success('カテゴリーを追加しました');
  };

  const deleteCategory = (id: string) => {
    // Update tasks that have this category
    setTasks(
      tasks.map((task) =>
        task.categoryId === id ? { ...task, categoryId: null } : task
      )
    );
    
    // Remove the category
    setCategories(categories.filter((category) => category.id !== id));
    toast.success('カテゴリーを削除しました');
  };

  const value: TaskContextType = {
    tasks,
    categories,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    addCategory,
    deleteCategory,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use task context
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
