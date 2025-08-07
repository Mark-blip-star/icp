"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { io, Socket } from "socket.io-client";
import { useUser } from "@/context/user-context";

interface RealtimeContextType {
  // Campaign updates
  campaigns: any[];
  updateCampaigns: (campaigns: any[]) => void;

  // Connection updates
  connections: any[];
  updateConnections: (connections: any[]) => void;

  // Metrics updates
  metrics: any;
  updateMetrics: (metrics: any) => void;

  // Activity updates
  activities: any[];
  updateActivities: (activities: any[]) => void;

  // Connection status
  isConnected: boolean;

  // Manual refresh functions
  refreshCampaigns: () => Promise<void>;
  refreshMetrics: () => Promise<void>;
  refreshActivities: () => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  const user = useUser();
  const supabase = createClient();

  // Initialize real-time subscriptions
  useEffect(() => {
    const userId = user?.user?.id;
    if (!userId) {
      // Clear state when no user
      setCampaigns([]);
      setConnections([]);
      setMetrics(null);
      setActivities([]);
      setIsConnected(false);
      return;
    }

    // Subscribe to LinkedIn connection status changes
    const profileSubscription = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          // If linkedin_connected status changed
          if ("linkedin_connected" in payload.new) {
            const isLinkedInConnected = payload.new.linkedin_connected;
            // Update local storage to match database state
            if (isLinkedInConnected) {
              localStorage.setItem("linkedInCredentials", "true");
            } else {
              localStorage.removeItem("linkedInCredentials");
            }
            // Dispatch event to notify components
            window.dispatchEvent(new Event("linkedInCredentialsChanged"));
          }
        },
      )
      .subscribe();

    // Initialize Socket.IO for LinkedIn automation updates
    const LOGIN_API_BASE =
      process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL || "https://socket.icptiger.com";
    const sock = io(LOGIN_API_BASE, {
      query: { user_id: userId },
    });

    sock.on("connect", () => {
      setIsConnected(true);
    });

    sock.on("disconnect", () => {
      setIsConnected(false);
    });

    sock.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
      setIsConnected(false);
    });

    // Listen for campaign updates from automation
    sock.on("campaignUpdate", (data: any) => {
      refreshCampaigns();
      refreshMetrics();
    });

    // Listen for connection updates from automation
    sock.on("connectionUpdate", (data: any) => {
      refreshCampaigns();
      refreshMetrics();
      refreshActivities();
    });

    // Listen for activity updates from automation
    sock.on("activityUpdate", (data: any) => {
      refreshActivities();
    });

    setSocket(sock);

    // Set up Supabase Realtime subscriptions
    const setupRealtimeSubscriptions = async () => {
      // Subscribe to campaign changes
      const campaignsSubscription = supabase
        .channel("campaigns")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "linkedin_campaigns",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            refreshCampaigns();
            refreshMetrics();
          },
        )
        .subscribe();

      // Subscribe to connection changes
      const connectionsSubscription = supabase
        .channel("connections")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "linkedin_connections",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            refreshCampaigns();
            refreshMetrics();
          },
        )
        .subscribe();

      // Subscribe to log changes
      const logsSubscription = supabase
        .channel("logs")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "linkedin_logs",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            refreshActivities();
          },
        )
        .subscribe();

      return () => {
        campaignsSubscription.unsubscribe();
        connectionsSubscription.unsubscribe();
        logsSubscription.unsubscribe();
      };
    };

    setupRealtimeSubscriptions();

    return () => {
      profileSubscription.unsubscribe();
      if (sock) {
        sock.disconnect();
      }
    };
  }, [user?.user?.id]);

  // Manual refresh functions
  const refreshCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/campaigns");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Failed to refresh campaigns:", error);
    }
  }, []);

  const refreshMetrics = useCallback(async () => {
    try {
      const res = await fetch("/api/metrics");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMetrics(data);
    } catch (error) {
      console.error("Failed to refresh metrics:", error);
    }
  }, []);

  const refreshActivities = useCallback(async () => {
    try {
      const res = await fetch("/api/logs?limit=20&offset=0");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.logs) {
        const activities = data.logs.map((log: any) => ({
          id: log.id,
          type: log.job_type,
          message: log.message,
          timestamp: new Date(log.created_at).toLocaleString(),
          status: log.log_level,
          target_name: null,
          profile_url: log.context?.profile || null,
        }));
        setActivities(activities);
      }
    } catch (error) {
      console.error("Failed to refresh activities:", error);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    if (user?.user?.id) {
      refreshCampaigns();
      refreshMetrics();
      refreshActivities();
    }
  }, [user?.user?.id, refreshCampaigns, refreshMetrics, refreshActivities]);

  const value: RealtimeContextType = {
    campaigns,
    updateCampaigns: setCampaigns,
    connections,
    updateConnections: setConnections,
    metrics,
    updateMetrics: setMetrics,
    activities,
    updateActivities: setActivities,
    isConnected,
    refreshCampaigns,
    refreshMetrics,
    refreshActivities,
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    // Return a safe fallback instead of throwing
    return {
      campaigns: [],
      updateCampaigns: () => {},
      connections: [],
      updateConnections: () => {},
      metrics: null,
      updateMetrics: () => {},
      activities: [],
      updateActivities: () => {},
      isConnected: false,
      refreshCampaigns: async () => {},
      refreshMetrics: async () => {},
      refreshActivities: async () => {},
    };
  }
  return context;
}
