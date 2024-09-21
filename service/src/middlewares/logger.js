const onHeaders = require('on-headers');
const logger = require('../config/logger');

function loggerMiddleware(req, res, next) {
  const started = new Date();

  onHeaders(res, () => {
    logger.info('response sent', {
      url: req.url,
      method: req.method,
      statusCode: res.statusCode,
      duration: new Date() - started,
    });
    logger.flush()
  });

  next();
}

module.exports = loggerMiddleware;
