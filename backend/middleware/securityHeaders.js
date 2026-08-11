/**
 * Security headers middleware to harden Express API responses against clickjacking, MIME-sniffing, XSS, and caching leaks.
 */
const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent framing to protect against Clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Legacy XSS filter protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Restrict referrer information
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict cross-domain policy
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

  // Enforce HTTPS HSTS when in production or on TLS
  if (process.env.NODE_ENV === "production" || req.secure) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }

  // Remove Express footprint header
  res.removeHeader("X-Powered-By");

  next();
};

module.exports = securityHeaders;
