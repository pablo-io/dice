const mongoose = require('mongoose');
const {telegramId} = require("../user/validation");

const {Schema} = mongoose;

const PointsSchema = new Schema(
    {
        userTelegramId: {
            type: telegramId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        pointType: {
            type: String,
            enum: ["dice", "activity", "referral", "initial"],
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {optimisticConcurrency: true},
);

module.exports = mongoose.model('Points', PointsSchema);
