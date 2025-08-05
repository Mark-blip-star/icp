// app/api/auth/user/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

    // Ask Supabase who is currently logged in
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        // If there’s no session or something went wrong, return null
        return NextResponse.json({ userId: null });
    }

    return NextResponse.json({ userId: user.id });
}
