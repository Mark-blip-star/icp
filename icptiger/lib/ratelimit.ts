import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";

// Create a new ratelimiter instance
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, "24 h"),
  prefix: "ai_ratelimit",
});

const photosRateLimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(100, "24 h"),
  prefix: "photos_ai_ratelimit",
});

export type RateLimitResponse = NextResponse<any>;

export async function checkRateLimit(userId: string): Promise<RateLimitResponse | null> {
  try {
    const result = await ratelimit.limit(`user_${userId}`);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily rate limit exceeded. Please try again tomorrow.",
          reset: result.reset,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": result.reset.toString(),
            "Retry-After": result.reset.toString(),
          },
        },
      );
    }

    // Return null if rate limit check passes
    return null;
  } catch (error) {
    console.error("Rate limiting error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Rate limiting error",
      },
      { status: 500 },
    );
  }
}

export async function checkPhotosRateLimit(userId: string): Promise<RateLimitResponse | null> {
  try {
    const result = await photosRateLimit.limit(`user_${userId}_photos`);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Daily rate limit exceeded. Please try again tomorrow.",
          reset: result.reset,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": result.reset.toString(),
            "Retry-After": result.reset.toString(),
          },
        },
      );
    }

    // Return null if rate limit check passes
    return null;
  } catch (error) {
    console.error("Rate limiting error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Rate limiting error",
      },
      { status: 500 },
    );
  }
}
