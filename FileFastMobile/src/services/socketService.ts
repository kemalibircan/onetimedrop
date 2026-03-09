import { io, Socket } from 'socket.io-client';

export interface FileRecord {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: number;
  status: 'ready' | 'failed';
}

export interface SessionData {
  sessionId: string;
  code?: string;
  token: string;
  expiresAt: number;
  files?: FileRecord[];
}

export type SocketStatus = 'idle' | 'connecting' | 'connected' | 'paired' | 'error' | 'disconnected' | 'expired';

export interface SocketCallbacks {
  onConnected?: () => void;
  onSessionJoined?: (data: SessionData) => void;
  onError?: (message: string, code?: string) => void;
  onSessionExpired?: () => void;
  onSessionClosed?: () => void;
  onDeviceDisconnected?: (role: string) => void;
  onStatusChange?: (status: SocketStatus) => void;
}

let socket: Socket | null = null;
let currentCallbacks: SocketCallbacks = {};

export const socketService = {
  connect(serverUrl: string, callbacks: SocketCallbacks = {}) {
    currentCallbacks = callbacks;

    if (socket?.connected) {
      socket.disconnect();
    }

    callbacks.onStatusChange?.('connecting');

    socket = io(serverUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    socket.on('connect', () => {
      currentCallbacks.onStatusChange?.('connected');
      currentCallbacks.onConnected?.();
    });

    socket.on('session:joined', (data: SessionData) => {
      currentCallbacks.onStatusChange?.('paired');
      currentCallbacks.onSessionJoined?.(data);
    });

    socket.on('session:error', ({ message, code }: { message: string; code?: string }) => {
      currentCallbacks.onStatusChange?.('error');
      currentCallbacks.onError?.(message, code);
    });

    socket.on('session:expired', () => {
      currentCallbacks.onStatusChange?.('expired');
      currentCallbacks.onSessionExpired?.();
    });

    socket.on('session:closed', () => {
      currentCallbacks.onStatusChange?.('disconnected');
      currentCallbacks.onSessionClosed?.();
    });

    socket.on('session:deviceDisconnected', ({ role }: { role: string }) => {
      currentCallbacks.onDeviceDisconnected?.(role);
    });

    socket.on('disconnect', () => {
      currentCallbacks.onStatusChange?.('disconnected');
    });

    socket.on('connect_error', () => {
      currentCallbacks.onStatusChange?.('error');
      currentCallbacks.onError?.('Could not connect to server. Check your internet connection.');
    });
  },

  joinSession(code: string) {
    socket?.emit('session:join', { code });
  },

  notifyFile(sessionId: string, token: string, file: FileRecord) {
    socket?.emit('file:notify', { sessionId, token, file });
  },

  closeSession(token: string) {
    socket?.emit('session:close', { token });
  },

  disconnect() {
    socket?.disconnect();
    socket = null;
  },

  isConnected() {
    return socket?.connected ?? false;
  },
};
