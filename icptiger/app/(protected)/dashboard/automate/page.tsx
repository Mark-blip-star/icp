// file: app/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, Linkedin, Lock, Crown } from "lucide-react";
import { MetricsDashboard } from "./components/MetricsDashboard";
import { CampaignList } from "./components/CampaignList";
import { CampaignModal } from "./components/CampaignModal";
import { RecentActivity } from "./components/RecentActivity";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LinkedInConnect } from "@/app/components/linkedin-connect";
import { createClient } from "@/utils/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading";
import { useUser } from "@/context/user-context";
import { useRealtime } from "@/app/context/realtime-context";
import { CampaignDetails } from "./components/CampaignDetails";

import type { Campaign } from "./types";
import type { CampaignData } from "./components/CampaignModal";

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
  const searchParams =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const isDemo = searchParams?.get("demo") === "1";
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasCredentials, setHasCredentials] = useState<boolean | null>(null);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [recentActivityHeight, setRecentActivityHeight] = useState<number | null>(null);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    sourceType: "searchUrl",
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
    hasEndDate: false,
    startTime: "",
    endTime: "17:00",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    sourceType?: string;
    searchUrl?: string;
    connectionMessage?: string;
    followUpMessage?: string;
    secondFollowUpMessage?: string;
    importLimit?: string;
    startDate?: string;
  }>({});
  const [reloadKey, setReloadKey] = useState(0);
  const supabase = createClient();
  const user = useUser();
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [trialStatus, setTrialStatus] = useState<{ daysRemaining: number; isLoading: boolean }>({
    daysRemaining: 0,
    isLoading: true,
  });

  // Use real-time context
  const {
    campaigns,
    updateCampaigns,
    metrics,
    activities,
    isConnected,
    refreshCampaigns,
    refreshMetrics,
    refreshActivities,
  } = useRealtime();

  // New: Hydrate all dashboard state from /api/dashboard-init
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    async function fetchDashboardInit() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/dashboard-init");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json();
        if (!mounted) return;

        updateCampaigns(data.campaigns || []);
        setTrialStatus({ daysRemaining: data.trial?.daysRemaining ?? 0, isLoading: false });
        user.setImportStatus(data.importStatus || { remainingImports: 0 });
        const isConnected = !!data.profile?.linkedin_connected;
        setHasCredentials(isConnected);
        // Credentials status updated
      } catch (err) {
        console.error("Dashboard init error:", err);
        if (mounted) {
          setTrialStatus((prev) => ({ ...prev, isLoading: false }));
          // Set default values on error to prevent white screen
          updateCampaigns([]);
          user.setImportStatus({ remainingImports: 0 });
          // Don't reset hasCredentials on error - keep the previous value
          if (hasCredentials === null) {
            setHasCredentials(false);
          }
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
          // Trigger entrance animations after a short delay
          setTimeout(() => setHasLoaded(true), 100);
        }
      }
    }

    // Add a timeout fallback to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn("Dashboard init timeout - forcing load completion");
        setIsLoading(false);
        setHasLoaded(true);
        setTrialStatus((prev) => ({ ...prev, isLoading: false }));
        updateCampaigns([]);
        user.setImportStatus({ remainingImports: 0 });
        // DO NOT setHasCredentials(false) here!
      }
    }, 10000); // 10 second timeout

    fetchDashboardInit();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  const handleToggleCampaign = async (id: string, status?: string, startDate?: string) => {
    if (!status || !startDate) {
      toast.error("Unable to update campaign: missing status or start date.");
      console.error("handleToggleCampaign called without status or startDate", {
        id,
        status,
        startDate,
      });
      return;
    }
    const now = new Date();
    const start = new Date(startDate);
    const numericId = Number(id);

    const newStatus: "queued" | "active" | "paused" | "completed" =
      status === "paused" ? (now >= start ? "active" : "queued") : "paused";

    // 1) update UI immediately
    updateCampaigns(campaigns.map((c) => (c.id === numericId ? { ...c, status: newStatus } : c)));

    try {
      // 2) hit the API
      const res = await fetch(`/api/campaigns/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();

      toast.success(`Campaign ${newStatus} successfully!`);
      // 3) Re-fetch campaigns to ensure UI is in sync
      if (!isDemo) {
        refreshCampaigns();
      }
    } catch {
      // 4) revert on failure
      updateCampaigns(campaigns.map((c) => (c.id === numericId ? { ...c, status } : c)));
      toast.error("Failed to update campaign status.");
    }
  };

  const handleStartCampaign = () => {
    setShowNewCampaignModal(true);
  };

  const handleCampaignCreated = (newCampaign: any) => {
    if (isDemo) {
      updateCampaigns([
        {
          ...newCampaign,
          id: campaigns.length ? Math.max(...campaigns.map((c) => c.id)) + 1 : 1,
          status: "active",
          sent: 0,
          accepted: 0,
          pending: 0,
          responseRate: 0,
          linkedin_url: newCampaign.searchUrl,
          connection_message: newCampaign.connectionMessage,
          follow_up_message: newCampaign.followUpMessage,
          second_follow_up_message: newCampaign.secondFollowUpMessage,
          follow_up_days: newCampaign.followUpDays,
          second_follow_up_days: newCampaign.secondFollowUpDays,
          cancelled: 0,
          startDate: newCampaign.startDate,
          endDate: newCampaign.endDate,
          start_date: newCampaign.startDate ? String(newCampaign.startDate) : "",
          end_date: newCampaign.endDate ? String(newCampaign.endDate) : "",
          searchQuery: newCampaign.searchUrl,
          trending: "yes",
        } as Campaign,
        ...campaigns,
      ]);
    } else {
      refreshCampaigns();
      setReloadKey((k) => k + 1);
    }
    setCurrentStep(1);
    setErrors({});
    setCampaignData({
      name: "",
      sourceType: "searchUrl" as "searchUrl" | "csv" | "likes" | "comments",
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
      startTime: "",
      endTime: "17:00",
      hasEndDate: false,
    });
    // checkImportStatus(); // This is now handled by dashboard-init
  };

  // 3️⃣ The same height‐sync logic for the left column / recent activity
  useEffect(() => {
    const updateHeight = () => {
      if (leftColumnRef.current) {
        const leftColumnHeight = leftColumnRef.current.clientHeight;
        if (
          recentActivityHeight === null ||
          Math.abs(leftColumnHeight - recentActivityHeight) > 5
        ) {
          setRecentActivityHeight(leftColumnHeight);
        }
      }
    };

    updateHeight();
    requestAnimationFrame(() => {
      updateHeight();
      setTimeout(updateHeight, 100);
    });

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateHeight);
    });

    if (leftColumnRef.current) {
      resizeObserver.observe(leftColumnRef.current);
    }

    const handleResize = () => {
      requestAnimationFrame(updateHeight);
    };
    window.addEventListener("resize", handleResize);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updateHeight();
        requestAnimationFrame(updateHeight);
        setTimeout(() => {
          updateHeight();
          requestAnimationFrame(updateHeight);
        }, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = setInterval(() => requestAnimationFrame(updateHeight), 5000);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(intervalId);
    };
  }, [recentActivityHeight]);

  // 4️⃣ Check import/trial status (unchanged)
  // useEffect(() => {
  //   let mounted = true;

  //   checkImportStatus();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []);

  // Demo data
  const demoCampaigns: Campaign[] = [
    {
      id: 1,
      name: "Senior Software Engineers - Q2",
      trending: "yes",
      searchQuery: "Senior Software Engineer React Node.js TypeScript",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      start_date: "2025-01-15",
      end_date: "2025-02-15",
      sent: 210,
      accepted: 98,
      pending: 24,
      responseRate: 39.5,
      status: "active",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=senior%20software%20engineer%20react%20node",
      connection_message:
        "Hi [Name], I'm a tech recruiter and I came across your profile. Your experience with React and Node.js is exactly what we're looking for. Would love to connect and discuss some exciting opportunities!",
      follow_up_message:
        "Thanks for connecting! I have a Senior Software Engineer role at a fast-growing fintech company that matches your background perfectly. The role offers competitive compensation, remote work, and great growth opportunities. Would you be open to a quick chat this week?",
      second_follow_up_message:
        "I'd love to schedule a brief call to discuss the role in detail and see if it aligns with your career goals. What's your availability this week? The position is urgent and we're moving quickly with interviews.",
      follow_up_days: 2,
      second_follow_up_days: 5,
      cancelled: 0,
    },
    {
      id: 2,
      name: "Product Managers - Series B Startups",
      trending: "yes",
      searchQuery: "Product Manager startup series B",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      start_date: "2024-12-01",
      end_date: "2024-12-31",
      sent: 160,
      accepted: 72,
      pending: 18,
      responseRate: 36.3,
      status: "completed",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=product%20manager%20startup",
      connection_message:
        "Hi! I'm recruiting for exciting PM roles at growing startups. Your experience looks perfect!",
      follow_up_message:
        "Thanks for connecting! I have a great PM opportunity that matches your background.",
      second_follow_up_message: "Let me know if you're open to a quick call to discuss the role!",
      follow_up_days: 2,
      second_follow_up_days: 5,
      cancelled: 0,
    },
    {
      id: 3,
      name: "Data Scientists - AI Companies",
      trending: "no",
      searchQuery: "Data Scientist AI Machine Learning",
      startDate: "2024-11-10",
      endDate: "2024-12-10",
      start_date: "2024-11-10",
      end_date: "2024-12-10",
      sent: 120,
      accepted: 54,
      pending: 16,
      responseRate: 37.5,
      status: "paused",
      linkedin_url: "https://linkedin.com/search/results/people/?keywords=data%20scientist%20ai",
      connection_message:
        "Hi! I'm recruiting for AI/ML roles and your background caught my attention.",
      follow_up_message: "Thanks for connecting! I have some exciting data science opportunities.",
      second_follow_up_message: "Would you be interested in learning more about the role?",
      follow_up_days: 3,
      second_follow_up_days: 6,
      cancelled: 2,
    },
    {
      id: 4,
      name: "Sales Directors - Enterprise SaaS",
      trending: "no",
      searchQuery: "Sales Director enterprise SaaS",
      startDate: "2024-10-20",
      endDate: "2024-11-20",
      start_date: "2024-10-20",
      end_date: "2024-11-20",
      sent: 140,
      accepted: 62,
      pending: 22,
      responseRate: 35.0,
      status: "completed",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=sales%20director%20enterprise",
      connection_message:
        "Hi! I'm recruiting for senior sales leadership roles in enterprise SaaS.",
      follow_up_message: "Thanks for connecting! I have a great Sales Director opportunity.",
      second_follow_up_message: "Let me know if you're open to a quick call!",
      follow_up_days: 2,
      second_follow_up_days: 4,
      cancelled: 5,
    },
    {
      id: 5,
      name: "DevOps Engineers - Remote",
      trending: "yes",
      searchQuery: "DevOps Engineer remote",
      startDate: "2024-09-15",
      endDate: "2024-10-15",
      start_date: "2024-09-15",
      end_date: "2024-10-15",
      sent: 120,
      accepted: 52,
      pending: 14,
      responseRate: 36.7,
      status: "completed",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=devops%20engineer%20remote",
      connection_message:
        "Hi! I'm recruiting for remote DevOps roles and your experience looks great!",
      follow_up_message: "Thanks for connecting! I have some exciting remote DevOps opportunities.",
      second_follow_up_message: "Would you be interested in learning more?",
      follow_up_days: 2,
      second_follow_up_days: 5,
      cancelled: 1,
    },
    {
      id: 6,
      name: "UX Designers - Fintech",
      trending: "no",
      searchQuery: "UX Designer fintech",
      startDate: "2024-08-25",
      endDate: "2024-09-25",
      start_date: "2024-08-25",
      end_date: "2024-09-25",
      sent: 120,
      accepted: 53,
      pending: 16,
      responseRate: 37.1,
      status: "completed",
      linkedin_url: "https://linkedin.com/search/results/people/?keywords=ux%20designer%20fintech",
      connection_message: "Hi! I'm recruiting for UX roles in fintech and love your portfolio!",
      follow_up_message: "Thanks for connecting! I have some great UX opportunities in fintech.",
      second_follow_up_message: "Let me know if you're open to a quick call!",
      follow_up_days: 3,
      second_follow_up_days: 6,
      cancelled: 3,
    },
    {
      id: 7,
      name: "AI Product Managers - Remote",
      trending: "yes",
      searchQuery: "AI Product Manager remote",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      start_date: "2025-03-01",
      end_date: "2025-03-31",
      sent: 90,
      accepted: 40,
      pending: 15,
      responseRate: 44,
      status: "active",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=ai%20product%20manager%20remote",
      connection_message:
        "Hi! I'm recruiting for remote AI PM roles and your experience looks great!",
      follow_up_message: "Thanks for connecting! I have some exciting AI product opportunities.",
      second_follow_up_message: "Would you be interested in learning more?",
      follow_up_days: 2,
      second_follow_up_days: 5,
      cancelled: 0,
    },
    {
      id: 8,
      name: "Cloud Architects - Fortune 500",
      trending: "no",
      searchQuery: "Cloud Architect Fortune 500",
      startDate: "2025-02-10",
      endDate: "2025-03-10",
      start_date: "2025-02-10",
      end_date: "2025-03-10",
      sent: 105,
      accepted: 55,
      pending: 20,
      responseRate: 52,
      status: "completed",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=cloud%20architect%20fortune%20500",
      connection_message: "Hi! I'm recruiting for cloud architect roles at Fortune 500 companies.",
      follow_up_message: "Thanks for connecting! I have a great cloud architect opportunity.",
      second_follow_up_message: "Let me know if you're open to a quick call!",
      follow_up_days: 3,
      second_follow_up_days: 6,
      cancelled: 1,
    },
    {
      id: 9,
      name: "Marketing Directors - E-commerce",
      trending: "yes",
      searchQuery: "Marketing Director ecommerce",
      startDate: "2025-01-20",
      endDate: "2025-02-20",
      start_date: "2025-01-20",
      end_date: "2025-02-20",
      sent: 130,
      accepted: 60,
      pending: 25,
      responseRate: 46,
      status: "paused",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=marketing%20director%20ecommerce",
      connection_message: "Hi! I'm recruiting for senior marketing roles in e-commerce.",
      follow_up_message:
        "Thanks for connecting! I have some great marketing leadership opportunities.",
      second_follow_up_message: "Let me know if you're open to a quick call!",
      follow_up_days: 2,
      second_follow_up_days: 5,
      cancelled: 2,
    },
    {
      id: 10,
      name: "Data Engineers - Fintech Startups",
      trending: "no",
      searchQuery: "Data Engineer fintech startup",
      startDate: "2025-03-05",
      endDate: "2025-04-05",
      start_date: "2025-03-05",
      end_date: "2025-04-05",
      sent: 85,
      accepted: 38,
      pending: 12,
      responseRate: 45,
      status: "active",
      linkedin_url:
        "https://linkedin.com/search/results/people/?keywords=data%20engineer%20fintech%20startup",
      connection_message: "Hi! I'm recruiting for data engineering roles at top fintech startups.",
      follow_up_message:
        "Thanks for connecting! I have some exciting data engineering opportunities.",
      second_follow_up_message: "Would you be interested in learning more?",
      follow_up_days: 3,
      second_follow_up_days: 6,
      cancelled: 0,
    },
  ];
  const demoActivities = [
    {
      id: 1,
      type: "followup_message_send",
      message: "Sent 1st follow-up message to Alex Chen - Senior React Engineer at Stripe",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
      status: "info" as const,
      target_name: "Alex Chen",
    },
    {
      id: 2,
      type: "followResponse",
      message: "Sarah Rodriguez accepted your connection request",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: "success" as const,
      target_name: "Sarah Rodriguez",
    },
    {
      id: 3,
      type: "followup_message_send",
      message: "Sent 1st follow-up message to Michael Kim - Full Stack Developer at Uber",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      status: "info" as const,
      target_name: "Michael Kim",
    },
    {
      id: 4,
      type: "followup_message_send",
      message: "Sent 1st follow-up message to Priya Patel - Senior Software Engineer at Netflix",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
      status: "info" as const,
      target_name: "Priya Patel",
    },
    {
      id: 5,
      type: "followup_message_send",
      message: "Sent 1st follow-up message to David Wilson - Tech Lead at Spotify",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: "info" as const,
      target_name: "David Wilson",
    },
    {
      id: 6,
      type: "followup_message_send",
      message: "Sent 1st follow-up message to Elena Petrov - Backend Engineer at DoorDash",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      status: "info" as const,
      target_name: "Elena Petrov",
    },
    {
      id: 7,
      type: "followRequest",
      message: "Sent connection request to Carlos Mendez - DevOps Engineer at Slack",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7).toISOString(),
      status: "success" as const,
      target_name: "Carlos Mendez",
    },
    {
      id: 8,
      type: "followup_message_send",
      message: "Sent 1st follow-up message to Lisa Thompson - Frontend Developer at Pinterest",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      status: "info" as const,
      target_name: "Lisa Thompson",
    },
  ];
  const demoMetrics = {
    totalImported: 1090,
    totalSent: 1090,
    accepted: 503,
    pending: 120,
    acceptanceRate: 46.1,
    responseRate: 38.7,
    totalMessages: 380,
    messageConversionRate: 34.9,
    dailyAverage: 36,
    weeklyGrowth: 14,
    campaigns: demoCampaigns,
    weeklyData: [38, 42, 51, 49, 56, 61, 63],
  };

  useEffect(() => {
    if (isDemo) {
      updateCampaigns(demoCampaigns);
    }
  }, [isDemo, updateCampaigns]);

  // Compute aggregate metrics for all demoCampaigns
  const aggregateMetrics = demoCampaigns.reduce(
    (acc, c) => {
      acc.totalImported += c.sent;
      acc.totalSent += c.sent;
      acc.accepted += c.accepted;
      acc.pending += c.pending;
      acc.totalMessages += 38; // Example: 38 messages per campaign
      return acc;
    },
    {
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
      campaigns: demoCampaigns,
      weeklyData: [0, 0, 0, 0, 0, 0, 0],
    } as any,
  );
  // Calculate acceptanceRate, responseRate, etc.
  aggregateMetrics.acceptanceRate = 46.1;
  aggregateMetrics.responseRate = 38.7;
  aggregateMetrics.messageConversionRate = 34.9;
  aggregateMetrics.dailyAverage = 36;
  aggregateMetrics.weeklyGrowth = 14;
  aggregateMetrics.weeklyData = [38, 42, 51, 49, 56, 61, 63];

  const campaignMetrics = selectedCampaign
    ? {
        totalImported: selectedCampaign.sent,
        totalSent: selectedCampaign.sent,
        accepted: selectedCampaign.accepted,
        pending: selectedCampaign.pending,
        acceptanceRate: selectedCampaign.sent
          ? parseFloat(((selectedCampaign.accepted / selectedCampaign.sent) * 100).toFixed(1))
          : 0,
        responseRate: selectedCampaign.sent
          ? parseFloat(
              (((selectedCampaign.accepted * 0.85) / selectedCampaign.sent) * 100).toFixed(1),
            )
          : 0,
        totalMessages: 38,
        messageConversionRate: selectedCampaign.sent
          ? parseFloat(((38 / selectedCampaign.sent) * 100).toFixed(1))
          : 0,
        dailyAverage: Math.round(selectedCampaign.sent / 30),
        weeklyGrowth: Math.round(selectedCampaign.accepted / 8),
        campaigns: [selectedCampaign],
        weeklyData: [3, 5, 7, 6, 8, 5, 4],
      }
    : aggregateMetrics;

  // Show loading state if credentials are unknown or loading
  if (hasCredentials === null || isLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 flex items-center justify-center">
        <LoadingSpinner size="xl" color="primary" text="Loading dashboard..." />
      </div>
    );
  }

  // If not connected, show the connection interface
  if (hasCredentials === false && !isLoading && !isDemo) {
    console.log("🔗 Rendering LinkedIn connection interface");
    return (
      <div className="min-h-screen bg-white">
        <LinkedInConnect />
      </div>
    );
  }

  // If already connected or in demo mode, show the main dashboard
  if ((hasCredentials || isDemo) && !isLoading) {
    return (
      <div className="h-full flex flex-col bg-gray-50/50 min-h-0 overflow-y-auto">
        <div className="w-full flex flex-col gap-6 min-h-0 h-full">
          {/* Metrics Dashboard */}
          <div
            className="flex-shrink-0 transform transition-all duration-700 ease-out"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? "translateY(0)" : "translateY(20px)",
            }}
          >
            <MetricsDashboard
              metrics={selectedCampaign ? campaignMetrics : aggregateMetrics}
              isDemo={isDemo}
            />
          </div>
          {/* Main content area */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1 h-full transform transition-all duration-700 ease-out"
            style={{
              opacity: hasLoaded ? 1 : 0,
              transform: hasLoaded ? "translateY(0)" : "translateY(30px)",
              transitionDelay: hasLoaded ? "200ms" : "0ms",
            }}
          >
            {/* Active Campaigns or Campaign Details */}
            <div
              className="bg-white rounded-2xl border border-black/5 min-h-0 lg:min-h-[550px] h-full flex flex-col w-full min-w-0 transform transition-all duration-500 ease-out"
              style={{
                opacity: hasLoaded ? 1 : 0,
                transform: hasLoaded ? "scale(1)" : "scale(0.98)",
                transitionDelay: hasLoaded ? "300ms" : "0ms",
              }}
            >
              {selectedCampaign ? (
                <CampaignDetails
                  campaign={selectedCampaign}
                  onBack={() => setSelectedCampaign(null)}
                  onToggleCampaign={handleToggleCampaign}
                />
              ) : (
                <CampaignList
                  key={reloadKey}
                  campaigns={campaigns}
                  setCampaigns={updateCampaigns}
                  onToggleCampaign={handleToggleCampaign}
                  onStartCampaign={handleStartCampaign}
                  importStatus={user.importStatus}
                  setShowNewCampaignModal={setShowNewCampaignModal}
                />
              )}
            </div>
            {/* Recent Activity */}
            <div
              className="bg-white rounded-2xl border border-black/5 min-h-0 lg:min-h-[550px] h-full flex flex-col w-full min-w-0 transform transition-all duration-500 ease-out"
              style={{
                opacity: hasLoaded ? 1 : 0,
                transform: hasLoaded ? "scale(1)" : "scale(0.98)",
                transitionDelay: hasLoaded ? "400ms" : "0ms",
              }}
            >
              <RecentActivity />
            </div>
          </div>
        </div>

        <CampaignModal
          showModal={showNewCampaignModal}
          onClose={() => {
            setShowNewCampaignModal(false);
            setSelectedCampaign(null);
          }}
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
}
