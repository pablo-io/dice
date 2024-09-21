const catchAsync = require("../user/middlewares/catchAsync");
const Tasks = require("./model");
const { addPoints } = require("../points/services");
const logger = require("../../config/logger");
const { getInitData } = require("../../middlewares/auth");
const { isDiceInName } = require("./services");

const doneTaskById = catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const initData = getInitData(res);

  try {
    const task = await Tasks.findById(
      taskId
    );
    if(task.status !== "done") {
      if (task.link === "https://diceid.site/api/v1/task/checkDiceInName") {
        if (isDiceInName(initData.user)) {
          await Tasks.updateOne({_id: taskId}, {$set: {status: "done"}})
          await addPoints(initData.user.id, task.points, "activity");
          res.status(200).send({success: true})
        }
        res.status(400).send({error: "Dice emoji not found"})
      } else {
        await Tasks.updateOne({_id: taskId}, {$set: {status: "done"}})
        await addPoints(initData.user.id, task.points, "activity");
        res.status(200).send({link: task.link});
      }
    } else {
      res.status(400).send({error: "Task was already done, cheater!"})
    }
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

module.exports = {
  doneTaskById,
};
