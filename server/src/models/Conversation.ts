import { Schema, model, Types, Document } from "mongoose";

export interface ConversationDocument extends Document {
  participants: Types.ObjectId[]; // [userA, userB]
  lastMessageAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
  lastMessageAt: { type: Date, default: Date.now },
});

conversationSchema.index({ participants: 1 });

export const Conversation = model<ConversationDocument>("Conversation", conversationSchema);

