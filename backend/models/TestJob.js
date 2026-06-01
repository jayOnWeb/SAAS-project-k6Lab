const mongoose = require("mongoose");

const testJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed", "cancel_requested", "cancelled"],
      default: "queued",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    config: {
      url: { type: String, required: true },
      method: { type: String, required: true },
      vus: { type: Number, required: true },
      duration: { type: String, required: true },
      headers: { type: Map, of: String, default: {} },
      body: { type: String, default: null },
      expectedStatus: { type: Number, default: 200 },
      maxResponseTimeMs: { type: Number, default: 1000 },
      sleepSeconds: { type: Number, default: 1 },
      timeout: { type: String, default: "30s" },
    },
    result: {
      totalRequests: { type: Number, default: 0 },
      avgResponseTime: { type: Number, default: 0 },
      minResponseTime: { type: Number, default: 0 },
      maxResponseTime: { type: Number, default: 0 },
      p90ResponseTime: { type: Number, default: 0 },
      p95ResponseTime: { type: Number, default: 0 },
      failedRequestRate: { type: Number, default: 0 },
      checksPassed: { type: Number, default: 0 },
      checksFailed: { type: Number, default: 0 },
      iterations: { type: Number, default: 0 },
      dataReceived: { type: Number, default: 0 },
      dataSent: { type: Number, default: 0 },
      healthStatus: { type: String },
    },
    logs: {
      type: String,
      default: "",
    },
    error: {
      type: String,
      default: null,
    },
    aiSuggestions: {
      type: String,
      default: null,
    },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("TestJob", testJobSchema);
