import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

// This would be imported from the automation service if available
// For now we'll simulate the queue trigger
async function triggerCampaignProcessing(campaignId: string) {
  // TODO: Import and use the actual queue functions
  // import { queueLeadExtraction } from "../../../../icptiger-automation/src/jobs/queue";
  // await queueLeadExtraction(campaignId, 15); // High priority for immediate processing
  
  console.log(`📤 [API] Triggered processing for campaign: ${campaignId}`);
  
  // For now, we'll make an HTTP request to the automation service
  try {
    const automationServiceUrl = process.env.AUTOMATION_SERVICE_URL || 'http://localhost:3001';
    const response = await fetch(`${automationServiceUrl}/api/queue-campaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, priority: 15 }),
    });
    
    if (!response.ok) {
      throw new Error(`Automation service responded with status: ${response.status}`);
    }
    
    console.log(`✅ [API] Campaign processing queued successfully: ${campaignId}`);
  } catch (error) {
    console.error(`❌ [API] Failed to trigger campaign processing:`, error);
    // Don't throw - this is non-critical, the 5-minute cron will pick it up
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Auth check
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { campaignId } = await request.json();

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    // Verify the campaign belongs to the user
    const { data: campaign, error } = await supabase
      .from("linkedin_campaigns")
      .select("id, user_id, status")
      .eq("id", campaignId)
      .eq("user_id", user.id)
      .single();

    if (error || !campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status !== "queued") {
      return NextResponse.json({ 
        error: "Campaign is not in queued status", 
        current_status: campaign.status 
      }, { status: 400 });
    }

    // Trigger campaign processing
    await triggerCampaignProcessing(campaignId);

    return NextResponse.json({ 
      success: true, 
      message: "Campaign processing triggered",
      campaignId 
    });

  } catch (error) {
    console.error("Error triggering campaign processing:", error);
    return NextResponse.json(
      { error: "Failed to trigger campaign processing" },
      { status: 500 }
    );
  }
}