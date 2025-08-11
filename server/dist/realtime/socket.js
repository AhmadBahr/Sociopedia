"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = initSocket;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const chatController_1 = require("../controllers/chatController");
const Message_1 = require("../models/Message");
const mongoose_1 = require("mongoose");
function initSocket(server) {
    const io = new socket_io_1.Server(server, {
        cors: { origin: env_1.env.clientUrl, credentials: true },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error('Unauthorized'));
        try {
            const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
            socket.userId = payload.userId;
            next();
        }
        catch {
            next(new Error('Unauthorized'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        socket.on('chat:typing', ({ to, typing }) => {
            io.to(to).emit('chat:typing', { from: userId, typing });
        });
        socket.on('chat:send', async ({ to, text }) => {
            if (!text || !text.trim())
                return;
            const convo = await (0, chatController_1.getOrCreateConversation)(userId, to);
            const msg = await Message_1.Message.create({
                conversation: convo._id,
                from: new mongoose_1.Types.ObjectId(userId),
                to: new mongoose_1.Types.ObjectId(to),
                text,
            });
            io.to(to).emit('chat:message', msg);
            socket.emit('chat:message', msg);
        });
        socket.on('chat:read', async ({ conversationId }) => {
            await Message_1.Message.updateMany({ conversation: conversationId, to: new mongoose_1.Types.ObjectId(userId), readAt: { $exists: false } }, { $set: { readAt: new Date() } });
            io.to(userId).emit('chat:read', { conversationId });
        });
        // Join personal room for direct messages
        socket.join(userId);
        socket.on('disconnect', () => { });
    });
    return io;
}
