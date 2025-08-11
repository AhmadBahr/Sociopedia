"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = (name, value) => {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
};
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? "development",
    port: parseInt(process.env.PORT ?? "5000", 10),
    mongoUri: required("MONGO_URI", process.env.MONGO_URI),
    jwtSecret: required("JWT_SECRET", process.env.JWT_SECRET),
    clientUrl: required("CLIENT_URL", process.env.CLIENT_URL),
};
