import { NextResponse } from "next/server";
import { SubscriptionValidator } from "@/app/api/validators/subscriptionValidator";
import { UserRepository } from "@/app/api/repositories/user";

export async function GET(request: Request) {
  try {
    const userRepo = new UserRepository();
    const user = await userRepo.getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check subscription status
    const isSubscribed = await userRepo.isSubscribed();

    // Check monthly import limits
    const importStatus = await SubscriptionValidator.checkMonthlyImportLimit(user.id);

    if (!importStatus) {
      console.error("Import status check returned undefined");
          return NextResponse.json({ 
      error: "Failed to check import status",
      isSubscribed: false,
      remainingImports: 0
    }, { status: 500 });
    }

    return NextResponse.json({
      isSubscribed,
      remainingImports: importStatus.remainingImports,
      error: importStatus.error
    });
  } catch (error) {
    console.error("Error checking import status:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json({ 
      error: "Internal server error",
      isSubscribed: false,
      remainingImports: 0
    }, { status: 500 });
  }
} 