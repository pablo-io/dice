const logger = require('../config/logger');

function errorHandler(error, req, res, next) {
  logger.error('unhandled error ' + error);
  logger.flush()
  res.status(500).json({ error: error.toString(), success: false });
}

module.exports = {
  errorHandler,
};
