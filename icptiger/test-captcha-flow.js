// Test script for complete captcha flow
// This file tests the full captcha handling process

const puppeteer = require("puppeteer");

async function testCaptchaFlow() {
  console.log("🧪 Testing complete captcha flow...");

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-web-security",
    ],
  });

  const page = await browser.newPage();

  // Set user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  try {
    // Navigate to LinkedIn login
    console.log("🌐 Navigating to LinkedIn login...");
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Fill in test credentials (you'll need to provide real ones)
    console.log("📝 Filling in credentials...");
    await page.type("#username", "test@example.com");
    await page.type("#password", "testpassword");

    // Click login button
    console.log("🔑 Clicking login button...");
    await page.click('button[type="submit"]');

    // Wait for navigation
    console.log("⏳ Waiting for navigation...");
    await new Promise((resolve) => setTimeout(resolve, 8000));

    // Check if captcha appeared
    const currentUrl = page.url();
    console.log("🔍 Current URL:", currentUrl);

    const captchaPatterns = ["captcha", "challenge", "verify", "puzzle", "security-check"];
    const hasCaptchaUrl = captchaPatterns.some((pattern) =>
      currentUrl.toLowerCase().includes(pattern),
    );

    if (hasCaptchaUrl) {
      console.log("🎯 CAPTCHA DETECTED! Testing full flow...");

      // Wait for iframe to load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Extract captcha data (simulating what the API would do)
      const captchaData = await page.evaluate(() => {
        try {
          // Find Arkose Labs iframe
          const arkoseIframe =
            document.querySelector('iframe[src*="arkoselabs"]') ||
            document.querySelector('iframe[src*="client-api.arkoselabs"]') ||
            document.querySelector('iframe[src*="arkose"]') ||
            document.querySelector('iframe[src*="funcaptcha"]');

          if (!arkoseIframe) {
            console.log("❌ Arkose Labs iframe not found");
            return null;
          }

          console.log("✅ Found Arkose Labs iframe");

          // Extract form data
          const form =
            document.querySelector('form[action*="verify"]') ||
            document.querySelector("#captcha-challenge") ||
            document.querySelector("form");

          const formData = {};
          if (form) {
            const inputs = form.querySelectorAll("input");
            inputs.forEach((input) => {
              formData[input.name] = input.value;
            });
          }

          // Extract captcha site key
          const siteKeyInput = document.querySelector('input[name="captchaSiteKey"]');
          const captchaSiteKey = siteKeyInput ? siteKeyInput.value : null;

          // Extract challenge ID
          const challengeInput = document.querySelector('input[name="challengeId"]');
          const challengeId = challengeInput ? challengeInput.value : null;

          // Extract CSRF token
          const csrfInput = document.querySelector('input[name="csrfToken"]');
          const csrfToken = csrfInput ? csrfInput.value : null;

          return {
            type: "linkedin",
            captchaSiteKey,
            challengeId,
            csrfToken,
            formData,
            iframeSrc: arkoseIframe.src,
            pageTitle: document.title,
            pageContent: document.body.innerText.substring(0, 500),
          };
        } catch (error) {
          console.log("❌ Error extracting captcha data:", error);
          return null;
        }
      });

      if (captchaData) {
        console.log("✅ Extracted captcha data:", captchaData);

        // Simulate the frontend receiving this data
        console.log("🎯 Simulating frontend captcha handling...");
        console.log("📋 Captcha data would be sent to frontend:", {
          type: captchaData.type,
          captchaSiteKey: captchaData.captchaSiteKey,
          challengeId: captchaData.challengeId,
          csrfToken: captchaData.csrfToken,
        });

        // Simulate user solving captcha (in real scenario, user would solve it in iframe)
        console.log("👤 Simulating user solving captcha...");
        const simulatedToken = `linkedin-captcha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Simulate submitting token back to backend
        console.log("📤 Simulating token submission to backend...");

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
                tokenInput.value = token;
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
                  siteKeyInput.value = captchaData.captchaSiteKey;
                }
              }

              if (captchaData.challengeId) {
                const challengeInput = form.querySelector('input[name="challengeId"]');
                if (challengeInput) {
                  challengeInput.value = captchaData.challengeId;
                }
              }

              if (captchaData.csrfToken) {
                const csrfInput = form.querySelector('input[name="csrfToken"]');
                if (csrfInput) {
                  csrfInput.value = captchaData.csrfToken;
                }
              }

              // Submit the form
              console.log("📤 Submitting form...");
              form.submit();

              return { success: true };
            } catch (error) {
              console.log("❌ Error submitting captcha:", error);
              return { success: false, error: error.message };
            }
          },
          simulatedToken,
          captchaData,
        );

        if (submitResult.success) {
          console.log("✅ Captcha form submitted successfully");

          // Wait for navigation
          console.log("⏳ Waiting for page navigation after captcha submission...");
          await new Promise((resolve) => setTimeout(resolve, 5000));

          // Check if login was successful
          const newUrl = page.url();
          console.log("🔍 New URL after captcha submission:", newUrl);

          const isLoggedIn =
            newUrl.includes("/feed") || newUrl.includes("/mynetwork") || newUrl.includes("/jobs");

          if (isLoggedIn) {
            console.log("✅ Login successful after captcha!");

            // Extract cookies
            const cookies = await page.cookies();
            const liAt = cookies.find((cookie) => cookie.name === "li_at");

            if (liAt) {
              console.log("✅ Found li_at cookie after captcha");
              console.log(
                "🔐 li_at cookie value (first 20 chars):",
                liAt.value.substring(0, 20) + "...",
              );
            } else {
              console.log("❌ No li_at cookie found after captcha");
            }
          } else {
            console.log("❌ Still not logged in after captcha submission");
          }
        } else {
          console.log("❌ Failed to submit captcha:", submitResult.error);
        }
      } else {
        console.log("❌ Could not extract captcha data");
      }
    } else {
      console.log("✅ No captcha detected, login might have succeeded");
    }

    // Take a screenshot
    await page.screenshot({ path: "./test-captcha-flow-result.png", fullPage: true });
    console.log("📸 Screenshot saved as test-captcha-flow-result.png");
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    // Keep browser open for manual inspection
    console.log("🔍 Browser will stay open for manual inspection. Press Ctrl+C to close.");
    // await browser.close();
  }
}

// Run the test
testCaptchaFlow().catch(console.error);
