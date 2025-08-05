@@ .. @@
          {/* Navigation */}
-          <nav className="flex-1 px-2 overflow-y-auto">
-            <div className="space-y-3 mt-4">
+          <nav className="flex-1 px-3 overflow-y-auto">
+            <div className="space-y-2 mt-6">
               <Link 
                 href="/dashboard/automate" 
                 className={cn(
-                  "flex items-center justify-center py-3 rounded-xl font-outfit transition-all duration-200 w-full group text-sm",
-                  !collapsed && "px-4",
+                  "flex items-center justify-center py-3.5 rounded-2xl font-outfit transition-all duration-200 w-full group text-sm font-medium",
+                  !collapsed && "px-4 justify-start",
                   isActive("/dashboard/automate")
-                    ? "text-black font-medium bg-gray-50 shadow-sm"
-                    : "text-black/80 hover:text-black hover:bg-gray-50/80 hover:shadow-sm"
+                    ? "text-white bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 shadow-lg"
+                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm"
                 )}
                 title={collapsed ? "Automate" : undefined}
               >
-                {collapsed ? <TrendingUp className="h-5 w-5" /> : <span>Automate</span>}
+                <TrendingUp className={cn("h-5 w-5", !collapsed && "mr-3")} />
+                {!collapsed && <span>Automate</span>}
               </Link>
               
               <Link 
                 href="/dashboard/settings" 
                 className={cn(
-                  "flex items-center justify-center py-3 rounded-xl font-outfit transition-all duration-200 w-full group text-sm",
-                  !collapsed && "px-4",
+                  "flex items-center justify-center py-3.5 rounded-2xl font-outfit transition-all duration-200 w-full group text-sm font-medium",
+                  !collapsed && "px-4 justify-start",
                   isActive("/dashboard/settings")
-                    ? "text-black font-medium bg-gray-50 shadow-sm"
-                    : "text-black/80 hover:text-black hover:bg-gray-50/80 hover:shadow-sm"
+                    ? "text-white bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 shadow-lg"
+                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm"
                 )}
                 title={collapsed ? "Settings" : undefined}
               >
-                {collapsed ? <Settings className="h-5 w-5" /> : <span>Settings</span>}
+                <Settings className={cn("h-5 w-5", !collapsed && "mr-3")} />
+                {!collapsed && <span>Settings</span>}
               </Link>
               
               <Link 
                 href="/pricing"
                 target="_blank"
                 rel="noopener noreferrer"
                 className={cn(
-                  "flex items-center justify-center py-3 rounded-xl font-outfit transition-all duration-200 w-full text-black/80 hover:text-black hover:bg-gray-50/80 hover:shadow-sm group text-sm",
-                  !collapsed && "px-4"
+                  "flex items-center justify-center py-3.5 rounded-2xl font-outfit transition-all duration-200 w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 hover:shadow-sm group text-sm font-medium",
+                  !collapsed && "px-4 justify-start"
                 )}
                 title={collapsed ? "Subscribe" : undefined}
               >
-                {collapsed ? <Zap className="h-5 w-5" /> : <span>Subscribe</span>}
+                <Zap className={cn("h-5 w-5", !collapsed && "mr-3")} />
+                {!collapsed && <span>Subscribe</span>}
               </Link>
             </div>
           </nav>
@@ .. @@
           {/* ICP Tiger Branding */}
-          <div className="mt-auto px-2 py-4 flex-shrink-0">
+          <div className="mt-auto px-3 py-6 flex-shrink-0">
             <div className="text-center">
               {!collapsed ? (
-                <>
-                  <h2 className="text-lg font-recoleta font-black text-[#0A66C2] tracking-tight">Tiger</h2>
+                <div className="bg-gradient-to-r from-[#0A66C2]/10 to-[#0A66C2]/5 rounded-2xl p-4 border border-[#0A66C2]/20">
+                  <h2 className="text-xl font-recoleta font-black text-[#0A66C2] tracking-tight mb-2">Tiger</h2>
                   {trialStatus?.isLoading ? (
-                    <span className="text-sm font-outfit text-gray-500">Checking status...</span>
+                    <span className="text-xs font-outfit text-gray-500">Checking status...</span>
                   ) : trialStatus?.subscribed === true ? (
-                    <span className="text-sm font-outfit text-gray-600 font-semibold">Professional Plan</span>
+                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg">
+                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
+                      <span className="text-xs font-outfit font-semibold">Pro Plan</span>
+                    </div>
                   ) : trialStatus?.daysRemaining && trialStatus.daysRemaining > 0 ? (
-                    <span className="text-gray-500 text-sm font-outfit font-light">{trialStatus.daysRemaining} days left in your free trial</span>
+                    <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
+                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
+                      <span className="text-xs font-outfit font-medium">{trialStatus.daysRemaining} days trial</span>
+                    </div>
                   ) : (
-                    <span className="text-sm font-outfit text-red-500 font-semibold">Your free trial has ended</span>
+                    <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-lg">
+                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
+                      <span className="text-xs font-outfit font-semibold">Trial Ended</span>
+                    </div>
                   )}
-                </>
+                </div>
               ) : null}
             </div>
           </div>
