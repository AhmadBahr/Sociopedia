"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.getFeed = getFeed;
exports.toggleLike = toggleLike;
exports.addComment = addComment;
exports.getUserPosts = getUserPosts;
exports.deletePost = deletePost;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const Post_1 = require("../models/Post");
const User_1 = require("../models/User");
const createPostSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().url().optional(),
});
async function createPost(req, res) {
    const body = {
        content: req.body.content,
        imageUrl: req.file
            ? `/uploads/${req.file.filename}`
            : req.body.imageUrl,
    };
    const parsed = createPostSchema.safeParse(body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid post" });
    }
    const post = await Post_1.Post.create({
        user: req.userId,
        content: parsed.data.content,
        imageUrl: parsed.data.imageUrl,
    });
    return res.status(201).json(post);
}
async function getFeed(req, res) {
    const me = await User_1.User.findById(req.userId).select("following");
    const who = [new mongoose_1.Types.ObjectId(req.userId)];
    if (me) {
        who.push(...me.following);
    }
    const posts = await Post_1.Post.find({ user: { $in: who } })
        .populate("user", "name avatarUrl")
        .sort({ createdAt: -1 })
        .limit(50);
    return res.json(posts);
}
async function toggleLike(req, res) {
    const { id } = req.params; // post id
    const post = await Post_1.Post.findById(id);
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    const meId = new mongoose_1.Types.ObjectId(req.userId);
    const hasLiked = post.likes.some((l) => l.equals(meId));
    if (hasLiked) {
        post.likes = post.likes.filter((l) => !l.equals(meId));
    }
    else {
        post.likes.push(meId);
    }
    await post.save();
    return res.json({ likes: post.likes.length, liked: !hasLiked });
}
async function addComment(req, res) {
    const schema = zod_1.z.object({ text: zod_1.z.string().min(1) });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ message: "Invalid" });
    const { id } = req.params;
    const post = await Post_1.Post.findById(id);
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    post.comments.push({
        _id: new mongoose_1.Types.ObjectId(),
        user: new mongoose_1.Types.ObjectId(req.userId),
        text: parsed.data.text,
        createdAt: new Date(),
    });
    await post.save();
    return res.status(201).json(post);
}
async function getUserPosts(req, res) {
    const { userId } = req.params;
    const posts = await Post_1.Post.find({ user: userId })
        .populate("user", "name avatarUrl")
        .sort({ createdAt: -1 })
        .limit(50);
    return res.json(posts);
}
async function deletePost(req, res) {
    const { id } = req.params; // post id
    const post = await Post_1.Post.findById(id);
    if (!post)
        return res.status(404).json({ message: "Post not found" });
    if (post.user.toString() !== req.userId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    await post.deleteOne();
    return res.json({ message: "Deleted" });
}
