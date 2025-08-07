'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Monitor, X, Globe, MousePointer, Linkedin, CheckCircle } from "lucide-react";
import LinkedInWebSocketConnect from "./linkedin-websocket-connect";

interface LinkedInIntegratedLoginProps {
  onSuccess?: (cookies: { li_at?: string; li_a?: string }) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
}

export function LinkedInIntegratedLogin({ 
  onSuccess, 
  onError,
  onClose 
}: LinkedInIntegratedLoginProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cookies, setCookies] = useState<{ li_at?: string; li_a?: string } | null>(null);
  const [showWebSocketMode, setShowWebSocketMode] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Generate a unique user ID for WebSocket session
    const storedUserId = localStorage.getItem('linkedin_user_id');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('linkedin_user_id', newUserId);
      setUserId(newUserId);
    }
  }, []);

  const handleLoginSuccess = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      console.log('🎉 Login success! Processing cookies...');
      console.log('📋 li_at cookie:', cookies.li_at ? cookies.li_at.substring(0, 20) + '...' : 'Not found');
      console.log('📋 li_a cookie:', cookies.li_a ? cookies.li_a.substring(0, 20) + '...' : 'Not found');
      
      if (cookies.li_at) {
        // Save cookies to backend
        await saveLinkedInCookies(cookies);
        
        // Update status and show cookies
        setIsConnected(true);
        setCookies(cookies);
        localStorage.setItem("linkedInCredentials", "true");
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));
        
        console.log('✅ LinkedIn connection completed successfully!');
        
        if (onSuccess) {
          onSuccess(cookies);
        }
        
        // Force refresh the page to update hasCredentials status
        setTimeout(() => {
          console.log('🔄 Refreshing page to update connection status...');
          window.location.reload();
        }, 2000);
      } else {
        console.log('❌ No li_at cookie found');
        setError('No authentication cookies found. Please try logging in again.');
      }
    } catch (error) {
      console.error('❌ Error processing login success:', error);
      setError('Failed to process login credentials. Please try again.');
    }
  };

  const saveLinkedInCookies = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      console.log('💾 Saving cookies to backend...');
      console.log('📤 Sending data to /api/linkedin/connect:', {
        email: 'websocket_user@example.com',
        li_at: cookies.li_at ? cookies.li_at.substring(0, 20) + '...' : 'Not found',
        li_a: cookies.li_a ? cookies.li_a.substring(0, 20) + '...' : 'Not found'
      });
      
      const response = await fetch('/api/linkedin/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'websocket_user@example.com',
          li_at: cookies.li_at,
          li_a: cookies.li_a,
        }),
      });

      console.log('📡 Connect API response status:', response.status);
      const result = await response.json();
      console.log('📡 Connect API response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save LinkedIn credentials');
      }

      console.log('✅ Cookies saved successfully to backend!');
      return result;
    } catch (error) {
      console.error('❌ Error saving cookies:', error);
      throw error;
    }
  };

  const handleWebSocketSuccess = async (cookies: { li_at: string; li_a?: string }) => {
    console.log('🎉 WebSocket login successful!');
    await handleLoginSuccess(cookies as { li_at?: string; li_a?: string });
  };

  const handleWebSocketError = (error: string) => {
    console.error('❌ WebSocket error:', error);
    setError(`WebSocket error: ${error}`);
    if (onError) {
      onError(error);
    }
  };

  const handleBackToNormal = () => {
    setShowWebSocketMode(false);
    setError(null);
  };

  // Show WebSocket mode
  if (showWebSocketMode) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Interactive LinkedIn Login
                </h2>
                <p className="text-gray-600 mt-1">
                  Use the interactive browser to log in to LinkedIn manually
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleBackToNormal}
                  variant="outline"
                  size="sm"
                >
                  ← Back
                </Button>
                {onClose && (
                  <Button 
                    onClick={onClose}
                    variant="outline"
                    size="sm"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
            <LinkedInWebSocketConnect
              userId={userId}
              onSuccess={handleWebSocketSuccess}
              onError={handleWebSocketError}
            />
          </div>
        </div>
      </div>
    );
  }

  // Show main login interface
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Linkedin className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Connect LinkedIn Account
            </h2>
            <p className="text-gray-600 text-sm">
              Use interactive browser to log in securely
            </p>
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
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Globe className="h-4 w-4" />
                  Start Interactive Login
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
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                LinkedIn connected successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Close button */}
          {onClose && (
            <div className="mt-4 text-center">
              <Button 
                onClick={onClose}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 