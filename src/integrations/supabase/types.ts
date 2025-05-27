export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      birth_charts: {
        Row: {
          created_at: string | null
          houses: Json | null
          id: string
          nakshatras: Json | null
          planets: Json | null
          user_id: string | null
          metadata: Json | null
          dashas: Json | null
          ascendant: number | null
          lunarDay: number | null
        }
        Insert: {
          created_at?: string | null
          houses?: Json | null
          id?: string
          nakshatras?: Json | null
          planets?: Json | null
          user_id?: string | null
          metadata?: Json | null
          dashas?: Json | null
          ascendant?: number | null
          lunarDay?: number | null
        }
        Update: {
          created_at?: string | null
          houses?: Json | null
          id?: string
          nakshatras?: Json | null
          planets?: Json | null
          user_id?: string | null
          metadata?: Json | null
          dashas?: Json | null
          ascendant?: number | null
          lunarDay?: number | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          created_at: string
          date: string
          excerpt: string
          id: string
          image_url: string | null
          slug: string
          tags: string[] | null
          title: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string
          date?: string
          excerpt: string
          id?: string
          image_url?: string | null
          slug: string
          tags?: string[] | null
          title: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          date?: string
          excerpt?: string
          id?: string
          image_url?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      dasha_reference: {
        Row: {
          antardasha_percentages: Json | null
          dasha_effects: Json | null
          id: number
          mahadasha_years: number | null
          planet: string | null
          planetary_info: Json | null
          symbol: string | null
        }
        Insert: {
          antardasha_percentages?: Json | null
          dasha_effects?: Json | null
          id?: number
          mahadasha_years?: number | null
          planet?: string | null
          planetary_info?: Json | null
          symbol?: string | null
        }
        Update: {
          antardasha_percentages?: Json | null
          dasha_effects?: Json | null
          id?: number
          mahadasha_years?: number | null
          planet?: string | null
          planetary_info?: Json | null
          symbol?: string | null
        }
        Relationships: []
      }
      dasha_results: {
        Row: {
          antardasha_planet: string | null
          created_at: string | null
          end_date: string | null
          id: string
          mahadasha_planet: string | null
          start_date: string | null
          user_id: string | null
        }
        Insert: {
          antardasha_planet?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          mahadasha_planet?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Update: {
          antardasha_planet?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          mahadasha_planet?: string | null
          start_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nakshatras: {
        Row: {
          deity: string | null
          element: string | null
          end_degree: number | null
          gender: string | null
          number: number
          padas: Json | null
          quality: string | null
          ruler: string | null
          sanskrit_name: string | null
          start_degree: number | null
          symbol: string | null
          vietnamese_name: string | null
        }
        Insert: {
          deity?: string | null
          element?: string | null
          end_degree?: number | null
          gender?: string | null
          number: number
          padas?: Json | null
          quality?: string | null
          ruler?: string | null
          sanskrit_name?: string | null
          start_degree?: number | null
          symbol?: string | null
          vietnamese_name?: string | null
        }
        Update: {
          deity?: string | null
          element?: string | null
          end_degree?: number | null
          gender?: string | null
          number?: number
          padas?: Json | null
          quality?: string | null
          ruler?: string | null
          sanskrit_name?: string | null
          start_degree?: number | null
          symbol?: string | null
          vietnamese_name?: string | null
        }
        Relationships: []
      }
      numerology_calculations: {
        Row: {
          birth_day: number
          birth_month: number
          birth_number: number
          birth_year: number
          created_at: string
          id: string
          life_number: number
          name: string
          name_number: number
          user_email: string | null
          user_ip: string | null
        }
        Insert: {
          birth_day: number
          birth_month: number
          birth_number: number
          birth_year: number
          created_at?: string
          id?: string
          life_number: number
          name: string
          name_number: number
          user_email?: string | null
          user_ip?: string | null
        }
        Update: {
          birth_day?: number
          birth_month?: number
          birth_number?: number
          birth_year?: number
          created_at?: string
          id?: string
          life_number?: number
          name?: string
          name_number?: number
          user_email?: string | null
          user_ip?: string | null
        }
        Relationships: []
      }
      planets: {
        Row: {
          characteristics: Json | null
          color: string | null
          debilitation: number | null
          element: string | null
          exaltation: number | null
          gender: string | null
          id: string
          keywords: Json | null
          name: string | null
          nature: Json | null
          sanskrit_name: string | null
          sign_ruler: number[] | null
          symbol: string | null
        }
        Insert: {
          characteristics?: Json | null
          color?: string | null
          debilitation?: number | null
          element?: string | null
          exaltation?: number | null
          gender?: string | null
          id: string
          keywords?: Json | null
          name?: string | null
          nature?: Json | null
          sanskrit_name?: string | null
          sign_ruler?: number[] | null
          symbol?: string | null
        }
        Update: {
          characteristics?: Json | null
          color?: string | null
          debilitation?: number | null
          element?: string | null
          exaltation?: number | null
          gender?: string | null
          id?: string
          keywords?: Json | null
          name?: string | null
          nature?: Json | null
          sanskrit_name?: string | null
          sign_ruler?: number[] | null
          symbol?: string | null
        }
        Relationships: []
      }
      signs: {
        Row: {
          body_parts: Json | null
          characteristics: Json | null
          color: string | null
          degree_end: number | null
          degree_start: number | null
          direction: string | null
          element: string | null
          id: number
          keywords: Json | null
          name: string | null
          polarity: string | null
          quality: string | null
          ruler: string | null
          sanskrit_name: string | null
          symbol: string | null
          unicode: string | null
        }
        Insert: {
          body_parts?: Json | null
          characteristics?: Json | null
          color?: string | null
          degree_end?: number | null
          degree_start?: number | null
          direction?: string | null
          element?: string | null
          id: number
          keywords?: Json | null
          name?: string | null
          polarity?: string | null
          quality?: string | null
          ruler?: string | null
          sanskrit_name?: string | null
          symbol?: string | null
          unicode?: string | null
        }
        Update: {
          body_parts?: Json | null
          characteristics?: Json | null
          color?: string | null
          degree_end?: number | null
          degree_start?: number | null
          direction?: string | null
          element?: string | null
          id?: number
          keywords?: Json | null
          name?: string | null
          polarity?: string | null
          quality?: string | null
          ruler?: string | null
          sanskrit_name?: string | null
          symbol?: string | null
          unicode?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          date: string
          email: string
          id: string
          name: string
        }
        Insert: {
          date?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          date?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      birth_chart_inputs: {
        Row: {
          id: string
          user_id: string | null
          name: string
          email: string
          birth_date: string
          birth_time: string
          location: string
          latitude: number
          longitude: number
          timezone: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          email: string
          birth_date: string
          birth_time: string
          location: string
          latitude: number
          longitude: number
          timezone: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string
          email?: string
          birth_date?: string
          birth_time?: string
          location?: string
          latitude?: number
          longitude?: number
          timezone?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "birth_chart_inputs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
