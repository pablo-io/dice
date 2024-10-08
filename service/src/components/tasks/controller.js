const catchAsync = require("../user/middlewares/catchAsync");
const OneTineTasks = require("./models/OneTimeTask");
const DailyTasks = require("./models/DailyTask");
const { addPoints } = require("../points/services");
const logger = require("../../config/logger");
const { getInitData } = require("../../middlewares/auth");
const { isDiceInName, getOneTimeTasks, getDailyTasks } = require("./services");

const getAllTasks = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const oneTime = await getOneTimeTasks(initData.user.id);
    const daily = await getDailyTasks(initData.user.id);
    res.status(200).send({ onetime: oneTime, daily: daily });
  } catch (error) {
    await logger.error(error);
    await logger.flush();
    res.status(500).send(error);
  }

});

const completeOneTimeTaskById = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const initData = getInitData(res);

  try {
    const task = await OneTineTasks.findById(
      taskId
    );
    if (task.status !== "done") {
      if (task.link === "https://diceid.site/api/v1/task/checkDiceInName") {
        if (isDiceInName(initData.user)) {
          await OneTineTasks.updateOne({ _id: taskId }, { $set: { status: "done" } });
          await addPoints(initData.user.id, task.points, "activity");
          res.status(200).send({ success: true });
        }
        res.status(400).send({ error: "🎲 emoji not found" });
      } else {
        await OneTineTasks.updateOne({ _id: taskId }, { $set: { status: "done" } });
        await addPoints(initData.user.id, task.points, "activity");
        res.status(200).send({ link: task.link });
      }
    } else {
      res.status(400).send({ error: "Task was already done, cheater!" });
    }
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

const completeDailyTaskById = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const initData = getInitData(res);

  try {
    const task = await DailyTasks.findById(
      taskId
    );
      if (task.taskType === "checkDice") {
        if (task.lastCompletionDate < new Date(
          new Date().setHours(0, 0, 0, 0)
        )) {
          if (isDiceInName(initData.user)) {
            await DailyTasks.updateOne({ _id: taskId }, { $set: { lastCompletionDate: Date.now() } });
            await addPoints(initData.user.id, task.points, "activity");
            return res.status(200).send({ success: true });
          } else {
            return res.status(400).send({ error: "🎲 emoji not found" });
          }
        }
        return res.status(400).send({ error: "Task was already done, cheater!" });
      } else {
        return res.status(404).send({ error: "Task not found" });
      }


  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});


module.exports = {
  getAllTasks,
  doneTaskById: completeOneTimeTaskById,
  completeDailyTask: completeDailyTaskById
};
