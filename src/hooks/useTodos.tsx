
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

export const useTodos = (userId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading, refetch } = useQuery({
    queryKey: ['todos', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Todo[];
    },
    enabled: !!userId,
  });

  const addTodoMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ text, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', userId] });
      toast({
        title: "タスクを追加しました",
      });
    },
    onError: (error: any) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const toggleTodoMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from('todos')
        .update({ completed })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', userId] });
    },
    onError: (error: any) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos', userId] });
      toast({
        title: "タスクを削除しました",
      });
    },
    onError: (error: any) => {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    todos,
    isLoading,
    refetch,
    addTodo: addTodoMutation.mutate,
    toggleTodo: (id: string, completed: boolean) =>
      toggleTodoMutation.mutate({ id, completed }),
    deleteTodo: deleteTodoMutation.mutate,
  };
};
