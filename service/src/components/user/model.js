const mongoose = require('mongoose');

const {Schema} = mongoose;

const UserSchema = new Schema(
    {
        telegramId: {
            type: Number,
            required: true,
            unique: true
        },
        nickname: {
            type: String,
            required: true,
        },
        referralId: {
            type: Schema.ObjectId,
            ref: "User"
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: Date,
    },
    {optimisticConcurrency: true},
);

module.exports = mongoose.model('User', UserSchema);
