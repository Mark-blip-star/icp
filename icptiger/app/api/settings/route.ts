import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
export const runtime = "edge";

export async function PATCH(request: NextRequest) {
  // 1) init supabase
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // 2) auth
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3) parse payload
  const body = await request.json();
  const max_connections_per_day = Number(body.max_connections_per_day);
  const max_message_per_day     = Number(body.max_message_per_day);
  const total_visits_per_day    = Number(body.total_visits_per_day);
  const max_inmails_per_day     = Number(body.max_inmails_per_day);

  // 4) upsert into linkedin_settings
  const { data: settings, error } = await supabase
    .from("linkedin_settings")
    .upsert(
      {
        user_id: user.id,
        max_connections_per_day,
        max_message_per_day,
        total_visits_per_day,
        max_inmails_per_day,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Settings upsert error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save settings" },
      { status: 500 }
    );
  }

  // 5) return the newly upserted row
  return NextResponse.json({ settings });
}

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Authenticate user
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr || !user) {
    console.error("❌ Authentication failed:", userErr);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user's LinkedIn settings
  const { data: settings, error } = await supabase
    .from("linkedin_settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    // If no row exists, create one with defaults
    if (error.code === 'PGRST116') { // No rows returned
      // Creating default settings
      
      const { data: newSettings, error: insertError } = await supabase
        .from("linkedin_settings")
        .insert({
          user_id: user.id,
          max_connections_per_day: 20,
          max_message_per_day: 50,
          total_visits_per_day: 50
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error creating default settings:", insertError);
        return NextResponse.json(
          { error: "Failed to create default settings" },
          { status: 500 }
        );
      }

      return NextResponse.json({ settings: newSettings });
    }

    // For other errors, log and return generic error
    console.error("❌ Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }

        // Settings fetched successfully
  return NextResponse.json({ settings });
}