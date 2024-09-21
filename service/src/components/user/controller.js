const User = require("./model");
const logger = require("../../config/logger");
const catchAsync = require("./middlewares/catchAsync");
const { getNewUserInitPoints } = require("./services");
const Points = require("../points/model");
const { referralBonus, addPoints } = require("../points/services");
const { initTasksForUser, getTasksByUser, markTaskDoneByUser } = require("../tasks/services");
const { getInitData } = require("../../middlewares/auth.js");
const Mutex = require("async-mutex").Mutex;

const mutex = new Mutex();


const authenticateUser = async (req, res) => {
  mutex
    .acquire()
    .then(async (release) => {
      const initData = getInitData(res);

      try {
        let user = await User.findOne({ telegramId: initData.user.id });
        if (user) {
          res.status(200).send(user);
        } else {
          const newUser = await User.create({
            telegramId: +initData.user.id,
            nickname: initData.user.username,
            referralId: initData?.startParam
          });
          if (initData?.startParam) {
            await referralBonus(initData?.startParam, 1000);
            await Points.create({ userTelegramId: initData.user.id, amount: 100, pointType: "referral" });
          }
          await Points.create({
            userTelegramId: initData.user.id,
            amount: getNewUserInitPoints(initData.user.id).totalPoints,
            pointType: "initial"
          });
          await initTasksForUser(initData.user.id);

          res.status(201).send(JSON.stringify(newUser));
        }

      } catch (error) {
        logger.error(error);
        logger.flush();
        res.status(500).send(error);
      } finally {
        release();
      }
    });

};

const getRewardList = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const result = getNewUserInitPoints(initData.user.id);
    res.status(200).send(result);
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

const getReferralLink = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const user = await User.findOne({ telegramId: initData.user.id });
    res.status(200).send({ link: process.env.BOT_LINK + user._id });
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

const getUserBalance = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const userBalance = await Points.aggregate([
      { $match: { userTelegramId: initData.user.id } },
      {
        $group: {
          _id: "$userTelegramId",
          totalQuantity: {
            $sum: "$amount"
          }
        }
      }
    ]);
    res.status(200).send(userBalance[0]);
  } catch (error) {
    await logger.error(error);
    await logger.flush();
    res.status(500).send(error);
  }
});

const getUserTasks = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const tasks = await getTasksByUser(initData.user.id);
    res.status(200).send(tasks);
  } catch (error) {
    await logger.error(error);
    await logger.flush();
    res.status(500).send(error);
  }

});

const getUserById = catchAsync(async (req, res) => {
  const { telegramId } = req.params;

  try {
    const users = await User.find({ telegramId: telegramId });
    res.send(users);
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

const deleteUser = catchAsync(async (req, res) => {
  const { telegramId } = req.params;

  try {
    const user = await User.deleteOne({ telegramId: telegramId });
    res.status(200).send(user);
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});


module.exports = {
  createUser: authenticateUser,
  getRewardList,
  getReferralLink,
  getUserBalance,
  getUserTasks,
  getUserById,
  deleteUser
};
