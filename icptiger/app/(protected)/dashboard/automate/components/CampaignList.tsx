'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, Lock, Send, Users, TrendingUp, Infinity, Pause, Play, Clock, X } from "lucide-react";
import { CampaignDetails } from "./CampaignDetails";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading";

interface Campaign {
  cancelled: number;
  start_date: string | undefined;
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

interface CampaignListProps {
  campaigns: Campaign[];
  setCampaigns: (campaigns: Campaign[]) => void;
  onToggleCampaign: (id: string, status?: "queued" | "active" | "paused" | "completed", startDate?: string) => void;
  onStartCampaign: () => void;
  importStatus: {
    remainingImports: number;
  } | null;
  setShowNewCampaignModal: (show: boolean) => void;
  setSelectedCampaign?: (campaign: Campaign | null) => void;
}

export function CampaignList({
  campaigns,
  setCampaigns,
  onToggleCampaign,
  onStartCampaign,
  importStatus,
  setShowNewCampaignModal,
  setSelectedCampaign,
}: CampaignListProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCampaignDetails, setSelectedCampaignDetails] = useState<Campaign | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  // Detect demo mode by checking if setCampaigns is a local setter (not from API)
  const isDemo = typeof onToggleCampaign !== 'function' || campaigns.some(c => c.id > 0 && c.sent === 0 && c.accepted === 0);

  const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const offset = (page - 1) * limit;
        const res = await fetch(`/api/campaigns?limit=${limit}&offset=${offset}`);
        const data = await res.json();

        setCampaigns(data.campaigns || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    };

     const fetchCampaignsWithoutLoading = async () => {
      try {
        const offset = (page - 1) * limit;
        const res = await fetch(`/api/campaigns?limit=${limit}&offset=${offset}`);
        const data = await res.json();

        setCampaigns(data.campaigns || []);
        setTotalCount(data.count || 0);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
      }
    };
  useEffect(() => {
    // Skip API fetch if campaigns are already provided (demo mode)
    if (campaigns.length > 0) {
      setLoading(false);
      return;
    }

    fetchCampaigns();
  }, [page, campaigns.length]);

  if (setSelectedCampaign && selectedCampaignDetails) {
    setSelectedCampaign(selectedCampaignDetails);
    setSelectedCampaignDetails(null);
    return null;
  }

