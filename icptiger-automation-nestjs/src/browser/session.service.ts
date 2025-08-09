import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Browser, Page } from 'puppeteer';
import { PuppeteerService } from './puppeteer.service';

export interface BrowserSessionInfo {
  browser: Browser;
  page: Page;
  isLoggedIn: boolean;
  createdAt: Date;
  lastActivity: Date;
  userId: string;
  sessionId: string;
  clientSession?: any; // CDP session for screencast
  onLoginSuccess?: () => void; // Callback for login success
  onScreenshotUpdate?: () => void; // Callback for screenshot updates
  onShowCanvas?: () => void; // Callback for showing canvas
  screencastRunning?: boolean; // Flag to track if screencast is active
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private sessions = new Map<string, BrowserSessionInfo>();

  constructor(
    private puppeteerService: PuppeteerService,
    private configService: ConfigService,
  ) {}

  async createSession(userId: string): Promise<BrowserSessionInfo> {
    try {
      this.logger.log(`Creating browser session for user ${userId}`);

      const browser = await this.puppeteerService.launchBrowser();
      const page = await this.puppeteerService.createPage(browser);

      browser.on('disconnected', () => {
        console.log(`[${userId}] Browser disconnected unexpectedly`);
      });

      browser.on('targetdestroyed', (target) => {
        console.log(`[${userId}] Browser target destroyed:`, target.url());
      });

      page.on('close', () => {
        console.log(`[${userId}] Page closed unexpectedly`);
      });

      const clientSession = await page.target().createCDPSession();

      // Navigate to LinkedIn login page
      await page.goto('https://www.linkedin.com/login', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // Wait for page to load naturally
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const sessionId = `${userId}_${Date.now()}`;
      const sessionInfo: BrowserSessionInfo = {
        browser,
        page,
        isLoggedIn: false,
        createdAt: new Date(),
        lastActivity: new Date(),
        userId,
        sessionId,
        clientSession,
      };

      this.sessions.set(userId, sessionInfo);

      // Monitor page navigation for login success
      page.on('framenavigated', async (frame) => {
        if (frame !== page.mainFrame()) return;

        const url = frame.url();
        console.log(`[${userId}] Navigation: ${url}`);

        if (
          url.includes('/feed') ||
          url.includes('/mynetwork') ||
          url.includes('/jobs')
        ) {
          sessionInfo.isLoggedIn = true;
          console.log(`[${userId}] Login success detected: ${url}`);

          await this.saveLinkedInCookies(userId, sessionInfo.page);

          if (sessionInfo.onLoginSuccess) {
            sessionInfo.onLoginSuccess();
          }
        }

        // Also trigger screenshot update for any navigation
        if (sessionInfo.onScreenshotUpdate) {
          sessionInfo.onScreenshotUpdate();
        }
      });

      // Monitor DOM changes for automatic screenshot updates
      page.on('load', () => {
        console.log(`[${userId}] Page loaded, triggering screenshot update`);
        // Wait a bit for dynamic content to load
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            sessionInfo.onScreenshotUpdate();
          }
        }, 1500);

        // Additional screenshot after 1.5 more seconds
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            console.log(
              `[${userId}] Additional screenshot update after page load`,
            );
            sessionInfo.onScreenshotUpdate();
          }
        }, 3000); // 1.5 + 1.5 = 3 seconds total
      });

      page.on('domcontentloaded', () => {
        console.log(
          `[${userId}] DOM content loaded, triggering screenshot update`,
        );
        // Wait for images and other resources
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            sessionInfo.onScreenshotUpdate();
          }
        }, 1000);

        // Additional screenshot after 1.5 more seconds
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            console.log(
              `[${userId}] Additional screenshot update after DOM content loaded`,
            );
            sessionInfo.onScreenshotUpdate();
          }
        }, 2500); // 1 + 1.5 = 2.5 seconds total
      });

      // Monitor for network idle to catch dynamic content changes
      page.on('networkidle0', () => {
        console.log(`[${userId}] Network idle, triggering screenshot update`);
        if (sessionInfo.onScreenshotUpdate) {
          sessionInfo.onScreenshotUpdate();
        }

        // Additional screenshot after 1.5 seconds
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            console.log(
              `[${userId}] Additional screenshot update after network idle`,
            );
            sessionInfo.onScreenshotUpdate();
          }
        }, 1500);
      });

      // Monitor for network idle2 (less strict, catches more dynamic content)
      page.on('networkidle2', () => {
        console.log(`[${userId}] Network idle2, triggering screenshot update`);
        if (sessionInfo.onScreenshotUpdate) {
          sessionInfo.onScreenshotUpdate();
        }

        // Additional screenshot after 1.5 seconds
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            console.log(
              `[${userId}] Additional screenshot update after network idle2`,
            );
            sessionInfo.onScreenshotUpdate();
          }
        }, 1500);
      });

      // Monitor for console messages (CAPTCHA often logs messages)
      page.on('console', (msg) => {
        if (msg.text().includes('captcha') || msg.text().includes('CAPTCHA')) {
          console.log(
            `[${userId}] CAPTCHA detected in console, triggering screenshot update`,
          );

          // Показуємо canvas при CAPTCHA
          if (sessionInfo.onShowCanvas) {
            sessionInfo.onShowCanvas();
          }

          // Wait for CAPTCHA to fully load
          setTimeout(() => {
            if (sessionInfo.onScreenshotUpdate) {
              sessionInfo.onScreenshotUpdate();
            }
          }, 3000); // Збільшено з 2000 до 3000

          // Additional screenshot for CAPTCHA after 1.5 more seconds
          setTimeout(() => {
            if (sessionInfo.onScreenshotUpdate) {
              console.log(
                `[${userId}] Additional CAPTCHA screenshot update for complete load`,
              );
              sessionInfo.onScreenshotUpdate();
            }
          }, 4500); // Збільшено з 3500 до 4500

          // Third screenshot after another 1.5 seconds
          setTimeout(() => {
            if (sessionInfo.onScreenshotUpdate) {
              console.log(
                `[${userId}] Third CAPTCHA screenshot update for final state`,
              );
              sessionInfo.onScreenshotUpdate();
            }
          }, 6000); // 4.5 + 1.5 = 6 seconds total
        }
      });

      // Monitor for response events (CAPTCHA loads via AJAX)
      page.on('response', (response) => {
        const url = response.url();
        if (
          url.includes('captcha') ||
          url.includes('challenge') ||
          url.includes('verify')
        ) {
          console.log(
            `[${userId}] CAPTCHA/Challenge response detected, triggering screenshot update`,
          );

          // Показуємо canvas при CAPTCHA response
          if (sessionInfo.onShowCanvas) {
            sessionInfo.onShowCanvas();
          }

          // Wait for response content to be processed
          setTimeout(() => {
            if (sessionInfo.onScreenshotUpdate) {
              sessionInfo.onScreenshotUpdate();
            }
          }, 2000); // Збільшено з 1000 до 2000

          // Additional screenshot after 1.5 more seconds
          setTimeout(() => {
            if (sessionInfo.onScreenshotUpdate) {
              console.log(
                `[${userId}] Additional CAPTCHA response screenshot update`,
              );
              sessionInfo.onScreenshotUpdate();
            }
          }, 3500); // 2 + 1.5 = 3.5 seconds total
        }
      });

      // Set up MutationObserver for DOM changes
      await page.evaluateOnNewDocument(() => {
        // Create a debounced function to avoid too many updates
        let updateTimeout: NodeJS.Timeout;
        let lastUpdateTime = 0;
        const MIN_UPDATE_INTERVAL = 1000; // 1 second minimum between updates

        const debouncedUpdate = () => {
          const now = Date.now();
          if (now - lastUpdateTime < MIN_UPDATE_INTERVAL) {
            return; // Skip if too soon
          }

          clearTimeout(updateTimeout);
          updateTimeout = setTimeout(() => {
            lastUpdateTime = now;
            // Send a custom event to trigger screenshot update
            window.dispatchEvent(new CustomEvent('domChanged'));
          }, 1000); // 1 second debounce for content to fully load
        };

        // Observe DOM changes
        const observer = new MutationObserver((mutations) => {
          let shouldUpdate = false;
          let hasSignificantChange = false;

          mutations.forEach((mutation) => {
            // Check for added nodes (new elements like CAPTCHA)
            if (
              mutation.type === 'childList' &&
              mutation.addedNodes.length > 0
            ) {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  // Check for CAPTCHA-related elements
                  if (
                    element.id?.includes('captcha') ||
                    element.className?.includes('captcha') ||
                    element.innerHTML?.includes('captcha') ||
                    element.innerHTML?.includes('challenge') ||
                    element.innerHTML?.includes('verify')
                  ) {
                    shouldUpdate = true;
                    hasSignificantChange = true;
                  }
                }
              });
            }

            // Check for attribute changes (important for dynamic content)
            if (mutation.type === 'attributes') {
              const target = mutation.target as Element;
              if (
                target.id?.includes('captcha') ||
                target.className?.includes('captcha') ||
                target.innerHTML?.includes('captcha')
              ) {
                shouldUpdate = true;
                hasSignificantChange = true;
              }
            }

            // Check for any significant DOM changes (not just CAPTCHA)
            if (
              mutation.type === 'childList' &&
              mutation.addedNodes.length > 0
            ) {
              // Any new element added to the page
              shouldUpdate = true;
            }

            // Check for text content changes (important for dynamic forms)
            if (mutation.type === 'characterData') {
              shouldUpdate = true;
            }

            // Check for subtree changes (any nested element changes)
            if (
              mutation.type === 'childList' &&
              mutation.removedNodes.length > 0
            ) {
              shouldUpdate = true;
            }
          });

          if (shouldUpdate) {
            if (hasSignificantChange) {
              // For CAPTCHA and important changes, wait longer for full content load
              clearTimeout(updateTimeout);
              updateTimeout = setTimeout(() => {
                lastUpdateTime = Date.now();
                window.dispatchEvent(new CustomEvent('domChanged'));
              }, 2000); // 2 seconds for CAPTCHA to fully load
            } else {
              debouncedUpdate();
            }
          }
        });

        // Start observing
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          characterData: true,
          attributeFilter: ['id', 'class', 'style', 'src', 'href'],
        });

        // Listen for the custom event
        window.addEventListener('domChanged', () => {
          // This will be handled by the page listener
        });
      });

      // Listen for the custom DOM change event
      page.on('domChanged', () => {
        console.log(
          `[${userId}] DOM changed event detected, triggering screenshot update`,
        );
        // Wait for content to fully load after DOM changes
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            sessionInfo.onScreenshotUpdate();
          }
        }, 1500);

        // Additional screenshot after 1.5 more seconds to ensure full content load
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            console.log(
              `[${userId}] Additional screenshot update for complete content load`,
            );
            sessionInfo.onScreenshotUpdate();
          }
        }, 3000); // 1.5 + 1.5 = 3 seconds total

        // Third screenshot after another 1.5 seconds for final state
        setTimeout(() => {
          if (sessionInfo.onScreenshotUpdate) {
            console.log(
              `[${userId}] Third screenshot update for final DOM state`,
            );
            sessionInfo.onScreenshotUpdate();
          }
        }, 4500); // 3 + 1.5 = 4.5 seconds total
      });

      // Auto-cleanup after 20 minutes
      setTimeout(
        () => {
          this.cleanupSession(userId);
        },
        20 * 60 * 1000,
      );

      this.logger.log(`Browser session created for user ${userId}`);
      return sessionInfo;
    } catch (error) {
      this.logger.error(`Failed to create session for user ${userId}:`, error);
      throw error;
    }
  }

  async getSession(userId: string): Promise<BrowserSessionInfo | null> {
    const session = this.sessions.get(userId);
    if (session) {
      session.lastActivity = new Date();
    }
    return session || null;
  }

  async getCDPSession(userId: string): Promise<any | null> {
    const session = this.sessions.get(userId);
    return session?.clientSession || null;
  }

  setLoginSuccessCallback(userId: string, callback: () => void): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.onLoginSuccess = callback;
    }
  }

  setScreenshotUpdateCallback(userId: string, callback: () => void): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.onScreenshotUpdate = callback;
    }
  }

  setShowCanvasCallback(userId: string, callback: () => void): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.onShowCanvas = callback;
    }
  }

  private async saveLinkedInCookies(userId: string, page: Page): Promise<void> {
    try {
      const cookies = await page.cookies();
      const liAt = cookies.find((c) => c.name === 'li_at')?.value;
      const liA = cookies.find((c) => c.name === 'li_a')?.value;

      if (liAt) {
        console.log(`[${userId}] Saving updated LinkedIn cookies to database`);
        console.log(`[${userId}] li_at cookie: ${liAt.substring(0, 20)}...`);
        if (liA) {
          console.log(`[${userId}] li_a cookie: ${liA.substring(0, 20)}...`);
        }

        // TODO: Save cookies to database
        // await this.supabaseService.updateLinkedInCookies(userId, liAt, liA);
      }
    } catch (error) {
      console.error(`[${userId}] Error saving LinkedIn cookies:`, error);
    }
  }

  async getOrCreateSession(userId: string): Promise<BrowserSessionInfo> {
    let session = await this.getSession(userId);
    if (!session) {
      session = await this.createSession(userId);
    }
    return session;
  }

  async updateSessionActivity(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  async captureScreenshot(userId: string): Promise<Buffer | null> {
    const session = this.sessions.get(userId);
    if (!session || !session.page) {
      return null;
    }

    try {
      await this.updateSessionActivity(userId);
      const screenshot = await session.page.screenshot({
        type: 'png',
      });
      return screenshot as Buffer;
    } catch (error) {
      this.logger.error(
        `Failed to capture screenshot for user ${userId}:`,
        error,
      );
      return null;
    }
  }

  async closeSession(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (session) {
      try {
        // Stop CDP screencast if active
        if (session.clientSession) {
          try {
            await session.clientSession.send('Page.stopScreencast');
          } catch (error) {
            this.logger.warn(
              `Error stopping screencast for user ${userId}:`,
              error,
            );
          }
        }

        if (session.browser) {
          await session.browser.close();
        }
        this.sessions.delete(userId);
        this.logger.log(`Session closed for user ${userId}`);
      } catch (error) {
        this.logger.error(`Error closing session for user ${userId}:`, error);
      }
    }
  }

  private async cleanupSession(userId: string): Promise<void> {
    const session = this.sessions.get(userId);
    if (!session) return;

    const now = new Date();
    const timeoutMs = 20 * 60 * 1000;
    const isExpired =
      now.getTime() - session.lastActivity.getTime() > timeoutMs;

    if (isExpired) {
      await this.closeSession(userId);
      this.logger.log(`Session expired and cleaned up for user ${userId}`);
    } else {
      setTimeout(() => {
        this.cleanupSession(userId);
      }, timeoutMs);
    }
  }

  async cleanupAllSessions(): Promise<void> {
    const userIds = Array.from(this.sessions.keys());
    for (const userId of userIds) {
      await this.closeSession(userId);
    }
    this.logger.log('All sessions cleaned up');
  }

  getActiveSessions(): string[] {
    return Array.from(this.sessions.keys());
  }

  getSessionCount(): number {
    return this.sessions.size;
  }
}
