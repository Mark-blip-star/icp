"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, Linkedin, Lock, Crown } from "lucide-react";
import { MetricsDashboard } from "./components/MetricsDashboard";
import { CampaignList } from "./components/CampaignList";
import { CampaignModal } from "./components/CampaignModal";
import { RecentActivity } from "./components/RecentActivity";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CookiesForm, HelpAlert } from "@/components/pages/dashboard/automate/connect";
import Link from "next/link";

// Mock data for the metrics section
const mockMetrics = {
  totalImported: 0,
  totalSent: 0,
  accepted: 0,
  pending: 0,
  acceptanceRate: 0,
  responseRate: 0,
  totalMessages: 0,
  messageConversionRate: 0,
  dailyAverage: 0,
  weeklyGrowth: 0,
  campaigns: [],
  weeklyData: [0, 0, 0, 0, 0, 0, 0],
};

// Mock data for recent activities
const mockActivities = [
  {
    id: 1,
    type: "connection",
    message: "No activities yet",
    timestamp: new Date().toISOString(),
    status: "pending",
  },
];

interface Campaign {
  id: number;
  name: string;
  trending: string;
  searchQuery: string;
  startDate: string;
  endDate: string;
  sent: number;
  accepted: number;
  pending: number;
  responseRate: number;
  status: "queued" | "active" | "paused" | "completed";
  linkedin_url: string;
  connection_message: string;
  follow_up_message: string;
  second_follow_up_message: string;
  follow_up_days: number;
  second_follow_up_days: number;
}

interface MetricsDashboardProps {
  metrics: {
    totalImported: number;
    totalSent: number;
    accepted: number;
    pending: number;
    acceptanceRate: number;
    responseRate: number;
    totalMessages: number;
    messageConversionRate: number;
    dailyAverage: number;
    weeklyGrowth: number;
    campaigns: Campaign[];
    weeklyData: number[];
  };
}

interface RecentActivityProps {
  activities: {
    id: number;
    type: string;
    message: string;
    timestamp: string;
    status: string;
  }[];
}

