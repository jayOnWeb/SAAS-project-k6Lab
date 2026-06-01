const mongoose = require("mongoose");

const testResultSchema = new mongoose.Schema(
  {
    // 🔹 Auth Link
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Input fields
    url: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    vus: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },

    // 🔥 CORE METRICS
    avgResponseTime: { type: Number, required: true },
    maxResponseTime: { type: Number, required: true },
    minResponseTime: { type: Number, required: true },
    p90ResponseTime: { type: Number, required: true },
    p95ResponseTime: { type: Number, required: true },

    // 🔥 REQUEST STATS
    totalRequests: { type: Number, required: true },
    successRequests: { type: Number, required: true },
    failedRequests: { type: Number, required: true },
    failureRate: { type: Number, required: true },

    // 🔥 DATA TRANSFER
    dataReceived: { type: Number, required: true },
    dataSent: { type: Number, required: true },

    // 🔥 TIMINGS BREAKDOWN
    waitingTime: { type: Number, required: true },
    sendingTime: { type: Number, required: true },
    receivingTime: { type: Number, required: true },
    blockedTime: { type: Number, required: true },
    connectingTime: { type: Number, required: true },
    tlsTime: { type: Number, required: true },

    // 🔹 Health
    healthStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TestResult", testResultSchema);
