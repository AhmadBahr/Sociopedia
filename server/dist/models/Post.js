"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
const postSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageUrl: String,
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
}, { timestamps: true });
exports.Post = (0, mongoose_1.model)("Post", postSchema);
