const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { protectAgent, validateAgentJobOwnership } = require("../middleware/agentAuthMiddleware");
const {
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
} = require("../controllers/agentController");

// 🔹 Frontend Protected Routes (JWT user auth)
router.get("/agents/me", protect, getMyAgent);
router.post("/agents/register", protect, registerAgent);
router.delete("/agents/:agentId", protect, revokeAgent);

// 🔹 CLI Agent API Routes (authenticated by SHA-256 Bearer agentToken)
router.post("/agent/verify-token", protectAgent, verifyToken);
router.post("/agent/heartbeat", protectAgent, sendHeartbeat);
router.post("/agent/logout", protectAgent, agentLogout);

// 🔹 CLI Agent Job Execution & Telemetry Routes (Protected & Ownership-Verified)
router.get("/agent/jobs/next", protectAgent, getNextJob);
router.post("/agent/jobs/:jobId/logs", protectAgent, validateAgentJobOwnership, uploadJobLogs);
router.post("/agent/jobs/:jobId/result", protectAgent, validateAgentJobOwnership, uploadJobResult);
router.post("/agent/jobs/:jobId/fail", protectAgent, validateAgentJobOwnership, failJob);
router.post("/agent/jobs/:jobId/cancelled", protectAgent, validateAgentJobOwnership, cancelJob);
router.get("/agent/jobs/:jobId/status", protectAgent, validateAgentJobOwnership, getJobStatus);

module.exports = router;

