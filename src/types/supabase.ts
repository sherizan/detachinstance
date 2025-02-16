export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          created_at: string
          name: string
          url: string
          description: string
          logo_url: string
          video_url: string
          category: string
          votes: number
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          url: string
          description: string
          logo_url: string
          video_url: string
          category: string
          votes?: number
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          url?: string
          description?: string
          logo_url?: string
          video_url?: string
          category?: string
          votes?: number
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