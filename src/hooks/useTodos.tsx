
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/lib/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];

export const useTodos = (userId: string | undefined) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchTodos();
    }
  }, [userId]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error: any) {
      toast({
        title: "データ取得エラー",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (text: string) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([
          {
            text,
            user_id: userId,
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setTodos([data, ...todos]);

      toast({
        title: "タスクを追加しました",
        description: text,
      });
    } catch (error: any) {
      toast({
        title: "追加エラー",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error: any) {
      toast({
        title: "更新エラー",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTodos(todos.filter(todo => todo.id !== id));

      toast({
        title: "タスクを削除しました",
      });
    } catch (error: any) {
      toast({
        title: "削除エラー",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    todos,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
};
