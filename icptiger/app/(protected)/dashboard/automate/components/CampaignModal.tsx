import { useState, Dispatch, SetStateAction, RefObject } from "react";
import { X, AlertCircle, Calendar, Info, Search, FileText, Heart, MessageCircle, Users, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatUrlForDisplay } from "@/utils/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
// @ts-ignore
import Papa from 'papaparse';
import { useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

export interface CampaignData {
  name: string;
  sourceType: "searchUrl" | "csv" | "likes" | "comments" | "event" | "salesNavigator";
  searchUrl: string;
  connectionMessage: string;
  followUpMessage: string;
  secondFollowUpMessage: string;
  connectionMessageEnabled: boolean;
  followUpEnabled: boolean;
  secondFollowUpEnabled: boolean;
  followUpDays: number;
  secondFollowUpDays: number;
  dailyLimit: number;
  weeklyLimit: number;
  importLimit: number;
  startDate: string;
  endDate: string;
  hasEndDate: boolean;
  followUpHours: number;
  secondFollowUpHours: number;
  startTime: string;
  endTime: string;
}

interface CampaignModalProps {
  showModal: boolean;
  onSuccess: (campaignData: CampaignData) => void;
  onClose: () => void;
  campaignData: CampaignData;
  setCampaignData: Dispatch<SetStateAction<CampaignData>>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  errors: {
    name?: string;
    sourceType?: string;
    searchUrl?: string;
    connectionMessage?: string;
    followUpMessage?: string;
    secondFollowUpMessage?: string;
    importLimit?: string;
    startDate?: string;
  };
  setErrors: Dispatch<SetStateAction<{
    name?: string;
    sourceType?: string;
    searchUrl?: string;
    connectionMessage?: string;
    followUpMessage?: string;
    secondFollowUpMessage?: string;
    importLimit?: string;
    startDate?: string;
  }>>;
}

const steps = [
  { number: 1, title: "Source", description: "Choose your data source" },
  { number: 2, title: "Import", description: "Select your target audience" },
  { number: 3, title: "Message", description: "Personalize your outreach" },
  { number: 4, title: "Start", description: "Name and launch your campaign" }
];

const sourceOptions = [
  {
    id: "searchUrl",
    title: "Search URL",
    description: "Use LinkedIn search results",
    icon: Search,
    color: "bg-blue-50 border-blue-200 text-blue-700"
  },
  {
    id: "csv",
    title: "CSV",
    description: "Upload a CSV file with prospects",
    icon: FileText,
    color: "bg-green-50 border-green-200 text-green-700"
  },
  {
    id: "likes",
    title: "People who liked a LinkedIn post",
    description: "Target people who liked a specific LinkedIn post",
    icon: Heart,
    color: "bg-red-50 border-red-200 text-red-700"
  },
  {
    id: "comments",
    title: "People who commented on a LinkedIn post",
    description: "Target people who commented on a specific LinkedIn post",
    icon: MessageCircle,
    color: "bg-purple-50 border-purple-200 text-purple-700"
  },
  {
    id: "event",
    title: "Event",
    description: "Target attendees of a LinkedIn event",
    icon: Users,
    color: "bg-yellow-50 border-yellow-200 text-yellow-700"
  },
  {
    id: "salesNavigator",
    title: "Sales Navigator",
    description: "Invite people from your Sales Navigator lists or searches.",
    icon: Briefcase,
    color: "bg-gray-50 border-gray-200 text-gray-400",
    comingSoon: true
  }
];

// Add helper for LinkedIn profile URL validation
const isValidLinkedInUrl = (url: string) =>
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9\-_%]+\/?$/.test(url.trim());

