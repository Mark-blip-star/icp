"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock, Linkedin, Info } from "lucide-react";

export interface LinkedInCredentials {
  email: string;
  password: string;
}

interface LinkedInCredentialsProps {
  onSave: (credentials: LinkedInCredentials) => void;
  onDisconnect?: () => void;
}

export function LinkedInCredentials({ onSave, onDisconnect }: LinkedInCredentialsProps) {
  const [credentials, setCredentials] = useState<LinkedInCredentials>({
    email: "",
    password: "",
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const savedCredentials = localStorage.getItem('linkedInCredentials');
    setIsConnected(!!savedCredentials);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(credentials);
  };

  if (isConnected) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-black shadow-[4px_4px_black]">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">LinkedIn Account</h3>
                  <p className="text-sm text-gray-500">Manage your LinkedIn connection</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">Connected</span>
                  <button 
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                    onClick={onDisconnect}
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border-2 border-gray-200">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Linkedin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium">Adhiraj Hangal</p>
                  <p className="text-sm text-gray-500">Premium</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Info className="h-4 w-4" />
                <p>InMail Credits: <span className="font-medium text-gray-900">45</span></p>
                <span className="text-gray-400">(Last checked: Mar 21, 2025)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-black p-4 rounded-full">
          <Linkedin className="h-8 w-8 text-white" />
        </div>
      </div>
      
      <Card className="border-2 border-black shadow-[4px_4px_black]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-riffic-free text-center">Link Your Account</CardTitle>
          <CardDescription className="text-center">
            Enter your LinkedIn credentials to enable automation features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-riffic-free">LinkedIn Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="text"
                  placeholder="name@company.com"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="pl-10 border-2 focus:border-black transition-colors"
                />
                <div className="absolute left-3 top-2.5 text-gray-500">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="font-riffic-free">LinkedIn Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="pl-10 border-2 focus:border-black transition-colors"
                />
                <div className="absolute left-3 top-2.5 text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <p className="flex items-start gap-2">
                <Lock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                Your credentials are securely stored and only used for automation purposes
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-black hover:bg-yellow-400 text-white hover:text-black border-2 border-black font-riffic-free transition-all"
            >
              Connect LinkedIn Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 