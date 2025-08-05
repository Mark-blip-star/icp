@@ .. @@
   return (
-    <div className="h-full flex flex-col overflow-hidden bg-white rounded-2xl shadow-sm border border-black/5">
-      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-2 px-4 flex-shrink-0 gap-6">
-        <div className="flex flex-col min-w-[180px]">
-          <h2 className="text-xl font-recoleta font-black text-gray-900 mb-1 tracking-tight">Performance</h2>
-          <p className="text-gray-500 text-sm font-outfit font-light">Track your growth</p>
+    <div className="h-full flex flex-col overflow-hidden bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-lg border border-gray-200/50">
+      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center py-4 px-6 flex-shrink-0 gap-6 bg-gradient-to-r from-[#0A66C2]/5 to-blue-50/50">
+        <div className="flex flex-col min-w-[200px]">
+          <h2 className="text-2xl font-recoleta font-black text-gray-900 mb-2 tracking-tight">Performance</h2>
+          <p className="text-gray-600 text-sm font-outfit font-medium">Track your growth metrics</p>
         </div>
-        <div className="max-w-5xl pl-4">
-          <div className="flex flex-row gap-16 overflow-x-auto items-start">
+        <div className="max-w-5xl pl-6">
+          <div className="flex flex-row gap-12 overflow-x-auto items-start">
             <Card label="Contacts Imported">
               {renderValue(metricsState?.totalImported)}
             </Card>
@@ .. @@
       </div>
       {error && (
-        <div className="text-gray-600 text-sm p-4 bg-gray-50 border-b border-gray-100 font-outfit text-center">
-          <p className="font-medium mb-1">Metrics temporarily unavailable</p>
-          <p className="text-xs text-gray-500">Please try refreshing the page</p>
+        <div className="text-gray-600 text-sm p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 font-outfit text-center">
+          <div className="flex items-center justify-center gap-2 mb-2">
+            <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
+              <span className="text-white text-xs">!</span>
+            </div>
+            <p className="font-semibold text-amber-800">Metrics temporarily unavailable</p>
+          </div>
+          <p className="text-xs text-amber-700">Please try refreshing the page</p>
         </div>
       )}
     </div>
@@ .. @@
 function Card({ label, children }: CardProps) {
   return (
-    <div className="flex flex-col items-center justify-center gap-1">
-      <h3 className="text-sm font-medium text-gray-600 font-outfit text-center mb-1">{label}</h3>
-      <p className="text-xl font-bold text-black tracking-tight font-space-grotesk-bold text-center mt-1">{children}</p>
+    <div className="flex flex-col items-center justify-center gap-2 bg-white/80 rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
+      <h3 className="text-sm font-semibold text-gray-700 font-outfit text-center">{label}</h3>
+      <p className="text-2xl font-bold text-gray-900 tracking-tight font-space-grotesk-bold text-center">{children}</p>
     </div>
   );
 }