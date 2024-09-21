const express = require('express');
const Joi = require("joi");

const {objectId} = require('./validation');

const validate = require('./middlewares/validate');
const controller = require('./controller');

const router = express.Router();
const routerPath = "/task"

router.put(`/markAsDone/:taskId`, validate({params: Joi.object().keys({
        taskId: objectId.required(),
    })}), controller.doneTaskById);

module.exports = {
    router,
    routerPath
}
