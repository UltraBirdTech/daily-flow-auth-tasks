
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "ログインしました",
        description: "Daily Flowへようこそ！",
      });

      return data.user;
    } catch (error: any) {
      toast({
        title: "ログインエラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "アカウントを作成しました",
        description: "確認メールをチェックしてください",
      });

      return data.user;
    } catch (error: any) {
      toast({
        title: "サインアップエラー",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "ログアウトしました",
        description: "また次回お会いしましょう！",
      });
    } catch (error: any) {
      toast({
        title: "ログアウトエラー",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    isLoading,
    login,
    signup,
    logout,
  };
};
