"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(_req, res) {
    res.status(404).json({ message: "Not Found" });
}
function errorHandler(err, _req, res, _next) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal Server Error";
    if (process.env.NODE_ENV !== "test") {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(statusCode).json({ message });
}
