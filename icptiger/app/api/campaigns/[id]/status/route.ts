import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json();
  const { status } = body;

  if (!["queued", "paused", "active"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      console.error("No user found in session for PATCH /api/campaigns/[id]/status");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("linkedin_campaigns")
      .update({ status })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating campaign status:", error);
      return NextResponse.json({ error: "Failed to update campaign status" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Unexpected error in PATCH /api/campaigns/[id]/status:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