export default function LinkedInAutomationPage() {
  const router = useRouter();
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [recentActivityHeight, setRecentActivityHeight] = useState<number | null>(null);
  const [trialStatus, setTrialStatus] = useState<{
    isSubscribed: boolean;
    isLoading: boolean;
  }>({
    isSubscribed: true,
    isLoading: true
  });
  const [campaignData, setCampaignData] = useState({
    name: "",
    searchUrl: "",
    connectionMessage: "",
    followUpMessage: "",
    secondFollowUpMessage: "",
    connectionMessageEnabled: false,
    followUpEnabled: true,
    secondFollowUpEnabled: false,
    followUpDays: 2,
    followUpHours: 0,
    secondFollowUpDays: 4,
    secondFollowUpHours: 0,
    dailyLimit: 20,
    weeklyLimit: 100,
    importLimit: 100,
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "17:00",
    hasEndDate: false,
    remainingImports: 500
  });
  const [errors, setErrors] = useState<{
    name?: string;
    searchUrl?: string;
    connectionMessage?: string;
    followUpMessage?: string;
    secondFollowUpMessage?: string;
    importLimit?: string;
    startDate?: string;
  }>({});
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [reloadKey, setReloadKey] = useState(0);

  // Top-level hooks for LinkedIn connection form
  const [cookies, setCookies] = useState({ email: "", password: "", li_at: "", li_a: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Top-level handler functions
  const handleCookieChange = (key: string, value: string) => {
    setCookies((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      // Clean up cookie values by removing quotes if present
      const cleanLiAt = cookies.li_at ? cookies.li_at.replace(/^['"]|['"]$/g, "") : "";
      const cleanLiA = cookies.li_a ? cookies.li_a.replace(/^['"]|['"]$/g, "") : "";
      const dataToSend = {
        email: cookies.email,
        password: cookies.password,
        li_at: cleanLiAt,
        li_a: cleanLiA,
      };
      const response = await fetch("/api/linkedin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to connect LinkedIn account");
      localStorage.setItem("linkedInCredentials", JSON.stringify(dataToSend));
      window.dispatchEvent(new Event("linkedInCredentialsChanged"));
      router.push("/dashboard/automate");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Connection failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Check LinkedIn credentials and update state
    const checkCredentials = () => {
      const hasLinkedInCredentials = localStorage.getItem('linkedInCredentials');
      setHasCredentials(!!hasLinkedInCredentials);
      setIsLoading(false);
    };

    // Initial check
    checkCredentials();

    // Listen for credential changes
    const handleCredentialsChange = () => {
      checkCredentials();
    };

    // Add event listener
    window.addEventListener('linkedInCredentialsChanged', handleCredentialsChange);

    // Cleanup
    return () => {
      window.removeEventListener('linkedInCredentialsChanged', handleCredentialsChange);
    };
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (leftColumnRef.current) {
        const leftColumnHeight = leftColumnRef.current.clientHeight;
        // Always update on first calculation or if significant change
        if (recentActivityHeight === null || Math.abs(leftColumnHeight - recentActivityHeight) > 5) {
          setRecentActivityHeight(leftColumnHeight);
        }
      }
    };

    // First paint calculation
    updateHeight();

    // Queue another calculation after first paint
    requestAnimationFrame(() => {
      updateHeight();
      // Run again after a short delay to catch any layout changes
      setTimeout(updateHeight, 100);
    });

    // Set up resize observer to track left column height changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateHeight);
    });

    // Observe the left column for size changes
    if (leftColumnRef.current) {
      resizeObserver.observe(leftColumnRef.current);
    }

    // Also listen for window resize
    const handleResize = () => {
      requestAnimationFrame(updateHeight);
    };
    window.addEventListener('resize', handleResize);

    // Add visibility change listener to handle tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Run immediately with requestAnimationFrame
        updateHeight();
        requestAnimationFrame(updateHeight);

        // And again after a short delay to ensure DOM is fully updated
        setTimeout(() => {
          updateHeight();
          requestAnimationFrame(updateHeight);
        }, 100);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Polling as a fallback to ensure consistent heights (less frequent)
    const intervalId = setInterval(() => requestAnimationFrame(updateHeight), 5000);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const checkImportStatus = async () => {
      try {
        const response = await fetch('/api/check-import-status');
        const data = await response.json();

        if (mounted) {
          setTrialStatus({
            isSubscribed: data.isSubscribed,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Error checking import status:', error);
        if (mounted) {
          setTrialStatus(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    checkImportStatus();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-[1400px] py-6 mx-auto flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded-md mx-auto"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-md mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!hasCredentials) {
    return (
      <div className="container max-w-[600px] py-12 mx-auto flex flex-col justify-center">
        <div className="w-full">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="border border-black/10 rounded-xl bg-white p-8">
              <p className="text-center text-gray-500 mb-6">Paste your LinkedIn cookies to enable automation features</p>
              <CookiesForm cookies={cookies} onChange={handleCookieChange} />
              <div className="mt-6">
                <HelpAlert />
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 mt-4 flex items-start gap-2">
                <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Your credentials are securely stored and only used for automation purposes</p>
              </div>
              <button
                type="submit"
                className="w-full mt-6 font-outfit text-base px-6 py-3 !bg-[#0A66C2] !text-white hover:!bg-[#0A66C2]/90 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] !border-none disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Connecting..." : "Connect LinkedIn Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const handleToggleCampaign = async (id: number, status: string, startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);

    let newStatus: "paused" | "active" | "queued";

    if (status === "paused") {
      newStatus = start <= now ? "active" : "queued";
    } else if (status === "active" || status === "queued") {
      newStatus = "paused";
    } else {
      // Do nothing for completed or unknown statuses
      return;
    }

    try {
      const res = await fetch(`/api/campaigns/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setCampaigns(prev =>
        prev.map(c =>
          c.id === id
            ? { ...c, status: newStatus }
            : c
        )
      );
      toast.success(`Campaign ${newStatus === 'paused' ? 'paused' : 'resumed'} successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update campaign status.");
    }
  };

  const handleConnect = () => {
    router.push('/dashboard/scale');
  };

  const handleStartCampaign = () => {
    setShowNewCampaignModal(true);
  };

  const handleCampaignCreated = () => {
    // clear out old campaigns so the list remounts with a fresh key
    setCampaigns([]);
    setReloadKey(k => k +1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-[1920px] w-full mx-auto flex flex-col gap-4 p-4 lg:p-6 h-screen">
        {/* Metrics Dashboard */}
        <div className="flex-shrink-0">
          <MetricsDashboard metrics={mockMetrics} />
        </div>

        {/* Main content area and Recent Activity in a grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0 flex-1">
          {/* Active Campaigns */}
          <div className="h-[calc(100vh-18rem)]">
            <CampaignList
              key={reloadKey}  
              campaigns={campaigns}
              setCampaigns={setCampaigns}
              onToggleCampaign={handleToggleCampaign}
              onStartCampaign={handleStartCampaign}
            />
          </div>

          {/* Recent Activity */}
          <div className="h-[calc(100vh-18rem)]">
            <RecentActivity activities={mockActivities} />
          </div>
        </div>
      </div>

      <CampaignModal
        showModal={showNewCampaignModal}
        onClose={() => setShowNewCampaignModal(false)}
        onSuccess={handleCampaignCreated} 
        campaignData={campaignData}
        setCampaignData={setCampaignData}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  );
}
