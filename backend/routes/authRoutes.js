const express = require("express");
const router = express.Router();
const { signup, login, getMe, deleteAccount } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authRateLimiter } = require("../middleware/rateLimiter");

// Rate limited public auth routes
router.post("/signup", authRateLimiter, signup);
router.post("/login", authRateLimiter, login);

// Authenticated user profile routes
router.get("/me", protect, getMe);
router.delete("/account", protect, deleteAccount);

module.exports = router;
