"use client";
import { DashboardHeader } from "./components/dashboard-header";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [trialStatus, setTrialStatus] = useState<{ 
    daysRemaining?: number; 
    isLoading: boolean;
    subscribed?: boolean;
  }>({ 
    isLoading: true,
    subscribed: false
  });

  // Persist sidebar state to localStorage and restore on mount
  useEffect(() => {
    const stored = localStorage.getItem("sidebarCollapsed");
    if (stored !== null) {
      setSidebarCollapsed(stored === "true");
    }
  }, []);

  const handleToggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem("sidebarCollapsed", String(!prev));
      return !prev;
    });
  };
  
  // Function to get page title based on the current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/dashboard/automate/connect")) return "Link Your Account";
    if (pathname === "/dashboard/automate") return "Automate";
    if (pathname.includes("/dashboard/automate")) return "Automate";
    if (pathname.includes("/dashboard/settings")) return "Settings";
    return "";
  };

  // Fetch trial status and keep in state
  useEffect(() => {
    let mounted = true;
    async function checkTrialStatus() {
      try {
        const response = await fetch("/api/check-trial-status");
        const data = await response.json();
        if (mounted) {
          setTrialStatus({ 
            daysRemaining: data.daysRemaining,
            subscribed: data.subscribed,
            isLoading: false 
          });
        }
      } catch (error) {
        if (mounted) setTrialStatus(prev => ({ ...prev, isLoading: false }));
      }
    }
    checkTrialStatus();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Sidebar Navigation */}
      <DashboardHeader 
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        trialStatus={trialStatus}
      />
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 px-8 pt-8 pb-8 min-h-0">
          {children}
        </div>
      </main>
    </div>
  );
}
