import { io, Socket } from 'socket.io-client';

//const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.DEV
  ? window.location.origin
  : import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

let socket: Socket | null = null;

interface MessageData {
  chatId: string;
  message: {
    sender: string;
    text: string;
    timestamp: Date;
  };
}

interface TypingData {
  chatId: string;
  userId: string;
  isTyping: boolean;
}

export const initSocket = (): Socket => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: localStorage.getItem('token')
    },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const joinChat = (chatId: string): void => {
  if (socket?.connected) {
    socket.emit('join-chat', chatId);
    console.log('Joined chat:', chatId);
  } else if (socket) {
    socket.once('connect', () => {
      socket?.emit('join-chat', chatId);
      console.log('Delayed join chat after connection:', chatId);
    });
  }
};

export const sendMessage = (chatId: string, message: any): void => {
  if (socket?.connected) {
    socket.emit('send-message', { chatId, message });
  } else {
    console.warn('Socket not connected. Cannot send message.');
  }
};

export const onNewMessage = (callback: (data: MessageData) => void): void => {
  if (socket) {
    socket.on('new-message', callback);
  }
};

export const offNewMessage = (): void => {
  if (socket) {
    socket.off('new-message');
  }
};

export const emitTyping = (chatId: string, isTyping: boolean): void => {
  if (socket?.connected) {
    socket.emit('typing', { chatId, isTyping });
  }
};

export const onUserTyping = (callback: (data: TypingData) => void): void => {
  if (socket) {
    socket.on('user-typing', callback);
  }
};

export const offUserTyping = (): void => {
  if (socket) {
    socket.off('user-typing');
  }
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket manually disconnected');
  }
};

export const getSocket = (): Socket | null => socket;

export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};