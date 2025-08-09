"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Monitor,
  MousePointer,
  Keyboard,
  Scroll,
  X,
  Play,
  Square,
  Eye,
  EyeOff,
} from "lucide-react";
import LinkedInWebSocketConnect from "./linkedin-websocket-connect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LinkedInIntegratedLoginProps {
  onSuccess?: (cookies: { li_at?: string; li_a?: string }) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

export function LinkedInIntegratedLogin({
  onSuccess,
  onError,
  onClose,
}: LinkedInIntegratedLoginProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookies] = useState<{ li_at?: string; li_a?: string } | null>(null);
  const [showWebSocketMode, setShowWebSocketMode] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [closeSession, setCloseSession] = useState<(() => void) | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

        // Update status and show cookies
        setIsConnected(true);
        setCookies(cookies);
        localStorage.setItem("linkedInCredentials", "true");
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));

        // console.log("✅ LinkedIn connection completed successfully!");

        if (onSuccess) {
          onSuccess(cookies);
        }

        // Force refresh the page to update hasCredentials status
        setTimeout(() => {
          // console.log("🔄 Refreshing page to update connection status...");
          window.location.reload();
        }, 2000);
      } else {
        // console.log("❌ No li_at cookie found");
        setError("No authentication cookies found. Please try logging in again.");
      }
    } catch (error) {
      console.error("❌ Error processing login success:", error);
      setError("Failed to process login credentials. Please try again.");
    }
  };

  const saveLinkedInCookies = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      // console.log("💾 Saving cookies to backend...");
      // console.log("📤 Sending data to /api/linkedin/connect:", {
      //   email: "websocket_user@example.com",
      //   li_at: cookies.li_at ? cookies.li_at.substring(0, 20) + "..." : "Not found",
      //   li_a: cookies.li_a ? cookies.li_a.substring(0, 20) + "..." : "Not found",
      // });

      const response = await fetch("/api/linkedin/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "websocket_user@example.com",
          li_at: cookies.li_at,
          li_a: cookies.li_a,
        }),
      });

      // console.log("📡 Connect API response status:", response.status);
      const result = await response.json();
      // console.log("📡 Connect API response:", result);

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

  const handleWebSocketSuccess = async (cookies: { li_at: string; li_a?: string }) => {
    // console.log("🎉 WebSocket login successful!");
    await handleLoginSuccess(cookies as { li_at?: string; li_a?: string });
  };

  const handleWebSocketError = (error: string) => {
    setError(error);
    setIsLoading(false);
  };

  const handleShowCanvas = () => {
    setShowCanvas(true);
    setShowWebSocketMode(true);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length > 0;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (emailTouched) {
      setEmailError(!validateEmail(value));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordTouched) {
      setPasswordError(!validatePassword(value));
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(!validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(!validatePassword(password));
  };

  const validateForm = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    setEmailTouched(true);
    setPasswordTouched(true);
    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);

    return isEmailValid && isPasswordValid;
  };

  const handleCloseModal = () => {
    if (closeSession) {
      closeSession();
    }
    setShowWebSocketMode(false);
    setShowCanvas(false);
    setIsLoading(false);
    setError(null);
    if (onClose) {
      onClose();
    }
  };

  const handleBackToNormal = () => {
    setShowWebSocketMode(false);
    setError(null);
  };

  // Show WebSocket mode (canvas) only when CAPTCHA is detected
  if (showCanvas) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-1">
        <div className="bg-white rounded-2xl w-full h-full max-w-[35vw] max-h-[80vh] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">LinkedIn Login</h2>
                <p className="text-gray-600 mt-1">
                  Use the browser to log in to your LinkedIn account
                </p>
              </div>
              <div className="flex gap-2">
                {onClose && (
                  <Button
                    onClick={handleCloseModal}
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-2">
            <LinkedInWebSocketConnect
              userId={userId}
              email={email}
              password={password}
              onSuccess={handleWebSocketSuccess}
              onError={handleWebSocketError}
              onClose={handleCloseModal}
              setCloseSession={setCloseSession}
              onShowCanvas={handleShowCanvas}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show main login interface
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Connect LinkedIn Account</h2>
            <p className="text-gray-600 text-sm">Use interactive browser to log in securely</p>
          </div>

          {/* Credentials Form */}
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your LinkedIn email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                className={emailTouched && emailError ? "border-red-500 focus:border-red-500" : ""}
              />
              {emailTouched && emailError && (
                <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your LinkedIn password"
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  className={
                    passwordTouched && passwordError
                      ? "border-red-500 focus:border-red-500 pr-10"
                      : "pr-10"
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {passwordTouched && passwordError && (
                <p className="text-red-500 text-xs mt-1">Password cannot be empty.</p>
              )}
            </div>
          </div>

          {/* WebSocket Login Card */}
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <MousePointer className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-700">Interactive Experience</p>
                    <p>See and control the browser directly</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm text-gray-600">
                  <svg
                    className="h-4 w-4 mt-0.5 flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
                  onClick={() => {
                    if (!validateForm()) {
                      return;
                    }
                    setIsLoading(true);
                    // Запускаємо WebSocket підключення в фоні
                    setShowWebSocketMode(true);
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing login automatically...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      Start Interactive Login
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mt-4">
              <X className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {isConnected && cookies && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <AlertDescription className="text-green-800">
                LinkedIn connected successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Close button */}
          {onClose && (
            <div className="mt-4 text-center">
              <Button onClick={onClose} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Hidden WebSocket component for background processing */}
      {showWebSocketMode && !showCanvas && (
        <div style={{ display: "none" }}>
          <LinkedInWebSocketConnect
            userId={userId}
            email={email}
            password={password}
            onSuccess={handleWebSocketSuccess}
            onError={handleWebSocketError}
            onClose={handleCloseModal}
            setCloseSession={setCloseSession}
            onShowCanvas={handleShowCanvas}
          />
        </div>
      )}
    </div>
  );
}
