/** @format */
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Message = {
  success?: string;
  error?: string;
  message?: string;
  data?: Record<string, any>;
};

export function FormMessage({ message }: { message: Message }) {
  if (!message || Object.keys(message).length === 0) return null;

  return (
    <div className="flex flex-col gap-2 w-full text-base">
      {message.success && (
        <div className={cn(
          "flex items-center gap-2 p-4 rounded-xl border border-[#0A66C2]/20",
          "bg-[#0A66C2]/5 text-[#0A66C2] font-outfit"
        )}>
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{message.success}</span>
        </div>
      )}
      {message.error && (
        <div className={cn(
          "flex items-center gap-2 p-4 rounded-xl border border-red-200",
          "bg-red-50 text-red-600 font-outfit"
        )}>
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{message.error}</span>
        </div>
      )}
      {message.message && !message.success && !message.error && (
        <div className={cn(
          "flex items-center gap-2 p-4 rounded-xl border border-[#0A66C2]/20",
          "bg-[#0A66C2]/5 text-[#0A66C2] font-outfit"
        )}>
          <span>{message.message}</span>
        </div>
      )}
    </div>
  );
}
