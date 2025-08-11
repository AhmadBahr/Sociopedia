"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listConversations = listConversations;
exports.getOrCreateConversation = getOrCreateConversation;
exports.listMessages = listMessages;
exports.sendMessage = sendMessage;
const mongoose_1 = require("mongoose");
const Conversation_1 = require("../models/Conversation");
const Message_1 = require("../models/Message");
async function listConversations(req, res) {
    const myId = new mongoose_1.Types.ObjectId(req.userId);
    const convos = await Conversation_1.Conversation.find({ participants: myId })
        .sort({ lastMessageAt: -1 })
        .populate("participants", "name avatarUrl");
    res.json(convos);
}
async function getOrCreateConversation(a, b) {
    const ids = [new mongoose_1.Types.ObjectId(a), new mongoose_1.Types.ObjectId(b)];
    ids.sort((x, y) => x.toString().localeCompare(y.toString()));
    let convo = await Conversation_1.Conversation.findOne({ participants: { $all: ids, $size: 2 } });
    if (!convo) {
        convo = await Conversation_1.Conversation.create({ participants: ids });
    }
    return convo;
}
async function listMessages(req, res) {
    const { userId } = req.params; // other participant
    const convo = await getOrCreateConversation(req.userId, userId);
    const cursor = String(req.query.cursor ?? '');
    const limit = Math.min(parseInt(String(req.query.limit ?? '50'), 10) || 50, 100);
    const query = { conversation: convo._id };
    if (cursor) {
        query.createdAt = { $lt: new Date(cursor) };
    }
    const messages = await Message_1.Message.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    res.json(messages.reverse());
}
async function sendMessage(req, res) {
    const { userId } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
        res.status(400).json({ message: "Empty" });
        return;
    }
    const convo = await getOrCreateConversation(req.userId, userId);
    const msg = await Message_1.Message.create({
        conversation: convo._id,
        from: new mongoose_1.Types.ObjectId(req.userId),
        to: new mongoose_1.Types.ObjectId(userId),
        text,
    });
    await Conversation_1.Conversation.findByIdAndUpdate(convo._id, { lastMessageAt: new Date() });
    res.status(201).json(msg);
    return;
}
