import { ReactNode } from "react";
import { UserProvider } from "@/context/user-context";
import { RealtimeProvider } from "@/app/context/realtime-context";
import { isUserAuthenticated } from "../actions/auth";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default async function Layout({ children }: { children: ReactNode }) {
  let user = null;
  
  try {
    // Get the user but don't redirect here - let middleware handle redirects
    user = await isUserAuthenticated();
  } catch (error) {
    console.error("Protected layout authentication error:", error instanceof Error ? error.message : String(error));
  }

  // Always wrap children in providers, even if there's no user
  // The middleware will handle redirects for unauthenticated users
  return (
    <UserProvider user={user}>
      <RealtimeProvider>
        {children}
      </RealtimeProvider>
    </UserProvider>
  );
}
