const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getMyAgent,
  registerAgent,
  revokeAgent,
  verifyToken,
  sendHeartbeat,
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

// 🔹 CLI Agent API Routes (authenticated by Bearer agentToken inside controller)
router.post("/agent/verify-token", verifyToken);
router.post("/agent/heartbeat", sendHeartbeat);
router.get("/agent/jobs/next", getNextJob);
router.post("/agent/jobs/:jobId/logs", uploadJobLogs);
router.post("/agent/jobs/:jobId/result", uploadJobResult);
router.post("/agent/jobs/:jobId/fail", failJob);
router.post("/agent/jobs/:jobId/cancelled", cancelJob);
router.get("/agent/jobs/:jobId/status", getJobStatus);

module.exports = router;
