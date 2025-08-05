import { Module } from '@nestjs/common';
import { SimpleWebsocketGateway } from './simple-websocket.gateway';
import { LinkedInModule } from '../linkedin/linkedin.module';
import { BrowserModule } from '../browser/browser.module';

@Module({
  imports: [LinkedInModule, BrowserModule],
  providers: [SimpleWebsocketGateway],
  exports: [SimpleWebsocketGateway],
})
export class WebsocketModule {} 