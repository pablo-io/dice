const User = require("./model");
const logger = require("../../config/logger");
const catchAsync = require("./middlewares/catchAsync");
const { getNewUserInitPoints, referralCodeInit, getUserBalanceService } = require("./services");
const Points = require("../points/model");
const { getReferralEarnings } = require("../points/services");
const { initTasksForUser, isActiveTasks } = require("../tasks/services");
const { getInitData } = require("../../middlewares/auth.js");
const Mutex = require("async-mutex").Mutex;

const mutex = new Mutex();


const authenticateUser = async (req, res) => {
  mutex
    .acquire()
    .then(async (release) => {
      const initData = getInitData(res);

      try {
        const name = initData.user.username ?? initData.user.firstName + "" + initData.user?.lastName;
        let user = await User.findOne({ telegramId: initData.user.id });
        if (user) {
          if (user.nickname === name) {
            res.status(200).send(user);
          } else {
            await User.updateOne(
              { telegramId: initData.user.id },
              { $set: { nickname: name } }
            );
            res.status(200).send(await User.findOne({ telegramId: initData.user.id }));
          }
        } else {
          const name = initData.user.username ?? initData.user.firstName + "" + initData.user?.lastName;
          const newUser = await User.create({
            telegramId: +initData.user.id,
            nickname: name,
            referralId: initData?.startParam
          });
          if (initData?.startParam) {
            await referralCodeInit(initData.startParam);
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


const initApp = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const tasksStatusCircle = await isActiveTasks(initData.user.id);
    res.status(200).send({ tasksStatusCircle });
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

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

const getReferralStats = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const user = await User.findOne({ telegramId: initData.user.id });
    const referralUsers = await User.find({ referralId: user._id });
    res.status(200).send({ users: referralUsers.length, amount: await getReferralEarnings(initData.user.id) });
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

const getUserBalance = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const userBalance = await getUserBalanceService(initData.user.id);
    res.status(200).send(userBalance);

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
  getReferralStats,
  getReferralLink,
  getUserBalance,
  getUserById,
  deleteUser,
  initApp
};
