"use client";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Sparkles,
  Zap,
  PlusIcon,
  LayoutList,
  Menu,
  Infinity,
  X,
  Linkedin,
  Bot,
  TrendingUp,
  Lock,
  ChevronRight,
  ChevronLeft,
  PanelRight,
  PanelLeft,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubscriptionValidator } from "@/app/api/validators/subscriptionValidator";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/context/user-context";
import { RealtimeStatus } from "@/app/components/realtime-status";

interface DashboardHeaderProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  trialStatus: { 
    daysRemaining?: number; 
    isLoading: boolean;
    subscribed?: boolean;
  };
}

export function DashboardHeader({ collapsed = false, onToggleCollapse, trialStatus }: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [showManageDialog, setShowManageDialog] = useState(false);
  const [hasLinkedInCredentials, setHasLinkedInCredentials] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const supabase = createClient();
  const [linkedInEmail, setLinkedInEmail] = useState<string | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const isActive = (path: string) => {
    // For LinkedIn connect page
    if (path === "/dashboard/automate/connect") {
      return pathname === "/dashboard/automate/connect";
    }

    // For settings page, highlight when on that specific path
    return pathname.startsWith(path);
  };

  useEffect(() => {
    // Check if LinkedIn credentials exist in localStorage and Supabase
    const checkCredentials = async () => {
      try {
        // First check localStorage
        const savedCredentials = localStorage.getItem("linkedInCredentials");
        if (savedCredentials) {
          setHasLinkedInCredentials(true);
          return;
        }

        // If no local credentials, check Supabase
        const res = await fetch("/api/auth/user");
        if (!res.ok) throw new Error("Failed to fetch user");
        const { userId } = (await res.json()) as { userId: string | null };

        if (userId) {
          const { data, error } = await supabase
            .from("profiles")
            .select("linkedin_connected")
            .eq("id", userId)
            .single();

          if (error) {
            console.warn("Supabase error when reading linkedin_connected:", error);
            setHasLinkedInCredentials(false);
          } else {
            setHasLinkedInCredentials(!!data?.linkedin_connected);
          }
        } else {
          setHasLinkedInCredentials(false);
        }
      } catch (err) {
        console.error("Error checking credentials:", err);
        setHasLinkedInCredentials(false);
      }
    };

    // Initial check
    checkCredentials();

    // Listen for storage changes from other windows/tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "linkedInCredentials") {
        checkCredentials();
      }
    };

    // Listen for custom event for same-window updates
    const handleCustomEvent = () => {
      checkCredentials();
    };

    // Add event listeners
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("linkedInCredentialsChanged", handleCustomEvent);

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "linkedInCredentialsChanged",
        handleCustomEvent
      );
    };
  }, []);

  // Fetch LinkedIn email when dialog is opened
  useEffect(() => {
    if (!showManageDialog) return;
    async function fetchLinkedInEmail() {
      setEmailLoading(true);
      setEmailError(null);
      try {
        let userId = user?.id;
        if (!userId) {
          // fallback to API if not in context
          const res = await fetch("/api/auth/user");
          if (!res.ok) throw new Error("Failed to fetch user");
          const { userId: fetchedId } = await res.json();
          userId = fetchedId;
        }
        if (!userId) throw new Error("No user ID found");
        const { data, error } = await supabase
          .from("linkedin_accounts")
          .select("email")
          .eq("user_id", userId);
        if (error) throw error;
        if (!data || data.length === 0) {
          setLinkedInEmail(null);
        } else {
          setLinkedInEmail(data[0].email || null);
        }
      } catch (err: any) {
        setEmailError(err?.message || "Could not fetch LinkedIn email");
        setLinkedInEmail(null);
      } finally {
        setEmailLoading(false);
      }
    }
    fetchLinkedInEmail();
  }, [showManageDialog, supabase, user]);

  const handleDisconnect = async () => {
    try {
      setLoading(true);

      // Call API to remove from Supabase
      const response = await fetch("/api/linkedin/disconnect", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoading(false);
        throw new Error(
          errorData.error || "Failed to disconnect account from database"
        );
      }

      // Clear local storage
      localStorage.removeItem("linkedInCredentials");
      setHasLinkedInCredentials(false);
      setShowManageDialog(false);
      setLoading(false);

      // Dispatch custom event
      window.dispatchEvent(new Event("linkedInCredentialsChanged"));

      router.push("/dashboard/automate");
    } catch (error) {
      console.error("Error disconnecting LinkedIn account:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className={cn(
          "relative border-r border-black/10 bg-white flex flex-col shadow-sm overflow-hidden transition-all duration-300",
          collapsed ? "w-16" : "w-52"
        )}>
          {/* Collapse/Expand Button - positioned in the middle of sidebar */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "absolute z-20 p-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm hover:shadow-md",
              "flex items-center justify-center -right-2.5 top-1/2 -translate-y-1/2"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelRight className="h-4 w-4" />
            ) : (
              <PanelLeft className="h-4 w-4" />
            )}
          </button>

          {/* Logo */}
          <div className={cn(
            "flex-shrink-0 flex items-center justify-center h-[60px]", // was h-[88px]
            collapsed ? "w-full" : "w-full px-4"
          )}>
            <Link href="/dashboard" className="flex items-center justify-center hover:opacity-90 transition-opacity">
              {collapsed ? (
                <Image
                  src="/images/logo.png"
                  alt="ICP Tiger"
                  width={32}
                  height={32}
                  priority
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <Image
                  src="/images/logo.png"
                  alt="ICP Tiger"
                  width={100}
                  height={38}
                  priority
                  className="h-[38px] w-auto"
                />
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 overflow-y-auto">
            <div className="space-y-3 mt-4">
              <Link 
                href="/dashboard/automate" 
                className={cn(
                  "flex items-center justify-center py-3 rounded-xl font-outfit transition-all duration-200 w-full group text-sm",
                  !collapsed && "px-4",
                  isActive("/dashboard/automate")
                    ? "text-black font-medium bg-gray-50 shadow-sm"
                    : "text-black/80 hover:text-black hover:bg-gray-50/80 hover:shadow-sm"
                )}
                title={collapsed ? "Automate" : undefined}
              >
                {collapsed ? <TrendingUp className="h-5 w-5" /> : <span>Automate</span>}
              </Link>
              
              <Link 
                href="/dashboard/settings" 
                className={cn(
                  "flex items-center justify-center py-3 rounded-xl font-outfit transition-all duration-200 w-full group text-sm",
                  !collapsed && "px-4",
                  isActive("/dashboard/settings")
                    ? "text-black font-medium bg-gray-50 shadow-sm"
                    : "text-black/80 hover:text-black hover:bg-gray-50/80 hover:shadow-sm"
                )}
                title={collapsed ? "Settings" : undefined}
              >
                {collapsed ? <Settings className="h-5 w-5" /> : <span>Settings</span>}
              </Link>
              
              <Link 
                href="/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-center py-3 rounded-xl font-outfit transition-all duration-200 w-full text-black/80 hover:text-black hover:bg-gray-50/80 hover:shadow-sm group text-sm",
                  !collapsed && "px-4"
                )}
                title={collapsed ? "Subscribe" : undefined}
              >
                {collapsed ? <Zap className="h-5 w-5" /> : <span>Subscribe</span>}
              </Link>
            </div>
          </nav>

          {/* ICP Tiger Branding */}
          <div className="mt-auto px-2 py-4 flex-shrink-0">
            <div className="text-center">
              {!collapsed ? (
                <>
                  <h2 className="text-lg font-recoleta font-black text-[#0A66C2] tracking-tight">Tiger</h2>
                  {trialStatus?.isLoading ? (
                    <span className="text-sm font-outfit text-gray-500">Checking status...</span>
                  ) : trialStatus?.subscribed === true ? (
                    <span className="text-sm font-outfit text-gray-600 font-semibold">Professional Plan</span>
                  ) : trialStatus?.daysRemaining && trialStatus.daysRemaining > 0 ? (
                    <span className="text-gray-500 text-sm font-outfit font-light">{trialStatus.daysRemaining} days left in your free trial</span>
                  ) : (
                    <span className="text-sm font-outfit text-red-500 font-semibold">Your free trial has ended</span>
                  )}
                </>
              ) : null}
            </div>
          </div>

          {/* LinkedIn Status */}
          <div className="px-2 py-4 border-t border-black/10 flex-shrink-0">
            {hasLinkedInCredentials ? (
              <button
                onClick={() => setShowManageDialog(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-outfit text-sm text-black/80 hover:bg-gray-50 transition-colors"
                title={collapsed ? "LinkedIn Connected" : undefined}
              >
                <Linkedin className="h-5 w-5" />
                {!collapsed && <span>Connected</span>}
              </button>
            ) : (
              <Link
                href="/dashboard/automate"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-outfit text-sm text-black/80 hover:bg-gray-50 transition-colors"
                title={collapsed ? "Connect LinkedIn" : undefined}
              >
                <Linkedin className="h-5 w-5" />
                {!collapsed && <span>Connect LinkedIn</span>}
              </Link>
            )}
            
          </div>
        </aside>
      </div>

      {/* LinkedIn Manage Dialog */}
      <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
        <DialogContent className="max-w-md w-[95%] rounded-2xl bg-white p-0 border border-black/10 shadow-lg">
          <DialogHeader>
            <div className="flex flex-col items-center justify-center pt-10 pb-4">
              <DialogTitle className="text-2xl font-recoleta font-black text-center text-black mb-5">
                LinkedIn Connection
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 px-8 pb-10">
            {/* Status Card */}
            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex flex-col items-center mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-green-600 text-xl">✅</span>
                <span className="font-semibold text-gray-800">Status:</span>
                <span className="font-medium text-gray-700">
                  {emailLoading
                    ? 'Loading...'
                    : emailError
                      ? 'Error'
                      : hasLinkedInCredentials
                        ? 'Connected'
                        : 'Not Connected'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">You’re all set! Automation is running.</p>
            </div>

            {/* Button + Warning Group */}
            <div className="w-full flex flex-col items-center">
              <Button
                onClick={handleDisconnect}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-outfit font-bold text-base rounded-lg outline-none py-3 transition-all duration-150 shadow-none border-none"
              >
                {loading ? "Disconnecting..." : "Disconnect Account"}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Stopping your connection will pause all active campaigns.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
