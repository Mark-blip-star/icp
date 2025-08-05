import {
  ArrowLeft,
  Calendar,
  Search,
  Users,
  Send,
  TrendingUp,
  ExternalLink, Lock,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

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
  end_date: string;
  start_date: string;
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
  isSubscribed?: boolean;
}

export function CampaignDetails({ campaign, onBack, isSubscribed }: CampaignDetailsProps) {
  const [activeTab, setActiveTab] = useState<"settings" | "contacts">("contacts");
  const [connections, setConnections] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const formatDate = (dateString: string) =>{
    if (!dateString) return "End date not specified";
    return  new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

   

  const tabs = [
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "settings", label: "Settings", icon: Search },
  ] as const;

  useEffect(() => {
    if (!campaign?.id) return;

    setLoading(true);
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
        setConnections(parsed);
      } else {
        console.error("Failed to load connections:", json.error);
      }
      })
      .catch((err) => console.error("Unexpected error:", err))
      .finally(() => setLoading(false));
  }, [campaign.id]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white rounded-xl border border-black/10 " >
      {/* Header */}
      <div className="flex flex-col p-4 border-b border-black/10 flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onBack}
            className="hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-center min-w-0">
            <h2 className="text-2xl font-bold font-rufina truncate">{campaign.name}</h2>
            <div className="flex items-center justify-center gap-3 text-gray-500 text-sm font-outfit mt-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span>
                  {formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}
                </span>
              </div>
              <span className="text-gray-300">•</span>
              <span className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 font-outfit uppercase tracking-wide",
                campaign.status === "active" && "bg-[#0A66C2]/10 text-[#0A66C2]",
                campaign.status === "paused" && "bg-gray-100 text-gray-600",
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
                {campaign.status === "active" ? "ACTIVE" : 
                 campaign.status === "paused" ? "PAUSED" : 
                 campaign.status === "completed" ? "COMPLETED" :
                 campaign.status === "queued" ? "SCHEDULED" :
                 campaign.status.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="w-8" />
        </div>


        {/* Tabs */}
        <div className="flex gap-2 mt-4 justify-center">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all border font-outfit",
                activeTab === id
                  ? "bg-[#0A66C2] text-white border-[#0A66C2] shadow-md"
                  : "border-black/10 text-gray-600 hover:border-black/30 hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "settings" && (
          <div className="h-full overflow-y-auto">
            <div className="space-y-6 px-2 py-2">
              <div className="bg-white rounded-xl border border-black/10 p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Keywords
                </h3>
                <div className="font-mono text-sm p-3 rounded-lg bg-gray-50 border border-gray-200">
                {(campaign.linkedin_url.match(/(?<=keywords=)[^&]+/) || [''])[0]}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="h-full flex flex-col ">
            <div className="overflow-y-auto ">
              <div className="pr-8 p-4 ">
              <table className="w-full text-sm border-collapse">
  <thead>
    <tr className="bg-gradient-to-b from-gray-50 to-white border-b border-black/10 rounded-t-lg shadow-sm">
      <th className="text-left p-3 font-semibold">Status</th>
      <th className="text-left p-3 font-semibold">Name</th>
      <th className="text-left p-3 font-semibold">Headline</th>
      <th className="text-left p-3 font-semibold">Company</th>
      <th className="text-left p-3 font-semibold">Last message</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-100">
    {loading ? (
      <tr>
        <td colSpan={5} className="text-center py-10 text-gray-500">Loading...</td>
      </tr>
    ) : connections.length === 0 ? (
      <tr>
        <td colSpan={5} className="text-center py-10 text-gray-500">No connections found.</td>
      </tr>
    ) : (
      connections.map((person) => (
        <tr
          key={person.id}
          className="bg-white hover:shadow-md transition cursor-pointer"
        >
           <td className="p-3">
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                person.status === "queued" && "bg-blue-50 text-blue-600",
                person.status === "pending" && "bg-yellow-50 text-yellow-700",
                person.status === "invited" && "bg-yellow-50 text-yellow-700",
                person.status === "connected" && "bg-green-50 text-green-600",
                person.status === "messaged" && "bg-purple-50 text-purple-600"
              )}
            >
                {person.status === "queued" ? "Awaiting request acceptance" : 
                 person.status === "pending" ? "Awaiting request acceptance" : 
                 person.status === "invited" ? "Awaiting request acceptance" : 
                 person.status === "connected" ? "Connection established" : 
                 person.status === "messaged" ? "Message sent" : person.status}
            </span>
          </td>
          <td className="p-3">
            <div className="flex items-center gap-2 max-w-[200px] truncate">
              <span className="truncate">{person.name}</span>
              <a
                href={person.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded-md transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </td>
          <td className="p-3">
            <div className="truncate max-w-[150px]">{person.headline}</div>
          </td>
          <td className="p-3">
            <div className="truncate max-w-[150px]">{person.company}</div>
          </td>
          <td className="p-3">
            <div className="truncate max-w-[200px]">{person.lastMessage}</div>
          </td>
         
        </tr>
      ))
    )}
  </tbody>
</table>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
