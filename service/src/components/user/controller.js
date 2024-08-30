const User = require("./model");
const logger = require("../../config/logger");
const catchAsync = require('./middlewares/catchAsync');
const {getNewUserInitPoints} = require("./services");
const Points = require("../points/model");
const {referralBonus} = require("../points/services");


const authenticateUser = catchAsync(async (req, res) => {
    const {telegramId, nickname, referralId} = req.body;

    try {
        let user = User.find({telegramId})
        if (user) {
            res.status(200).send(user);
        } else {
            user = await User.create({telegramId, nickname, referralId});
            await Points.create({
                userTelegramId: telegramId,
                amount: getNewUserInitPoints(telegramId),
                activityType: "initial"
            });
            if (referralId) {
                await referralBonus(telegramId, 1000)
            }

            res.status(201).send(user);
        }

    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
});

const getUserById = catchAsync(async (req, res) => {
    const {telegramId} = req.params;

    try {
        const users = await User.find({telegramId: telegramId});
        res.send(users);
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
})

const deleteUser = catchAsync(async (req, res) => {
    const {telegramId} = req.params;

    try {
        const user = await User.deleteOne({telegramId: telegramId});
        res.status(200).send(user);
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
});


module.exports = {
    createUser: authenticateUser,
    getUserById,
    deleteUser
}
