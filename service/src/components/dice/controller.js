const { randomInt } = require("crypto");

const logger = require("../../config/logger");
const Dice = require("./model");
const Points = require("../points/model");
const catchAsync = require("./middlewares/catchAsync");
const { addPoints, removePoints } = require("../points/services");
const { getInitData } = require("../../middlewares/auth");
const { getRandomUserOpponent } = require("../user/services");


const diceGame = catchAsync(async (req, res) => {
  const initData = getInitData(res);

  try {
    const userBanRecord = await Dice.findOne({ userTelegramId: initData.user.id });
    if (userBanRecord?.bannedTill && new Date(userBanRecord.bannedTill).getTime() >= Date.now()) {
      const timeLeft = new Date(new Date(userBanRecord.bannedTill).getTime() - Date.now());
      res.status(403).send({ error: `Bad luck! You'll have to wait ${timeLeft.getMinutes()} minutes` });
    } else {
      let playerNumber = randomInt(1, 6);
      let opponentNumber = randomInt(1, 6);
      while (playerNumber === opponentNumber) {
        playerNumber = randomInt(1, 6);
        opponentNumber = randomInt(1, 6);
      }
      if (playerNumber > opponentNumber) {
        await addPoints(initData.user.id, 10, "dice");
      } else if (playerNumber < opponentNumber) {
        await removePoints(initData.user.id, 5, "dice");
      }

      const bannedTillDate = userBanRecord?.bannedTill ? new Date(userBanRecord.bannedTill).getTime() : new Date().getTime() - 3600000;

      const gamesAfterLastBan = await Points.find({
        userTelegramId: initData.user.id,
        createdAt: { $gt: bannedTillDate },
        pointType: "dice"
      });

      if (gamesAfterLastBan.length > 10) {
        let chanceOfBan = randomInt(0, 10);
        if (chanceOfBan > 5 && chanceOfBan <= 7) {
          await Dice.findOneAndUpdate({ userTelegramId: initData.user.id }, { bannedTill: new Date(Date.now() + 3600000) }, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          });
        }
      }


      res.status(200).send({
        you: {
          username: initData.user.username,
          number: playerNumber
        },
        opponent: {
          username: await getRandomUserOpponent(initData.user.username),
          number: opponentNumber
        }
      });
    }
  } catch (error) {
    logger.error(error);
    logger.flush();
    res.status(500).send(error);
  }
});

module.exports = {
  diceGame
};


