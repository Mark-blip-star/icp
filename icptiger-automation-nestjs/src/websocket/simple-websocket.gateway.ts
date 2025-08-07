import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { LinkedInAutomationService } from '../linkedin/automation.service';
import { SessionService } from '../browser/session.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SimpleWebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SimpleWebsocketGateway.name);
  private userSockets = new Map<string, Socket>();

  constructor(
    private linkedInAutomationService: LinkedInAutomationService,
    private sessionService: SessionService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (userId) {
      this.userSockets.set(userId, client);
      this.logger.log(`[${userId}] Client connected`);
    } else {
      this.logger.warn('Client connected without user_id');
    }
  }

  async handleDisconnect(client: Socket) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`[${userId}] Client disconnected`);
    }
  }

  @SubscribeMessage('dom-action')
  async handleDOMAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() action: any,
  ) {
    const userId = this.getUserIdFromClient(client);
    if (!userId) {
      client.emit('error', { message: 'User ID not provided' });
      return;
    }

    this.logger.log(`[${userId}] DOM action received:`, action);

    try {
      const session = await this.sessionService.getSession(userId);
      if (!session || !session.page || session.page.isClosed()) {
        client.emit('dom-action-error', { message: 'No active session found' });
        return;
      }

      // Execute the action in Puppeteer
      await this.executeDOMAction(session.page, action);

      // Send success response
      client.emit('dom-action-success', {
        message: 'Action executed successfully',
        action: action,
      });

      // Check if new captcha appeared after action
      const pageHTML = await session.page.content();

      // Check for actual captcha (not just the initial screen)
      const hasActualCaptcha = await session.page.evaluate(() => {
        // Look for actual captcha elements (not just start button)
        const captchaElements = document.querySelectorAll(
          '[id*="captcha"]:not([class*="hidden"]), [class*="captcha"]:not([class*="hidden"])',
        );
        const puzzleElements = document.querySelectorAll(
          '[id*="puzzle"], [class*="puzzle"]',
        );
        const interactiveCaptcha = document.querySelectorAll(
          'canvas, iframe[src*="captcha"], div[class*="captcha"]:not([class*="hidden"])',
        );

        return (
          captchaElements.length > 0 ||
          puzzleElements.length > 0 ||
          interactiveCaptcha.length > 0
        );
      });

      if (hasActualCaptcha) {
        this.logger.log(`[${userId}] Actual captcha detected after action`);
        client.emit('captcha-detected', { html: pageHTML });
      } else if (
        pageHTML.includes('captcha') ||
        pageHTML.includes('verification')
      ) {
        this.logger.log(`[${userId}] Captcha screen detected after action`);
        client.emit('captcha-detected', { html: pageHTML });
      }
    } catch (error) {
      this.logger.error(`[${userId}] DOM action error:`, error);
      client.emit('dom-action-error', {
        message: 'Failed to execute action',
        error: error.message,
      });
    }
  }

  @SubscribeMessage('captcha-detected')
  async handleCaptchaDetected(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userId = this.getUserIdFromClient(client);
    if (!userId) {
      client.emit('error', { message: 'User ID not provided' });
      return;
    }

    this.logger.log(`[${userId}] Captcha detected, storing session...`);

    try {
      // Store the existing browser and page session
      await this.sessionService.storeExistingSession(
        userId,
        data.browser,
        data.page,
      );

      this.logger.log(`[${userId}] Session stored successfully`);

      // Forward the captcha HTML to the frontend
      client.emit('captcha-detected', { html: data.html });
    } catch (error) {
      this.logger.error(`[${userId}] Failed to store session:`, error);
      client.emit('error', {
        message: 'Failed to store session',
        error: error.message,
      });
    }
  }

  @SubscribeMessage('get-page-html')
  async handleGetPageHTML(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userId = this.getUserIdFromClient(client);
    if (!userId) {
      client.emit('error', { message: 'User ID not provided' });
      return;
    }

    this.logger.log(`[${userId}] Get page HTML requested`);

    try {
      const session = await this.sessionService.getSession(userId);
      if (!session || !session.page || session.page.isClosed()) {
        client.emit('error', { message: 'No active session found' });
        return;
      }

      const html = await session.page.content();
      client.emit('page-html', { html });
    } catch (error) {
      this.logger.error(`[${userId}] Get page HTML error:`, error);
      client.emit('error', { message: 'Failed to get page HTML' });
    }
  }

  @SubscribeMessage('enable-manual-mode')
  async handleEnableManualMode(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    const userId = this.getUserIdFromClient(client);
    if (!userId) {
      client.emit('error', { message: 'User ID not provided' });
      return;
    }

    this.logger.log(`[${userId}] Enable manual mode requested`);

    try {
      const session = await this.sessionService.getSession(userId);
      if (!session || !session.page || session.page.isClosed()) {
        client.emit('error', { message: 'No active session found' });
        return;
      }

      // Set extended timeouts for manual mode
      await session.page.setDefaultTimeout(300000); // 5 minutes
      await session.page.setDefaultNavigationTimeout(300000); // 5 minutes

      client.emit('manual-mode-enabled', {
        message: 'Manual mode enabled with extended timeouts',
      });
    } catch (error) {
      this.logger.error(`[${userId}] Enable manual mode error:`, error);
      client.emit('error', {
        message: 'Failed to enable manual mode',
        error: error.message,
      });
    }
  }

  private getUserIdFromClient(client: Socket): string | null {
    const query = client.handshake.query as any;
    return (query.user_id as string) || null;
  }

  private async executeDOMAction(page: any, action: any): Promise<void> {
    switch (action.type) {
      case 'click':
        if (action.selector) {
          try {
            await page.click(action.selector);
          } catch (error) {
            // Якщо селектор не знайдено, спробуємо знайти кнопку за текстом
            if (action.selector === 'button') {
              await page.evaluate(() => {
                const buttons = document.querySelectorAll(
                  'button, a, [role="button"]',
                );
                for (const button of buttons) {
                  const text = button.textContent?.trim();
                  if (
                    text &&
                    (text.includes('пазл') ||
                      text.includes('puzzle') ||
                      text.includes('розпочати'))
                  ) {
                    (button as HTMLElement).click();
                    return;
                  }
                }
              });
            } else {
              throw error;
            }
          }
        } else if (action.x !== undefined && action.y !== undefined) {
          await page.mouse.click(action.x, action.y);
        }
        break;

      case 'input':
        if (action.selector && action.value !== undefined) {
          await page.type(action.selector, action.value);
        }
        break;

      case 'submit':
        if (action.selector) {
          await page.evaluate((selector: string) => {
            const form = document.querySelector(selector) as HTMLFormElement;
            if (form) form.submit();
          }, action.selector);
        }
        break;

      case 'refresh':
        await page.reload();
        break;

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  async sendToUser(userId: string, event: string, data: any): Promise<void> {
    const client = this.userSockets.get(userId);
    if (client && client.connected) {
      client.emit(event, data);
      this.logger.log(`[${userId}] Sent event: ${event}`);
    } else {
      this.logger.warn(
        `[${userId}] Client not found or not connected for event: ${event}`,
      );
    }
  }

  async broadcast(event: string, data: any): Promise<void> {
    for (const client of this.userSockets.values()) {
      if (client.connected) {
        client.emit(event, data);
      }
    }
  }

  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }
}
