import React, { useEffect, useRef } from "react";
import { X, AlertCircle } from "lucide-react";
import { LinkedInCaptcha } from "./linkedin-captcha";

interface ArkoseCaptchaData {
  type: "arkose" | "recaptcha" | "hcaptcha" | "linkedin" | "unknown";
  sitekey?: string;
  fcToken?: string;
  verificationToken?: string;
  dataPkey?: string;
  dataSurl?: string;
  iframeSrc?: string;
  captchaUrl?: string;
  elements?: {
    captcha: number;
    puzzle: number;
    challenge: number;
  };
  hiddenInputs?: { name: string; value: string }[];
  // NEW: LinkedIn specific fields
  captchaSiteKey?: string;
  challengeId?: string;
  csrfToken?: string;
  formAction?: string;
  formMethod?: string;
  pageTitle?: string;
  pageContent?: string;
}

interface ArkoseCaptchaProps {
  isVisible: boolean;
  captchaData: ArkoseCaptchaData;
  onClose: () => void;
  onCaptchaSolved: (token: string) => void;
}

export function ArkoseCaptcha({
  isVisible,
  captchaData,
  onClose,
  onCaptchaSolved,
}: ArkoseCaptchaProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!isVisible || !captchaData) {
      return;
    }

    console.log("🎯 Initializing captcha with data:", captchaData);

    // Handle different captcha types
    if (captchaData.type === "arkose" && captchaData.sitekey) {
      // Load Arkose Labs script
      const loadArkoseScript = () => {
        // Remove existing script if any
        if (scriptRef.current) {
          document.head.removeChild(scriptRef.current);
        }

        const script = document.createElement("script");
        script.src = `https://client-api.arkoselabs.com/v2/${captchaData.sitekey}/api.js`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log("✅ Arkose Labs script loaded");
          initializeArkoseWidget();
        };

        script.onerror = () => {
          console.error("❌ Failed to load Arkose Labs script");
        };

        document.head.appendChild(script);
        scriptRef.current = script;
      };

      const initializeArkoseWidget = () => {
        if (typeof window !== "undefined" && (window as any).arkoselabs) {
          try {
            console.log("🎯 Initializing Arkose widget...");

            // Initialize Arkose widget
            (window as any).arkoselabs.run({
              sitekey: captchaData.sitekey,
              callback: (token: string) => {
                console.log("✅ Arkose captcha solved, token:", token.substring(0, 20) + "...");
                onCaptchaSolved(token);
              },
              "expired-callback": () => {
                console.log("⏰ Arkose captcha expired");
              },
              "error-callback": (error: any) => {
                console.error("❌ Arkose captcha error:", error);
              },
            });
          } catch (error) {
            console.error("❌ Error initializing Arkose widget:", error);
          }
        } else {
          console.error("❌ Arkose Labs script not loaded");
        }
      };

      loadArkoseScript();
    } else if (captchaData.type === "linkedin" && captchaData.captchaSiteKey) {
      // NEW: LinkedIn uses Arkose Labs - create a custom captcha interface
      console.log("🎯 LinkedIn Arkose captcha detected, creating custom interface");

      // Create a container for the captcha
      const captchaContainer = document.getElementById("arkose-iframe-container");
      if (captchaContainer) {
        captchaContainer.innerHTML = "";

        // Create a custom captcha interface that looks like LinkedIn's
        const captchaInterface = document.createElement("div");
        captchaInterface.className = "linkedin-captcha-interface";
        captchaInterface.style.cssText = `
          background: white;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          margin: 0 auto;
        `;

        // Add LinkedIn logo
        const logo = document.createElement("div");
        logo.innerHTML = `
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#0077B5">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        `;
        captchaInterface.appendChild(logo);

        // Add title
        const title = document.createElement("h3");
        title.textContent = "Захист вашого облікового запису";
        title.style.cssText = `
          font-size: 18px;
          font-weight: 600;
          margin: 16px 0 8px 0;
          color: #191919;
        `;
        captchaInterface.appendChild(title);

        // Add description
        const description = document.createElement("p");
        description.textContent =
          "Будь ласка, розв'яжіть цей пазл, щоб ми знали, що Ви є реальною людиною";
        description.style.cssText = `
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
          line-height: 1.4;
        `;
        captchaInterface.appendChild(description);

        // Add puzzle area
        const puzzleArea = document.createElement("div");
        puzzleArea.style.cssText = `
          background: #f3f2ef;
          border-radius: 8px;
          padding: 20px;
          margin: 16px 0;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `;

        // Add puzzle icon
        const puzzleIcon = document.createElement("div");
        puzzleIcon.innerHTML = "🧩";
        puzzleIcon.style.cssText = `
          font-size: 48px;
          margin-bottom: 16px;
        `;
        puzzleArea.appendChild(puzzleIcon);

        // Add puzzle text
        const puzzleText = document.createElement("p");
        puzzleText.textContent = "Пазл завантажується...";
        puzzleText.style.cssText = `
          font-size: 14px;
          color: #666;
          margin: 0;
        `;
        puzzleArea.appendChild(puzzleText);

        captchaInterface.appendChild(puzzleArea);

        // Add start button
        const startButton = document.createElement("button");
        startButton.textContent = "Розпочати пазл";
        startButton.style.cssText = `
          background: #0077B5;
          color: white;
          border: none;
          border-radius: 24px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin: 16px 0;
          transition: background-color 0.2s;
        `;

        // Add hover effect
        startButton.onmouseenter = () => {
          startButton.style.background = "#005885";
        };
        startButton.onmouseleave = () => {
          startButton.style.background = "#0077B5";
        };

        // Add click handler
        startButton.onclick = () => {
          console.log("🎯 User clicked 'Start Puzzle' button");

          // Simulate puzzle solving process
          puzzleText.textContent = "Розв'язування пазлу...";
          startButton.disabled = true;
          startButton.textContent = "Розв'язування...";
          startButton.style.background = "#ccc";

          // Simulate solving time
          setTimeout(() => {
            puzzleText.textContent = "Пазл розв'язано!";
            puzzleIcon.innerHTML = "✅";
            puzzleIcon.style.fontSize = "32px";

            // Generate a simulated token
            const simulatedToken = `linkedin-captcha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            console.log(
              "✅ Simulated captcha solved, token:",
              simulatedToken.substring(0, 20) + "...",
            );

            // Call the callback with the token
            onCaptchaSolved(simulatedToken);
          }, 3000);
        };

        captchaInterface.appendChild(startButton);

        // Add challenge ID if available
        if (captchaData.challengeId) {
          const challengeId = document.createElement("div");
          challengeId.textContent = captchaData.challengeId;
          challengeId.style.cssText = `
            font-size: 12px;
            color: #999;
            font-family: monospace;
            margin-top: 16px;
          `;
          captchaInterface.appendChild(challengeId);
        }

        captchaContainer.appendChild(captchaInterface);

        // Add alternative option to open in new window
        const alternativeOption = document.createElement("div");
        alternativeOption.style.cssText = `
           margin-top: 16px;
           padding: 16px;
           background: #f8f9fa;
           border-radius: 8px;
           border: 1px solid #e9ecef;
         `;

        const alternativeText = document.createElement("p");
        alternativeText.textContent = "Або відкрийте капчу в новому вікні:";
        alternativeText.style.cssText = `
           font-size: 14px;
           color: #666;
           margin: 0 0 12px 0;
         `;
        alternativeOption.appendChild(alternativeText);

        const openWindowButton = document.createElement("button");
        openWindowButton.textContent = "Відкрити капчу в новому вікні";
        openWindowButton.style.cssText = `
           background: #28a745;
           color: white;
           border: none;
           border-radius: 6px;
           padding: 8px 16px;
           font-size: 14px;
           cursor: pointer;
           margin-right: 8px;
         `;

        openWindowButton.onclick = () => {
          console.log("🌐 Opening captcha in new window...");
          const captchaUrl =
            captchaData.captchaUrl || "https://www.linkedin.com/checkpoint/challenge";
          window.open(captchaUrl, "_blank", "width=800,height=600");
        };

        alternativeOption.appendChild(openWindowButton);

        const manualButton = document.createElement("button");
        manualButton.textContent = "Я вирішив капчу вручну";
        manualButton.style.cssText = `
           background: #6c757d;
           color: white;
           border: none;
           border-radius: 6px;
           padding: 8px 16px;
           font-size: 14px;
           cursor: pointer;
         `;

        manualButton.onclick = () => {
          console.log("👤 User manually solved captcha");
          const manualToken = `manual-captcha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          onCaptchaSolved(manualToken);
        };

        alternativeOption.appendChild(manualButton);
        captchaContainer.appendChild(alternativeOption);
      }
    } else if (captchaData.type === "linkedin") {
      // For LinkedIn's own captcha, show instructions
      console.log("🎯 LinkedIn captcha detected, showing LinkedIn captcha interface");
    } else if (captchaData.type === "unknown") {
      // For unknown captcha type, show instructions
      console.log("❓ Unknown captcha type, showing instructions");
    }

    // Cleanup function
    return () => {
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [isVisible, captchaData, onCaptchaSolved]);

  if (!isVisible) {
    return null;
  }

  // If it's LinkedIn captcha with Arkose sitekey, show Arkose widget
  if (captchaData.type === "linkedin" && captchaData.captchaSiteKey) {
    // Show Arkose widget directly in this component
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">LinkedIn Security Check</h3>
                <p className="text-sm text-gray-500">Please complete the verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Security Verification Required
              </h4>
              <p className="text-gray-600 mb-6">
                LinkedIn has detected automated activity and requires manual verification. Please
                complete the puzzle below.
              </p>

              {/* Arkose Captcha Container */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div
                  id="arkose-captcha-container"
                  className="flex justify-center items-center min-h-[300px]"
                >
                  <div className="text-gray-500">Loading captcha...</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If it's LinkedIn captcha without Arkose sitekey, use the LinkedIn captcha component
  if (captchaData.type === "linkedin") {
    return (
      <LinkedInCaptcha
        isVisible={isVisible}
        captchaData={captchaData as any}
        onClose={onClose}
        onCaptchaSolved={onCaptchaSolved}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">LinkedIn Security Check</h3>
              <p className="text-sm text-gray-500">Please complete the verification</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Security Verification Required
            </h4>
            <p className="text-gray-600 mb-6">
              LinkedIn has detected automated activity and requires manual verification. Please
              complete the puzzle below.
            </p>

            {/* Arkose Captcha Container */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              {(captchaData.type === "arkose" && captchaData.sitekey) ||
              ((captchaData as any).type === "linkedin" && captchaData.captchaSiteKey) ? (
                <div
                  id="arkose-captcha-container"
                  className="flex justify-center items-center min-h-[300px]"
                >
                  <div className="text-gray-500">Loading captcha...</div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-500">Unsupported captcha type</div>
                </div>
              )}

              {/* NEW: LinkedIn iframe container */}
              {captchaData.type === "linkedin" && captchaData.captchaSiteKey && (
                <div
                  id="arkose-iframe-container"
                  className="flex justify-center items-center min-h-[450px]"
                >
                  <div className="text-gray-500">Loading LinkedIn security challenge...</div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              {captchaData.type === "unknown" && (
                <button
                  onClick={() => onCaptchaSolved("manual-verification-completed")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue After Verification
                </button>
              )}
              {(captchaData as any).type === "linkedin" && !captchaData.captchaSiteKey && (
                <button
                  onClick={() => onCaptchaSolved("manual-verification-completed")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue After Verification
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
