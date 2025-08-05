"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { LoadingSpinner } from "@/components/ui/loading";

interface WaitlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WaitlistPopup({ isOpen, onClose }: WaitlistPopupProps) {
  const [email, setEmail] = useState("");
  const [useCase, setUseCase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !useCase.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          useCase: useCase.trim(),
          source: 'popup'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join waitlist');
      }

      setIsSubmitted(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setEmail("");
        setUseCase("");
      }, 3000);
    } catch (error) {
      console.error("Waitlist signup failed:", error);
      // You could add error state here to show user-friendly error messages
      alert(error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setEmail("");
    setUseCase("");
  };

  const isFormValid = email && useCase.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg border-none bg-white rounded-3xl p-0 overflow-hidden shadow-2xl [&>button]:hidden">
        {!isSubmitted ? (
          <>
            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#0A66C2] via-[#0A66C2]/95 to-[#0A66C2]/85 p-8 relative overflow-hidden">
              <div className="relative z-10 text-center">
                <DialogHeader>
                  <DialogTitle className="font-recoleta text-3xl md:text-4xl font-bold text-center mb-2 text-white leading-tight tracking-tight">
                    cold outbound is the last form of <span className="font-black">permissionless distribution</span>.
                  </DialogTitle>
                </DialogHeader>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="waitlist-email" className="font-outfit text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="waitlist-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="waitlist-email-input border-2 border-gray-200 text-base bg-white h-14 rounded-2xl focus:border-[#0A66C2] focus:ring-0 focus-visible:ring-0 !focus-visible:ring-0 outline-none transition-all duration-200 font-outfit"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="use-case" className="font-outfit text-sm font-medium text-gray-700">
                    How will you use Tiger?
                  </Label>
                  <textarea
                    id="use-case"
                    placeholder="Tell us about your goals... e.g., generate leads, find investors, recruit developers, etc."
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="w-full border-2 border-gray-200 text-base bg-white rounded-2xl focus:border-[#0A66C2] focus:ring-0 outline-none transition-all duration-200 resize-none font-outfit px-4 py-4 min-h-[100px]"
                    rows={3}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="w-full h-14 text-base font-outfit bg-gradient-to-r from-[#0A66C2] to-[#0A66C2]/90 text-white hover:from-[#0A66C2]/90 hover:to-[#0A66C2] rounded-2xl transition-all duration-300 border-none disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-semibold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" color="white" />
                      <span>Joining waitlist...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      Join the Waitlist
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs font-outfit text-gray-500">
                  <span>🐅 9/20 accepted this month</span>
                </div>
                
                <p className="text-xs font-outfit text-gray-400 text-center">
                  We review all submissions manually. Expect a response within 48h.
                </p>
              </form>
            </div>
          </>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-recoleta text-3xl font-bold mb-4 text-gray-900">You're on the list!</h3>
            <p className="font-outfit text-gray-600 text-lg">
              We'll send you an invite as soon as spots become available.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 