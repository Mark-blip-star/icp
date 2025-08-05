'use client';

import { Send, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Campaign {
  id: string;
  name: string;
  total_profiles: number;
  processed_profiles: number;
  status: "queued" | "active" | "paused" | "completed";
  start_date: string;
  end_date: string;
  sent: number;
  accepted: number;
  responseRate: number;
}

interface CampaignCardProps {
  campaign: Campaign;
  onToggle: (id: string, nextStatus: string) => void;
  onSelect: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onToggle, onSelect }: CampaignCardProps) {
  const now = new Date();
  const startDate = new Date(campaign.start_date);

  // Dynamic Status Logic
  const displayStatus =
    campaign.status === "paused" || campaign.status === "completed"
      ? campaign.status
      : startDate <= now
      ? "active"
      : "queued";

  const handleToggle = () => {
    onToggle(campaign.id, campaign.status)
  };

  return (
    <div
      className="bg-white rounded-xl border border-black/10 p-4 hover:bg-gray-50 transition-all cursor-pointer w-full" 
      onClick={() => onSelect(campaign)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 max-w-[200px]">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium font-fraunces truncate">{campaign.name}</h3>
            <span
              className={cn(
                "px-2 py-0.5 rounded-lg text-xs font-medium flex items-center gap-1 font-outfit",
                displayStatus === "active" && "bg-[#0A66C2]/10 text-[#0A66C2]",
                displayStatus === "paused" && "bg-gray-100 text-gray-600",
                displayStatus === "queued" && "bg-gray-100 text-gray-600",
                displayStatus === "completed" && "bg-gray-50 text-gray-500"
              )}
            >
              {displayStatus === "active" && <div className="w-1 h-1 rounded-full bg-[#0A66C2] animate-pulse" />}
              {displayStatus === "paused" && <div className="w-1 h-1 rounded-full bg-gray-400" />}
              {displayStatus === "queued" && <div className="w-1 h-1 rounded-full bg-gray-400" />}
              {displayStatus === "completed" && (
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 font-outfit">
            <div className="flex items-center gap-1">
              <Send className="h-4 w-4" />
              <span className="font-inter font-bold">{campaign.sent} sent</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-inter font-bold">{campaign.accepted} accepted</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span className="font-inter font-bold">{campaign.responseRate}% response rate</span>
            </div>
          </div>
        </div>

        <div>
          {displayStatus !== "completed" && (
            <button
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors active:scale-95",
                displayStatus === "active" ? "bg-[#0A66C2]" : "bg-gray-300"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
            >
              <span
                className={cn(
                  "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md",
                  displayStatus === "active" ? "translate-x-6" : "translate-x-1"
                )}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
