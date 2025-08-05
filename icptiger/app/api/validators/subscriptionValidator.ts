import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export class SubscriptionValidator {
  static async validateSubscription(subscriptionId: string): Promise<{
    isValid: boolean;
    error?: string;
  }> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Check if subscription is active
      const isValid = subscription.status === "active";

      return {
        isValid,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        return {
          isValid: false,
          error: error.message,
        };
      }

      return {
        isValid: false,
        error: "An unexpected error occurred while validating the subscription",
      };
    }
  }

  static async checkMonthlyImportLimit(userId: string): Promise<{
    canImport: boolean;
    remainingImports: number;
    error?: string;
  }> {
    try {
      const supabase = await createClient();
      
      // Get user's subscription status
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_period, monthly_imports")
        .eq("id", userId)
        .single();

      // Type assertion for type safety
      const typedProfile = profile as import("@/lib/supabase/database.types").Database["public"]["Tables"]["profiles"]["Row"] | null;

      if (profileError || !typedProfile) {
        return {
          canImport: false,
          remainingImports: 0,
          error: profileError ? profileError.message : "Profile not found"
        };
      }

      // If user has an active subscription, they can import unlimited contacts
      if (typedProfile.subscription_period) {
        return {
          canImport: true,
          remainingImports: -1 // -1 indicates unlimited
        };
      }

      // For free users, check import limit
      const totalImports = typedProfile.monthly_imports ?? 0; // Use nullish coalescing to handle null
      const importLimit = 500;
      const remainingImports = importLimit - totalImports;

      return {
        canImport: remainingImports > 0,
        remainingImports,
        error: remainingImports <= 0 ? "Import limit reached" : undefined
      };
    } catch (error) {
      console.error("Error checking import limit:", error);
      return {
        canImport: false,
        remainingImports: 0,
        error: "Failed to check import limit"
      };
    }
  }

  static async incrementMonthlyImports(userId: string, importCount: number): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const supabase = await createClient();
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          monthly_imports: supabase.rpc('increment_monthly_imports', { increment_by: importCount })
        })
        .eq("id", userId);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update import count"
      };
    }
  }
}
