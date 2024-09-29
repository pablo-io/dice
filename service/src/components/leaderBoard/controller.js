const Points = require("../points/model");
const User = require("../user/model");
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
    const currentUser = await User.aggregate([
      {
        $match: {
          telegramId: initData.user.id
        }
      },
      {
        $lookup: {
          from: "points",
          as: "sortedPoints",
          pipeline: [
            {
              $group: {
                _id: "$userTelegramId",
                count: {
                  $sum: "$amount"
                }
              }
            },
            {
              $sort: {
                "count": -1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$sortedPoints",
          includeArrayIndex: "idx"
        }
      },
      {
        $match: {
          $expr: {
            $eq: [
              "$telegramId",
              "$sortedPoints._id"
            ]
          }
        }
      },
      {
        $project: {
          nickname: "$nickname",
          totalQuantity: "$sortedPoints.count",
          rank: {
            $add: [
              "$idx",
              1
            ]
          }
        }
      }
    ]);

    res.status(200).send({ current: currentUser[0], leaderboard: leaderboard });
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

module.exports = {
  getLeaderBoard
};
