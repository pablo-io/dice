const Joi = require("joi");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);
const telegramId = Joi.string().min(6)


module.exports = {
    objectId,
    telegramId
}
