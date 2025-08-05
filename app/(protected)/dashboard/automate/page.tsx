@@ .. @@
   // If not connected, show the connection interface
   if (hasCredentials === false && !isLoading && !isDemo) {
     console.log("🔗 Rendering LinkedIn connection interface");
     return (
-      <div className="min-h-screen bg-white flex items-center justify-center px-4">
-        <div className="w-full max-w-4xl">
-          <div className="text-center mb-8">
-            <h1 className="font-recoleta text-xl sm:text-2xl md:text-3xl font-black mb-3 tracking-tight leading-tight text-center">
-              Connect Your <span className="text-[#0A66C2]">LinkedIn</span>
-            </h1>
-            <p className="font-outfit font-light text-sm sm:text-base text-center max-w-2xl mx-auto text-black/60 leading-relaxed">
-              Log in directly to LinkedIn through our secure flow.
-            </p>
-          </div>
+      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
+        <div className="w-full max-w-5xl">
           <LinkedInConnect />
         </div>
       </div>
     );
   }