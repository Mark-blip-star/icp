import { NextResponse } from "next/server";
import { SubscriptionValidator } from "@/app/api/validators/subscriptionValidator";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get("subscriptionId");

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    const { isValid, error } = await SubscriptionValidator.validateSubscription(subscriptionId);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({
      isValid,
    });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
