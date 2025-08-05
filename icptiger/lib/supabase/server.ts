import { createServerClient } from '@supabase/ssr';
import { cookies as nextCookies } from 'next/headers';
import { Database } from './database.types';

export async function createClient(cookieStore?: Awaited<ReturnType<typeof nextCookies>>) {
  const cookies = cookieStore || await nextCookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies.get(name)?.value;
        },
        set() {
          // no-op
        },
        remove() {
          // no-op
        },
      },
    }
  );
}
