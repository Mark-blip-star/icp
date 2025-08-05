import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, data } = body;

    // Simulate different types of updates
    switch (type) {
      case 'campaign_update':
        // Update a campaign status
        const { error: campaignError } = await supabase
          .from('linkedin_campaigns')
          .update({ status: data.status })
          .eq('id', data.campaignId)
          .eq('user_id', user.id);
        
        if (campaignError) {
          return NextResponse.json({ error: "Failed to update campaign" }, { status: 500 });
        }
        break;

      case 'connection_update':
        // Update a connection status
        const { error: connectionError } = await supabase
          .from('linkedin_connections')
          .update({ status: data.status })
          .eq('id', data.connectionId)
          .eq('user_id', user.id);
        
        if (connectionError) {
          return NextResponse.json({ error: "Failed to update connection" }, { status: 500 });
        }
        break;

      case 'log_add':
        // Add a new log entry
        const { error: logError } = await supabase
          .from('linkedin_logs')
          .insert({
            user_id: user.id,
            job_type: data.jobType,
            log_level: data.logLevel,
            message: data.message,
            context: data.context || {}
          });
        
        if (logError) {
          return NextResponse.json({ error: "Failed to add log entry" }, { status: 500 });
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid update type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `${type} update applied` });
  } catch (error) {
    console.error('Realtime test error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 