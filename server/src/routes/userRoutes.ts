import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { requireAuth } from "../middleware/auth";
import {
  followUser,
  getMe,
  getUserById,
  getFollowers,
  getFollowing,
  addFriend,
  removeFriend,
  getFriends,
  searchUsers,
  updateMe,
  unfollowUser,
} from "../controllers/userController";

export const userRouter = Router();

userRouter.get("/me", requireAuth, asyncHandler(getMe));
userRouter.put("/me", requireAuth, asyncHandler(updateMe));
userRouter.get("/:id", requireAuth, asyncHandler(getUserById));
userRouter.post("/:id/follow", requireAuth, asyncHandler(followUser));
userRouter.post("/:id/unfollow", requireAuth, asyncHandler(unfollowUser));
userRouter.post("/:id/friends", requireAuth, asyncHandler(addFriend));
userRouter.delete("/:id/friends", requireAuth, asyncHandler(removeFriend));
userRouter.get("/:id/friends", requireAuth, asyncHandler(getFriends));
userRouter.get("/:id/followers", requireAuth, asyncHandler(getFollowers));
userRouter.get("/:id/following", requireAuth, asyncHandler(getFollowing));
userRouter.get("/", requireAuth, asyncHandler(searchUsers));

