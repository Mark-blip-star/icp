import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export const runtime = 'edge';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Middleware helper function
const updateSession = async (request: NextRequest) => {
  try {
    // Create a response object that we can modify
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    // Refresh the session if it exists
    await supabase.auth.getSession();

    // Auth pages that should redirect to dashboard if user is logged in
    const authPages = ["/sign-in", "/sign-up", "/otp"];
    const isAuthPage = authPages.some((page) => request.nextUrl.pathname.startsWith(page));

    // Get the session - if null, the user is not logged in
    const { data: { session } } = await supabase.auth.getSession();

    // If on auth page and have session, redirect to dashboard
    if (isAuthPage && session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If accessing dashboard without session, redirect to sign-in
    if (request.nextUrl.pathname.startsWith("/dashboard") && !session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return response;
  } catch (error) {
    console.error("Session update error:", error);
    
    // For dashboard routes, redirect to sign-in on error
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    
    // For other routes, proceed
    return NextResponse.next();
  }
};

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and images
  if (request.nextUrl.pathname.match(/\.(js|css|ico|png|jpg|svg)$/)) {
    return NextResponse.next();
  }

  try {
    // First update the session
    const sessionResponse = await updateSession(request);
    
    // If we got a redirect response, return it
    if (sessionResponse.headers.get("location")) {
      return sessionResponse;
    }

    const photosEndpoint = "/api/generate-photo";

    // For API endpoints, ensure authentication
    if (request.nextUrl.pathname.startsWith('/api')) {
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
              // We don't need to set cookies for API routes
            },
            remove(name: string, options: CookieOptions) {
              // We don't need to remove cookies for API routes
            },
          },
        }
      );

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Rate limiting for specific endpoints
      if (request.nextUrl.pathname.startsWith(photosEndpoint)) {
        // Implement rate limiting logic here if needed
        return sessionResponse;
      }
    }

    return sessionResponse;
  } catch (error: any) {
    console.error("Middleware error:", error);
    
    // For API routes, return 401
    if (request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.json({ error: "Authentication error" }, { status: 401 });
    }

    // For other routes, proceed
    return NextResponse.next();
  }
} 