// app/api/scale/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export const maxDuration = 59; // Route timeout: 59 s

interface CsvRow {
  // Adjust these keys if your frontend sends different names
  linkedin_url?: string;
  profile_url?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  current_company?: string;
  headline?: string;
}

export async function POST(request: NextRequest) {
  try {
    /* ────────────────────────
       Auth
    ──────────────────────── */
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error("Unauthorized");

    /* ────────────────────────
       Parse & validate payload
    ──────────────────────── */
    const payload = await request.json();
    const {
      name,
      linkedinUrl,
      connectionMessage,
      followUpMessage,
      secondFollowUpMessage,
      connectionMessageEnabled,
      followUpEnabled,
      secondFollowUpEnabled,
      followUpDays,
      followUpHours,
      secondFollowUpDays,
      secondFollowUpHours,
      dailyLimit,
      weeklyLimit,
      importLimit,
      startDate,
      endDate,
      startTime,
      endTime,
      hasEndDate,
      isPaidUser,
      campaign_type,
      rows = [], //  ← CSV rows come in here
    }: {
      /* keep everything as-is, but hint rows */
      rows?: CsvRow[];
      [k: string]: any;
    } = payload;

    // Limit check for free users
    if (!isPaidUser && importLimit > 500) {
      return NextResponse.json(
        { success: false, error: "Free users can only import up to 500 contacts" },
        { status: 400 },
      );
    }

    /* ────────────────────────
       Create campaign
    ──────────────────────── */
    const start = new Date(startDate);
    start.setMinutes(start.getMinutes() - start.getTimezoneOffset());
    const end = hasEndDate ? new Date(endDate) : null;
    let processed_profiles = 0;
    if (campaign_type === "csv") {
      processed_profiles = rows.filter((r: CsvRow) => {
        const url = (r.linkedin_url || r.profile_url || "").trim();
        return url.length > 0;
      }).length;
    }

    const { data: camp, error: campErr } = await supabase
      .from("linkedin_campaigns")
      .insert({
        user_id: user.id,
        name,
        linkedin_url: linkedinUrl,
        status: "queued",
        status_message: null,
        processed_profiles: processed_profiles,
        total_profiles: importLimit,
        start_date: start,
        end_date: end,
        connection_note: connectionMessage,
        follow_up_message: followUpMessage,
        second_follow_up_message: secondFollowUpMessage,
        follow_up_days: followUpDays,
        follow_up_hours: followUpHours,
        second_follow_up_days: secondFollowUpDays,
        second_follow_up_hours: secondFollowUpHours,
        campaign_type,
      })
      .select()
      .single();

    if (campErr || !camp) throw campErr || new Error("Failed to create campaign");

    /* ────────────────────────
       If CSV → bulk-insert rows
    ──────────────────────── */
    if (campaign_type === "csv" && Array.isArray(rows) && rows.length) {
      console.log("Inserting CSV rows into linkedin_connections...", rows);
      const rowsToInsert = rows
        .slice(0, importLimit) // never exceed the user’s limit
        .filter((r: CsvRow) => {
          const url = (r.linkedin_url || r.profile_url || "").trim();
          return url.length > 0;
        })
        .map((r: CsvRow) => ({
          campaign_id: camp.id,
          profile_url: r.linkedin_url || r.profile_url || null,
          headline: " ",
          display_name: r.fullName || `${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || null,
          first_name: r.firstName || null,
          last_name: r.lastName || null,
          current_company: r.company || r.current_company || null,
          is_paused: false,
          status: "queued",
          // skip_reason, requested_at, connected_at, follow_up_sent_at,
          // second_follow_up_sent_at, reply_received_at remain NULL
        }));

      const { error: rowsErr } = await supabase.from("linkedin_connections").insert(rowsToInsert);

      if (rowsErr) throw rowsErr;
    }

    /* ────────────────────────
       Trigger campaign processing
    ──────────────────────── */
    // Trigger immediate campaign processing for all campaigns
    try {
      const automationServiceUrl = process.env.AUTOMATION_SERVICE_URL || "http://localhost:3008";
      console.log(`📤 Attempting to queue campaign ${camp.id} at: ${automationServiceUrl}`);
      
      const response = await fetch(`${automationServiceUrl}/api/queue-campaign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: camp.id, priority: 15 }),
      });

      if (response.ok) {
        console.log(`✅ Campaign processing queued immediately for: ${camp.id}`);
      } else {
        console.warn(
          `⚠️ Failed to queue campaign processing (HTTP ${response.status}) - will be picked up by 5-minute cron job`
        );
      }
    } catch (error: any) {
      // More specific error handling
      if (error?.code === 'ECONNREFUSED') {
        console.warn(
          `⚠️ Automation service not available on port - campaign will be processed by 5-minute cron job instead`
        );
      } else {
        console.warn(
          `⚠️ Could not trigger immediate processing (${error?.message || 'Unknown error'}) - will be picked up by cron:`,
          error?.cause || error?.code || 'Network error'
        );
      }
    }

    /* ────────────────────────
       Done
    ──────────────────────── */
    return NextResponse.json({ success: true, campaignId: camp.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
