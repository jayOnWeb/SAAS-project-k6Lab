const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "My Laptop",
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    tokenLastFour: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline", "disabled"],
      default: "offline",
    },
    lastSeenAt: {
      type: Date,
      default: null,
    },
    disabledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Agent", agentSchema);
