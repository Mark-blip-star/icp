import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LinkedInAutomationService } from '../linkedin/automation.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class SimpleWebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SimpleWebsocketGateway.name);
  private userSockets = new Map<string, Socket>();

  constructor(private linkedInAutomationService: LinkedInAutomationService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) {
      this.logger.warn('Connection attempt without user_id');
      client.disconnect();
      return;
    }

    this.logger.log(
      `[${userId}] New socket connection from ${client.handshake.address}`,
    );
    this.userSockets.set(userId, client);

    client.join(`user_${userId}`);
    client.emit('connected', {
      message: 'Successfully connected to automation server',
      userId,
    });

    const hasSession =
      await this.linkedInAutomationService.hasActiveSession(userId);

    if (hasSession) {
      const session =
        await this.linkedInAutomationService.getSessionInfo(userId);
      this.logger.log(
        `[${userId}] Found existing session, current URL: ${session?.page?.url()}`,
      );

      client.emit('readyForLogin', {
        message: 'LinkedIn session already active, ready for interaction',
        url: session?.page?.url(),
      });

      await this.startCDPScreencast(userId, client);
    } else {
      this.logger.log(
        `[${userId}] No existing session found, starting fresh login flow`,
      );
      try {
        await this.linkedInAutomationService.runWithLogin(
          { id: 'temp', status: 'active', user_id: userId } as any,
          { user_id: userId } as any,
          async ({ page }) => {
            this.logger.log(`[${userId}] LinkedIn login page loaded and ready`);

            client.emit('readyForLogin', {
              message: 'LinkedIn login page loaded, ready for user interaction',
              url: page.url(),
            });

            await this.startCDPScreencast(userId, client);
          },
        );
      } catch (error) {
        this.logger.error(`[${userId}] Error launching Puppeteer:`, error);
        client.emit('error', 'Failed to launch LinkedIn login session');
        client.disconnect(true);
        return;
      }
    }
  }

  async handleDisconnect(client: Socket) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (userId) {
      this.userSockets.delete(userId);
      this.logger.log(`[${userId}] User disconnected`);

      await this.stopCDPScreencast(userId, client);
    }
  }

  @SubscribeMessage('startLogin')
  async handleStartLogin(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) {
      client.emit('error', 'User ID not provided');
      return;
    }

    this.logger.log(`[${userId}] Start login requested`);

    try {
      const hasSession =
        await this.linkedInAutomationService.hasActiveSession(userId);

      if (hasSession) {
        const session =
          await this.linkedInAutomationService.getSessionInfo(userId);
        if (session && session.page) {
          this.logger.log(
            `[${userId}] Reusing existing session, URL: ${session.page.url()}`,
          );

          this.linkedInAutomationService.setLoginSuccessCallback(userId, () => {
            client.emit('loginSuccess', {
              message: 'Successfully logged in to LinkedIn',
              url: session.page.url(),
            });
          });

          await this.startCDPScreencast(userId, client);

          client.emit('loginStarted', {
            message: 'LinkedIn login session started',
            url: session.page.url(),
          });
        }
      } else {
        await this.linkedInAutomationService.runWithLogin(
          { id: 'temp', status: 'active', user_id: userId } as any,
          { user_id: userId } as any,
          async ({ page }) => {
            this.logger.log(`[${userId}] LinkedIn login page loaded and ready`);

            this.linkedInAutomationService.setLoginSuccessCallback(
              userId,
              () => {
                client.emit('loginSuccess', {
                  message: 'Successfully logged in to LinkedIn',
                  url: page.url(),
                });
              },
            );

            await this.startCDPScreencast(userId, client);

            client.emit('loginStarted', {
              message: 'LinkedIn login session started',
              url: page.url(),
            });
          },
        );
      }
    } catch (error) {
      this.logger.error(`[${userId}] Error starting login:`, error);
      client.emit('error', 'Failed to start LinkedIn login session');
    }
  }

  @SubscribeMessage('launchLinkedInLogin')
  async handleLaunchLinkedInLogin(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) {
      client.emit('error', 'User ID not provided');
      return;
    }

    this.logger.log(
      `[${userId}] LinkedIn login requested - launching real browser session`,
    );

    try {
      // Create actual LinkedIn session using automation service
      await this.linkedInAutomationService.runWithLogin(
        { id: 'temp', status: 'active' } as any, // Mock campaign for session creation
        { user_id: userId } as any, // Mock account data
        async ({ page }) => {
          this.logger.log(`[${userId}] LinkedIn login page loaded and ready`);

          // Emit ready event to frontend
          client.emit('readyForLogin', {
            message: 'LinkedIn login page loaded, ready for user interaction',
            url: page.url(),
          });

          // Keep session alive for user interaction
          // The session will be managed by SessionService
        },
      );
    } catch (error) {
      this.logger.error(
        `[${userId}] Failed to launch LinkedIn session:`,
        error,
      );
      client.emit(
        'error',
        `Failed to launch LinkedIn session: ${error.message}`,
      );
    }
  }

  @SubscribeMessage('mouse')
  async handleMouseEvent(
    @MessageBody() event: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) return;

    this.logger.log(
      `[${userId}] Mouse event: ${event.type} at (${event.x}, ${event.y})`,
    );
    console.log(`[${userId}] Mouse event received:`, event);
    console.log(`[${userId}] Event details:`, {
      type: event.type,
      x: event.x,
      y: event.y,
      timestamp: new Date().toISOString(),
    });

    try {
      const session =
        await this.linkedInAutomationService.getSessionInfo(userId);
      console.log(`[${userId}] Session found:`, !!session);
      console.log(`[${userId}] Page exists:`, !!session?.page);
      console.log(`[${userId}] Page URL:`, session?.page?.url());
      console.log(`[${userId}] Page closed:`, session?.page?.isClosed());

      if (session && session.page && !session.page.isClosed()) {
        console.log(
          `[${userId}] Executing mouse action: ${event.type} at (${event.x}, ${event.y})`,
        );

        try {
          await session.page.mouse.move(event.x, event.y);
          console.log(`[${userId}] Mouse moved to (${event.x}, ${event.y})`);

          if (event.type === 'click') {
            await session.page.mouse.click(event.x, event.y);
            console.log(
              `[${userId}] Mouse clicked at (${event.x}, ${event.y})`,
            );

            try {
              const elementAtPoint = await session.page.evaluate(
                (x, y) => {
                  const element = document.elementFromPoint(x, y);
                  if (element) {
                    return {
                      tagName: element.tagName,
                      id: element.id,
                      className: element.className,
                      type: element.getAttribute('type'),
                      placeholder: element.getAttribute('placeholder'),
                      text: element.textContent?.substring(0, 50),
                    };
                  }
                  return null;
                },
                event.x,
                event.y,
              );
              console.log(
                `[${userId}] Element at click point:`,
                elementAtPoint,
              );
            } catch (evalError) {
              console.log(
                `[${userId}] Error evaluating element at point:`,
                evalError.message,
              );
            }

            try {
              await session.page.evaluate(() => {
                const activeElement = document.activeElement as HTMLElement;
                if (
                  activeElement &&
                  (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA')
                ) {
                  activeElement.focus();
                  console.log(
                    'Focused on:',
                    activeElement.tagName,
                    activeElement.getAttribute('type'),
                  );
                }
              });
            } catch (focusError) {
              console.log(`[${userId}] Focus error:`, focusError.message);
            }

            try {
              const elementAtPoint = await session.page.evaluate(
                (x, y) => {
                  const element = document.elementFromPoint(x, y);
                  return element ? element.tagName : null;
                },
                event.x,
                event.y,
              );

              if (elementAtPoint !== 'INPUT' && elementAtPoint !== 'BUTTON') {
                console.log(
                  `[${userId}] Click didn't hit target element, trying selectors...`,
                );

                const passwordField = await session.page.$(
                  'input[type="password"]',
                );
                if (passwordField) {
                  const box = await passwordField.boundingBox();
                  if (box) {
                    const centerX = box.x + box.width / 2;
                    const centerY = box.y + box.height / 2;
                    console.log(
                      `[${userId}] Found password field at (${centerX}, ${centerY})`,
                    );

                    if (
                      Math.abs(event.x - centerX) < 100 &&
                      Math.abs(event.y - centerY) < 50
                    ) {
                      await session.page.mouse.click(centerX, centerY);
                      console.log(
                        `[${userId}] Clicked on password field center`,
                      );
                    }
                  }
                }

                const signInButton = await session.page.$(
                  'button[type="submit"]',
                );
                if (signInButton) {
                  const box = await signInButton.boundingBox();
                  if (box) {
                    const centerX = box.x + box.width / 2;
                    const centerY = box.y + box.height / 2;
                    console.log(
                      `[${userId}] Found sign in button at (${centerX}, ${centerY})`,
                    );

                    if (
                      Math.abs(event.x - centerX) < 100 &&
                      Math.abs(event.y - centerY) < 50
                    ) {
                      await session.page.mouse.click(centerX, centerY);
                      console.log(
                        `[${userId}] Clicked on sign in button center`,
                      );
                    }
                  }
                }
              }
            } catch (selectorError) {
              console.log(
                `[${userId}] Selector fallback error:`,
                selectorError.message,
              );
            }
          }
        } catch (mouseError) {
          console.error(`[${userId}] Mouse action failed:`, mouseError);
          if (
            mouseError.message.includes('Session closed') ||
            mouseError.message.includes('page has been closed')
          ) {
            console.log(
              `[${userId}] Page was closed, attempting to recreate session...`,
            );
            await this.recreateSession(userId, client);
          }
        }
      } else {
        console.log(
          `[${userId}] No session, page, or page is closed for mouse event`,
        );
        if (session?.page?.isClosed()) {
          console.log(
            `[${userId}] Page is closed, attempting to recreate session...`,
          );
          await this.recreateSession(userId, client);
        }
      }
    } catch (error) {
      this.logger.error(`[${userId}] Mouse event error:`, error);
      console.error(`[${userId}] Mouse event error details:`, error);
    }
  }

  @SubscribeMessage('keyboard')
  async handleKeyboardEvent(
    @MessageBody() event: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) return;

    this.logger.log(`[${userId}] Keyboard event: ${event.type} - ${event.key}`);
    console.log(`[${userId}] Keyboard event received:`, event);
    console.log(`[${userId}] Keyboard details:`, {
      type: event.type,
      key: event.key,
      timestamp: new Date().toISOString(),
    });

    try {
      const session =
        await this.linkedInAutomationService.getSessionInfo(userId);
      console.log(`[${userId}] Keyboard - Session found:`, !!session);
      console.log(`[${userId}] Keyboard - Page exists:`, !!session?.page);
      console.log(
        `[${userId}] Keyboard - Page closed:`,
        session?.page?.isClosed(),
      );

      if (session && session.page && !session.page.isClosed()) {
        try {
          // Фронтенд отправляет type: "press", key: "a"
          if (event.type === 'press') {
            // Для обычных символов используем type, для специальных клавиш - press
            if (event.key.length === 1) {
              await session.page.keyboard.type(event.key);
              console.log(`[${userId}] Key typed: ${event.key}`);
            } else {
              await session.page.keyboard.press(event.key);
              console.log(`[${userId}] Key pressed: ${event.key}`);
            }
          }
        } catch (keyboardError) {
          console.error(`[${userId}] Keyboard action failed:`, keyboardError);
          if (
            keyboardError.message.includes('Session closed') ||
            keyboardError.message.includes('page has been closed')
          ) {
            console.log(
              `[${userId}] Page was closed during keyboard event, attempting to recreate session...`,
            );
            await this.recreateSession(userId, client);
          }
        }
      } else {
        console.log(
          `[${userId}] No session, page, or page is closed for keyboard event`,
        );
        if (session?.page?.isClosed()) {
          console.log(
            `[${userId}] Page is closed during keyboard event, attempting to recreate session...`,
          );
          await this.recreateSession(userId, client);
        }
      }
    } catch (error) {
      this.logger.error(`[${userId}] Keyboard event error:`, error);
      console.error(`[${userId}] Keyboard event error details:`, error);
    }
  }

  @SubscribeMessage('scroll')
  async handleScrollEvent(
    @MessageBody() event: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) return;

    this.logger.log(
      `[${userId}] Scroll event: ${event.type} - ${event.deltaY}`,
    );
    console.log(`[${userId}] Scroll event received:`, event);

    try {
      const session =
        await this.linkedInAutomationService.getSessionInfo(userId);

      if (session && session.page && !session.page.isClosed()) {
        try {
          if (event.type === 'wheel') {
            await session.page.evaluate((deltaY) => {
              window.scrollBy(0, deltaY);
            }, event.deltaY);
            console.log(`[${userId}] Scrolled by: ${event.deltaY}`);
          }
        } catch (scrollError) {
          console.error(`[${userId}] Scroll action failed:`, scrollError);
        }
      } else {
        console.log(
          `[${userId}] No session, page, or page is closed for scroll event`,
        );
      }
    } catch (error) {
      this.logger.error(`[${userId}] Scroll event error:`, error);
    }
  }

  @SubscribeMessage('getScreenshot')
  async handleGetScreenshot(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) return;

    this.logger.log(`[${userId}] Screenshot requested`);

    try {
      const session =
        await this.linkedInAutomationService.getSessionInfo(userId);
      if (session && session.page) {
        const screenshot = await session.page.screenshot({
          type: 'png',
        });

        client.emit('screencast', screenshot.toString());
      } else {
        client.emit(
          'screencast',
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        );
      }
    } catch (error) {
      this.logger.error(`[${userId}] Screenshot error:`, error);
      client.emit(
        'screencast',
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      );
    }
  }

  @SubscribeMessage('closeSession')
  async handleCloseSession(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) return;

    this.logger.log(`[${userId}] Session close requested`);

    try {
      await this.linkedInAutomationService.closeSession(userId);
      client.emit('sessionClosed', { message: 'Session closed successfully' });
    } catch (error) {
      this.logger.error(`[${userId}] Session close error:`, error);
      client.emit('sessionClosed', { message: 'Session closed with errors' });
    }
  }

  @SubscribeMessage('getSessionStatus')
  async handleGetSessionStatus(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    const query = client.handshake.query as any;
    const userId = query.user_id as string;

    if (!userId) return;

    try {
      const hasSession =
        await this.linkedInAutomationService.hasActiveSession(userId);
      const session = hasSession
        ? await this.linkedInAutomationService.getSessionInfo(userId)
        : null;

      client.emit('sessionStatus', {
        hasSession,
        isLoggedIn: session?.isLoggedIn || false,
        url: session?.page?.url() || null,
      });
    } catch (error) {
      this.logger.error(`[${userId}] Session status error:`, error);
      client.emit('sessionStatus', {
        hasSession: false,
        isLoggedIn: false,
        url: null,
      });
    }
  }

  async sendToUser(userId: string, event: string, data: any): Promise<void> {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  async broadcast(event: string, data: any): Promise<void> {
    this.server.emit(event, data);
  }

  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  private async startCDPScreencast(
    userId: string,
    client: Socket,
  ): Promise<void> {
    try {
      const session =
        await this.linkedInAutomationService.getSessionInfo(userId);
      if (!session || !session.clientSession) {
        this.logger.error(
          `[${userId}] No session or CDP session found for screencast`,
        );
        return;
      }

      const isScreencastRunning = (session as any).screencastRunning;
      if (isScreencastRunning) {
        console.log(`[${userId}] Screencast already running, skipping...`);
        return;
      }

      if (!session.clientSession._screencastHandlerSet) {
        session.clientSession.on(
          'Page.screencastFrame',
          async ({ data, sessionId }) => {
            try {
              client.emit('screencast', data);
              await session.clientSession.send('Page.screencastFrameAck', {
                sessionId,
              });
            } catch (error) {
              this.logger.error(
                `[${userId}] Error handling screencast frame:`,
                error,
              );
            }
          },
        );
        session.clientSession._screencastHandlerSet = true;
        console.log(`[${userId}] Screencast frame handler set up`);
      }

      await session.clientSession.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 80,
        everyNthFrame: 1,
      });

      (session as any).screencastRunning = true;

      this.logger.log(`[${userId}] CDP screencast started`);
    } catch (error) {
      this.logger.error(`[${userId}] Error starting CDP screencast:`, error);
    }
  }

  private async stopCDPScreencast(
    userId: string,
    client: Socket,
  ): Promise<void> {
    try {
      const session =
        await this.linkedInAutomationService.getSessionInfo(userId);
      if (session && session.clientSession) {
        await session.clientSession.send('Page.stopScreencast');
        (session as any).screencastRunning = false;
        this.logger.log(`[${userId}] CDP screencast stopped`);
      }
    } catch (error) {
      this.logger.error(`[${userId}] Error stopping CDP screencast:`, error);
    }
  }

  private async recreateSession(userId: string, client: Socket): Promise<void> {
    try {
      console.log(`[${userId}] Recreating session...`);

      await this.linkedInAutomationService.closeSession(userId);

      await this.linkedInAutomationService.runWithLogin(
        { id: 'temp', status: 'active', user_id: userId } as any,
        { user_id: userId } as any,
        async ({ page }) => {
          console.log(`[${userId}] New session created, URL: ${page.url()}`);

          this.linkedInAutomationService.setLoginSuccessCallback(userId, () => {
            client.emit('loginSuccess', {
              message: 'Successfully logged in to LinkedIn',
              url: page.url(),
            });
          });

          await this.startCDPScreencast(userId, client);

          client.emit('loginStarted', {
            message: 'LinkedIn session recreated and ready',
            url: page.url(),
          });
        },
      );

      console.log(`[${userId}] Session recreated successfully`);
    } catch (error) {
      console.error(`[${userId}] Error recreating session:`, error);
      client.emit('error', 'Failed to recreate session');
    }
  }
}
