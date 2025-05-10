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
      app_settings: {
        Row: {
          created_at: string
          id: string
          settings: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          settings: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          settings?: Json
          updated_at?: string
        }
        Relationships: []
      }
      custom_domains: {
        Row: {
          created_at: string
          domain: string
          id: string
          status: string
          user_id: string
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          status?: string
          user_id: string
          verification_token: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          status?: string
          user_id?: string
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      customer_feedback: {
        Row: {
          created_at: string
          feedback: string
          id: string
          qr_code_id: string
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: string
          qr_code_id: string
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: string
          qr_code_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_feedback_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          image_urls: string[] | null
          qr_code_id: string
          rating: number
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          qr_code_id: string
          rating: number
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          image_urls?: string[] | null
          qr_code_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_qr_code_id_fkey"
            columns: ["qr_code_id"]
            isOneToOne: false
            referencedRelation: "qr_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          created_at: string
          data_url: string | null
          direction_rtl: boolean | null
          encrypted_data: string
          footer_text: string | null
          header_text: string | null
          id: string
          instruction_text: string | null
          is_enabled: boolean
          is_scanned: boolean
          scanned_at: string | null
          sequential_number: string
          template: string | null
          url: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          data_url?: string | null
          direction_rtl?: boolean | null
          encrypted_data: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          instruction_text?: string | null
          is_enabled?: boolean
          is_scanned?: boolean
          scanned_at?: string | null
          sequential_number: string
          template?: string | null
          url: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          data_url?: string | null
          direction_rtl?: boolean | null
          encrypted_data?: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          instruction_text?: string | null
          is_enabled?: boolean
          is_scanned?: boolean
          scanned_at?: string | null
          sequential_number?: string
          template?: string | null
          url?: string
          website_url?: string | null
        }
        Relationships: []
      }
      sequence_counters: {
        Row: {
          current_value: number
          id: string
        }
        Insert: {
          current_value?: number
          id: string
        }
        Update: {
          current_value?: number
          id?: string
        }
        Relationships: []
      }
      user_invites: {
        Row: {
          accepted: boolean
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string
          permissions: Json
          role: string
          token: string
        }
        Insert: {
          accepted?: boolean
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          permissions?: Json
          role?: string
          token: string
        }
        Update: {
          accepted?: boolean
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          permissions?: Json
          role?: string
          token?: string
        }
        Relationships: []
      }
      user_limits: {
        Row: {
          created_at: string
          id: string
          qr_created: number
          qr_limit: number
          qr_successful: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          qr_created?: number
          qr_limit?: number
          qr_successful?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          qr_created?: number
          qr_limit?: number
          qr_successful?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_counter: {
        Args: { counter_id: string; increment_by?: number }
        Returns: number
      }
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
