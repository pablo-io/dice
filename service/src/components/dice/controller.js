const logger = require("../../config/logger");
const Dice = require("./model");
const catchAsync = require('./middlewares/catchAsync');
const {addPoints, removePoints} = require("../points/services");
const {getInitData} = require("../../middlewares/auth");


const diceGame = catchAsync(async (req, res) => {
    const initData = getInitData(res);

    try {
        const user = await Dice.findOne({userTelegramId: initData.user.id})
        if (user?.bannedTill && new Date(user.bannedTill).getTime() >= Date.now()) {
            const timeLeft = new Date(new Date(user.bannedTill).getTime() - Date.now())
            res.status(403).send({error: `Bad luck! You'll have to wait 00:${timeLeft.getMinutes()} min`})
        } else {
            const playerNumber = Math.floor(Math.random() * 6 + 1);
            const opponentNumber = Math.floor(Math.random() * 6 + 1);
            if (playerNumber > opponentNumber) {
                await addPoints(initData.user.id, 10, "dice")
                let chanceOfBan = Math.random();

                if (chanceOfBan < 0.5) {
                } else if (chanceOfBan < 0.7) {
                    //20%
                    await Dice.findOneAndUpdate({userTelegramId: initData.user.id}, {bannedTill: new Date(Date.now() + 3600000)}, {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    })
                } else {
                }

            } else {
                await removePoints(initData.user.id, 5, "dice")
            }
            res.status(200).send({you: playerNumber, opponent: opponentNumber});
        }
    } catch (error) {
        logger.error(error)
        logger.flush()
        res.status(500).send(error);
    }
});

module.exports = {
    diceGame,
}
