export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          subscription_period: 'monthly' | '6months' | 'annual' | null;
          monthly_imports: number;
          created_at: string;
        };
        Insert: {
          id: string;
          subscription_period?: 'monthly' | '6months' | 'annual' | null;
          monthly_imports?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          subscription_period?: 'monthly' | '6months' | 'annual' | null;
          monthly_imports?: number;
          created_at?: string;
        };
      };
      linkedin_accounts: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          password: string | null;
          li_at: string | null;
          jsessionid: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          password?: string | null;
          li_at?: string | null;
          jsessionid?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          password?: string | null;
          li_at?: string | null;
          jsessionid?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      linkedin_campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          linkedin_url: string;
          connection_message: string | null;
          follow_up_message: string | null;
          follow_up_days: number;
          daily_limit: number;
          status: string;
          status_message: string | null;
          total_profiles: number | null;
          processed_profiles: number | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          linkedin_url: string;
          connection_message?: string | null;
          follow_up_message?: string | null;
          follow_up_days?: number;
          daily_limit?: number;
          status?: string;
          status_message?: string | null;
          total_profiles?: number | null;
          processed_profiles?: number | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          linkedin_url?: string;
          connection_message?: string | null;
          follow_up_message?: string | null;
          follow_up_days?: number;
          daily_limit?: number;
          status?: string;
          status_message?: string | null;
          total_profiles?: number | null;
          processed_profiles?: number | null;
          created_at?: string;
          updated_at?: string;
          completed_at?: string | null;
        };
      };
      linkedin_connections: {
        Row: {
          id: string;
          campaign_id: string;
          profile_url: string;
          first_name: string | null;
          status: string;
          skip_reason: string | null;
          connection_message: string | null;
          follow_up_message: string | null;
          follow_up_error: string | null;
          requested_at: string;
          connected_at: string | null;
          follow_up_sent_at: string | null;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          profile_url: string;
          first_name?: string | null;
          status?: string;
          skip_reason?: string | null;
          connection_message?: string | null;
          follow_up_message?: string | null;
          follow_up_error?: string | null;
          requested_at?: string;
          connected_at?: string | null;
          follow_up_sent_at?: string | null;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          profile_url?: string;
          first_name?: string | null;
          status?: string;
          skip_reason?: string | null;
          connection_message?: string | null;
          follow_up_message?: string | null;
          follow_up_error?: string | null;
          requested_at?: string;
          connected_at?: string | null;
          follow_up_sent_at?: string | null;
        };
      };
      linkedin_settings: {
        Row: {
          id: string;
          user_id: string;
          credentials: Json;
          security_settings: Json;
          advanced_settings: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          credentials: Json;
          security_settings: Json;
          advanced_settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          credentials?: Json;
          security_settings?: Json;
          advanced_settings?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaign_activities: {
        Row: {
          id: string;
          campaign_id: string;
          user_id: string;
          lead_id: string | null;
          activity_type: 'connection' | 'first_followup' | 'second_followup' | 'visit' | 'inmail';
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'skipped';
          scheduled_for: string;
          completed_at: string | null;
          failed_at: string | null;
          message_template: string | null;
          error_message: string | null;
          delay_days: number;
          delay_hours: number;
          priority: number;
          retry_count: number;
          max_retries: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          user_id: string;
          lead_id?: string | null;
          activity_type: 'connection' | 'first_followup' | 'second_followup' | 'visit' | 'inmail';
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'skipped';
          scheduled_for: string;
          completed_at?: string | null;
          failed_at?: string | null;
          message_template?: string | null;
          error_message?: string | null;
          delay_days?: number;
          delay_hours?: number;
          priority?: number;
          retry_count?: number;
          max_retries?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          user_id?: string;
          lead_id?: string | null;
          activity_type?: 'connection' | 'first_followup' | 'second_followup' | 'visit' | 'inmail';
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'skipped';
          scheduled_for?: string;
          completed_at?: string | null;
          failed_at?: string | null;
          message_template?: string | null;
          error_message?: string | null;
          delay_days?: number;
          delay_hours?: number;
          priority?: number;
          retry_count?: number;
          max_retries?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
