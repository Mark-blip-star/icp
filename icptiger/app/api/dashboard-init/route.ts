import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile and check for LinkedIn credentials
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, linkedin_connected, created_at")
    .eq("id", user.id)
    .single();

  // Also check if LinkedIn account exists
  const { data: linkedinAccount, error: linkedinError } = await supabase
    .from("linkedin_accounts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  // DISABLED: This was causing issues where successful browser logins were being reset to false
  // The browser login flow sets linkedin_connected=true without creating linkedin_accounts record
  // if (profile?.linkedin_connected && !linkedinAccount) {
  //   console.log("Fixing inconsistent LinkedIn connection state for user:", user.id);
  //   await supabase
  //     .from("profiles")
  //     .update({ linkedin_connected: false })
  //     .eq("id", user.id);
  //   profile.linkedin_connected = false;
  // }

  // Trial status
  let daysRemaining = 0;
  if (profile?.created_at) {
    const createdAt = new Date(profile.created_at);
    const now = new Date();
    const daysSinceSignup = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, 7 - daysSinceSignup);
  }

  // Import status
  const { data: importStatus, error: importError } = await supabase
    .from("import_status")
    .select("remainingImports")
    .eq("user_id", user.id)
    .single();

  // Campaigns (first page)
  const limit = 10;
  const offset = 0;
  const { data: campaigns, error: campaignError, count } = await supabase
    .from("linkedin_campaigns")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // Connections for campaign stats
  const campaignIds = (campaigns || []).map((c) => c.id);
  const { data: connections, error: connError } = await supabase
    .from("linkedin_connections")
    .select("campaign_id, status")
    .in("campaign_id", campaignIds);

  const statsMap: Record<string, { sent: number; accepted: number; cancelled : number }> = {};
  for (const c of connections || []) {
    if (!statsMap[c.campaign_id]) {
      statsMap[c.campaign_id] = { sent: 0, accepted: 0, cancelled: 0 };
    }
    if (["queued", "pending", "connected", "paused","followup_message_send",'second_followup_message_send','cancelled'].includes(c.status)) {
      statsMap[c.campaign_id].sent++;
    }
    if (["connected","followup_message_send",'second_followup_message_send'].includes(c.status)) {
      statsMap[c.campaign_id].accepted++;
    }
    if (["cancelled"].includes(c.status)) {
      statsMap[c.campaign_id].cancelled++;
    }
  }
  const campaignsWithStats = (campaigns || []).map((c) => {
    const stats = statsMap[c.id] || { sent: 0, accepted: 0, cancelled: 0 };
    const responseRate = stats.sent > 0 ? Math.round(((stats.accepted / stats.sent) * 100) * 10) / 10 : 0;
    return {
      ...c,
      sent: stats.sent,
      accepted: stats.accepted,
      cancelled: stats.cancelled,
      responseRate,
    };
  });

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    profile,
    trial: { daysRemaining },
    importStatus: importStatus || { remainingImports: 0 },
    campaigns: campaignsWithStats,
    campaignsCount: count || 0,
  });
} 