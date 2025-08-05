@@ .. @@
-// file: app/components/linkedin-connect.tsx
-
-import React, { useState } from "react";
-import { createClient } from "@/utils/supabase/client";
-import { LoadingSpinner } from "@/components/ui/loading";
-import { CheckCircle, Copy, Eye, EyeOff, ExternalLink, Shield, Zap } from "lucide-react";
-
-type AuthResponse = { userId: string | null };
+import React, { useState } from "react";
+import { Button } from "@/components/ui/button";
+import { Linkedin, Shield, Zap, ArrowRight, CheckCircle } from "lucide-react";
+import { LinkedInBrowserModal } from "./linkedin-browser-modal";
+import { useUser } from "@/context/user-context";
 
 export function LinkedInConnect() {
-  const [step, setStep] = useState(1);
-  const [liAt, setLiAt] = useState('');
-  const [liA, setLiA] = useState('');
-  const [isLoading, setIsLoading] = useState(false);
-  const [showPassword, setShowPassword] = useState(false);
-  const [isConnected, setIsConnected] = useState(false);
-  const [error, setError] = useState<string | null>(null);
-
-  const supabase = createClient();
-
-  const handleSubmit = async (e: React.FormEvent) => {
-    e.preventDefault();
-    if (!liAt.trim()) return;
-
-    setIsLoading(true);
-    setError(null);
-
-    try {
-      const response = await fetch('/api/linkedin/connect', {
-        method: 'POST',
-        headers: { 'Content-Type': 'application/json' },
-        body: JSON.stringify({
-          email: 'cookie-auth@example.com',
-          li_at: liAt.trim(),
-          li_a: liA.trim() || null,
-        }),
-      });
-
-      const result = await response.json();
-
-      if (!response.ok) {
-        throw new Error(result.error || 'Failed to connect LinkedIn');
-      }
-
-      setIsConnected(true);
-      localStorage.setItem("linkedInCredentials", "true");
-      window.dispatchEvent(new Event("linkedInCredentialsChanged"));
-      
-      // Redirect after success
-      setTimeout(() => {
-        window.location.reload();
-      }, 2000);
-
-    } catch (err) {
-      setError(err instanceof Error ? err.message : 'Connection failed');
-    } finally {
-      setIsLoading(false);
-    }
-  };
-
-  const copyToClipboard = (text: string) => {
-    navigator.clipboard.writeText(text);
-  };
-
-  if (isConnected) {
-    return (
-      <div className="w-full max-w-2xl mx-auto p-8">
-        <div className="text-center">
-          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
-            <CheckCircle className="w-8 h-8 text-green-600" />
-          </div>
-          <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Connected!</h2>
-          <p className="text-gray-600 mb-4">Your LinkedIn account is now connected to Tiger</p>
-          <div className="animate-pulse text-sm text-gray-500">Redirecting to dashboard...</div>
-        </div>
-      </div>
-    );
-  }
+  const [showModal, setShowModal] = useState(false);
+  const user = useUser();
+
+  const handleSuccess = () => {
+    setShowModal(false);
+    // Trigger a page refresh to update the UI
+    window.location.reload();
+  };
 
   return (
-    <div className="w-full max-w-4xl mx-auto p-6">
-      {/* Header */}
-      <div className="text-center mb-8">
-        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
-          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
-            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
-          </svg>
-        </div>
-        <h1 className="text-4xl font-bold text-gray-900 mb-3">
-          Connect Your <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">LinkedIn</span>
-        </h1>
-        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
-          Securely connect your LinkedIn account to unlock powerful automation features
-        </p>
-      </div>
-
-      {/* Main Content */}
-      <div className="grid lg:grid-cols-2 gap-8">
-        {/* Instructions Panel */}
-        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
-          <div className="flex items-center mb-6">
-            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
-              <Zap className="w-5 h-5 text-white" />
-            </div>
-            <h2 className="text-2xl font-bold text-gray-900">Quick Setup Guide</h2>
-          </div>
-
-          <div className="space-y-6">
-            <div className="flex items-start space-x-4">
-              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
-                1
-              </div>
-              <div>
-                <h3 className="font-semibold text-gray-900 mb-1">Open LinkedIn</h3>
-                <p className="text-gray-600 text-sm">Go to LinkedIn and make sure you're logged in</p>
-                <a 
-                  href="https://linkedin.com" 
-                  target="_blank" 
-                  rel="noopener noreferrer"
-                  className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2"
-                >
-                  Open LinkedIn <ExternalLink className="w-3 h-3 ml-1" />
-                </a>
-              </div>
-            </div>
-
-            <div className="flex items-start space-x-4">
-              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
-                2
-              </div>
-              <div>
-                <h3 className="font-semibold text-gray-900 mb-1">Open Developer Tools</h3>
-                <p className="text-gray-600 text-sm">Press F12 or right-click and select "Inspect"</p>
-              </div>
-            </div>
-
-            <div className="flex items-start space-x-4">
-              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
-                3
-              </div>
-              <div>
-                <h3 className="font-semibold text-gray-900 mb-1">Find Cookies</h3>
-                <p className="text-gray-600 text-sm">Go to Application → Storage → Cookies → https://linkedin.com</p>
-              </div>
-            </div>
-
-            <div className="flex items-start space-x-4">
-              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
-                4
-              </div>
-              <div>
-                <h3 className="font-semibold text-gray-900 mb-1">Copy Cookies</h3>
-                <p className="text-gray-600 text-sm">Copy the values of <code className="bg-blue-100 px-2 py-1 rounded text-xs">li_at</code> and <code className="bg-blue-100 px-2 py-1 rounded text-xs">li_a</code> cookies</p>
-              </div>
-            </div>
-          </div>
-
-          <div className="mt-8 p-4 bg-blue-100 rounded-lg">
-            <div className="flex items-center mb-2">
-              <Shield className="w-4 h-4 text-blue-600 mr-2" />
-              <span className="text-sm font-medium text-blue-900">Security Note</span>
-            </div>
-            <p className="text-xs text-blue-800">
-              Your cookies are encrypted and stored securely. We never store your LinkedIn password.
-            </p>
-          </div>
-        </div>
-
-        {/* Cookie Input Form */}
-        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
-          <div className="flex items-center mb-6">
-            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3">
-              <CheckCircle className="w-5 h-5 text-white" />
-            </div>
-            <h2 className="text-2xl font-bold text-gray-900">Paste Your Cookies</h2>
-          </div>
-
-          <form onSubmit={handleSubmit} className="space-y-6">
-            {/* li_at Cookie */}
-            <div>
-              <label className="block text-sm font-semibold text-gray-700 mb-3">
-                li_at Cookie <span className="text-red-500">*</span>
-              </label>
-              <div className="relative">
-                <input
-                  type={showPassword ? "text" : "password"}
-                  placeholder="AQEDAR..."
-                  value={liAt}
-                  onChange={(e) => setLiAt(e.target.value)}
-                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all duration-200"
-                  required
-                />
-                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
-                  <button
-                    type="button"
-                    onClick={() => setShowPassword(!showPassword)}
-                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
-                  >
-                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
-                  </button>
-                  {liAt && (
-                    <button
-                      type="button"
-                      onClick={() => copyToClipboard(liAt)}
-                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
-                    >
-                      <Copy className="w-4 h-4" />
-                    </button>
-                  )}
-                </div>
-              </div>
-              <p className="text-xs text-gray-500 mt-2">This is your main authentication cookie</p>
-            </div>
-
-            {/* li_a Cookie */}
-            <div>
-              <label className="block text-sm font-semibold text-gray-700 mb-3">
-                li_a Cookie <span className="text-gray-400">(Optional)</span>
-              </label>
-              <div className="relative">
-                <input
-                  type={showPassword ? "text" : "password"}
-                  placeholder="AQEDAR..."
-                  value={liA}
-                  onChange={(e) => setLiA(e.target.value)}
-                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all duration-200"
-                />
-                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-2">
-                  <button
-                    type="button"
-                    onClick={() => setShowPassword(!showPassword)}
-                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
-                  >
-                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
-                  </button>
-                  {liA && (
-                    <button
-                      type="button"
-                      onClick={() => copyToClipboard(liA)}
-                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
-                    >
-                      <Copy className="w-4 h-4" />
-                    </button>
-                  )}
-                </div>
-              </div>
-              <p className="text-xs text-gray-500 mt-2">Additional authentication cookie (optional)</p>
-            </div>
-
-            {/* Error Message */}
-            {error && (
-              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
-                <div className="flex items-center">
-                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
-                    <span className="text-red-600 text-xs">!</span>
-                  </div>
-                  <p className="text-red-800 text-sm">{error}</p>
-                </div>
-              </div>
-            )}
-
-            {/* Submit Button */}
-            <button
-              type="submit"
-              disabled={!liAt.trim() || isLoading}
-              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
-            >
-              {isLoading ? (
-                <div className="flex items-center justify-center">
-                  <LoadingSpinner size="sm" color="white" />
-                  <span className="ml-2">Connecting...</span>
-                </div>
-              ) : (
-                <div className="flex items-center justify-center">
-                  <CheckCircle className="w-5 h-5 mr-2" />
-                  Connect LinkedIn Account
-                </div>
-              )}
-            </button>
-          </form>
-
-          {/* Help Text */}
-          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
-            <p className="text-sm text-gray-600 text-center">
-              Need help? Check our{" "}
-              <a href="/help/linkedin-setup" className="text-blue-600 hover:text-blue-700 underline">
-                detailed setup guide
-              </a>
-            </p>
-          </div>
+    <>
+      <div className="w-full max-w-4xl mx-auto">
+        {/* Enhanced Header */}
+        <div className="text-center mb-12">
+          <div className="w-24 h-24 bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
+            <Linkedin className="w-12 h-12 text-white" />
+          </div>
+          <h1 className="font-recoleta text-3xl md:text-4xl font-bold text-gray-900 mb-4">
+            Connect Your <span className="text-[#0A66C2]">LinkedIn</span>
+          </h1>
+          <p className="font-outfit text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
+            Securely connect your LinkedIn account through our browser emulator. 
+            Your credentials are never stored - we use a secure session-based approach.
+          </p>
+        </div>
+
+        {/* Main Connection Card */}
+        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
+          {/* Card Header */}
+          <div className="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 p-8">
+            <div className="flex items-center justify-between text-white">
+              <div>
+                <h2 className="font-recoleta text-2xl font-bold mb-2">Secure Browser Connection</h2>
+                <p className="font-outfit text-blue-100">Log in directly through our secure browser emulator</p>
+              </div>
+              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
+                <Shield className="w-8 h-8 text-white" />
+              </div>
+            </div>
+          </div>
+
+          {/* Card Content */}
+          <div className="p-8">
+            {/* Benefits */}
+            <div className="grid md:grid-cols-3 gap-6 mb-8">
+              <div className="flex items-start gap-3">
+                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
+                  <Shield className="w-5 h-5 text-green-600" />
+                </div>
+                <div>
+                  <h3 className="font-outfit font-semibold text-gray-900 mb-1">100% Secure</h3>
+                  <p className="font-outfit text-sm text-gray-600">No credentials stored on our servers</p>
+                </div>
+              </div>
+              <div className="flex items-start gap-3">
+                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
+                  <Zap className="w-5 h-5 text-blue-600" />
+                </div>
+                <div>
+                  <h3 className="font-outfit font-semibold text-gray-900 mb-1">Quick Setup</h3>
+                  <p className="font-outfit text-sm text-gray-600">Connect in under 2 minutes</p>
+                </div>
+              </div>
+              <div className="flex items-start gap-3">
+                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
+                  <CheckCircle className="w-5 h-5 text-purple-600" />
+                </div>
+                <div>
+                  <h3 className="font-outfit font-semibold text-gray-900 mb-1">Always Safe</h3>
+                  <p className="font-outfit text-sm text-gray-600">LinkedIn-compliant automation</p>
+                </div>
+              </div>
+            </div>
+
+            {/* Connection Button */}
+            <div className="text-center">
+              <Button
+                onClick={() => setShowModal(true)}
+                size="lg"
+                className="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white hover:from-[#0A66C2]/90 hover:to-[#0A66C2] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-outfit text-lg px-12 py-6 border-none"
+              >
+                <span className="flex items-center gap-3">
+                  <Linkedin className="w-6 h-6" />
+                  Connect LinkedIn Account
+                  <ArrowRight className="w-5 h-5" />
+                </span>
+              </Button>
+              <p className="font-outfit text-sm text-gray-500 mt-4">
+                Opens secure browser session • No data stored
+              </p>
+            </div>
+
+            {/* Security Notice */}
+            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
+              <div className="flex items-start gap-3">
+                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
+                  <Shield className="w-4 h-4 text-white" />
+                </div>
+                <div>
+                  <h3 className="font-outfit font-semibold text-green-900 mb-2">Your Security is Our Priority</h3>
+                  <ul className="font-outfit text-sm text-green-800 space-y-1">
+                    <li>• Your login credentials are never stored on our servers</li>
+                    <li>• We use secure browser sessions that expire automatically</li>
+                    <li>• All connections are encrypted and LinkedIn-compliant</li>
+                    <li>• You maintain full control over your LinkedIn account</li>
+                  </ul>
+                </div>
+              </div>
+            </div>
+          </div>
         </div>
       </div>
-    </div>
+
+      {/* LinkedIn Browser Modal */}
+      <LinkedInBrowserModal
+        isOpen={showModal}
+        onClose={() => setShowModal(false)}
+        onSuccess={handleSuccess}
+        userId={user?.user?.id || ''}
+      />
+    </>
   );
 }