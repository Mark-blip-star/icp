import {
  ArrowLeft,
  Calendar,
  Search,
  Users,
  Send,
  TrendingUp,
  ExternalLink, Lock,
  Pause,
  Play,
  Clock,
  Settings as SettingsIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { formatUrlForDisplay } from "@/utils/utils";
import { X } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";


interface Person {
  id: number;
  name: string;
  headline: string;
  company: string;
  lastMessage: string;
  status: string;
  profileUrl: string;
}

interface Campaign {
  end_date: string | number | Date;
  start_date: string | number | Date;
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
  status: string;
  linkedin_url: string;
  connection_message: string;
  follow_up_message: string;
  second_follow_up_message: string;
  follow_up_days: number;
  second_follow_up_days: number;
}

interface CampaignDetailsProps {
  campaign: Campaign;
  onBack: () => void;
  onToggleCampaign: (id: string, status?: string, startDate?: string) => void;
  isSubscribed?: boolean;
}

export function CampaignDetails({ campaign, onBack, onToggleCampaign, isSubscribed }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState<"settings" | "contacts">("contacts");
  const [connections, setConnections] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [localCampaign, setLocalCampaign] = useState(campaign);
  const [cancelledIds, setCancelledIds] = useState<number[]>([]);

  const formatDate = (dateInput: string | number | Date) =>{
    if (!dateInput) return "—";
    const dateString = typeof dateInput === 'string' ? dateInput : dateInput.toString();
    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return "—";
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const formatDateTime = (dateInput: string | number | Date) => {
    if (!dateInput) return "—";
    const dateString = typeof dateInput === 'string' ? dateInput : dateInput.toString();
    if (!dateString || dateString === 'null' || dateString === 'undefined') return "—";
    // If the string contains both date and time (e.g., 2025-07-09T23:45)
    const match = dateString.match(/(\d{4}-\d{2}-\d{2})([T ](\d{2}:\d{2}))/);
    if (match) {
      const [_, datePart, , timePart] = match;
      const [year, month, day] = datePart.split('-');
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year} ${timePart}`;
    }
    // If only date is present
    const dateOnlyMatch = dateString.match(/(\d{4}-\d{2}-\d{2})/);
    if (dateOnlyMatch) {
      const [datePart] = dateOnlyMatch;
      const [year, month, day] = datePart.split('-');
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
    }
    return "—";
  };


  useEffect(() => {
  setLocalCampaign(campaign);
}, [campaign]);
   

  const tabs = [
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "settings", label: "Settings", icon: Search },
  ] as const;

  useEffect(() => {
    if (!campaign?.id) return;

    setLoading(true);
    
    // Demo data for LinkedIn Growth Network campaign
    if (campaign.id === 1) {
      const demoConnections = [
        {
          id: 1,
          name: "Alex Chen",
          headline: "Senior Software Engineer",
          company: "Stripe",
          lastMessage: "Sent follow-up message about Senior Software Engineer role.",
          status: "followup_message_send",
          profileUrl: "https://linkedin.com/in/alex-chen-stripe",
        },
        {
          id: 2,
          name: "Sarah Rodriguez",
          headline: "Senior Full Stack Engineer",
          company: "Airbnb",
          lastMessage: "Accepted your connection request.",
          status: "connected",
          profileUrl: "https://linkedin.com/in/sarah-rodriguez-airbnb",
        },
        {
          id: 3,
          name: "Michael Kim",
          headline: "Senior Backend Engineer",
          company: "Uber",
          lastMessage: "Sent follow-up message about Senior Software Engineer role.",
          status: "followup_message_send",
          profileUrl: "https://linkedin.com/in/michael-kim-uber",
        },
        {
          id: 4,
          name: "Priya Patel",
          headline: "Senior Frontend Engineer",
          company: "Netflix",
          lastMessage: "Sent follow-up message about Senior Software Engineer role.",
          status: "followup_message_send",
          profileUrl: "https://linkedin.com/in/priya-patel-netflix",
        },
        {
          id: 5,
          name: "David Wilson",
          headline: "Senior Software Engineer",
          company: "Spotify",
          lastMessage: "Sent follow-up message about Senior Software Engineer role.",
          status: "followup_message_send",
          profileUrl: "https://linkedin.com/in/david-wilson-spotify",
        },
        {
          id: 6,
          name: "Elena Petrov",
          headline: "Senior Systems Engineer",
          company: "DoorDash",
          lastMessage: "Sent follow-up message about Senior Software Engineer role.",
          status: "followup_message_send",
          profileUrl: "https://linkedin.com/in/elena-petrov-doordash",
        },
        {
          id: 7,
          name: "Carlos Mendez",
          headline: "Senior Platform Engineer",
          company: "Slack",
          lastMessage: "Sent connection request for Senior Software Engineer role.",
          status: "sent",
          profileUrl: "https://linkedin.com/in/carlos-mendez-slack",
        },
        {
          id: 8,
          name: "Lisa Thompson",
          headline: "Senior Software Engineer",
          company: "Pinterest",
          lastMessage: "Sent follow-up message about Senior Software Engineer role.",
          status: "followup_message_send",
          profileUrl: "https://linkedin.com/in/lisa-thompson-pinterest",
        },
      ];
      
      setConnections(demoConnections);
      setLoading(false);
      return;
    }

    fetch(`/api/campaigns/fetch-connections?campaignId=${campaign.id}`)
      .then((res) => res.json().then((json) => ({ ok: res.ok, json })))
      .then(({ ok, json }) => {
      if (ok) {
        const parsed = json.data
        .filter((entry: any) => entry.first_name) // Filter out entries without a first_name
        .map((entry: any) => ({
          id: entry.id,
          name: entry.display_name.split("View")[0] || `${entry.first_name} ${entry.last_name}`,
          headline: entry.headline,
          company: entry.current_company,
          lastMessage: entry.last_message || "No messages yet",
          status: entry.status,
          profileUrl: entry.profile_url,
        }));
       setConnections((prevConnections) => {
  return parsed.map((person: any) => {
    const wasCancelled = prevConnections.find(
      (p) => p.id === person.id && p.status === "cancelled"
    );
    return wasCancelled ? { ...person, status: "cancelled" } : person;
  });
});
      } else {
        console.error("Failed to load connections:", json.error);
      }
      })
      .catch((err) => console.error("Unexpected error:", err))
      .finally(() => setLoading(false));
  }, [campaign.id]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white rounded-xl">
      {/* Header */}
      <div className="flex flex-col flex-shrink-0 py-2 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
          <div className="flex flex-col gap-1 max-w-[320px] min-w-0">
            <h2 className="text-xl font-recoleta font-black text-gray-900 tracking-tight truncate">{campaign.name}</h2>
            <p className="text-gray-500 text-sm font-outfit font-light whitespace-nowrap overflow-hidden text-ellipsis">View and manage your campaign</p>
          </div>
          <div className="w-full sm:w-auto flex items-center justify-center">
            <div className="flex w-full sm:w-auto">
              <button
                onClick={() => setActiveTab("contacts")}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-outfit font-medium transition-all duration-200",
                  activeTab === "contacts"
                    ? "text-[#0A66C2] font-bold"
                    : "text-gray-500 hover:text-[#0A66C2]"
                )}
                style={{ minWidth: 100 }}
              >
                <Users className="w-4 h-4 mr-1" /> Contacts
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-outfit font-medium transition-all duration-200",
                  activeTab === "settings"
                    ? "text-[#0A66C2] font-bold"
                    : "text-gray-500 hover:text-[#0A66C2]"
                )}
                style={{ minWidth: 100 }}
              >
                <SettingsIcon className="w-4 h-4 mr-1" /> Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {activeTab === "contacts" ? (
            /* Contacts Section */
            <div>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <LoadingSpinner size="sm" color="primary" />
                </div>
              ) : connections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-500">
                  <div className="w-12 h-12 bg-[#0A66C2]/10 rounded-full flex items-center justify-center mb-3">
                    <Users className="h-6 w-6 text-[#0A66C2]" />
                  </div>
                  <p className="text-sm font-outfit font-medium text-gray-700 mb-1">Your campaign is starting soon</p>
                  <p className="text-xs font-outfit text-gray-500 text-center max-w-xs">We'll begin connecting with your target audience according to your campaign schedule</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connections.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Left: Name, Headline, Company */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p className="text-sm font-bold text-gray-900 font-outfit truncate">{person.name}</p>
                          <a
                            href={person.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0A66C2] hover:text-[#0A66C2]/80 p-0.5 hover:bg-[#0A66C2]/5 rounded transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 font-outfit truncate">{person.headline}</p>
                        <p className="text-xs text-gray-400 font-outfit truncate mt-0.5">{person.company}</p>
                      </div>

                      {/* Right: Status badge and X */}
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium font-outfit",
                          (person.status === "queued" || person.status === "invited" || person.status === "pending") && "bg-gray-100 text-gray-700",
                          person.status === "connected" && "bg-green-100 text-green-700",
                          person.status === "followup_message_send" && "bg-gray-100 text-gray-700",
                          person.status === "second_followup_message_send" && "bg-gray-100 text-gray-700",
                          person.status === "cancelled" && "bg-gray-200 text-gray-400"
                        )}>
                          {(person.status === "queued" || person.status === "invited" || person.status === "pending") && "Request sent"}
                          {person.status === "connected" && "Connected"}
                          {person.status === "followup_message_send" && "1st follow-up sent"}
                          {person.status === "second_followup_message_send" && "2nd follow-up sent"}
                          {person.status === "cancelled" && "Cancelled"}
                        </span>
                        <X
                          className={cn(
                            "h-4 w-4 cursor-pointer transition-colors",
                            cancelledIds.includes(person.id)
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-400 hover:text-red-500"
                          )}
                          onClick={() => {
                            if (cancelledIds.includes(person.id)) return; // prevent re-cancel

                            // Optimistically update UI
                            setConnections((prev) =>
                              prev.map((p) =>
                                p.id === person.id ? { ...p, status: "cancelled" } : p
                              )
                            );
                            setCancelledIds((prev) => [...prev, person.id]);

                            // Fire cancellation API (no rollback needed)
                            fetch("/api/connect/cancel", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ connectionId: person.id }),
                            }).catch((err) => {
                              console.error("Failed to cancel:", err);
                              // Optional: remove from cancelledIds if you want to retry
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Campaign Settings Section */
            <div className="space-y-8">
              {/* Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-outfit font-medium text-gray-700 uppercase tracking-wide mb-4">Settings</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <span className="text-sm text-gray-600">Search Query</span>
                  <span className="flex flex-col items-end gap-1">
                    {typeof campaign.linkedin_url === 'string' ? (
                      <>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full max-w-xs">
                          <a
                            href={campaign.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="truncate text-[#0A66C2] text-sm hover:underline flex-1"
                            title={campaign.linkedin_url}
                          >
                            {formatUrlForDisplay(String(campaign.linkedin_url))}
                          </a>
                          <button
                            type="button"
                            className="ml-1 text-gray-400 hover:text-[#0A66C2] focus:outline-none"
                            onClick={() => {
                              navigator.clipboard.writeText(campaign.linkedin_url);
                            }}
                            title="Copy URL"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                          </button>
                          <a
                            href={campaign.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-gray-400 hover:text-[#0A66C2]"
                            title="Open in new tab"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          </a>
                        </div>
                        {(() => {
                          try {
                            const keywords = new URL(campaign.linkedin_url).searchParams.get("keywords");
                            return keywords ? (
                              <span className="inline-flex items-center bg-gray-100 text-gray-700 text-xs font-medium rounded-md px-2 py-1 mt-1">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {keywords}
                              </span>
                            ) : null;
                          } catch {
                            return null;
                          }
                        })()}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">No search URL available</span>
                    )}
                  </span>
                  <span className="text-sm text-gray-600">Start Date</span>
                  <span className="text-sm text-gray-900 text-right font-medium">{formatDateTime(String(campaign.start_date))}</span>
                  <span className="text-sm text-gray-600">End Date</span>
                  <span className="text-sm text-gray-900 text-right font-medium">{formatDateTime(String(campaign.end_date))}</span>
                </div>
              </div>
              {/* Messages */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-outfit font-medium text-gray-700 uppercase tracking-wide mb-4">Messages</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Connection Message</p>
                    <div className="bg-gray-50 p-3 rounded border text-sm text-gray-900 font-outfit whitespace-pre-line">{campaign.connection_message}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Follow-up Message</p>
                    <div className="bg-gray-50 p-3 rounded border text-sm text-gray-900 font-outfit whitespace-pre-line">{campaign.follow_up_message}</div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2 font-medium">Second Follow-up</p>
                    <div className="bg-gray-50 p-3 rounded border text-sm text-gray-900 font-outfit whitespace-pre-line">{campaign.second_follow_up_message}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-black/5">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 font-outfit font-medium flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </button>
        {localCampaign.status === "active" || localCampaign.status === "paused" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 1) Optimistically flip the local state
              const newStatus = localCampaign.status === "active" ? "paused" : "active";
              setLocalCampaign({ ...localCampaign, status: newStatus });
              // 2) Fire the actual toggle (ignore errors)
              onToggleCampaign(
                localCampaign.id.toString(),
                localCampaign.status,
                localCampaign.start_date
              );
            }}
            className={cn(
              "px-4 py-2 text-sm rounded-xl transition-all duration-200 font-outfit font-medium flex items-center gap-2",
              localCampaign.status === "active"
                ? "bg-red-50 text-red-600 hover:bg-red-100 shadow-sm"
                : "bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 shadow-sm hover:shadow-md"
            )}
          >
            {localCampaign.status === "active" ? (
              <>
                <Pause className="h-4 w-4" />
                Pause Campaign
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Resume Campaign
              </>
            )}
          </button>
        ) : localCampaign.status === "queued" ? (
          <span className="text-sm text-gray-500 font-outfit">Scheduled to start at {formatDateTime(String(localCampaign.start_date))}</span>
        ) : null}
      </div>
    </div>
  );
}
