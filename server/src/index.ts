import { createServer } from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { connectToDatabase } from "./config/db";
import { initSocket } from "./realtime/socket";

async function bootstrap() {
  await connectToDatabase();
  const app = createApp();
  const server = createServer(app);
  initSocket(server);
  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server", err);
  process.exit(1);
});

