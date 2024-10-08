const OneTimeTasks = require("./models/OneTimeTask");
const DailyTasks = require("./models/DailyTask");
const catchAsync = require("../user/middlewares/catchAsync");
const { getInitData } = require("../../middlewares/auth");
const logger = require("../../config/logger");

const getOneTimeTasks = async (telegramId) => {
  return OneTimeTasks.find(
    { userTelegramId: telegramId }
  );
};

const getDailyTasks = async (telegramId) => {
  return DailyTasks.aggregate([
      {
        $match: {
          userTelegramId: telegramId, taskType: "checkDice", lastCompletionDate: {
            $lt: new Date(new Date().setHours(0, 0, 0, 0))
          }
        }
      }
    ]
  );
};

const initTasksForUser = async (telegramId) => {
  try {
    await OneTimeTasks.insertMany([
      {
        userTelegramId: telegramId,
        name: "Join community",
        taskType: "subscribe",
        link: "https://t.me/diceid_community",
        points: 200
      },
      {
        userTelegramId: telegramId,
        name: "Follow us on X",
        taskType: "subscribe",
        link: "https://x.com/diceid_official",
        points: 200
      },
      {
        userTelegramId: telegramId,
        name: "Keep 🎲 in your name!",
        taskType: "check",
        link: "https://diceid.site/api/v1/task/checkDiceInName",
        points: 300
      }
    ]);
    await DailyTasks.insertMany([
      {
        userTelegramId: telegramId,
        name: "Keep 🎲 in your name today!",
        taskType: "checkDice",
        lastCompletionDate: new Date(new Date().setDate(new Date().getDate() - 1)), //yesterday
        points: 100
      }
    ]);
  } catch (e) {
    throw new Error(e);
  }
};

const isDiceInName = (user) => {
  return user.firstName.includes("🎲") || user.lastName.includes("🎲");
};

const isActiveTasks = async (telegramId) => {
  try {
    const daily = await getDailyTasks(telegramId);
    if (daily.length > 0) {
      return true
    }
    const oneTime = await getOneTimeTasks(telegramId);
    for (const oneTimeElement of oneTime) {
      if (oneTimeElement.status === "active") return true
    }
    return false
  } catch (error) {
    await logger.error(error);
    await logger.flush();
  }
};

module.exports = {
  initTasksForUser,
  isDiceInName,
  getOneTimeTasks,
  getDailyTasks,
  isActiveTasks
};
