const crypto = require("crypto");
const Agent = require("../models/Agent");
const TestJob = require("../models/TestJob");
const { getHealthStatus } = require("../utils/healthChecker");
const { hashToken } = require("../middleware/agentAuthMiddleware");

// 🔹 Frontend API: Get current active agent state
const getMyAgent = async (req, res) => {
  try {
    const agents = await Agent.find({ userId: req.user._id, status: { $ne: "disabled" } });
    
    // Check if there is an active agent that has sent heartbeat in last 15s
    let activeAgent = null;
    const now = Date.now();
    
    for (const agent of agents) {
      if (agent.lastSeenAt && now - new Date(agent.lastSeenAt).getTime() < 15000 && agent.status === "online") {
        activeAgent = agent;
        break;
      } else if (agent.status === "online") {
        agent.status = "offline";
        await agent.save();
      }
    }

    const isOnline = !!activeAgent;

    res.json({
      success: true,
      hasAgent: isOnline,
      activeAgent: isOnline ? {
        id: activeAgent._id,
        name: activeAgent.name,
        status: "online",
        lastSeenAt: activeAgent.lastSeenAt,
      } : null,
      agents: agents.map(a => ({ id: a._id, name: a.name, status: isOnline && a._id.toString() === activeAgent?._id.toString() ? "online" : "offline" })),
      setupRequired: !isOnline,
    });
  } catch (err) {
    console.error("getMyAgent error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch agent state." });
  }
};

// 🔹 Frontend API: Register agent and emit one-time raw token
const registerAgent = async (req, res) => {
  try {
    const { name } = req.body;
    const agentName = name ? String(name).trim().slice(0, 50) : "My Laptop";

    // Revoke any previous non-disabled agents to maintain "one active agent per user" limit
    await Agent.updateMany(
      { userId: req.user._id, status: { $ne: "disabled" } },
      { $set: { status: "disabled", disabledAt: new Date() } }
    );

    // Generate token: 32 random characters prefixed
    const rawToken = "k6lab_agent_" + crypto.randomBytes(16).toString("hex");
    const hashed = hashToken(rawToken);
    const lastFour = rawToken.slice(-4);

    const agent = await Agent.create({
      userId: req.user._id,
      name: agentName,
      tokenHash: hashed,
      tokenLastFour: lastFour,
      status: "offline",
    });

    res.status(201).json({
      success: true,
      message: "Agent registered successfully. Store this token safely.",
      agent: {
        id: agent._id,
        name: agent.name,
        status: agent.status,
      },
      agentToken: rawToken,
      commands: [
        "npm install -g k6lab-agent",
        `k6lab-agent login ${rawToken}`,
        "k6lab-agent start",
      ],
    });
  } catch (err) {
    console.error("registerAgent error:", err.message);
    res.status(500).json({ success: false, error: "Failed to register agent." });
  }
};

// 🔹 Frontend API: Delete/revoke agent
const revokeAgent = async (req, res) => {
  try {
    const agent = await Agent.findOne({ _id: req.params.agentId, userId: req.user._id });
    if (!agent) {
      return res.status(404).json({ success: false, error: "Agent not found" });
    }

    agent.status = "disabled";
    agent.disabledAt = new Date();
    await agent.save();

    res.json({ success: true, message: "Agent revoked successfully" });
  } catch (err) {
    console.error("revokeAgent error:", err.message);
    res.status(500).json({ success: false, error: "Failed to revoke agent." });
  }
};

// 🔹 CLI API: Authenticate and verify token (Protected by protectAgent)
const verifyToken = async (req, res) => {
  try {
    res.json({
      success: true,
      agent: {
        id: req.agent._id,
        name: req.agent.name,
      },
    });
  } catch (err) {
    console.error("verifyToken error:", err.message);
    res.status(500).json({ success: false, error: "Token verification failed." });
  }
};

// 🔹 CLI API: Heartbeat ping (Protected by protectAgent)
const sendHeartbeat = async (req, res) => {
  try {
    req.agent.status = "online";
    req.agent.lastSeenAt = new Date();
    await req.agent.save();

    res.json({ success: true, message: "Heartbeat received" });
  } catch (err) {
    console.error("sendHeartbeat error:", err.message);
    res.status(500).json({ success: false, error: "Failed to process heartbeat." });
  }
};

// 🔹 CLI API: Poll next job atomically (Protected by protectAgent)
const getNextJob = async (req, res) => {
  try {
    // Atomically find next queued job assigned to this agent and transition status to running
    const job = await TestJob.findOneAndUpdate(
      { agentId: req.agent._id, status: "queued" },
      { $set: { status: "running", startedAt: new Date() } },
      { sort: { createdAt: 1 }, new: true }
    );

    if (!job) {
      return res.json({ success: true, job: null });
    }

    res.json({
      success: true,
      job: {
        id: job._id,
        name: job.name,
        config: job.config,
      },
    });
  } catch (err) {
    console.error("getNextJob error:", err.message);
    res.status(500).json({ success: false, error: "Failed to poll next job." });
  }
};

