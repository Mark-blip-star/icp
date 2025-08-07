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
    position?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>({
    email: '',
    password: '',
    activeField: null,
    cursorPosition: 0
  });

  // Log overlay state changes
  useEffect(() => {
    console.log('Frontend: Input overlay state changed:', inputOverlay);
  }, [inputOverlay]);
  
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
        console.log('Frontend: Received screencast event:', data);
        console.log('Frontend: Data type:', typeof data);
        console.log('Frontend: Data keys:', Object.keys(data));
        console.log('Frontend: Data.data type:', typeof data.data);
        console.log('Frontend: Data.data starts with:', data.data ? data.data.substring(0, 50) : 'no data');
        console.log('Frontend: Data.data length:', data.data ? data.data.length : 'no data');
        
        if (data.data && typeof data.data === 'string' && data.data.startsWith('data:image/jpeg;base64,')) {
          setScreencastData(data.data);
          console.log('Frontend: ✅ Valid screenshot data set');
        } else {
          console.error('Frontend: ❌ Invalid screenshot data format:', data.data);
        }
      });

      newSocket.on('inputUpdated', (data) => {
        console.log('Frontend: Received inputUpdated event:', JSON.stringify(data, null, 2));
        
        if (data.element) {
          addDebugInfo(`Input updated: ${data.element.type} field - "${data.element.value}"`);
          console.log('Frontend: Processing element update:', data.element);
          console.log('Frontend: Element position:', data.element.position);
          
          // Update input overlay based on element type and placeholder
          const isEmailField = data.element.type === 'email' || 
                             data.element.placeholder?.toLowerCase().includes('email') ||
                             data.element.placeholder?.toLowerCase().includes('phone');
          
          const isPasswordField = data.element.type === 'password' ||
                                data.element.placeholder?.toLowerCase().includes('password');
          
          console.log('Frontend: Field detection:', { isEmailField, isPasswordField, type: data.element.type, placeholder: data.element.placeholder });
          
          if (isEmailField) {
            console.log('Frontend: Updating email field with value:', data.element.value);
            console.log('Frontend: Position data:', data.element.position);
            console.log('Frontend: Alt position data:', data.element.altPosition);
            console.log('Frontend: Selector:', data.element.selector);
            console.log('Frontend: Position type:', typeof data.element.position);
            console.log('Frontend: Position keys:', data.element.position ? Object.keys(data.element.position) : 'undefined');
            
            // Try to find position using multiple methods
            let finalPosition = data.element.position;
            
            if (!finalPosition || finalPosition.x === 0) {
              console.log('Frontend: Using alt position');
              finalPosition = data.element.altPosition;
            }
            
            if (!finalPosition || finalPosition.x === 0) {
              console.log('Frontend: Trying to find element by selector');
              // Try to find element on frontend and get its position
              const element = document.querySelector(data.element.selector);
              if (element) {
                const rect = element.getBoundingClientRect();
                finalPosition = {
                  x: rect.left,
                  y: rect.top,
                  width: rect.width,
                  height: rect.height
                };
                console.log('Frontend: Found element by selector, position:', finalPosition);
              }
            }
            
            setInputOverlay(prev => {
              const newState = {
                ...prev,
                email: data.element.value,
                activeField: 'email' as const,
                cursorPosition: data.element.cursorPosition,
                position: finalPosition
              };
              console.log('Frontend: New email overlay state:', newState);
              return newState;
            });
          } else if (isPasswordField) {
            console.log('Frontend: Updating password field with value:', data.element.value);
            setInputOverlay(prev => {
              const newState = {
                ...prev,
                password: data.element.value,
                activeField: 'password' as const,
                cursorPosition: data.element.cursorPosition,
                position: data.element.position
              };
              console.log('Frontend: New password overlay state:', newState);
              return newState;
            });
          } else {
            console.log('Frontend: Clearing active field - unknown field type');
            // Clear active field if clicking elsewhere
            setInputOverlay(prev => ({
              ...prev,
              activeField: null,
              cursorPosition: 0,
              position: undefined
            }));
          }
        } else {
          // Clear overlay when no active element
          addDebugInfo('Input cleared - no active element');
          console.log('Frontend: Clearing overlay - no active element');
          setInputOverlay(prev => ({
            ...prev,
            activeField: null,
            cursorPosition: 0
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

    // Calculate the scale factor between display size and actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    // Convert display coordinates to actual page coordinates
    const pageX = x * scaleX;
    const pageY = y * scaleY;

    addDebugInfo(`Mouse click at display (${Math.round(x)}, ${Math.round(y)}) -> page (${Math.round(pageX)}, ${Math.round(pageY)})`);
    
    socket.emit('mouse', {
      type: 'click',
      x: pageX,
      y: pageY,
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
    console.log('Frontend: Sending keyboard event:', { type: 'press', key });
    
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
          // Set canvas size to match the natural image size
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
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
                  className="w-full h-auto max-h-[70vh] object-contain cursor-crosshair"
                  onClick={handleCanvasClick}
                  onDoubleClick={handleCanvasClick}
                  onWheel={handleScroll}
                  style={{ 
                    imageRendering: 'pixelated',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
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
                
                {/* Hidden input overlay - only for debugging */}
                {inputOverlay.position && (inputOverlay.email || inputOverlay.password) && canvasRef.current && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Debug overlay - only visible in development */}
                    {process.env.NODE_ENV === 'development' && (
                      <div 
                        className="absolute bg-transparent border border-red-500 font-mono text-xs z-10"
                        style={{
                          left: `${(inputOverlay.position.x / canvasRef.current.width) * 100}%`,
                          top: `${(inputOverlay.position.y / canvasRef.current.height) * 100}%`,
                          width: `${(inputOverlay.position.width / canvasRef.current.width) * 100}%`,
                          height: `${(inputOverlay.position.height / canvasRef.current.height) * 100}%`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          color: 'red',
                          fontSize: '10px'
                        }}
                      >
                        DEBUG: {inputOverlay.email || inputOverlay.password}
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
              <div className="bg-muted p-2 rounded-md text-xs font-mono max-h-24 overflow-y-auto">
                {debugInfo.slice(-5).map((info, index) => (
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