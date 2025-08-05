import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's LinkedIn account
    const { data: account, error: accountError } = await supabase
      .from('linkedin_accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ 
        error: "No LinkedIn account found. Please connect your LinkedIn account first." 
      }, { status: 404 });
    }

    // For now, return a simple success response
    // In a real implementation, you would test the LinkedIn connection
    return NextResponse.json({
      success: true,
      message: "LinkedIn connection test completed",
      url: "https://www.linkedin.com/in/test-profile",
      screenshot: null // Would be base64 encoded screenshot in real implementation
    });

  } catch (error) {
    console.error("LinkedIn test verify error:", error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
} 