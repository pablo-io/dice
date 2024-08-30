const Points = require("./model");
const User = require("../user/model");
const logger = require("../../config/logger");
const referralBonus = async (telegramId, fullAmount) => {
    const user = await User.findOne({telegramId: telegramId})
    if (user.referralId) {
        return await Points.create({userTelegramId: user.referralId, amount: fullAmount * 0.1, activityType: "referral"})
    } else {
        return false
    }
}
module.exports = {referralBonus}
