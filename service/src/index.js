require("dotenv").config()
const path = require('path');

const db = require('./config/mongo');
const app = require('./app');
const { createConfig } = require('./config/config');
const logger = require('./config/logger');

async function run() {
  const configPath = path.join(__dirname, '../.env');
  const config = createConfig(configPath);

  await db.init(config);
  const server = app.listen(config.port, () => {
    logger.info('app started', { port: config.port });
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error) => {
    logger.error('unhandled error', { error });
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

run();
