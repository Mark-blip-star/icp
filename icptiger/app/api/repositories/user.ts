import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/database.types";

export type SubscriptionPeriod = 'monthly' | '6months' | 'annual';

type Profile = Database['public']['Tables']['profiles']['Row'];

export class UserRepository {
  async getCurrentUser(cookies?: Awaited<ReturnType<typeof import('next/headers').cookies>>) {
    try {
      const supabase = await createClient(cookies);
      
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting current user:", error);
        throw new Error(`Failed to get current user: ${error.message}`);
      }

      if (!user) {
        console.error("No user found in session");
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      throw error;
    }
  }

  async getUserSubscriptionPeriod(userId: string): Promise<SubscriptionPeriod | null> {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_period")
        .eq("id", userId)
        .single();
      
      if (error) {
        console.error("Error getting subscription period:", error);
        return null;
      }
      
      return (data as Profile)?.subscription_period as SubscriptionPeriod || null;
    } catch (error) {
      console.error("Error in getUserSubscriptionPeriod:", error);
      return null;
    }
  }

  async isSubscribed(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      const supabase = await createClient();

      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_period")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error checking subscription status:", error);
        return false;
      }

      console.log("Subscription check data:", {
        userId: user.id,
        subscriptionPeriod: (data as Profile)?.subscription_period,
        hasSubscription: !!(data as Profile)?.subscription_period
      });

      return !!(data as Profile)?.subscription_period;
    } catch (error) {
      console.error("Error in isSubscribed:", error);
      return false;
    }
  }
}
