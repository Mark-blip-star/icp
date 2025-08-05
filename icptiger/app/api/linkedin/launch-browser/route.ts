import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';
export const maxDuration = 59;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3008';
    
    try {
      const response = await fetch(`${backendUrl}/api/scheduler/trigger/linkedin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      const result = await response.json();
      
      return NextResponse.json({
        success: true,
        sessionId: result.sessionId,
        websocketUrl: `${backendUrl.replace('http', 'ws')}`,
        message: 'LinkedIn login session started'
      });

    } catch (apiError) {
      console.error('Error calling backend API:', apiError);
      return NextResponse.json(
        { error: 'Failed to start LinkedIn login session' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Error launching LinkedIn browser:", error);
    return NextResponse.json(
      { error: "Failed to launch LinkedIn browser" },
      { status: 500 }
    );
  }
} 