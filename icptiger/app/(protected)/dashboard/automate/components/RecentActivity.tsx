import {
  UserPlus, // for followRequest
  CheckCircle2, // for followResponse
  MessageSquare, // for sendMessage
  CornerDownRight, // for followup_message_send
  CornerDownLeft, // for second_followup_message_send
  HelpCircle, // fallback
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { LoadingSpinner } from "@/components/ui/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRealtime } from "@/app/context/realtime-context";

interface Activity {
  id: number;
  type: string;
  message: string;
  timestamp: string;
  status: "info" | "warn" | "error" | "success" | "pending";
  target_name?: string | null;
  profile_url?: string | null;
}

interface RecentActivityProps {
  activities?: Activity[];
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { activities: realtimeActivities = [] } = useRealtime();

  // Fetch logs (with offset for infinite scroll)
  const fetchLogs = async (isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);
    const params = new URLSearchParams({
      limit: "20",
      offset: isLoadMore ? String(activities.length) : "0",
      job_type: activeFilter === "all" ? "all" : activeFilter,
    });
    try {
      const res = await fetch(`/api/logs?${params.toString()}`);
      const json = await res.json();
      const newLogs: Activity[] = (json.logs || []).map((log: any) => ({
        id: log.id,
        type: log.job_type,
        message: log.message,
        timestamp: log.created_at,
        status: log.log_level as "info" | "warn" | "error" | "success" | "pending",
        target_name: null,
        profile_url: log.context?.profile || null,
      }));
      if (isLoadMore) {
        setActivities(prev => [...prev, ...newLogs]);
      } else {
        setActivities(newLogs);
      }
      setHasMore(newLogs.length === 20);
    } catch {
      if (!isLoadMore) setActivities([]);
      setHasMore(false);
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    // Do not clear activities before fetching to prevent flicker
    setHasMore(false);
    fetchLogs(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || loading || loadingMore || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      fetchLogs(true);
    }
  }, [loading, loadingMore, hasMore, activities.length, activeFilter]);

  // Attach scroll listener
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Real-time: refetch first page when realtimeActivities changes
  useEffect(() => {
    // Only refetch if not loading and not on initial mount
    if (!loading && !loadingMore) {
      // Do not clear activities before fetching to prevent flicker
      fetchLogs(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realtimeActivities]);

  // Helper: Deduplicate activities by message, profile_url, and status (keep most recent)
  function deduplicateActivities(activities: Activity[]): Activity[] {
    const seen = new Map<string, Activity>();
    for (const activity of activities) {
      // Compose a unique key for each activity
      const key = `${activity.message}|${activity.profile_url || ''}|${activity.status}`;
      // Only keep the most recent (assuming activities are sorted by timestamp descending)
      if (!seen.has(key)) {
        seen.set(key, activity);
      }
    }
    return Array.from(seen.values());
  }

  function ActivityIcon({ type, status }: { type?: string, status?: string }) {
    switch (type) {
      case 'followRequest':
        return <UserPlus className="h-4 w-4 text-blue-500" title="Connection Sent" />;
      case 'followResponse':
        return <CheckCircle2 className="h-4 w-4 text-green-500" title="Accepted" />;
      case 'sendMessage':
        return <MessageSquare className="h-4 w-4 text-purple-500" title="Message Sent" />;
      case 'followup_message_send':
        return <CornerDownRight className="h-4 w-4 text-orange-500" title="Follow-up Sent" />;
      case 'second_followup_message_send':
        return <CornerDownLeft className="h-4 w-4 text-pink-500" title="Second Follow-up Sent" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-400" title="Other Activity" />;
    }
  }

  const filterOptions = [
    { value: "all", label: "All Activities" },
    { value: "followRequest", label: "Sent Requests" },
    { value: "followResponse", label: "Accepted" },
    { value: "sendMessage", label: "Messages" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="w-full flex flex-row items-center py-2 px-4 flex-shrink-0 gap-4">
        <div className="flex flex-col min-w-[180px]">
          <h2 className="text-xl font-recoleta font-black text-gray-900 mb-1 tracking-tight">Activity</h2>
          <p className="text-gray-500 text-sm font-outfit font-light">See what's happening</p>
        </div>
        <div className="ml-auto">
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-auto min-w-[100px] bg-white font-outfit focus:ring-0 focus:ring-offset-0 focus:outline-none px-2 [&>svg]:ml-1 border-none">
              <SelectValue placeholder="Filter activities" />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-outfit">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col" ref={scrollContainerRef}>
        {activities.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-4">
            <p className="text-sm text-center max-w-md font-outfit mb-4">
              Your connection activities will appear here
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-0">
            {deduplicateActivities(activities).map((activity) => (
              <div key={activity.id}>
                <div className="flex items-start gap-3 py-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <ActivityIcon type={activity.type} status={activity.status} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-outfit font-normal text-gray-900 truncate">
                        {(() => {
                          // Helper to render name + icon
                          const renderNameWithIcon = (name: string, profileUrl?: string | null) => (
                            <span className="inline-flex items-center gap-0.5">
                              <span>{name}</span>
                              {profileUrl && (
                                <a
                                  href={profileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="View LinkedIn profile"
                                  className="text-[#0A66C2] hover:text-[#0A66C2]/80 p-0.5 hover:bg-[#0A66C2]/5 rounded transition-colors"
                                >
                                  {/* Fix ExternalLink import if needed */}
                                  <svg className="h-3 w-3 align-middle relative top-[1px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m7-1V7m0 0h-4m4 0L10 17" /></svg>
                                </a>
                              )}
                            </span>
                          );
                          // Case 0: Message like 'Name accepted your connection request'
                          const acceptedMatch = activity.message.match(/^([A-Za-z .'-]+) accepted your connection request$/);
                          if (acceptedMatch) {
                            const name = acceptedMatch[1];
                            return <>{renderNameWithIcon(name, activity.profile_url)} accepted your connection request</>;
                          }
                          // Case 1: Message starts with 'Name - ...'
                          const nameHyphenMatch = activity.message.match(/^([A-Za-z .'-]+) - (.+)$/);
                          if (nameHyphenMatch) {
                            const name = nameHyphenMatch[1];
                            const rest = nameHyphenMatch[2];
                            return <>{renderNameWithIcon(name, activity.profile_url)} - {rest}</>;
                          }
                          // Case 2: Sent ... to Name - ...
                          const match = activity.message.match(/^(Sent (?:1st|2nd) follow-up message to |Sent connection request to |Sent message to |)([A-Za-z .'-]+?)(?:\s-.*)?$/);
                          if (match) {
                            const prefix = match[1] || '';
                            const name = match[2] || '';
                            return <>{prefix}{renderNameWithIcon(name, activity.profile_url)}</>;
                          }
                          return activity.message;
                        })()}
                      </p>
                      <span className="text-[10px] text-gray-500 font-outfit whitespace-nowrap">
                        {activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" color="primary" />
                <span className="ml-2 text-sm text-gray-500 font-outfit">Loading more activities...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
