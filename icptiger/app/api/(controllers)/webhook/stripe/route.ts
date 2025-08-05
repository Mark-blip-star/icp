import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { SubscriptionsClass } from "@/app/api/repositories/subscriptions";
import { UserRepository } from "@/app/api/repositories/user";
import { cookies } from "next/headers";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const dynamic = 'force-dynamic';

type StripeEvent = {
  id: string;
  type: string;
  data: {
    object: any;
  };
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let data: StripeEvent["data"];
  let eventType: string;
  let event: StripeEvent;

  // Initialize Supabase client
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret) as StripeEvent;
  } catch (err: any) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case "customer.subscription.created": {
        const subscription = event.data.object;
        const priceId = subscription.plan.id;
        const customerId = subscription.customer;
        const customer = await stripe.customers.retrieve(customerId);
        const userEmail = (customer as any).email;

        const { data: userExist, error: userExistError } = await supabase.rpc(
          "createUserSubscription",
          {
            p_email: userEmail,
            p_price_id: priceId,
            p_customer_id: customerId,
            p_subscription_id: subscription.id,
          },
        );

        if (!userExistError) {
          await resend.emails.send({
            from: "icptiger <info@icptiger.com>",
            to: [(customer as any).email],
            subject: "Welcome to icptiger! 🎉",
            html: `
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FFD700; padding: 20px; font-family: Arial, sans-serif;">
                <tr>
                  <td align="center" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 300px; background-color: white; border-radius: 16px; border: 2px solid black;">
                      <tr>
                        <td style="padding: 20px;">
                          <p>Hi,</p>
                          <p>
                            Thanks for joining icptiger! We're excited to have you on board. Your
                            subscription is now active and ready to help grow your LinkedIn
                            presence.<br>
                            Have questions? We're here to help!
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 0 20px 20px 20px;">
                          <a href=${
                            !userExist
                              ? `${process.env.NEXT_PUBLIC_URL}sign-up?email=` +
                                (customer as any).email
                              : `${process.env.NEXT_PUBLIC_URL}dashboard`
                          }
                            style="background-color: #FFD700; color: black; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                            ${!userExist ? "Create account now" : "Go to dashboard"}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 20px 20px 20px;">
                          <p style="margin-top: 20px; margin-bottom: 0;">
                            Best,<br>
                            The icptiger Team
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            `,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = data.object;
        const previousAttributes = (data as any).previous_attributes;

        if (previousAttributes.status === "trialing" && subscription.status === "past_due") {
          await stripe.subscriptions.cancel(subscription.id);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = await stripe.subscriptions.retrieve(data.object.id);
        const subscriptionsRepo = new SubscriptionsClass();
        const { userId, email } = await subscriptionsRepo.getUserByCustomerId(
          subscription.customer as string,
        );
        const response = await supabase.rpc("revokeUserSubscription", {
          user_id_input: userId,
        });

        if (!response.error) {
          await resend.emails.send({
            from: "icptiger <info@icptiger.com>",
            to: [email!],
            subject: "Your icptiger Subscription Status",
            html: `
              <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #FFD700; padding: 20px; font-family: Arial, sans-serif;">
                <tr>
                  <td align="center" valign="top">
                    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 300px; background-color: white; border-radius: 16px; border: 2px solid black;">
                      <tr>
                        <td style="padding: 20px;">
                          <p>Hi there,</p>
                          <p>
                            We wanted to let you know that your icptiger subscription has been deactivated.<br>
                            You can reactivate your subscription anytime through your dashboard.<br>
                            We'll miss you! If you have any feedback, we'd love to hear it.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0 20px 20px 20px;">
                          <p style="margin-top: 20px; margin-bottom: 0;">
                            Best,<br>
                            The icptiger Team
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            `,
          });
        }
        break;
      }

      default:
      // Unhandled event type
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
