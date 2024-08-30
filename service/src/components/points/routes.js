const express = require('express');
const Joi = require("joi");

const {telegramId} = require('./validation');

const validate = require('./middlewares/validate');
const controller = require('./controller');

const router = express.Router();
const routerPath = "/points"

router.post(`/add/:telegramId`, validate({body: Joi.object().keys({
        telegramId: telegramId.required(),
        amount: Joi.number().required(),
        activityType: Joi.string().valid("dice", "bonus", "referral").required()

    })}), controller.createPointsTransaction);


router.get('/:telegramId', validate({params: Joi.object().keys({
        telegramId: telegramId.required()
    })}), controller.getPointsHistoryByUserTelegramId);

module.exports = {
    router,
    routerPath
}
