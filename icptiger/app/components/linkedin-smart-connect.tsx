import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, Monitor, X, Copy, Eye, EyeOff, ExternalLink } from "lucide-react";

export function LinkedInSmartConnect() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showIframe, setShowIframe] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [liAt, setLiAt] = useState('');
  const [liA, setLiA] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'logging-in' | 'success' | 'failed'>('idle');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLaunchIframe = () => {
    setIsLoading(true);
    setError(null);
    setShowIframe(true);
    setLoginStatus('logging-in');
    setIsLoading(false);
  };

  const handleManualInput = () => {
    setShowIframe(false);
    setShowManualInput(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liAt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/linkedin/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'manual-auth@example.com',
          li_at: liAt.trim(),
          li_a: liA.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to connect LinkedIn');
      }

      setIsConnected(true);
      localStorage.setItem("linkedInCredentials", "true");
      window.dispatchEvent(new Event("linkedInCredentialsChanged"));
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from LinkedIn
      if (event.origin !== 'https://www.linkedin.com') return;
      
      if (event.data.type === 'linkedin-login-success') {
        setLoginStatus('success');
        // Extract cookies from the message
        if (event.data.cookies) {
          handleLoginSuccess(event.data.cookies);
        }
      } else if (event.data.type === 'linkedin-login-failed') {
        setLoginStatus('failed');
        setError('Login failed. Please try again.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleLoginSuccess = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      const response = await fetch('/api/linkedin/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'iframe-auth@example.com',
          li_at: cookies.li_at,
          li_a: cookies.li_a,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save LinkedIn credentials');
      }

      setIsConnected(true);
      localStorage.setItem("linkedInCredentials", "true");
      window.dispatchEvent(new Event("linkedInCredentialsChanged"));
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error saving cookies:', error);
      setError('Failed to save login credentials. Please try manual input.');
      setLoginStatus('failed');
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

  if (showManualInput) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Connect Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LinkedIn</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paste your LinkedIn cookies to connect your account
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                li_at Cookie <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="AQEDAR..."
                  value={liAt}
                  onChange={(e) => setLiAt(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all duration-200"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {liAt && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(liAt)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">This is your main authentication cookie</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                li_a Cookie <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="AQEDAR..."
                  value={liA}
                  onChange={(e) => setLiA(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {liA && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(liA)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Additional authentication cookie (optional)</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-red-600 text-xs">!</span>
                  </div>
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!liAt.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Connecting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Connect LinkedIn Account
                </div>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setShowManualInput(false)}
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              ← Back to login options
            </button>
          </div>
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
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Connect Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LinkedIn</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Log in directly to LinkedIn through our secure flow.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <Monitor className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Choose Login Method</h2>
        </div>

        <div className="space-y-4">
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
                Login with LinkedIn (Embedded)
              </div>
            )}
          </button>

          <button
            onClick={handleManualInput}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-gray-200"
          >
            <div className="flex items-center justify-center">
              <Copy className="w-5 h-5 mr-2" />
              Manual Cookie Input
            </div>
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
          <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">LinkedIn Login</h3>
              <button
                onClick={() => setShowIframe(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 p-4">
              {loginStatus === 'logging-in' && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <LoadingSpinner size="lg" color="primary" />
                    <p className="text-gray-600 mt-4">Please complete your LinkedIn login below</p>
                  </div>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src="https://www.linkedin.com/login"
                className="w-full h-full border-0 rounded-lg"
                title="LinkedIn Login"
              />
            </div>
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-600 text-center mb-3">
                After logging in, you can either wait for automatic detection or use manual input.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowIframe(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <button
                  onClick={handleManualInput}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Manual Input
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 