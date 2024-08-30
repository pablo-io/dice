const mongoose = require('mongoose');
const {telegramId} = require("../user/validation");

const {Schema} = mongoose;

const BonusSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        bonusType: {
            type: String,
            enum: ["dice", "activity", "referral", "initial"],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {optimisticConcurrency: true},
);

module.exports = mongoose.model('Bonus', BonusSchema);
