import { Request, Response } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import { Post } from "../models/Post";
import { User } from "../models/User";

const createPostSchema = z.object({
  content: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export async function createPost(req: Request, res: Response) {
  const body = {
    content: req.body.content,
    imageUrl: (req as any).file
      ? `/uploads/${(req as any).file.filename}`
      : req.body.imageUrl,
  };
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid post" });
  }
  const post = await Post.create({
    user: req.userId,
    content: parsed.data.content,
    imageUrl: parsed.data.imageUrl,
  });
  return res.status(201).json(post);
}

export async function getFeed(req: Request, res: Response) {
  const me = await User.findById(req.userId).select("following");
  const who: Types.ObjectId[] = [new Types.ObjectId(req.userId)];
  if (me) {
    who.push(...(me.following as any));
  }
  const posts = await Post.find({ user: { $in: who } })
    .populate("user", "name avatarUrl")
    .sort({ createdAt: -1 })
    .limit(50);
  return res.json(posts);
}

export async function toggleLike(req: Request, res: Response) {
  const { id } = req.params; // post id
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const meId = new Types.ObjectId(req.userId);
  const hasLiked = post.likes.some((l) => l.equals(meId));
  if (hasLiked) {
    post.likes = post.likes.filter((l) => !l.equals(meId));
  } else {
    post.likes.push(meId);
  }
  await post.save();
  return res.json({ likes: post.likes.length, liked: !hasLiked });
}

export async function addComment(req: Request, res: Response) {
  const schema = z.object({ text: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid" });
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.comments.push({
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(req.userId),
    text: parsed.data.text,
    createdAt: new Date(),
  } as any);
  await post.save();
  return res.status(201).json(post);
}

export async function getUserPosts(req: Request, res: Response) {
  const { userId } = req.params;
  const posts = await Post.find({ user: userId })
    .populate("user", "name avatarUrl")
    .sort({ createdAt: -1 })
    .limit(50);
  return res.json(posts);
}

export async function deletePost(req: Request, res: Response) {
  const { id } = req.params; // post id
  const post = await Post.findById(id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (post.user.toString() !== req.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }
  await post.deleteOne();
  return res.json({ message: "Deleted" });
}

