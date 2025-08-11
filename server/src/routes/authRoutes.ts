import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { login, register } from "../controllers/authController";

export const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));

