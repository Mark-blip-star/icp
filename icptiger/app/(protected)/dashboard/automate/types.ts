export interface Campaign {
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
  cancelled: number;
  start_date: string;
  end_date: string;
} 