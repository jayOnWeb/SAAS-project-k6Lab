const mongoose = require("mongoose");
const { generateTelemetryAudit, askAIChat: askAIServiceChat } = require("../services/aiService");
const Agent = require("../models/Agent");
const TestJob = require("../models/TestJob");

// Helper: Escape Regex characters to prevent ReDoS / NoSQL injection
const escapeRegex = (string) => {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Helper: Validate Target URL against SSRF & Metadata Endpoints
const validateTargetUrl = (urlStr) => {
  try {
    const parsed = new URL(urlStr);
    
    // Only allow HTTP/HTTPS
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "Only http:// and https:// protocols are supported." };
    }

    const hostname = parsed.hostname.toLowerCase().trim();

    // 🛑 Block Cloud Instance Metadata Services (SSRF Protection)
    const blockedHosts = [
      "169.254.169.254",               // AWS, GCP, Azure, DigitalOcean Metadata
      "metadata.google.internal",      // Google Cloud Metadata DNS
      "168.63.129.16",                 // Azure WireServer IP
      "instance-data",                 // AWS legacy host alias
    ];

    if (blockedHosts.includes(hostname) || hostname.startsWith("169.254.")) {
      return {
        valid: false,
        error: "Access to internal cloud metadata IP addresses is strictly prohibited for security.",
      };
    }

    return { valid: true, url: parsed.toString() };
  } catch (err) {
    return { valid: false, error: "Please enter a valid, well-formed URL (e.g. https://api.example.com)." };
  }
};

// Helper: Mask sensitive headers like Authorization Bearer Tokens
const maskSensitiveHeaders = (headersMap) => {
  if (!headersMap) return {};
  const masked = {};
  
  const entries = headersMap instanceof Map ? headersMap.entries() : Object.entries(headersMap);
  for (const [k, v] of entries) {
    if (typeof k === "string" && k.toLowerCase() === "authorization") {
      masked[k] = "Bearer [REDACTED_FOR_SECURITY]";
    } else {
      masked[k] = v;
    }
  }
  return masked;
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
      bearerToken,
      projectId,
      folderId,
    } = req.body;

    if (!url || !method || !vus || !duration) {
      return res.status(400).json({
        success: false,
        error: "All fields are required (url, method, vus, duration)",
      });
    }

    url = String(url).trim();
    if (!/^https?:\/\//i.test(url)) {
      url = "http://" + url;
    }

    const urlCheck = validateTargetUrl(url);
    if (!urlCheck.valid) {
      return res.status(400).json({
        success: false,
        error: urlCheck.error,
      });
    }
    url = urlCheck.url;

    const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    if (!allowedMethods.includes(String(method).toUpperCase())) {
      return res.status(400).json({
        success: false,
        error: "Invalid HTTP method. Allowed: GET, POST, PUT, PATCH, DELETE",
      });
    }

    const vusVal = parseInt(vus);
    if (isNaN(vusVal) || vusVal < 1 || vusVal > 500) {
      return res.status(400).json({
        success: false,
        error: "Virtual Users (VUs) must be between 1 and 500 for Free Tier execution",
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
    if (body && String(body).length > 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "Request body size exceeds 1 MB limit",
      });
    }

    const headersMap = new Map();
    if (headers && typeof headers === "object") {
      Object.entries(headers).forEach(([k, v]) => {
        if (k && String(k).length <= 100 && String(v).length <= 2000) {
          headersMap.set(String(k).trim(), String(v).trim());
        }
      });
    }

    // If Bearer token passed explicitly, set Authorization header
    if (bearerToken && typeof bearerToken === "string" && bearerToken.trim()) {
      const cleanToken = bearerToken.trim().replace(/^Bearer\s+/i, "");
      headersMap.set("Authorization", `Bearer ${cleanToken}`);
    }

    // Validate project / folder ID if provided
    let validProjectId = null;
    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      validProjectId = projectId;
    }
    let validFolderId = null;
    if (folderId && mongoose.Types.ObjectId.isValid(folderId)) {
      validFolderId = folderId;
    }

    // 🔹 Create queued job in DB
    const job = await TestJob.create({
      userId: req.user._id,
      agentId: activeAgent._id,
      projectId: validProjectId,
      folderId: validFolderId,
      status: "queued",
      name: name ? String(name).trim().slice(0, 100) : `Test at ${new Date().toLocaleString()}`,
      config: {
        url,
        method: String(method).toUpperCase(),
        vus: vusVal,
        duration: durationStr,
        headers: headersMap,
        body: body || null,
        expectedStatus: parseInt(expectedStatus) || 200,
        maxResponseTimeMs: parseInt(maxResponseTimeMs) || 1000,
        sleepSeconds: !isNaN(parseFloat(sleepSeconds)) ? Math.max(0, parseFloat(sleepSeconds)) : 1,
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
        config: {
          ...job.config,
          headers: maskSensitiveHeaders(job.config.headers),
        },
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
    console.error("Queue test error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to queue load test. Please try again.",
    });
  }
};

