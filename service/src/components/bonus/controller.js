const Points = require("./model");
const logger = require("../../config/logger");
const catchAsync = require('./middlewares/catchAsync');


const createPointsTransaction = catchAsync(async (req, res) => {
    const { telegramId, amount, activityType } = req.body;

    try {
        const points = await Points.create({ userTelegramId: telegramId, amount, activityType});
        res.status(201).send(points);
    } catch (error) {
        logger.error(error)
        logger.flush()
        res.status(500).send(error);
    }
});

const getPointsHistoryByUserTelegramId = catchAsync(async (req, res) => {
    const { telegramId } = req.params;

    try {
        const points = await Points.find({userTelegramId: telegramId});
        res.send(points);
    } catch (error) {
        logger.error(error)
        logger.flush()
        res.status(500).send(error);
    }
})


module.exports = {
    createPointsTransaction,
    getPointsHistoryByUserTelegramId,
}
