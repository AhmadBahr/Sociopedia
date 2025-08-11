import { Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User";
import { z } from "zod";

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  const user = await User.findById(id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
}

export async function followUser(req: Request, res: Response) {
  const { id } = req.params; // user to follow
  if (id === req.userId) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }
  const meId = new Types.ObjectId(req.userId);
  const targetId = new Types.ObjectId(id);
  await User.findByIdAndUpdate(meId, { $addToSet: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $addToSet: { followers: meId } });
  return res.json({ message: "Followed" });
}

export async function unfollowUser(req: Request, res: Response) {
  const { id } = req.params; // user to unfollow
  const meId = new Types.ObjectId(req.userId);
  const targetId = new Types.ObjectId(id);
  await User.findByIdAndUpdate(meId, { $pull: { following: targetId } });
  await User.findByIdAndUpdate(targetId, { $pull: { followers: meId } });
  return res.json({ message: "Unfollowed" });
}

export async function addFriend(req: Request, res: Response) {
  const { id } = req.params; // user to add as friend
  if (id === req.userId) return res.status(400).json({ message: "Cannot friend yourself" });
  const meId = new Types.ObjectId(req.userId);
  const targetId = new Types.ObjectId(id);
  await User.findByIdAndUpdate(meId, { $addToSet: { friends: targetId } });
  await User.findByIdAndUpdate(targetId, { $addToSet: { friends: meId } });
  return res.json({ message: "Friend added" });
}

export async function removeFriend(req: Request, res: Response) {
  const { id } = req.params; // user to remove as friend
  const meId = new Types.ObjectId(req.userId);
  const targetId = new Types.ObjectId(id);
  await User.findByIdAndUpdate(meId, { $pull: { friends: targetId } });
  await User.findByIdAndUpdate(targetId, { $pull: { friends: meId } });
  return res.json({ message: "Friend removed" });
}

export async function updateMe(req: Request, res: Response) {
  const schema = z.object({
    name: z.string().min(2).optional(),
    bio: z.string().max(300).optional(),
    avatarUrl: z.string().url().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid" });
  const updated = await User.findByIdAndUpdate(req.userId, parsed.data, {
    new: true,
    select: "-passwordHash",
  });
  return res.json(updated);
}

export async function searchUsers(req: Request, res: Response) {
  const q = String(req.query.q ?? "").trim();
  if (!q) return res.json([]);
  const users = await User.find({ name: { $regex: q, $options: "i" } })
    .select("name avatarUrl bio")
    .limit(10);
  return res.json(users);
}

export async function getFollowers(req: Request, res: Response) {
  const { id } = req.params;
  const users = await User.findById(id)
    .populate("followers", "name avatarUrl")
    .select("followers");
  return res.json(users?.followers ?? []);
}

export async function getFollowing(req: Request, res: Response) {
  const { id } = req.params;
  const users = await User.findById(id)
    .populate("following", "name avatarUrl")
    .select("following");
  return res.json(users?.following ?? []);
}

export async function getFriends(req: Request, res: Response) {
  const { id } = req.params;
  const users = await User.findById(id)
    .populate("friends", "name avatarUrl")
    .select("friends");
  return res.json(users?.friends ?? []);
}

