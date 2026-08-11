/**
 * In-memory sliding window rate limiter middleware
 */
const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  max = 100, // max requests per window
  message = "Too many requests, please try again later.",
  statusCode = 429,
}) => {
  const hitMap = new Map();

  // Periodic cleanup of expired IPs every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hitMap.entries()) {
      if (now - record.startTime > windowMs) {
        hitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    // Extract client IP address
    const clientIp =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "127.0.0.1";

    const now = Date.now();
    const record = hitMap.get(clientIp);

    if (!record || now - record.startTime > windowMs) {
      hitMap.set(clientIp, {
        count: 1,
        startTime: now,
      });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      return res.status(statusCode).json({
        success: false,
        error: message,
        retryAfter: retryAfterSeconds,
      });
    }

    next();
  };
};

// 🔹 Auth Endpoints Rate Limiter (Brute-force / Credential Stuffing Protection)
// 15 attempts per 15 minutes per IP
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});

// 🔹 Test Execution Rate Limiter (Prevent DoS / Flooding)
// 60 test requests per minute per IP
const testRunRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: "Rate limit exceeded for test execution. Please slow down.",
});

// 🔹 General API Rate Limiter
// 300 requests per minute per IP
const generalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
  message: "Too many API requests. Please slow down.",
});

module.exports = {
  createRateLimiter,
  authRateLimiter,
  testRunRateLimiter,
  generalRateLimiter,
};
