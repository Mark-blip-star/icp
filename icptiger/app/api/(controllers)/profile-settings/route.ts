import { NextRequest, NextResponse } from "next/server";
import { SettingsService } from "@/app/api/services/settings";

interface UpdateSettingsRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
}

export async function PATCH(request: NextRequest) {
  try {
    // Get current user

    // Update settings using service
    const settingsService = new SettingsService();
    const body = await request.json();
    const updatedSettings = await settingsService.updateSettings(body);

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: {
        first_name: updatedSettings?.user_metadata.first_name,
        last_name: updatedSettings?.user_metadata.last_name,
      },
    });
  } catch (error) {
    console.error("Error updating settings:", error);

    // Handle validation errors separately
    if (error instanceof Error) {
      return NextResponse.json({ error: "Failed to update profile settings" }, { status: 400 });
    }

    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
} 