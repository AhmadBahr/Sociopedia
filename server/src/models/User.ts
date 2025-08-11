import { Schema, model, Types, Document } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  friends: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    avatarUrl: String,
    bio: { type: String, default: "" },
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const User = model<UserDocument>("User", userSchema);

