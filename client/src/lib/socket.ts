import { io } from 'socket.io-client';
import { SERVER_ORIGIN } from './config';

let socket: ReturnType<typeof io> | null = null;

export function getSocket() {
  if (socket) return socket;
  socket = io(SERVER_ORIGIN, {
    transports: ['websocket'],
    auth: {
      token: localStorage.getItem('token') || '',
    },
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

