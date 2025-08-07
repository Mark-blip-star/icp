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
        
        if (url.includes('/feed') || url.includes('/mynetwork') || url.includes('/jobs')) {
          sessionInfo.isLoggedIn = true;
          console.log(`[${userId}] Login success detected: ${url}`);
          
          await this.saveLinkedInCookies(userId, sessionInfo.page);
          
          if (sessionInfo.onLoginSuccess) {
            sessionInfo.onLoginSuccess();
          }
        }
      });

      // Auto-cleanup after 20 minutes
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
      this.logger.error(`Failed to capture screenshot for user ${userId}:`, error);
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