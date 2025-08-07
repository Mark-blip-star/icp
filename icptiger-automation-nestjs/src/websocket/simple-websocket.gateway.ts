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
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { LinkedInAutomationService } from '../linkedin/automation.service';

@WebSocketGateway({
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
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

  constructor(
    private linkedInAutomationService: LinkedInAutomationService
  ) {}

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

    this.logger.log(`[${userId}] New socket connection from ${client.handshake.address}`);
    this.userSockets.set(userId, client);

    client.join(`user_${userId}`);
    client.emit('connected', {
      message: 'Successfully connected to automation server',
      userId,
    });

    const hasSession = await this.linkedInAutomationService.hasActiveSession(userId);
    
    if (hasSession) {
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      this.logger.log(`[${userId}] Found existing session, current URL: ${session?.page?.url()}`);
      
      client.emit('readyForLogin', {
        message: 'LinkedIn session already active, ready for interaction',
        url: session?.page?.url(),
      });
      
      await this.startCDPScreencast(userId, client);
    } else {
      this.logger.log(`[${userId}] No existing session found, starting fresh login flow`);
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
          }
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
      this.logger.log(`[${userId}] Socket disconnected`);
      this.userSockets.delete(userId);
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
      const hasSession = await this.linkedInAutomationService.hasActiveSession(userId);
      
      if (hasSession) {
        const session = await this.linkedInAutomationService.getSessionInfo(userId);
        if (session && session.page) {
          this.logger.log(`[${userId}] Reusing existing session, URL: ${session.page.url()}`);
          
          this.linkedInAutomationService.setLoginSuccessCallback(userId, () => {
            client.emit('loginSuccess', { 
              message: 'Successfully logged in to LinkedIn',
              url: session.page.url()
            });
          });
          
          await this.startCDPScreencast(userId, client);
          
          // Send initial screenshot for existing session
          await this.forceScreenshotUpdate(userId, client, session.page);
          
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
            
            this.linkedInAutomationService.setLoginSuccessCallback(userId, () => {
              client.emit('loginSuccess', { 
                message: 'Successfully logged in to LinkedIn',
                url: page.url()
              });
            });
            
            await this.startCDPScreencast(userId, client);
            
            // Send initial screenshot for new session
            await this.forceScreenshotUpdate(userId, client, page);
            
            client.emit('loginStarted', {
              message: 'LinkedIn login session started',
              url: page.url(),
            });
          }
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

    this.logger.log(`[${userId}] LinkedIn login requested - launching real browser session`);

    try {
      // Create actual LinkedIn session using automation service
      await this.linkedInAutomationService.runWithLogin(
        { id: 'temp', status: 'active' } as any, // Mock campaign for session creation
        { user_id: userId } as any, // Mock account data
        async ({ page }) => {
          this.logger.log(`[${userId}] LinkedIn login page loaded and ready`);
          
          // Start CDP screencast
          await this.startCDPScreencast(userId, client);
          
          // Send initial screenshot
          await this.forceScreenshotUpdate(userId, client, page);
          
          // Emit ready event to frontend
          client.emit('readyForLogin', {
            message: 'LinkedIn login page loaded, ready for user interaction',
            url: page.url(),
          });

          // Keep session alive for user interaction
          // The session will be managed by SessionService
        }
      );
    } catch (error) {
      this.logger.error(`[${userId}] Failed to launch LinkedIn session:`, error);
      client.emit('error', `Failed to launch LinkedIn session: ${error.message}`);
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

    this.logger.log(`[${userId}] Mouse event: ${event.type} at (${event.x}, ${event.y})`);
    console.log(`[${userId}] Mouse event received:`, event);
    console.log(`[${userId}] Event details:`, {
      type: event.type,
      x: event.x,
      y: event.y,
      timestamp: Date.now()
    });

    try {
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      
      if (session && session.page && !session.page.isClosed()) {
        try {
          await session.page.mouse.move(event.x, event.y);
          
          if (event.type === "click") {
            await session.page.mouse.click(event.x, event.y);
            console.log(`[${userId}] ✅ SUCCESS: Mouse clicked at (${event.x}, ${event.y})`);
            
            // Force screenshot update after click
            await this.forceScreenshotUpdate(userId, client, session.page);
            
            // Send input update after click to show current state
            await this.sendInputUpdate(userId, client, session.page);
            
            // Check what element was clicked and focus if it's an input
            try {
              const elementInfo = await session.page.evaluate((x, y) => {
                const element = document.elementFromPoint(x, y);
                if (element) {
                  return {
                    tagName: element.tagName,
                    type: (element as HTMLInputElement).type || '',
                    id: element.id,
                    className: element.className,
                    isInput: element.tagName === 'INPUT' || element.tagName === 'TEXTAREA',
                    isButton: element.tagName === 'BUTTON'
                  };
                }
                return null;
              }, event.x, event.y);
              
              console.log(`[${userId}] Clicked element:`, elementInfo);
              
              // If clicked on input field, ensure it's focused
              if (elementInfo && elementInfo.isInput) {
                await session.page.evaluate((x, y) => {
                  const element = document.elementFromPoint(x, y);
                  if (element && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA')) {
                    // Clear any existing value and focus
                    (element as HTMLInputElement).value = '';
                    (element as HTMLElement).focus();
                    (element as HTMLElement).click();
                    
                    // Ensure cursor is visible (only for supported input types)
                    try {
                      const input = element as HTMLInputElement;
                      if (input.type === 'text' || input.type === 'textarea' || input.type === '') {
                        input.setSelectionRange(0, 0);
                      }
                    } catch (error) {
                      console.log('Error setting selection range:', error.message);
                    }
                    
                    console.log('Input field focused, cleared, and cursor positioned');
                  }
                }, event.x, event.y);
                console.log(`[${userId}] Input field focused and cleared`);
              }
              
              // Fallback for common LinkedIn elements
              if (!elementInfo || (!elementInfo.isInput && !elementInfo.isButton)) {
                console.log(`[${userId}] Click didn't hit target element, trying selectors...`);
                
                // Try to find email field
                const emailField = await session.page.$('input[type="email"], input[name="session_key"], input[placeholder*="email"], input[placeholder*="Email"], input[type="text"]');
                if (emailField) {
                  const box = await emailField.boundingBox();
                  if (box) {
                    const centerX = box.x + box.width / 2;
                    const centerY = box.y + box.height / 2;
                    console.log(`[${userId}] Found email field at (${centerX}, ${centerY})`);
                    
                    if (Math.abs(event.x - centerX) < 150 && Math.abs(event.y - centerY) < 50) {
                      await session.page.mouse.click(centerX, centerY);
                      await emailField.focus();
                      
                      // Clear field and position cursor
                      await session.page.evaluate((element) => {
                        (element as HTMLInputElement).value = '';
                        (element as HTMLElement).focus();
                        try {
                          const input = element as HTMLInputElement;
                          if (input.type === 'text' || input.type === 'textarea' || input.type === '') {
                            input.setSelectionRange(0, 0);
                          }
                        } catch (error) {
                          console.log('Error setting selection range:', error.message);
                        }
                      }, emailField);
                      
                      console.log(`[${userId}] Clicked, focused, and cleared email field`);
                      
                      // Send input field update to frontend
                      const emailFieldInfo = await session.page.evaluate((element) => {
                        return {
                          tagName: element.tagName,
                          type: (element as HTMLInputElement).type || '',
                          id: element.id,
                          className: element.className,
                          value: (element as HTMLInputElement).value || '',
                          placeholder: (element as HTMLInputElement).placeholder || '',
                          cursorPosition: 0
                        };
                      }, emailField);
                      
                      client.emit('inputUpdated', {
                        element: emailFieldInfo,
                        timestamp: Date.now()
                      });
                      console.log(`[${userId}] Sent email field update to frontend:`, emailFieldInfo);
                    }
                  }
                }
                
                // Try to find password field
                const passwordField = await session.page.$('input[type="password"], input[name="session_password"]');
                if (passwordField) {
                  const box = await passwordField.boundingBox();
                  if (box) {
                    const centerX = box.x + box.width / 2;
                    const centerY = box.y + box.height / 2;
                    console.log(`[${userId}] Found password field at (${centerX}, ${centerY})`);
                    
                    if (Math.abs(event.x - centerX) < 150 && Math.abs(event.y - centerY) < 50) {
                      await session.page.mouse.click(centerX, centerY);
                      await passwordField.focus();
                      
                      // Clear field and position cursor
                      await session.page.evaluate((element) => {
                        (element as HTMLInputElement).value = '';
                        (element as HTMLElement).focus();
                        try {
                          const input = element as HTMLInputElement;
                          if (input.type === 'text' || input.type === 'textarea' || input.type === '') {
                            input.setSelectionRange(0, 0);
                          }
                        } catch (error) {
                          console.log('Error setting selection range:', error.message);
                        }
                      }, passwordField);
                      
                      console.log(`[${userId}] Clicked, focused, and cleared password field`);
                      
                      // Send input field update to frontend
                      const passwordFieldInfo = await session.page.evaluate((element) => {
                        return {
                          tagName: element.tagName,
                          type: (element as HTMLInputElement).type || '',
                          id: element.id,
                          className: element.className,
                          value: (element as HTMLInputElement).value || '',
                          placeholder: (element as HTMLInputElement).placeholder || '',
                          cursorPosition: 0
                        };
                      }, passwordField);
                      
                      client.emit('inputUpdated', {
                        element: passwordFieldInfo,
                        timestamp: Date.now()
                      });
                      console.log(`[${userId}] Sent password field update to frontend:`, passwordFieldInfo);
                    }
                  }
                }
                
                // Try to find sign in button
                const signInButton = await session.page.$('button[type="submit"], button:contains("Sign in"), button:contains("Log in")');
                if (signInButton) {
                  const box = await signInButton.boundingBox();
                  if (box) {
                    const centerX = box.x + box.width / 2;
                    const centerY = box.y + box.height / 2;
                    console.log(`[${userId}] Found sign in button at (${centerX}, ${centerY})`);
                    
                    if (Math.abs(event.x - centerX) < 150 && Math.abs(event.y - centerY) < 50) {
                      await session.page.mouse.click(centerX, centerY);
                      console.log(`[${userId}] Clicked on sign in button`);
                    }
                  }
                }
              }
            } catch (selectorError) {
              console.log(`[${userId}] Selector fallback error:`, selectorError.message);
            }
          }
        } catch (mouseError) {
          console.error(`[${userId}] Mouse action failed:`, mouseError);
          if (mouseError.message.includes('Session closed') || mouseError.message.includes('page has been closed')) {
            console.log(`[${userId}] Page was closed, attempting to recreate session...`);
            await this.recreateSession(userId, client);
          }
        }
      } else {
        console.log(`[${userId}] No session, page, or page is closed for mouse event`);
        if (session?.page?.isClosed()) {
          console.log(`[${userId}] Page is closed, attempting to recreate session...`);
          await this.recreateSession(userId, client);
        }
      }
    } catch (error) {
      this.logger.error(`[${userId}] Mouse event error:`, error);
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
    console.log(`[${userId}] Event details:`, JSON.stringify(event, null, 2));

    // Log current active element for debugging
    try {
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      if (session && session.page && !session.page.isClosed()) {
        const activeElementInfo = await session.page.evaluate(() => {
          const activeElement = document.activeElement;
          if (activeElement) {
            return {
              tagName: activeElement.tagName,
              type: (activeElement as HTMLInputElement).type || '',
              id: activeElement.id,
              className: activeElement.className,
              value: (activeElement as HTMLInputElement).value || '',
              placeholder: (activeElement as HTMLInputElement).placeholder || ''
            };
          }
          return null;
        });
        console.log(`[${userId}] Current active element:`, activeElementInfo);
      }
    } catch (error) {
      console.log(`[${userId}] Could not get active element info:`, error.message);
    }

    try {
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      
      if (session && session.page && !session.page.isClosed()) {
        try {
          // Handle both "press" and "type" events
          if (event.type === "press") {
            // Для обычных символов используем type, для специальных клавиш - press
            if (event.key.length === 1) {
              await session.page.keyboard.type(event.key);
              console.log(`[${userId}] Key typed: ${event.key}`);
            } else {
              await session.page.keyboard.press(event.key);
              console.log(`[${userId}] Key pressed: ${event.key}`);
            }
          } else if (event.type === "type") {
            // Direct typing for input fields
            await session.page.keyboard.type(event.key);
            console.log(`[${userId}] Key typed directly: ${event.key}`);
          }
          
          // Special handling for backspace and delete
          if (event.key === 'Backspace' || event.key === 'Delete') {
            // Wait a bit for the deletion to complete
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          
          // Force screenshot update after keyboard event
          await this.forceScreenshotUpdate(userId, client, session.page);
          
          // Send input update after keyboard event
          await this.sendInputUpdate(userId, client, session.page);
          
          // Ensure the focused element is visible and cursor is positioned, then send update
          console.log(`[${userId}] Getting updated element info after keyboard event...`);
          const updatedElementInfo = await session.page.evaluate(() => {
            const activeElement = document.activeElement;
            console.log('Browser: Active element:', activeElement);
            
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
              // Scroll element into view if needed
              activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Ensure cursor is at the end of the text (only for supported input types)
              const input = activeElement as HTMLInputElement;
              const length = input.value.length;
              
              try {
                // Only set selection range for text inputs, not email/password
                if (input.type === 'text' || input.type === 'textarea' || input.type === '') {
                  input.setSelectionRange(length, length);
                  console.log('Browser: Cursor positioned at end');
                } else {
                  console.log('Browser: Skipping setSelectionRange for type:', input.type);
                }
              } catch (error) {
                console.log('Browser: Error setting selection range:', error.message);
              }
              
              console.log('Browser: Active element scrolled into view');
              console.log('Browser: Input value:', input.value);
              console.log('Browser: Input type:', input.type);
              console.log('Browser: Input placeholder:', input.placeholder);
              
              // Get element position and dimensions
              const rect = activeElement.getBoundingClientRect();
              console.log('Browser: Element rect:', rect);
              console.log('Browser: Rect values:', {
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
              });
              
              // Try alternative position calculation
              const computedStyle = window.getComputedStyle(activeElement);
              const offsetLeft = (activeElement as HTMLElement).offsetLeft;
              const offsetTop = (activeElement as HTMLElement).offsetTop;
              const clientLeft = (activeElement as HTMLElement).clientLeft;
              const clientTop = (activeElement as HTMLElement).clientTop;
              
              console.log('Browser: Alternative position values:', {
                offsetLeft,
                offsetTop,
                clientLeft,
                clientTop,
                computedStyle: {
                  margin: computedStyle.margin,
                  padding: computedStyle.padding,
                  border: computedStyle.border
                }
              });
              
              // Return updated element info with multiple position options
              const elementInfo = {
                tagName: activeElement.tagName,
                type: input.type || '',
                id: activeElement.id,
                className: activeElement.className,
                value: input.value || '',
                placeholder: input.placeholder || '',
                cursorPosition: length,
                position: {
                  x: rect.left,
                  y: rect.top,
                  width: rect.width,
                  height: rect.height
                },
                // Alternative position data
                altPosition: {
                  x: offsetLeft,
                  y: offsetTop,
                  width: (activeElement as HTMLElement).offsetWidth,
                  height: (activeElement as HTMLElement).offsetHeight
                },
                // CSS selector for finding element
                selector: activeElement.id ? `#${activeElement.id}` : 
                         activeElement.className ? `.${activeElement.className.split(' ')[0]}` :
                         `${activeElement.tagName.toLowerCase()}[type="${input.type}"]`
              };
              
              console.log('Browser: Returning element info with multiple position options:', elementInfo);
              return elementInfo;
            }
            console.log('Browser: No active input element found');
            return null;
          });
          
          console.log(`[${userId}] Updated element info:`, updatedElementInfo);
          console.log(`[${userId}] Position in element info:`, updatedElementInfo?.position);
          
          // Send updated element state to frontend with position
          if (updatedElementInfo) {
            const updateData = {
              element: updatedElementInfo,
              timestamp: Date.now()
            };
            console.log(`[${userId}] About to emit inputUpdated event...`);
            console.log(`[${userId}] Update data with position:`, JSON.stringify(updateData, null, 2));
            client.emit('inputUpdated', updateData);
            console.log(`[${userId}] ✅ SUCCESS: Sent input update to frontend:`, JSON.stringify(updateData, null, 2));
          } else {
            console.log(`[${userId}] ❌ No element info to send to frontend`);
          }
        } catch (keyboardError) {
          console.error(`[${userId}] ❌ Keyboard action failed:`, keyboardError);
          console.error(`[${userId}] Error details:`, keyboardError.message);
          console.error(`[${userId}] Error stack:`, keyboardError.stack);
          
          if (keyboardError.message.includes('Session closed') || keyboardError.message.includes('page has been closed')) {
            console.log(`[${userId}] Page was closed during keyboard event, attempting to recreate session...`);
            await this.recreateSession(userId, client);
          }
        }
      } else {
        console.log(`[${userId}] No session, page, or page is closed for keyboard event`);
        if (session?.page?.isClosed()) {
          console.log(`[${userId}] Page is closed during keyboard event, attempting to recreate session...`);
          await this.recreateSession(userId, client);
        }
      }
    } catch (error) {
      this.logger.error(`[${userId}] Keyboard event error:`, error);
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

    this.logger.log(`[${userId}] Scroll event: ${event.type} - ${event.deltaY}`);
    console.log(`[${userId}] Scroll event received:`, event);

    try {
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      
      if (session && session.page && !session.page.isClosed()) {
        try {
          if (event.type === "wheel") {
            await session.page.evaluate((deltaY) => {
              window.scrollBy(0, deltaY);
            }, event.deltaY);
            console.log(`[${userId}] Scrolled by: ${event.deltaY}`);
          }
        } catch (scrollError) {
          console.error(`[${userId}] Scroll action failed:`, scrollError);
        }
      } else {
        console.log(`[${userId}] No session, page, or page is closed for scroll event`);
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
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      if (session && session.page) {
        const screenshot = await session.page.screenshot({
          type: 'png',
        });
        
        client.emit('screencast', screenshot.toString());
      } else {
        client.emit('screencast', 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
      }
    } catch (error) {
      this.logger.error(`[${userId}] Screenshot error:`, error);
      client.emit('screencast', 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
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

    this.logger.log(`[${userId}] Close session requested`);
    
    try {
      await this.linkedInAutomationService.closeSession(userId);
      await this.stopCDPScreencast(userId, client);
      
      client.emit('sessionClosed', {
        message: 'LinkedIn session closed successfully'
      });
    } catch (error) {
      this.logger.error(`[${userId}] Close session error:`, error);
      client.emit('error', 'Failed to close session');
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
      const hasSession = await this.linkedInAutomationService.hasActiveSession(userId);
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      
      client.emit('sessionStatus', {
        hasSession,
        isLoggedIn: session?.isLoggedIn || false,
        url: session?.page?.url() || null,
        sessionId: session?.sessionId || null,
      });
    } catch (error) {
      this.logger.error(`[${userId}] Get session status error:`, error);
      client.emit('error', 'Failed to get session status');
    }
  }

  async sendToUser(userId: string, event: string, data: any): Promise<void> {
    const client = this.userSockets.get(userId);
    if (client) {
      client.emit(event, data);
    }
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

  private async startCDPScreencast(userId: string, client: Socket): Promise<void> {
    try {
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      const cdpSession = await this.linkedInAutomationService.getCDPSession(userId);
      
      if (!session || !cdpSession) {
        this.logger.warn(`[${userId}] No session or CDP session available for screencast`);
        return;
      }

      if (session.screencastRunning) {
        this.logger.log(`[${userId}] Screencast already running`);
        return;
      }

      this.logger.log(`[${userId}] Starting CDP screencast`);
      
      await cdpSession.send('Page.startScreencast', {
        format: 'jpeg',
        quality: 80,
        everyNthFrame: 1  // Send every frame for real-time updates
        // Remove maxWidth and maxHeight to use natural size
      });

      session.screencastRunning = true;

      cdpSession.on('Page.screencastFrame', async (data) => {
        try {
          // Skip CDP screencast frames - we'll use forceScreenshotUpdate instead
          // This prevents the [object Object] issue
          return;
        } catch (error) {
          this.logger.error(`[${userId}] Error in CDP screencast frame:`, error);
        }
      });

      this.logger.log(`[${userId}] CDP screencast started successfully (disabled for manual updates)`);
    } catch (error) {
      this.logger.error(`[${userId}] Failed to start CDP screencast:`, error);
    }
  }

  private async stopCDPScreencast(userId: string, client: Socket): Promise<void> {
    try {
      const session = await this.linkedInAutomationService.getSessionInfo(userId);
      const cdpSession = await this.linkedInAutomationService.getCDPSession(userId);
      
      if (session && cdpSession && session.screencastRunning) {
        await cdpSession.send('Page.stopScreencast');
        session.screencastRunning = false;
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
              url: page.url()
            });
          });
          
          await this.startCDPScreencast(userId, client);
          
          // Send initial screenshot
          await this.forceScreenshotUpdate(userId, client, page);
          
          client.emit('loginStarted', {
            message: 'LinkedIn session recreated and ready',
            url: page.url(),
          });
        }
      );
      
      console.log(`[${userId}] Session recreated successfully`);
    } catch (error) {
      console.error(`[${userId}] Error recreating session:`, error);
      client.emit('error', 'Failed to recreate session');
    }
  }

  private async sendInputUpdate(userId: string, client: Socket, page: any): Promise<void> {
    try {
      console.log(`[${userId}] sendInputUpdate called`);
      const activeElementInfo = await page.evaluate(() => {
        const activeElement = document.activeElement;
        console.log('sendInputUpdate: Active element:', activeElement);
        
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          const input = activeElement as HTMLInputElement;
          // Get element position and dimensions
          const rect = activeElement.getBoundingClientRect();
          console.log('sendInputUpdate: Element rect:', rect);
          
          const info = {
            tagName: activeElement.tagName,
            type: input.type || '',
            id: activeElement.id,
            className: activeElement.className,
            value: input.value || '',
            placeholder: input.placeholder || '',
            cursorPosition: input.value.length,
            // Position and size for overlay
            position: {
              x: rect.left,
              y: rect.top,
              width: rect.width,
              height: rect.height
            }
          };
          console.log('sendInputUpdate: Element info with position:', info);
          return info;
        }
        console.log('sendInputUpdate: No active input element');
        return null;
      });

      if (activeElementInfo) {
        const updateData = {
          element: activeElementInfo,
          timestamp: Date.now()
        };
        client.emit('inputUpdated', updateData);
        console.log(`[${userId}] Sent input update via sendInputUpdate:`, JSON.stringify(updateData, null, 2));
      } else {
        // If no active element, send empty update to clear overlay
        const updateData = {
          element: null,
          timestamp: Date.now()
        };
        client.emit('inputUpdated', updateData);
        console.log(`[${userId}] Sent empty input update to clear overlay:`, JSON.stringify(updateData, null, 2));
      }
    } catch (error) {
      console.log(`[${userId}] Error sending input update:`, error.message);
    }
  }

  private async forceScreenshotUpdate(userId: string, client: Socket, page: any): Promise<void> {
    try {
      console.log(`[${userId}] Forcing screenshot update...`);
      
      // Check if page is still valid
      if (!page || page.isClosed()) {
        console.error(`[${userId}] Page is closed or invalid`);
        return;
      }
      
      // Take a manual screenshot and send it
      const screenshot = await page.screenshot({
        type: 'jpeg',
        quality: 80,
        fullPage: false
      });
      
      const base64Image = screenshot.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      
      console.log(`[${userId}] Screenshot taken, size: ${base64Image.length} chars`);
      console.log(`[${userId}] Data URL starts with: ${dataUrl.substring(0, 50)}...`);
      
      client.emit('screencast', {
        data: dataUrl,
        timestamp: Date.now()
      });
      
      console.log(`[${userId}] ✅ Screenshot update sent to frontend`);
    } catch (error) {
      console.error(`[${userId}] Error forcing screenshot update:`, error);
    }
  }
} 