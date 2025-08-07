import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API endpoint called");

    const { email, password } = await request.json();

    if (!email || !password) {
      console.log("❌ Missing email or password");
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    console.log("🔐 Starting automated LinkedIn login...");
    console.log("📧 Email:", email);
    console.log("🔑 Password length:", password.length);

    // Перевіряємо чи встановлений Puppeteer
    try {
      console.log("🔍 Checking Puppeteer installation...");
      const puppeteerVersion = require("puppeteer/package.json").version;
      console.log("✅ Puppeteer version:", puppeteerVersion);
    } catch (puppeteerError) {
      console.error("❌ Puppeteer not installed:", puppeteerError);
      return NextResponse.json(
        {
          status: "failed",
          message: "Puppeteer is not installed. Please install it with: npm install puppeteer",
        },
        { status: 500 },
      );
    }

    // Тестовий режим - спробуємо спочатку перейти на просту сторінку
    console.log("🧪 Testing basic navigation first...");

    // Launch browser
    console.log("🌐 Launching Puppeteer browser...");
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: false, // Змінюємо на false щоб бачити браузер
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-web-security",
          "--disable-features=VizDisplayCompositor",
        ],
      });
      console.log("✅ Browser launched successfully");
    } catch (browserError) {
      console.error("❌ Failed to launch browser:", browserError);

      // Спробуємо альтернативний підхід
      try {
        console.log("🔄 Trying alternative browser launch...");
        browser = await puppeteer.launch({
          headless: false,
          executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        console.log("✅ Browser launched with alternative method");
      } catch (alternativeError) {
        console.error("❌ Alternative launch also failed:", alternativeError);
        return NextResponse.json(
          {
            status: "failed",
            message: "Failed to launch browser. Please check if Chrome is installed.",
          },
          { status: 500 },
        );
      }
    }

    let page;
    try {
      page = await browser.newPage();
      console.log("📄 New page created");
    } catch (pageError) {
      console.error("❌ Failed to create new page:", pageError);
      await browser.close();
      return NextResponse.json(
        {
          status: "failed",
          message: "Failed to create new page.",
        },
        { status: 500 },
      );
    }

    // Set user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );
    console.log("👤 User agent set");

    // Set viewport
    await page.setViewport({ width: 1280, height: 720 });
    console.log("📱 Viewport set to 1280x720");

    // Тестуємо навігацію на просту сторінку
    try {
      console.log("🧪 Testing navigation to google.com...");
      await page.goto("https://www.google.com", { waitUntil: "networkidle2", timeout: 10000 });
      console.log("✅ Successfully navigated to Google");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (testError) {
      console.error("❌ Test navigation failed:", testError);
      await browser.close();
      return NextResponse.json(
        {
          status: "failed",
          message:
            "Basic navigation test failed. Please check your internet connection and browser installation.",
        },
        { status: 500 },
      );
    }

    try {
      // Navigate to LinkedIn login page
      console.log("🌐 Navigating to LinkedIn login page...");
      try {
        console.log("🔍 Current page URL before navigation:", await page.url());

        await page.goto("https://www.linkedin.com/login", {
          waitUntil: "networkidle2",
          timeout: 30000,
        });

        console.log("✅ Successfully navigated to LinkedIn login page");
        console.log("🔍 Current page URL after navigation:", await page.url());
        console.log("🔍 Page title:", await page.title());

        await new Promise((resolve) => setTimeout(resolve, 2000)); // Затримка 2 секунди
      } catch (navigationError) {
        console.error("❌ Failed to navigate to LinkedIn:", navigationError);

        // Спробуємо зберегти скріншот для діагностики
        try {
          await page.screenshot({ path: "./linkedin-navigation-error.png", fullPage: true });
          console.log("📸 Screenshot saved as linkedin-navigation-error.png");
        } catch (screenshotError) {
          console.log("⚠️ Could not save screenshot:", screenshotError);
        }

        await browser.close();
        return NextResponse.json(
          {
            status: "failed",
            message:
              "Failed to navigate to LinkedIn login page. Please check your internet connection.",
          },
          { status: 500 },
        );
      }

      // Wait for login form to load
      console.log("⏳ Waiting for login form elements...");
      try {
        await page.waitForSelector("#username", { timeout: 10000 });
        await page.waitForSelector("#password", { timeout: 10000 });
        console.log("✅ Login form elements found");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Затримка 2 секунди
      } catch (selectorError) {
        console.error("❌ Failed to find login form elements:", selectorError);
        // Зберігаємо скріншот для діагностики
        try {
          await page.screenshot({ path: "./linkedin-form-not-found.png", fullPage: true });
          console.log("📸 Screenshot saved as linkedin-form-not-found.png");
        } catch (screenshotError) {
          console.log("⚠️ Could not save screenshot:", screenshotError);
        }
        await browser.close();
        return NextResponse.json(
          {
            status: "failed",
            message: "Login form not found. LinkedIn page structure may have changed.",
          },
          { status: 500 },
        );
      }

      // Fill in credentials
      console.log("📝 Filling in email...");
      await page.type("#username", email);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Затримка 1 секунда
      console.log("📝 Filling in password...");
      await page.type("#password", password);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Затримка 1 секунда
      console.log("✅ Credentials filled");

      // Click login button
      console.log("🔑 Clicking login button...");
      await page.click('button[type="submit"]');
      console.log("✅ Login button clicked");

      // Wait for navigation or error
      console.log("⏳ Waiting for page navigation...");
      await new Promise((resolve) => setTimeout(resolve, 8000)); // Збільшуємо затримку до 8 секунд

      // Check if we're logged in by looking for feed URL or error messages
      const currentUrl = page.url();
      console.log("🔍 Current URL after login attempt:", currentUrl);

      // Check for captcha/challenge pages
      const captchaPatterns = ["captcha", "challenge", "verify", "puzzle", "security-check"];
      const hasCaptchaUrl = captchaPatterns.some((pattern) =>
        currentUrl.toLowerCase().includes(pattern),
      );

      if (hasCaptchaUrl) {
        console.log("🔍 CAPTCHA DETECTED in URL:", currentUrl);

        // Extract Arkose Labs parameters
        const arkoseData = await page.evaluate(() => {
          try {
            console.log("🔍 Starting captcha detection...");

            // Look for all iframes first
            const allIframes = document.querySelectorAll("iframe");
            console.log("🔍 Found iframes:", allIframes.length);

            allIframes.forEach((iframe, index) => {
              console.log(`🔍 Iframe ${index}:`, (iframe as HTMLIFrameElement).src);
            });

            // Look for Arkose Labs iframe with more patterns
            const arkoseIframe = (document.querySelector('iframe[src*="arkoselabs"]') ||
              document.querySelector('iframe[src*="client-api.arkoselabs"]') ||
              document.querySelector('iframe[src*="arkose"]') ||
              document.querySelector('iframe[src*="funcaptcha"]')) as HTMLIFrameElement;

            if (arkoseIframe) {
              console.log("🎯 Found Arkose Labs iframe:", arkoseIframe.src);

              // Extract sitekey from iframe src
              const srcMatch = arkoseIframe.src.match(/v2\/([^\/]+)\/api\.js/);
              const sitekey = srcMatch ? srcMatch[1] : null;

              // Look for hidden inputs with Arkose data
              const fcTokenInput = document.querySelector(
                'input[name="fc-token"]',
              ) as HTMLInputElement;
              const verificationTokenInput = document.querySelector(
                'input[name="verification-token"]',
              ) as HTMLInputElement;

              // Look for data attributes that might contain Arkose info
              const dataPkey = document.querySelector("[data-pkey]")?.getAttribute("data-pkey");
              const dataSurl = document.querySelector("[data-surl]")?.getAttribute("data-surl");

              // Look for any script tags with Arkose
              const arkoseScripts = document.querySelectorAll('script[src*="arkoselabs"]');
              console.log("🔍 Found Arkose scripts:", arkoseScripts.length);

              return {
                type: "arkose",
                sitekey,
                fcToken: fcTokenInput?.value || null,
                verificationToken: verificationTokenInput?.value || null,
                dataPkey,
                dataSurl,
                iframeSrc: arkoseIframe.src,
              };
            }

            // Look for LinkedIn's own captcha elements
            const linkedinCaptchaElements = document.querySelectorAll(
              '[class*="captcha"], [id*="captcha"], [data-test-id*="captcha"]',
            );
            console.log("🔍 Found LinkedIn captcha elements:", linkedinCaptchaElements.length);

            // Look for puzzle elements
            const puzzleElements = document.querySelectorAll(
              '[class*="puzzle"], [id*="puzzle"], [data-test-id*="puzzle"]',
            );
            console.log("🔍 Found puzzle elements:", puzzleElements.length);

            // Look for challenge elements
            const challengeElements = document.querySelectorAll(
              '[class*="challenge"], [id*="challenge"], [data-test-id*="challenge"]',
            );
            console.log("🔍 Found challenge elements:", challengeElements.length);

            // Look for verification elements
            const verificationElements = document.querySelectorAll(
              '[class*="verification"], [id*="verification"], [data-test-id*="verification"]',
            );
            console.log("🔍 Found verification elements:", verificationElements.length);

            // Look for hidden inputs that might contain captcha data
            const hiddenInputs = document.querySelectorAll('input[type="hidden"]');
            console.log("🔍 Found hidden inputs:", hiddenInputs.length);

            hiddenInputs.forEach((input, index) => {
              const inputElement = input as HTMLInputElement;
              console.log(`🔍 Hidden input ${index}:`, inputElement.name, inputElement.value);
            });

            // Look for data attributes that might contain captcha info
            const dataElements = document.querySelectorAll(
              "[data-test-id], [data-pkey], [data-surl], [data-captcha]",
            );
            console.log("🔍 Found data elements:", dataElements.length);

            // Look for specific LinkedIn captcha patterns
            const bodyText = document.body.innerText.toLowerCase();
            console.log("🔍 Body text contains 'captcha':", bodyText.includes("captcha"));
            console.log("🔍 Body text contains 'puzzle':", bodyText.includes("puzzle"));
            console.log("🔍 Body text contains 'challenge':", bodyText.includes("challenge"));
            console.log("🔍 Body text contains 'verification':", bodyText.includes("verification"));

            // For LinkedIn's own captcha, extract what we can
            if (
              linkedinCaptchaElements.length > 0 ||
              puzzleElements.length > 0 ||
              challengeElements.length > 0
            ) {
              console.log("🎯 Found LinkedIn captcha elements");

              // Extract any available data
              const captchaData = {
                type: "linkedin",
                elements: {
                  captcha: linkedinCaptchaElements.length,
                  puzzle: puzzleElements.length,
                  challenge: challengeElements.length,
                  verification: verificationElements.length,
                },
                hiddenInputs: Array.from(hiddenInputs).map((input) => ({
                  name: (input as HTMLInputElement).name,
                  value: (input as HTMLInputElement).value,
                })),
                bodyText: bodyText.substring(0, 500), // First 500 chars for analysis
                // NEW: Extract specific LinkedIn captcha parameters
                captchaSiteKey: document
                  .querySelector('input[name="captchaSiteKey"]')
                  ?.getAttribute("value"),
                challengeId: document
                  .querySelector('input[name="challengeId"]')
                  ?.getAttribute("value"),
                csrfToken: document.querySelector('input[name="csrfToken"]')?.getAttribute("value"),
                // Extract form action and method
                formAction: document.querySelector("form")?.getAttribute("action"),
                formMethod: document.querySelector("form")?.getAttribute("method"),
                // Extract page title and content
                pageTitle: document.title,
                pageContent: document.body.innerText.substring(0, 1000),
              };

              return captchaData;
            }

            console.log("❌ No known captcha type found");
            return { type: "unknown" };
          } catch (error) {
            console.error("❌ Error during captcha detection:", error);
            return {
              type: "unknown",
              error: error instanceof Error ? error.message : String(error),
            };
          }
        });

        console.log("🎯 Extracted captcha data:", arkoseData);

        // Save screenshot for debugging
        try {
          await page.screenshot({ path: "./linkedin-captcha-detected.png", fullPage: true });
          console.log("📸 Screenshot saved as linkedin-captcha-detected.png");
        } catch (screenshotError) {
          console.log("⚠️ Could not save screenshot:", screenshotError);
        }

        // DON'T close browser - keep it open for captcha solving
        console.log("⏳ Keeping browser open for captcha solving...");

        // Save browser session for later use
        const sessionId = `session-${Date.now()}`;
        (global as any).browserSessions = (global as any).browserSessions || new Map();
        (global as any).browserSessions.set(sessionId, {
          browser,
          page,
          currentUrl,
          captchaData: arkoseData,
        });

        // Extract actual captcha content from the page
        const captchaContent = await page.evaluate(() => {
          // Get the main content of the captcha page
          const mainContent = document.querySelector("main") || document.body;
          const captchaContainer =
            mainContent.querySelector(
              '[class*="captcha"], [class*="puzzle"], [class*="challenge"]',
            ) || mainContent;

          return {
            html: captchaContainer.innerHTML,
            text: (captchaContainer as HTMLElement).innerText,
            title: document.title,
            // Extract any forms and their data
            forms: Array.from(document.querySelectorAll("form")).map((form) => ({
              action: form.action,
              method: form.method,
              inputs: Array.from(form.querySelectorAll("input")).map((input) => ({
                name: input.name,
                value: input.value,
                type: input.type,
              })),
            })),
          };
        });

        console.log("📸 Extracted captcha content:", captchaContent);

        // Return captcha data but keep browser session alive
        return NextResponse.json({
          status: "captcha_required",
          message: "LinkedIn requires captcha verification",
          captchaData: {
            ...arkoseData,
            captchaUrl: currentUrl,
            // NEW: Real captcha content
            realContent: captchaContent,
          },
          captchaUrl: currentUrl,
          sessionId: sessionId,
          browserOpen: true,
        });
      }

      // Check for various success indicators
      const isLoggedIn =
        currentUrl.includes("/feed") ||
        currentUrl.includes("/mynetwork") ||
        currentUrl.includes("/jobs") ||
        currentUrl.includes("/messaging") ||
        currentUrl.includes("/notifications");

      if (isLoggedIn) {
        console.log("✅ Login successful! User is on LinkedIn dashboard");

        // Extract cookies
        console.log("🍪 Extracting cookies...");
        const cookies = await page.cookies();
        console.log("📋 Total cookies found:", cookies.length);

        // Log all cookie names for debugging
        console.log("🍪 Cookie names:", cookies.map((c) => c.name).join(", "));

        // Find LinkedIn authentication cookies
        const liAt = cookies.find((cookie) => cookie.name === "li_at");
        const liA = cookies.find((cookie) => cookie.name === "li_a");

        if (liAt) {
          console.log("✅ Found li_at cookie");
          console.log(
            "🔐 li_at cookie value (first 20 chars):",
            liAt.value.substring(0, 20) + "...",
          );

          if (liA) {
            console.log("✅ Found li_a cookie");
            console.log(
              "🔐 li_a cookie value (first 20 chars):",
              liA.value.substring(0, 20) + "...",
            );
          } else {
            console.log("⚠️ li_a cookie not found (this is normal)");
          }

          // Зберігаємо скріншот успішного логіну
          try {
            await page.screenshot({ path: "./linkedin-login-success.png", fullPage: true });
            console.log("📸 Screenshot saved as linkedin-login-success.png");
          } catch (screenshotError) {
            console.log("⚠️ Could not save screenshot:", screenshotError);
          }

          await new Promise((resolve) => setTimeout(resolve, 3000)); // Затримка 3 секунди перед закриттям
          await browser.close();
          console.log("🔒 Browser closed");

          console.log("🎉 Returning success response with cookies");
          return NextResponse.json({
            status: "success",
            message: "Login successful",
            cookies: {
              li_at: liAt.value,
              li_a: liA?.value || null,
            },
          });
        } else {
          console.log("❌ No li_at cookie found");
          console.log(
            "🍪 Available cookies:",
            cookies.map((c) => `${c.name}: ${c.value.substring(0, 10)}...`),
          );

          // Зберігаємо скріншот коли немає li_at cookie
          try {
            await page.screenshot({ path: "./linkedin-no-li-at-cookie.png", fullPage: true });
            console.log("📸 Screenshot saved as linkedin-no-li-at-cookie.png");
          } catch (screenshotError) {
            console.log("⚠️ Could not save screenshot:", screenshotError);
          }
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Затримка 3 секунди
          await browser.close();

          return NextResponse.json(
            {
              status: "failed",
              message: "Login successful but no authentication cookies found",
            },
            { status: 400 },
          );
        }
      } else {
        console.log("❌ User not logged in, checking for errors...");

        // Check for verification required
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
          console.log("📱 Verification required detected");
          // Зберігаємо скріншот сторінки з верифікацією
          try {
            await page.screenshot({ path: "./linkedin-verification-required.png", fullPage: true });
            console.log("📸 Screenshot saved as linkedin-verification-required.png");
          } catch (screenshotError) {
            console.log("⚠️ Could not save screenshot:", screenshotError);
          }
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Затримка 3 секунди
          await browser.close();

          return NextResponse.json(
            {
              status: "verification_required",
              message: "Phone verification required. Please complete verification and try again.",
            },
            { status: 400 },
          );
        }

        // Check for login errors
        console.log("🔍 Checking for login error messages...");
        const errorText = await page.evaluate(() => {
          const errorElements = document.querySelectorAll(
            '[data-test-id="login-error"], .alert-error, .error-message',
          );
          return Array.from(errorElements)
            .map((el) => el.textContent)
            .join(" ");
        });

        if (errorText) {
          console.log("❌ Login error found:", errorText);
          // Зберігаємо скріншот сторінки з помилкою
          try {
            await page.screenshot({ path: "./linkedin-login-error.png", fullPage: true });
            console.log("📸 Screenshot saved as linkedin-login-error.png");
          } catch (screenshotError) {
            console.log("⚠️ Could not save screenshot:", screenshotError);
          }
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Затримка 3 секунди
          await browser.close();

          return NextResponse.json(
            {
              status: "failed",
              message: errorText || "Login failed. Please check your credentials.",
            },
            { status: 400 },
          );
        }

        // If we're still on login page, assume credentials are wrong
        if (currentUrl.includes("/login")) {
          console.log("❌ Still on login page - credentials may be incorrect");
          // Зберігаємо скріншот сторінки логіну
          try {
            await page.screenshot({ path: "./linkedin-still-on-login.png", fullPage: true });
            console.log("📸 Screenshot saved as linkedin-still-on-login.png");
          } catch (screenshotError) {
            console.log("⚠️ Could not save screenshot:", screenshotError);
          }
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Затримка 3 секунди
          await browser.close();

          return NextResponse.json(
            {
              status: "failed",
              message: "Invalid email or password. Please check your credentials and try again.",
            },
            { status: 400 },
          );
        }

        console.log("❌ Unexpected state - not logged in and no clear error");
        console.log("🔍 Page title:", await page.title());
        console.log(
          "🔍 Page content preview:",
          await page.evaluate(() => document.body.innerText.substring(0, 200)),
        );

        // Зберігаємо скріншот неочікуваного стану
        try {
          await page.screenshot({ path: "./linkedin-unexpected-state.png", fullPage: true });
          console.log("📸 Screenshot saved as linkedin-unexpected-state.png");
        } catch (screenshotError) {
          console.log("⚠️ Could not save screenshot:", screenshotError);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Затримка 3 секунди

        await browser.close();

        return NextResponse.json(
          {
            status: "failed",
            message: "Login failed. Please try again.",
          },
          { status: 400 },
        );
      }
    } catch (error) {
      console.error("❌ Error during login process:", error);
      await browser.close();

      return NextResponse.json(
        {
          status: "failed",
          message: "Login process failed. Please try again.",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("❌ Error in automated login endpoint:", error);

    return NextResponse.json(
      {
        status: "failed",
        message: "Internal server error. Please try again.",
      },
      { status: 500 },
    );
  }
}
