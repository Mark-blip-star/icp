import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";

interface CaptchaHandlerProps {
  isVisible: boolean;
  htmlContent: string;
  onClose: () => void;
  onAction: (action: {
    type: string;
    selector?: string;
    value?: string;
    x?: number;
    y?: number;
  }) => void;
}

export function CaptchaHandler({ isVisible, htmlContent, onClose, onAction }: CaptchaHandlerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaData, setCaptchaData] = useState<{
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonSelector?: string;
    challengeId?: string;
    hasAudio?: boolean;
  }>({});

  useEffect(() => {
    if (isVisible && htmlContent) {
      console.log("🎯 CaptchaHandler: Processing HTML content");
      console.log("📄 HTML length:", htmlContent.length);

      // Створюємо тимчасовий div для парсингу HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;

      // Шукаємо дані капчі
      const extractedData: any = {};

      // Шукаємо заголовок
      const titleElements = tempDiv.querySelectorAll('h1, h2, h3, .title, [class*="title"]');
      Array.from(titleElements).forEach((element) => {
        const text = element.textContent?.trim();
        if (
          text &&
          (text.includes("перевірку") || text.includes("security") || text.includes("check"))
        ) {
          extractedData.title = text;
        }
      });

      // Шукаємо підзаголовок
      const subtitleElements = tempDiv.querySelectorAll("p, div, span");
      Array.from(subtitleElements).forEach((element) => {
        const text = element.textContent?.trim();
        if (
          text &&
          (text.includes("Захист") || text.includes("Protect") || text.includes("account"))
        ) {
          extractedData.subtitle = text;
        }
      });

      // Шукаємо кнопку
      const buttonElements = tempDiv.querySelectorAll('button, a, [role="button"]');
      Array.from(buttonElements).forEach((element) => {
        const text = element.textContent?.trim();
        if (
          text &&
          (text.includes("пазл") || text.includes("puzzle") || text.includes("розпочати"))
        ) {
          extractedData.buttonText = text;
          // Створюємо селектор для цієї кнопки
          if (element.id) {
            extractedData.buttonSelector = `#${element.id}`;
          } else if (element.className) {
            const classes = element.className.split(" ").filter((c) => c.trim());
            if (classes.length > 0) {
              extractedData.buttonSelector = `.${classes.join(".")}`;
            }
          } else {
            extractedData.buttonSelector = "button";
          }
        }
      });

      // Шукаємо challenge ID
      const challengeIdElements = tempDiv.querySelectorAll('input[name="challengeId"], code, span');
      Array.from(challengeIdElements).forEach((element) => {
        const text = element.textContent?.trim();
        if (text && text.length > 20 && text.includes(".")) {
          extractedData.challengeId = text;
        }
      });

      // Перевіряємо наявність аудіо опції
      const audioElements = tempDiv.querySelectorAll("*");
      Array.from(audioElements).forEach((element) => {
        const text = element.textContent?.trim();
        if (text && text.includes("Аудіо")) {
          extractedData.hasAudio = true;
        }
      });

      console.log("🎯 Extracted captcha data:", extractedData);
      setCaptchaData(extractedData);
    }
  }, [isVisible, htmlContent]);

  const handleStartPuzzle = () => {
    console.log("🎯 User clicked Start Puzzle button");
    console.log("🎯 Using selector:", captchaData.buttonSelector || "button");
    onAction({
      type: "click",
      selector: captchaData.buttonSelector || "button",
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    onAction({ type: "refresh" });
    setTimeout(() => setIsLoading(false), 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Verification Required</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh verification"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close verification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="text-center">
            {/* LinkedIn Logo */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg">
                <span className="text-white font-bold text-lg">in</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {captchaData.title || "Давайте проведемо швидку перевірку безпеки"}
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-gray-700 mb-6">
              {captchaData.subtitle || "Захист вашого облікового запису"}
            </p>

            {/* Description */}
            <p className="text-gray-600 mb-8">
              Будь ласка, розв'яжіть цей пазл, щоб ми знали, що Ви є реальною людиною
            </p>

            {/* Start Puzzle Button */}
            <button
              onClick={handleStartPuzzle}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              {captchaData.buttonText || "Розпочати пазл"}
            </button>

            {/* Challenge ID */}
            {captchaData.challengeId && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 font-mono break-all">
                  {captchaData.challengeId}
                </p>
              </div>
            )}

            {/* Audio Option */}
            {captchaData.hasAudio && (
              <div className="mt-4 flex items-center justify-center space-x-2 text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.5 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.5l3.883-2.717zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">Аудіо</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Instructions:</strong> Click "Розпочати пазл" to start the verification. Your
              actions will be synchronized with the browser.
            </p>
            <p className="text-xs text-gray-500">
              This form is directly connected to your LinkedIn session. Any interaction here will be
              reflected in the browser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
