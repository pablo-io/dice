const Points = require("../points/model");
const logger = require("../../config/logger");
const catchAsync = require('./middlewares/catchAsync');


const getLeaderBoard = catchAsync(async (req, res) => {
    const { page } = req.params;
    const limit = 15
    const skip = page * limit - limit

    try {
        const leaderBoard = await Points.aggregate([
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
                    user: {
                        $arrayElemAt: ["$user", 0],
                    }
                },
            },
            {
                $sort: {
                    totalQuantity: -1
                }
            },
            {
                $skip: skip
            }
        ])

        res.status(200).send(leaderBoard);
    } catch (error) {
        logger.error(error)
        logger.flush()
        res.status(500).send(error);
    }
});

module.exports = {
    getLeaderBoard
}
