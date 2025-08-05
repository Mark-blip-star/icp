"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  title: string;
  message: string;
  avatarUrl?: string;
  location?: string;
}

export default function TestimonialCard({
  name,
  title,
  message,
  avatarUrl,
  location,
}: TestimonialCardProps) {
  return (
    <div className="glass-card max-w-xs mx-auto flex flex-col gap-3 relative min-h-[180px] pb-7">
      <div className="flex items-center gap-2">
        <Avatar>
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback>{name[0]}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <div className="font-semibold text-base leading-tight">
            {name}
          </div>
          <div className="text-xs text-gray-500 font-medium">{title}</div>
        </div>
      </div>
      <div className="text-sm text-gray-900 font-outfit leading-relaxed">{message}</div>
      <Image src="/linkedin.png" alt="LinkedIn" width={16} height={16} className="inline-block absolute bottom-3 right-3 pointer-events-none select-none" />
    </div>
  );
} 