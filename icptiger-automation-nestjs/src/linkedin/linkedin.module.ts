import { Module } from '@nestjs/common';
import { LinkedInAutomationService } from './automation.service';
import { LinkedInSettingsService } from './settings.service';
import { DatabaseModule } from '../database/database.module';
import { BrowserModule } from '../browser/browser.module';

@Module({
  imports: [DatabaseModule, BrowserModule],
  providers: [LinkedInAutomationService, LinkedInSettingsService],
  exports: [LinkedInAutomationService, LinkedInSettingsService],
})
export class LinkedInModule {} 