const { generateTelemetryAudit } = require("../services/aiService");
const Agent = require("../models/Agent");
const TestJob = require("../models/TestJob");

// Helper: validate URL
const isValidUrl = (urlStr) => {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
};

// 🔹 Create/Queue a load test
const runTest = async (req, res) => {
  try {
    let {
      name,
      url,
      method,
      vus,
      duration,
      headers,
      body,
      expectedStatus,
      maxResponseTimeMs,
      sleepSeconds,
      timeout,
    } = req.body;

    if (!url || !method || !vus || !duration) {
      return res.status(400).json({
        success: false,
        error: "All fields are required (url, method, vus, duration)",
      });
    }

    url = url.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({
        success: false,
        error: "Please enter a valid URL starting with http:// or https://",
      });
    }

    const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    if (!allowedMethods.includes(method.toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: "Invalid HTTP method. Allowed: GET, POST, PUT, PATCH, DELETE",
      });
    }

    const vusVal = parseInt(vus);
    if (isNaN(vusVal) || vusVal < 1 || vusVal > 100) {
      return res.status(400).json({
        success: false,
        error: "VUs must be between 1 and 100",
      });
    }

    // Validate duration (e.g. 10s, 1m, 5m)
    const durationStr = String(duration).trim().toLowerCase();
    if (!/^\d+(s|m)$/.test(durationStr)) {
      return res.status(400).json({
        success: false,
        error: "Duration must be a number followed by 's' or 'm' (e.g. 30s, 2m)",
      });
    }

    // 🔹 Find user's active online agent
    const agents = await Agent.find({ userId: req.user._id, status: { $ne: "disabled" } });
    let activeAgent = null;
    const now = Date.now();

    for (const a of agents) {
      if (a.lastSeenAt && now - new Date(a.lastSeenAt).getTime() < 30000) {
        activeAgent = a;
        break;
      }
    }

    if (!activeAgent) {
      return res.status(400).json({
        success: false,
        code: "NO_ACTIVE_AGENT",
        message: "Your local agent is not connected. Run k6lab-agent start in your terminal.",
        setupRequired: true,
      });
    }

    // 🔹 Validate payload limits
    if (body && typeof body === "object") {
      body = JSON.stringify(body);
    }
    if (body && body.length > 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "Request body size exceeds 1 MB limit",
      });
    }

    const headersMap = new Map();
    if (headers && typeof headers === "object") {
      Object.entries(headers).forEach(([k, v]) => {
        if (k.length <= 100 && String(v).length <= 2000) {
          headersMap.set(k, String(v));
        }
      });
    }

    // 🔹 Create queued job in DB
    const job = await TestJob.create({
      userId: req.user._id,
      agentId: activeAgent._id,
      status: "queued",
      name: name ? name.trim() : `Test at ${new Date().toLocaleString()}`,
      config: {
        url,
        method: method.toUpperCase(),
        vus: vusVal,
        duration: durationStr,
        headers: headersMap,
        body: body || null,
        expectedStatus: parseInt(expectedStatus) || 200,
        maxResponseTimeMs: parseInt(maxResponseTimeMs) || 1000,
        sleepSeconds: parseFloat(sleepSeconds) ?? 1,
        timeout: timeout || "30s",
      },
    });

    res.json({
      success: true,
      message: "Test queued successfully. Your local agent will start it automatically.",
      job: {
        id: job._id,
        status: job.status,
        name: job.name,
        config: job.config,
        createdAt: job.createdAt,
      },
      // Backward compatibility support for old frontend format
      data: {
        _id: job._id,
        url: job.config.url,
        method: job.config.method,
        vus: job.config.vus,
        duration: job.config.duration,
        avgResponseTime: 0,
        maxResponseTime: 0,
        minResponseTime: 0,
        p90ResponseTime: 0,
        p95ResponseTime: 0,
        totalRequests: 0,
        successRequests: 0,
        failedRequests: 0,
        failureRate: 0,
        dataReceived: 0,
        dataSent: 0,
        healthStatus: "Queued...",
        createdAt: job.createdAt,
      },
    });
  } catch (err) {
    console.error("Queue test error:", err);
    res.status(500).json({
      success: false,
      error: "Failed to queue load test",
      details: err.message,
    });
  }
};

