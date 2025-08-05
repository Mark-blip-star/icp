const io = require('socket.io-client');

const socket = io('http://localhost:3008', {
  query: { user_id: 'test-user-123' }
});

socket.on('connect', () => {
  console.log('✅ Connected to NestJS socket server');
});

socket.on('connected', (data) => {
  console.log('✅ Received connected event:', data);
});

socket.on('readyForLogin', (data) => {
  console.log('✅ Received readyForLogin event:', data);
});

socket.on('screencast', (data) => {
  console.log('✅ Received screencast data (length):', data.length);
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('🔌 Disconnected:', reason);
});

// Test after 5 seconds
setTimeout(() => {
  console.log('🧪 Testing NestJS socket connection...');
}, 5000);

// Keep alive for 30 seconds
setTimeout(() => {
  console.log('🏁 Test completed');
  socket.disconnect();
  process.exit(0);
}, 30000); 