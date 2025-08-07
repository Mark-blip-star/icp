import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, ExternalLink, Shield, Zap, Monitor, ArrowRight, X } from "lucide-react";

export function LinkedInAutoConnect() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<
    "idle" | "launching" | "ready" | "logging-in" | "success"
  >("idle");
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<Window | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  const handleLaunchBrowser = async () => {
    setIsLoading(true);
    setError(null);
    setSessionStatus("launching");

    try {
      // Open LinkedIn login in popup with specific dimensions
      const popup = window.open(
        "https://www.linkedin.com/login",
        "linkedin-login",
        "width=500,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no",
      );

      if (!popup) {
        throw new Error("Popup blocked by browser. Please allow popups for this site.");
      }

      popupRef.current = popup;
      setShowPopup(true);
      setSessionStatus("logging-in");

      // Start checking for login completion
      startLoginCheck(popup);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch browser");
      setSessionStatus("idle");
    } finally {
      setIsLoading(false);
    }
  };

  const startLoginCheck = (popup: Window) => {
    checkIntervalRef.current = setInterval(async () => {
      try {
        // Check if popup is closed
        if (popup.closed) {
          clearInterval(checkIntervalRef.current!);
          setShowPopup(false);
          setSessionStatus("idle");
          return;
        }

        // Check if user is logged in by monitoring URL changes
        const currentUrl = popup.location.href;

        if (
          currentUrl.includes("/feed") ||
          currentUrl.includes("/mynetwork") ||
          currentUrl.includes("/jobs") ||
          currentUrl.includes("/messaging")
        ) {
          // User is logged in, extract cookies
          await extractAndSaveCookies(popup);
        }
      } catch (error) {
        // Cross-origin error, which is expected
        // We'll handle cookie extraction differently
      }
    }, 1000);
  };

  const extractAndSaveCookies = async (popup: Window) => {
    try {
      // Inject a script into the popup to extract cookies
      const cookies = await injectCookieExtractor(popup);

      if (cookies.li_at) {
        // Save cookies to backend
        await saveLinkedInCookies(cookies);

        // Close popup
        popup.close();
        setShowPopup(false);

        // Update status
        setSessionStatus("success");
        setIsConnected(true);
        localStorage.setItem("linkedInCredentials", "true");
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));

        // Redirect after success
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // Fallback: ask user to manually copy cookies
        setError(
          "Please copy your LinkedIn cookies manually. After logging in, press F12, go to Application → Cookies → linkedin.com, and copy the li_at cookie value.",
        );
        setSessionStatus("idle");
      }
    } catch (error) {
      console.error("Error extracting cookies:", error);
      setError("Failed to extract login credentials. Please try again.");
      setSessionStatus("idle");
    }
  };

  const injectCookieExtractor = async (
    popup: Window,
  ): Promise<{ li_at?: string; li_a?: string }> => {
    return new Promise((resolve, reject) => {
      try {
        // Create a script element and inject it into the popup
        const script = popup.document.createElement("script");
        script.textContent = `
          try {
            const cookies = document.cookie;
            const liAt = cookies.split(';').find(c => c.trim().startsWith('li_at='))?.split('=')[1];
            const liA = cookies.split(';').find(c => c.trim().startsWith('li_a='))?.split('=')[1];
            
            // Send cookies back to parent window
            window.parent.postMessage({
              type: 'linkedin-cookies',
              cookies: { li_at: liAt, li_a: liA }
            }, '*');
          } catch (error) {
            console.error('Error extracting cookies:', error);
          }
        `;

        popup.document.head.appendChild(script);

        // Listen for the response
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === "linkedin-cookies") {
            window.removeEventListener("message", handleMessage);
            resolve(event.data.cookies);
          }
        };

        window.addEventListener("message", handleMessage);

        // Timeout after 5 seconds
        setTimeout(() => {
          window.removeEventListener("message", handleMessage);
          reject(new Error("Timeout waiting for cookies"));
        }, 5000);
      } catch (error) {
        reject(error);
      }
    });
  };

  const saveLinkedInCookies = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      const response = await fetch("/api/linkedin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "popup-auth@example.com",
          li_at: cookies.li_at,
          li_a: cookies.li_a,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save LinkedIn credentials");
      }

      return result;
    } catch (error) {
      console.error("Error saving cookies:", error);
      throw error;
    }
  };

  const closePopup = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    setShowPopup(false);
    setSessionStatus("idle");
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (popupRef.current && !popupRef.current.closed) {
        popupRef.current.close();
      }
    };
  }, []);

  if (isConnected) {
    return (
      <div className="w-full max-w-2xl mx-auto p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Connected!</h2>
          <p className="text-gray-600 mb-4">Your LinkedIn account is now connected to Tiger</p>
          <div className="animate-pulse text-sm text-gray-500">Redirecting to dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Connect Your{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            LinkedIn
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Log in directly to LinkedIn and we'll automatically connect your account.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Start Connection</h2>
        </div>

        {/* Status Display */}
        <div className="mb-6">
          {sessionStatus === "idle" && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">Ready to connect your LinkedIn account</p>
              <button
                onClick={handleLaunchBrowser}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Launching Browser...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Monitor className="w-5 h-5 mr-2" />
                    Launch LinkedIn Browser
                  </div>
                )}
              </button>
            </div>
          )}

          {sessionStatus === "launching" && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-gray-600 mt-4">Launching LinkedIn login...</p>
            </div>
          )}

          {sessionStatus === "logging-in" && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" color="primary" />
              <p className="text-gray-600 mt-4">
                Please complete your LinkedIn login in the popup window
              </p>
              <p className="text-sm text-gray-500 mt-2">
                We'll automatically detect when you're logged in and extract your credentials
              </p>
              <button
                onClick={closePopup}
                className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Cancel login
              </button>
            </div>
          )}

          {sessionStatus === "success" && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-green-600 font-semibold mb-2">Login Successful!</p>
              <p className="text-gray-600">Extracting session data...</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            Having trouble? Check our{" "}
            <a href="/help/linkedin-setup" className="text-blue-600 hover:text-blue-700 underline">
              setup guide
            </a>
          </p>
        </div>
      </div>

      {/* Popup Overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">LinkedIn Login</h3>
              <button onClick={closePopup} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              A popup window has opened with LinkedIn login. Please complete your login there.
            </p>
            <div className="flex justify-end">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
