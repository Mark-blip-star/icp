@@ .. @@
   return (
   )
-    <div className="h-screen flex bg-white overflow-hidden">
+    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-white overflow-hidden">
       {/* Sidebar Navigation */}
       <DashboardHeader 
         collapsed={sidebarCollapsed}
@@ .. @@
       {/* Main Content */}
       <main className="flex-1 flex flex-col min-h-0">
-        <div className="flex-1 px-8 pt-8 pb-8 min-h-0">
+        <div className="flex-1 px-6 pt-6 pb-6 min-h-0">
           {children}
         </div>
       </main>