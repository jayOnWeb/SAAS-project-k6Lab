const crypto = require("crypto");
const Agent = require("../models/Agent");
const TestJob = require("../models/TestJob");

// Hash token helper
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

/**
 * Middleware to authenticate CLI Agent via Bearer token (SHA-256 verified)
 */
const protectAgent = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Agent authentication required. No Bearer token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token.trim().length === 0) {
      return res.status(401).json({
        success: false,
        error: "Agent authentication required. Empty token provided.",
      });
    }

    const tokenHash = hashToken(token.trim());
    const agent = await Agent.findOne({ tokenHash, status: { $ne: "disabled" } });

    if (!agent) {
      return res.status(401).json({
        success: false,
        error: "Invalid, revoked, or disabled agent token.",
      });
    }

    req.agent = agent;
    next();
  } catch (error) {
    console.error("Agent Auth Middleware Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Authentication service error.",
    });
  }
};

/**
 * Middleware to verify that the target Job belongs to the authenticated Agent (BOLA/IDOR protection)
 */
const validateAgentJobOwnership = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    if (!jobId) {
      return res.status(400).json({
        success: false,
        error: "Job ID parameter is required.",
      });
    }

    const job = await TestJob.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: "Test job not found.",
      });
    }

    // Verify the agent owns this job
    if (job.agentId.toString() !== req.agent._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Access denied. This job is not assigned to your agent.",
      });
    }

    req.job = job;
    next();
  } catch (error) {
    console.error("Agent Job Ownership Verification Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Authorization service error.",
    });
  }
};

module.exports = {
  protectAgent,
  validateAgentJobOwnership,
  hashToken,
};
