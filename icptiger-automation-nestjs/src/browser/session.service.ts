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
  screencastRunning?: boolean; // Flag to track if screencast is active
}

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  private sessions = new Map<string, BrowserSessionInfo>();

  constructor(
    private puppeteerService: PuppeteerService,
    private configService: ConfigService
  ) {}

  async createSession(userId: string): Promise<BrowserSessionInfo> {
    try {
      this.logger.log(`Creating browser session for user ${userId}`);
      
      const browser = await this.puppeteerService.launchBrowser();
      const page = await this.puppeteerService.createPage(browser);
      
      // Add browser event listeners to track when it closes
      browser.on('disconnected', () => {
        console.log(`[${userId}] Browser disconnected unexpectedly`);
      });
      
      browser.on('targetdestroyed', (target) => {
        console.log(`[${userId}] Browser target destroyed:`, target.url());
      });
      
      page.on('close', () => {
        console.log(`[${userId}] Page closed unexpectedly`);
      });
      
      // Create CDP session for screencast
      const clientSession = await page.target().createCDPSession();
      
      // Block images & media for performance (like in old backend)
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const blocked = ["image", "media"];
        blocked.includes(req.resourceType()) ? req.abort() : req.continue();
      });
      
      await page.goto('https://www.linkedin.com/login', {
        waitUntil: 'networkidle2',
        timeout: 60000,
      });

      // Temporarily disable cleanup script to test basic functionality
      // await this.injectCleanupScript(page, userId);

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

            // Listen for navigation to detect login success
      page.on('framenavigated', async (frame) => {
        if (frame !== page.mainFrame()) return;
        
        const url = frame.url();
        console.log(`[${userId}] Navigation: ${url}`);
        
        if (url.includes('/feed') || url.includes('/mynetwork') || url.includes('/jobs')) {
          // User successfully logged in
          sessionInfo.isLoggedIn = true;
          console.log(`[${userId}] Login success detected: ${url}`);
          
          // Save updated cookies to database
          await this.saveLinkedInCookies(userId, sessionInfo.page);
          
          // Call login success callback if set
          if (sessionInfo.onLoginSuccess) {
            sessionInfo.onLoginSuccess();
          }
        }
        // Temporarily disable re-injection to avoid interference
        // else {
        //   // Re-inject cleanup on navigation (like in old backend)
        //   setTimeout(() => this.injectCleanupScript(page, userId), 200);
        // }
      });

      // CDP screencast will be started by the websocket gateway
      // We just store the clientSession for later use

      // Cleanup session after 20 minutes
      setTimeout(() => {
        this.cleanupSession(userId);
      }, 20 * 60 * 1000);

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

  private async saveLinkedInCookies(userId: string, page: Page): Promise<void> {
    try {
      const cookies = await page.cookies();
      const liAt = cookies.find(c => c.name === 'li_at')?.value;
      const liA = cookies.find(c => c.name === 'li_a')?.value;

      if (liAt) {
        console.log(`[${userId}] Saving updated LinkedIn cookies to database`);
        
        // Здесь нужно будет добавить SupabaseService для сохранения в БД
        // Пока просто логируем
        console.log(`[${userId}] li_at cookie: ${liAt.substring(0, 20)}...`);
        if (liA) {
          console.log(`[${userId}] li_a cookie: ${liA.substring(0, 20)}...`);
        }
      }
    } catch (error) {
      console.error(`[${userId}] Error saving LinkedIn cookies:`, error);
    }
  }

  private async injectCleanupScript(page: Page, userId: string): Promise<void> {
    try {
      // Cleanup selectors from old backend - more conservative approach
      const cleanupSelectors = [
        "header",
        "footer", 
        ".join-now",
        ".alternate-signin-container",
        ".google-one-tap-module__outline",
        "#credential_picker_container",
        ".forgot-password",
      ];

      // Wait a bit for page to load before injecting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // First, let's check what elements exist before removing
      const elementCounts = await page.evaluate((selectors) => {
        const counts: { [key: string]: number } = {};
        selectors.forEach((sel: string) => {
          counts[sel] = (globalThis as any).document.querySelectorAll(sel).length;
        });
        return counts;
      }, cleanupSelectors);

      console.log(`[${userId}] Elements found before cleanup:`, elementCounts);

      // Only inject if we're on login page
      const currentUrl = page.url();
      if (currentUrl.includes('/login')) {
        await page.evaluate((selectors) => {
          selectors.forEach((sel: string) => {
            const elements = (globalThis as any).document.querySelectorAll(sel);
            console.log(`Removing ${elements.length} elements with selector: ${sel}`);
            elements.forEach((el: any) => el.remove());
          });
        }, cleanupSelectors);

        console.log(`[${userId}] Cleanup script injected successfully on login page`);
      } else {
        console.log(`[${userId}] Skipping cleanup - not on login page: ${currentUrl}`);
      }
    } catch (error) {
      console.error(`[${userId}] Error injecting cleanup script:`, error);
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
      this.logger.error(`Failed to capture screenshot for user ${userId}:`, error);
      return null;
    }
  }

  async handleMouseEvent(userId: string, event: any): Promise<void> {
    const session = this.sessions.get(userId);
    if (!session || !session.page) return;

    try {
      await this.updateSessionActivity(userId);
      
      switch (event.type) {
        case 'click':
          await session.page.click(`[data-x="${event.x}"][data-y="${event.y}"]`);
          break;
        case 'move':
          await session.page.mouse.move(event.x, event.y);
          break;
      }
    } catch (error) {
      this.logger.error(`Mouse event error for user ${userId}:`, error);
    }
  }

  async handleKeyboardEvent(userId: string, event: any): Promise<void> {
    const session = this.sessions.get(userId);
    if (!session || !session.page) return;

    try {
      await this.updateSessionActivity(userId);
      
      switch (event.type) {
        case 'keypress':
          await session.page.keyboard.press(event.key);
          break;
        case 'type':
          await session.page.keyboard.type(event.text);
          break;
      }
    } catch (error) {
      this.logger.error(`Keyboard event error for user ${userId}:`, error);
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
            this.logger.warn(`Error stopping screencast for user ${userId}:`, error);
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
    const isExpired = now.getTime() - session.lastActivity.getTime() > timeoutMs;

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