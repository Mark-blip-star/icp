"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading";

export default function LinkedInVerifyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [apiVerified, setApiVerified] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    async function verify() {
      try {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        setScreenshot(null);
        setScreenshotUrl(null);
        setApiVerified(false);
        setDebugInfo([]);

        // Add some initial debug info
        addDebugInfo("Starting verification process...");

        const startTime = Date.now();
        const response = await fetch("/api/linkedin/verify");
        const responseTime = Date.now() - startTime;
        addDebugInfo(
          `Got response with status: ${response.status} (took ${responseTime}ms)`
        );

        const data = await response.json();
        addDebugInfo("Response data received");

        // Process response data
        if (data.apiVerified) {
          addDebugInfo("API verification successful");
          setApiVerified(true);
        }

        if (data.screenshot) {
          addDebugInfo("Screenshot received");
          setScreenshot(data.screenshot);
        } else {
          addDebugInfo("No screenshot in response");
        }

        if (data.screenshotUrl) {
          addDebugInfo("Screenshot URL received");
          setScreenshotUrl(data.screenshotUrl);
        }

        if (data.message) {
          addDebugInfo("Message received");
        }

        if (!response.ok) {
          addDebugInfo(`Error: ${data.error || "Unknown error"}`);
          throw new Error(data.error || "Verification failed");
        }

        addDebugInfo("Verification successful");
        setSuccess(true);
      } catch (err) {
        console.error("Error verifying LinkedIn connectivity:", err);
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }

    verify();
  }, []);

  // Helper function to add debug info with timestamps
  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toISOString().slice(11, 23); // HH:MM:SS.mmm
    setDebugInfo((prev) => [...prev, `[${timestamp}] ${info}`]);
  };

  const handleRetry = () => {
    setIsLoading(true);
    window.location.reload();
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 space-y-4">
      <h1 className="text-2xl font-rufina text-center">
        LinkedIn Connectivity Check
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" color="primary" text="Verifying connection..." />
        </div>
      ) : (
        <>
          {error && (
            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              <h2 className="font-bold text-lg mb-2">Error Occurred</h2>
              <p>{error}</p>

              <div className="mt-4 bg-amber-50 border border-amber-200 rounded p-3 text-amber-700">
                <p className="font-medium">What should I do?</p>
                <p className="mt-1 text-sm">
                  Your LinkedIn connection may have expired. Please go back to the
                  connection page and reconnect your LinkedIn account.
                </p>
              </div>
            </div>
          )}

          {success && (
            <div className="my-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-md text-green-700 text-center mb-4">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-semibold mb-2">
                  LinkedIn Successfully Connected!
                </h2>
                <p>Your LinkedIn account is properly connected and verified.</p>

                {apiVerified && (
                  <div className="mt-2 text-sm text-green-600">
                    API verification: Successful
                  </div>
                )}
              </div>

              {screenshot && (
                <div className="mt-6">
                  <h2 className="text-xl mb-2 font-semibold">
                    LinkedIn Screenshot:
                  </h2>

                  {screenshotUrl && (
                    <p className="text-sm text-gray-500 mb-2">
                      URL: {screenshotUrl}
                    </p>
                  )}

                  <div className="border border-gray-200 rounded-md overflow-hidden shadow-md">
                    <img
                      className="w-full"
                      src={`data:image/jpeg;base64,${screenshot}`}
                      alt="LinkedIn screenshot"
                    />
                  </div>
                </div>
              )}

              {!screenshot && success && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
                  <p className="font-medium">Note:</p>
                  <p className="mt-1">
                    Your LinkedIn connection was verified via API, but we couldn't
                    capture a screenshot. This doesn't affect functionality - your
                    connection is valid and working.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Show debug info in collapsible section */}
          <details className="my-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <summary className="font-medium cursor-pointer">
              Technical Debug Info
            </summary>
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs font-mono text-gray-800 max-h-48 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="py-1">
                  {info}
                </div>
              ))}
            </div>
          </details>

          <div className="mt-8 flex justify-center space-x-4">
            <Button
              onClick={handleRetry}
              className="font-outfit"
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Retry Connection Check"}
            </Button>

            {!isLoading && (
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard/scale/connect")}
                className="font-outfit"
              >
                Back to Connection Settings
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
