const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  runTest,
  getTestResults,
  getSingleTest,
  cancelTest,
  deleteTest,
  getAISuggestions,
} = require("../controllers/testController");

// Secure all test operations behind JWT Auth

// 🔹 Queuing / Execution routes
router.post("/tests", protect, runTest);
router.post("/run-test", protect, runTest); // legacy support

// 🔹 List history routes
router.get("/tests", protect, getTestResults);
router.get("/test/results", protect, getTestResults); // legacy support

// 🔹 Single details routes
router.get("/tests/:id", protect, getSingleTest);
router.get("/test/:id", protect, getSingleTest); // legacy support

// 🔹 AI Suggestions routes
router.get("/tests/:id/ai-suggestions", protect, getAISuggestions);
router.get("/test/:id/ai-suggestions", protect, getAISuggestions); // legacy support

// 🔹 Cancellation routes
router.post("/tests/:jobId/cancel", protect, cancelTest);
router.post("/test/:id/cancel", protect, cancelTest); // legacy support

// 🔹 Deletion routes
router.delete("/tests/:id", protect, deleteTest);
router.delete("/test/:id", protect, deleteTest); // legacy support

module.exports = router;