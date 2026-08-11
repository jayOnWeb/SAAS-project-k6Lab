const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// 🛡️ Security Validation: Ensure essential environment variables are set
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 16) {
  console.error("❌ FATAL SECURITY ERROR: JWT_SECRET environment variable must be set (minimum 16 characters).");
  console.error("Please configure JWT_SECRET in your backend/.env file.");
  process.exit(1);
}

const connectDB = require("./config/db");
const securityHeaders = require("./middleware/securityHeaders");

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// 🛡️ Security Headers Middleware
app.use(securityHeaders);

// Allowed origins configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, postman, CLI daemon)
      if (!origin) return callback(null, true);

      // Allow localhost and 127.0.0.1 origins for local dashboard & varying Vite ports
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      // Gracefully reject unauthorized origins
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Payload size limit protection
app.use(express.json({ limit: "1mb" }));

const testRoutes = require("./routes/testRoutes");
const authRoutes = require("./routes/authRoutes");
const agentRoutes = require("./routes/agentRoutes");
const projectRoutes = require("./routes/projectRoutes");

// Register API Routes
app.use("/api", testRoutes);
app.use("/api", agentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Healthcheck endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    service: "K6 Lab Telemetry API",
    version: "2.4.0",
    security: "Hardened",
  });
});

// 🛡️ Centralized Error Handling Middleware (prevents leaking internal stack traces)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500).json({
    success: false,
    error: "An internal server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 K6 Lab API Server running securely on port ${PORT}`);
});