// 🔹 Get tests history/results list
const getTestResults = async (req, res) => {
  try {
    const { url } = req.query;
    let query = { userId: req.user._id };

    if (url) {
      query["config.url"] = { $regex: url, $options: "i" };
    }

    const jobs = await TestJob.find(query).sort({ createdAt: -1 });

    // Map jobs to support old frontend schemas for backward compatibility
    const mapped = jobs.map((job) => ({
      _id: job._id,
      url: job.config.url,
      method: job.config.method,
      vus: job.config.vus,
      duration: job.config.duration,
      status: job.status,
      error: job.error,
      logs: job.logs,
      avgResponseTime: job.result?.avgResponseTime || 0,
      maxResponseTime: job.result?.maxResponseTime || 0,
      minResponseTime: job.result?.minResponseTime || 0,
      p90ResponseTime: job.result?.p90ResponseTime || 0,
      p95ResponseTime: job.result?.p95ResponseTime || 0,
      totalRequests: job.result?.totalRequests || 0,
      successRequests: job.result?.totalRequests ? (job.result.totalRequests - Math.round(job.result.totalRequests * job.result.failedRequestRate)) : 0,
      failedRequests: job.result?.totalRequests ? Math.round(job.result.totalRequests * job.result.failedRequestRate) : 0,
      failureRate: job.result?.failedRequestRate ? (job.result.failedRequestRate * 100) : 0,
      dataReceived: job.result?.dataReceived || 0,
      dataSent: job.result?.dataSent || 0,
      healthStatus: job.status === "completed" ? (job.result?.healthStatus || "Healthy") : job.status.toUpperCase(),
      createdAt: job.createdAt,
    }));

    res.json({
      success: true,
      count: mapped.length,
      data: mapped,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch results list",
      details: err.message,
    });
  }
};

// 🔹 Get a single test job run details
const getSingleTest = async (req, res) => {
  try {
    const job = await TestJob.findById(req.params.id);
    if (!job || job.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        error: "Test job not found",
      });
    }

    // Map to old format with full metrics list
    const failedRequests = job.result?.totalRequests ? Math.round(job.result.totalRequests * job.result.failedRequestRate) : 0;
    const successRequests = job.result?.totalRequests ? (job.result.totalRequests - failedRequests) : 0;

    const data = {
      _id: job._id,
      name: job.name,
      status: job.status,
      error: job.error,
      logs: job.logs,
      url: job.config.url,
      method: job.config.method,
      vus: job.config.vus,
      duration: job.config.duration,
      config: job.config,
      avgResponseTime: job.result?.avgResponseTime || 0,
      maxResponseTime: job.result?.maxResponseTime || 0,
      minResponseTime: job.result?.minResponseTime || 0,
      p90ResponseTime: job.result?.p90ResponseTime || 0,
      p95ResponseTime: job.result?.p95ResponseTime || 0,
      totalRequests: job.result?.totalRequests || 0,
      successRequests,
      failedRequests,
      failureRate: job.result?.failedRequestRate ? (job.result.failedRequestRate * 100) : 0,
      dataReceived: job.result?.dataReceived || 0,
      dataSent: job.result?.dataSent || 0,
      healthStatus: job.status === "completed" ? (job.result?.healthStatus || "Healthy 🟢") : job.status.toUpperCase(),
      createdAt: job.createdAt,
      // connection breakdown breakdown fields
      waitingTime: job.result?.avgResponseTime ? (job.result.avgResponseTime * 0.8) : 0,
      sendingTime: job.result?.avgResponseTime ? (job.result.avgResponseTime * 0.05) : 0,
      receivingTime: job.result?.avgResponseTime ? (job.result.avgResponseTime * 0.05) : 0,
      blockedTime: 0,
      connectingTime: 0,
      tlsTime: 0,
    };

    res.json({
      success: true,
      job, // returns raw job
      data, // returns unified backward compatibility mapping
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch test details",
      details: err.message,
    });
  }
};

// 🔹 Cancel a queued/running test
const cancelTest = async (req, res) => {
  try {
    const job = await TestJob.findById(req.params.jobId || req.params.id);
    if (!job || job.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, error: "Test job not found" });
    }

    if (job.status === "queued") {
      job.status = "cancelled";
      job.cancelledAt = new Date();
      job.error = "Cancelled by user before startup";
      await job.save();
    } else if (job.status === "running") {
      job.status = "cancel_requested";
      await job.save();
    }

    res.json({
      success: true,
      message: `Test status successfully updated to: ${job.status}`,
      job,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 🔹 Delete a test from DB history
const deleteTest = async (req, res) => {
  try {
    const job = await TestJob.findById(req.params.id);
    if (!job || job.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        error: "Test job not found",
      });
    }

    await TestJob.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Test deleted successfully from history",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Delete run failed",
      details: err.message,
    });
  }
};

// 🔹 Get AI suggestions analysis from OpenRouter
const getAISuggestions = async (req, res) => {
  try {
    const job = await TestJob.findById(req.params.jobId || req.params.id);
    if (!job || job.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, error: "Test job not found" });
    }

    // Return cached suggestions if already generated, unless force bypass is requested
    const force = req.query.force === "true";
    if (job.aiSuggestions && !force) {
      return res.json({ success: true, suggestions: job.aiSuggestions });
    }

    if (!["completed", "failed"].includes(job.status)) {
      return res.status(400).json({
        success: false,
        error: "AI suggestions can only be generated for completed or failed tests.",
      });
    }

    // Delegate generating suggestions to modularized aiService
    const suggestions = await generateTelemetryAudit(job);

    // Cache to DB
    job.aiSuggestions = suggestions;
    await job.save();

    res.json({ success: true, suggestions });
  } catch (err) {
    console.error("AI Suggestions generation error:", err.message);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to generate AI performance suggestions",
    });
  }
};

module.exports = {
  runTest,
  getTestResults,
  getSingleTest,
  cancelTest,
  deleteTest,
  getAISuggestions,
};
