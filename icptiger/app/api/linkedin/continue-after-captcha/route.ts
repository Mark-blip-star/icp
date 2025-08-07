import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Continue after captcha API called");

    const { token, captchaData, sessionId } = await request.json();

    if (!token) {
      console.log("❌ Missing captcha token");
      return NextResponse.json({ error: "Captcha token is required" }, { status: 400 });
    }

    console.log("✅ Captcha token received:", token.substring(0, 20) + "...");

    // Get the browser session from global storage
    const browserSessions = (global as any).browserSessions;
    if (!browserSessions || !browserSessions.has(sessionId)) {
      console.log("❌ Browser session not found for sessionId:", sessionId);
      return NextResponse.json(
        { error: "Browser session not found. Please restart the login process." },
        { status: 400 },
      );
    }

    const session = browserSessions.get(sessionId);
    const { browser, page, currentUrl } = session;

    if (!browser || !page || page.isClosed()) {
      console.log("❌ Browser or page is closed");
      return NextResponse.json(
        { error: "Browser session is closed. Please restart the login process." },
        { status: 400 },
      );
    }

    console.log("🔍 Current URL:", currentUrl);

    try {
      // Check if this is a simulated/manual token
      if (token.startsWith("linkedin-captcha-") || token.startsWith("manual-captcha-")) {
        console.log("🎯 Simulated/manual captcha token detected, skipping form submission");

        // For simulated tokens, we'll just wait and check if we're logged in
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const currentUrl = page.url();
        console.log("🔍 Current URL after simulated captcha:", currentUrl);

        const isLoggedIn =
          currentUrl.includes("/feed") ||
          currentUrl.includes("/mynetwork") ||
          currentUrl.includes("/jobs") ||
          currentUrl.includes("/messaging") ||
          currentUrl.includes("/notifications");

        if (isLoggedIn) {
          console.log("✅ Login successful after simulated captcha!");

          // Extract cookies
          const cookies = await page.cookies();
          const liAt = cookies.find((cookie) => cookie.name === "li_at");
          const liA = cookies.find((cookie) => cookie.name === "li_a");

          if (liAt) {
            console.log("✅ Found li_at cookie after simulated captcha");
            console.log(
              "🔐 li_at cookie value (first 20 chars):",
              liAt.value.substring(0, 20) + "...",
            );

            // Close browser session
            await browser.close();
            browserSessions.delete(sessionId);

            return NextResponse.json({
              status: "success",
              message: "Login successful after captcha verification",
              cookies: {
                li_at: liAt.value,
                li_a: liA?.value || null,
              },
            });
          } else {
            console.log("❌ No li_at cookie found after simulated captcha");
            return NextResponse.json(
              {
                status: "failed",
                message: "Login successful but no authentication cookies found",
              },
              { status: 400 },
            );
          }
        } else {
          console.log("❌ Still not logged in after simulated captcha");
          return NextResponse.json(
            {
              status: "failed",
              message: "Login failed after captcha submission. Please try again.",
            },
            { status: 400 },
          );
        }
      }

      // Submit the captcha token to LinkedIn
      console.log("📝 Submitting captcha token to LinkedIn...");

      // Find the captcha form and submit the token
      const submitResult = await page.evaluate(
        (token, captchaData) => {
          try {
            // Find the captcha form
            const form =
              document.querySelector('form[action*="verify"]') ||
              document.querySelector("#captcha-challenge") ||
              document.querySelector("form");

            if (!form) {
              console.log("❌ Captcha form not found");
              return { success: false, error: "Captcha form not found" };
            }

            // Find the token input field
            const tokenInput =
              form.querySelector('input[name="captchaUserResponseToken"]') ||
              form.querySelector('input[name="fc-token"]') ||
              form.querySelector('input[name="verification-token"]');

            if (tokenInput) {
              (tokenInput as HTMLInputElement).value = token;
              console.log("✅ Token set in input field");
            } else {
              console.log("⚠️ Token input field not found, creating one");
              const hiddenInput = document.createElement("input");
              hiddenInput.type = "hidden";
              hiddenInput.name = "captchaUserResponseToken";
              hiddenInput.value = token;
              form.appendChild(hiddenInput);
            }

            // Set other required fields if they exist
            if (captchaData.captchaSiteKey) {
              const siteKeyInput = form.querySelector('input[name="captchaSiteKey"]');
              if (siteKeyInput) {
                (siteKeyInput as HTMLInputElement).value = captchaData.captchaSiteKey;
              }
            }

            if (captchaData.challengeId) {
              const challengeInput = form.querySelector('input[name="challengeId"]');
              if (challengeInput) {
                (challengeInput as HTMLInputElement).value = captchaData.challengeId;
              }
            }

            if (captchaData.csrfToken) {
              const csrfInput = form.querySelector('input[name="csrfToken"]');
              if (csrfInput) {
                (csrfInput as HTMLInputElement).value = captchaData.csrfToken;
              }
            }

            // Submit the form
            console.log("📤 Submitting form...");
            (form as HTMLFormElement).submit();

            return { success: true };
          } catch (error) {
            console.log("❌ Error submitting captcha:", error);
            return { success: false, error: error.message };
          }
        },
        token,
        captchaData,
      );

      if (!submitResult.success) {
        console.log("❌ Failed to submit captcha:", submitResult.error);
        return NextResponse.json(
          { error: `Failed to submit captcha: ${submitResult.error}` },
          { status: 400 },
        );
      }

      console.log("✅ Captcha form submitted successfully");

      // Wait for navigation
      console.log("⏳ Waiting for page navigation after captcha submission...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Check if login was successful
      const newUrl = page.url();
      console.log("🔍 New URL after captcha submission:", newUrl);

      const isLoggedIn =
        newUrl.includes("/feed") ||
        newUrl.includes("/mynetwork") ||
        newUrl.includes("/jobs") ||
        newUrl.includes("/messaging") ||
        newUrl.includes("/notifications");

      if (isLoggedIn) {
        console.log("✅ Login successful after captcha!");

        // Extract cookies
        const cookies = await page.cookies();
        const liAt = cookies.find((cookie) => cookie.name === "li_at");
        const liA = cookies.find((cookie) => cookie.name === "li_a");

        if (liAt) {
          console.log("✅ Found li_at cookie after captcha");
          console.log(
            "🔐 li_at cookie value (first 20 chars):",
            liAt.value.substring(0, 20) + "...",
          );

          // Close browser session
          await browser.close();
          browserSessions.delete(sessionId);

          return NextResponse.json({
            status: "success",
            message: "Login successful after captcha verification",
            cookies: {
              li_at: liAt.value,
              li_a: liA?.value || null,
            },
          });
        } else {
          console.log("❌ No li_at cookie found after captcha");
          return NextResponse.json(
            {
              status: "failed",
              message: "Login successful but no authentication cookies found",
            },
            { status: 400 },
          );
        }
      } else {
        console.log("❌ Still not logged in after captcha submission");

        // Check for additional verification required
        const verificationText = await page.evaluate(() => {
          const bodyText = document.body.innerText.toLowerCase();
          return (
            bodyText.includes("verification") ||
            bodyText.includes("phone") ||
            bodyText.includes("sms") ||
            bodyText.includes("code")
          );
        });

        if (verificationText) {
          console.log("📱 Additional verification required");
          return NextResponse.json(
            {
              status: "verification_required",
              message:
                "Additional verification required. Please complete verification and try again.",
            },
            { status: 400 },
          );
        }

        // Save screenshot for debugging
        try {
          await page.screenshot({ path: "./linkedin-after-captcha.png", fullPage: true });
          console.log("📸 Screenshot saved as linkedin-after-captcha.png");
        } catch (screenshotError) {
          console.log("⚠️ Could not save screenshot:", screenshotError);
        }

        return NextResponse.json(
          {
            status: "failed",
            message: "Login failed after captcha submission. Please try again.",
          },
          { status: 400 },
        );
      }
    } catch (error) {
      console.error("❌ Error during captcha submission:", error);
      return NextResponse.json(
        {
          status: "failed",
          message: "Error during captcha submission. Please try again.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Error in continue after captcha endpoint:", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Internal server error. Please try again.",
      },
      { status: 500 },
    );
  }
}
