import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRouter } from "./routes/authRoutes";
import { userRouter } from "./routes/userRoutes";
import { postRouter } from "./routes/postRoutes";
import { chatRouter } from "./routes/chatRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(
    cors({ origin: env.clientUrl, credentials: true, methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] })
  );
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Static files (uploaded images)
  app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", authRouter);
  app.use("/api/users/", userRouter);
  app.use("/api/posts", postRouter);
  app.use("/api/chat", chatRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

