"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    conversation: { type: mongoose_1.Schema.Types.ObjectId, ref: "Conversation", required: true },
    from: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    readAt: { type: Date },
}, { timestamps: { createdAt: true, updatedAt: false } });
messageSchema.index({ conversation: 1, createdAt: -1 });
exports.Message = (0, mongoose_1.model)("Message", messageSchema);
