"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { X, RefreshCw, Shield, Linkedin, CheckCircle, AlertCircle } from "lucide-react";
import { io, Socket } from "socket.io-client";
import { cn } from "@/lib/utils";

interface LinkedInBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
}

export function LinkedInBrowserModal({ isOpen, onClose, onSuccess, userId }: LinkedInBrowserModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'ready' | 'success' | 'error'>('connecting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    if (!isOpen || !userId) return;

    const LOGIN_API_BASE = process.env.NEXT_PUBLIC_SOCKET_API_BASE_URL || "http://localhost:3008";
    const sock = io(LOGIN_API_BASE, {
      query: { user_id: userId },
      transports: ['websocket', 'polling'],
    });

    sock.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setConnectionStatus('connecting');
      
      // Start LinkedIn login session
      sock.emit("startLogin", { userId });
    });

    sock.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      setConnectionStatus('error');
    });

    sock.on("readyForLogin", (data: any) => {
      console.log("Ready for login:", data);
      setConnectionStatus('ready');
      setIsConnecting(false);
    });

    sock.on("loginSuccess", async (data: any) => {
      console.log("Login successful:", data);
      setConnectionStatus('success');
      setIsLoginSuccess(true);
      
      // Save to backend
      try {
        const response = await fetch('/api/linkedin/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'browser-auth@example.com',
            browser_session: true,
            user_id: userId,
          }),
        });

        if (response.ok) {
          // Update local storage
          localStorage.setItem("linkedInCredentials", "true");
          window.dispatchEvent(new Event("linkedInCredentialsChanged"));
          
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        }
      } catch (error) {
        console.error("Failed to save LinkedIn connection:", error);
      }
    });

    sock.on("loginError", (error: string) => {
      console.error("Login error:", error);
      setConnectionStatus('error');
      setErrorMessage(error);
    });

    sock.on("error", (error: string) => {
      console.error("Socket error:", error);
      setConnectionStatus('error');
      setErrorMessage(error);
    });

    sock.on("screencast", (data: string) => {
      setScreenshot(data);
    });

    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, [isOpen, userId]);

  // Handle mouse events
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!socket || connectionStatus !== 'ready') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    socket.emit("mouse", {
      type: "click",
      x: Math.round(x),
      y: Math.round(y),
    });
  };

  // Handle keyboard events
  useEffect(() => {
    if (!socket || connectionStatus !== 'ready') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for common keys to avoid browser shortcuts
      if (['Tab', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
        e.preventDefault();
      }

      socket.emit("keyboard", {
        type: "press",
        key: e.key,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [socket, connectionStatus]);

  // Render screenshot on canvas
  useEffect(() => {
    if (!screenshot || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = `data:image/jpeg;base64,${screenshot}`;
  }, [screenshot]);

  const handleClose = () => {
    if (socket) {
      socket.emit("closeSession");
      socket.disconnect();
    }
    onClose();
  };

  const renderContent = () => {
    if (connectionStatus === 'success' || isLoginSuccess) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Successfully Connected!</h3>
          <p className="font-outfit text-gray-600 text-center mb-6">
            Your LinkedIn account is now connected to Tiger. You can start automating your outreach.
          </p>
          <div className="animate-pulse text-sm text-gray-500">Redirecting to dashboard...</div>
        </div>
      );
    }

    if (connectionStatus === 'error') {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Connection Failed</h3>
          <p className="font-outfit text-gray-600 text-center mb-6">
            {errorMessage || "Unable to connect to LinkedIn. Please try again."}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      );
    }

    if (connectionStatus === 'connecting') {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Linkedin className="w-10 h-10 text-white" />
          </div>
          <h3 className="font-recoleta text-2xl font-bold mb-4 text-gray-900">Connecting to LinkedIn</h3>
          <p className="font-outfit text-gray-600 text-center mb-6">
            Setting up secure browser session...
          </p>
          <LoadingSpinner size="lg" color="primary" />
        </div>
      );
    }

    // Ready state - show browser
    return (
      <div className="flex flex-col h-full">
        {/* Browser Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 border border-gray-200">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="font-outfit text-sm text-gray-700">linkedin.com</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm font-outfit text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Session</span>
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 bg-white relative overflow-hidden">
          {screenshot ? (
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="w-full h-full object-contain cursor-pointer"
              style={{ maxHeight: '70vh' }}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <LoadingSpinner size="lg" color="primary" text="Loading LinkedIn..." />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="font-outfit font-semibold text-gray-900 mb-1">How to connect:</h4>
              <ol className="font-outfit text-sm text-gray-700 space-y-1">
                <li>1. Enter your LinkedIn email and password in the form above</li>
                <li>2. Click "Sign in" to log into your LinkedIn account</li>
                <li>3. Complete any security verification if prompted</li>
                <li>4. Once logged in, your account will be automatically connected</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 border-none bg-white rounded-2xl shadow-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-recoleta text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-white" />
              </div>
              Connect Your LinkedIn
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}