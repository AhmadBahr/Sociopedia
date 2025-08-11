import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayloadShape {
  userId: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayloadShape;
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

