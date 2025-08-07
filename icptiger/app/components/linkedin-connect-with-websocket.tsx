'use client';

import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, Monitor, X, Globe, MousePointer, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LinkedInWebSocketConnect from "./linkedin-websocket-connect";

export function LinkedInConnectWithWebSocket() {
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
        
        // Force refresh the page to update hasCredentials status
        setTimeout(() => {
          console.log('🔄 Refreshing page to update connection status...');
          window.location.reload();
        }, 3000);
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
    await handleLoginSuccess(cookies);
  };

  const handleWebSocketError = (error: string) => {
    console.error('❌ WebSocket error:', error);
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
            <Button 
              onClick={handleBackToNormal}
              variant="outline"
              className="mb-4"
            >
              ← Back to Login Options
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Interactive LinkedIn Login
            </h1>
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

  // Show main login interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Linkedin className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Connect LinkedIn Account
          </h1>
          <p className="text-gray-600">
            Use interactive browser to log in securely
          </p>
        </div>

        {/* WebSocket Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Interactive Browser Login
            </CardTitle>
            <CardDescription>
              Manual login with real browser (recommended)
            </CardDescription>
          </CardHeader>
          <CardContent>
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
      </div>
    </div>
  );
} 