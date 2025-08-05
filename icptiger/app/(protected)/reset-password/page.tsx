"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { resetPasswordAction } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const [formState, setFormState] = useState<{ error?: string; success?: string }>({});
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      const formData = new FormData();
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);

      const result = await resetPasswordAction(formData);

      if ("error" in result) {
        setFormState({ error: result.error });
        return;
      }

      if (result.success) {
        setFormState({ success: result.message });
        // Redirect to sign in after successful password reset
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full max-w-[26rem] mx-auto border-2 shadow-retro-right">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="text-center">
            <h1 className="font-riffic-free text-4xl md:text-5xl font-black mb-2">
              Reset password
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Please enter your new password below.
            </p>
          </div>

          {(formState.error || formState.success) && (
            <div className="animate-in slide-in-from-top duration-300">
              <FormMessage message={formState} />
            </div>
          )}

          <div className="space-y-1 w-full">
            <Label htmlFor="password" className="text-xs">
              New password
            </Label>
            <Input
              id="password"
              type="password"
              className="border-2 text-base"
              placeholder="New password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1 w-full">
            <Label htmlFor="confirmPassword" className="text-xs">
              Confirm password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="border-2 text-base"
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <SubmitButton pendingText="Resetting Password..." disabled={isSubmitting}>
            Reset password
          </SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
