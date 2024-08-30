const logger = require('../config/logger');

function errorHandler(error, req, res, next) {
  logger.error('unhandled error', { error });
  res.status(500).json({ success: false });
}

module.exports = {
  errorHandler,
};
