const express = require('express');
const Joi = require("joi");

const {telegramId} = require('./validation');

const validate = require('./middlewares/validate');
const controller = require('./controller');

const router = express.Router();
const routerPath = "/user"

router.post(`/authenticate`, controller.createUser);

router.get(`/getRewardsList`, controller.getRewardList);

router.get(`/getReferralLink`, controller.getReferralLink);

router.get(`/getUserReferralsStats`, controller.getReferralStats);

router.get(`/getUserBalance`, controller.getUserBalance);

router.get(`/getUserTasks`, controller.getUserTasks);


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
