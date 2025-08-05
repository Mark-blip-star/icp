"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/loading";

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function TestLinkedInVerifyPage() {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    async function testVerify() {
      try {
        setIsLoading(true);
        setError(null);
        setUrl(null);
        setDebugInfo([]);

        addDebugInfo("Starting test verification with hardcoded cookies...");

        const response = await fetch("/api/linkedin/test-verify");
        addDebugInfo(`Got response with status: ${response.status}`);

        const data = await response.json();
        addDebugInfo("Response data received");

        // Set screenshot if available
        if (data.screenshot) {
          addDebugInfo("Screenshot received");
          setScreenshot(data.screenshot);
        } else {
          addDebugInfo("No screenshot in response");
        }

        // Set URL if available
        if (data.url) {
          addDebugInfo("LinkedIn URL received");
          setUrl(data.url);
        }

        if (!response.ok) {
          addDebugInfo(`Error: ${data.error || "Unknown error"}`);
          throw new Error(data.error || "Verification failed");
        }

        addDebugInfo("Test verification successful");
        setSuccess(true);
      } catch (err) {
        console.error("Error in test verification:", err);
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    }

    testVerify();
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
        LinkedIn Test Connection
      </h1>
      <p className="text-center text-gray-600">
        Using hardcoded cookies for testing
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" color="primary" text="Testing connection..." />
        </div>
      ) : (
        <>
          {error && (
            <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              <h2 className="font-bold text-lg mb-2">Error Occurred</h2>
              <p>{error}</p>
            </div>
          )}

          {url && (
            <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h2 className="font-bold text-lg mb-2">LinkedIn URL</h2>
              <p className="font-mono text-sm break-all">{url}</p>
            </div>
          )}

          {screenshot && (
            <div className="my-6">
              <h2 className="text-xl mb-2 font-semibold">
                {success
                  ? "✅ Success! Here's the LinkedIn page:"
                  : "Here's what we got from LinkedIn:"}
              </h2>

              <div className="border border-gray-200 rounded-md overflow-hidden shadow-md">
                <img
                  className="w-full"
                  src={`data:image/jpeg;base64,${screenshot}`}
                  alt="LinkedIn screenshot"
                />
              </div>
            </div>
          )}

          {/* Show debug info */}
          <div className="my-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h2 className="font-medium mb-2">Debug Info</h2>
            <div className="p-2 bg-gray-100 rounded text-xs font-mono text-gray-800 max-h-48 overflow-y-auto">
              {debugInfo.map((info, index) => (
                <div key={index} className="py-1">
                  {info}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <Button
          onClick={handleRetry}
          className="font-outfit"
          disabled={isLoading}
        >
          {isLoading ? "Testing..." : "Retry Test"}
        </Button>

        <Button
          variant="outline"
          onClick={() => (window.location.href = "/dashboard/scale/connect")}
          className="font-outfit"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
