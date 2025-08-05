"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Settings, User, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "General",
    href: "/settings",
    icon: Settings
  },
  {
    name: "Profile",
    href: "/settings/profile",
    icon: User
  },
  {
    name: "Scale",
    href: "/settings/automate",
    icon: TrendingUp
  }
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col h-full">
          <div className="flex-1 py-6 px-4">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                      isActive
                        ? "text-black bg-gray-50"
                        : "text-gray-600 hover:text-black hover:bg-gray-50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 pl-64">
        <div className="max-w-6xl mx-auto min-h-screen w-full">
          {children}
        </div>
      </div>
    </div>
  );
} 