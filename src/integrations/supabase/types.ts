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
      accounting_integrations: {
        Row: {
          created_at: string
          credentials: Json
          id: string
          is_active: boolean
          last_sync: string | null
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean
          last_sync?: string | null
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json
          id?: string
          is_active?: boolean
          last_sync?: string | null
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          permissions: Json
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          permissions?: Json
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json
          source: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json
          source?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json
          source?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      funnels: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          steps: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          steps?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          steps?: Json
          updated_at?: string
        }
        Relationships: []
      }
      payment_gateway_configs: {
        Row: {
          api_credentials: Json | null
          auto_reconciliation: boolean | null
          created_at: string | null
          custom_headers: Json | null
          enabled: boolean | null
          environment: string | null
          fallback_enabled: boolean | null
          fraud_detection: boolean | null
          gateway_id: string
          gateway_name: string
          id: string
          max_retries: number | null
          priority: number | null
          rate_limit: number | null
          timeout_seconds: number | null
          updated_at: string | null
          user_id: string | null
          webhook_validation: boolean | null
        }
        Insert: {
          api_credentials?: Json | null
          auto_reconciliation?: boolean | null
          created_at?: string | null
          custom_headers?: Json | null
          enabled?: boolean | null
          environment?: string | null
          fallback_enabled?: boolean | null
          fraud_detection?: boolean | null
          gateway_id: string
          gateway_name: string
          id?: string
          max_retries?: number | null
          priority?: number | null
          rate_limit?: number | null
          timeout_seconds?: number | null
          updated_at?: string | null
          user_id?: string | null
          webhook_validation?: boolean | null
        }
        Update: {
          api_credentials?: Json | null
          auto_reconciliation?: boolean | null
          created_at?: string | null
          custom_headers?: Json | null
          enabled?: boolean | null
          environment?: string | null
          fallback_enabled?: boolean | null
          fraud_detection?: boolean | null
          gateway_id?: string
          gateway_name?: string
          id?: string
          max_retries?: number | null
          priority?: number | null
          rate_limit?: number | null
          timeout_seconds?: number | null
          updated_at?: string | null
          user_id?: string | null
          webhook_validation?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          business_logo: string | null
          business_name: string | null
          created_at: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          business_logo?: string | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          business_logo?: string | null
          business_name?: string | null
          created_at?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      qr_codes: {
        Row: {
          amount: number | null
          created_at: string | null
          description: string | null
          error_correction: string | null
          eye_style: string | null
          frame_style: string | null
          gateway_id: string | null
          id: string
          logo_enabled: boolean | null
          pattern: string | null
          payments: number | null
          primary_color: string | null
          qr_code_id: string
          reference: string | null
          revenue: number | null
          scans: number | null
          secondary_color: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          error_correction?: string | null
          eye_style?: string | null
          frame_style?: string | null
          gateway_id?: string | null
          id?: string
          logo_enabled?: boolean | null
          pattern?: string | null
          payments?: number | null
          primary_color?: string | null
          qr_code_id: string
          reference?: string | null
          revenue?: number | null
          scans?: number | null
          secondary_color?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          error_correction?: string | null
          eye_style?: string | null
          frame_style?: string | null
          gateway_id?: string | null
          id?: string
          logo_enabled?: boolean | null
          pattern?: string | null
          payments?: number | null
          primary_color?: string | null
          qr_code_id?: string
          reference?: string | null
          revenue?: number | null
          scans?: number | null
          secondary_color?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      segment_memberships: {
        Row: {
          created_at: string
          id: string
          segment_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          segment_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          segment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "segment_memberships_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "user_segments"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          plan_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end: string
          current_period_start: string
          id?: string
          plan_id: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          plan_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_behavior: {
        Row: {
          created_at: string
          event_data: Json
          event_type: string
          id: string
          ip_address: string | null
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json
          event_type: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json
          event_type?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_segments: {
        Row: {
          created_at: string
          criteria: Json
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
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
