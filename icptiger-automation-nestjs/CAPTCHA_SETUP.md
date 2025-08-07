# Captcha System Setup

## Quick Start

### 1. Start the NestJS Backend

```bash
cd icp/icptiger-automation-nestjs
npm install
npm run start:dev
```

### 2. Start the Next.js Frontend

```bash
cd icp/icptiger
npm install
npm run dev
```

### 3. Test the System

```bash
cd icp/icptiger-automation-nestjs
node test-captcha-system.js
```

## Environment Variables

### Backend (.env)

```bash
# WebSocket port
PORT=3001

# Database
DATABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Browser settings
PUPPETEER_EXECUTABLE_PATH=/path/to/chrome
```

### Frontend (.env.local)

```bash
# WebSocket URL
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3001

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testing Captcha Handling

### 1. Manual Test

1. Go to `http://localhost:3000`
2. Navigate to LinkedIn connection
3. Enter credentials that trigger captcha
4. Verify captcha handler appears
5. Test DOM synchronization

### 2. Automated Test

```bash
# Run the test script
node test-captcha-system.js

# Expected output:
# ✅ WebSocket connected
# ✅ Manual mode enabled successfully
# ✅ Page HTML received
# ✅ DOM action executed successfully
```

## Troubleshooting

### WebSocket Connection Issues

```bash
# Check if backend is running
curl http://localhost:3001/health

# Check WebSocket endpoint
wscat -c ws://localhost:3001
```

### Browser Issues

```bash
# Check Puppeteer installation
npm list puppeteer

# Reinstall if needed
npm uninstall puppeteer
npm install puppeteer
```

### Captcha Detection Issues

1. Check browser console for errors
2. Verify selector patterns in `automation.service.ts`
3. Test with different LinkedIn accounts
4. Review timeout settings

## Monitoring

### Backend Logs

```bash
# Watch logs in real-time
tail -f logs/app.log

# Check for captcha detection
grep "Captcha detected" logs/app.log
```

### Frontend Logs

```bash
# Check browser console
# Look for WebSocket events
# Monitor captcha handler state
```

## Performance Tuning

### Timeout Settings

```typescript
// Normal mode
page.setDefaultTimeout(60000);
page.setDefaultNavigationTimeout(60000);

// Captcha mode
page.setDefaultTimeout(300000);
page.setDefaultNavigationTimeout(300000);
```

### Memory Management

```typescript
// Clean up sessions
await sessionService.cleanupAllSessions();

// Monitor memory usage
console.log('Active sessions:', sessionService.getSessionCount());
```

## Security Notes

1. **Sandboxed iframes**: Captcha forms are isolated
2. **Action validation**: All DOM actions are validated
3. **Session isolation**: Each user has separate sessions
4. **Timeout limits**: Extended timeouts only for captcha

## Development

### Adding New Captcha Types

1. Update selectors in `detectCaptcha()`
2. Add keywords to detection patterns
3. Test with real captcha scenarios
4. Update documentation

### Extending DOM Actions

1. Add new action types in `executeDOMAction()`
2. Update frontend handler
3. Test synchronization
4. Update WebSocket events

## Production Deployment

### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
PORT=3001
DATABASE_URL=production_db_url
SUPABASE_KEY=production_key
```

### Monitoring

```bash
# Health check endpoint
GET /health

# Metrics endpoint
GET /metrics

# Session status
GET /api/sessions/status
```

### Scaling

1. Use load balancer for WebSocket connections
2. Implement session clustering
3. Add Redis for session storage
4. Monitor resource usage
