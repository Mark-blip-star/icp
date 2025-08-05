@@ .. @@
   return (
-    <div className="flex flex-col h-full">
-      <div className="flex flex-col flex-shrink-0 py-2 px-4">
-        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
-          <div className="flex flex-col gap-1 max-w-[320px]">
-            <h2 className="text-xl font-recoleta font-black text-gray-900 tracking-tight">Campaigns</h2>
-            <p className="text-gray-500 text-sm font-outfit font-light whitespace-nowrap overflow-hidden text-ellipsis">Manage your campaigns</p>
+    <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-lg border border-gray-200/50">
+      <div className="flex flex-col flex-shrink-0 py-4 px-6 bg-gradient-to-r from-[#0A66C2]/5 to-blue-50/50">
+        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
+          <div className="flex flex-col gap-2 max-w-[320px]">
+            <h2 className="text-2xl font-recoleta font-black text-gray-900 tracking-tight">Campaigns</h2>
+            <p className="text-gray-600 text-sm font-outfit font-medium whitespace-nowrap overflow-hidden text-ellipsis">Manage your automation campaigns</p>
           </div>
-          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0 items-stretch sm:items-center w-full sm:w-auto">
+          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 sm:mt-0 items-stretch sm:items-center w-full sm:w-auto">
             <button
               onClick={() => setShowNewCampaignModal(true)}
-              className="px-6 py-2 bg-[#0A66C2] text-white rounded-3xl hover:bg-[#0A66C2]/90 transition-all duration-300 hover:scale-[1.02] font-outfit text-sm flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
+              className="px-8 py-3 bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white rounded-2xl hover:from-[#0A66C2]/90 hover:to-[#0A66C2] transition-all duration-300 hover:scale-[1.02] font-outfit text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
             >
               <PlusIcon className="h-4 w-4" />
-              New
+              New Campaign
             </button>
           </div>
         </div>
@@ .. @@
       <div className="flex-1 overflow-y-auto flex flex-col">
         {campaigns.length === 0 ? (
-          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-4">
-            <p className="text-sm text-center max-w-md font-outfit mb-4">
+          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-8">
+            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
+              <PlusIcon className="w-10 h-10 text-gray-400" />
+            </div>
+            <h3 className="font-recoleta text-xl font-bold text-gray-700 mb-2">No Campaigns Yet</h3>
+            <p className="text-sm text-center max-w-md font-outfit text-gray-600 mb-6">
               Create your first campaign to start connecting with your ICP
             </p>
+            <Button
+              onClick={() => setShowNewCampaignModal(true)}
+              className="bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white hover:from-[#0A66C2]/90 hover:to-[#0A66C2] rounded-2xl font-outfit font-semibold px-6 py-3"
+            >
+              <PlusIcon className="h-4 w-4 mr-2" />
+              Create First Campaign
+            </Button>
           </div>
         ) : (
-          <div className="p-4 space-y-0">
+          <div className="p-6 space-y-1">
             {campaigns.map((campaign) => (
               <div
                 key={campaign.id}
-                className="flex items-center justify-between hover:bg-gray-50/50 transition-all duration-200 cursor-pointer py-3"
+                className="flex items-center justify-between hover:bg-white/80 transition-all duration-200 cursor-pointer py-4 px-4 rounded-2xl hover:shadow-md border border-transparent hover:border-gray-200"
                 onClick={() => {
                   if (setSelectedCampaign) setSelectedCampaign(campaign);
                   else setSelectedCampaignDetails(campaign);
@@ .. @@
                 <div className="flex-1 min-w-0 max-w-[200px]">
-                  <div className="flex items-center gap-3 mb-1">
-                    <h3 className="text-sm font-outfit text-gray-900 tracking-tight truncate">{campaign.name}</h3>
+                  <div className="flex items-center gap-3 mb-2">
+                    <h3 className="text-base font-outfit font-semibold text-gray-900 tracking-tight truncate">{campaign.name}</h3>
                     <span className={cn(
-                      "px-2 py-0.5 rounded-full text-[9px] font-medium flex items-center gap-1 font-outfit tracking-wide",
-                      campaign.status === "active" && "bg-[#0A66C2]/5 text-[#0A66C2]",
-                      campaign.status === "paused" && "bg-gray-50 text-gray-600",
-                      campaign.status === "completed" && "bg-gray-50 text-gray-500",
-                      campaign.status === "queued" && "bg-amber-50 text-amber-600"
+                      "px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 font-outfit",
+                      campaign.status === "active" && "bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300",
+                      campaign.status === "paused" && "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300",
+                      campaign.status === "completed" && "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300",
+                      campaign.status === "queued" && "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border border-amber-300"
                     )}>
-                      {campaign.status === "active" && <div className="w-1.5 h-1.5 rounded-full bg-[#0A66C2] animate-pulse" />}
-                      {campaign.status === "paused" && <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
+                      {campaign.status === "active" && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
+                      {campaign.status === "paused" && <div className="w-2 h-2 rounded-full bg-gray-500" />}
                       {campaign.status === "completed" && (
-                        <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
+                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                       )}
                       {campaign.status === "queued" && (
-                        <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
+                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           <path d="M12 8v4l3 3" strokeLinecap="round" strokeLinejoin="round"/>
                           <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                         </svg>
@@ .. @@
                   <div className="flex items-center gap-6 mt-2">
-                    <div className="flex items-center gap-1.5">
-                      <Send className="h-3 w-3 text-gray-500" />
-                      <p className="text-xs font-outfit font-normal text-gray-900">{campaign.sent}</p>
+                    <div className="flex items-center gap-2">
+                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
+                        <Send className="h-3 w-3 text-blue-600" />
+                      </div>
+                      <p className="text-sm font-outfit font-semibold text-gray-900">{campaign.sent}</p>
                     </div>
-                    <div className="flex items-center gap-1.5">
-                      <Users className="h-3 w-3 text-gray-500" />
-                      <p className="text-xs font-outfit font-normal text-gray-900">{campaign.accepted}</p>
+                    <div className="flex items-center gap-2">
+                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
+                        <Users className="h-3 w-3 text-green-600" />
+                      </div>
+                      <p className="text-sm font-outfit font-semibold text-gray-900">{campaign.accepted}</p>
                     </div>
-                    <div className="flex items-center gap-1.5">
-                      <Clock className="h-3 w-3 text-gray-500" />
-                      <p className="text-xs font-outfit font-normal text-gray-900">{campaign.sent - campaign.accepted - (campaign.cancelled || 0)}</p>
+                    <div className="flex items-center gap-2">
+                      <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
+                        <Clock className="h-3 w-3 text-amber-600" />
+                      </div>
+                      <p className="text-sm font-outfit font-semibold text-gray-900">{campaign.sent - campaign.accepted - (campaign.cancelled || 0)}</p>
                     </div>
-                    <div className="flex items-center gap-1.5">
-                      <TrendingUp className="h-3 w-3 text-gray-500" />
-                      <p className="text-[10px] font-inter font-bold text-gray-900">{campaign.responseRate}%</p>
+                    <div className="flex items-center gap-2">
+                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
+                        <TrendingUp className="h-3 w-3 text-purple-600" />
+                      </div>
+                      <p className="text-sm font-inter font-bold text-gray-900">{campaign.responseRate}%</p>
                     </div>
                   </div>
                 </div>
                 <button
                   onClick={(e) => {
                     e.stopPropagation();
                     // 1) compute the flipped status
                     const optimisticStatus = campaign.status === "active" ? "paused" : "active";
                     // 2) apply it immediately
                     setCampaigns((prev: Campaign[]) =>
                       prev.map((c: Campaign) =>
                         c.id === campaign.id ? { ...c, status: optimisticStatus } : c
                       )
                     );
                     // 3) fire the API call, rolling back on error
                     try {
                       onToggleCampaign(
                         campaign.id.toString(),
                         campaign.status,
                         campaign.start_date
                       )
                     } catch (error) {
                       setCampaigns((prev: Campaign[]) =>
                         prev.map((c: Campaign) =>
                           c.id === campaign.id ? { ...c, status: campaign.status } : c
                         )
                       );
                     }
                   }}
                   className={cn(
-                    "p-1.5 rounded-lg transition-all duration-200 font-outfit hover:scale-105",
-                    campaign.status === "active" ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"
+                    "p-2 rounded-xl transition-all duration-200 font-outfit hover:scale-105 shadow-sm hover:shadow-md",
+                    campaign.status === "active" 
+                      ? "text-red-600 bg-red-50 hover:bg-red-100 border border-red-200" 
+                      : "text-green-600 bg-green-50 hover:bg-green-100 border border-green-200"
                   )}
                 >
-                  {campaign.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
+                  {campaign.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                 </button>
               </div>
             ))}
@@ .. @@
       {totalPages > 1 && (
-        <div className="flex items-center justify-between px-4 py-3 border-t border-black/5">
+        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
           <button
             onClick={() => setPage((p) => Math.max(1, p - 1))}
             disabled={page === 1}
-            className="px-3 py-1.5 text-xs rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors font-outfit"
+            className="px-4 py-2 text-sm rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors font-outfit font-medium border border-gray-200 shadow-sm"
           >
             Previous
           </button>
-          <span className="text-xs text-gray-600 font-outfit">
+          <span className="text-sm text-gray-700 font-outfit font-medium">
             Page {page} of {totalPages}
           </span>
           <button
             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
             disabled={page === totalPages}
-            className="px-3 py-1.5 text-xs rounded-lg bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors font-outfit"
+            className="px-4 py-2 text-sm rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors font-outfit font-medium border border-gray-200 shadow-sm"
           >
             Next
           </button>