// 🔹 Get tests history/results list (with ReDoS protection, pagination, and log exclusion)
const getTestResults = async (req, res) => {
  try {
    const { url, projectId, folderId, page = 1, limit = 50 } = req.query;
    let query = { userId: req.user._id };

    // ReDoS-safe query regex
    if (url && typeof url === "string" && url.trim().length > 0) {
      query["config.url"] = { $regex: escapeRegex(url.trim()), $options: "i" };
    }

    if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
      query.projectId = projectId;
    }
    if (folderId && mongoose.Types.ObjectId.isValid(folderId)) {
      query.folderId = folderId;
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    const totalCount = await TestJob.countDocuments(query);

    // Exclude heavy raw logs string from collection listings to conserve memory
    const jobs = await TestJob.find(query)
      .select("-logs")
      .populate("projectId", "name color")
      .populate("folderId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Map jobs with masked credentials
    const mapped = jobs.map((job) => ({
      _id: job._id,
      name: job.name,
      url: job.config?.url,
      method: job.config?.method,
      vus: job.config?.vus,
      duration: job.config?.duration,
      headers: maskSensitiveHeaders(job.config?.headers),
      body: job.config?.body,
      status: job.status,
      projectId: job.projectId,
      folderId: job.folderId,
      error: job.error,
      avgResponseTime: job.result?.avgResponseTime || 0,
      maxResponseTime: job.result?.maxResponseTime || 0,
      minResponseTime: job.result?.minResponseTime || 0,
      p90ResponseTime: job.result?.p90ResponseTime || 0,
      p95ResponseTime: job.result?.p95ResponseTime || 0,
      totalRequests: job.result?.totalRequests || 0,
      successRequests: job.result?.totalRequests ? (job.result.totalRequests - Math.round(job.result.totalRequests * (job.result.failedRequestRate || 0))) : 0,
      failedRequests: job.result?.totalRequests ? Math.round(job.result.totalRequests * (job.result.failedRequestRate || 0)) : 0,
      failureRate: job.result?.failedRequestRate ? (job.result.failedRequestRate * 100) : 0,
      dataReceived: job.result?.dataReceived || 0,
      dataSent: job.result?.dataSent || 0,
      healthStatus: job.status === "completed" ? (job.result?.healthStatus || "Healthy") : job.status.toUpperCase(),
      createdAt: job.createdAt,
    }));

    res.json({
      success: true,
      count: mapped.length,
      total: totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum),
      data: mapped,
    });
  } catch (err) {
    console.error("Fetch test results error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch test results list.",
    });
  }
};

// 🔹 Get a single test job run details
const getSingleTest = async (req, res) => {
  try {
    const targetId = req.params.jobId || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ success: false, error: "Invalid test job ID." });
    }

    const job = await TestJob.findById(targetId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Test job not found.",
      });
    }

    if (job.userId && req.user?._id && job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access to this test job.",
      });
    }

    // Map to unified format with full metrics list and masked credentials
    const failedRequests = job.result?.totalRequests ? Math.round(job.result.totalRequests * (job.result.failedRequestRate || 0)) : 0;
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
      config: {
        ...job.config,
        headers: maskSensitiveHeaders(job.config.headers),
      },
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
      aiSuggestions: job.aiSuggestions || null,
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
      job,
      data,
    });
  } catch (err) {
    console.error("Fetch single test error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch test details.",
    });
  }
};

// 🔹 Cancel a queued/running test
const cancelTest = async (req, res) => {
  try {
    const targetId = req.params.jobId || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ success: false, error: "Invalid test job ID." });
    }

    const job = await TestJob.findById(targetId);
    if (!job) {
      return res.status(404).json({ success: false, error: "Test job not found." });
    }

    if (job.userId && req.user?._id && job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized access to this test job." });
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
    console.error("Cancel test error:", err.message);
    res.status(500).json({ success: false, error: "Failed to cancel test." });
  }
};

// 🔹 Delete a test from DB history
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid test job ID." });
    }

    const job = await TestJob.findById(id);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Test job not found.",
      });
    }

    if (job.userId && req.user?._id && job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access to this test job.",
      });
    }

    await TestJob.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Test deleted successfully from history",
    });
  } catch (err) {
    console.error("Delete test error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to delete test record.",
    });
  }
};

// 🔹 Get AI suggestions analysis from OpenRouter
const getAISuggestions = async (req, res) => {
  try {
    const targetId = req.params.jobId || req.params.id;
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ success: false, error: "Invalid test job ID." });
    }

    const job = await TestJob.findById(targetId);
    if (!job) {
      return res.status(404).json({ success: false, error: "Test job not found." });
    }

    if (job.userId && req.user?._id && job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized access to this test job." });
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
      error: "Failed to generate AI performance suggestions.",
    });
  }
};

// 🔹 Interactive AI Chat regarding specific test job telemetry
const askAIChat = async (req, res) => {
  try {
    const targetId = req.params.jobId || req.params.id;
    const { question, chatHistory } = req.body;

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ success: false, error: "Invalid test job ID." });
    }

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return res.status(400).json({ success: false, error: "Question string is required." });
    }

    const job = await TestJob.findById(targetId);
    if (!job) {
      return res.status(404).json({ success: false, error: "Test job not found." });
    }

    if (job.userId && req.user?._id && job.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: "Unauthorized access to this test job." });
    }

    const cleanQuestion = String(question).trim().slice(0, 1000);
    const answer = await askAIServiceChat(job, cleanQuestion, Array.isArray(chatHistory) ? chatHistory.slice(-10) : []);
    res.json({ success: true, answer });
  } catch (err) {
    console.error("AI Chat generation error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch AI answer. Please try again.",
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
  askAIChat,
};
