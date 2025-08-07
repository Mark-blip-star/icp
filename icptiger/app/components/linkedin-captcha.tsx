import React, { useEffect, useRef } from "react";
import { X, AlertCircle, Shield } from "lucide-react";

interface LinkedInCaptchaData {
  type: "linkedin";
  captchaSiteKey?: string;
  challengeId?: string;
  csrfToken?: string;
  formAction?: string;
  formMethod?: string;
  pageTitle?: string;
  pageContent?: string;
  captchaUrl?: string;
  realContent?: {
    html: string;
    text: string;
    title: string;
    forms: Array<{
      action: string;
      method: string;
      inputs: Array<{
        name: string;
        value: string;
        type: string;
      }>;
    }>;
  };
}

interface LinkedInCaptchaProps {
  isVisible: boolean;
  captchaData: LinkedInCaptchaData;
  onClose: () => void;
  onCaptchaSolved: (token: string) => void;
}

export function LinkedInCaptcha({
  isVisible,
  captchaData,
  onClose,
  onCaptchaSolved,
}: LinkedInCaptchaProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!isVisible || !captchaData) {
      return;
    }

    console.log("🎯 LinkedIn captcha component initialized with data:", captchaData);

    // Set up message listener for iframe communication
    const messageListener = (event: MessageEvent) => {
      if (event.origin === "https://www.linkedin.com") {
        console.log("📨 Received message from LinkedIn iframe:", event.data);

        if (event.data?.type === "CAPTCHA_SOLVED") {
          console.log("✅ Captcha solved in iframe");
          onCaptchaSolved(event.data.token);
        }
      }
    };

    window.addEventListener("message", messageListener);

    return () => {
      window.removeEventListener("message", messageListener);
    };
  }, [isVisible, captchaData, onCaptchaSolved]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              Security Verification Required
            </h4>
            <p className="text-gray-600">
              LinkedIn has detected automated activity and requires manual verification. Please
              complete the puzzle below to continue.
            </p>
          </div>

          {/* LinkedIn Captcha Iframe */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-center">
              <iframe
                ref={iframeRef}
                src="https://www.linkedin.com/checkpoint/challenge/funCaptchaInternal"
                width="400"
                height="450"
                frameBorder="0"
                title="LinkedIn Security Challenge"
                className="border-none rounded-lg shadow-sm"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              Complete the security challenge in the frame above. Once finished, the login process
              will continue automatically.
            </p>
          </div>

          {/* Manual Continue Button (fallback) */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => onCaptchaSolved("manual-verification-completed")}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continue After Manual Verification
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
