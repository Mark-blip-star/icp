import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest } from "next/server";

export type SubscriptionPeriod = 'monthly' | '6months' | 'annual';

export class UserRepositoryEdge {
  private request: NextRequest;

  constructor(request: NextRequest) {
    this.request = request;
  }

  private createClient() {
    const request = this.request;
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string): string | undefined => {
            return request.cookies.get(name)?.value;
          },
          set: (name: string, value: string, options: CookieOptions): void => {
            // In edge functions we don't need to set cookies
          },
          remove: (name: string, options: CookieOptions): void => {
            // In edge functions we don't need to remove cookies
          },
        },
      }
    );
  }

  async getCurrentUser() {
    try {
      const supabase = this.createClient();
      
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        throw error || new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserSubscriptionPeriod(userId: string): Promise<SubscriptionPeriod | null> {
    try {
      const supabase = this.createClient();
      
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_period")
        .eq("id", userId)
        .single();
      
      if (error) {
        return null;
      }
      
      return data?.subscription_period as SubscriptionPeriod || null;
    } catch (error) {
      return null;
    }
  }

  async isSubscribed(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      const supabase = this.createClient();

      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_period")
        .eq("id", user.id)
        .single();

      if (error) {
        return false;
      }

      return !!data?.subscription_period;
    } catch (error) {
      return false;
    }
  }
} 