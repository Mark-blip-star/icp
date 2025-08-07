import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, Monitor, X, Globe, MousePointer, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import LinkedInWebSocketConnect from "./linkedin-websocket-connect";

export function LinkedInUniversal() {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookies] = useState<{ li_at?: string; li_a?: string } | null>(null);
  const [showWebSocketMode, setShowWebSocketMode] = useState(false);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Generate a unique user ID for WebSocket session
    const storedUserId = localStorage.getItem("linkedin_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("linkedin_user_id", newUserId);
      setUserId(newUserId);
    }
  }, []);

  const handleLoginSuccess = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      console.log("🎉 Login success! Processing cookies...");
      console.log(
        "📋 li_at cookie:",
        cookies.li_at ? cookies.li_at.substring(0, 20) + "..." : "Not found",
      );
      console.log(
        "📋 li_a cookie:",
        cookies.li_a ? cookies.li_a.substring(0, 20) + "..." : "Not found",
      );

      if (cookies.li_at) {
        // Save cookies to backend
        await saveLinkedInCookies(cookies);

        // Update status and show cookies
        setIsConnected(true);
        setCookies(cookies);
        localStorage.setItem("linkedInCredentials", "true");
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));

        console.log("✅ LinkedIn connection completed successfully!");

        // Force refresh the page to update hasCredentials status
        setTimeout(() => {
          console.log("🔄 Refreshing page to update connection status...");
          window.location.reload();
        }, 3000);
      } else {
        console.log("❌ No li_at cookie found");
        setError("No authentication cookies found. Please try logging in again.");
      }
    } catch (error) {
      console.error("❌ Error processing login success:", error);
      setError("Failed to process login credentials. Please try again.");
    }
  };

  const saveLinkedInCookies = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      console.log("💾 Saving cookies to backend...");
      console.log("📤 Sending data to /api/linkedin/connect:", {
        email: "websocket_user@example.com",
        li_at: cookies.li_at ? cookies.li_at.substring(0, 20) + "..." : "Not found",
        li_a: cookies.li_a ? cookies.li_a.substring(0, 20) + "..." : "Not found",
      });

      const response = await fetch("/api/linkedin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "websocket_user@example.com",
          li_at: cookies.li_at,
          li_a: cookies.li_a,
        }),
      });

      console.log("📡 Connect API response status:", response.status);
      const result = await response.json();
      console.log("📡 Connect API response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to save LinkedIn credentials");
      }

      console.log("✅ Cookies saved successfully to backend!");
      return result;
    } catch (error) {
      console.error("❌ Error saving cookies:", error);
      throw error;
    }
  };

  const handleWebSocketSuccess = async (cookies: { li_at: string; li_a?: string }) => {
    console.log("🎉 WebSocket login successful!");
    await handleLoginSuccess(cookies);
  };

  const handleWebSocketError = (error: string) => {
    console.error("❌ WebSocket error:", error);
    setError(`WebSocket error: ${error}`);
  };

  const handleBackToNormal = () => {
    setShowWebSocketMode(false);
    setError(null);
  };

  // Show WebSocket mode
  if (showWebSocketMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="mb-6 text-center">
            <Button onClick={handleBackToNormal} variant="outline" className="mb-4">
              ← Back to Login Options
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Interactive LinkedIn Login</h1>
            <p className="text-gray-600">
              Use the interactive browser to log in to LinkedIn manually
            </p>
          </div>

          <LinkedInWebSocketConnect
            userId={userId}
            onSuccess={handleWebSocketSuccess}
            onError={handleWebSocketError}
          />
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="w-full max-w-2xl mx-auto h-screen flex flex-col justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Connected!</h2>
          <p className="text-gray-600 mb-4">Your LinkedIn account is now connected to Tiger</p>
          <div className="animate-pulse text-sm text-gray-500 mb-4">
            Redirecting to dashboard in 3 seconds...
          </div>
          <button
            onClick={() => {
              console.log("🔄 Manual redirect triggered...");
              window.location.reload();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connect Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            LinkedIn
          </span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Use interactive browser to log in securely and connect your account.
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Interactive Browser Login</h2>
        </div>

        <div className="mb-4">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <h4 className="font-semibold text-purple-900 mb-1 text-sm">How it works:</h4>
            <ul className="text-xs text-purple-800 space-y-0.5">
              <li>• Opens a real browser on our server</li>
              <li>• You see and control the browser directly</li>
              <li>• Enter your credentials manually</li>
              <li>• Handle CAPTCHA and security checks</li>
              <li>• Cookies are automatically saved</li>
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <MousePointer className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700">Interactive Experience</p>
              <p>See and control the browser directly</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700">Bypass Security</p>
              <p>Handle CAPTCHA and verification manually</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Monitor className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-gray-700">Real-time Control</p>
              <p>Full control over the login process</p>
            </div>
          </div>

          <Button
            onClick={() => setShowWebSocketMode(true)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <Globe className="h-4 w-4" />
            Start Interactive Login
          </Button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {isConnected && cookies && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-green-800 text-sm">Login successful! Processing your account...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
