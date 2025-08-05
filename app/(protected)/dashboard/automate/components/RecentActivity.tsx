@@ .. @@
   return (
-    <div className="h-full flex flex-col">
-      <div className="w-full flex flex-row items-center py-2 px-4 flex-shrink-0 gap-4">
-        <div className="flex flex-col min-w-[180px]">
-          <h2 className="text-xl font-recoleta font-black text-gray-900 mb-1 tracking-tight">Activity</h2>
-          <p className="text-gray-500 text-sm font-outfit font-light">See what's happening</p>
+    <div className="h-full flex flex-col bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-lg border border-gray-200/50">
+      <div className="w-full flex flex-row items-center py-4 px-6 flex-shrink-0 gap-4 bg-gradient-to-r from-[#0A66C2]/5 to-blue-50/50">
+        <div className="flex flex-col min-w-[200px]">
+          <h2 className="text-2xl font-recoleta font-black text-gray-900 mb-2 tracking-tight">Activity</h2>
+          <p className="text-gray-600 text-sm font-outfit font-medium">Live automation updates</p>
         </div>
         <div className="ml-auto">
           <Select value={activeFilter} onValueChange={setActiveFilter}>
-            <SelectTrigger className="w-auto min-w-[100px] bg-white font-outfit focus:ring-0 focus:ring-offset-0 focus:outline-none px-2 [&>svg]:ml-1 border-none">
+            <SelectTrigger className="w-auto min-w-[120px] bg-white font-outfit focus:ring-0 focus:ring-offset-0 focus:outline-none px-3 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 [&>svg]:ml-2">
               <SelectValue placeholder="Filter activities" />
             </SelectTrigger>
             <SelectContent>
@@ .. @@
       <div className="flex-1 overflow-y-auto flex flex-col" ref={scrollContainerRef}>
         {activities.length === 0 ? (
-          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-4">
-            <p className="text-sm text-center max-w-md font-outfit mb-4">
+          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-8">
+            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
+              <Users className="w-10 h-10 text-gray-400" />
+            </div>
+            <h3 className="font-recoleta text-xl font-bold text-gray-700 mb-2">No Activity Yet</h3>
+            <p className="text-sm text-center max-w-md font-outfit text-gray-600">
               Your connection activities will appear here
             </p>
           </div>
         ) : (
-          <div className="p-4 space-y-0">
+          <div className="p-6 space-y-1">
             {deduplicateActivities(activities).map((activity) => (
               <div key={activity.id}>
-                <div className="flex items-start gap-3 py-3">
+                <div className="flex items-start gap-4 py-4 px-4 rounded-2xl hover:bg-white/80 transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm">
                   <div className="flex-shrink-0">
-                    <div className="w-8 h-8 flex items-center justify-center">
+                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border border-blue-300">
                       <ActivityIcon type={activity.type} status={activity.status} />
                     </div>
                   </div>
                   <div className="flex-1 min-w-0">
-                    <div className="flex items-center justify-between gap-2">
-                      <p className="text-sm font-outfit font-normal text-gray-900 truncate">
+                    <div className="flex items-start justify-between gap-3">
+                      <p className="text-sm font-outfit font-medium text-gray-900 leading-relaxed">
                         {(() => {
                           // Helper to render name + icon
                           const renderNameWithIcon = (name: string, profileUrl?: string | null) => (
-                            <span className="inline-flex items-center gap-0.5">
-                              <span>{name}</span>
+                            <span className="inline-flex items-center gap-1">
+                              <span className="font-semibold text-[#0A66C2]">{name}</span>
                               {profileUrl && (
                                 <a
                                   href={profileUrl}
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   title="View LinkedIn profile"
-                                  className="text-[#0A66C2] hover:text-[#0A66C2]/80 p-0.5 hover:bg-[#0A66C2]/5 rounded transition-colors"
+                                  className="text-[#0A66C2] hover:text-[#0A66C2]/80 p-1 hover:bg-[#0A66C2]/10 rounded-lg transition-colors"
                                 >
-                                  {/* Fix ExternalLink import if needed */}
-                                  <svg className="h-3 w-3 align-middle relative top-[1px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m7-1V7m0 0h-4m4 0L10 17" /></svg>
+                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m7-1V7m0 0h-4m4 0L10 17" /></svg>
                                 </a>
                               )}
                             </span>
@@ .. @@
                           return activity.message;
                         })()}
                       </p>
-                      <span className="text-[10px] text-gray-500 font-outfit whitespace-nowrap">
+                      <span className="text-xs text-gray-500 font-outfit whitespace-nowrap bg-gray-100 px-2 py-1 rounded-lg">
                         {activity.timestamp ? formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true }) : ""}
                       </span>
                     </div>
@@ .. @@
             {/* Loading more indicator */}
             {loadingMore && (
-              <div className="flex items-center justify-center py-4">
+              <div className="flex items-center justify-center py-6">
                 <LoadingSpinner size="sm" color="primary" />
-                <span className="ml-2 text-sm text-gray-500 font-outfit">Loading more activities...</span>
+                <span className="ml-3 text-sm text-gray-600 font-outfit font-medium">Loading more activities...</span>
               </div>
             )}
           </div>