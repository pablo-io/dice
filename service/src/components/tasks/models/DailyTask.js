const mongoose = require("mongoose");
const { telegramId } = require("../validation");

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    userTelegramId: {
      type: telegramId,
      ref: "User",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    taskType: {
      type: String,
      enum: ["checkDice"],
      required: true
    },
    lastCompletionDate: {
      type: Date,
      required: true
    },
    points: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  },
  { optimisticConcurrency: true }
);

module.exports = mongoose.model("DailyTask", TaskSchema);
