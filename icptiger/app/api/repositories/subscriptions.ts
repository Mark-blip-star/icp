import { createClient } from "@/utils/supabase/server";

export class SubscriptionsClass {
  async getUserByCustomerId(customerId: string): Promise<any> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("subscriptions")
      .select("user_id, email")
      .eq("customer_id", customerId)
      .single();

    if (error || !data) {
      console.error("Error fetching user by customer ID:", error);
      return null;
    }

    // Subscription data retrieved

    return { userId: data.user_id, email: data.email };
  }

  async updateSubscription(userId: string, subscriptionId: string, status: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.from("subscriptions").upsert({
      user_id: userId,
      subscription_id: subscriptionId,
      status: status,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error updating subscription:", error);
      throw error;
    }
  }
}
