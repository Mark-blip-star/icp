"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Lock, ArrowLeft, AlertCircle } from "lucide-react";
import { CookiesForm } from "@/components/pages/dashboard/automate/connect";
import {
  StepCard,
  StepIcon,
} from "@/components/pages/dashboard/automate/connect/help";
import { toast } from "sonner";

// Prevent static generation to avoid build-time user context issues
export const dynamic = 'force-dynamic';

/**
 * Page component that guides the user to connect LinkedIn using cookie tokens.
 */
export default function LinkedInTokenGuidePage() {
  const router = useRouter();
  const [tokens, setTokens] = useState({ li_a: "", li_at: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission by storing tokens locally and routing to dashboard.
   * @param {React.FormEvent} e
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      if (!tokens.li_at.trim()) {
        setError("Please enter your li_at cookie value");
        return false;
      }

      try {
        // Clean up cookie values by removing quotes if present
        const cleanLiAt = tokens.li_at
          ? tokens.li_at.replace(/^["']|["']$/g, "")
          : "";
        const cleanLiA = tokens.li_a
          ? tokens.li_a.replace(/^["']|["']$/g, "")
          : "";

        // Prepare data for the API
        const dataToSend = {
          email: "cookie-auth@example.com", // Placeholder email for cookie auth
          li_at: cleanLiAt,
          li_a: cleanLiA,
        };

        // Send data to the API
        const response = await fetch("/api/linkedin/connect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to connect LinkedIn account");
        }

        // Store in localStorage for backward compatibility
        localStorage.setItem("linkedInCredentials", JSON.stringify(dataToSend));
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));

        // Check verification result
        if (result.verification && result.verification.success) {
          toast.success(
            result.verification.message ||
              "LinkedIn account connected successfully!"
          );
        } else {
          toast.warning(
            "LinkedIn account connected but verification failed. Some features may not work correctly."
          );
        }

        router.push("/dashboard/scale");
      } catch (error) {
        console.error("Error connecting LinkedIn account:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Connection failed. Please try again."
        );
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to connect LinkedIn account"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, tokens]
  );

  /**
   * Handles token value change from CookiesForm component.
   * @param {string} key
   * @param {string} value
   */
  const handleTokenChange = useCallback((key: string, value: string) => {
    setTokens((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] overflow-auto">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-[#0A66C2] hover:text-[#0A66C2]/90 hover:bg-[#0A66C2]/10 -ml-2"
              onClick={() => router.push('/dashboard/automate')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Automate
            </Button>
          </div>

          <h1 className="text-3xl font-rufina text-center mb-8 text-[#0A66C2]">
            Connect LinkedIn via Cookies
          </h1>

          <StepCard
            step={1}
            title="Go to LinkedIn"
            description="Open LinkedIn and login with your account."
          >
            <Button
              className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 border-2 border-[#0A66C2] font-outfit transition-all"
              onClick={() => window.open("https://www.linkedin.com", "_blank")}
            >
              Open LinkedIn
            </Button>
          </StepCard>

          <StepCard
            step={2}
            title="Open Developer Tools"
            description="Inspect your browser storage"
          >
            <p className="text-gray-700">
              Right-click anywhere on the LinkedIn page and choose{" "}
              <strong>Inspect</strong> or press <kbd>Ctrl+Shift+I</kbd> (Windows)
              / <kbd>Cmd+Option+I</kbd> (Mac).
            </p>
            <p className="text-gray-700">
              Go to the <strong>Application</strong> tab, then click{" "}
              <strong>Cookies &gt; https://www.linkedin.com</strong>.
            </p>
          </StepCard>

          <StepCard
            step={3}
            title="Find Your Cookies"
            description="Locate and copy your session cookies"
          >
            <p className="text-gray-700">
              Look for the following cookies in the list:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
              <li>
                <code className="bg-[#EAF4FB] px-2 py-1 rounded">li_at</code> - Your
                authentication token
              </li>
              <li>
                <code className="bg-[#EAF4FB] px-2 py-1 rounded">li_a</code> - Your
                session cookie
              </li>
            </ul>
          </StepCard>

          <StepCard
            step={4}
            title="Paste Your Cookies"
            description="Enter your cookies below to connect your account"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="li_at"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    li_at Cookie
                  </label>
                  <input
                    type="text"
                    id="li_at"
                    value={tokens.li_at}
                    onChange={(e) => handleTokenChange("li_at", e.target.value)}
                    className="w-full p-3 border-2 border-[#0A66C2]/20 rounded-xl focus:outline-none focus:border-[#0A66C2] transition-colors"
                    placeholder="Paste your li_at cookie here"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="li_a"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    li_a Cookie
                  </label>
                  <input
                    type="text"
                    id="li_a"
                    value={tokens.li_a}
                    onChange={(e) => handleTokenChange("li_a", e.target.value)}
                    className="w-full p-3 border-2 border-[#0A66C2]/20 rounded-xl focus:outline-none focus:border-[#0A66C2] transition-colors"
                    placeholder="Paste your li_a cookie here"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-xl p-4 text-[#0A66C2] font-outfit">
                  <p className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    {error}
                  </p>
                </div>
              )}

              <div className="bg-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-xl p-4 text-[#0A66C2] font-outfit">
                <p className="flex items-start gap-2">
                  <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Your cookies are securely stored and only used for automation purposes
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 border-2 border-[#0A66C2] font-outfit transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Connecting..." : "Connect LinkedIn Account"}
              </Button>
            </form>
          </StepCard>
        </div>
      </div>
    </div>
  );
}