export function CampaignModal({
  showModal,
  onClose,
  onSuccess,
  campaignData,
  setCampaignData,
  currentStep,
  setCurrentStep,
  errors,
  setErrors
}: CampaignModalProps) {
  // All hooks must be called at the top, before any early returns
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string[][] | null>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvColumnMap, setCsvColumnMap] = useState<{ [key: string]: string }>({});
  const [isClosing, setIsClosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const connectionMessageRef = useRef<HTMLTextAreaElement>(null);
  const followUpMessageRef = useRef<HTMLTextAreaElement>(null);
  const secondFollowUpMessageRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300); // Match the animation duration
  };

  if (!showModal && !isClosing) return null;

  const isLastStep = currentStep === steps.length;
  const isFirstStep = currentStep === 1;

  const handleSubmit = async () => {
    if (!isLastStep) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    // Validate required fields
    const newErrors = {
      name: !campaignData.name ? "Campaign name is required" : "",
      sourceType: !campaignData.sourceType ? "Source type is required" : "",
      // searchUrl: !campaignData.searchUrl ? "LinkedIn search URL is required" : "",
      connectionMessage: "",
      followUpMessage: campaignData.followUpEnabled && !campaignData.followUpMessage
        ? "First follow-up message is required when enabled" : "",
      secondFollowUpMessage: campaignData.secondFollowUpEnabled && campaignData.followUpEnabled && !campaignData.secondFollowUpMessage
        ? "Second follow-up message is required when enabled" : "",
      importLimit: !campaignData.importLimit 
        ? "Number of prospects is required" 
        : "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      // Validation errors found
      toast.error("Please fix the validation errors before continuing");
      return;
    }

    setIsSubmitting(true);

    try {
      
      
      const startDate = campaignData.startDate || new Date().toISOString().split('T')[0]
      const startTime = campaignData.startTime || (() => {
        const now = new Date();
        return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      })()
      
      const startDateTime = startDate
      ? new Date(`${startDate}T${startTime}:00Z`).toISOString()
      : new Date().toISOString();
      
      // Campaign start time processed 

      const endDateTime = campaignData.endDate
        ? new Date(`${campaignData.endDate}T${campaignData.endTime}:00Z`).toISOString()
        : null;

        let campaign_type: string;
        switch (campaignData.sourceType) {
          case 'searchUrl':
            campaign_type = 'search';
            break;
          case 'csv':
            campaign_type = 'csv';
            break;
          case 'likes':
            campaign_type = 'reactions';
            break;
          case 'comments':
            campaign_type = 'comments';
            break;
          case 'event':
            campaign_type = 'event';
            break;
          default:
            campaign_type = '';
        }

        // 1️⃣  Collect the mapped rows *only if* the source is CSV
let mappedRows: Array<Record<string, string>> = [];
if (campaignData.sourceType === "csv" && csvPreview) {
  // slice(1) to skip the header row
  mappedRows = csvPreview
    .slice(1, campaignData.importLimit ? campaignData.importLimit + 1 : undefined)
    .map((row) => {
      const obj: Record<string, string> = {};

      // For each visible header -> mapped field in csvColumnMap
      Object.entries(csvColumnMap).forEach(([header, mappedField]) => {
        if (!mappedField || mappedField === "ignore") return; // skip ignored / unmapped
        const colIndex = csvHeaders.indexOf(header);
        obj[mappedField] = row[colIndex] || "";
      });

      return obj;
    });
}

        
      const response = await fetch("/api/scale/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: campaignData.name,
          linkedinUrl: campaignData.searchUrl,
          connectionMessage: campaignData.connectionMessage,
          followUpMessage: campaignData.followUpMessage,
          secondFollowUpMessage: campaignData.secondFollowUpMessage,
          connectionMessageEnabled: campaignData.connectionMessageEnabled,
          followUpEnabled: campaignData.followUpEnabled,
          secondFollowUpEnabled: campaignData.secondFollowUpEnabled,
          followUpDays: campaignData.followUpDays,
          followUpHours: campaignData.followUpHours,
          secondFollowUpDays: campaignData.secondFollowUpDays,
          secondFollowUpHours: campaignData.secondFollowUpHours,
          dailyLimit: campaignData.dailyLimit,
          weeklyLimit: campaignData.weeklyLimit,
          importLimit: campaignData.importLimit,
          startDate: startDateTime || today,
          endDate: endDateTime,
          startTime: campaignData.startTime,
          endTime: campaignData.endTime,
          hasEndDate: campaignData.hasEndDate,
          campaign_type, 
          rows: mappedRows
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create campaign");
      }

      toast.success(data?.message || "Campaign created successfully!");
      
      // Dispatch event to update import counter
      window.dispatchEvent(new Event('campaignCreated'));
      
      onSuccess({
        name: campaignData.name,
        sourceType: campaignData.sourceType,
        searchUrl: campaignData.searchUrl,
        connectionMessage: campaignData.connectionMessage,
        followUpMessage: campaignData.followUpMessage,
        secondFollowUpMessage: campaignData.secondFollowUpMessage,
        connectionMessageEnabled: campaignData.connectionMessageEnabled,
        followUpEnabled: campaignData.followUpEnabled,
        secondFollowUpEnabled: campaignData.secondFollowUpEnabled,
        followUpDays: campaignData.followUpDays,
        followUpHours: campaignData.followUpHours,
        secondFollowUpDays: campaignData.secondFollowUpDays,
        secondFollowUpHours: campaignData.secondFollowUpHours,
        dailyLimit: campaignData.dailyLimit,
        weeklyLimit: campaignData.weeklyLimit,
        importLimit: campaignData.importLimit,
        startDate: campaignData.startDate || today,
        endDate: campaignData.endDate,
        startTime: campaignData.startTime,
        endTime: campaignData.endTime,
        hasEndDate: campaignData.hasEndDate,
      });
      setErrors({});
      setCurrentStep(1);
      handleClose();
    } catch (error: any) {
      console.error("Error creating campaign:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add CSV import step validation
  const isCsvImportValid = () => {
    if (campaignData.sourceType !== 'csv' || !csvPreview) return true;
    const linkedInHeader = Object.entries(csvColumnMap).find(([, v]) => v === 'linkedin_url')?.[0];
    if (!linkedInHeader) return false;
    const colIdx = csvHeaders.indexOf(linkedInHeader);
    if (colIdx === -1) return false;
    const invalidUrls = csvPreview.slice(1).map(row => row[colIdx]).filter(cell => cell && !isValidLinkedInUrl(cell));
    return invalidUrls.length === 0;
  };

  // Add per-step validation
  const isStepValid = (() => {
    if (currentStep === 1) {
      // Source selection must be made
      return Boolean(campaignData.sourceType);
    }
    if (currentStep === 2) {
      if (campaignData.sourceType === 'csv') {
        // Must have importLimit and CSV file mapped
        return Boolean(campaignData.importLimit) && isCsvImportValid();
      }
      if (campaignData.sourceType === 'searchUrl' || campaignData.sourceType === 'likes' || campaignData.sourceType === 'comments' || campaignData.sourceType === 'event') {
        // Must have a valid searchUrl and importLimit
        return Boolean(campaignData.searchUrl) && Boolean(campaignData.importLimit);
      }
      // For other types, just require importLimit
      return Boolean(campaignData.importLimit);
    }
    // For other steps, always valid
    return true;
  })();

  const insertVariableAtCursor = (
    ref: RefObject<HTMLTextAreaElement>,
    variable: string,
    field: 'connectionMessage' | 'followUpMessage' | 'secondFollowUpMessage'
  ) => {
    if (!ref.current) return;
    const textarea = ref.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const newValue = value.substring(0, start) + variable + value.substring(end);
    textarea.value = newValue;
    textarea.selectionStart = textarea.selectionEnd = start + variable.length;
    textarea.focus();
    setCampaignData((prev) => ({ ...prev, [field]: newValue }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all duration-300 ease-out max-w-[1800px] w-full h-full p-12"
      style={{
        animation: showModal && !isClosing ? 'fadeIn 0.3s ease-out' : 'fadeOut 0.3s ease-in',
        opacity: isClosing ? 0 : 1
      }}
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-[1800px] max-h-[98vh] overflow-y-auto flex flex-col transform transition-all duration-300 ease-out"
        style={{ 
          width: '1800px', 
          maxHeight: '98vh',
          animation: showModal && !isClosing ? 'slideIn 0.4s ease-out' : 'slideOut 0.3s ease-in',
          transform: isClosing ? 'scale(0.95) translateY(20px)' : (showModal ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)')
        }}
        onClick={(e) => e.stopPropagation()}
      >
          {/* Header with progress */}
          <div className="px-8 pt-6 pb-4 bg-white">
            <div className="flex flex-col items-center justify-center mb-4 relative">
              <button
                onClick={handleClose}
                className="absolute right-0 top-0 p-2 hover:bg-black/5 rounded-xl transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-black font-recoleta"></h2>
            </div>

            {/* Step Progress */}
            <div className="flex flex-col items-center mb-1">
              <div className="flex items-center gap-8">
                {steps.map((step) => (
                  <div key={step.number} className="flex flex-col items-center">
                    {step.number < currentStep ? (
                      <div className="w-4 h-4 rounded-full bg-[#0A66C2] border-[#0A66C2] flex items-center justify-center text-white text-[10px] transition-all duration-500 ease-out scale-110">
                        ✓
                      </div>
                    ) : step.number === currentStep ? (
                      <div className="w-4 h-4 rounded-full bg-[#0A66C2] border-[#0A66C2] transition-all duration-500 ease-out scale-110 animate-fill-circle" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 bg-white transition-all duration-300 hover:scale-105" />
                    )}
                    <span className={cn(
                      "mt-2 text-xs font-outfit text-center transition-all duration-300",
                      currentStep === step.number ? "text-[#0A66C2] font-semibold scale-105" : "text-gray-500"
                    )}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className={currentStep === 3 ? "flex-1 overflow-y-auto custom-scrollbar scrollbar-invisible" : "flex-1 overflow-hidden"}>
            <div className="px-8 py-4 bg-white h-full">
              {currentStep === 1 && (
                <div className="max-w-4xl mx-auto">
                  <div className="space-y-8">
                    {/* Source Selection */}
                    <div className="mb-6">
                      <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {sourceOptions.map((option) => (
                            <div
                              key={option.id}
                              className={cn(
                                "group relative p-8 border-2 rounded-3xl cursor-pointer transition-all duration-300 ease-out flex flex-col items-center text-center",
                                campaignData.sourceType === option.id && !option.comingSoon
                                  ? "border-[#0A66C2] bg-gradient-to-br from-[#0A66C2]/10 to-[#0A66C2]/5 shadow-lg scale-105"
                                  : option.comingSoon
                                    ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                                    : "border-gray-200 hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 hover:scale-[1.06] hover:shadow-2xl hover:z-10"
                              )}
                              onClick={() => {
                                if (!option.comingSoon) setCampaignData((prev: CampaignData) => ({ ...prev, sourceType: option.id as CampaignData["sourceType"] }));
                              }}
                              aria-disabled={option.comingSoon}
                            >
                              {/* Icon with background */}
                              <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 text-3xl",
                                campaignData.sourceType === option.id && !option.comingSoon
                                  ? "bg-[#0A66C2] text-white"
                                  : option.color + (option.comingSoon ? " opacity-60" : " group-hover:bg-[#0A66C2]/10 group-hover:text-[#0A66C2]")
                              )}>
                                <option.icon className="h-8 w-8" />
                              </div>
                              {/* Content */}
                              <div>
                                <h3 className={cn(
                                  "font-outfit font-bold text-lg mb-2 transition-colors",
                                  campaignData.sourceType === option.id && !option.comingSoon
                                    ? "text-[#0A66C2]"
                                    : option.comingSoon
                                      ? "text-gray-400"
                                      : "text-gray-900 group-hover:text-[#0A66C2]"
                                )}>
                                  {option.title}
                                </h3>
                                <p className={cn(
                                  "text-base font-outfit leading-relaxed transition-colors",
                                  campaignData.sourceType === option.id && !option.comingSoon
                                    ? "text-[#0A66C2]/80"
                                    : option.comingSoon
                                      ? "text-gray-400"
                                      : "text-gray-600 group-hover:text-gray-700"
                                )}>
                                  {option.description}
                                </p>
                                {option.comingSoon && (
                                  <div className="mt-4 flex justify-center">
                                    <span className="px-3 py-1 text-xs rounded bg-gray-200 text-gray-500 font-semibold">Coming soon</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {errors.sourceType && (
                        <p className="text-sm text-red-500 flex items-center gap-1 font-outfit mt-2">
                            <AlertCircle className="h-4 w-4" />
                            {errors.sourceType}
                          </p>
                        )}
                      </div>




                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
              <div className="space-y-4">
                  <div className="max-w-4xl mx-auto">
                  <div className="space-y-4">
                    {/* Steps to Import from CSV */}
                      {campaignData.sourceType === "csv" && (
                      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-4 shadow-sm">
                        <h4 className="font-outfit font-bold text-green-900 text-base mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-500" />
                          Import CSV extracts from your favorite lead generation tools
                        </h4>
                        <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-2 sm:gap-0">
                          {/* Step 1 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-base shadow-md mb-1">1</div>
                            <div className="font-semibold text-green-900 mb-0.5 text-xs">Upload Your CSV File</div>
                            <div className="text-green-800 text-xs">Start by uploading a CSV file containing your contact information</div>
                          </div>
                          {/* Step 2 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-base shadow-md mb-1">2</div>
                            <div className="font-semibold text-green-900 mb-0.5 text-xs">Match Columns</div>
                            <div className="text-green-800 text-xs">Match the columns in your CSV file to our format. The essential column we need is the LinkedIn Profile URL</div>
                          </div>
                          {/* Step 3 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-bold text-base shadow-md mb-1">3</div>
                            <div className="font-semibold text-green-900 mb-0.5 text-xs">Review Rows</div>
                            <div className="text-green-800 text-xs">Finally, we may ask you to review some rows to ensure everything is correct</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CSV File Upload Section */}
                    {campaignData.sourceType === "csv" && !csvPreview && (
                      <div className="mb-8">
                        <div className="space-y-4">
                          {/* Number of prospects to import input */}
                          <div className="flex items-center gap-4">
                            <Label className="font-outfit font-semibold text-gray-900 text-base whitespace-nowrap">
                              Number of prospects to import <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              type="number"
                              min={1}
                              max={10000}
                              className="w-32"
                              value={campaignData.importLimit || ''}
                              onChange={e => setCampaignData(prev => ({ ...prev, importLimit: Number(e.target.value) }))}
                              disabled={isSubmitting}
                            />
                            {errors.importLimit && (
                              <span className="text-red-500 text-sm ml-2">{errors.importLimit}</span>
                            )}
                          </div>
                          {/* File selection section */}
                          <div className="flex items-center gap-4">
                            <Label className="font-outfit font-semibold text-gray-900 text-base whitespace-nowrap">
                              CSV File <span className="text-red-500">*</span>
                            </Label>
                            <input
                              type="file"
                              accept=".csv"
                              className="hidden"
                              id="csvFileInput"
                              ref={fileInputRef}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  Papa.parse(file, {
                                    complete: (result: Papa.ParseResult<string[]>) => {
                                      const data = result.data as string[][];
                                      if (!data.length) return toast.error('CSV is empty.');
                                      const headers = data[0];
                                      setCsvHeaders(headers);
                                      setCsvPreview(data.slice(0, 6)); // header + 5 rows
                                      setCsvColumnMap({});
                                    },
                                    error: () => toast.error('Failed to parse CSV.'),
                                  });
                                }
                              }}
                              disabled={isSubmitting}
                            />
                            <label
                              htmlFor="csvFileInput"
                              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors cursor-pointer font-medium text-base shadow-md hover:shadow-lg"
                            >
                              CSV File
                            </label>
                          </div>
                          <p className="text-sm text-gray-600 font-outfit">
                            Upload a CSV file containing LinkedIn profile URLs. The file should have a "linkedin_url" column.
                          </p>
                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CSV Column Mapping Preview */}
                    {campaignData.sourceType === "csv" && csvPreview && (
                      (() => {
                        // Find which header is mapped to linkedin_url
                        const linkedInHeader = Object.entries(csvColumnMap).find(([, v]) => v === 'linkedin_url')?.[0];
                        let invalidUrls: string[] = [];
                        if (linkedInHeader) {
                          const colIdx = csvHeaders.indexOf(linkedInHeader);
                          if (colIdx !== -1) {
                            invalidUrls = csvPreview.slice(1).map(row => row[colIdx]).filter(cell => cell && !isValidLinkedInUrl(cell));
                          }
                        }
                        return (
                        <div className="mb-8">
                            <div className="mb-4 text-base font-semibold text-gray-900 font-outfit">If necessary, match your columns by clicking the menu in each column header.</div>
                            <div className="rounded-xl border border-gray-200 bg-white max-h-[60vh] overflow-y-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr>
                                    {csvHeaders.map((header, idx) => (
                                      <th key={header + idx} className="px-4 py-2 border-b bg-gray-50 text-left font-bold">
                                        <div className="flex flex-col gap-1">
                                          <span>{header}</span>
                                          <select
                                            className="border rounded px-2 py-1 text-xs"
                                            value={csvColumnMap[header] || ''}
                                            onChange={e => {
                                              setCsvColumnMap(map => ({ ...map, [header]: e.target.value }));
                                            }}
                                          >
                                            <option value="">Choose column</option>
                                            <option value="fullName">Full Name</option>
                                            <option value="firstName">First Name</option>
                                            <option value="lastName">Last Name</option>
                                            <option value="linkedin_url">LinkedIn Profile URL (required)</option>
                                            <option value="ignore">Ignore</option>
                                          </select>
                                        </div>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {csvPreview.slice(1).map((row, i) => (
                                    <tr key={i}>
                                      {row.map((cell, j) => (
                                        <td key={j} className="px-4 py-2 border-b text-gray-800">{cell}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {/* Validation message if linkedin_url not mapped */}
                            {!Object.values(csvColumnMap).includes('linkedin_url') && (
                              <div className="text-red-500 text-sm mt-2 font-outfit flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Please tag one column as "LinkedIn Profile URL" to continue.
                              </div>
                            )}
                            {/* Validation for invalid LinkedIn URLs */}
                            {!!invalidUrls.length && (
                              <div className="text-red-500 text-sm mt-2 font-outfit flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {`Some values in the selected column are not valid LinkedIn profile URLs.`}
                              </div>
                            )}
                            <div className="mt-4 flex gap-2">
                              <button
                                type="button"
                                className="text-gray-500 underline hover:text-gray-700 transition-colors text-sm font-medium bg-transparent border-none p-0 shadow-none outline-none cursor-pointer"
                                onClick={() => {
                                  setCsvPreview(null);
                                  setCsvHeaders([]);
                                  setCsvColumnMap({});
                                  if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                              >
                                Upload another CSV
                              </button>
                          </div>
                        </div>
                        );
                      })()
                      )}

                      {/* Steps to Import from LinkedIn Search */}
                    {campaignData.sourceType === "searchUrl" && (
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-3 shadow-sm mt-3">
                        <div className="flex flex-col md:flex-row gap-3 items-center md:items-start overflow-y-hidden">
                          {/* Steps */}
                          <div className="flex-1 order-1 md:order-none">
                            <h4 className="font-outfit font-bold text-blue-900 text-base mb-4 flex items-center gap-2">
                              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Steps to Import from LinkedIn Search
                            </h4>
                            <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-2 sm:gap-0">
                              {/* Step 1 */}
                              <div className="flex-1 flex flex-col items-center text-center relative">
                                <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-base shadow-md mb-1">1</div>
                                <div className="font-semibold text-blue-900 mb-0.5 text-xs">Open LinkedIn Search</div>
                                <div className="text-blue-800 text-xs mb-1">Go to LinkedIn and search for people you want to reach.</div>
                                <a
                                  href="https://www.linkedin.com/search/results/people/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block mt-0.5 px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium shadow hover:bg-blue-700 transition-colors"
                                >
                                  Open LinkedIn Search
                                </a>
                              </div>
                              {/* Step 2 */}
                              <div className="flex-1 flex flex-col items-center text-center relative">
                                <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-base shadow-md mb-1">2</div>
                                <div className="font-semibold text-blue-900 mb-0.5 text-xs">Apply Filters</div>
                                <div className="text-blue-800 text-xs">Refine the list using keywords, location, title, and connection level.</div>
                              </div>
                              {/* Step 3 */}
                              <div className="flex-1 flex flex-col items-center text-center relative">
                                <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-base shadow-md mb-1">3</div>
                                <div className="font-semibold text-blue-900 mb-0.5 text-xs">Copy the URL</div>
                                <div className="text-blue-800 text-xs">Once your results look good, copy the full search URL.</div>
                              </div>
                              {/* Step 4 */}
                              <div className="flex-1 flex flex-col items-center text-center relative">
                                <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-base shadow-md mb-1">4</div>
                                <div className="font-semibold text-blue-900 mb-0.5 text-xs">Paste it below</div>
                                <div className="text-blue-800 text-xs">Drop the link here and we'll import the results automatically.</div>
                              </div>
                            </div>
                          </div>
                          {/* Video Demo */}
                          <video
                            src="/searchdemo.mp4"
                            autoPlay
                            muted
                            loop
                            playsInline
                            controls
                            className="w-[280px] min-w-[280px] max-w-[280px] rounded-xl shadow-md border border-blue-100 bg-white order-2 md:order-none"
                            poster="/images/linkedin.png"
                          >
                            Sorry, your browser does not support embedded videos.
                          </video>
                        </div>
                      </div>
                    )}

                    {/* Example Links - Only for Search URL */}
                    {campaignData.sourceType === "searchUrl" && (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-3 shadow-sm mt-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <h4 className="font-outfit font-bold text-gray-900 text-base">Need ideas to get started?</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-700 font-outfit">
                          <a 
                            href="https://www.linkedin.com/search/results/people/?keywords=Software%20Engineer&network=%5B%22S%22%5D&openTo=%5B%22JOB%22%5D&geo=%5B%22us%3A0%22%5D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">Software Engineer (Open to Work, 2nd-degree, US)</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <a 
                            href="https://www.linkedin.com/search/results/people/?keywords=VP%20of%20Engineering%20hiring&network=%5B%22S%22%5D&geo=%5B%22us%3A0%22%5D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">VP of Engineering (2nd-degree, hiring signal, US)</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <a 
                            href="https://www.linkedin.com/search/results/people/?keywords=Head%20of%20People&companySize=%5B%2211-50%22%2C%2251-200%22%5D&geo=%5B%22us%3A0%22%2C%22ca%3A0%22%5D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">Head of People (company size 11–200, US/Canada)</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <a 
                            href="https://www.linkedin.com/search/results/people/?keywords=Product%20Manager%20%28ex-Google%20OR%20ex-Meta%29&geo=%5B%22us%3A0%22%5D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">Product Manager (ex-Google or ex-Meta, US)</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <a 
                            href="https://www.linkedin.com/search/results/people/?keywords=Founder%20%28AI%20OR%20Fintech%29&companySize=%5B%221-10%22%2C%2211-50%22%5D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">Founder in AI or Fintech (&lt;50 employees)</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <a 
                            href="https://www.linkedin.com/search/results/people/?keywords=CTO%20%22Series%20A%22&network=%5B%22S%22%5D" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-white p-3 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 transition-all duration-300 group flex items-center justify-between hover:-translate-y-1"
                          >
                            <span className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">CTO (Series A, 2nd-degree)</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Steps to Import from LinkedIn Post Likes */}
                    {campaignData.sourceType === "likes" && (
                      <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 shadow-sm mt-4">
                        <h4 className="font-outfit font-bold text-red-900 text-base mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          Import people who reacted to a LinkedIn post
                        </h4>
                        <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-2 sm:gap-0">
                          {/* Step 1 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-base shadow-md mb-1">1</div>
                            <div className="font-semibold text-red-900 mb-0.5 text-xs">Go to your LinkedIn Feed</div>
                            <div className="text-red-800 text-xs">Navigate to your LinkedIn homepage</div>
                          </div>
                          {/* Step 2 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-base shadow-md mb-1">2</div>
                            <div className="font-semibold text-red-900 mb-0.5 text-xs">Find the post you want to import reactions from</div>
                            <div className="text-red-800 text-xs">Locate the specific post with reactions</div>
                          </div>
                          {/* Step 3 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white font-bold text-base shadow-md mb-1">3</div>
                            <div className="font-semibold text-red-900 mb-0.5 text-xs">Paste the URL here</div>
                            <div className="text-red-800 text-xs">Copy the LinkedIn post URL and enter it above</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Steps to Import from LinkedIn Post Comments */}
                    {campaignData.sourceType === "comments" && (
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-4 shadow-sm mt-4">
                        <h4 className="font-outfit font-bold text-purple-900 text-base mb-4 flex items-center gap-2">
                          <MessageCircle className="w-5 h-5 text-purple-500" />
                          Import people who commented on a LinkedIn post
                        </h4>
                        <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-2 sm:gap-0">
                          {/* Step 1 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold text-base shadow-md mb-1">1</div>
                            <div className="font-semibold text-purple-900 mb-0.5 text-xs">Go to your LinkedIn Feed</div>
                            <div className="text-purple-800 text-xs">Navigate to your LinkedIn homepage</div>
                          </div>
                          {/* Step 2 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold text-base shadow-md mb-1">2</div>
                            <div className="font-semibold text-purple-900 mb-0.5 text-xs">Find the post you want to import comments from</div>
                            <div className="text-purple-800 text-xs">Locate the specific post with comments</div>
                          </div>
                          {/* Step 3 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white font-bold text-base shadow-md mb-1">3</div>
                            <div className="font-semibold text-purple-900 mb-0.5 text-xs">Paste the URL here</div>
                            <div className="text-purple-800 text-xs">Copy the LinkedIn post URL and enter it above</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Steps to Import from LinkedIn Event */}
                    {campaignData.sourceType === "event" && (
                      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-2xl p-4 shadow-sm mt-4">
                        <h4 className="font-outfit font-bold text-yellow-900 text-base mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-yellow-500" />
                          Import attendees from a LinkedIn event
                        </h4>
                        <div className="flex flex-col sm:flex-row items-start sm:items-stretch justify-between gap-2 sm:gap-0">
                          {/* Step 1 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold text-base shadow-md mb-1">1</div>
                            <div className="font-semibold text-yellow-900 mb-0.5 text-xs">Go to the LinkedIn event</div>
                            <div className="text-yellow-800 text-xs">Navigate to the event you want to target</div>
                          </div>
                          {/* Step 2 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold text-base shadow-md mb-1">2</div>
                            <div className="font-semibold text-yellow-900 mb-0.5 text-xs">Copy the event URL</div>
                            <div className="text-yellow-800 text-xs">Get the URL from your browser address bar</div>
                          </div>
                          {/* Step 3 */}
                          <div className="flex-1 flex flex-col items-center text-center relative">
                            <div className="z-10 w-8 h-8 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold text-base shadow-md mb-1">3</div>
                            <div className="font-semibold text-yellow-900 mb-0.5 text-xs">Paste the URL here</div>
                            <div className="text-yellow-800 text-xs">Copy the LinkedIn event URL and enter it above</div>
                          </div>
                        </div>
                      </div>
                    )}

                      {/* Number of prospects to import */}
                      {!(campaignData.sourceType === "csv" && currentStep === 2) && (
                        <div className="mb-4">
                          <div className="flex items-center gap-3">
                            <Label className="font-outfit font-semibold text-gray-900 text-base flex items-center gap-1" htmlFor="importLimitInput">
                              Number of prospects to import <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="importLimitInput"
                              type="number"
                              min="1"
                              max={campaignData.importLimit}
                              placeholder="100"
                              className={cn(
                                "w-32 p-2 border-2 rounded-xl bg-white/50 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ring-0 outline-none transition-colors text-base",
                                errors.importLimit
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-gray-300"
                              )}
                              value={campaignData.importLimit || ''}
                              onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, importLimit: parseInt(e.target.value) }))}
                              disabled={isSubmitting}
                            />
                            {errors.importLimit && (
                              <span className="text-xs text-red-500 ml-2 flex items-center gap-1 font-outfit">
                                <AlertCircle className="h-4 w-4" />
                                {errors.importLimit}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* LinkedIn Search URL */}
                      {campaignData.sourceType === "searchUrl" && (
                        <div className="mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-4">
                              <Label className="font-outfit font-semibold text-gray-900 text-base whitespace-nowrap" htmlFor="searchUrlInput">
                                LinkedIn Search URL <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                id="searchUrlInput"
                                placeholder="https://www.linkedin.com/search/results/people/..."
                                className={cn(
                                  "max-w-lg flex-1 px-4 py-3 border-2 rounded-lg bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors text-base shadow-sm",
                                  errors.searchUrl
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-gray-200 focus:border-blue-400"
                                )}
                                value={campaignData.searchUrl}
                                onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, searchUrl: e.target.value }))}
                                disabled={isSubmitting}
                              />
                            </div>
                            {errors.searchUrl && (
                              <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                                <AlertCircle className="h-4 w-4" />
                                {errors.searchUrl}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {/* LinkedIn Post URL for Likes */}
                    {campaignData.sourceType === "likes" && (
                      <div className="mb-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label className="font-outfit font-semibold text-gray-900 text-base whitespace-nowrap" htmlFor="postUrlInput">
                              LinkedIn Post URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/posts/..."
                              className={cn(
                                "max-w-lg flex-1 px-4 py-3 border-2 rounded-lg bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors text-base shadow-sm",
                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-blue-400"
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, searchUrl: e.target.value }))}
                              disabled={isSubmitting}
                            />
                          </div>
                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Post URL for Comments */}
                    {campaignData.sourceType === "comments" && (
                      <div className="mb-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label className="font-outfit font-semibold text-gray-900 text-base whitespace-nowrap" htmlFor="postUrlInputComments">
                              LinkedIn Post URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/posts/..."
                              className={cn(
                                "max-w-lg flex-1 px-4 py-3 border-2 rounded-lg bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-colors text-base shadow-sm",
                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-purple-400"
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, searchUrl: e.target.value }))}
                              disabled={isSubmitting}
                            />
                          </div>
                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* LinkedIn Event URL for Event */}
                    {campaignData.sourceType === "event" && (
                      <div className="mb-8">
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <Label className="font-outfit font-semibold text-gray-900 text-base whitespace-nowrap" htmlFor="eventUrlInput">
                              LinkedIn Event URL <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="searchUrlInput"
                              placeholder="https://www.linkedin.com/events/..."
                              className={cn(
                                "max-w-lg flex-1 px-4 py-3 border-2 rounded-lg bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition-colors text-base shadow-sm",
                                errors.searchUrl
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-yellow-400"
                              )}
                              value={campaignData.searchUrl}
                              onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, searchUrl: e.target.value }))}
                              disabled={isSubmitting}
                            />
                          </div>
                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2 mt-1">
                              <AlertCircle className="h-4 w-4" />
                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}



                    {/* CSV File Upload Section */}
                    {campaignData.sourceType === "csv" && (
                      <div className="mb-8">
                        <div className="space-y-4">
                          {errors.searchUrl && (
                            <p className="text-sm text-red-500 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {errors.searchUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 pb-4">
                  <div className="max-w-7xl mx-auto px-16 relative">
                    {/* Personalization Notes - Compact, at top */}
                    <div className="flex flex-col md:flex-row items-stretch gap-10 justify-center w-full mb-2">
                      {/* Connection Message Card */}
                      <div className={cn(
                        "rounded-xl border border-gray-100 bg-white p-8 shadow-md flex flex-col min-w-[360px] max-w-[440px] min-h-[400px]",
                        !campaignData.connectionMessageEnabled && "opacity-60"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 text-base">Connection Message</span>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer",
                                campaignData.connectionMessageEnabled ? "bg-[#0A66C2]" : "bg-gray-200"
                              )}
                              onClick={() => setCampaignData((prev: CampaignData) => ({ ...prev, connectionMessageEnabled: !prev.connectionMessageEnabled }))}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded-full bg-white transition-transform",
                                campaignData.connectionMessageEnabled ? "translate-x-3" : "translate-x-0"
                              )} />
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">Optional note sent with your invitation.</p>
                        <div className="flex justify-end mb-2">
                          {/* Removed Variables dropdown/button above connection message textarea */}
                        </div>
                        <Textarea
                          ref={connectionMessageRef}
                          className={cn(
                            "w-full border-2 rounded-lg p-2 h-[260px] text-base focus:outline-none transition-colors bg-white placeholder:text-gray-400",
                            errors.connectionMessage ? "border-red-300 focus:border-red-500" : "border-gray-200",
                            !campaignData.connectionMessageEnabled && "opacity-50 cursor-not-allowed"
                          )}
                          placeholder="Hi {{firstName}}, I came across your profile and thought it would be great to connect!"
                          rows={6}
                          disabled={!campaignData.connectionMessageEnabled || isSubmitting}
                          value={campaignData.connectionMessage}
                          onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, connectionMessage: e.target.value }))}
                        />
                        {errors.connectionMessage && (
                          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.connectionMessage}
                          </p>
                        )}
                        <div className="bg-blue-50 rounded-md px-3 py-1 mt-2 w-fit text-sm shadow-sm flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center justify-center font-semibold text-blue-700 text-sm focus:outline-none bg-transparent" title="Insert variable">
                                Variables
                                <svg className="ml-1 h-4 w-4 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(connectionMessageRef, "{{firstName}}", "connectionMessage")}>First Name</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(connectionMessageRef, "{{lastName}}", "connectionMessage")}>Last Name</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(connectionMessageRef, "{{company}}", "connectionMessage")}>Company</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {/* Arrow between cards */}
                      <div className="hidden md:flex flex-col justify-center items-center mx-2">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-gray-300"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      {/* First Follow-up Message Card */}
                      <div className={cn(
                        "rounded-xl border border-gray-100 bg-white p-8 shadow-md flex flex-col min-w-[360px] max-w-[440px] min-h-[400px]",
                        !campaignData.followUpEnabled && "opacity-60"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 text-base">First Follow-up</span>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer",
                                campaignData.followUpEnabled ? "bg-[#0A66C2]" : "bg-gray-200"
                              )}
                              onClick={() => setCampaignData((prev: CampaignData) => ({ ...prev, followUpEnabled: !prev.followUpEnabled }))}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded-full bg-white transition-transform",
                                campaignData.followUpEnabled ? "translate-x-3" : "translate-x-0"
                              )} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <input
                            type="number"
                            min={0}
                            max={14}
                            value={campaignData.followUpDays}
                            onChange={e => setCampaignData(prev => ({ ...prev, followUpDays: parseInt(e.target.value) }))}
                            disabled={!campaignData.followUpEnabled || isSubmitting}
                            className="w-12 px-1 py-0.5 text-center text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                            style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                          />
                          <span className="text-xs text-gray-700 mx-1">days</span>
                          <input
                            type="number"
                            min={0}
                            max={23}
                            value={campaignData.followUpHours}
                            onChange={e => setCampaignData(prev => ({ ...prev, followUpHours: parseInt(e.target.value) }))}
                            disabled={!campaignData.followUpEnabled || isSubmitting}
                            className="w-12 px-1 py-0.5 text-center text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                            style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                          />
                          <span className="text-xs text-gray-700 mx-1">hours</span>
                          <span className="text-[11px] text-gray-500 whitespace-nowrap"> after connecting.</span>
                        </div>
                        {/* Removed Variables dropdown above follow-up message textarea */}
                        <Textarea
                          ref={followUpMessageRef}
                          className={cn(
                            "w-full border-2 rounded-lg p-2 h-[260px] text-base focus:outline-none transition-colors bg-white placeholder:text-gray-400",
                            !campaignData.followUpEnabled && "opacity-50 cursor-not-allowed",
                            errors.followUpMessage ? "border-red-300 focus:border-red-500" : "border-gray-200"
                          )}
                          placeholder="Hi {{firstName}}, just wanted to follow up in case you missed my last message. Always happy to connect with fellow professionals!"
                          rows={6}
                          disabled={!campaignData.followUpEnabled || isSubmitting}
                          value={campaignData.followUpMessage}
                          onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, followUpMessage: e.target.value }))}
                        />
                        {errors.followUpMessage && (
                          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.followUpMessage}
                          </p>
                        )}
                        <div className="bg-blue-50 rounded-md px-3 py-1 mt-2 w-fit text-sm shadow-sm flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center justify-center font-semibold text-blue-700 text-sm focus:outline-none bg-transparent" title="Insert variable">
                                Variables
                                <svg className="ml-1 h-4 w-4 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(followUpMessageRef, "{{firstName}}", "followUpMessage")}>First Name</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(followUpMessageRef, "{{lastName}}", "followUpMessage")}>Last Name</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(followUpMessageRef, "{{company}}", "followUpMessage")}>Company</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      {/* Arrow between cards */}
                      <div className="hidden md:flex flex-col justify-center items-center mx-2">
                        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" className="text-gray-300"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      {/* Second Follow-up Message Card */}
                      <div className={cn(
                        "rounded-xl border border-gray-100 bg-white p-8 shadow-md flex flex-col min-w-[360px] max-w-[440px] min-h-[400px]",
                        !(campaignData.secondFollowUpEnabled && campaignData.followUpEnabled) && "opacity-60"
                      )}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900 text-base">Second Follow-up</span>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-8 h-5 rounded-full p-0.5 transition-colors cursor-pointer",
                                campaignData.secondFollowUpEnabled && campaignData.followUpEnabled ? "bg-[#0A66C2]" : "bg-gray-200"
                              )}
                              onClick={() => {
                                if (!campaignData.followUpEnabled) return;
                                setCampaignData((prev: CampaignData) => ({
                                  ...prev,
                                  secondFollowUpEnabled: !prev.secondFollowUpEnabled
                                }));
                              }}
                            >
                              <div className={cn(
                                "w-4 h-4 rounded-full bg-white transition-transform",
                                campaignData.secondFollowUpEnabled && campaignData.followUpEnabled ? "translate-x-3" : "translate-x-0"
                              )} />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                          <input
                            type="number"
                            min={0}
                            max={28}
                            value={campaignData.secondFollowUpDays}
                            onChange={e => setCampaignData(prev => ({ ...prev, secondFollowUpDays: parseInt(e.target.value) }))}
                            disabled={!(campaignData.secondFollowUpEnabled && campaignData.followUpEnabled) || isSubmitting}
                            className="w-12 px-1 py-0.5 text-center text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                            style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                          />
                          <span className="text-xs text-gray-700 mx-1">days</span>
                          <input
                            type="number"
                            min={0}
                            max={23}
                            value={campaignData.secondFollowUpHours}
                            onChange={e => setCampaignData(prev => ({ ...prev, secondFollowUpHours: parseInt(e.target.value) }))}
                            disabled={!(campaignData.secondFollowUpEnabled && campaignData.followUpEnabled) || isSubmitting}
                            className="w-12 px-1 py-0.5 text-center text-xs font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded focus:outline-none"
                            style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                          />
                          <span className="text-xs text-gray-700 mx-1">hours</span>
                          <span className="text-[11px] text-gray-500 whitespace-nowrap"> after first follow up.</span>
                        </div>
                        <div className="flex justify-end mb-2">
                          {/* Removed Variables dropdown/button above connection message textarea */}
                        </div>
                        <Textarea
                          ref={secondFollowUpMessageRef}
                          className={cn(
                            "w-full border-2 rounded-lg p-2 h-[260px] text-base focus:outline-none transition-colors bg-white placeholder:text-gray-400",
                            (!(campaignData.secondFollowUpEnabled && campaignData.followUpEnabled)) && "opacity-50 cursor-not-allowed",
                            errors.secondFollowUpMessage ? "border-red-300 focus:border-red-500" : "border-gray-200"
                          )}
                          placeholder="Hi {{firstName}}, reaching out one last time. If now isn't the right time, no worries at all—wishing you all the best!"
                          rows={6}
                          disabled={!(campaignData.secondFollowUpEnabled && campaignData.followUpEnabled) || isSubmitting}
                          value={campaignData.secondFollowUpMessage}
                          onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, secondFollowUpMessage: e.target.value }))}
                        />
                        {errors.secondFollowUpMessage && (
                          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.secondFollowUpMessage}
                          </p>
                        )}
                        <div className="bg-blue-50 rounded-md px-3 py-1 mt-2 w-fit text-sm shadow-sm flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center justify-center font-semibold text-blue-700 text-sm focus:outline-none bg-transparent" title="Insert variable">
                                Variables
                                <svg className="ml-1 h-4 w-4 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(secondFollowUpMessageRef, "{{firstName}}", "secondFollowUpMessage")}>First Name</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(secondFollowUpMessageRef, "{{lastName}}", "secondFollowUpMessage")}>Last Name</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => insertVariableAtCursor(secondFollowUpMessageRef, "{{company}}", "secondFollowUpMessage")}>Company</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8 pb-8">
                  <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                      {/* Campaign Name */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <Label className="font-outfit font-semibold text-gray-900 text-lg">Name your campaign</Label>
                            <p className="text-sm text-gray-500 font-outfit mt-1">Give your campaign a memorable name</p>
                          </div>
                          <div className="flex-shrink-0">
                            <Input
                              placeholder="e.g., Sales Outreach Q3"
                              className={cn(
                                "w-80 p-3 border-2 rounded-xl focus:outline-none transition-colors bg-white/50 placeholder:text-gray-400 text-base font-outfit",
                                errors.name
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-black"
                              )}
                              value={campaignData.name}
                              onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, name: e.target.value }))}
                              disabled={isSubmitting}
                            />
                            {errors.name && (
                              <p className="text-sm text-red-500 flex items-center gap-1 font-outfit mt-2">
                                <AlertCircle className="h-4 w-4" />
                                {errors.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Campaign Schedule */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <div className="flex-shrink-0">
                            <Label className="font-outfit font-semibold text-gray-900 text-lg">Campaign Schedule</Label>
                            <p className="text-sm text-gray-500 font-outfit mt-1">Set when your campaign should start and optionally when it should end</p>
                          </div>
                          <div className="flex-shrink-0 flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium text-gray-700">Start:</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="date"
                                  className="w-36 p-3 border-2 rounded-xl focus:outline-none transition-colors bg-white/50 border-gray-200 focus:border-black"
                                  value={campaignData.startDate || new Date().toLocaleDateString('en-CA')}
                                  min={new Date().toLocaleDateString('en-CA')}
                                  onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, startDate: e.target.value }))}
                                  disabled={isSubmitting}
                                />
                                <Input
                                  type="time"
                                  className="w-24 p-3 border-2 rounded-xl focus:outline-none transition-colors bg-white/50 border-gray-200 focus:border-black"
                                  value={campaignData.startTime || (() => {
                                    const now = new Date();
                                    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                  })()}
                                  onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, startTime: e.target.value }))}
                                  disabled={isSubmitting}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Label className="text-sm font-medium text-gray-700 w-10">End:</Label>
                              <div
                                className={cn(
                                  "w-10 h-6 rounded-full p-1 transition-colors cursor-pointer",
                                  campaignData.hasEndDate ? "bg-[#0A66C2]" : "bg-gray-200"
                                )}
                                onClick={() => setCampaignData((prev: CampaignData) => ({ ...prev, hasEndDate: !prev.hasEndDate }))}
                              >
                                <div className={cn(
                                  "w-4 h-4 rounded-full bg-white transition-transform",
                                  campaignData.hasEndDate ? "translate-x-4" : "translate-x-0"
                                )} />
                              </div>
                              {campaignData.hasEndDate ? (
                                <div className="flex gap-2">
                                  <Input
                                    type="date"
                                    className="w-36 p-3 border-2 rounded-xl focus:outline-none transition-colors bg-white/50 border-gray-200 focus:border-black"
                                    value={campaignData.endDate}
                                    min={campaignData.startDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, endDate: e.target.value }))}
                                    disabled={isSubmitting}
                                  />
                                  <Input
                                    type="time"
                                    className="w-24 p-3 border-2 rounded-xl focus:outline-none transition-colors bg-white/50 border-gray-200 focus:border-black"
                                    value={campaignData.endTime || '17:00'}
                                    onChange={(e) => setCampaignData((prev: CampaignData) => ({ ...prev, endTime: e.target.value }))}
                                    disabled={isSubmitting}
                                  />
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">No end date</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Campaign Summary */}
                      <div className="mb-6">
                        <h4 className="font-outfit font-semibold text-gray-900 text-lg mb-4">
                          Summary
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">Source</span>
                            <span className="text-black font-medium text-sm">
                              {campaignData.sourceType === "searchUrl" ? "LinkedIn Search" : campaignData.sourceType === "csv" ? "CSV Upload" : campaignData.sourceType === "likes" ? "Likes" : campaignData.sourceType === "comments" ? "Comments" : "Event"}
                            </span>
                          </div>
                          <div className="flex justify-between items-start py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">
                              {campaignData.sourceType === "likes" || campaignData.sourceType === "comments" ? "Post URL" : "Keywords"}
                            </span>
                            <div className="flex flex-col items-end gap-1 max-w-[250px]">
                              {(() => {
                                try {
                                  if (campaignData.sourceType === "likes" || campaignData.sourceType === "comments") {
                                    // For likes/comments, show the LinkedIn post URL in a compact format
                                    if (!campaignData.searchUrl) return <span className="text-gray-400 text-sm">Not set</span>;
                                    
                                    const url = campaignData.searchUrl;
                                    const displayText = formatUrlForDisplay(url, 40);
                                    
                                    return (
                                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-full">
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="truncate text-[#0A66C2] text-sm hover:underline flex-1"
                                          title={url}
                                        >
                                          {displayText}
                                        </a>
                                        <button
                                          type="button"
                                          className="ml-1 text-gray-400 hover:text-[#0A66C2] focus:outline-none"
                                          onClick={() => {
                                            navigator.clipboard.writeText(url);
                                          }}
                                          title="Copy URL"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                          </svg>
                                        </button>
                                        <a
                                          href={url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="ml-1 text-gray-400 hover:text-[#0A66C2]"
                                          title="Open in new tab"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                            <polyline points="15 3 21 3 21 9"/>
                                            <line x1="10" y1="14" x2="21" y2="3"/>
                                          </svg>
                                        </a>
                                      </div>
                                    );
                                  } else if (campaignData.searchUrl && campaignData.searchUrl.includes("keywords=")) {
                                    // For search URLs, extract and show keywords
                                    const parts = campaignData.searchUrl.split("keywords=");
                                    if (parts[1]) {
                                      const keywordParam = parts[1].split("&")[0] || "Not set";
                                      const decoded = decodeURIComponent(keywordParam.replace(/\+/g, ' '));
                                      return <span className="text-black font-medium text-sm">{decoded || "Not set"}</span>;
                                    }
                                  }
                                  return <span className="text-gray-400 text-sm">Not set</span>;
                                } catch (e) {
                                  console.error("Error parsing searchUrl", e);
                                  return <span className="text-gray-400 text-sm">Not set</span>;
                                }
                              })()}
                            </div>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">Prospects to import</span>
                            <span className="text-black font-semibold text-sm">{campaignData.importLimit}</span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">Connection message</span>
                            <span className="text-black font-medium text-sm">
                              {campaignData.connectionMessageEnabled ? (campaignData.connectionMessage ? 'Set' : 'Not set') : 'Disabled'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">First follow-up</span>
                            <span className="text-black font-medium text-sm">
                              {campaignData.followUpEnabled
                                ? `${campaignData.followUpMessage ? 'Set' : 'Not set'} (${campaignData.followUpDays} days)`
                                : 'Disabled'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="text-gray-600 text-sm">Second follow-up</span>
                            <span className="text-black font-medium text-sm">
                              {campaignData.secondFollowUpEnabled && campaignData.followUpEnabled
                                ? `${campaignData.secondFollowUpMessage ? 'Set' : 'Not set'} (${campaignData.secondFollowUpDays} days)`
                                : 'Disabled'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600 text-sm">Campaign schedule</span>
                            <span className="text-black font-medium text-sm">
                              {campaignData.startDate ? (() => {
                                const [year, month, day] = campaignData.startDate.split('-');
                                const formattedDate = `${month}/${day}/${year}`;
                                const time = campaignData.startTime || (() => {
                                  const now = new Date();
                                  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                })();
                                const [hours, minutes] = time.split(':');
                                const hour = parseInt(hours);
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                const formattedTime = `${displayHour}:${minutes} ${ampm}`;
                                return `${formattedDate} at ${formattedTime}`;
                              })() : 'Not set'}
                              {campaignData.hasEndDate && campaignData.endDate ? ` to ${(() => {
                                const [year, month, day] = campaignData.endDate.split('-');
                                const formattedDate = `${month}/${day}/${year}`;
                                const time = campaignData.endTime || '17:00';
                                const [hours, minutes] = time.split(':');
                                const hour = parseInt(hours);
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                const formattedTime = `${displayHour}:${minutes} ${ampm}`;
                                return `${formattedDate} at ${formattedTime}`;
                              })()}` : ' - ongoing'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step Navigation - Fixed at bottom */}
          <div className="px-8 py-6 bg-white">
          {Object.values(errors).some(Boolean) && (
  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-start gap-2">
    <AlertCircle className="h-5 w-5 mt-1" />
    <div>
      <p className="font-medium">Please address the following issues:</p>
      <ul className="list-disc list-inside text-sm">
        {Object.entries(errors).map(([field, error]) =>
          error ? <li key={field}>{error}</li> : null
        )}
      </ul>
    </div>
  </div>
)}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
                className={cn(
                  "px-4 py-2 rounded-xl border font-medium transition-all font-outfit flex items-center gap-2 text-sm border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50",
                  isFirstStep || isSubmitting
                    ? "border-gray-200 text-gray-400 cursor-not-allowed"
                    : ""
                )}
                disabled={isFirstStep || isSubmitting}
              >
                ← Back
              </button>

              <button
                onClick={handleSubmit}
                className={cn(
                  "px-4 py-2 rounded-xl border-none font-medium transition-all font-outfit flex items-center gap-2 shadow-md text-sm",
                  isSubmitting || !isStepValid
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#0A66C2] hover:bg-[#084d99] text-white cursor-pointer"
                )}
                disabled={isSubmitting || !isStepValid}
              >
                {isLastStep ? (isSubmitting ? "Creating Campaign..." : "Create Campaign →") : "Next Step →"}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
}
