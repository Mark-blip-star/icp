"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, Upload, Send, Info } from "lucide-react";

const formSchema = z.object({
  linkedinUrl: z.string().url("Please enter a valid LinkedIn search URL").min(1, "URL is required"),
  connectionMessage: z.string().max(300, "Connection message must be under 300 characters"),
  followUpMessage: z.string().max(2000, "Follow-up message must be under 2000 characters"),
  followUpDays: z.number().int().min(1).max(30),
  linkedinCredentials: z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
  dailyLimit: z.number().int().min(1).max(50),
  humanLikeScrolling: z.boolean().default(true),
  randomDelays: z.boolean().default(true),
});

export type LinkedInBatchFormValues = z.infer<typeof formSchema>;

export function LinkedInBatchForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<LinkedInBatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linkedinUrl: "",
      connectionMessage: "Hi {{firstName}}, I noticed we're in the same industry and thought we could connect.",
      followUpMessage: "Hi {{firstName}}, thanks for connecting! I wanted to reach out about...",
      followUpDays: 3,
      linkedinCredentials: {
        email: "",
        password: "",
      },
      dailyLimit: 20,
      humanLikeScrolling: true,
      randomDelays: true,
    },
  });

  async function onSubmit(values: LinkedInBatchFormValues) {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would send a request to the API
      const response = await fetch("/api/scale/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error("Failed to start automation");
      }
      
      // Show success message or redirect
      alert("LinkedIn automation started successfully!");
    } catch (error) {
      console.error("Error starting automation:", error);
      alert("Failed to start automation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Connection Campaign</CardTitle>
            <CardDescription>
              Import LinkedIn profiles from a search URL and automate connection requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>LinkedIn Search URL</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input placeholder="https://www.linkedin.com/search/results/people/?..." {...field} />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Go to LinkedIn, perform your search, and copy the URL from your browser.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Paste the full LinkedIn search results URL
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="connectionMessage"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Connection Request Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Hi {{firstName}}, I noticed we're in the same industry and thought we could connect."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{'}{'{'} firstName {'}'}{'}'} to include the person's first name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="followUpMessage"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Follow-up Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Hi {{firstName}}, thanks for connecting! I wanted to reach out about..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Sent automatically after connection is accepted
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="followUpDays"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Days to Wait Before Follow-up</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={1} 
                      max={30}
                      {...field}
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Number of days to wait after connection is accepted
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Settings
              </Button>
            </div>

            {showAdvanced && (
              <div className="border rounded-lg p-4 space-y-4 mt-4">
                <h3 className="font-medium">LinkedIn Account</h3>
                
                <FormField
                  control={form.control}
                  name="linkedinCredentials.email"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your-email@example.com"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinCredentials.password"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dailyLimit"
                  render={({ field }: { field: any }) => (
                    <FormItem>
                      <FormLabel>Daily Connection Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={50}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Maximum number of connection requests per day (recommended: 15-25)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <h3 className="font-medium mb-2">Safety Settings</h3>
                  
                  <FormField
                    control={form.control}
                    name="humanLikeScrolling"
                    render={({ field }: { field: any }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Enable human-like scrolling
                          </FormLabel>
                          <FormDescription>
                            Mimics natural scrolling behavior to reduce detection risk
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="randomDelays"
                    render={({ field }: { field: any }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Add random delays between actions
                          </FormLabel>
                          <FormDescription>
                            Makes automation appear more natural
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting ? "Starting Automation..." : "Start LinkedIn Campaign"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
} 