"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

import { signInAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState<{ error?: string; success?: string }>({});
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await signInAction(formData);

      if ("error" in result) {
        setFormState({ error: result.error });
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

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 bg-white">
      <div className="w-full max-w-[28rem] px-4">
        <div className="text-center mb-6">
          <h1 className="font-recoleta text-2xl md:text-3xl font-black text-black mb-2">Welcome Back</h1>
          <p className="font-outfit font-light text-black/70 text-lg sm:text-xl">Sign in to keep your outreach running safely on LinkedIn.</p>
        </div>

        <Card className="border border-black/10 bg-white rounded-xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-outfit text-black/70">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="border-2 text-sm bg-white/50 h-10 rounded-lg focus:border-black transition-colors"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-xs text-destructive font-outfit">{errors.email.message}</span>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between w-full">
                  <Label htmlFor="password" className="text-sm font-outfit text-black/70">
                    Password
                  </Label>
                  <Link
                    className="text-sm font-outfit text-black hover:opacity-70 transition-opacity"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="border-2 pr-12 text-sm bg-white/50 h-10 rounded-lg focus:border-black transition-colors"
                    {...register("password")}
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

              {(formState.error || formState.success || errors.root) && (
                <div className="animate-in slide-in-from-top duration-300">
                  <FormMessage
                    message={{
                      error: formState.error || errors.root?.message,
                      success: formState.success,
                    }}
                  />
                </div>
              )}

              <SubmitButton 
                pendingText="Signing in..." 
                disabled={isSubmitting}
                className="h-10 text-sm font-outfit bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 rounded-lg transition-all duration-300"
              >
                Sign in
              </SubmitButton>

              <div className="text-center text-sm font-outfit text-black/70">
                Don't have an account?{" "}
                <Link 
                  href="/sign-up" 
                  className="font-semibold text-black hover:opacity-70 transition-opacity"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
