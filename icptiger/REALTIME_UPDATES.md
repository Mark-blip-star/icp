# Real-time Updates Implementation

## Overview

This implementation provides real-time updates for the LinkedIn automation dashboard, eliminating the need for manual page refreshes. Users can now see live updates for:

- Campaign status changes
- Connection status updates  
- Recent activity logs
- Metrics calculations
- Import status changes

## Architecture

### 1. Real-time Context (`app/context/realtime-context.tsx`)

The central hub for managing real-time state and connections:

- **Supabase Realtime**: Listens to database changes via PostgreSQL triggers
- **Socket.IO**: Handles LinkedIn automation updates and custom events
- **Manual Refresh Functions**: Fallback for immediate updates
- **State Management**: Centralized state for all real-time data

### 2. Real-time Subscriptions

The system subscribes to these database tables for real-time updates:

```typescript
// Campaign changes
supabase.channel('campaigns')
  .on('postgres_changes', {
    event: '*',
    schema: 'public', 
    table: 'linkedin_campaigns',
    filter: `user_id=eq.${userId}`
  })

// Connection changes  
supabase.channel('connections')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'linkedin_connections', 
    filter: `user_id=eq.${userId}`
  })

// Log changes
supabase.channel('logs')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'linkedin_logs',
    filter: `user_id=eq.${userId}`
  })

// Import status changes
supabase.channel('import_status')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'import_status',
    filter: `user_id=eq.${userId}`
  })
```

### 3. Socket.IO Integration

Enhanced existing Socket.IO infrastructure to emit real-time events:

```typescript
// Campaign updates
socket.emit('campaignUpdate', { campaignId, status, data })

// Connection updates
socket.emit('connectionUpdate', { connectionId, status, data })

// Activity updates  
socket.emit('activityUpdate', { logId, message, data })

// Import status updates
socket.emit('importStatusUpdate', { remainingImports, data })
```

## Components

### 1. RealtimeProvider

Wraps the protected dashboard layout to provide real-time context:

```typescript
<UserProvider user={user}>
  <RealtimeProvider>
    {children}
  </RealtimeProvider>
</UserProvider>
```

### 2. RealtimeStatus Component

Visual indicator showing connection status:

```typescript
<RealtimeStatus />
// Shows: 🟢 Live or 🔴 Offline
```

### 3. Updated Dashboard Components

All dashboard components now use real-time context:

- **MetricsDashboard**: Live metrics updates
- **CampaignList**: Real-time campaign status changes
- **RecentActivity**: Live activity feed
- **CampaignDetails**: Real-time connection updates

## Usage

### 1. Using Real-time Context

```typescript
import { useRealtime } from '@/app/context/realtime-context';

function MyComponent() {
  const { 
    campaigns, 
    metrics, 
    activities, 
    isConnected,
    refreshCampaigns,
    refreshMetrics 
  } = useRealtime();

  // Data automatically updates in real-time
  return (
    <div>
      {isConnected && <span>🟢 Live updates enabled</span>}
      <CampaignList campaigns={campaigns} />
    </div>
  );
}
```

### 2. Manual Refresh

```typescript
const { refreshCampaigns, refreshMetrics } = useRealtime();

// Trigger immediate refresh
await refreshCampaigns();
await refreshMetrics();
```

### 3. Testing Real-time Updates

Use the test component to simulate updates:

```typescript
import { RealtimeTest } from '@/app/components/realtime-test';

// Add to any page for testing
<RealtimeTest />
```

## Benefits

### 1. No More Manual Refreshes
- Users see updates instantly without refreshing the page
- Campaign status changes appear immediately
- New activities show up in real-time
- Metrics update automatically

### 2. Better User Experience
- Live status indicators show connection health
- Smooth animations for status changes
- Immediate feedback for user actions
- Reduced perceived loading times

### 3. Improved Automation Monitoring
- Real-time campaign progress tracking
- Live connection status updates
- Instant notification of automation events
- Better debugging and monitoring capabilities

## Configuration

### 1. Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SOCKET_API_BASE_URL=https://socket.icptiger.com
```

### 2. Supabase Realtime

Realtime is already enabled in your Supabase configuration:

```toml
[realtime]
enabled = true
```

### 3. Database Permissions

Ensure your RLS policies allow real-time subscriptions:

```sql
-- Example policy for linkedin_campaigns
CREATE POLICY "Users can view their own campaigns" ON linkedin_campaigns
  FOR SELECT USING (auth.uid() = user_id);
```

## Troubleshooting

### 1. Connection Issues

If real-time updates aren't working:

1. Check browser console for connection errors
2. Verify Supabase URL and keys are correct
3. Ensure user is authenticated
4. Check network connectivity

### 2. Missing Updates

If updates aren't appearing:

1. Verify database triggers are working
2. Check RLS policies allow user access
3. Ensure real-time subscriptions are active
4. Try manual refresh as fallback

### 3. Performance Issues

If experiencing performance problems:

1. Limit subscription scope to necessary tables
2. Use filters to reduce data volume
3. Implement debouncing for rapid updates
4. Consider pagination for large datasets

## Future Enhancements

### 1. Push Notifications
- Browser notifications for important updates
- Email notifications for critical events
- Mobile push notifications

### 2. Advanced Filtering
- User-configurable update filters
- Selective subscription management
- Custom update preferences

### 3. Offline Support
- Queue updates when offline
- Sync when connection restored
- Offline indicator and status

### 4. Analytics
- Real-time usage analytics
- Performance monitoring
- Connection health metrics

## Migration Guide

### From Manual Refresh to Real-time

1. **Replace manual fetch calls**:
   ```typescript
   // Old way
   const [campaigns, setCampaigns] = useState([]);
   useEffect(() => {
     fetch('/api/campaigns').then(r => r.json()).then(setCampaigns);
   }, []);

   // New way
   const { campaigns } = useRealtime();
   ```

2. **Update component props**:
   ```typescript
   // Old way
   <CampaignList campaigns={campaigns} setCampaigns={setCampaigns} />

   // New way  
   <CampaignList campaigns={campaigns} setCampaigns={updateCampaigns} />
   ```

3. **Add real-time indicators**:
   ```typescript
   import { RealtimeStatus } from '@/app/components/realtime-status';
   
   <RealtimeStatus />
   ```

## Security Considerations

1. **User Isolation**: All subscriptions are filtered by `user_id`
2. **RLS Policies**: Database-level security prevents unauthorized access
3. **Authentication**: Real-time context requires authenticated user
4. **Rate Limiting**: Consider implementing rate limits for manual refresh functions

## Performance Considerations

1. **Connection Management**: Automatic cleanup on component unmount
2. **Debounced Updates**: Prevents excessive re-renders
3. **Selective Subscriptions**: Only subscribe to necessary tables
4. **Memory Management**: Proper cleanup of event listeners 