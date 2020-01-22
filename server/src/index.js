import { app } from "./app";
import { logger } from "./services/logger";
import { connect } from "./services/db";

const port = process.env.PORT || 8888;
const host = process.env.HOST || "localhost";

const startServer = () => {
  app.listen(+port, host, () => {
    logger.info(`Server started at [ http://${host}:${port} ]`);
    logger.info(`Environment ${process.pid}: ${process.env.NODE_ENV}`);
  });
};

(async () => {
  console.log("Connecting to database...");

  await connect();

  console.log("Starting server...");
  startServer();
})();
