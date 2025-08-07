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

  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default');
  const [lastClickPosition, setLastClickPosition] = useState<{ x: number; y: number } | null>(null);

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
    console.log('🔌 connectToWebSocket called!', { userId, existingSocket: !!socket });
    
    if (socket) {
      console.log('🔌 Disconnecting existing socket...');
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
        console.log('✅ WebSocket connected successfully!');
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
        
        // Check for double base64 issue
        if (data.data && typeof data.data === 'string') {
          if (data.data.includes('data:image/jpeg;base64,data:image/jpeg;base64,')) {
            console.error('Frontend: ❌ DOUBLE BASE64 DETECTED! This is the bug!');
            console.error('Frontend: Double base64 data:', data.data.substring(0, 100) + '...');
          } else if (data.data.startsWith('data:image/jpeg;base64,')) {
            console.log('Frontend: ✅ Valid single base64 data detected');
            setScreencastData(data.data);
            console.log('Frontend: ✅ Screenshot data set successfully');
          } else if (data.data.startsWith('data:image/png;base64,')) {
            console.log('Frontend: ✅ Valid PNG base64 data detected');
            setScreencastData(data.data);
            console.log('Frontend: ✅ PNG screenshot data set successfully');
          } else {
            console.error('Frontend: ❌ Invalid data URL format:', data.data.substring(0, 50));
          }
        } else {
          console.error('Frontend: ❌ No data or invalid data type:', data.data);
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

      newSocket.on('fieldClicked', (data) => {
        console.log('Frontend: Received fieldClicked event:', data);
        
        if (data.success) {
          addDebugInfo(`Field clicked successfully: ${data.fieldType}`);
          console.log('Frontend: Field click successful:', data.fieldType, 'using selector:', data.selector);
          
          // Update active field based on the clicked field
          if (data.fieldType === 'email') {
            setInputOverlay(prev => ({
              ...prev,
              activeField: 'email',
              cursorPosition: prev.email.length
            }));
          } else if (data.fieldType === 'password') {
            setInputOverlay(prev => ({
              ...prev,
              activeField: 'password',
              cursorPosition: prev.password.length
            }));
          } else if (data.fieldType === 'signin') {
            // Clear active field when clicking sign in button
            setInputOverlay(prev => ({
              ...prev,
              activeField: null,
              cursorPosition: 0
            }));
          }
        } else {
          addDebugInfo(`Field click failed: ${data.error}`);
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

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Scale coordinates to match the actual image size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const scaledX = x * scaleX;
    const scaledY = y * scaleY;

    setCursorPosition({ x: scaledX, y: scaledY });

    // Determine cursor type based on position
    const emailFieldArea = { x: 448, y: 264, width: 304, height: 52 };
    const passwordFieldArea = { x: 448, y: 316, width: 304, height: 52 };
    const signInButtonArea = { x: 448, y: 400, width: 304, height: 48 };

    if ((scaledX >= emailFieldArea.x && scaledX <= emailFieldArea.x + emailFieldArea.width &&
         scaledY >= emailFieldArea.y && scaledY <= emailFieldArea.y + emailFieldArea.height) ||
        (scaledX >= passwordFieldArea.x && scaledX <= passwordFieldArea.x + passwordFieldArea.width &&
         scaledY >= passwordFieldArea.y && scaledY <= passwordFieldArea.y + passwordFieldArea.height)) {
      setCursorType('text');
    } else if (scaledX >= signInButtonArea.x && scaledX <= signInButtonArea.x + signInButtonArea.width &&
               scaledY >= signInButtonArea.y && scaledY <= signInButtonArea.y + signInButtonArea.height) {
      setCursorType('pointer');
    } else {
      setCursorType('default');
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    console.log('🎯 handleCanvasClick called!', { 
      socket: !!socket, 
      canvasRef: !!canvasRef.current,
      isConnected,
      screencastData: !!screencastData,
      eventType: event.type,
      clientX: event.clientX,
      clientY: event.clientY,
      target: event.target,
      currentTarget: event.currentTarget
    });
    
    // Додаємо додаткове логування для дебагу
    console.log('🎯 Canvas element:', {
      canvas: canvasRef.current,
      canvasWidth: canvasRef.current?.width,
      canvasHeight: canvasRef.current?.height,
      canvasStyle: canvasRef.current?.style
    });
    
    if (!socket || !canvasRef.current) {
      console.log('❌ Early return - socket or canvas not available');
      return;
    }

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

    // Store last click position for debugging
    setLastClickPosition({ x: pageX, y: pageY });

    console.log('🎯 UI Click detected:', {
      display: { x: Math.round(x), y: Math.round(y) },
      page: { x: Math.round(pageX), y: Math.round(pageY) },
      canvas: { width: canvas.width, height: canvas.height },
      rect: { width: rect.width, height: rect.height }
    });

    addDebugInfo(`🎯 UI Click: display (${Math.round(x)}, ${Math.round(y)}) -> page (${Math.round(pageX)}, ${Math.round(pageY)})`);

    // Clear click indicator after 3 seconds
    setTimeout(() => {
      setLastClickPosition(null);
    }, 3000);
    
    // Check if click is on email, password, or sign in button areas (approximate LinkedIn positions)
    const emailFieldArea = { x: 448, y: 264, width: 304, height: 52 };
    const passwordFieldArea = { x: 448, y: 316, width: 304, height: 52 };
    const signInButtonArea = { x: 448, y: 400, width: 304, height: 48 }; // Approximate sign in button area

    if (pageX >= emailFieldArea.x && pageX <= emailFieldArea.x + emailFieldArea.width &&
        pageY >= emailFieldArea.y && pageY <= emailFieldArea.y + emailFieldArea.height) {
      // Click on email field
      console.log('Clicking email field');
      addDebugInfo('Clicking email field');
      socket.emit('clickField', {
        fieldType: 'email',
        x: pageX,
        y: pageY
      });
      
      // Update local state
      setInputOverlay(prev => ({
        ...prev,
        activeField: 'email',
        cursorPosition: prev.email.length
      }));
    } else if (pageX >= passwordFieldArea.x && pageX <= passwordFieldArea.x + passwordFieldArea.width &&
               pageY >= passwordFieldArea.y && pageY <= passwordFieldArea.y + passwordFieldArea.height) {
      // Click on password field
      console.log('Clicking password field');
      addDebugInfo('Clicking password field');
      socket.emit('clickField', {
        fieldType: 'password',
        x: pageX,
        y: pageY
      });
      
      // Update local state
      setInputOverlay(prev => ({
        ...prev,
        activeField: 'password',
        cursorPosition: prev.password.length
      }));
    } else if (pageX >= signInButtonArea.x && pageX <= signInButtonArea.x + signInButtonArea.width &&
               pageY >= signInButtonArea.y && pageY <= signInButtonArea.y + signInButtonArea.height) {
      // Click on sign in button
      console.log('🔘 Clicking sign in button');
      addDebugInfo('Clicking sign in button');
      
      console.log('🔘 Sending clickField event:', { fieldType: 'signin', x: pageX, y: pageY });
      socket.emit('clickField', {
        fieldType: 'signin',
        x: pageX,
        y: pageY
      });
    } else {
      // Regular mouse click
      console.log('🖱️ Sending regular mouse click to backend:', { x: pageX, y: pageY });
      
      socket.emit('mouse', {
        type: 'click',
        x: pageX,
        y: pageY,
      });
    }
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
      console.log('Frontend: Updating canvas with screencast data');
      console.log('Frontend: Screencast data length:', screencastData.length);
      console.log('Frontend: Screencast data starts with:', screencastData.substring(0, 50));
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      img.onload = () => {
        console.log('Frontend: Image loaded successfully', { 
          naturalWidth: img.naturalWidth, 
          naturalHeight: img.naturalHeight 
        });
        if (ctx) {
          // Set canvas size to match the natural image size
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          console.log('Frontend: Canvas updated with image', { 
            canvasWidth: canvas.width, 
            canvasHeight: canvas.height 
          });
          
          // Додаємо логування для перевірки canvas після оновлення
          console.log('🎯 Canvas after image update:', {
            canvas: canvas,
            canvasRef: canvasRef.current,
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            canvasStyle: canvas.style,
            canvasOnClick: canvas.onclick
          });
        }
      };

      img.onerror = (error) => {
        console.error('Frontend: Image load error:', error);
        console.error('Frontend: Failed to load image from:', screencastData.substring(0, 100));
      };

      img.src = screencastData;
      console.log('Frontend: Set image src to screencast data');
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
                  className="w-full h-auto max-h-[70vh] object-contain"
                  style={{ 
                    imageRendering: 'pixelated',
                    maxWidth: '100%',
                    height: 'auto',
                    cursor: cursorType === 'text' ? 'text' : cursorType === 'pointer' ? 'pointer' : 'crosshair'
                  }}
                  onClick={(e) => {
                    console.log('🎯 Canvas onClick triggered!', { 
                      event: e.type, 
                      clientX: e.clientX, 
                      clientY: e.clientY 
                    });
                    handleCanvasClick(e);
                  }}
                  onDoubleClick={(e) => {
                    console.log('🎯 Canvas onDoubleClick triggered!', { 
                      event: e.type, 
                      clientX: e.clientX, 
                      clientY: e.clientY 
                    });
                    handleCanvasClick(e);
                  }}
                  onMouseMove={handleCanvasMouseMove}
                  onWheel={handleScroll}
                />
                <img
                  ref={imageRef}
                  style={{ display: 'none' }}
                  alt="Screencast"
                />
                
                {/* LinkedIn-style cursor overlay */}
                {cursorPosition && (
                  <div 
                    className="absolute pointer-events-none z-20"
                    style={{
                      left: `${(cursorPosition.x / (canvasRef.current?.width || 1)) * 100}%`,
                      top: `${(cursorPosition.y / (canvasRef.current?.height || 1)) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full opacity-80 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    {cursorType === 'text' && (
                      <div className="absolute top-6 left-3 w-0.5 h-4 bg-blue-500 animate-pulse"></div>
                    )}
                  </div>
                )}

                {/* Last click indicator */}
                {lastClickPosition && (
                  <div 
                    className="absolute pointer-events-none z-30"
                    style={{
                      left: `${(lastClickPosition.x / (canvasRef.current?.width || 1)) * 100}%`,
                      top: `${(lastClickPosition.y / (canvasRef.current?.height || 1)) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full opacity-90 flex items-center justify-center animate-ping">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      Click: {Math.round(lastClickPosition.x)}, {Math.round(lastClickPosition.y)}
                    </div>
                  </div>
                )}
                
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

          {/* Click Information */}
          {lastClickPosition && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Click Tracking</h4>
              <div className="bg-blue-50 p-2 rounded-md text-xs">
                <div className="font-semibold text-blue-800">Last Click Position:</div>
                <div className="text-blue-600">
                  Page: ({Math.round(lastClickPosition.x)}, {Math.round(lastClickPosition.y)})
                </div>
                <div className="text-blue-600">
                  Canvas: {canvasRef.current?.width || 0} x {canvasRef.current?.height || 0}
                </div>
                <div className="text-blue-600">
                  Scale: {canvasRef.current ? (canvasRef.current.width / canvasRef.current.getBoundingClientRect().width).toFixed(2) : 'N/A'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 