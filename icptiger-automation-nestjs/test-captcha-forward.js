const { io } = require('socket.io-client');

console.log('🧪 Testing Captcha Detection and Forwarding...');

const socket = io('http://localhost:3008', {
  query: { user_id: 'test-user' },
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  console.log('✅ Socket.io connected successfully');

  // Simulate captcha detection
  const testHTML = '<html><body><div>Test Captcha Form</div></body></html>';

  console.log('📤 Sending captcha-detected event...');
  socket.emit('captcha-detected', {
    html: testHTML,
  });
});

socket.on('captcha-detected', (data) => {
  console.log('✅ Captcha detected event received:', data);
  console.log('📄 HTML length:', data.html ? data.html.length : 0);
  socket.disconnect();
  process.exit(0);
});

socket.on('connect_error', (error) => {
  console.error('❌ Socket.io connection error:', error.message);
  process.exit(1);
});

socket.on('disconnect', () => {
  console.log('🔌 Socket.io disconnected');
});

// Timeout after 10 seconds
setTimeout(() => {
  console.log('⏰ Test timeout');
  socket.disconnect();
  process.exit(1);
}, 10000);
