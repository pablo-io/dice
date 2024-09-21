const express = require('express');
const Joi = require("joi");

const validate = require('./middlewares/validate');
const controller = require('./controller');

const router = express.Router();
const routerPath = "/leaderboard"

router.get(`/:page`, validate({params: Joi.object().keys({
        page: Joi.number().required(),
    })}), controller.getLeaderBoard);

module.exports = {
    router,
    routerPath
}
