import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Define a type for our fallback cookie store
type CookieStore = {
  getAll: () => any[];
  get: (name: string) => { value: string } | undefined;
  set: (name: string, value: string, options?: any) => void;
};

export const createClient = async () => {
  try {
    // For static routes, we need to handle cookies differently
    // This approach avoids the dynamic server usage error
    let cookieStore: CookieStore;
    try {
      // Cast the cookies() result to our CookieStore type
      cookieStore = await cookies() as unknown as CookieStore;
    } catch (e) {
      // If cookies() fails in static rendering, provide fallback
      console.error("Error creating cookie store:", e);
      cookieStore = {
        getAll: () => [],
        get: () => undefined,
        set: () => {},
      };
    }

    const client = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            try {
              return cookieStore.getAll();
            } catch (e) {
              console.error("Error getting all cookies:", e);
              return [];
            }
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch (error) {
              // Ignore cookie setting errors in static rendering
              console.error("Error setting cookies:", error);
            }
          },
        },
      },
    );
    return client;
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
};
