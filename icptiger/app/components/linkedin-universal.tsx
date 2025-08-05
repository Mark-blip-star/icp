import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, Monitor, X, ExternalLink, Eye, EyeOff } from "lucide-react";

export function LinkedInUniversal() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'logging-in' | 'success' | 'failed'>('idle');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cookies, setCookies] = useState<{ li_at?: string; li_a?: string } | null>(null);
  
  // Version number to force cache refresh
  const VERSION = "3.0.0";

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
        setLoginStatus('failed');
      }
    } catch (error) {
      console.error('❌ Error processing login success:', error);
      setError('Failed to process login credentials. Please try again.');
      setLoginStatus('idle');
    }
  };

  const saveLinkedInCookies = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      console.log('💾 Saving cookies to backend...');
      console.log('📤 Sending data to /api/linkedin/connect:', {
        email: email,
        li_at: cookies.li_at ? cookies.li_at.substring(0, 20) + '...' : 'Not found',
        li_a: cookies.li_a ? cookies.li_a.substring(0, 20) + '...' : 'Not found'
      });
      
      const response = await fetch('/api/linkedin/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoginStatus('logging-in');
    setError(null);
    
    try {
      console.log('🔐 Starting backend login process...');
      console.log('📧 Email:', email);
      console.log('🔑 Password length:', password.length);
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch('/api/linkedin/automated-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const result = await response.json();
      console.log('✅ Backend login response:', result);

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Login failed');
      }

      if (result.status === 'success' && result.cookies) {
        console.log('🎉 Backend login successful!');
        console.log('🍪 Received cookies from backend:', result.cookies);
        setLoginStatus('success');
        handleLoginSuccess(result.cookies);
      } else if (result.status === 'verification_required') {
        console.log('📱 Verification required');
        setError('Phone verification required. Please check your phone and complete the verification, then try again.');
        setLoginStatus('failed');
      } else if (result.status === 'failed') {
        console.log('❌ Backend login failed');
        setError(result.message || 'Login failed. Please check your credentials and try again.');
        setLoginStatus('failed');
      } else {
        throw new Error('Unexpected response from backend');
      }

    } catch (error) {
      console.error('❌ Error during login:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Login timeout. The process took too long. Please try again.');
        } else {
          setError(error.message || 'Login failed. Please try again.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
      
      setLoginStatus('failed');
    }
  };

  if (isConnected) {
    return (
      <div className="w-full max-w-2xl mx-auto h-screen flex flex-col justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Connected!</h2>
          <p className="text-gray-600 mb-4">Your LinkedIn account is now connected to Tiger</p>
          <div className="animate-pulse text-sm text-gray-500 mb-4">
            Redirecting to dashboard in 3 seconds...
          </div>
          <button
            onClick={() => {
              console.log('🔄 Manual redirect triggered...');
              window.location.reload();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-screen flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Connect Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LinkedIn</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your LinkedIn credentials and we'll automatically connect your account.
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm max-w-md mx-auto">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <Monitor className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">LinkedIn Login</h2>
        </div>

        <div className="mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 mb-1 text-sm">Security:</h4>
            <ul className="text-xs text-blue-800 space-y-0.5">
              <li>• Your credentials are sent securely to our backend</li>
              <li>• We use Puppeteer to automate the login process</li>
              <li>• Only authentication tokens are stored</li>
              <li>• Your password is never stored permanently</li>
            </ul>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loginStatus === 'logging-in'}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            {loginStatus === 'logging-in' ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Logging in...</span>
              </div>
            ) : (
              'Login to LinkedIn'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-red-600 text-xs">!</span>
              </div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {loginStatus === 'success' && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <CheckCircle className="h-3 w-3 text-green-600" />
              </div>
              <p className="text-green-800 text-sm">Login successful! Processing your account...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 