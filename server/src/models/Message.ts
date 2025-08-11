import { Schema, model, Types, Document } from "mongoose";

export interface MessageDocument extends Document {
  conversation: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  text: string;
  createdAt: Date;
  readAt?: Date;
}

const messageSchema = new Schema<MessageDocument>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ conversation: 1, createdAt: -1 });

export const Message = model<MessageDocument>("Message", messageSchema);

