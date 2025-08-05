"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Pencil,
  User2Icon,
  MailIcon,
  LogOutIcon,
  CreditCardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Linkedin,
  Plus,
  AlertCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { signOutUser } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Slider } from "@/components/ui/slider";

interface EditableField {
  id: "first_name" | "last_name";
  label: string;
  value: string;
}

type TabType = "profile" | "support" | "logout" | "billing" | "integrations";

export default function SettingsPage() {
  const user = useUser();
  const billingPortalLink =
    process.env.NODE_ENV == "development"
      ? `https://billing.stripe.com/p/login/test_3cs2bc4Km4I52nS3cc?prefilled_email=${user?.user?.email}`
      : `https://billing.stripe.com/p/login/4gweXFeSa4EOf0k9AA?prefilled_email=${user?.user?.email}`;
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingFields, setEditingFields] = useState<Set<string>>(new Set());
  const [updatedValues, setUpdatedValues] = useState<Record<string, string>>({});
  const [newBlockedUrl, setNewBlockedUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [blockedUrls, setBlockedUrls] = useState<string[]>([]);
  
  // Add null check before destructuring
  const userMetadata = user.user?.user_metadata || {};
  const { first_name = "", last_name = "" } = userMetadata as any;
  const email = user.user?.email || "";

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { method: "GET" });
        if (!res.ok) throw new Error("Failed to fetch settings");
  
        const { settings } = await res.json();
        if (settings) {
          setConnLimit(settings.max_connections_per_day ?? 20);
          setMsgLimit(settings.max_message_per_day ?? 50);
          setVisitsLimit(settings.total_visits_per_day ?? 50);
        }
      } catch (err) {
        console.error("Failed to load LinkedIn settings:", err);
      }
    };
  
    fetchSettings();
  }, []);

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

  const fields: EditableField[] = [
    { id: "first_name", label: "First Name", value: first_name },
    { id: "last_name", label: "Last Name", value: last_name },
  ];

  const handleEdit = (fieldId: string) => {
    setEditingFields((prev) => {
      const newSet = new Set(prev);
      newSet.add(fieldId);
      return newSet;
    });

    // Focus the input after the state update
    setTimeout(() => {
      const input = document.getElementById(fieldId) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 0);
  };

  const handleInputChange = (fieldId: string, value: string) => {
    setUpdatedValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSave = async () => {
    if (Object.keys(updatedValues).length === 0) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/profile-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedValues),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess("Settings updated successfully");
      setEditingFields(new Set());
      setUpdatedValues(data.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOutUser();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = Object.keys(updatedValues).length > 0;

  const renderMainContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="w-full">
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">Profile Information</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Email (read-only) */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium font-outfit">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  className="border font-outfit bg-gray-100 cursor-not-allowed"
                  disabled
                  readOnly
                />
              </div>
              {/* Editable fields */}
              {fields.map((field) => {
                const isEditing = editingFields.has(field.id);
                const currentValue = updatedValues[field.id] ?? field.value;

                return (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="text-sm font-medium font-outfit">
                      {field.label}
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id={field.id}
                        type="text"
                        value={currentValue}
                        className="border focus:border-black transition-colors font-outfit"
                        disabled={!isEditing || isLoading}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-yellow-400/10 rounded-lg"
                        disabled={isLoading}
                        onClick={() => handleEdit(field.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}

              {hasChanges && (
                <div className="pt-4">
                  <Button 
                    type="button" 
                    disabled={isLoading} 
                    onClick={handleSave}
                    className="w-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      );
    }

    if (activeTab === "integrations") {
      return (
        <div className="w-full space-y-6">
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">LinkedIn Daily Action Limits</h2>
            
            <div className="space-y-6">
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-outfit">Connection requests</label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                    <Slider 
                      min={0} 
                      max={200} 
                      step={1} 
                      value={[connReq]} 
                      onValueChange={([v]) => { setConnReq(v); setConnLimit(v); }} 
                      className="w-full"
                      trackClassName={sliderGradient}
                    />
                    <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                    <span className="text-sm text-gray-500 font-outfit">{connReq} per day</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-outfit">Profile visits</label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                    <Slider 
                      min={0} 
                      max={350} 
                      step={1} 
                      value={[profileVisits]} 
                      onValueChange={([v]) => { setProfileVisits(v); setVisitsLimit(v); }} 
                      className="w-full"
                      trackClassName={sliderGradient}
                    />
                    <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                    <span className="text-sm text-gray-500 font-outfit">{profileVisits} per day</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-outfit">Messages</label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                    <Slider 
                      min={0} 
                      max={300} 
                      step={1} 
                      value={[messages]} 
                      onValueChange={([v]) => { setMessages(v); setMsgLimit(v); }} 
                      className="w-full"
                      trackClassName={sliderGradient}
                    />
                    <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                    <span className="text-sm text-gray-500 font-outfit">{messages} per day</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 font-outfit">InMails</label>
                  <div className="col-span-2 flex items-center gap-4 w-full py-2">
                    <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                    <Slider 
                      min={0} 
                      max={70} 
                      step={1} 
                      value={[inmails]} 
                      onValueChange={([v]) => setInmails(v)} 
                      className="w-full"
                      trackClassName={sliderGradient}
                    />
                    <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                    <span className="text-sm text-gray-500 font-outfit">{inmails} per day</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 font-outfit mt-4 mb-2">If you're not sure what to do, select from one of the preset profiles below.</p>
              <div className="flex flex-row gap-4 mb-6">
                {PRESETS.map((preset, idx) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="flex-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 px-4 py-2 text-left transition-colors min-w-[200px]"
                    onClick={() => {
                      setConnReq(preset.values.connReq);
                      setProfileVisits(preset.values.profileVisits);
                      setMessages(preset.values.messages);
                      setInmails(preset.values.inmails);
                      setConnLimit(preset.values.connReq);
                      setVisitsLimit(preset.values.profileVisits);
                      setMsgLimit(preset.values.messages);
                    }}
                  >
                    <div className="font-medium text-sm mb-1">{preset.label}</div>
                    <div className="text-xs text-gray-500 leading-snug">{preset.description}</div>
                  </button>
                ))}
              </div>
              <Button 
                onClick={handleUpdateLimits}
                disabled={isLoading}
                className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold px-8"
              >
                Update Limits
              </Button>
            </div>
          </div>

          {/* Blocked Users */}
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">Blocked LinkedIn Profiles</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-outfit font-medium mb-1 text-lg">Manage blocked LinkedIn profiles</h3>
                <p className="font-outfit text-sm text-gray-500">Add LinkedIn profile URLs that you want to exclude from automation. These users will be skipped during connection requests and messaging.</p>
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
                    className="flex-1 border focus:border-black font-outfit"
                  />
                  <Button
                    onClick={handleAddBlockedUrl}
                    className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 px-5 font-bold"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </div>
                
                {urlError && (
                  <p className="text-sm text-red-500 flex items-center gap-1 font-outfit">
                    <AlertCircle className="h-4 w-4" />
                    {urlError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                {blockedUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-black/10 bg-white">
                    <span className="text-sm font-medium text-gray-700 truncate flex-1 font-outfit">{url}</span>
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
                    <p className="text-sm text-gray-500 font-outfit">No blocked users added yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "support") {
      return (
        <div className="w-full">
          <div className="bg-[#0A66C2]/5 p-6 rounded-xl border border-[#0A66C2]/20">
            <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight text-[#0A66C2]">Need Help?</h2>
            <p className="text-black/70 font-outfit">
              If you have any questions, concerns, or need assistance, please don't hesitate to
              reach out to our support team at:{" "}
              <a
                href="mailto:help@icptiger.com"
                className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
              >
                help@icptiger.com
              </a>
            </p>
            <p className="text-black/70 font-outfit mt-4">
              Also, feel free to message Adhiraj directly on{" "}
              <a
                href="https://x.com/adhirajhangal"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
              >
                X
              </a>{" "}
              or email him at{" "}
              <a
                href="mailto:adhiraj@icptiger.com"
                className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
              >
                adhiraj@icptiger.com
              </a>
              .
            </p>
          </div>
        </div>
      );
    }

    if (activeTab === "logout") {
      return (
        <div className="w-full">
          <div className="bg-[#0A66C2]/5 p-6 rounded-xl border border-[#0A66C2]/20">
            <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight text-[#0A66C2]">Logout</h2>
            <p className="text-black/70 font-outfit mb-6">
              Are you sure you want to logout? You will need to sign in again to access your
              account.
            </p>
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              className="!bg-red-600 !text-white hover:!bg-red-700 rounded-xl font-outfit text-sm h-10 font-bold border-red-600"
            >
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      );
    }

    if (activeTab === "billing") {
      // Use the billingPortalLink to redirect to Stripe
      return (
        <div className="w-full">
          <div className="bg-white p-6 rounded-xl border border-black/10">
            <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight">Manage Your Subscription</h2>
            <p className="text-gray-600 mb-6 font-outfit">
              Manage your subscription, payment methods, and billing history through the Stripe customer portal.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-black/10">
                <div className="bg-black p-2 rounded-lg">
                  <CreditCardIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-medium font-outfit">Current Plan: Premium</p>
                  <p className="text-sm text-gray-500 font-outfit">Active subscription</p>
                </div>
              </div>
              
              <a 
                href={billingPortalLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button 
                  className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold px-8"
                >
                  Go to Billing Portal
                </Button>
              </a>
              
              <p className="text-xs text-gray-500 text-center font-outfit">
                You'll be redirected to a secure Stripe page to manage your subscription.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.map((field) => {
            const isEditing = editingFields.has(field.id);
            const currentValue = updatedValues[field.id] ?? field.value;

            return (
              <div key={field.id} className="space-y-2">
                <label htmlFor={field.id} className="text-sm font-medium font-outfit">
                  {field.label}
                </label>
                <div className="flex gap-2 items-center">
                  <Input
                    id={field.id}
                    type="text"
                    value={currentValue}
                    className="pr-10 font-outfit"
                    disabled={!isEditing || isLoading}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    disabled={isLoading}
                    onClick={() => handleEdit(field.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          {hasChanges && (
            <div className="pt-4">
              <Button type="button" disabled={isLoading} onClick={handleSave} className="w-full font-outfit font-bold">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </form>
      </div>
    );
  };

  const [emblaRef, emblaApi] = useEmblaCarousel({
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const [connLimit, setConnLimit] = useState<number>(20);
  const [msgLimit, setMsgLimit]  = useState<number>(50);
  const [visitsLimit, setVisitsLimit]  = useState<number>(50);

  // Add state for each slider if not already present
  const [connReq, setConnReq] = useState(connLimit ?? 20);
  const [profileVisits, setProfileVisits] = useState(visitsLimit ?? 50);
  const [messages, setMessages] = useState(msgLimit ?? 50);
  const [inmails, setInmails] = useState(5);

  // Add these preset values
  const PRESETS = [
    {
      label: 'For free, recent or "cold" accounts',
      description: 'Best if you have a free LinkedIn account or a Premium account that\'s "cold" (rarely active, fewer than 2,000 connections)',
      values: { connReq: 10, profileVisits: 50, messages: 40, inmails: 20 },
    },
    {
      label: 'Slow premium account',
      description: 'If you have a "warm" account (>2,000 connections) and use Sales Navigator, Recruiter or Premium',
      values: { connReq: 20, profileVisits: 150, messages: 100, inmails: 30 },
    },
    {
      label: 'Fast premium account',
      description: 'If you have a warm premium account and want to go as fast as possible while remaining safe',
      values: { connReq: 40, profileVisits: 240, messages: 120, inmails: 30 },
    },
  ];

  const handleUpdateLimits = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_connections_per_day: connReq,
          max_message_per_day: messages,
          total_visits_per_day: profileVisits,
          max_inmails_per_day: inmails,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setSuccess("Limits updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Add this style for the gradient track
  const sliderGradient = "bg-gradient-to-r from-blue-500 to-red-500";

  return (
    <div className="w-full px-4 py-4 flex flex-col items-center overflow-y-auto h-[calc(100vh-4rem)] [&::-webkit-scrollbar]:hidden">
      <div className="max-w-7xl w-full mx-auto space-y-6 pb-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-500/50 rounded-xl text-red-800 font-outfit">
            {error}
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-500/50 rounded-xl text-green-800 font-outfit">
            {success}
          </div>
        )}

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-xl border border-black/10">
          <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">Profile Information</h2>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email (read-only) */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium font-outfit">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                className="border font-outfit bg-gray-100 cursor-not-allowed"
                disabled
                readOnly
              />
            </div>
            {fields.map((field) => {
              const isEditing = editingFields.has(field.id);
              const currentValue = updatedValues[field.id] ?? field.value;

              return (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="text-sm font-medium font-outfit">
                    {field.label}
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id={field.id}
                      type="text"
                      value={currentValue}
                      className="border focus:border-black transition-colors font-outfit"
                      disabled={!isEditing || isLoading}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-yellow-400/10 rounded-lg"
                      disabled={isLoading}
                      onClick={() => handleEdit(field.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {hasChanges && (
              <div className="pt-4">
                <Button 
                  type="button" 
                  disabled={isLoading} 
                  onClick={handleSave}
                  className="w-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </form>
        </div>

        {/* Automation Section */}
        <div className="bg-white p-6 rounded-xl border border-black/10">
          <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">LinkedIn Daily Action Limits</h2>
          <div className="space-y-6">
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-outfit">Connection requests</label>
                <div className="col-span-2 flex items-center gap-4 w-full py-2">
                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                  <Slider 
                    min={0} 
                    max={200} 
                    step={1} 
                    value={[connReq]} 
                    onValueChange={([v]) => { setConnReq(v); setConnLimit(v); }} 
                    className="w-full"
                    trackClassName={sliderGradient}
                  />
                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                  <span className="text-sm text-gray-500 font-outfit">{connReq} per day</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-outfit">Profile visits</label>
                <div className="col-span-2 flex items-center gap-4 w-full py-2">
                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                  <Slider 
                    min={0} 
                    max={350} 
                    step={1} 
                    value={[profileVisits]} 
                    onValueChange={([v]) => { setProfileVisits(v); setVisitsLimit(v); }} 
                    className="w-full"
                    trackClassName={sliderGradient}
                  />
                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                  <span className="text-sm text-gray-500 font-outfit">{profileVisits} per day</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-outfit">Messages</label>
                <div className="col-span-2 flex items-center gap-4 w-full py-2">
                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                  <Slider 
                    min={0} 
                    max={300} 
                    step={1} 
                    value={[messages]} 
                    onValueChange={([v]) => { setMessages(v); setMsgLimit(v); }} 
                    className="w-full"
                    trackClassName={sliderGradient}
                  />
                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                  <span className="text-sm text-gray-500 font-outfit">{messages} per day</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-outfit">InMails</label>
                <div className="col-span-2 flex items-center gap-4 w-full py-2">
                  <span className="text-xs text-blue-600 font-bold mr-2">Safe</span>
                  <Slider 
                    min={0} 
                    max={70} 
                    step={1} 
                    value={[inmails]} 
                    onValueChange={([v]) => setInmails(v)} 
                    className="w-full"
                    trackClassName={sliderGradient}
                  />
                  <span className="text-xs text-red-600 font-bold ml-2">Risky</span>
                  <span className="text-sm text-gray-500 font-outfit">{inmails} per day</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-outfit mt-4 mb-2">If you're not sure what to do, select from one of the preset profiles below.</p>
            <div className="flex flex-row gap-4 mb-6">
              {PRESETS.map((preset, idx) => (
                <button
                  key={preset.label}
                  type="button"
                  className="flex-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 px-4 py-2 text-left transition-colors min-w-[200px]"
                  onClick={() => {
                    setConnReq(preset.values.connReq);
                    setProfileVisits(preset.values.profileVisits);
                    setMessages(preset.values.messages);
                    setInmails(preset.values.inmails);
                    setConnLimit(preset.values.connReq);
                    setVisitsLimit(preset.values.profileVisits);
                    setMsgLimit(preset.values.messages);
                  }}
                >
                  <div className="font-medium text-sm mb-1">{preset.label}</div>
                  <div className="text-xs text-gray-500 leading-snug">{preset.description}</div>
                </button>
              ))}
            </div>
            <Button 
              onClick={handleUpdateLimits}
              disabled={isLoading}
              className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold px-8"
            >
              Update Limits
            </Button>
          </div>
        </div>

        {/* Blocked Users Section */}
        <div className="bg-white p-6 rounded-xl border border-black/10">
          <h2 className="text-xl font-semibold mb-6 font-recoleta font-black tracking-tight">Blocked LinkedIn Profiles</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-outfit font-medium mb-1 text-lg">Manage blocked LinkedIn profiles</h3>
              <p className="font-outfit text-sm text-gray-500">Add LinkedIn profile URLs that you want to exclude from automation. These users will be skipped during connection requests and messaging.</p>
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
                  className="flex-1 border focus:border-black font-outfit"
                />
                <Button
                  onClick={handleAddBlockedUrl}
                  className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 px-5 font-bold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add URL
                </Button>
              </div>
              
              {urlError && (
                <p className="text-sm text-red-500 flex items-center gap-1 font-outfit">
                  <AlertCircle className="h-4 w-4" />
                  {urlError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              {blockedUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-black/10 bg-white">
                  <span className="text-sm font-medium text-gray-700 truncate flex-1 font-outfit">{url}</span>
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
                  <p className="text-sm text-gray-500 font-outfit">No blocked users added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className="bg-white p-6 rounded-xl border border-black/10">
          <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight">Manage Your Subscription</h2>
          <p className="text-gray-600 mb-6 font-outfit">
            Manage your subscription, payment methods, and billing history through the Stripe customer portal.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-black/10">
              <div className="bg-black p-2 rounded-lg">
                <CreditCardIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium font-outfit">Current Plan: Premium</p>
                <p className="text-sm text-gray-500 font-outfit">Active subscription</p>
              </div>
            </div>
            
            <a 
              href={billingPortalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button 
                className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-xl font-outfit text-sm h-10 font-bold px-8"
              >
                Go to Billing Portal
              </Button>
            </a>
            
            <p className="text-xs text-gray-500 text-center font-outfit">
              You'll be redirected to a secure Stripe page to manage your subscription.
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-[#0A66C2]/5 p-6 rounded-xl border border-[#0A66C2]/20">
          <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight text-[#0A66C2]">Need Help?</h2>
          <p className="text-black/70 font-outfit">
            If you have any questions, concerns, or need assistance, please don't hesitate to
            reach out to our support team at:{" "}
            <a
              href="mailto:help@icptiger.com"
              className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
            >
              help@icptiger.com
            </a>
          </p>
          <p className="text-black/70 font-outfit mt-4">
            Also, feel free to message Adhiraj directly on{" "}
            <a
              href="https://x.com/adhirajhangal"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
            >
              X
            </a>{" "}
            or email him at{" "}
            <a
              href="mailto:adhiraj@icptiger.com"
              className="font-medium text-[#0A66C2] hover:text-[#0A66C2]/80 transition-colors"
            >
              adhiraj@icptiger.com
            </a>
            .
          </p>
        </div>

        {/* Logout Section */}
        <div className="bg-[#0A66C2]/5 p-6 rounded-xl border border-[#0A66C2]/20">
          <h2 className="text-xl font-semibold mb-4 font-recoleta font-black tracking-tight text-[#0A66C2]">Logout</h2>
          <p className="text-black/70 font-outfit mb-6">
            Are you sure you want to logout? You will need to sign in again to access your
            account.
          </p>
          <Button
            onClick={handleLogout}
            disabled={isLoading}
            className="!bg-red-600 !text-white hover:!bg-red-700 rounded-xl font-outfit text-sm h-10 font-bold border-red-600"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>
    </div>
  );
}
