const Points = require("../points/model");
const logger = require("../../config/logger");
const catchAsync = require("./middlewares/catchAsync");
const { getInitData } = require("../../middlewares/auth");


const getLeaderBoard = catchAsync(async (req, res) => {
  const initData = getInitData(res);
  const { page } = req.params;
  const limit = 100;
  const skip = page * limit - limit;

  try {
    const leaderboard = await Points.aggregate([
      {
        $group: {
          _id: "$userTelegramId",
          totalQuantity: {
            $sum: "$amount"
          }
        }
      },
      {
        $lookup:
          {
            from: "users",
            localField: "_id",
            foreignField: "telegramId",
            as: "user"
          }
      },
      {
        $addFields: {
          nickname: {
            $arrayElemAt: ["$user.nickname", 0]
          }
        }
      },
      {
        $setWindowFields: {
          sortBy: { "totalQuantity": -1 },
          output: {
            rank: { "$documentNumber": {} }
          }
        }
      },
      {
        $skip: skip
      }
    ]);
    const currentUser = leaderboard.find(item => item._id === initData.user.id);

    res.status(200).send({ current: currentUser, leaderboard: leaderboard.slice(0, limit) });
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

module.exports = {
  getLeaderBoard
};
