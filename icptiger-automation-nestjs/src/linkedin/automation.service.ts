import { Injectable, Logger } from '@nestjs/common';
import { SessionService, BrowserSessionInfo } from '../browser/session.service';
import { SupabaseService } from '../database/supabase.service';
import { LinkedInSettingsService } from './settings.service';
import { Campaign, LinkedInAccount } from '../common/types/campaign.types';
import { Page } from 'puppeteer';

@Injectable()
export class LinkedInAutomationService {
  private readonly logger = new Logger(LinkedInAutomationService.name);

  constructor(
    private sessionService: SessionService,
    private supabaseService: SupabaseService,
    private linkedinSettingsService: LinkedInSettingsService,
  ) {}

  /**
   * Run LinkedIn automation with login (replaces runWithLogin utility)
   */
  async runWithLogin<T>(
    campaign: Campaign,
    accountData: LinkedInAccount,
    runFn: (args: {
      browser: any;
      page: Page;
      campaign: Campaign;
      accountData: LinkedInAccount;
    }) => Promise<T>,
  ): Promise<T> {
    const userId = campaign.user_id;

    this.logger.log(
      `Starting LinkedIn automation for user ${userId}, campaign ${campaign.id}`,
    );

    try {
      // Get or create browser session
      let session = await this.sessionService.getSession(userId);

      if (!session) {
        this.logger.log(`Creating new browser session for user ${userId}`);
        session = await this.sessionService.createSession(userId);
      } else {
        this.logger.log(`Reusing existing browser session for user ${userId}`);
        await this.sessionService.updateSessionActivity(userId);
      }

      // Verify session is healthy
      if (!session.browser || !session.page || session.page.isClosed()) {
        this.logger.warn(
          `Session unhealthy for user ${userId}, creating new one`,
        );
        await this.sessionService.closeSession(userId);
        session = await this.sessionService.createSession(userId);
      }

      // Check if already logged in to LinkedIn
      const currentUrl = session.page.url();
      const isLoggedIn =
        currentUrl.includes('/feed') ||
        currentUrl.includes('/mynetwork') ||
        currentUrl.includes('/jobs');

      if (isLoggedIn) {
        this.logger.log(`User ${userId} already logged in to LinkedIn`);
      } else {
        this.logger.log(`User ${userId} needs to log in to LinkedIn`);
        // Wait for manual login through the frontend interface
        // The session will emit events when login is successful
      }

      // Log activity
      await this.supabaseService.logActivity({
        user_id: userId,
        campaign_id: campaign.id,
        job_type: 'automation',
        log_level: 'info',
        message: 'LinkedIn automation session started',
        context: { url: currentUrl },
      });

      // Run the automation function
      this.logger.log(`Running automation function for user ${userId}`);
      const result = await runFn({
        browser: session.browser,
        page: session.page,
        campaign,
        accountData,
      });

      // Log successful completion
      await this.supabaseService.logActivity({
        user_id: userId,
        campaign_id: campaign.id,
        job_type: 'automation',
        log_level: 'info',
        message: 'LinkedIn automation completed successfully',
      });

      this.logger.log(`Automation completed successfully for user ${userId}`);
      return result;
    } catch (error) {
      this.logger.error(`Automation failed for user ${userId}:`, error);

      // Log error
      await this.supabaseService.logActivity({
        user_id: userId,
        campaign_id: campaign.id,
        job_type: 'automation',
        log_level: 'error',
        message: `LinkedIn automation failed: ${error.message}`,
        context: {
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        },
      });

      throw error;
    }
  }

  /**
   * Detect if a captcha or verification is present on the page
   */
  async detectCaptcha(page: Page): Promise<boolean> {
    try {
      const captchaSelectors = [
        // Common captcha selectors
        '[data-testid="captcha"]',
        '[class*="captcha"]',
        '[id*="captcha"]',
        // LinkedIn specific verification
        '[data-testid="challenge-dialog"]',
        '[class*="challenge"]',
        '[id*="challenge"]',
        // Phone verification
        '[data-testid="phone-verification"]',
        '[class*="phone"]',
        '[id*="phone"]',
        // Security check
        '[data-testid="security-check"]',
        '[class*="security"]',
        '[id*="security"]',
        // Ukrainian text patterns
        'button:contains("почати пазл")',
        'button:contains("розпочати")',
        'button:contains("підтвердити")',
        // English text patterns
        'button:contains("Start puzzle")',
        'button:contains("Verify")',
        'button:contains("Confirm")',
      ];

      for (const selector of captchaSelectors) {
        try {
          const element = await page.$(selector);
          if (element) {
            this.logger.log(`Captcha detected with selector: ${selector}`);
            return true;
          }
        } catch (error) {
          // Continue checking other selectors
        }
      }

      // Check for captcha-related text in the page
      const pageText = await page.evaluate(() => {
        return document.body.innerText.toLowerCase();
      });

      const captchaKeywords = [
        'captcha',
        'verification',
        'challenge',
        'security check',
        'почати пазл',
        'розпочати',
        'підтвердити',
        'верифікація',
      ];

      for (const keyword of captchaKeywords) {
        if (pageText.includes(keyword)) {
          this.logger.log(`Captcha detected with keyword: ${keyword}`);
          return true;
        }
      }

      return false;
    } catch (error) {
      this.logger.error('Error detecting captcha:', error);
      return false;
    }
  }

