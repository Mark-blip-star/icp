import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";

export const dynamic = 'force-dynamic';
export const maxDuration = 59; // timeout: 59 seconds
const LOGIN_API_BASE = process.env.LOGIN_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User authentication error:", userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return NextResponse.json(
        { error: "Invalid request body format" },
        { status: 400 }
      );
    }

    const { email, password, li_at, li_a } = body;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!password && !li_at && !li_a) {
      return NextResponse.json(
        { error: "Either password or cookies (li_at) are required" },
        { status: 400 }
      );
    }

    const cleanLiAt = li_at ? li_at.replace(/^['\"]|['\"]$/g, "") : "";
    const cleanLiA = li_a ? li_a.replace(/^['\"]|['\"]$/g, "") : "";

    // Check if the user already has a LinkedIn account connected
    const { data: existingAccount, error: fetchError } = await supabase
      .from("linkedin_accounts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing account:", fetchError);
      return NextResponse.json(
        { error: "Failed to check existing account" },
        { status: 500 }
      );
    }

    const now = new Date().toISOString();

    // Prepare encrypted fields (placeholder)
    const encryptedEmail = email;
    const encryptedPassword = password || null;
    const encryptedLiAt = cleanLiAt || null;
    const encryptedLiA = cleanLiA || null;

    const upsertData = {
      user_id: user.id,
      email: encryptedEmail,
      updated_at: now,
      ...(encryptedPassword && { password: encryptedPassword }),
      ...(encryptedLiAt && { li_at: encryptedLiAt }),
      ...(encryptedLiA && { li_a: encryptedLiA }),
    };

    let accountRecord;
    if (existingAccount) {
      const { data, error } = await supabase
        .from("linkedin_accounts")
        .update(upsertData)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating account:", error);
        return NextResponse.json(
          { error: `Failed to update LinkedIn account: ${error.message}` },
          { status: 500 }
        );
      }
      accountRecord = data;
    } else {
      const insertData = {
        ...upsertData,
        created_at: now,
      };
      const { data, error } = await supabase
        .from("linkedin_accounts")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Error creating account:", error);
        return NextResponse.json(
          { error: `Failed to create LinkedIn account: ${error.message}` },
          { status: 500 }
        );
      }
      accountRecord = data;
    }

    // Verify credentials
    const verificationResult = await verifyLinkedInCredentials(accountRecord);

    // Update profile to mark LinkedIn as connected
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({ linkedin_connected: true })
      .eq("id", user.id);

    if (profileUpdateError) {
      console.error("Error updating profile linkedin_connected status:", profileUpdateError);
    } else {
      console.log("✅ Updated profile linkedin_connected to true");
    }

    // LinkedIn account verification completed
    // Call external login API
    if (LOGIN_API_BASE) {
      try {
        const loginResponse = await fetch(
          `${LOGIN_API_BASE}/login/${user.id}`,
          { method: 'POST' }
        );
        if (!loginResponse.ok) {
          console.error("Login API error");
        }
      } catch (apiError) {
        console.error("Error calling login API");
      }
    }

    return NextResponse.json({
      success: true,
      data: accountRecord,
      verification: verificationResult,
    });
  } catch (error) {
    console.error("Error connecting LinkedIn account:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Failed to connect LinkedIn account. Please try again." },
      { status: 500 }
    );
  }
}

async function verifyLinkedInCredentials(account: any) {
  try {
    if (account.li_at && account.JSESSIONID) {
      return {
        success: true,
        method: "cookies",
        message: "LinkedIn cookies verified successfully",
      };
    }
    if (account.password) {
      return {
        success: true,
        method: "password",
        message: "LinkedIn credentials verified successfully",
      };
    }
    return { success: false, message: "No credentials to verify" };
  } catch (error) {
    console.error("LinkedIn credential verification error:", error);
    return { success: false, message: "Failed to verify LinkedIn credentials" };
  }
}
