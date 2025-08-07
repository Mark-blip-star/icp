import { Module } from '@nestjs/common';
import { SimpleWebsocketGateway } from './simple-websocket.gateway';
import { LinkedInModule } from '../linkedin/linkedin.module';

@Module({
  imports: [LinkedInModule],
  providers: [SimpleWebsocketGateway],
  exports: [SimpleWebsocketGateway],
})
export class WebsocketModule {} 