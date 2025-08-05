"use client";

import { AlertCircle, Plus, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function AutomateSettingsPage() {
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
  const [newBlockedUrl, setNewBlockedUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  // Add state for each slider
  const [connReq, setConnReq] = useState(20);
  const [profileVisits, setProfileVisits] = useState(50);
  const [messages, setMessages] = useState(50);
  const [inmails, setInmails] = useState(5);

  useEffect(() => {
    // Load blocked URLs from localStorage
    const savedBlockedUrls = localStorage.getItem('blockedLinkedInUrls');
    if (savedBlockedUrls) {
      setBlockedUrls(JSON.parse(savedBlockedUrls));
    }
  }, []);

  const validateLinkedInUrl = (url: string) => {
    const linkedInRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    return linkedInRegex.test(url);
  };

  const handleAddBlockedUrl = () => {
    if (!newBlockedUrl) {
      setUrlError("Please enter a LinkedIn profile URL");
      return;
    }

    if (!validateLinkedInUrl(newBlockedUrl)) {
      setUrlError("Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/username)");
      return;
    }

    const updatedUrls = [...blockedUrls, newBlockedUrl];
    setBlockedUrls(updatedUrls);
    localStorage.setItem('blockedLinkedInUrls', JSON.stringify(updatedUrls));
    setNewBlockedUrl("");
    setUrlError("");
  };

  const handleRemoveBlockedUrl = (urlToRemove: string) => {
    const updatedUrls = blockedUrls.filter(url => url !== urlToRemove);
    setBlockedUrls(updatedUrls);
    localStorage.setItem('blockedLinkedInUrls', JSON.stringify(updatedUrls));
  };

  return (
    <div className="py-8 px-8">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="font-riffic-free text-2xl">Scale Settings</h1>
          <p className="text-gray-500">Configure your LinkedIn automation settings and limits</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Connection Limits */}
          <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-black/10">
              <h2 className="font-riffic-free text-xl">Connection Limits</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Maximum number of LinkedIn daily actions</h3>
                  <p className="text-sm text-gray-500">LinkedIn sets weekly limits on the number of invitations you can send, depending on your account type. To maximize your outreach while minimizing the risk of hitting these limits, we recommend setting your daily invite limit in Botdog to:</p>
                  <ul className="mt-2 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      5 to 10 per day for Free Accounts
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      25 per day for Sales Navigator, Premium, Recruiter Lite, or Recruiter Accounts
                    </li>
                  </ul>
                  <p className="mt-2 text-sm text-gray-500">If you reach a weekly limit, Botdog will automatically reschedule your remaining invites until the limit is lifted.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Connection requests</label>
                    <div className="flex items-center gap-4 w-full">
                      <Slider min={0} max={200} step={1} value={[connReq]} onValueChange={([v]) => { setConnReq(v); }} className="w-48" />
                      <span className="text-sm text-gray-500">{connReq} per day</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Profile visits</label>
                    <div className="flex items-center gap-4 w-full">
                      <Slider min={0} max={350} step={1} value={[profileVisits]} onValueChange={([v]) => { setProfileVisits(v); }} className="w-48" />
                      <span className="text-sm text-gray-500">{profileVisits} per day</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Messages</label>
                    <div className="flex items-center gap-4 w-full">
                      <Slider min={0} max={300} step={1} value={[messages]} onValueChange={([v]) => { setMessages(v); }} className="w-48" />
                      <span className="text-sm text-gray-500">{messages} per day</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">InMails</label>
                    <div className="flex items-center gap-4 w-full">
                      <Slider min={0} max={70} step={1} value={[inmails]} onValueChange={([v]) => { setInmails(v); }} className="w-48" />
                      <span className="text-sm text-gray-500">{inmails} per day</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Blocked Users */}
          <div className="rounded-xl border border-black/10 bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-black/10">
              <h2 className="font-riffic-free text-xl">Blocked Users</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Manage blocked LinkedIn profiles</h3>
                  <p className="text-sm text-gray-500">Add LinkedIn profile URLs that you want to exclude from automation. These users will be skipped during connection requests and messaging.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="https://linkedin.com/in/username"
                      value={newBlockedUrl}
                      onChange={(e) => {
                        setNewBlockedUrl(e.target.value);
                        setUrlError("");
                      }}
                      className="flex-1 border focus:border-black"
                    />
                    <Button
                      onClick={handleAddBlockedUrl}
                      className="bg-gradient-to-r from-[#E8D5C4] via-[#FFF5EA] to-[#E8D5C4] text-black border border-black/10 rounded-xl font-outfit text-sm h-10 px-5"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add URL
                    </Button>
                  </div>
                  {urlError && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {urlError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  {blockedUrls.map((url, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-black/10 bg-white">
                      <span className="text-sm font-medium text-gray-700 truncate flex-1">{url}</span>
                      <button
                        onClick={() => handleRemoveBlockedUrl(url)}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Remove URL"
                      >
                        <X className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                  {blockedUrls.length === 0 && (
                    <div className="text-center py-8 border border-dashed border-black/10 rounded-xl">
                      <p className="text-sm text-gray-500">No blocked users added yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 