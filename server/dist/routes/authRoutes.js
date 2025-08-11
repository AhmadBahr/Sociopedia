"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const authController_1 = require("../controllers/authController");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/register", (0, asyncHandler_1.asyncHandler)(authController_1.register));
exports.authRouter.post("/login", (0, asyncHandler_1.asyncHandler)(authController_1.login));
