"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const authRoutes_1 = require("./routes/authRoutes");
const userRoutes_1 = require("./routes/userRoutes");
const postRoutes_1 = require("./routes/postRoutes");
const chatRoutes_1 = require("./routes/chatRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: env_1.env.clientUrl, credentials: true, methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"] }));
    app.use((0, helmet_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // Static files (uploaded images)
    app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "public", "uploads")));
    app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
    app.use("/api/auth", authRoutes_1.authRouter);
    app.use("/api/users/", userRoutes_1.userRouter);
    app.use("/api/posts", postRoutes_1.postRouter);
    app.use("/api/chat", chatRoutes_1.chatRouter);
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
