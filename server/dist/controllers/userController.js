"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.getUserById = getUserById;
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
exports.addFriend = addFriend;
exports.removeFriend = removeFriend;
exports.updateMe = updateMe;
exports.searchUsers = searchUsers;
exports.getFollowers = getFollowers;
exports.getFollowing = getFollowing;
exports.getFriends = getFriends;
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User");
const zod_1 = require("zod");
async function getMe(req, res) {
    const user = await User_1.User.findById(req.userId).select("-passwordHash");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    return res.json(user);
}
async function getUserById(req, res) {
    const { id } = req.params;
    const user = await User_1.User.findById(id).select("-passwordHash");
    if (!user)
        return res.status(404).json({ message: "User not found" });
    return res.json(user);
}
async function followUser(req, res) {
    const { id } = req.params; // user to follow
    if (id === req.userId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
    }
    const meId = new mongoose_1.Types.ObjectId(req.userId);
    const targetId = new mongoose_1.Types.ObjectId(id);
    await User_1.User.findByIdAndUpdate(meId, { $addToSet: { following: targetId } });
    await User_1.User.findByIdAndUpdate(targetId, { $addToSet: { followers: meId } });
    return res.json({ message: "Followed" });
}
async function unfollowUser(req, res) {
    const { id } = req.params; // user to unfollow
    const meId = new mongoose_1.Types.ObjectId(req.userId);
    const targetId = new mongoose_1.Types.ObjectId(id);
    await User_1.User.findByIdAndUpdate(meId, { $pull: { following: targetId } });
    await User_1.User.findByIdAndUpdate(targetId, { $pull: { followers: meId } });
    return res.json({ message: "Unfollowed" });
}
async function addFriend(req, res) {
    const { id } = req.params; // user to add as friend
    if (id === req.userId)
        return res.status(400).json({ message: "Cannot friend yourself" });
    const meId = new mongoose_1.Types.ObjectId(req.userId);
    const targetId = new mongoose_1.Types.ObjectId(id);
    await User_1.User.findByIdAndUpdate(meId, { $addToSet: { friends: targetId } });
    await User_1.User.findByIdAndUpdate(targetId, { $addToSet: { friends: meId } });
    return res.json({ message: "Friend added" });
}
async function removeFriend(req, res) {
    const { id } = req.params; // user to remove as friend
    const meId = new mongoose_1.Types.ObjectId(req.userId);
    const targetId = new mongoose_1.Types.ObjectId(id);
    await User_1.User.findByIdAndUpdate(meId, { $pull: { friends: targetId } });
    await User_1.User.findByIdAndUpdate(targetId, { $pull: { friends: meId } });
    return res.json({ message: "Friend removed" });
}
async function updateMe(req, res) {
    const schema = zod_1.z.object({
        name: zod_1.z.string().min(2).optional(),
        bio: zod_1.z.string().max(300).optional(),
        avatarUrl: zod_1.z.string().url().optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid" });
    const updated = await User_1.User.findByIdAndUpdate(req.userId, parsed.data, {
        new: true,
        select: "-passwordHash",
    });
    return res.json(updated);
}
async function searchUsers(req, res) {
    const q = String(req.query.q ?? "").trim();
    if (!q)
        return res.json([]);
    const users = await User_1.User.find({ name: { $regex: q, $options: "i" } })
        .select("name avatarUrl bio")
        .limit(10);
    return res.json(users);
}
async function getFollowers(req, res) {
    const { id } = req.params;
    const users = await User_1.User.findById(id)
        .populate("followers", "name avatarUrl")
        .select("followers");
    return res.json(users?.followers ?? []);
}
async function getFollowing(req, res) {
    const { id } = req.params;
    const users = await User_1.User.findById(id)
        .populate("following", "name avatarUrl")
        .select("following");
    return res.json(users?.following ?? []);
}
async function getFriends(req, res) {
    const { id } = req.params;
    const users = await User_1.User.findById(id)
        .populate("friends", "name avatarUrl")
        .select("friends");
    return res.json(users?.friends ?? []);
}
