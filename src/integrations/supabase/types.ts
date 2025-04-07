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
      blog_posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          slug: string
          author: string
          date: string
          image_url: string | null
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt: string
          slug: string
          author: string
          date?: string
          image_url?: string | null
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          slug?: string
          author?: string
          date?: string
          image_url?: string | null
          tags?: string[]
          created_at?: string
        }
      }
      subscribers: {
        Row: {
          id: string
          name: string
          email: string
          date: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          date?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          date?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
