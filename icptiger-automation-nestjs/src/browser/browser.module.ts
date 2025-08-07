import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { PuppeteerService } from './puppeteer.service';
import { SessionService } from './session.service';

@Module({
  imports: [ConfigModule],
  providers: [PuppeteerService, SessionService],
  exports: [PuppeteerService, SessionService],
})
export class BrowserModule {} 