  /**
   * Wait for captcha solution and handle manual mode
   */
  async waitForCaptchaSolution(page: Page, userId: string): Promise<void> {
    this.logger.log(`[${userId}] Waiting for captcha solution...`);

    // Set extended timeouts for captcha resolution
    await page.setDefaultTimeout(300000); // 5 minutes
    await page.setDefaultNavigationTimeout(300000); // 5 minutes

    // Wait for either login success or page change
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return (
          url.includes('/feed') ||
          url.includes('/mynetwork') ||
          url.includes('/jobs') ||
          url.includes('/checkpoint') ||
          url.includes('/challenge')
        );
      },
      { timeout: 300000 },
    );

    this.logger.log(`[${userId}] Captcha solution completed`);
  }

  /**
   * Enable manual mode for captcha handling
   */
  async enableManualMode(userId: string): Promise<void> {
    const session = await this.sessionService.getSession(userId);
    if (!session || !session.page) {
      throw new Error('No active session found');
    }

    // Set extended timeouts
    await session.page.setDefaultTimeout(300000); // 5 minutes
    await session.page.setDefaultNavigationTimeout(300000); // 5 minutes

    this.logger.log(`[${userId}] Manual mode enabled with extended timeouts`);
  }

  /**
   * Get current page HTML for DOM synchronization
   */
  async getPageHTML(userId: string): Promise<string> {
    const session = await this.sessionService.getSession(userId);
    if (!session || !session.page) {
      throw new Error('No active session found');
    }

    return await session.page.content();
  }

  /**
   * Execute DOM action in the browser
   */
  async executeDOMAction(userId: string, action: any): Promise<void> {
    const session = await this.sessionService.getSession(userId);
    if (!session || !session.page) {
      throw new Error('No active session found');
    }

    switch (action.type) {
      case 'click':
        if (action.selector) {
          await session.page.click(action.selector);
        } else if (action.x !== undefined && action.y !== undefined) {
          await session.page.mouse.click(action.x, action.y);
        }
        break;

      case 'input':
        if (action.selector && action.value !== undefined) {
          await session.page.type(action.selector, action.value);
        }
        break;

      case 'submit':
        if (action.selector) {
          await session.page.evaluate((selector: string) => {
            const form = document.querySelector(selector) as HTMLFormElement;
            if (form) form.submit();
          }, action.selector);
        }
        break;

      case 'refresh':
        await session.page.reload();
        break;

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Check if user has active LinkedIn session
   */
  async hasActiveSession(userId: string): Promise<boolean> {
    const session = await this.sessionService.getSession(userId);
    return session !== null;
  }

  /**
   * Get session info for user
   */
  async getSessionInfo(userId: string): Promise<BrowserSessionInfo | null> {
    return this.sessionService.getSession(userId);
  }

  async getCDPSession(userId: string): Promise<any | null> {
    return this.sessionService.getCDPSession(userId);
  }

  setLoginSuccessCallback(userId: string, callback: () => void): void {
    this.sessionService.setLoginSuccessCallback(userId, callback);
  }

  /**
   * Close session for user
   */
  async closeSession(userId: string): Promise<void> {
    await this.sessionService.closeSession(userId);
  }

  /**
   * Handle page navigation and detect LinkedIn login success
   */
  async handlePageNavigation(userId: string, url: string): Promise<boolean> {
    const session = await this.sessionService.getSession(userId);
    if (!session) return false;

    if (
      url.includes('/feed') ||
      url.includes('/mynetwork') ||
      url.includes('/jobs')
    ) {
      this.logger.log(`User ${userId} successfully logged in to LinkedIn`);
      return true;
    }

    return false;
  }

  /**
   * Verify LinkedIn account credentials are valid
   */
  async verifyLinkedInAccount(userId: string): Promise<LinkedInAccount> {
    const account = await this.supabaseService.getLinkedInAccount(userId);

    if (!account) {
      throw new Error(`LinkedIn account not found for user: ${userId}`);
    }

    const linkedinAccount = account[0] as LinkedInAccount;

    if (!linkedinAccount.is_active) {
      throw new Error(`LinkedIn account is inactive for user: ${userId}`);
    }

    return linkedinAccount;
  }

  /**
   * Send LinkedIn connection request
   */
  async sendConnectionRequest(
    page: Page,
    profileUrl: string,
    message?: string,
  ): Promise<void> {
    this.logger.debug(`Sending connection request to ${profileUrl}`);

    try {
      await page.goto(profileUrl, { waitUntil: 'networkidle2' });
      await this.delay(2000, 5000);

      // Look for connect button
      const connectBtn = await page.$(
        'button[aria-label*="Invite"], button[data-control-name="connect"]',
      );

      if (!connectBtn) {
        throw new Error('Connect button not found');
      }

      await connectBtn.click();
      await this.delay(1000, 3000);

      // Handle connection note if provided
      if (message) {
        const addNoteBtn = await page.$('button[aria-label="Add a note"]');
        if (addNoteBtn) {
          await addNoteBtn.click();
          await this.delay(1000, 2000);

          const textarea = await page.$('textarea');
          if (textarea) {
            await textarea.type(message.slice(0, 200), { delay: 100 });
          }
        }
      }

      // Send invitation
      const sendBtn = await page.$(
        'button[aria-label*="Send"], button[data-control-name="connect"]',
      );
      if (sendBtn) {
        await sendBtn.click();
        await this.delay(2000, 4000);
      }

      this.logger.debug(`Connection request sent to ${profileUrl}`);
    } catch (error) {
      this.logger.error(
        `Failed to send connection request to ${profileUrl}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Send LinkedIn message
   */
  async sendMessage(
    page: Page,
    profileUrl: string,
    message: string,
  ): Promise<void> {
    this.logger.debug(`Sending message to ${profileUrl}`);

    try {
      await page.goto(profileUrl, { waitUntil: 'networkidle2' });
      await this.delay(2000, 5000);

      // Look for message button
      const messageBtn = await page.$(
        'button[aria-label*="Message"], a[data-control-name="message"]',
      );

      if (!messageBtn) {
        throw new Error('Message button not found');
      }

      await messageBtn.click();
      await this.delay(2000, 4000);

      // Wait for message compose area
      const messageBox = await page.waitForSelector(
        '.msg-form__contenteditable',
        { timeout: 10000 },
      );

      if (messageBox) {
        await messageBox.focus();
        await messageBox.type(message, { delay: 100 });
        await this.delay(1000, 2000);

        // Send message
        const sendBtn = await page.$('button[data-control-name="send"]');
        if (sendBtn) {
          await sendBtn.click();
          await this.delay(2000, 4000);
        }
      }

      this.logger.debug(`Message sent to ${profileUrl}`);
    } catch (error) {
      this.logger.error(`Failed to send message to ${profileUrl}:`, error);
      throw error;
    }
  }

  /**
   * Search LinkedIn profiles
   */
  async searchProfiles(
    page: Page,
    searchUrl: string,
    maxResults: number = 10,
  ): Promise<
    Array<{
      url: string;
      name: string;
      headline: string;
      company: string;
    }>
  > {
    this.logger.debug(`Searching LinkedIn profiles: ${searchUrl}`);

    try {
      await page.goto(searchUrl, { waitUntil: 'networkidle2' });
      await this.delay(2000, 5000);

      // Wait for search results
      await page.waitForSelector('ul[role="list"]', { timeout: 30000 });

      const profiles = await page.$$eval(
        'ul[role="list"] > li',
        (items: any[]) =>
          items.slice(0, maxResults).map((li) => {
            const anchor = li.querySelector(
              'a[href^="https://www.linkedin.com/in"]',
            );
            const url = anchor?.href.split('?')[0] || '';
            const name =
              li
                .querySelector('span[dir="ltr"]')
                ?.innerText.split(' View')[0]
                .trim() || '';
            const headline =
              li.querySelector('div.t-14.t-black.t-normal')?.innerText.trim() ||
              '';
            const companyMatch = li
              .querySelector('p.entity-result__summary--2-lines')
              ?.innerText.match(/Current:\s*(?:.*? at )?(.+)$/i);

            return {
              url,
              name,
              headline,
              company: companyMatch?.[1] || '',
            };
          }),
      );

      this.logger.debug(`Found ${profiles.length} profiles`);
      return profiles.filter((p) => p.url && p.name);
    } catch (error) {
      this.logger.error(`Failed to search profiles:`, error);
      throw error;
    }
  }

  /**
   * Create human-like delay
   */
  private delay(minMs = 5000, maxMs = 15000): Promise<void> {
    const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Personalize message template
   */
  personalizeMessage(
    template: string,
    fullName: string,
    company: string,
  ): string {
    const [firstName, ...rest] = fullName.split(' ');
    return template
      .replace(/\{\{firstName\}\}/g, firstName)
      .replace(/\{\{lastName\}\}/g, rest.join(' '))
      .replace(/\{\{company\}\}/g, company);
  }

  /**
   * Extract profile information from LinkedIn page
   */
  async extractProfileInfo(page: Page): Promise<{
    name: string;
    headline: string;
    company: string;
    location: string;
  }> {
    try {
      const profileInfo = await page.evaluate(() => {
        const name =
          document
            .querySelector('h1.text-heading-xlarge')
            ?.textContent?.trim() || '';
        const headline =
          document
            .querySelector('.text-body-medium.break-words')
            ?.textContent?.trim() || '';
        const company =
          document
            .querySelector('.inline-show-more-text .visually-hidden')
            ?.textContent?.trim() || '';
        const location =
          document
            .querySelector('.text-body-small.inline.t-black--light.break-words')
            ?.textContent?.trim() || '';

        return { name, headline, company, location };
      });

      return profileInfo;
    } catch (error) {
      this.logger.error('Failed to extract profile info:', error);
      return { name: '', headline: '', company: '', location: '' };
    }
  }
}
