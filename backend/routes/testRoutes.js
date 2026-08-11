const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { testRunRateLimiter } = require("../middleware/rateLimiter");
const {
  runTest,
  getTestResults,
  getSingleTest,
  cancelTest,
  deleteTest,
  getAISuggestions,
  askAIChat,
} = require("../controllers/testController");

// Secure all test operations behind JWT Auth & Rate Limiting

// 🔹 Queuing / Execution routes (Rate Limited)
router.post("/tests", protect, testRunRateLimiter, runTest);
router.post("/run-test", protect, testRunRateLimiter, runTest); // legacy support

// 🔹 List history routes
router.get("/tests", protect, getTestResults);
router.get("/test/results", protect, getTestResults); // legacy support

// 🔹 Single details routes
router.get("/tests/:id", protect, getSingleTest);
router.get("/test/:id", protect, getSingleTest); // legacy support

// 🔹 AI Suggestions routes
router.get("/tests/:id/ai-suggestions", protect, getAISuggestions);
router.get("/test/:id/ai-suggestions", protect, getAISuggestions); // legacy support

// 🔹 AI Interactive Chat routes
router.post("/tests/:id/ai-chat", protect, askAIChat);
router.post("/test/:id/ai-chat", protect, askAIChat); // legacy support

// 🔹 Cancellation routes
router.post("/tests/:jobId/cancel", protect, cancelTest);
router.post("/test/:id/cancel", protect, cancelTest); // legacy support

// 🔹 Deletion routes
router.delete("/tests/:id", protect, deleteTest);
router.delete("/test/:id", protect, deleteTest); // legacy support

module.exports = router;