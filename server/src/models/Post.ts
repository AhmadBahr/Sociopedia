import { Schema, model, Types, Document } from "mongoose";

export interface CommentSubdoc {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface PostDocument extends Document {
  user: Types.ObjectId;
  content: string;
  imageUrl?: string;
  likes: Types.ObjectId[];
  comments: CommentSubdoc[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentSubdoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const postSchema = new Schema<PostDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageUrl: String,
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export const Post = model<PostDocument>("Post", postSchema);

