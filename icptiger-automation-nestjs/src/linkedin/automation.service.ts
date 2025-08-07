import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { LinkedInSettingsService } from './settings.service';
import { Campaign, LinkedInAccount } from '../common/types/campaign.types';

@Injectable()
export class LinkedInAutomationService {
  private readonly logger = new Logger(LinkedInAutomationService.name);

  constructor(
    private supabaseService: SupabaseService,
    private linkedinSettingsService: LinkedInSettingsService
  ) {}

  /**
   * Verify LinkedIn account credentials are valid
   */
  async verifyLinkedInAccount(userId: string): Promise<LinkedInAccount> {
    const account = await this.supabaseService
      .getLinkedInAccount(userId);

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
  async testLinkedInConnection(userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const account = await this.verifyLinkedInAccount(userId);
      
      this.logger.log(`LinkedIn account verified for user ${userId}`);
      
      return {
        success: true,
        message: 'LinkedIn account is connected and active'
      };
    } catch (error) {
      this.logger.error(`LinkedIn connection test failed for user ${userId}:`, error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'LinkedIn connection test failed'
      };
    }
  }

  /**
   * Log automation activity
   */
  async logActivity(userId: string, campaignId: string, message: string, logLevel: 'info' | 'error' = 'info', context?: any): Promise<void> {
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
  async hasRemainingQuota(userId: string, actionType: 'connections' | 'messages' | 'visits' | 'inmails', requestedCount: number = 1): Promise<boolean> {
    return this.linkedinSettingsService.hasRemainingQuota(userId, actionType, requestedCount);
  }
} 