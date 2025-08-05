// app/api/metrics/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { exists } from "fs";
export const maxDuration = 59; // timeout: 59 seconds
export async function GET(request: NextRequest) {
  try {
    // 1) init supabase
    const supabase = await createClient();

    // 2) auth
    const {
      data: { user } = {},
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      console.error("Auth error:", userErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3) fetch campaigns
    const { data: campaigns = [], error: campErr } = await supabase
      .from("linkedin_campaigns")
      .select("id, total_profiles, processed_profiles, start_date")
      .eq("user_id", user.id);
    if (campErr) {
      console.error("Campaign fetch error:", campErr);
      return NextResponse.json(
        { error: "Failed to load campaigns" },
        { status: 500 }
      );
    }

    // 4) no campaigns → zeros
    if (campaigns.length === 0) {
      return NextResponse.json({
        totalImported: 0,
        totalSent: 0,
        accepted: 0,
        pending: 0,
        cancelled: 0,
        totalMessages: 0,
        acceptanceRate: 0,
        responseRate: 0,
        dailyAverage: 0,
        weeklyGrowth: 0,
        weeklyData: Array(7).fill(0),
      });
    }

    // 5) roll‐ups
    const campaignIds = campaigns.map((c) => c.id);
    const totalImported = campaigns.reduce(
      (sum, c) => sum + (c.total_profiles || 0),
      0
    );
    const totalSent = campaigns.reduce(
      (sum, c) => sum + (c.processed_profiles || 0),
      0
    );

    // earliest start_date
    const startDates = campaigns
      .map((c) => c.start_date)
      .filter(Boolean)
      .map((d) => new Date(d!))
      .sort((a, b) => a.getTime() - b.getTime());
    const earliest = startDates[0] || new Date();

    // 6) count each real status
    const statuses = [
      "connected",                     // was "accepted"
      "pending",
      "paused",
      "queued",
      "invited",
      "cancelled",                     // new status for cancelled connections
    ] as const;

    const counts: Record<typeof statuses[number], number> = {
      connected: 0,
      pending: 0,
      paused: 0,
      queued: 0,
      invited: 0,
      cancelled: 0,                   // new status for cancelled connections
      
    };

    for (const status of statuses) {
      const { count = 0, error } = await supabase
        .from("linkedin_connections")
        .select("id", { head: true, count: "exact" })
        .in("campaign_id", campaignIds)
        .eq("status", status);
      if (error) {
        console.error(`Count error for ${status}:`, error);
        return NextResponse.json(
          { error: `Failed to load ${status} count` },
          { status: 500 }
        );
      }
      counts[status] = count;
    }

    const accepted = counts.connected;
    const pending = counts.pending;
    const cancelled = counts.cancelled; // new status for cancelled connections
   

   

    // 7) rates & daily average
    const acceptanceRate = totalSent
      ? (accepted / totalSent) * 100
      : 0;
   
   
     
      // no "replied" status available, set to 0
    // const responseRate = 0;

    const now = new Date();

    // total messages needs to be calculated using all connections counting if follow_up_sent_at, and second_follow_up_sent_at exists, count it as 2 messages
    const { data: connections = [], error: connErr } = await supabase
      .from("linkedin_connections")
      .select("follow_up_sent_at, second_follow_up_sent_at, reply_received_at")
      .in("campaign_id", campaignIds);

    if (connErr) {
      console.error("Connections fetch error:", connErr);
      return NextResponse.json(
      { error: "Failed to load connections" },
      { status: 500 }
      );
    }

    // 8) weekly data (last 7 days of follow‐ups)
    const totalMessages = connections.reduce((sum, connection) => {
      let messageCount = 0;
      if (connection.follow_up_sent_at) messageCount += 1;
      if (connection.second_follow_up_sent_at) messageCount += 1;
      return sum + messageCount;
    }, 0);

    let responseRate = connections.reduce((sum, connection) => {
      let responseCount = 0;
      if ("reply_received_at" in connection && connection.reply_received_at) responseCount += 1;
      return sum + responseCount;
    }, 0);

    responseRate = totalSent ? (responseRate / totalSent) * 100 : 0;
    // const lastWeekSum = weeklyData.slice(0, 6).reduce((a, b) => a + b, 0);
    // const thisWeekSum = weeklyData.slice(1).reduce((a, b) => a + b, 0);
    // const weeklyGrowth =
    //   lastWeekSum > 0
    //     ? ((thisWeekSum - lastWeekSum) / lastWeekSum) * 100
    //     : 0;

    // 9) return payload
    return NextResponse.json({
      totalImported : totalSent,
      totalSent,
      accepted,
      cancelled,
      pending,
      totalMessages,
      acceptanceRate,
      responseRate,
    });
  } catch (err: any) {
    console.error("Metrics route unexpected error:", err);
    return NextResponse.json(
      { error: "Failed to load metrics" },
      { status: 500 }
    );
  }
}
