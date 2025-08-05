import { headers } from "next/headers";
import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Premium price IDs
const PREMIUM_MONTHLY_PRICE_ID = "price_1R1xakEg2pcnrGfjmZLODfIv";
const PREMIUM_YEARLY_PRICE_ID = "price_1R252BEg2pcnrGfjhy18rJ4v";

const MONTHLY_PRICE_ID = process.env.STRIPE_MONTHLY_PRICE_ID;
const SIX_MONTH_PRICE_ID = process.env.STRIPE_SIX_MONTH_PRICE_ID;
const ANNUAL_PRICE_ID = process.env.STRIPE_ANNUAL_PRICE_ID;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("No signature", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    const supabase = await createClient();

    if (event.type === 'customer.subscription.created') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;
      
      if (!userId) {
        return new Response('No userId in subscription metadata', { status: 400 });
      }

      // Determine subscription period based on price ID
      let period = null;
      const priceId = subscription.items.data[0].price.id;
      
      if (priceId === MONTHLY_PRICE_ID) {
        period = 'monthly';
      } else if (priceId === SIX_MONTH_PRICE_ID) {
        period = '6months';
      } else if (priceId === ANNUAL_PRICE_ID) {
        period = 'annual';
      }

      // Update user's subscription period in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          subscription_period: period,
        })
        .eq('id', userId);

      if (updateError) {
        return new Response("Error updating user subscription", { status: 500 });
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata.userId;

      if (!userId) {
        return new Response('No userId in subscription metadata', { status: 400 });
      }

      // Reset user's subscription period
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          subscription_period: null,
        })
        .eq('id', userId);

      if (updateError) {
        return new Response("Error updating user subscription", { status: 500 });
      }
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object as Stripe.Subscription;
      const previousAttributes = (event.data as any).previous_attributes;

      // Handle subscription status changes
      if (subscription.status === "past_due") {
        await stripe.subscriptions.cancel(subscription.id);
      }
    }

    return new Response(JSON.stringify({ received: true }));
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response('Webhook error', { status: 400 });
  }
} 