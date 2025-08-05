/**
 * Feature Flags Configuration
 * 
 * This file controls the visibility of various features on the site.
 * Set environment variables to override defaults, or modify the defaults here.
 */

export interface FeatureFlags {
  showAuthOptions: boolean;
  showVideoDemos: boolean;
  showTrustedBySection: boolean;
}

/**
 * Get feature flags from environment variables with fallback to defaults
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    // Controls login/signup buttons and authentication-related UI
    showAuthOptions: process.env.NEXT_PUBLIC_FEATURE_AUTH_OPTIONS === 'true' || false,
    
    // Controls the video demos section on the landing page
    showVideoDemos: process.env.NEXT_PUBLIC_FEATURE_VIDEO_DEMOS === 'true' || false,
    
    // Controls the "Trusted by Entrepreneurs & Startups" section on the pricing page
    showTrustedBySection: process.env.NEXT_PUBLIC_FEATURE_TRUSTED_BY_SECTION === 'true' || false,
  };
}

/**
 * Hook to get feature flags in client components
 */
export function useFeatureFlags(): FeatureFlags {
  return getFeatureFlags();
} 