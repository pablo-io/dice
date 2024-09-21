const mongoose = require('mongoose');
const {telegramId} = require("./validation");

const {Schema} = mongoose;

const DiceSchema = new Schema(
    {
        userTelegramId: {
            type: telegramId,
            ref: "User",
            required: true,
        },
        bannedTill: {
            type: Date,
        },
        updatedAt: Date,
    },
    {optimisticConcurrency: true},
);

module.exports = mongoose.model('Dice', DiceSchema);
