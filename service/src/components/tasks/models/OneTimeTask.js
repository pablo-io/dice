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
      default: "active"
    },
    taskType: {
      type: String,
      enum: ["subscribe", "check"],
      required: true
    },
    link: {
      type: String
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

module.exports = mongoose.model("Task", TaskSchema);
