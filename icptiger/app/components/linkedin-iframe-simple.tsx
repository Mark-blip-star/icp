import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, Monitor, X } from "lucide-react";

export function LinkedInIframeSimple() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [loginStatus, setLoginStatus] = useState<"idle" | "logging-in" | "success" | "failed">(
    "idle",
  );
  const [usePopup, setUsePopup] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const popupRef = useRef<Window | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleLaunchIframe = () => {
    setIsLoading(true);
    setError(null);

    // First try iframe approach
    setShowIframe(true);
    setLoginStatus("logging-in");

    // Check if iframe works after a short delay
    setTimeout(() => {
      if (iframeRef.current && !iframeRef.current.contentDocument) {
        // console.log("❌ Iframe approach failed, trying popup approach");
        setShowIframe(false);
        setError("Iframe blocked by browser. Trying popup method...");

        // Try popup approach
        const popup = window.open(
          "https://www.linkedin.com/login",
          "_blank",
          "width=600,height=800,left=100,top=100",
        );
        if (popup) {
          // console.log("🔄 Opened LinkedIn in popup window");
          popupRef.current = popup;
          setUsePopup(true);
          startPopupLoginCheck(popup);
        } else {
          setError("Popup blocked by browser. Please allow popups and try again.");
        }
      }
    }, 3000);

    setIsLoading(false);
  };

  const handleLoginSuccess = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      // console.log("🎉 Login success! Processing cookies...");
      // console.log(
      //   "📋 li_at cookie:",
      //   cookies.li_at ? cookies.li_at.substring(0, 20) + "..." : "Not found",
      // );
      // console.log(
      //   "📋 li_a cookie:",
      //   cookies.li_a ? cookies.li_a.substring(0, 20) + "..." : "Not found",
      // );

      if (cookies.li_at) {
        // Save cookies to backend
        await saveLinkedInCookies(cookies);

        // Close iframe
        setShowIframe(false);

        // Update status
        setIsConnected(true);
        localStorage.setItem("linkedInCredentials", "true");
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));

        // console.log("✅ LinkedIn connection completed successfully!");

        // Redirect after success
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        // console.log("❌ No li_at cookie found");
        setError("No authentication cookies found. Please try logging in again.");
        setLoginStatus("failed");
      }
    } catch (error) {
      console.error("❌ Error processing login success:", error);
      setError("Failed to process login credentials. Please try again.");
      setLoginStatus("idle");
    }
  };

  const saveLinkedInCookies = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      // console.log("💾 Saving cookies to backend...");
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

      // console.log("✅ Cookies saved successfully to backend!");
      return result;
    } catch (error) {
      console.error("❌ Error saving cookies:", error);
      throw error;
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    setLoginStatus("idle");
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
  };

  const startPopupLoginCheck = (popup: Window) => {
    // console.log("🔍 Starting popup login check...");

    const checkInterval = setInterval(() => {
      try {
        if (popup.closed) {
          // console.log("❌ Popup was closed by user");
          clearInterval(checkInterval);
          setUsePopup(false);
          setLoginStatus("idle");
          return;
        }

        const currentUrl = popup.location.href;
        // console.log("🔍 Current popup URL:", currentUrl);

        // Check if user is logged in
        const loginPatterns = [
          "/feed",
          "/mynetwork",
          "/jobs",
          "/messaging",
          "/notifications",
          "/mynetwork/invitation-manager",
          "/learning",
          "/sales",
          "/talent",
          "/company",
          "/in/",
          "/pulse",
        ];

        const isLoggedIn = loginPatterns.some((pattern) => currentUrl.includes(pattern));

        if (isLoggedIn) {
          // console.log("✅ Login detected in popup! URL:", currentUrl);
          clearInterval(checkInterval);

          // Extract cookies from popup
          extractCookiesFromPopup(popup);
        }
      } catch (error) {
        // console.log("🔄 CORS error checking popup URL, continuing...");
      }
    }, 2000);

    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!popup.closed) {
        // console.log("⏰ Popup login check timeout");
        setError("Login timeout. Please try again.");
      }
    }, 300000);
  };

  const extractCookiesFromPopup = (popup: Window) => {
    try {
      // console.log("🍪 Extracting cookies from popup...");

      // Inject script to extract cookies
      const script = popup.document.createElement("script");
      script.textContent = `
        try {
          const cookies = document.cookie;
          // console.log('📋 All cookies in popup:', cookies);
          
          const liAt = cookies.split(';').find(c => c.trim().startsWith('li_at='))?.split('=')[1];
          const liA = cookies.split(';').find(c => c.trim().startsWith('li_a='))?.split('=')[1];
          
          // console.log('🍪 li_at found in popup:', !!liAt);
          // console.log('🍪 li_a found in popup:', !!liA);
          
          if (liAt) {
            // console.log('✅ Authentication cookies found in popup!');
            window.opener.postMessage({
              type: 'linkedin-login-success',
              cookies: { li_at: liAt, li_a: liA },
              url: window.location.href
            }, '*');
          } else {
            // console.log('❌ No authentication cookies found in popup');
            window.opener.postMessage({
              type: 'linkedin-login-no-cookies',
              url: window.location.href
            }, '*');
          }
        } catch (error) {
          console.error('❌ Error extracting cookies:', error);
          window.opener.postMessage({
            type: 'linkedin-login-error',
            error: error.message
          }, '*');
        }
      `;

      popup.document.head.appendChild(script);
      // console.log("✅ Cookie extraction script injected into popup");
    } catch (error) {
      // console.log("❌ Could not inject script into popup:", error);
      setError("Could not extract cookies from popup. Please try again.");
    }
  };

  // Listen for messages from iframe and popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "linkedin-login-success") {
        // console.log("✅ Login success detected via message:", event.data.url);
        // console.log("📨 Received cookies:", event.data.cookies);
        setLoginStatus("success");
        handleLoginSuccess(event.data.cookies);

        // Close popup if it's open
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
      } else if (event.data.type === "linkedin-login-no-cookies") {
        // console.log("❌ Login detected but no cookies found:", event.data.url);
        setError("Login successful but no authentication cookies found. Please try again.");
        setLoginStatus("failed");
      } else if (event.data.type === "linkedin-login-error") {
        // console.log("❌ Error during login process:", event.data.error);
        setError(`Login error: ${event.data.error}. Please try again.`);
        setLoginStatus("failed");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Inject script into iframe when it loads
  useEffect(() => {
    if (!showIframe || !iframeRef.current) return;

    const iframe = iframeRef.current;

    const handleIframeLoad = () => {
      try {
        // console.log("🔧 Injecting login detector script into iframe...");

        // Check if we can access the iframe content
        if (!iframe.contentDocument) {
          // console.log("❌ Cannot access iframe content - CORS restriction");
          setError(
            "LinkedIn login page cannot be loaded in this browser. Please try using a different browser or disable browser extensions.",
          );
          return;
        }

        const script = iframe.contentDocument?.createElement("script");
        if (script) {
          script.textContent = `
            // console.log('🔍 LinkedIn login detector started in iframe');
            
            function checkForLogin() {
              const currentUrl = window.location.href;
              // console.log('🔍 Current iframe URL:', currentUrl);
              
              // Check if user is logged in
              const loginPatterns = [
                '/feed',
                '/mynetwork', 
                '/jobs',
                '/messaging',
                '/notifications',
                '/mynetwork/invitation-manager',
                '/learning',
                '/sales',
                '/talent',
                '/company',
                '/in/',
                '/pulse'
              ];
              
              const isLoggedIn = loginPatterns.some(pattern => currentUrl.includes(pattern));
              
              if (isLoggedIn) {
                // console.log('✅ Login detected in iframe! URL:', currentUrl);
                
                // Wait a bit for cookies to be set
                setTimeout(() => {
                  const cookies = document.cookie;
                  // console.log('📋 All cookies in iframe:', cookies);
                  
                  const liAt = cookies.split(';').find(c => c.trim().startsWith('li_at='))?.split('=')[1];
                  const liA = cookies.split(';').find(c => c.trim().startsWith('li_a='))?.split('=')[1];
                  
                  // console.log('🍪 li_at found in iframe:', !!liAt);
                  // console.log('🍪 li_a found in iframe:', !!liA);
                  
                  if (liAt) {
                    // console.log('✅ Authentication cookies found in iframe!');
                    // console.log('📋 li_at cookie (first 20 chars):', liAt.substring(0, 20) + '...');
                    if (liA) {
                      // console.log('📋 li_a cookie (first 20 chars):', liA.substring(0, 20) + '...');
                    }
                    
                    // Send cookies back to parent window
                    window.parent.postMessage({
                      type: 'linkedin-login-success',
                      cookies: { li_at: liAt, li_a: liA },
                      url: currentUrl
                    }, '*');
                  } else {
                    // console.log('❌ No authentication cookies found in iframe');
                    window.parent.postMessage({
                      type: 'linkedin-login-no-cookies',
                      url: currentUrl
                    }, '*');
                  }
                }, 2000); // Wait 2 seconds for cookies
                
                return true; // Stop checking
              }
              
              return false; // Continue checking
            }
            
            // Check immediately
            if (!checkForLogin()) {
              // Check every 2 seconds
              const interval = setInterval(() => {
                if (checkForLogin()) {
                  clearInterval(interval);
                }
              }, 2000);
              
              // Stop checking after 5 minutes
              setTimeout(() => {
                clearInterval(interval);
                // console.log('⏰ Login detection timeout in iframe');
              }, 300000);
            }
          `;

          iframe.contentDocument?.head.appendChild(script);
          // console.log("✅ Login detector script injected into iframe");
        }
      } catch (error) {
        // console.log("❌ Could not inject script into iframe:", error);
      }
    };

    iframe.addEventListener("load", handleIframeLoad);

    return () => {
      iframe.removeEventListener("load", handleIframeLoad);
    };
  }, [showIframe]);

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
            <div className="mt-3">
              <button
                onClick={() => {
                  setError(null);
                  // Try alternative approach - open in new window
                  const newWindow = window.open(
                    "https://www.linkedin.com/login",
                    "_blank",
                    "width=600,height=800",
                  );
                  if (newWindow) {
                    // console.log("🔄 Trying alternative approach with new window");
                    // We'll implement localStorage-based detection here
                  }
                }}
                className="text-blue-600 hover:text-blue-800 text-sm underline"
              >
                Try alternative method
              </button>
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
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation allow-modals"
                allow="camera; microphone; geolocation; fullscreen"
                onError={() => {
                  // console.log("❌ Iframe failed to load");
                  setError(
                    "Failed to load LinkedIn login page. Please check your internet connection and try again.",
                  );
                }}
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

      {/* Popup Status */}
      {usePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">LinkedIn Login</h3>
              <p className="text-gray-600 mb-4">
                A new window has opened for LinkedIn login. Please complete your login there.
              </p>
              <div className="flex items-center justify-center mb-4">
                <LoadingSpinner size="sm" color="primary" />
                <span className="ml-2 text-sm text-gray-500">Waiting for login...</span>
              </div>
              <button
                onClick={() => {
                  setUsePopup(false);
                  if (popupRef.current && !popupRef.current.closed) {
                    popupRef.current.close();
                  }
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
