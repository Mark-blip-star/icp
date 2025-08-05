import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  variant?: "spinner" | "dots" | "pulse" | "wave" | "bounce";
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "white" | "black";
  className?: string;
  text?: string;
}

export function Loading({
  variant = "spinner",
  size = "md",
  color = "primary",
  className,
  text,
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const colorClasses = {
    primary: "border-[#0A66C2] text-[#0A66C2]",
    secondary: "border-gray-400 text-gray-400",
    white: "border-white text-white",
    black: "border-black text-black",
  };

  const renderSpinner = () => {
    const trackColor = {
      primary: "border-gray-200",
      secondary: "border-gray-200",
      white: "border-white/30",
      black: "border-black/10",
    }[color];

    const topColor = {
      primary: "border-t-[#0A66C2]",
      secondary: "border-t-gray-400",
      white: "border-t-white",
      black: "border-t-black",
    }[color];

    return (
      <div
        className={cn(
          "animate-spin rounded-full border-2",
          trackColor,
          topColor,
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="loading"
      />
    );
  };

  const renderDots = () => (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "rounded-full animate-pulse",
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-2 w-2",
            size === "lg" && "h-2.5 w-2.5",
            size === "xl" && "h-3 w-3",
            color === "primary" && "bg-[#0A66C2]",
            color === "secondary" && "bg-gray-400",
            color === "white" && "bg-white",
            color === "black" && "bg-black"
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.5s",
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        "rounded-full animate-pulse",
        sizeClasses[size],
        color === "primary" && "bg-[#0A66C2]",
        color === "secondary" && "bg-gray-400",
        color === "white" && "bg-white",
        color === "black" && "bg-black",
        className
      )}
    />
  );

  const renderWave = () => (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-wave",
            size === "sm" && "h-2 w-0.5",
            size === "md" && "h-3 w-1",
            size === "lg" && "h-4 w-1",
            size === "xl" && "h-6 w-1.5",
            color === "primary" && "bg-[#0A66C2]",
            color === "secondary" && "bg-gray-400",
            color === "white" && "bg-white",
            color === "black" && "bg-black"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderBounce = () => (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-bounce rounded-full",
            size === "sm" && "h-1.5 w-1.5",
            size === "md" && "h-2 w-2",
            size === "lg" && "h-2.5 w-2.5",
            size === "xl" && "h-3 w-3",
            color === "primary" && "bg-[#0A66C2]",
            color === "secondary" && "bg-gray-400",
            color === "white" && "bg-white",
            color === "black" && "bg-black"
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "pulse":
        return renderPulse();
      case "wave":
        return renderWave();
      case "bounce":
        return renderBounce();
      default:
        return renderSpinner();
    }
  };

  if (text) {
    return (
      <div className="flex flex-col items-center gap-3">
        {renderLoader()}
        <p className={cn(
          "text-sm font-outfit",
          color === "primary" && "text-[#0A66C2]",
          color === "secondary" && "text-gray-500",
          color === "white" && "text-white",
          color === "black" && "text-black"
        )}>
          {text}
        </p>
      </div>
    );
  }

  return renderLoader();
}

// Convenience components for common use cases
export function LoadingSpinner(props: Omit<LoadingProps, "variant">) {
  return <Loading variant="spinner" {...props} />;
}

export function LoadingDots(props: Omit<LoadingProps, "variant">) {
  return <Loading variant="dots" {...props} />;
}

export function LoadingPulse(props: Omit<LoadingProps, "variant">) {
  return <Loading variant="pulse" {...props} />;
}

export function LoadingWave(props: Omit<LoadingProps, "variant">) {
  return <Loading variant="wave" {...props} />;
}

export function LoadingBounce(props: Omit<LoadingProps, "variant">) {
  return <Loading variant="bounce" {...props} />;
} 