@@ .. @@
     const { email, password, li_at, li_a } = body;
+    const browserSession = body.browser_session;
+    
     if (!email) {
       return NextResponse.json({ error: "Email is required" }, { status: 400 });
     }
-    if (!password && !li_at && !li_a) {
+    if (!password && !li_at && !li_a && !browserSession) {
       return NextResponse.json(
-        { error: "Either password or cookies (li_at) are required" },
+        { error: "Either password, cookies (li_at), or browser session are required" },
         { status: 400 }
       );
     }
@@ .. @@
     const upsertData = {
       user_id: user.id,
       email: encryptedEmail,
+      is_active: true,
+      last_login: now,
       updated_at: now,
       ...(encryptedPassword && { password: encryptedPassword }),
       ...(encryptedLiAt && { li_at: encryptedLiAt }),
       ...(encryptedLiA && { li_a: encryptedLiA }),
     };
@@ .. @@
       accountRecord = data;
     }

+    // Update profile to mark LinkedIn as connected
+    const { error: profileError } = await supabase
+      .from("profiles")
+      .update({ linkedin_connected: true })
+      .eq("id", user.id);
+
+    if (profileError) {
+      console.error("Error updating profile:", profileError);
+    }
+
     // Verify credentials
     const verificationResult = await verifyLinkedInCredentials(accountRecord);