import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { listConversations, listMessages, sendMessage } from "../controllers/chatController";

export const chatRouter = Router();

chatRouter.get("/conversations", requireAuth, asyncHandler(listConversations));
chatRouter.get("/messages/:userId", requireAuth, asyncHandler(listMessages));
chatRouter.post("/messages/:userId", requireAuth, asyncHandler(sendMessage));

