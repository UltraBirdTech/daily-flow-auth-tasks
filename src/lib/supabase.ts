
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Temporary fallback for development - replace with actual values once Supabase is properly configured
const fallbackUrl = 'https://placeholder.supabase.co'
const fallbackKey = 'placeholder-anon-key'

export const supabase = createClient(
  supabaseUrl || fallbackUrl, 
  supabaseAnonKey || fallbackKey
)

export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          text: string
          completed: boolean
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          text: string
          completed?: boolean
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          text?: string
          completed?: boolean
          created_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
