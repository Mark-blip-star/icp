import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { startOfMonth, formatISO } from "date-fns";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const { searchParams } = new URL(req.url);

  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = parseInt(searchParams.get("offset") || "0");

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ campaigns: [], count: 0 });
  }

  const { data: campaigns, error: campaignError, count } = await supabase
    .from("linkedin_campaigns")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

      if (campaignError) {
      return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
    }

  const campaignIds = campaigns.map((c) => c.id);

  const { data: connections, error: connError } = await supabase
    .from("linkedin_connections")
    .select("campaign_id, status")
    .in("campaign_id", campaignIds);

      if (connError) {
      return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
    }

  const statsMap: Record<string, { sent: number; accepted: number; cancelled : number }> = {};

  for (const c of connections) {
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

  const campaignsWithStats = campaigns.map((c) => {
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

  return NextResponse.json({ campaigns: campaignsWithStats, count });
}
