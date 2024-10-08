const {validate, parse} =  require('@telegram-apps/init-data-node');
const logger = require("../config/logger");

/**
 * Sets init data in the specified Response object.
 * @param res - Response object.
 * @param initData - init data.
 */
function setInitData(res, initData) {
    res.locals.initData = initData;
}

/**
 * Extracts init data from the Response object.
 * @param res - Response object.
 * @returns Init data stored in the Response object. Can return undefined in case,
 * the client is not authorized.
 */
function getInitData(res) {
    return res.locals.initData;
}

/**
 * Middleware which authorizes the external client.
 * @param req - Request object.
 * @param res - Response object.
 * @param next - function to call the next middleware.
 */
const authMiddleware = (req, res, next) => {
    // We expect passing init data in the Authorization header in the following format:
    // <auth-type> <auth-data>
    // <auth-type> must be "tma", and <auth-data> is Telegram Mini Apps init data.
    const [authType, authData = ''] = (req.header('Authorization') || '').split(' ');
    switch (authType) {
        case 'tma':
            try {
                // Validate init data.
                validate(authData, process.env.BOT_TOKEN, {
                    // We consider init data sign valid for 1 hour from their creation moment.
                    expiresIn: process.env.TOKEN_EXPIRE,
                });
                // Parse init data. We will surely need it in the future.
                setInitData(res, parse(authData));
                return next();
            } catch (e) {
                logger.error("Unauthorized: " + authData);
                logger.flush();
                return next(new Error('Unauthorized'));
            }
        // ... other authorization methods.
        default:
            return next(new Error('Unauthorized'));
    }
};

module.exports = {
    getInitData,
    authMiddleware
}
