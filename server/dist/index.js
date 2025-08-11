"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const socket_1 = require("./realtime/socket");
async function bootstrap() {
    await (0, db_1.connectToDatabase)();
    const app = (0, app_1.createApp)();
    const server = (0, http_1.createServer)(app);
    (0, socket_1.initSocket)(server);
    server.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on http://localhost:${env_1.env.port}`);
    });
}
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", err);
    process.exit(1);
});
