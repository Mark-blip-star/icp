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
   * Run LinkedIn automation with login (WebSocket approach)
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
        this.logger.log(
          `User ${userId} not logged in, waiting for manual login`,
        );
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

  setScreenshotUpdateCallback(userId: string, callback: () => void): void {
    this.sessionService.setScreenshotUpdateCallback(userId, callback);
  }

  setShowCanvasCallback(userId: string, callback: () => void): void {
    this.sessionService.setShowCanvasCallback(userId, callback);
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
   * Test LinkedIn connection
   */
  async testLinkedInConnection(
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const account = await this.verifyLinkedInAccount(userId);

      this.logger.log(`LinkedIn account verified for user ${userId}`);

      return {
        success: true,
        message: 'LinkedIn account is connected and active',
      };
    } catch (error) {
      this.logger.error(
        `LinkedIn connection test failed for user ${userId}:`,
        error,
      );

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'LinkedIn connection test failed',
      };
    }
  }

  /**
   * Log automation activity
   */
  async logActivity(
    userId: string,
    campaignId: string,
    message: string,
    logLevel: 'info' | 'error' = 'info',
    context?: any,
  ): Promise<void> {
    try {
      await this.supabaseService.logActivity({
        user_id: userId,
        campaign_id: campaignId,
        job_type: 'automation',
        log_level: logLevel,
        message,
        context,
      });
    } catch (error) {
      this.logger.error(`Failed to log activity for user ${userId}:`, error);
    }
  }

  /**
   * Get LinkedIn settings for user
   */
  async getLinkedInSettings(userId: string): Promise<any> {
    return this.linkedinSettingsService.loadLinkedInSettings(userId);
  }

  /**
   * Get remaining quotas for user
   */
  async getRemainingQuotas(userId: string): Promise<any> {
    return this.linkedinSettingsService.getRemainingQuotas(userId);
  }

  /**
   * Check if user has remaining quota
   */
  async hasRemainingQuota(
    userId: string,
    actionType: 'connections' | 'messages' | 'visits' | 'inmails',
    requestedCount: number = 1,
  ): Promise<boolean> {
    return this.linkedinSettingsService.hasRemainingQuota(
      userId,
      actionType,
      requestedCount,
    );
  }
}
