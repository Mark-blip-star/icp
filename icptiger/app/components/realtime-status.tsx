"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { useRealtime } from '@/app/context/realtime-context';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

export function RealtimeStatus() {
  const { isConnected } = useRealtime();

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full",
        isConnected 
          ? "bg-green-50 text-green-600" 
          : "bg-gray-50 text-gray-500"
      )}>
        {isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            <span>Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            <span>Offline</span>
          </>
        )}
      </div>
    </div>
  );
}

export function RealtimeIndicator() {
  const { isConnected } = useRealtime();

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 text-xs text-green-600">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      <span>Live updates</span>
    </div>
  );
} 