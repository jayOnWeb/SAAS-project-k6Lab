const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Helper
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: "7d", // Secure 7-day token expiration
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill in all fields (name, email, password)." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = String(name).trim().slice(0, 100);

    // Password policy: minimum 8 characters, letters and numbers required
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return res.status(400).json({ error: "Password must contain both letters and numbers for security." });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ error: "An account already exists with this email address." });
    }

    // Create user
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password,
    });

    if (user) {
      res.status(201).json({
        message: "User registered successfully",
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ error: "Invalid user registration data." });
    }
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Registration failed. Please try again later." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide both email and password." });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // Get user and explicitly select password field
    const user = await User.findOne({ email: cleanEmail }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Login successful",
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      // Generic auth failure message to prevent user enumeration
      res.status(401).json({ error: "Invalid email or password." });
    }
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Authentication service unavailable. Please try again." });
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user has already been attached by protect middleware
    res.json(req.user);
  } catch (err) {
    console.error("getMe error:", err.message);
    res.status(500).json({ error: "Failed to retrieve user profile." });
  }
};

// @desc    Delete logged in user account and all associated test telemetry data
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete user test jobs, paired agents, projects, and folders
    const TestJob = require("../models/TestJob");
    const Agent = require("../models/Agent");
    const Project = require("../models/Project");
    const Folder = require("../models/Folder");

    await TestJob.deleteMany({ userId });
    await Agent.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await Folder.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "Account and associated workspace data deleted successfully",
    });
  } catch (err) {
    console.error("Delete account error:", err.message);
    res.status(500).json({ error: "Failed to delete account. Please try again." });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  deleteAccount,
};
