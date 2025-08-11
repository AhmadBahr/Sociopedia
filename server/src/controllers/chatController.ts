import { Request, Response } from "express";
import { Types } from "mongoose";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";

export async function listConversations(req: Request, res: Response) {
  const myId = new Types.ObjectId(req.userId);
  const convos = await Conversation.find({ participants: myId })
    .sort({ lastMessageAt: -1 })
    .populate("participants", "name avatarUrl");
  res.json(convos);
}

export async function getOrCreateConversation(a: string, b: string) {
  const ids = [new Types.ObjectId(a), new Types.ObjectId(b)];
  ids.sort((x, y) => x.toString().localeCompare(y.toString()));
  let convo = await Conversation.findOne({ participants: { $all: ids, $size: 2 } });
  if (!convo) {
    convo = await Conversation.create({ participants: ids });
  }
  return convo;
}

export async function listMessages(req: Request, res: Response) {
  const { userId } = req.params; // other participant
  const convo = await getOrCreateConversation(req.userId, userId);
  const cursor = String(req.query.cursor ?? '');
  const limit = Math.min(parseInt(String(req.query.limit ?? '50'), 10) || 50, 100);
  const query: any = { conversation: convo._id };
  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }
  const messages = await Message.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.json(messages.reverse());
}

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const { text } = req.body as { text: string };
  if (!text || !text.trim()) {
    res.status(400).json({ message: "Empty" });
    return;
  }
  const convo = await getOrCreateConversation(req.userId, userId);
  const msg = await Message.create({
    conversation: convo._id,
    from: new Types.ObjectId(req.userId),
    to: new Types.ObjectId(userId),
    text,
  });
  await Conversation.findByIdAndUpdate(convo._id, { lastMessageAt: new Date() });
  res.status(201).json(msg);
  return;
}

