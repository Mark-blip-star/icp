import { NextResponse } from "next/server";
import { UserRepository } from "@/app/api/repositories/user";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userRepo = new UserRepository();
    const user = await userRepo.getCurrentUser(cookieStore);

    if (!user) {
      return NextResponse.json({ daysRemaining: 0, error: "User not found" }, { status: 404 });
    }

    // First check if user is subscribed
    const isSubscribed = await userRepo.isSubscribed();
    if (isSubscribed) {
      // If user is subscribed, return subscribed: true without any trial days
      return NextResponse.json({ subscribed: true });
    }

    // If not subscribed, check trial status
    const supabase = await import("@/lib/supabase/server").then(m => m.createClient(cookieStore));
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("created_at")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.created_at) {
      return NextResponse.json({ daysRemaining: 0, error: "Profile not found" }, { status: 404 });
    }

    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const daysSinceSignup = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, 7 - daysSinceSignup);

    return NextResponse.json({ 
      daysRemaining, 
      created_at: profile.created_at, 
      now: now.toISOString(), 
      daysSinceSignup,
      subscribed: false
    });
  } catch (error) {
    return NextResponse.json({ daysRemaining: 0, error: "Internal server error" }, { status: 500 });
  }
} 