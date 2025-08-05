"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from '@supabase/supabase-js';

const ensureLinkedInSettings = async (userId: string, supabase: any) => {
  const { data: existing, error } = await supabase
    .from("linkedin_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();  // Avoids raising an error for 0 rows

  if (error && error.code !== "PGRST116") {
    console.error("Error checking LinkedIn settings:", error.message);
    return;
  }

  if (!existing) {
    const { error: insertError } = await supabase
      .from("linkedin_settings")
      .insert([
        {
          user_id: userId,
          max_message_per_day: 50,
          max_connections_per_day: 30,
          total_visits_per_day : 100
        },
      ]);

    if (insertError) {
      console.error("Error inserting default LinkedIn settings:", insertError.message);
    }
  }
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const inviteCode = formData.get("inviteCode")?.toString();

  // Validate invite code
  const VALID_INVITE_CODE = "TIGER2024"; // Hardcoded invite code
  if (!inviteCode || inviteCode !== VALID_INVITE_CODE) {
    return { error: "Invalid invite code" };
  }

  // Test Supabase connection
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('profiles').select('count').single();
    if (error && error.code !== 'PGRST116') {
      console.error("Database connection error:", error.message);
      return { error: "Unable to connect to the database. Please try again later." };
    }
  } catch (e) {
    console.error("Database connection error:", e);
    return { error: "Unable to connect to the database. Please try again later." };
  }

  const supabase = await createClient();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {    
    // First, check if a profile already exists for this email
    const { data: existingProfile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking existing profile:", profileError.message);
      return { error: "Error checking existing profile" };
    }

    if (existingProfile) {
      return { error: "This email may already be in use" };
    }

    // Attempt to sign up the user with metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
      },
    });

    if (error) {
      console.error("Sign up error:", error.message);
      return { error: "Failed to create account. Please try again." };
    }

    if (!data?.user) {
      console.error("No user data returned from signup");
      return { error: "Failed to create user" };
    }

    if (data.user?.identities?.length === 0) {
      return { error: "This email may already be in use" };
    }

    // Wait a short moment to allow the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try to create the profile manually if it doesn't exist
    const { data: profile, error: profileCheckError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileCheckError || !profile) {      
      // Try to create the profile
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
          },
        ])
        .select()
        .single();

      if (insertError) {
        console.error("Profile creation error:", insertError.message);
        return { error: "Failed to create user profile" };
      }
    }

    if (data.user?.id) {
      await ensureLinkedInSettings(data.user.id, supabase);
    }

    return {
      success: true,
      message: "Sign up successful! Please check your email.",
      data: { email },
    };
  } catch (error) {
    console.error("Unexpected error during sign up:", error instanceof Error ? error.message : error);
    return { error: "An unexpected error occurred during sign up" };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error.message);
    return { error: "Invalid email or password" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (user?.id) {
    await ensureLinkedInSettings(user.id, supabase);
  }

  return {
    success: true,
    message: "Sign in successful!",
  };
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/api/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return { error: "Failed to send reset email. Please try again." };
  }

  return {
    success: true,
    message: "Check your email for a link to reset your password.",
  };
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Password and confirm password are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    console.error(error.message);
    return { error: "Failed to reset password. Please try again." };
  }

  return {
    success: true,
    message: "Password has been reset successfully.",
  };
};

export const verifyOtpAction = async (formData: FormData) => {
  const otp = formData.get("otp")?.toString();
  const email = formData.get("email")?.toString();
  const supabase = await createClient();

  if (!otp || !email) {
    return { error: "OTP and email are required" };
  }

  const { error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  if (error) {
    console.error(error.message);
    return { error: "Invalid verification code. Please try again." };
  }

  return {
    success: true,
    message: "Account created successfully",
    data: { email },
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const signOutUser = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};

export const isUserAuthenticated = async () => {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    
    if (user?.id) {
      await ensureLinkedInSettings(user.id, supabase);
    }
  
    return user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
}