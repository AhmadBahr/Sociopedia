import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import { addComment, createPost, getFeed, toggleLike, getUserPosts, deletePost } from "../controllers/postController";
import { upload } from "../middleware/upload";

export const postRouter = Router();

postRouter.get("/feed", requireAuth, asyncHandler(getFeed));
postRouter.post("/", requireAuth, upload.single("image"), asyncHandler(createPost));
postRouter.post("/:id/like", requireAuth, asyncHandler(toggleLike));
postRouter.post("/:id/comments", requireAuth, asyncHandler(addComment));
postRouter.get("/user/:userId", requireAuth, asyncHandler(getUserPosts));
postRouter.delete("/:id", requireAuth, asyncHandler(deletePost));

