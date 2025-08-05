// components/MetricsDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Send,
  Download,
  Percent,
  MessageSquare,
  Check,
  UserPlus,
  Handshake,
  BarChart3,
} from "lucide-react";
import { LoadingDots } from "@/components/ui/loading";
import { useRealtime } from "@/app/context/realtime-context";

function Spinner() {
  // now a <span> not a <div>
  return (
    <span
      className="inline-block h-4 w-4 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"
      role="status"
      aria-label="loading"
    />
  );
}

interface Metrics {
  totalImported: number;
  totalSent: number;
  accepted: number;
  pending: number;
  replied: number;
  totalMessages: number;
  acceptanceRate: number;
  responseRate: number;
  dailyAverage: number;
  weeklyGrowth: number;
  weeklyData: number[];
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
    campaigns: any[];
    weeklyData: number[];
  };
  isDemo?: boolean;
}

export function MetricsDashboard({ metrics, isDemo = false }: MetricsDashboardProps) {
  const [metricsState, setMetricsState] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use real-time context for live metrics
  const { metrics: realtimeMetrics } = useRealtime();

  useEffect(() => {
    // If in demo mode, use the metrics passed as props
    if (isDemo) {
      setMetricsState({
        totalImported: metrics.totalImported,
        totalSent: metrics.totalSent,
        accepted: metrics.accepted,
        pending: metrics.pending,
        replied: 0, // Not in demo metrics
        totalMessages: metrics.totalMessages,
        acceptanceRate: metrics.acceptanceRate,
        responseRate: metrics.responseRate,
        dailyAverage: metrics.dailyAverage,
        weeklyGrowth: metrics.weeklyGrowth,
        weeklyData: metrics.weeklyData,
      });
      setLoading(false);
      return;
    }

    // Use real-time metrics if available
    if (realtimeMetrics) {
      setMetricsState({
        totalImported: realtimeMetrics.totalImported || 0,
        totalSent: realtimeMetrics.totalSent || 0,
        accepted: realtimeMetrics.accepted || 0,
        pending: realtimeMetrics.pending || 0,
        replied: realtimeMetrics.replied || 0,
        totalMessages: realtimeMetrics.totalMessages || 0,
        acceptanceRate: realtimeMetrics.acceptanceRate || 0,
        responseRate: realtimeMetrics.responseRate || 0,
        dailyAverage: realtimeMetrics.dailyAverage || 0,
        weeklyGrowth: realtimeMetrics.weeklyGrowth || 0,
        weeklyData: realtimeMetrics.weeklyData || [0, 0, 0, 0, 0, 0, 0],
      });
      setLoading(false);
      setError(null);
      return;
    }

    // Fallback to API fetch if no real-time data
    fetch("/api/metrics")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        return res.json();
      })
      .then((data: Metrics) => {
        setMetricsState(data);
      })
      .catch((err) => {
        console.error("Error loading metrics", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [isDemo, metrics, realtimeMetrics]);

  // helper: show spinner, error placeholder, or value
  const renderValue = (val: number | undefined, decimals = 0, isPct = false) => {
    if (loading) return <LoadingDots size="sm" color="primary" />;
    if (error) return <span className="text-gray-400">—</span>;
    const num = val ?? 0;
    const str = isPct ? `${num.toFixed(decimals)}%` : num.toFixed(decimals);
    return <>{str}</>;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-black/5">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-2 px-4 flex-shrink-0 gap-6">
        <div className="flex flex-col min-w-[180px]">
          <h2 className="text-xl font-recoleta font-black text-gray-900 mb-1 tracking-tight">Performance</h2>
          <p className="text-gray-500 text-sm font-outfit font-light">Track your growth</p>
        </div>
        <div className="max-w-5xl pl-4">
          <div className="flex flex-row gap-16 overflow-x-auto items-start">
            <Card label="Contacts Imported">
              {renderValue(metricsState?.totalImported)}
            </Card>
            <Card label="Connections Sent">
              {renderValue(metricsState?.totalSent)}
            </Card>
            <Card label="Connections Made">
              {renderValue(metricsState?.accepted)}
            </Card>
            <Card label="Messages Sent">
              {renderValue(metricsState?.totalMessages)}
            </Card>
            <Card label="Acceptance Rate">
              {renderValue(metricsState?.acceptanceRate, 1, true)}
            </Card>
            <Card label="Response Rate">
              {renderValue(metricsState?.responseRate, 1, true)}
            </Card>
          </div>
        </div>
      </div>
      {error && (
        <div className="text-gray-600 text-sm p-4 bg-gray-50 border-b border-gray-100 font-outfit text-center">
          <p className="font-medium mb-1">Metrics temporarily unavailable</p>
          <p className="text-xs text-gray-500">Please try refreshing the page</p>
        </div>
      )}
    </div>
  );
}

interface CardProps {
  label: string;
  children: React.ReactNode;
}

function Card({ label, children }: CardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <h3 className="text-sm font-medium text-gray-600 font-outfit text-center mb-1">{label}</h3>
      <div className="text-xl font-bold text-black tracking-tight font-space-grotesk-bold text-center mt-1">{children}</div>
    </div>
  );
}
