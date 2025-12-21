import { auth } from '../config/firebase';

class WebSocketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000;
    this.currentExercise = null;
    this.reconnectTimeoutId = null;
    this.isReconnecting = false;
    this.heartbeatIntervalId = null;
    this.heartbeatInterval = 30000; // 30 seconds
    this.missedHeartbeats = 0;
    this.maxMissedHeartbeats = 3;
    this.callbacks = {
      onConnect: [],
      onDisconnect: [],
      onMessage: [],
      onError: []
    };
  }

  connect(exercise = null, baseUrl = null) {
    // Get current user's UID from Firebase Auth
    const currentUser = auth.currentUser;
    const userId = currentUser?.uid;

    if (!userId) {
      console.error('❌ Cannot connect to WebSocket: User not authenticated');
      this.callbacks.onError.forEach(callback => 
        callback(new Error('User not authenticated'))
      );
      return;
    }
    const wsProtocol = 'wss'
    const wsHost = 'araise-backend-code.onrender.com'
    
    // Build complete WebSocket URL with exercise path parameter and user_id query
    let wsUrl;
    if (exercise) {
      // Normalize exercise name (lowercase, spaces to hyphens)
      wsUrl = `${wsProtocol}://${wsHost}/ws/${exercise}?user_id=${userId}`;
      this.currentExercise = exercise;
      console.log('🔗 Connecting to WebSocket URL:', wsUrl);
      console.log('🏃 Exercise:', exercise, '→', exercise);
      console.log('👤 User ID:', userId);
    } else {
      // Fallback to generic endpoint
      wsUrl = `${wsProtocol}://${wsHost}/ws?user_id=${userId}`;
      this.currentExercise = null;
      console.log('🔗 Connecting to generic WebSocket URL:', wsUrl);
      console.log('👤 User ID:', userId);
    }

    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully to:', wsUrl);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        this.missedHeartbeats = 0;
        
        // Clear any pending reconnect timeout
        if (this.reconnectTimeoutId) {
          clearTimeout(this.reconnectTimeoutId);
          this.reconnectTimeoutId = null;
        }
        
        // Start heartbeat to keep connection alive
        this.startHeartbeat();
        
        this.callbacks.onConnect.forEach(callback => callback());
      };

      this.ws.onmessage = (event) => {
        console.log('🔵 Raw WebSocket message received:', event);
        console.log('🔵 Message data type:', typeof event.data);
        console.log('🔵 Message data content:', event.data);
        
        try {
          const data = JSON.parse(event.data);
          
          // Handle pong response for heartbeat
          if (data.type === 'pong') {
            this.missedHeartbeats = 0;
            console.log('💓 Heartbeat acknowledged');
            return;
          }
          
          console.log('🟢 Parsed WebSocket data:', data);
          console.log('🟢 Callbacks count:', this.callbacks.onMessage.length);
          this.callbacks.onMessage.forEach((callback, index) => {
            console.log(`📞 Calling onMessage callback ${index} with:`, data);
            callback(data);
          });
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error);
          console.error('❌ Raw message that failed to parse:', event.data);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected. Code:', event.code, 'Reason:', event.reason);
        this.isConnected = false;
        
        // Stop heartbeat
        this.stopHeartbeat();
        
        // Only trigger disconnect callbacks if not already reconnecting
        if (!this.isReconnecting) {
          this.callbacks.onDisconnect.forEach(callback => callback());
        }
        
        // Only attempt reconnect if it wasn't a clean closure (code 1000)
        if (event.code !== 1000) {
          this.handleReconnect(exercise, baseUrl);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.callbacks.onError.forEach(callback => callback(error));
      };

    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.callbacks.onError.forEach(callback => callback(error));
    }
  }

  handleReconnect(exercise, baseUrl) {
    // Clear any existing reconnect timeout
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.isReconnecting = true;
      
      // Exponential backoff: 3s, 6s, 12s, 24s, 48s (for Render.com cold starts)
      const backoffDelay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${backoffDelay}ms`);
      console.log('💡 Tip: Render.com free tier may take 30-60s to wake up from sleep');
      
      this.reconnectTimeoutId = setTimeout(() => {
        this.connect(exercise, baseUrl);
      }, backoffDelay);
    } else {
      console.log('Max reconnect attempts reached');
      this.isReconnecting = false;
      this.callbacks.onError.forEach(callback => 
        callback(new Error('Max reconnect attempts reached. Backend may be sleeping or unavailable.'))
      );
    }
  }

  sendCoordinates(exerciseData) {
    console.log('📡 sendCoordinates called with:', exerciseData);
    console.log('🔗 WebSocket status:', {
      isConnected: this.isConnected,
      hasWs: !!this.ws,
      readyState: this.ws?.readyState
    });
    
    if (!this.isConnected || !this.ws) {
      console.warn('❌ WebSocket not connected, cannot send coordinates');
      return false;
    }

    try {
      // Send data directly without wrapping - backend expects raw coordinate data
      const message = JSON.stringify(exerciseData);
      
      console.log('📤 Sending raw coordinates:', exerciseData);
      console.log('📄 JSON message:', message);
      this.ws.send(message);
      console.log('✅ Coordinates sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending coordinates:', error);
      return false;
    }
  }

  sendWorkoutStart(exerciseName, planId, level) {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket not connected');
      return false;
    }

    try {
      const message = JSON.stringify({
        type: 'workout_start',
        data: {
          exercise: exerciseName,
          planId: planId,
          level: level,
          timestamp: Date.now()
        }
      });
      
      this.ws.send(message);
      return true;
    } catch (error) {
      console.error('Error sending workout start:', error);
      return false;
    }
  }

  sendWorkoutEnd(exerciseName) {
    if (!this.isConnected || !this.ws) {
      console.warn('WebSocket not connected');
      return false;
    }

    try {
      const message = JSON.stringify({
        type: 'workout_end',
        data: {
          exercise: exerciseName,
          timestamp: Date.now()
        }
      });
      
      this.ws.send(message);
      return true;
    } catch (error) {
      console.error('Error sending workout end:', error);
      return false;
    }
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }

  startHeartbeat() {
    // Clear any existing heartbeat
    this.stopHeartbeat();
    
    this.heartbeatIntervalId = setInterval(() => {
      if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.missedHeartbeats++;
        
        if (this.missedHeartbeats >= this.maxMissedHeartbeats) {
          console.warn('💔 Too many missed heartbeats, connection may be dead');
          this.ws.close();
          return;
        }
        
        try {
          // Send ping
          this.ws.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
          console.log('💓 Heartbeat ping sent');
        } catch (error) {
          console.error('Error sending heartbeat:', error);
        }
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatIntervalId) {
      clearInterval(this.heartbeatIntervalId);
      this.heartbeatIntervalId = null;
    }
    this.missedHeartbeats = 0;
  }

  disconnect() {
    // Clear reconnect timeout
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    
    // Stop heartbeat
    this.stopHeartbeat();
    
    this.reconnectAttempts = 0;
    this.isReconnecting = false;
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect'); // Clean closure
      this.ws = null;
      this.isConnected = false;
      this.currentExercise = null;
    }
  }

  // Helper method to connect to a specific exercise endpoint
  connectToExercise(exerciseName, baseUrl = null) {
    console.log(`Connecting to exercise endpoint: ${exerciseName}`);
    this.connect(exerciseName, baseUrl);
  }

  // Helper method to switch exercises (disconnect and reconnect)
  switchExercise(newExerciseName, baseUrl = null) {
    console.log(`Switching from ${this.currentExercise} to ${newExerciseName}`);
    this.disconnect();
    setTimeout(() => {
      this.connectToExercise(newExerciseName, baseUrl);
    }, 100);
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      currentExercise: this.currentExercise
    };
  }
}

export const webSocketService = new WebSocketService();
