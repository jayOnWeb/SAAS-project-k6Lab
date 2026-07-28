const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  createFolder,
  getFoldersByProject,
  deleteFolder,
} = require("../controllers/projectController");

router.use(protect);

// Project endpoints
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.delete("/:id", deleteProject);

// Folder endpoints
router.post("/folders", createFolder);
router.get("/:projectId/folders", getFoldersByProject);
router.delete("/folders/:id", deleteFolder);

module.exports = router;
