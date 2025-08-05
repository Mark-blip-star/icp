import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { CheckCircle, Monitor, X, ExternalLink } from "lucide-react";

export function LinkedInSimplePopup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'logging-in' | 'success' | 'failed'>('idle');
  const popupRef = useRef<Window | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartLogin = () => {
    setIsLoading(true);
    setError(null);
    
    // Open LinkedIn in popup
    const popup = window.open(
      'https://www.linkedin.com/login',
      '_blank',
      'width=600,height=800,left=100,top=100,scrollbars=yes,resizable=yes'
    );
    
    if (popup) {
      console.log('🔄 Opened LinkedIn in popup window');
      popupRef.current = popup;
      setShowPopup(true);
      setLoginStatus('logging-in');
      startLoginCheck(popup);
    } else {
      setError('Popup blocked by browser. Please allow popups and try again.');
    }
    
    setIsLoading(false);
  };

  const handleLoginSuccess = async (cookies: { li_at?: string; li_a?: string }) => {
    try {
      console.log('🎉 Login success! Processing cookies...');
      console.log('📋 li_at cookie:', cookies.li_at ? cookies.li_at.substring(0, 20) + '...' : 'Not found');
      console.log('📋 li_a cookie:', cookies.li_a ? cookies.li_a.substring(0, 20) + '...' : 'Not found');
      
      if (cookies.li_at) {
        // Save cookies to backend
        await saveLinkedInCookies(cookies);
        
        // Close popup
        if (popupRef.current && !popupRef.current.closed) {
          popupRef.current.close();
        }
        setShowPopup(false);
        
        // Update status
        setIsConnected(true);
        localStorage.setItem("linkedInCredentials", "true");
        window.dispatchEvent(new Event("linkedInCredentialsChanged"));
        
        console.log('✅ LinkedIn connection completed successfully!');
        
        // Redirect after success
        setTimeout(() => {
          window.location.reload();
        }, 2000);
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
      const response = await fetch('/api/linkedin/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'popup-auth@example.com',
          li_at: cookies.li_at,
          li_a: cookies.li_a,
        }),
      });

      const result = await response.json();

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

  const startLoginCheck = (popup: Window) => {
    console.log('🔍 Starting popup login check...');
    
    const checkInterval = setInterval(() => {
      try {
        if (popup.closed) {
          console.log('❌ Popup was closed by user');
          clearInterval(checkInterval);
          setShowPopup(false);
          setLoginStatus('idle');
          return;
        }

        const currentUrl = popup.location.href;
        console.log('🔍 Current popup URL:', currentUrl);
        
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
        
        // Also check for successful login redirects
        const successPatterns = [
          'linkedin.com/feed',
          'linkedin.com/mynetwork',
          'linkedin.com/jobs',
          'linkedin.com/messaging',
          'linkedin.com/notifications',
          'linkedin.com/learning',
          'linkedin.com/sales',
          'linkedin.com/talent',
          'linkedin.com/company',
          'linkedin.com/in/',
          'linkedin.com/pulse'
        ];
        
        const isLoggedIn = loginPatterns.some(pattern => currentUrl.includes(pattern)) ||
                          successPatterns.some(pattern => currentUrl.includes(pattern));
        
        if (isLoggedIn) {
          console.log('✅ Login detected in popup! URL:', currentUrl);
          clearInterval(checkInterval);
          
          // Extract cookies from popup
          extractCookiesFromPopup(popup);
        }
      } catch (error) {
        console.log('🔄 CORS error checking popup URL, continuing...');
      }
    }, 2000);
    
    // Stop checking after 5 minutes
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!popup.closed) {
        console.log('⏰ Popup login check timeout');
        setError('Login timeout. Please try again.');
      }
    }, 300000);
  };

  const extractCookiesFromPopup = (popup: Window) => {
    try {
      console.log('🍪 Extracting cookies from popup...');
      
      // Inject script to extract cookies
      const script = popup.document.createElement('script');
      script.textContent = `
        try {
          const cookies = document.cookie;
          console.log('📋 All cookies in popup:', cookies);
          
          const liAt = cookies.split(';').find(c => c.trim().startsWith('li_at='))?.split('=')[1];
          const liA = cookies.split(';').find(c => c.trim().startsWith('li_a='))?.split('=')[1];
          
          console.log('🍪 li_at found in popup:', !!liAt);
          console.log('🍪 li_a found in popup:', !!liA);
          
          if (liAt) {
            console.log('✅ Authentication cookies found in popup!');
            console.log('📋 li_at cookie (first 20 chars):', liAt.substring(0, 20) + '...');
            if (liA) {
              console.log('📋 li_a cookie (first 20 chars):', liA.substring(0, 20) + '...');
            }
            
            window.opener.postMessage({
              type: 'linkedin-login-success',
              cookies: { li_at: liAt, li_a: liA },
              url: window.location.href
            }, '*');
          } else {
            console.log('❌ No authentication cookies found in popup');
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
      console.log('✅ Cookie extraction script injected into popup');
    } catch (error) {
      console.log('❌ Could not inject script into popup:', error);
      setError('Could not extract cookies from popup. Please try again.');
    }
  };

  const closePopup = () => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    setShowPopup(false);
    setLoginStatus('idle');
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
    }
  };

  // Listen for messages from popup
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'linkedin-login-success') {
        console.log('✅ Login success detected via message:', event.data.url);
        console.log('📨 Received cookies:', event.data.cookies);
        setLoginStatus('success');
        handleLoginSuccess(event.data.cookies);
      } else if (event.data.type === 'linkedin-login-no-cookies') {
        console.log('❌ Login detected but no cookies found:', event.data.url);
        setError('Login successful but no authentication cookies found. Please try again.');
        setLoginStatus('failed');
      } else if (event.data.type === 'linkedin-login-error') {
        console.log('❌ Error during login process:', event.data.error);
        setError(`Login error: ${event.data.error}. Please try again.`);
        setLoginStatus('failed');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

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
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Connect Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LinkedIn</span>
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
            onClick={handleStartLogin}
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
          </div>
        )}
      </div>

      {/* Popup Status */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">LinkedIn Login</h3>
              <p className="text-gray-600 mb-4">
                A new window has opened for LinkedIn login. Please complete your login there.
              </p>
              <div className="flex items-center justify-center mb-4">
                <LoadingSpinner size="sm" color="primary" />
                <span className="ml-2 text-sm text-gray-500">Waiting for login...</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-900 mb-2">What happens next:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Complete your LinkedIn login in the popup</li>
                  <li>• We'll automatically detect when you're logged in</li>
                  <li>• Your account will be connected securely</li>
                  <li>• The popup will close automatically</li>
                </ul>
              </div>
              <button
                onClick={closePopup}
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