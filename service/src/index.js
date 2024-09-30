const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });
dotenv.config();

const path = require("path");

const db = require("./config/mongo");
const app = require("./app");
const { createConfig } = require("./config/config");
const logger = require("./config/logger");
const { validate } = require("@telegram-apps/init-data-node");

async function run() {
  const configPath = path.join(__dirname, "../.env");
  const config = createConfig(configPath);

  await db.init(config);
  const server = app.listen(config.port, () => {
    console.log(server.address().port);
    logger.info("app started " + config.port);
    logger.flush();
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info("server closed");
        logger.flush();
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error("unhandled error", { error });
    logger.flush();
    exitHandler();
  };

  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  process.on("SIGTERM", () => {
    logger.info("SIGTERM received");
    logger.flush();
    if (server) {
      server.close();
    }
  });
}

run();
