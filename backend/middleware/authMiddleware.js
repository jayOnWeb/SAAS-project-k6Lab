const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.error("FATAL SECURITY ERROR: JWT_SECRET is not configured in server environment.");
    return res.status(500).json({
      error: "Authentication service misconfigured. Please contact administrator.",
    });
  }

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      if (!token || token.trim().length === 0) {
        return res.status(401).json({
          error: "Not authorized, empty token provided",
        });
      }

      // Verify token with configured secret
      const decoded = jwt.verify(token.trim(), jwtSecret);

      // Get user from token, exclude password
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          error: "Not authorized, account not found or deleted",
        });
      }

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Session expired. Please log in again.",
        });
      }
      return res.status(401).json({
        error: "Not authorized, invalid token signature",
      });
    }
  } else {
    return res.status(401).json({
      error: "Not authorized, no Bearer token provided",
    });
  }
};

module.exports = { protect };
