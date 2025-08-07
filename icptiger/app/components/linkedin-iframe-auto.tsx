import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, Monitor, X } from "lucide-react";

export function LinkedInIframeAuto() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [loginStatus, setLoginStatus] = useState<"idle" | "logging-in" | "success" | "failed">(
    "idle",
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLaunchIframe = () => {
    setIsLoading(true);
    setError(null);
    setShowIframe(true);
    setLoginStatus("logging-in");
    setIsLoading(false);
  };

  // Listen for messages from iframe and monitor URL changes
  useEffect(() => {
    if (!showIframe) return;

    const checkLoginStatus = () => {
      if (!iframeRef.current) return;

      try {
        const iframe = iframeRef.current;
        const currentUrl = iframe.contentWindow?.location.href;

        if (currentUrl) {
          console.log("Current iframe URL:", currentUrl);

          // Check if user is logged in
          if (
            currentUrl.includes("/feed") ||
            currentUrl.includes("/mynetwork") ||
            currentUrl.includes("/jobs") ||
            currentUrl.includes("/messaging") ||
            currentUrl.includes("/mynetwork/invitation-manager") ||
            currentUrl.includes("/notifications")
          ) {
            console.log("Login detected! Extracting cookies...");
            setLoginStatus("success");
            extractCookiesFromIframe();
          }
        }
      } catch (error) {
        // CORS error - this is expected, we'll use alternative method
        console.log("CORS error, using alternative cookie extraction");
      }
    };

    // Check every 2 seconds
    checkIntervalRef.current = setInterval(checkLoginStatus, 2000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [showIframe]);

  const extractCookiesFromIframe = async () => {
    try {
      // Try to inject a script to extract cookies
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) {
        throw new Error("Iframe not available");
      }

      // Create a script to extract cookies
      const script = `
        try {
          const cookies = document.cookie;
          console.log('All cookies:', cookies);
          
          const liAt = cookies.split(';').find(c => c.trim().startsWith('li_at='))?.split('=')[1];
          const liA = cookies.split(';').find(c => c.trim().startsWith('li_a='))?.split('=')[1];
          
          console.log('li_at found:', !!liAt);
          console.log('li_a found:', !!liA);
          
          // Send cookies back to parent
          window.parent.postMessage({
            type: 'linkedin-cookies',
            cookies: { li_at: liAt, li_a: liA }
          }, '*');
        } catch (error) {
          console.error('Error extracting cookies:', error);
          window.parent.postMessage({
            type: 'linkedin-cookies-error',
            error: error.message
          }, '*');
        }
      `;

      // Inject the script
      const scriptElement = iframe.contentDocument?.createElement("script");
      if (scriptElement) {
        scriptElement.textContent = script;
        iframe.contentDocument?.head.appendChild(scriptElement);
      }

      // Listen for the response
      const handleMessage = (event: MessageEvent) => {
        if (event.data.type === "linkedin-cookies") {
          console.log("Received cookies:", event.data.cookies);
          if (event.data.cookies.li_at) {
            handleLoginSuccess(event.data.cookies);
          } else {
            setError("No authentication cookies found. Please try logging in again.");
            setLoginStatus("failed");
          }
          window.removeEventListener("message", handleMessage);
        } else if (event.data.type === "linkedin-cookies-error") {
          console.error("Cookie extraction error:", event.data.error);
          setError("Failed to extract cookies. Please try again.");
          setLoginStatus("failed");
          window.removeEventListener("message", handleMessage);
        }
      };

      window.addEventListener("message", handleMessage);

      // Timeout after 10 seconds
      setTimeout(() => {
        window.removeEventListener("message", handleMessage);
        setError("Timeout waiting for cookies. Please try again.");
        setLoginStatus("failed");
      }, 10000);
    } catch (error) {
      console.error("Error in cookie extraction:", error);
      setError("Failed to extract cookies. Please try again.");
      setLoginStatus("failed");
    }
  };

  const handleLoginSuccess = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      console.log("Saving cookies to backend...");
      const response = await fetch("/api/linkedin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "iframe-auth@example.com",
          li_at: cookies.li_at,
          li_a: cookies.li_a,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save LinkedIn credentials");
      }

      console.log("Cookies saved successfully!");
      setIsConnected(true);
      localStorage.setItem("linkedInCredentials", "true");
      window.dispatchEvent(new Event("linkedInCredentialsChanged"));

      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error saving cookies:", error);
      setError("Failed to save login credentials. Please try again.");
      setLoginStatus("failed");
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    setLoginStatus("idle");
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
  };

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

        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Ready to connect your LinkedIn account</p>
          <button
            onClick={handleLaunchIframe}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Launching...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Monitor className="w-5 h-5 mr-2" />
                Launch LinkedIn Browser
              </div>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Iframe Modal */}
      {showIframe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-5xl h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">LinkedIn Login</h3>
              <button onClick={closeIframe} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 p-4">
              {loginStatus === "logging-in" && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <LoadingSpinner size="lg" color="primary" />
                    <p className="text-gray-600 mt-4">Please complete your LinkedIn login below</p>
                    <p className="text-sm text-gray-500 mt-2">
                      We'll automatically detect when you're logged in
                    </p>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src="https://www.linkedin.com/login"
                className="w-full h-full border-0 rounded-lg"
                title="LinkedIn Login"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                allow="camera; microphone; geolocation"
              />
            </div>
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 text-center mb-3">
                After logging in, we'll automatically detect and connect your account.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={closeIframe}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
