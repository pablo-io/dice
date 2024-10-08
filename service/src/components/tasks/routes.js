const express = require("express");
const Joi = require("joi");

const { objectId } = require("./validation");

const validate = require("./middlewares/validate");
const controller = require("./controller");

const router = express.Router();
const routerPath = "/task";

router.get(`/`, controller.getAllTasks);


router.put(`/onetime/complete/:taskId`, validate({
  params: Joi.object().keys({
    taskId: objectId.required()
  })
}), controller.doneTaskById);

router.put(`/daily/complete/:taskId`, validate({
  params: Joi.object().keys({
    taskId: objectId.required()
  })
}), controller.completeDailyTask);

module.exports = {
  router,
  routerPath
};
