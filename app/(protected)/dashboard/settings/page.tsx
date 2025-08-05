@@ .. @@
   return (
-    <div className="w-full px-4 py-4 flex flex-col items-center overflow-y-auto h-[calc(100vh-4rem)] [&::-webkit-scrollbar]:hidden">
-      <div className="max-w-7xl w-full mx-auto space-y-6 pb-8">
+    <div className="w-full px-6 py-6 flex flex-col items-center overflow-y-auto h-[calc(100vh-4rem)] [&::-webkit-scrollbar]:hidden">
+      <div className="max-w-7xl w-full mx-auto space-y-8 pb-8">
         {error && (
-          <div className="p-4 bg-red-50 border border-red-500/50 rounded-xl text-red-800 font-outfit">
+          <div className="p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl text-red-800 font-outfit shadow-lg">
             {error}
           </div>
         )}
         {success && (
-          <div className="p-4 bg-green-50 border border-green-500/50 rounded-xl text-green-800 font-outfit">
+          <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl text-green-800 font-outfit shadow-lg">
             {success}
           </div>
         )}

         {/* Profile Section */}
-        <div className="bg-white p-6 rounded-xl border border-black/10">
-          <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">Profile Information</h2>
+        <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl border border-gray-200 shadow-lg">
+          <div className="flex items-center gap-3 mb-8">
+            <div className="w-12 h-12 bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 rounded-2xl flex items-center justify-center">
+              <User2Icon className="w-6 h-6 text-white" />
+            </div>
+            <div>
+              <h2 className="text-2xl font-recoleta font-black tracking-tight text-gray-900">Profile Information</h2>
+              <p className="text-sm font-outfit text-gray-600">Manage your account details</p>
+            </div>
+          </div>
           <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
             {/* Email (read-only) */}
             <div className="space-y-2">
-              <label htmlFor="email" className="text-sm font-medium font-outfit">Email</label>
+              <label htmlFor="email" className="text-sm font-semibold font-outfit text-gray-700">Email</label>
               <Input
                 id="email"
                 type="email"
                 value={email}
-                className="border font-outfit bg-gray-100 cursor-not-allowed"
+                className="border-2 border-gray-200 font-outfit bg-gray-100 cursor-not-allowed rounded-xl h-12 text-base"
                 disabled
                 readOnly
               />
@@ .. @@
               return (
                 <div key={field.id} className="space-y-2">
-                  <label htmlFor={field.id} className="text-sm font-medium font-outfit">
+                  <label htmlFor={field.id} className="text-sm font-semibold font-outfit text-gray-700">
                     {field.label}
                   </label>
                   <div className="flex gap-2 items-center">
                     <Input
                       id={field.id}
                       type="text"
                       value={currentValue}
-                      className="border focus:border-black transition-colors font-outfit"
+                      className="border-2 border-gray-200 focus:border-[#0A66C2] transition-colors font-outfit rounded-xl h-12 text-base"
                       disabled={!isEditing || isLoading}
                       onChange={(e) => handleInputChange(field.id, e.target.value)}
                     />
                     <Button
                       size="icon"
                       variant="ghost"
-                      className="h-8 w-8 hover:bg-yellow-400/10 rounded-lg"
+                      className="h-12 w-12 hover:bg-blue-100 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200"
                       disabled={isLoading}
                       onClick={() => handleEdit(field.id)}
                     >
-                      <Pencil className="h-4 w-4" />
+                      <Pencil className="h-4 w-4 text-gray-600" />
                     </Button>
                   </div>
                 </div>
@@ .. @@
             {hasChanges && (
               <div className="pt-4">
                 <Button 
                   type="button" 
                   disabled={isLoading} 
                   onClick={handleSave}
-                  className="w-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold"
+                  className="w-full bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white hover:from-[#0A66C2]/90 hover:to-[#0A66C2] rounded-2xl font-outfit text-base h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                 >
                   {isLoading ? "Saving..." : "Save Changes"}
                 </Button>
@@ .. @@
         {/* Automation Section */}
-        <div className="bg-white p-6 rounded-xl border border-black/10">
-          <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">LinkedIn Daily Action Limits</h2>
+        <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl border border-gray-200 shadow-lg">
+          <div className="flex items-center gap-3 mb-8">
+            <div className="w-12 h-12 bg-gradient-to-br from-[#0A66C2] to-[#0A66C2]/80 rounded-2xl flex items-center justify-center">
+              <Settings className="w-6 h-6 text-white" />
+            </div>
+            <div>
+              <h2 className="text-2xl font-recoleta font-black tracking-tight text-gray-900">LinkedIn Daily Action Limits</h2>
+              <p className="text-sm font-outfit text-gray-600">Configure safe automation limits</p>
+            </div>
+          </div>
           <div className="space-y-6">
             
-            <div className="grid grid-cols-2 gap-6">
+            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
-                <label className="text-sm font-medium text-gray-700 font-outfit">Connection requests</label>
-                <div className="col-span-2 flex items-center gap-4 w-full py-2">
-                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
+                <label className="text-base font-semibold text-gray-800 font-outfit">Connection requests</label>
+                <div className="flex items-center gap-4 w-full py-3 bg-white rounded-2xl px-4 border border-gray-200">
+                  <span className="text-xs text-green-600 font-bold">Safe</span>
                   <Slider 
                     min={0} 
                     max={200} 
@@ -1,7 +1,7 @@
                     className="w-full"
                     trackClassName={sliderGradient}
                   />
-                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
-                  <span className="text-sm text-gray-500 font-outfit">{connReq} per day</span>
+                  <span className="text-xs text-red-600 font-bold">Risky</span>
+                  <span className="text-sm text-gray-700 font-outfit font-semibold bg-gray-100 px-2 py-1 rounded-lg">{connReq}/day</span>
                 </div>
               </div>
               <div className="space-y-2">
-                <label className="text-sm font-medium text-gray-700 font-outfit">Profile visits</label>
-                <div className="col-span-2 flex items-center gap-4 w-full py-2">
-                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
+                <label className="text-base font-semibold text-gray-800 font-outfit">Profile visits</label>
+                <div className="flex items-center gap-4 w-full py-3 bg-white rounded-2xl px-4 border border-gray-200">
+                  <span className="text-xs text-green-600 font-bold">Safe</span>
                   <Slider 
                     min={0} 
                     max={350} 
@@ -1,7 +1,7 @@
                     className="w-full"
                     trackClassName={sliderGradient}
                   />
-                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
-                  <span className="text-sm text-gray-500 font-outfit">{profileVisits} per day</span>
+                  <span className="text-xs text-red-600 font-bold">Risky</span>
+                  <span className="text-sm text-gray-700 font-outfit font-semibold bg-gray-100 px-2 py-1 rounded-lg">{profileVisits}/day</span>
                 </div>
               </div>
               <div className="space-y-2">
-                <label className="text-sm font-medium text-gray-700 font-outfit">Messages</label>
-                <div className="col-span-2 flex items-center gap-4 w-full py-2">
-                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
+                <label className="text-base font-semibold text-gray-800 font-outfit">Messages</label>
+                <div className="flex items-center gap-4 w-full py-3 bg-white rounded-2xl px-4 border border-gray-200">
+                  <span className="text-xs text-green-600 font-bold">Safe</span>
                   <Slider 
                     min={0} 
                     max={300} 
@@ -1,7 +1,7 @@
                     className="w-full"
                     trackClassName={sliderGradient}
                   />
-                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
-                  <span className="text-sm text-gray-500 font-outfit">{messages} per day</span>
+                  <span className="text-xs text-red-600 font-bold">Risky</span>
+                  <span className="text-sm text-gray-700 font-outfit font-semibold bg-gray-100 px-2 py-1 rounded-lg">{messages}/day</span>
                 </div>
               </div>
               <div className="space-y-2">
-                <label className="text-sm font-medium text-gray-700 font-outfit">InMails</label>
-                <div className="col-span-2 flex items-center gap-4 w-full py-2">
-                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
+                <label className="text-base font-semibold text-gray-800 font-outfit">InMails</label>
+                <div className="flex items-center gap-4 w-full py-3 bg-white rounded-2xl px-4 border border-gray-200">
+                  <span className="text-xs text-green-600 font-bold">Safe</span>
                   <Slider 
                     min={0} 
                     max={70} 
@@ -1,7 +1,7 @@
                     className="w-full"
                     trackClassName={sliderGradient}
                   />
-                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
-                  <span className="text-sm text-gray-500 font-outfit">{inmails} per day</span>
+                  <span className="text-xs text-red-600 font-bold">Risky</span>
+                  <span className="text-sm text-gray-700 font-outfit font-semibold bg-gray-100 px-2 py-1 rounded-lg">{inmails}/day</span>
                 </div>
               </div>
             </div>
-            <p className="text-sm text-gray-600 font-outfit mt-4 mb-2">If you're not sure what to do, select from one of the preset profiles below.</p>
-            <div className="flex flex-row gap-4 mb-6">
+            <p className="text-base text-gray-700 font-outfit mt-6 mb-4 font-medium">If you're not sure what to do, select from one of the preset profiles below.</p>
+            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
               {PRESETS.map((preset, idx) => (
                 <button
                   key={preset.label}
                   type="button"
-                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 px-4 py-2 text-left transition-colors min-w-[200px]"
+                  className="rounded-2xl border-2 border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 px-6 py-4 text-left transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                   onClick={() => {
                     setConnReq(preset.values.connReq);
                     setProfileVisits(preset.values.profileVisits);
@@ -1,7 +1,7 @@
                   }}
                 >
-                  <div className="font-medium text-sm mb-1">{preset.label}</div>
-                  <div className="text-xs text-gray-500 leading-snug">{preset.description}</div>
+                  <div className="font-semibold text-base mb-2 text-gray-900 font-outfit">{preset.label}</div>
+                  <div className="text-sm text-gray-600 leading-relaxed font-outfit">{preset.description}</div>
                 </button>
               ))}
             </div>
             <Button 
               onClick={handleUpdateLimits}
               disabled={isLoading}
-              className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold px-8"
+              className="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white hover:from-[#0A66C2]/90 hover:to-[#0A66C2] rounded-2xl font-outfit text-base h-12 font-semibold px-10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
             >
-              Update Limits
+              {isLoading ? "Updating..." : "Update Limits"}
             </Button>
           </div>
         </div>

         {/* Blocked Users Section */}
-        <div className="bg-white p-6 rounded-xl border border-black/10">
-          <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">Blocked LinkedIn Profiles</h2>
+        <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl border border-gray-200 shadow-lg">
+          <div className="flex items-center gap-3 mb-8">
+            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
+              <X className="w-6 h-6 text-white" />
+            </div>
+            <div>
+              <h2 className="text-2xl font-recoleta font-black tracking-tight text-gray-900">Blocked LinkedIn Profiles</h2>
+              <p className="text-sm font-outfit text-gray-600">Exclude specific profiles from automation</p>
+            </div>
+          </div>
           
           <div className="space-y-6">
-            <div>
-              <h3 className="font-outfit font-medium mb-1 text-lg">Manage blocked LinkedIn profiles</h3>
-              <p className="font-outfit text-sm text-gray-500">Add LinkedIn profile URLs that you want to exclude from automation. These users will be skipped during connection requests and messaging.</p>
-            </div>

             <div className="space-y-4">
-              <div className="flex gap-3">
+              <div className="flex gap-4">
                 <Input
                   placeholder="https://linkedin.com/in/username"
                   value={newBlockedUrl}
                   onChange={(e) => {
                     setNewBlockedUrl(e.target.value);
                     setUrlError("");
                   }}
-                  className="flex-1 border focus:border-black font-outfit"
+                  className="flex-1 border-2 border-gray-200 focus:border-[#0A66C2] font-outfit rounded-xl h-12 text-base"
                 />
                 <Button
                   onClick={handleAddBlockedUrl}
-                  className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 px-5 font-bold"
+                  className="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white hover:from-[#0A66C2]/90 hover:to-[#0A66C2] rounded-xl font-outfit text-sm h-12 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                 >
                   <Plus className="h-4 w-4 mr-2" />
                   Add URL
@@ -1,7 +1,7 @@
               
               {urlError && (
-                <p className="text-sm text-red-500 flex items-center gap-1 font-outfit">
-                  <AlertCircle className="h-4 w-4" />
-                  {urlError}
-                </p>
+                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
+                  <p className="text-sm text-red-700 flex items-center gap-2 font-outfit">
+                    <AlertCircle className="h-4 w-4" />
+                    {urlError}
+                  </p>
+                </div>
               )}
             </div>

             <div className="space-y-2">
               {blockedUrls.map((url, index) => (
-                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-black/10 bg-white">
-                  <span className="text-sm font-medium text-gray-700 truncate flex-1 font-outfit">{url}</span>
+                <div key={index} className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200">
+                  <span className="text-sm font-medium text-gray-800 truncate flex-1 font-outfit">{url}</span>
                   <button
                     onClick={() => handleRemoveBlockedUrl(url)}
-                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
+                    className="p-2 hover:bg-red-50 rounded-xl transition-colors border border-gray-200 hover:border-red-300"
                     title="Remove URL"
                   >
-                    <X className="h-4 w-4 text-gray-500" />
+                    <X className="h-4 w-4 text-red-500" />
                   </button>
                 </div>
               ))}
               
               {blockedUrls.length === 0 && (
-                <div className="text-center py-8 border border-dashed border-black/10 rounded-xl">
-                  <p className="text-sm text-gray-500 font-outfit">No blocked users added yet</p>
+                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
+                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
+                    <X className="w-8 h-8 text-gray-400" />
+                  </div>
+                  <p className="text-base text-gray-600 font-outfit font-medium">No blocked users added yet</p>
+                  <p className="text-sm text-gray-500 font-outfit mt-1">Add LinkedIn profile URLs to exclude them from automation</p>
                 </div>
               )}
             </div>
@@ .. @@
         {/* Billing Section */}
-        <div className="bg-white p-6 rounded-xl border border-black/10">
-          <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight">Manage Your Subscription</h2>
-          <p className="text-gray-600 mb-6 font-outfit">
+        <div className="bg-gradient-to-br from-white to-gray-50/50 p-8 rounded-3xl border border-gray-200 shadow-lg">
+          <div className="flex items-center gap-3 mb-6">
+            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
+              <CreditCardIcon className="w-6 h-6 text-white" />
+            </div>
+            <div>
+              <h2 className="text-2xl font-recoleta font-black tracking-tight text-gray-900">Manage Your Subscription</h2>
+              <p className="text-sm font-outfit text-gray-600">Update billing and payment methods</p>
+            </div>
+          </div>
+          <p className="text-gray-700 mb-8 font-outfit text-base">
             Manage your subscription, payment methods, and billing history through the Stripe customer portal.
           </p>
           
           <div className="space-y-4">
-            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-black/10">
-              <div className="bg-black p-2 rounded-lg">
-                <CreditCardIcon className="h-5 w-5 text-white" />
+            <div className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
+              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
+                <CreditCardIcon className="h-6 w-6 text-white" />
               </div>
               <div>
-                <p className="font-medium font-outfit">Current Plan: Premium</p>
-                <p className="text-sm text-gray-500 font-outfit">Active subscription</p>
+                <p className="font-semibold font-outfit text-lg text-gray-900">Current Plan: Premium</p>
+                <p className="text-sm text-green-700 font-outfit font-medium">Active subscription</p>
               </div>
             </div>
             
@@ -1,7 +1,7 @@
               className="block w-full"
             >
               <Button 
-                className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold px-8"
+                className="w-full bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white hover:from-[#0A66C2]/90 hover:to-[#0A66C2] rounded-2xl font-outfit text-base h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
               >
                 Go to Billing Portal
               </Button>
             </a>
             
-            <p className="text-xs text-gray-500 text-center font-outfit">
+            <p className="text-sm text-gray-600 text-center font-outfit">
               You'll be redirected to a secure Stripe page to manage your subscription.
             </p>
           </div>
@@ .. @@
         {/* Support Section */}
-        <div className="bg-[#0A66C2]/5 p-6 rounded-xl border border-[#0A66C2]/20">
-          <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight text-[#0A66C2]">Need Help?</h2>
-          <p className="text-black/70 font-outfit">
+        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200 shadow-lg">
+          <div className="flex items-center gap-3 mb-6">
+            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
+              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
+                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
+              </svg>
+            </div>
+            <div>
+              <h2 className="text-2xl font-recoleta font-black tracking-tight text-blue-900">Need Help?</h2>
+              <p className="text-sm font-outfit text-blue-700">We're here to support your success</p>
+            </div>
+          </div>
+          <p className="text-blue-900 font-outfit text-base leading-relaxed">
             If you have any questions, concerns, or need assistance, please don't hesitate to
             reach out to our support team at:{" "}
             <a
               href="mailto:help@icptiger.com"
-              className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
+              className="font-semibold text-blue-700 hover:text-blue-800 transition-colors underline decoration-2 underline-offset-2"
             >
               help@icptiger.com
             </a>
           </p>
-          <p className="text-black/70 font-outfit mt-4">
+          <p className="text-blue-900 font-outfit mt-4 text-base leading-relaxed">
             Also, feel free to message Adhiraj directly on{" "}
             <a
               href="https://x.com/adhirajhangal"
               target="_blank"
               rel="noopener noreferrer"
-              className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
+              className="font-semibold text-blue-700 hover:text-blue-800 transition-colors underline decoration-2 underline-offset-2"
             >
               X
             </a>{" "}
             or email him at{" "}
             <a
               href="mailto:adhiraj@icptiger.com"
-              className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
+              className="font-semibold text-blue-700 hover:text-blue-800 transition-colors underline decoration-2 underline-offset-2"
             >
               adhiraj@icptiger.com
             </a>
@@ .. @@
         {/* Logout Section */}
-        <div className="bg-[#0A66C2]/5 p-6 rounded-xl border border-[#0A66C2]/20">
-          <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight text-[#0A66C2]">Logout</h2>
-          <p className="text-black/70 font-outfit mb-6">
+        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-3xl border border-red-200 shadow-lg">
+          <div className="flex items-center gap-3 mb-6">
+            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
+              <LogOutIcon className="w-6 h-6 text-white" />
+            </div>
+            <div>
+              <h2 className="text-2xl font-recoleta font-black tracking-tight text-red-900">Logout</h2>
+              <p className="text-sm font-outfit text-red-700">Sign out of your account</p>
+            </div>
+          </div>
+          <p className="text-red-900 font-outfit mb-8 text-base leading-relaxed">
             Are you sure you want to logout? You will need to sign in again to access your
             account.
           </p>
           <Button
             onClick={handleLogout}
             disabled={isLoading}
-            className="!bg-red-600 !text-white hover:!bg-red-700 rounded-xl font-outfit text-sm h-10 font-bold border-red-600"
+            className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-2xl font-outfit text-base h-12 font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-none"
           >
             {isLoading ? "Logging out..." : "Logout"}
           </Button>