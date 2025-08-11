import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { getOrCreateConversation } from '../controllers/chatController';
import { Message } from '../models/Message';
import { Types } from 'mongoose';

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Unauthorized'));
    try {
      const payload = jwt.verify(token, env.jwtSecret) as { userId: string };
      (socket as any).userId = payload.userId;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId as string;

    socket.on('chat:typing', ({ to, typing }: { to: string; typing: boolean }) => {
      io.to(to).emit('chat:typing', { from: userId, typing });
    });

    socket.on('chat:send', async ({ to, text }: { to: string; text: string }) => {
      if (!text || !text.trim()) return;
      const convo = await getOrCreateConversation(userId, to);
      const msg = await Message.create({
        conversation: convo._id,
        from: new Types.ObjectId(userId),
        to: new Types.ObjectId(to),
        text,
      });
      io.to(to).emit('chat:message', msg);
      socket.emit('chat:message', msg);
    });

    socket.on('chat:read', async ({ conversationId }: { conversationId: string }) => {
      await Message.updateMany({ conversation: conversationId, to: new Types.ObjectId(userId), readAt: { $exists: false } }, { $set: { readAt: new Date() } });
      io.to(userId).emit('chat:read', { conversationId });
    });

    // Join personal room for direct messages
    socket.join(userId);

    socket.on('disconnect', () => {});
  });

  return io;
}

