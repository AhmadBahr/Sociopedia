"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const env_1 = require("../config/env");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
async function register(req, res) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid input" });
    }
    const { name, email, password } = parsed.data;
    const existing = await User_1.User.findOne({ email });
    if (existing) {
        return res.status(409).json({ message: "Email already in use" });
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.User.create({ name, email, passwordHash });
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.jwtSecret, {
        expiresIn: "7d",
    });
    return res.status(201).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
        },
    });
}
async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const { email, password } = parsed.data;
    const user = await User_1.User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, env_1.env.jwtSecret, {
        expiresIn: "7d",
    });
    return res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
        },
    });
}
