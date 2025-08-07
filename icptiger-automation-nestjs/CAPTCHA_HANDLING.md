# Captcha Handling System

## Overview

This system provides DOM synchronization between the frontend UI and the Puppeteer browser instance to handle LinkedIn captchas and verification challenges that cannot be automatically resolved.

## Architecture

### Components

1. **Frontend CaptchaHandler Component** (`icp/icptiger/app/components/captcha-handler.tsx`)
   - Renders captcha forms in an iframe
   - Captures user interactions (clicks, input, submit)
   - Sends actions to backend via WebSocket

2. **Backend WebSocket Gateway** (`icp/icptiger-automation-nestjs/src/websocket/simple-websocket.gateway.ts`)
   - Handles DOM action events from frontend
   - Executes actions in Puppeteer browser
   - Provides page HTML to frontend

3. **LinkedIn Automation Service** (`icp/icptiger-automation-nestjs/src/linkedin/automation.service.ts`)
   - Detects captcha presence
   - Manages extended timeouts
   - Handles manual mode activation

4. **Session Service** (`icp/icptiger-automation-nestjs/src/browser/session.service.ts`)
   - Manages browser sessions
   - Provides extended timeouts for captcha resolution

## Flow

### 1. Captcha Detection

```typescript
// In automation.service.ts
async detectCaptcha(page: Page): Promise<boolean> {
  // Check for captcha selectors
  // Check for captcha-related text
  // Return true if captcha found
}
```

### 2. Manual Mode Activation

```typescript
// Set extended timeouts
await page.setDefaultTimeout(300000); // 5 minutes
await page.setDefaultNavigationTimeout(300000); // 5 minutes
```

### 3. DOM Synchronization

```typescript
// Frontend sends action
socket.send(
  JSON.stringify({
    type: 'dom-action',
    action: { type: 'click', selector: '#captcha-button' },
  }),
);

// Backend executes action
await page.click(action.selector);
```

### 4. Real-time Updates

- Frontend receives page HTML updates
- User interactions are immediately reflected in Puppeteer
- Continuous synchronization until captcha is resolved

## WebSocket Events

### Frontend → Backend

- `dom-action`: Execute DOM action in Puppeteer
- `get-page-html`: Get current page HTML
- `enable-manual-mode`: Enable extended timeouts

### Backend → Frontend

- `captcha-detected`: Captcha found, show handler
- `page-html`: Current page HTML for rendering
- `dom-action-success`: Action executed successfully
- `dom-action-error`: Action execution failed

## Captcha Detection Patterns

### Selectors

- `[data-testid="captcha"]`
- `[class*="captcha"]`
- `[data-testid="challenge-dialog"]`
- `[class*="challenge"]`
- `[data-testid="phone-verification"]`

### Keywords

- English: "captcha", "verification", "challenge", "security check"
- Ukrainian: "почати пазл", "розпочати", "підтвердити", "верифікація"

## Timeout Management

### Normal Mode

- Page navigation: 60 seconds
- Element wait: 10 seconds
- Session cleanup: 20 minutes

### Manual Mode (Captcha)

- Page navigation: 5 minutes
- Element wait: 5 minutes
- Session cleanup: 30 minutes

## Security Considerations

1. **Sandboxed iframe**: Captcha forms are rendered in sandboxed iframes
2. **Action validation**: All DOM actions are validated before execution
3. **Timeout limits**: Extended timeouts are only applied during captcha resolution
4. **Session isolation**: Each user has isolated browser sessions

## Error Handling

### Common Scenarios

1. **WebSocket disconnection**: Automatic reconnection with session preservation
2. **Page navigation**: Wait for new page load before continuing
3. **Action failures**: Retry with alternative selectors
4. **Session timeout**: Cleanup and session recreation

### Fallback Mechanisms

1. **Screenshot capture**: For debugging failed captcha detection
2. **Manual mode**: Extended timeouts for complex challenges
3. **Session recreation**: If browser becomes unresponsive

## Usage Example

```typescript
// 1. Start login process
const response = await fetch('/api/linkedin/automated-login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// 2. If captcha detected, show handler
if (response.status === 'captcha_detected') {
  setCaptchaVisible(true);
  setCaptchaHTML(response.html);
}

// 3. User interacts with captcha
const handleCaptchaAction = (action) => {
  socket.send(
    JSON.stringify({
      type: 'dom-action',
      action: action,
    }),
  );
};

// 4. Wait for resolution
socket.on('login-success', (data) => {
  setCaptchaVisible(false);
  handleLoginSuccess(data.cookies);
});
```

## Configuration

### Environment Variables

```bash
# WebSocket URL for captcha handling
WEBSOCKET_URL=ws://localhost:3001

# Extended timeouts for captcha resolution
CAPTCHA_TIMEOUT=300000
CAPTCHA_NAVIGATION_TIMEOUT=300000
```

### Timeout Settings

```typescript
// Normal timeouts
page.setDefaultTimeout(60000);
page.setDefaultNavigationTimeout(60000);

// Captcha timeouts
page.setDefaultTimeout(300000);
page.setDefaultNavigationTimeout(300000);
```

## Testing

### Manual Testing

1. Use LinkedIn accounts that trigger captchas
2. Test with different captcha types (puzzle, phone verification)
3. Verify DOM synchronization accuracy
4. Test timeout handling

### Automated Testing

```typescript
// Test captcha detection
const hasCaptcha = await detectCaptcha(page);
expect(hasCaptcha).toBe(true);

// Test DOM action execution
await executeDOMAction(userId, {
  type: 'click',
  selector: '#captcha-button',
});

// Test timeout extension
await enableManualMode(userId);
```

## Troubleshooting

### Common Issues

1. **Captcha not detected**
   - Check selector patterns
   - Verify page content loading
   - Review console logs

2. **DOM actions not working**
   - Verify element selectors
   - Check iframe sandbox settings
   - Review WebSocket connection

3. **Timeout issues**
   - Check timeout configuration
   - Verify session management
   - Review cleanup processes

### Debug Commands

```typescript
// Check page content
const html = await page.content();
console.log('Page HTML:', html);

// Check for captcha elements
const captchaElements = await page.$$('[class*="captcha"]');
console.log('Captcha elements found:', captchaElements.length);

// Test DOM action
await page.evaluate(() => {
  console.log('Current URL:', window.location.href);
  console.log('Page title:', document.title);
});
```

## Future Enhancements

1. **AI-powered captcha solving**: Integration with captcha solving services
2. **Multi-language support**: Enhanced detection for different languages
3. **Advanced synchronization**: Real-time video streaming of browser
4. **Mobile support**: Responsive captcha handler for mobile devices
5. **Analytics**: Track captcha frequency and resolution success rates