// 🔹 CLI API: Upload test run raw logs (Protected by protectAgent & validateAgentJobOwnership)
const uploadJobLogs = async (req, res) => {
  try {
    const { logs } = req.body;
    req.job.logs = logs || "";
    await req.job.save();

    res.json({ success: true });
  } catch (err) {
    console.error("uploadJobLogs error:", err.message);
    res.status(500).json({ success: false, error: "Failed to upload job logs." });
  }
};

// 🔹 CLI API: Upload k6 final run results summary metrics (Protected by protectAgent & validateAgentJobOwnership)
const uploadJobResult = async (req, res) => {
  try {
    const { summary, logs } = req.body;
    const metrics = summary?.metrics || {};

    // Standard metric extraction
    const httpReqsValues = metrics.http_reqs?.values || {};
    const httpReqDurationValues = metrics.http_req_duration?.values || {};
    const httpReqFailedValues = metrics.http_req_failed?.values || {};
    const checksValues = metrics.checks?.values || {};
    const iterationsValues = metrics.iterations?.values || {};
    const dataReceivedValues = metrics.data_received?.values || {};
    const dataSentValues = metrics.data_sent?.values || {};

    const totalRequests = httpReqsValues.count || 0;
    const avgResponseTime = httpReqDurationValues.avg || 0;
    const minResponseTime = httpReqDurationValues.min || 0;
    const maxResponseTime = httpReqDurationValues.max || 0;
    const p90ResponseTime = httpReqDurationValues["p(90)"] || 0;
    const p95ResponseTime = httpReqDurationValues["p(95)"] || 0;
    const failedRequestRate = httpReqFailedValues.rate || 0;
    const checksPassed = checksValues.passes || 0;
    const checksFailed = checksValues.fails || 0;
    const iterations = iterationsValues.count || 0;
    const dataReceived = dataReceivedValues.count || 0;
    const dataSent = dataSentValues.count || 0;

    const healthStatus = getHealthStatus({
      avgResponseTime,
      failureRate: failedRequestRate * 100,
    });

    const job = req.job;

    // Update job metrics
    job.status = "completed";
    job.completedAt = new Date();
    job.logs = logs || job.logs;
    job.result = {
      totalRequests,
      avgResponseTime,
      minResponseTime,
      maxResponseTime,
      p90ResponseTime,
      p95ResponseTime,
      failedRequestRate,
      checksPassed,
      checksFailed,
      iterations,
      dataReceived,
      dataSent,
      healthStatus,
    };

    await job.save();
    res.json({ success: true });
  } catch (err) {
    console.error("uploadJobResult error:", err.message);
    res.status(500).json({ success: false, error: "Failed to upload test results." });
  }
};

// 🔹 CLI API: Mark job failed (Protected by protectAgent & validateAgentJobOwnership)
const failJob = async (req, res) => {
  try {
    const { error } = req.body;
    const job = req.job;

    job.status = "failed";
    job.error = error ? String(error).slice(0, 1000) : "Unknown agent execution error";
    job.completedAt = new Date();
    await job.save();

    res.json({ success: true });
  } catch (err) {
    console.error("failJob error:", err.message);
    res.status(500).json({ success: false, error: "Failed to mark job as failed." });
  }
};

// 🔹 CLI API: Mark job cancelled (Protected by protectAgent & validateAgentJobOwnership)
const cancelJob = async (req, res) => {
  try {
    const { message } = req.body;
    const job = req.job;

    job.status = "cancelled";
    job.error = message ? String(message).slice(0, 500) : "Cancelled by agent runner";
    job.cancelledAt = new Date();
    await job.save();

    res.json({ success: true });
  } catch (err) {
    console.error("cancelJob error:", err.message);
    res.status(500).json({ success: false, error: "Failed to cancel job." });
  }
};

// 🔹 CLI API: Get job status details (Protected by protectAgent & validateAgentJobOwnership)
const getJobStatus = async (req, res) => {
  try {
    res.json({ success: true, job: { id: req.job._id, status: req.job.status } });
  } catch (err) {
    console.error("getJobStatus error:", err.message);
    res.status(500).json({ success: false, error: "Failed to fetch job status." });
  }
};

// 🔹 CLI API: Agent Logout notification (Protected by protectAgent)
const agentLogout = async (req, res) => {
  try {
    req.agent.status = "offline";
    req.agent.lastSeenAt = new Date(0);
    await req.agent.save();

    res.json({ success: true, message: "Agent logged out" });
  } catch (err) {
    console.error("agentLogout error:", err.message);
    res.status(500).json({ success: false, error: "Failed to process logout." });
  }
};

module.exports = {
  getMyAgent,
  registerAgent,
  revokeAgent,
  verifyToken,
  sendHeartbeat,
  agentLogout,
  getNextJob,
  uploadJobLogs,
  uploadJobResult,
  failJob,
  cancelJob,
  getJobStatus,
};
