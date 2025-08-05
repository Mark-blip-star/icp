# Feature Flags

This project uses feature flags to control the visibility of certain features on the site. This allows you to easily enable or disable features without code changes.

## Available Feature Flags

### `NEXT_PUBLIC_FEATURE_AUTH_OPTIONS`
- **Description**: Controls the visibility of login/signup buttons and authentication-related UI
- **Default**: `false` (disabled)
- **Usage**: Set to `'true'` to enable authentication options in the header
- **Behavior**: 
  - When `true`: Shows login/signup buttons, "Get Started" buttons redirect to `/sign-up` or `/auth`
  - When `false`: Hides auth buttons, all "Get Started" buttons redirect to `/pricing`

### `NEXT_PUBLIC_FEATURE_VIDEO_DEMOS`
- **Description**: Controls the visibility of the video demos section on the landing page
- **Default**: `false` (disabled)
- **Usage**: Set to `'true'` to show the HeroVideos component on the main page

### `NEXT_PUBLIC_FEATURE_TRUSTED_BY_SECTION`
- **Description**: Controls the visibility of the "Trusted by Entrepreneurs & Startups" section on the pricing page
- **Default**: `false` (disabled)
- **Usage**: Set to `'true'` to show the testimonials and trust signals section on the pricing page
- **Behavior**: 
  - When `true`: Shows the full "Trusted by Entrepreneurs & Startups" section with testimonial and trust signals
  - When `false`: Hides the entire section, making the pricing page more focused on pricing information

## How to Use

### Environment Variables
Add these to your `.env.local` file:

```bash
# Enable authentication options (login/signup buttons)
NEXT_PUBLIC_FEATURE_AUTH_OPTIONS=true

# Enable video demos section
NEXT_PUBLIC_FEATURE_VIDEO_DEMOS=true

# Enable trusted by section on pricing page
NEXT_PUBLIC_FEATURE_TRUSTED_BY_SECTION=true
```

### Code Usage
The feature flags are managed through the `lib/feature-flags.ts` file:

```typescript
import { getFeatureFlags, useFeatureFlags } from '@/lib/feature-flags';

// In server components
const featureFlags = getFeatureFlags();

// In client components
const featureFlags = useFeatureFlags();

// Usage
if (featureFlags.showAuthOptions) {
  // Show authentication UI
}

if (featureFlags.showVideoDemos) {
  // Show video demos section
}

if (featureFlags.showTrustedBySection) {
  // Show trusted by section on pricing page
}
```

## Current Implementation

- **Header Component**: Uses `showAuthOptions` to control login/signup buttons and redirect behavior
- **Hero Component**: Uses `showAuthOptions` to determine main CTA button destination
- **Main Page**: Uses `showVideoDemos` to control the HeroVideos section
- **SafetySection Component**: Uses `showAuthOptions` to determine CTA button destination
- **Footer Component**: Uses `showAuthOptions` to determine "Get Started" link destination
- **Pricing Page**: Uses `showTrustedBySection` to control the "Trusted by Entrepreneurs & Startups" section
- **Default State**: All flags are disabled by default for the launch

## Button Redirect Behavior

When `NEXT_PUBLIC_FEATURE_AUTH_OPTIONS=false` (default for launch):
- All "Get Started" buttons redirect to `/pricing`
- No login/signup buttons are shown
- Users are directed to pricing to learn about the product

When `NEXT_PUBLIC_FEATURE_AUTH_OPTIONS=true`:
- "Get Started" buttons redirect to `/sign-up` or `/auth` as appropriate
- Login/signup buttons are visible in the header
- Full authentication flow is available

## Pricing Page Behavior

When `NEXT_PUBLIC_FEATURE_TRUSTED_BY_SECTION=false` (default for launch):
- The "Trusted by Entrepreneurs & Startups" section is hidden
- Pricing page focuses purely on pricing information and benefits
- Cleaner, more focused user experience for launch

When `NEXT_PUBLIC_FEATURE_TRUSTED_BY_SECTION=true`:
- Shows testimonials and trust signals
- Full social proof section is displayed
- More comprehensive pricing page experience

## Adding New Feature Flags

1. Add the new flag to the `FeatureFlags` interface in `lib/feature-flags.ts`
2. Add the environment variable check in the `getFeatureFlags()` function
3. Use the flag in your components as needed
4. Document the new flag in this file 