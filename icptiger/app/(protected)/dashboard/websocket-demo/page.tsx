"use client";

import React from "react";
import LinkedInWebSocketConnect from "@/app/components/linkedin-websocket-connect";

export default function WebSocketDemoPage() {
  const handleSuccess = (cookies: { li_at: string; li_a?: string }) => {
    console.log("LinkedIn login successful:", cookies);
    // Here you can save cookies to database or redirect user
  };

  const handleError = (error: string) => {
    console.error("LinkedIn login error:", error);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">LinkedIn WebSocket Demo</h1>
          <p className="text-muted-foreground">
            Interactive browser session for LinkedIn login. This approach shows the actual browser
            and allows you to interact with it directly through the UI.
          </p>
        </div>

        <LinkedInWebSocketConnect
          userId="demo-user"
          onSuccess={handleSuccess}
          onError={handleError}
        />

        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h2 className="text-xl font-semibold mb-4">How it works:</h2>
          <ul className="space-y-2 text-sm">
            <li>
              • <strong>Connect to Browser:</strong> Establishes WebSocket connection to the
              automation server
            </li>
            <li>
              • <strong>Start Login:</strong> Launches a real Chrome browser on the server
            </li>
            <li>
              • <strong>Interactive Session:</strong> You can see and interact with the browser
              through the canvas
            </li>
            <li>
              • <strong>Real-time Screencast:</strong> Browser content is streamed in real-time
            </li>
            <li>
              • <strong>Manual Login:</strong> You enter credentials manually, avoiding detection
            </li>
            <li>
              • <strong>Cookie Extraction:</strong> After successful login, cookies are
              automatically saved
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
