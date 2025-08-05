"use client";

import { Eye, EyeOff, Quote } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Suspense } from "react";

import { signUpAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { useState } from "react";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  inviteCode: z.string().min(1, "Invite code is required"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

function SignUpFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromQuery =
    typeof searchParams.get("email") === "string" ? searchParams.get("email")! : "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: emailFromQuery,
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await signUpAction(formData);

      if (result.error) {
        setError("root", {
          message: result.error,
        });
        return;
      }

      // Navigate after successful submission
      if (result.data) {
        router.push(`/otp?email=${encodeURIComponent(result.data.email)}`);
      }
    } catch (error) {
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 bg-white">
      <div className="w-full max-w-[28rem] px-4">
        <div className="text-center mb-6">
          <h1 className="font-recoleta text-2xl md:text-3xl font-black text-black mb-2">You've Been Invited to <span className="text-[#0A66C2]">Tiger</span></h1>
          <p className="font-outfit font-light text-black/70 text-lg sm:text-xl">Automate outreach on LinkedIn: safely, quietly, and without the manual grind.</p>
        </div>

        <Card className="border border-black/10 bg-white rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-outfit text-black/70">
                    First Name
                  </Label>
                  <Input
                    {...register("firstName")}
                    placeholder="Enter first name"
                    className="border-2 text-sm bg-white/50 h-10 rounded-lg focus:border-black transition-colors"
                  />
                  {errors.firstName && (
                    <span className="text-xs text-destructive font-outfit">{errors.firstName.message}</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-outfit text-black/70">
                    Last Name
                  </Label>
                  <Input 
                    {...register("lastName")} 
                    placeholder="Enter last name" 
                    className="border-2 text-sm bg-white/50 h-10 rounded-lg focus:border-black transition-colors" 
                  />
                  {errors.lastName && (
                    <span className="text-xs text-destructive font-outfit">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-outfit text-black/70">
                  Email
                </Label>
                <Input
                  {...register("email")}
                  placeholder="you@example.com"
                  className="border-2 text-sm bg-white/50 h-10 rounded-lg focus:border-black transition-colors"
                />
                {errors.email && (
                  <span className="text-xs text-destructive font-outfit">{errors.email.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-outfit text-black/70">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="border-2 pr-12 text-sm bg-white/50 h-10 rounded-lg focus:border-black transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 px-3 h-full hover:bg-transparent"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-black hover:opacity-70 transition-opacity" />
                    ) : (
                      <Eye className="h-4 w-4 text-black hover:opacity-70 transition-opacity" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <span className="text-xs text-destructive font-outfit">{errors.password.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="inviteCode" className="text-sm font-outfit text-black/70">
                  Invite Code
                </Label>
                <Input
                  {...register("inviteCode")}
                  placeholder="Enter invite code"
                  className="border-2 text-sm bg-white/50 h-10 rounded-lg focus:border-black transition-colors"
                />
                {errors.inviteCode && (
                  <span className="text-xs text-destructive font-outfit">{errors.inviteCode.message}</span>
                )}
              </div>

              {errors.root && (
                <div className="animate-in slide-in-from-top duration-300">
                  <FormMessage message={{ error: errors.root.message }} />
                </div>
              )}

              <SubmitButton 
                pendingText="Accepting invite..." 
                disabled={isSubmitting}
                className="h-10 text-sm font-outfit bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-lg transition-all duration-300"
              >
                Join with Invite
              </SubmitButton>



              <div className="text-center text-sm font-outfit text-black/70">
                Already have an account?{" "}
                <Link href="/sign-in" className="font-semibold text-black hover:opacity-70 transition-opacity">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignUpForm() {
  return (
    <Suspense>
      <SignUpFormContent />
    </Suspense>
  );
}
