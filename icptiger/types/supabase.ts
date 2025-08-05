export interface Database {
  public: {
    Tables: {
      linkedin_campaigns: {
        Row: {
          id: number;
          user_id: string;
          name: string;
          linkedin_url: string;
          status: string;
          status_message: string | null;
          processed_profiles: number;
          total_profiles: number;
          start_date: Date;
          end_date: Date | null;
          connection_note: string;
          follow_up_message: string;
          second_follow_up_message: string;
          follow_up_days: number;
          follow_up_hours: number;
          second_follow_up_days: number;
          second_follow_up_hours: number;
          created_at: Date;
          updated_at: Date;
        };
        Insert: {
          id?: number;
          user_id: string;
          name: string;
          linkedin_url: string;
          status: string;
          status_message?: string | null;
          processed_profiles?: number;
          total_profiles: number;
          start_date: Date;
          end_date?: Date | null;
          connection_note: string;
          follow_up_message: string;
          second_follow_up_message: string;
          follow_up_days: number;
          follow_up_hours: number;
          second_follow_up_days: number;
          second_follow_up_hours: number;
          created_at?: Date;
          updated_at?: Date;
        };
        Update: {
          id?: number;
          user_id?: string;
          name?: string;
          linkedin_url?: string;
          status?: string;
          status_message?: string | null;
          processed_profiles?: number;
          total_profiles?: number;
          start_date?: Date;
          end_date?: Date | null;
          connection_note?: string;
          follow_up_message?: string;
          second_follow_up_message?: string;
          follow_up_days?: number;
          follow_up_hours?: number;
          second_follow_up_days?: number;
          second_follow_up_hours?: number;
          created_at?: Date;
          updated_at?: Date;
        };
      };
      waitlist: {
        Row: {
          id: number;
          email: string;
          use_case: string | null;
          created_at: string;
          updated_at: string;
          status: 'pending' | 'invited' | 'registered';
          priority: number;
          source: string | null;
        };
        Insert: {
          id?: number;
          email: string;
          use_case?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: 'pending' | 'invited' | 'registered';
          priority?: number;
          source?: string | null;
        };
        Update: {
          id?: number;
          email?: string;
          use_case?: string | null;
          created_at?: string;
          updated_at?: string;
          status?: 'pending' | 'invited' | 'registered';
          priority?: number;
          source?: string | null;
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