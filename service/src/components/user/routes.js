const express = require('express');
const Joi = require("joi");

const {telegramId} = require('./validation');

const validate = require('./middlewares/validate');
const controller = require('./controller');

const router = express.Router();
const routerPath = "/user"

router.post(`/authenticate`, validate({body: Joi.object().keys({
        telegramId: telegramId.required(),
        nickname: Joi.string().required(),
        referralId: telegramId

    })}), controller.createUser);


router.get('/:telegramId', validate({params: Joi.object().keys({
        telegramId: telegramId.required()
    })}), controller.getUserById);


router.delete('/:telegramId',validate({params: Joi.object().keys({
        telegramId: telegramId.required()
    })}), controller.deleteUser);

module.exports = {
    router,
    routerPath
}
