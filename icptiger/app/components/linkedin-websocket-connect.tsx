'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Monitor, MousePointer, Keyboard, Scroll, X, Play, Square } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface LinkedInWebSocketConnectProps {
  userId: string;
  onSuccess?: (cookies: { li_at: string; li_a?: string }) => void;
  onError?: (error: string) => void;
}

interface SessionStatus {
  hasSession: boolean;
  isLoggedIn: boolean;
  url: string | null;
  sessionId: string | null;
}

export default function LinkedInWebSocketConnect({ 
  userId, 
  onSuccess, 
  onError 
}: LinkedInWebSocketConnectProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [screencastData, setScreencastData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [inputOverlay, setInputOverlay] = useState<{
    email: string;
    password: string;
    activeField: 'email' | 'password' | null;
    cursorPosition: number;
  }>({
    email: '',
    password: '',
    activeField: null,
    cursorPosition: 0
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev.slice(-9), `[${timestamp}] ${info}`]);
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const connectToWebSocket = async () => {
    if (socket) {
      socket.disconnect();
    }

    setIsConnecting(true);
    setError(null);
    addDebugInfo('Connecting to WebSocket server...');

    try {
      const newSocket = io('http://localhost:3008', {
        query: { user_id: userId },
        transports: ['websocket', 'polling'],
        timeout: 10000,
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
        addDebugInfo('Connected to WebSocket server');
        
        // Get session status
        newSocket.emit('getSessionStatus');
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
        addDebugInfo('Disconnected from WebSocket server');
      });

      newSocket.on('connected', (data) => {
        addDebugInfo(`Server: ${data.message}`);
      });

      newSocket.on('readyForLogin', (data) => {
        addDebugInfo(`Ready for login: ${data.message}`);
        setSessionStatus(prev => ({
          hasSession: true,
          isLoggedIn: prev?.isLoggedIn || false,
          url: data.url,
          sessionId: prev?.sessionId || null,
        }));
      });

      newSocket.on('loginStarted', (data) => {
        addDebugInfo(`Login started: ${data.message}`);
      });

      newSocket.on('loginSuccess', (data) => {
        addDebugInfo(`Login successful: ${data.message}`);
        setSessionStatus(prev => ({
          hasSession: prev?.hasSession || true,
          isLoggedIn: true,
          url: data.url,
          sessionId: prev?.sessionId || null,
        }));
        
        if (onSuccess) {
          // Extract cookies from the session
          onSuccess({ li_at: 'extracted_from_session', li_a: 'extracted_from_session' });
        }
      });

      newSocket.on('sessionStatus', (data) => {
        setSessionStatus(data);
        addDebugInfo(`Session status: ${data.hasSession ? 'Active' : 'None'}, Logged in: ${data.isLoggedIn}`);
      });

      newSocket.on('sessionClosed', (data) => {
        addDebugInfo(`Session closed: ${data.message}`);
        setSessionStatus(null);
        setScreencastData(null);
      });

      newSocket.on('screencast', (data) => {
        setScreencastData(data);
      });

      newSocket.on('inputUpdated', (data) => {
        addDebugInfo(`Input updated: ${data.element.type} field`);
        
        // Update input overlay based on element type
        if (data.element.type === 'email' || data.element.placeholder?.toLowerCase().includes('email')) {
          setInputOverlay(prev => ({
            ...prev,
            email: data.element.value,
            activeField: 'email',
            cursorPosition: data.element.cursorPosition
          }));
        } else if (data.element.type === 'password') {
          setInputOverlay(prev => ({
            ...prev,
            password: data.element.value,
            activeField: 'password',
            cursorPosition: data.element.cursorPosition
          }));
        }
      });

      newSocket.on('error', (data) => {
        setError(data);
        addDebugInfo(`Error: ${data}`);
        if (onError) {
          onError(data);
        }
      });

      setSocket(newSocket);
    } catch (error) {
      setIsConnecting(false);
      setError(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
      addDebugInfo(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const startLogin = () => {
    if (!socket) return;
    
    setIsLoading(true);
    addDebugInfo('Starting LinkedIn login...');
    socket.emit('startLogin');
  };

  const closeSession = () => {
    if (!socket) return;
    
    addDebugInfo('Closing session...');
    socket.emit('closeSession');
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!socket || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to match the actual page size
    const scaleX = 1920 / canvas.width;
    const scaleY = 1080 / canvas.height;
    
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    addDebugInfo(`Mouse click at (${Math.round(scaledX)}, ${Math.round(scaledY)})`);
    
    socket.emit('mouse', {
      type: 'click',
      x: scaledX,
      y: scaledY,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (!socket) return;

    let key = event.key;
    
    // Handle special keys
    if (event.key === 'Enter') key = 'Enter';
    else if (event.key === 'Tab') key = 'Tab';
    else if (event.key === 'Escape') key = 'Escape';
    else if (event.key === 'Backspace') key = 'Backspace';
    else if (event.key === 'Delete') key = 'Delete';
    else if (event.key === 'ArrowUp') key = 'ArrowUp';
    else if (event.key === 'ArrowDown') key = 'ArrowDown';
    else if (event.key === 'ArrowLeft') key = 'ArrowLeft';
    else if (event.key === 'ArrowRight') key = 'ArrowRight';

    addDebugInfo(`Key pressed: ${key}`);
    
    socket.emit('keyboard', {
      type: 'press',
      key: key,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!socket) return;
    
    const value = event.target.value;
    if (value.length > 0) {
      const lastChar = value[value.length - 1];
      addDebugInfo(`Input: ${lastChar}`);
      
      socket.emit('keyboard', {
        type: 'type',
        key: lastChar,
      });
    }
  };

  const handleScroll = (event: React.WheelEvent) => {
    if (!socket) return;

    addDebugInfo(`Scroll: ${event.deltaY}`);
    
    socket.emit('scroll', {
      type: 'wheel',
      deltaY: event.deltaY,
    });
  };

  // Update canvas when screencast data changes
  useEffect(() => {
    if (screencastData && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      img.onload = () => {
        if (ctx) {
          canvas.width = 1280;
          canvas.height = 720;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };

      img.src = `data:image/jpeg;base64,${screencastData}`;
    }
  }, [screencastData]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            LinkedIn WebSocket Connection
          </CardTitle>
          <CardDescription>
            Interactive browser session for LinkedIn login
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-4">
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            {sessionStatus && (
              <>
                <Badge variant={sessionStatus.hasSession ? "default" : "secondary"}>
                  Session: {sessionStatus.hasSession ? "Active" : "None"}
                </Badge>
                <Badge variant={sessionStatus.isLoggedIn ? "default" : "secondary"}>
                  Login: {sessionStatus.isLoggedIn ? "Success" : "Pending"}
                </Badge>
              </>
            )}
          </div>

          {/* Connection Controls */}
          <div className="flex gap-2">
            {!isConnected ? (
              <Button 
                onClick={connectToWebSocket} 
                disabled={isConnecting}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isConnecting ? 'Connecting...' : 'Connect to Browser'}
              </Button>
            ) : (
              <>
                <Button 
                  onClick={startLogin} 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isLoading ? 'Starting...' : 'Start Login'}
                </Button>
                <Button 
                  onClick={closeSession} 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Square className="h-4 w-4" />
                  Close Session
                </Button>
              </>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Browser View */}
          {isConnected && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MousePointer className="h-4 w-4" />
                Click to interact
                <Keyboard className="h-4 w-4 ml-4" />
                Type to input text
                <Scroll className="h-4 w-4 ml-4" />
                Scroll to navigate
              </div>
              
              <div className="border rounded-lg overflow-hidden bg-black relative">
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="w-full h-auto cursor-crosshair"
                  onClick={handleCanvasClick}
                  onWheel={handleScroll}
                  style={{ imageRendering: 'pixelated' }}
                />
                <img
                  ref={imageRef}
                  style={{ display: 'none' }}
                  alt="Screencast"
                />
                
                {/* Hidden input for keyboard events */}
                <input
                  type="text"
                  className="absolute inset-0 opacity-0 cursor-crosshair"
                  onKeyDown={handleKeyPress}
                  onFocus={() => addDebugInfo('Input focused - keyboard active')}
                  onBlur={() => addDebugInfo('Input blurred')}
                  autoFocus
                  tabIndex={-1}
                />
                
                {/* Input overlay for real-time text display */}
                {(inputOverlay.email || inputOverlay.password) && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Email field overlay */}
                    {inputOverlay.email && (
                      <div 
                        className="absolute bg-white text-black px-3 py-2 rounded border-2 border-blue-500 font-mono text-sm"
                        style={{
                          top: '35%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          minWidth: '300px',
                          maxWidth: '400px'
                        }}
                      >
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">📧</span>
                          <span className="flex-1">
                            {inputOverlay.email}
                            {inputOverlay.activeField === 'email' && (
                              <span className="inline-block w-0.5 h-4 bg-black ml-1 animate-pulse"></span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Password field overlay */}
                    {inputOverlay.password && (
                      <div 
                        className="absolute bg-white text-black px-3 py-2 rounded border-2 border-blue-500 font-mono text-sm"
                        style={{
                          top: '45%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          minWidth: '300px',
                          maxWidth: '400px'
                        }}
                      >
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-2">🔒</span>
                          <span className="flex-1">
                            {'•'.repeat(inputOverlay.password.length)}
                            {inputOverlay.activeField === 'password' && (
                              <span className="inline-block w-0.5 h-4 bg-black ml-1 animate-pulse"></span>
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {!screencastData && (
                <div className="text-center py-8 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Waiting for browser screencast...</p>
                </div>
              )}
            </div>
          )}

          {/* Debug Info */}
          {debugInfo.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Debug Info</h4>
              <div className="bg-muted p-3 rounded-md text-xs font-mono max-h-32 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <div key={index} className="text-muted-foreground">
                    {info}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 