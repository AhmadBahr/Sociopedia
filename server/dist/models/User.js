"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    avatarUrl: String,
    bio: { type: String, default: "" },
    followers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    friends: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
exports.User = (0, mongoose_1.model)("User", userSchema);
