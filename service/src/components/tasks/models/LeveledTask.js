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
    status: {
      type: String,
      enum: ["active", "done"],
      required: true
    },
    lastReachedGoal: {
      type: Number,
      required: true
    },
    goals: {
      type: Array,
      required: true
    },
    prizes: {
      type: Array,
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

module.exports = mongoose.model("LeveledTask", TaskSchema);
