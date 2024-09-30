const Tasks = require("./model");

const getTasksByUser = async (telegramId) => {
  return Tasks.find(
    { userTelegramId: telegramId }
  );
};

const initTasksForUser = async (telegramId) => {
  return await Tasks.insertMany([
    {
      userTelegramId: telegramId,
      name: "Join community",
      status: "subscribe",
      link: "https://t.me/diceid_community",
      points: 200
    },
    {
      userTelegramId: telegramId,
      name: "Follow us on X",
      status: "subscribe",
      link: "https://x.com/diceid_official",
      points: 200
    },
    {
      userTelegramId: telegramId,
      name: "Add 🎲 to your name",
      status: "check",
      link: "https://diceid.site/api/v1/task/checkDiceInName",
      points: 700
    }
  ]);
};

const isDiceInName = (user) => {
  return user.firstName.includes("🎲") || user.lastName.includes("🎲");
};


module.exports = {
  getTasksByUser,
  initTasksForUser,
  isDiceInName
};
