// File: app/api/connect/cancel/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const body = await req.json();
  const { connectionId } = body;

  if (!connectionId) {
    return NextResponse.json({ error: "Missing connectionId" }, { status: 400 });
  }

  const { error } = await supabase
    .from("linkedin_connections")
    .update({ status: "cancelled" })
    .eq("id", connectionId);

  if (error) {
    return NextResponse.json({ error: "Failed to cancel connection" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