  if (selectedCampaignDetails) {
    return (
      <CampaignDetails
        campaign={selectedCampaignDetails}
        onBack={() => {
          if (setSelectedCampaign) setSelectedCampaign(null);
          setSelectedCampaignDetails(null);
        }}
        onToggleCampaign={onToggleCampaign}
      />
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-shrink-0 py-2 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <div className="flex flex-col gap-1 max-w-[320px]">
            <h2 className="text-xl font-recoleta font-black text-gray-900 tracking-tight">Campaigns</h2>
            <p className="text-gray-500 text-sm font-outfit font-light whitespace-nowrap overflow-hidden text-ellipsis">Manage your campaigns</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0 items-stretch sm:items-center w-full sm:w-auto">
            <button
              onClick={() => setShowNewCampaignModal(true)}
              className="px-6 py-2 bg-[#0A66C2] text-white rounded-3xl hover:bg-[#0A66C2]/90 transition-all duration-300 hover:scale-[1.02] font-outfit text-sm flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <PlusIcon className="h-4 w-4" />
              New
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col">
        {campaigns.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-4">
            <p className="text-sm text-center max-w-md font-outfit mb-4">
              Create your first campaign to start connecting with your ICP
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-0">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between hover:bg-gray-50/50 transition-all duration-200 cursor-pointer py-3"
                onClick={() => {
                  if (setSelectedCampaign) setSelectedCampaign(campaign);
                  else setSelectedCampaignDetails(campaign);
                }}
              >
                <div className="flex-1 min-w-0 max-w-[200px]">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-outfit text-gray-900 tracking-tight truncate">{campaign.name}</h3>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-medium flex items-center gap-1 font-outfit tracking-wide",
                      campaign.status === "active" && "bg-[#0A66C2]/5 text-[#0A66C2]",
                      campaign.status === "paused" && "bg-gray-50 text-gray-600",
                      campaign.status === "completed" && "bg-gray-50 text-gray-500",
                      campaign.status === "queued" && "bg-amber-50 text-amber-600"
                    )}>
                      {campaign.status === "active" && <div className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] animate-pulse" />}
                      {campaign.status === "paused" && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                      {campaign.status === "completed" && (
                        <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {campaign.status === "queued" && (
                        <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Send className="h-3 w-3 text-gray-500" />
                      <p className="text-xs font-outfit font-normal text-gray-900">{campaign.sent}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-gray-500" />
                      <p className="text-xs font-outfit font-normal text-gray-900">{campaign.accepted}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <p className="text-xs font-outfit font-normal text-gray-900">{campaign.sent - campaign.accepted - (campaign.cancelled || 0)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="h-3 w-3 text-gray-500" />
                      <p className="text-[10px] font-inter font-bold text-gray-900">{campaign.responseRate}%</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // 1) compute the flipped status
                    const optimisticStatus = campaign.status === "active" ? "paused" : "active";
                    // 2) apply it immediately
                    setCampaigns((prev: Campaign[]) =>
                      prev.map((c: Campaign) =>
                        c.id === campaign.id ? { ...c, status: optimisticStatus } : c
                      )
                    );
                    // 3) fire the API call, rolling back on error
                    try {
                      onToggleCampaign(
                        campaign.id.toString(),
                        campaign.status,
                        campaign.start_date
                      )
                    } catch (error) {
                      setCampaigns((prev: Campaign[]) =>
                        prev.map((c: Campaign) =>
                          c.id === campaign.id ? { ...c, status: campaign.status } : c
                        )
                      );
                    }
                  }}
                  className={cn(
                    "p-1.5 rounded-lg transition-all duration-200 font-outfit hover:scale-105",
                    campaign.status === "active" ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"
                  )}
                >
                  {campaign.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-black/5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors font-outfit"
          >
            Previous
          </button>
          <span className="text-xs text-gray-600 font-outfit">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-xs rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors font-outfit"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function CampaignCard({
  campaign,
  onToggle,
  onSelect,
}: {
  campaign: Campaign;
  onToggle: (id: number, status: string) => void;
  onSelect: (campaign: Campaign) => void;
}) {
  return (
    <div
      className="group p-5 bg-white rounded-2xl border border-black/5 hover:border-[#0A66C2]/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={() => onSelect(campaign)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-outfit text-gray-900 truncate tracking-tight">
              {campaign.name}
            </h3>
            <span className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 font-outfit tracking-wide",
              campaign.status === "active" && "bg-[#0A66C2]/10 text-[#0A66C2]",
              campaign.status === "paused" && "bg-gray-50 text-gray-600",
              campaign.status === "completed" && "bg-gray-50 text-gray-500",
              campaign.status === "queued" && "bg-amber-50 text-amber-600"
            )}>
              {campaign.status === "active" && <div className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] animate-pulse" />}
              {campaign.status === "paused" && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
              {campaign.status === "completed" && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {campaign.status === "queued" && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-gray-600 font-outfit">
            <div className="flex items-center gap-1.5">
              <Send className="h-4 w-4 text-[#0A66C2]" />
              <span className="font-inter font-bold">{campaign.sent} sent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#0A66C2]" />
              <span className="font-inter font-bold">{campaign.accepted} accepted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-[#0A66C2]" />
              <span className="font-inter font-bold">{campaign.responseRate}% response rate</span>
            </div>
          </div>
        </div>

        <div>
          {campaign.status !== "completed" && (
            <button
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2",
                (campaign.status === "active" || campaign.status === "queued")
                  ? "bg-[#0A66C2] hover:bg-[#0A66C2]/90"
                  : "bg-gray-200 hover:bg-gray-300"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onToggle(campaign.id, campaign.status);
              }}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                  (campaign.status === "active" || campaign.status === "queued")
                    ? "translate-x-6"
                    : "translate-x-1"
                )}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  switch (status) {
    case "up":
      return (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-[#0A66C2]/5 text-[#0A66C2] text-[10px] font-medium rounded font-outfit leading-none">
          <div className="w-1 h-1 rounded-full bg-[#0A66C2] animate-pulse" />
          <span>Active</span>
        </span>
      );
    case "down":
      return (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-medium rounded font-outfit leading-none">
          <div className="w-1 h-1 rounded-full bg-gray-400" />
          <span>Paused</span>
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-medium rounded font-outfit leading-none">
          <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Done</span>
        </span>
      );
    default:
      return null;
  }
}