@@ .. @@
           {/* LinkedIn Status */}
-          <div className="px-2 py-4 border-t border-black/10 flex-shrink-0">
+          <div className="px-3 py-4 border-t border-gray-200 flex-shrink-0">
             {hasLinkedInCredentials ? (
               <button
                 onClick={() => setShowManageDialog(true)}
-                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-outfit text-sm text-black/80 hover:bg-gray-50 transition-colors"
+                className={cn(
+                  "w-full flex items-center gap-2 py-3 rounded-2xl font-outfit text-sm transition-all duration-200 font-medium",
+                  !collapsed && "px-4 justify-start",
+                  "text-green-700 bg-green-50 hover:bg-green-100 border border-green-200"
+                )}
                 title={collapsed ? "LinkedIn Connected" : undefined}
               >
-                <Linkedin className="h-5 w-5" />
+                <div className="flex items-center gap-1">
+                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
+                  <Linkedin className="h-4 w-4" />
+                </div>
                 {!collapsed && <span>Connected</span>}
               </button>
             ) : (
               <Link
                 href="/dashboard/automate"
-                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl font-outfit text-sm text-black/80 hover:bg-gray-50 transition-colors"
+                className={cn(
+                  "w-full flex items-center gap-2 py-3 rounded-2xl font-outfit text-sm transition-all duration-200 font-medium",
+                  !collapsed && "px-4 justify-start",
+                  "text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200"
+                )}
                 title={collapsed ? "Connect LinkedIn" : undefined}
               >
-                <Linkedin className="h-5 w-5" />
+                <div className="flex items-center gap-1">
+                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
+                  <Linkedin className="h-4 w-4" />
+                </div>
                 {!collapsed && <span>Connect LinkedIn</span>}
               </Link>
             )}
@@ .. @@
       {/* LinkedIn Manage Dialog */}
       <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
-        <DialogContent className="max-w-md w-[95%] rounded-2xl bg-white p-0 border border-black/10 shadow-lg">
+        <DialogContent className="max-w-lg w-[95%] rounded-3xl bg-white p-0 border border-gray-200 shadow-2xl">
           <DialogHeader>
-            <div className="flex flex-col items-center justify-center pt-10 pb-4">
-              <DialogTitle className="text-2xl font-recoleta font-black text-center text-black mb-5">
+            <div className="flex flex-col items-center justify-center pt-8 pb-6 bg-gradient-to-br from-green-50 to-emerald-50">
+              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
+                <Linkedin className="w-8 h-8 text-white" />
+              </div>
+              <DialogTitle className="text-2xl font-recoleta font-black text-center text-gray-900">
                 LinkedIn Connection
               </DialogTitle>
             </div>
           </DialogHeader>

-          <div className="flex flex-col items-center gap-4 px-8 pb-10">
+          <div className="flex flex-col items-center gap-6 px-8 pb-8">
             {/* Status Card */}
-            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 flex flex-col items-center mb-6">
-              <div className="flex items-center gap-2 mb-1">
-                <span className="text-green-600 text-xl">✅</span>
-                <span className="font-semibold text-gray-800">Status:</span>
-                <span className="font-medium text-gray-700">
+            <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl px-6 py-5 flex flex-col items-center">
+              <div className="flex items-center gap-3 mb-3">
+                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
+                  <CheckCircle className="w-5 h-5 text-white" />
+                </div>
+                <div className="text-center">
+                  <div className="font-outfit font-semibold text-green-900">Connection Status</div>
+                  <div className="font-outfit text-sm text-green-700 font-medium">
                   {emailLoading
                     ? 'Loading...'
                     : emailError
@@ -1,7 +1,9 @@
                       ? 'Connected'
                       : 'Not Connected'}
-                </span>
+                  </div>
+                </div>
               </div>
-              <p className="text-sm text-gray-500 mt-1">You're all set! Automation is running.</p>
+              <p className="text-sm text-green-700 text-center font-outfit">You're all set! Automation is running safely.</p>
             </div>

             {/* Button + Warning Group */}
-            <div className="w-full flex flex-col items-center">
+            <div className="w-full flex flex-col items-center gap-4">
               <Button
                 onClick={handleDisconnect}
-                className="w-full bg-red-600 hover:bg-red-700 text-white font-outfit font-bold text-base rounded-lg outline-none py-3 transition-all duration-150 shadow-none border-none"
+                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-outfit font-semibold text-base rounded-2xl outline-none py-4 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] border-none"
               >
                 {loading ? "Disconnecting..." : "Disconnect Account"}
               </Button>
-              <p className="text-xs text-gray-500 mt-2 text-center">
+              <p className="text-xs text-gray-500 text-center font-outfit">
                 Stopping your connection will pause all active campaigns.
               </p>
             </div>