import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { LinkedInSettingsService } from './settings.service';
import { LinkedInAutomationService } from './automation.service';

@Module({
  imports: [DatabaseModule],
  providers: [LinkedInSettingsService, LinkedInAutomationService],
  exports: [LinkedInSettingsService, LinkedInAutomationService],
})
export class LinkedInModule {} 