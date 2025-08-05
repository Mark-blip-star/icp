"use client";

import { verifyOtpAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Suspense } from "react";
import Link from "next/link";

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

function OtpVerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [formState, setFormState] = useState<{ success?: string; error?: string }>({});
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email || "",
      otp: "",
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Update form value
    const otpString = newOtp.join("");
    setValue("otp", otpString);
    
    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setValue("otp", pastedData);
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await verifyOtpAction(formData);

      if (result.error) {
        setError("root", {
          message: result.error,
        });
        return;
      }

      if (result.success) {
        setFormState({ success: result.message });
        router.push("/dashboard");
      }
    } catch (error) {
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const handleResendOtp = () => {
    // Implement the logic to resend OTP
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-[#0A66C2]/5">
      <div className="w-full max-w-[28rem] px-4">
        <div className="text-center mb-6">
          <h1 className="font-recoleta text-2xl md:text-3xl font-black text-black mb-2">
            Email Verification
          </h1>
          <p className="font-outfit font-light text-black/70 text-lg sm:text-xl">
            Enter the 6-digit code sent to your email
          </p>
        </div>
        <Card className="border border-black/10 bg-white rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <input type="hidden" {...register("email")} />
              <div className="space-y-2">
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 h-10 text-base font-semibold text-center border-2 border-gray-300 text-black rounded-lg focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20 transition-all duration-200 bg-white shadow-sm outline-none"
                      style={{ caretColor: 'transparent' }}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <span className="text-xs text-destructive font-outfit text-center block">{errors.otp.message}</span>
                )}
              </div>
              {errors.root && (
                <div className="animate-in slide-in-from-top duration-300">
                  <FormMessage message={{ error: errors.root.message }} />
                </div>
              )}
              <SubmitButton 
                pendingText="Verifying..." 
                disabled={isSubmitting}
                className="h-10 text-sm font-outfit bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-lg transition-all duration-300"
              >
                Verify Email
              </SubmitButton>
              <div className="text-center text-sm font-outfit text-black/70">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-semibold text-black hover:opacity-70 transition-opacity"
                >
                  Resend
                </button>
              </div>
              <div className="flex justify-center gap-2 text-xs font-outfit text-black/70">
                <Link href="/terms" className="hover:opacity-70 transition-opacity">
                  Terms & Conditions
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:opacity-70 transition-opacity">
                  Privacy Policy
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function OtpVerificationForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerificationContent />
    </Suspense>
  );
}
