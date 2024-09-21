const Points = require("./model");
const User = require("../user/model");

const addPoints = async (telegramId, amount, pointType) => {
    const user = await User.findOne({telegramId})
    if (user) {
        return Points.create({userTelegramId: telegramId, amount, pointType})
            .then(() => {
                referralBonus(user.referralId.toString(), amount)
            })
            .catch((e) => e)
            .finally(() => true)
    } else {
        return false
    }
}

const removePoints = async (telegramId, amount, pointType) => {
    const user = await User.findOne({telegramId})
    if (user) {
        return Points.create({userTelegramId: telegramId, amount: amount * -1, pointType})
            .catch((e) => e)
            .finally(() => true)
    } else {
        return false
    }
}

const referralBonus = async (referralId, fullAmount) => {
    const user = await User.findById(referralId)
    if (user) {
        return await Points.create({userTelegramId: user.telegramId, amount: fullAmount * 0.1, pointType: "referral"})
    } else {
        return false
    }
}

module.exports = {addPoints, removePoints, referralBonus}
