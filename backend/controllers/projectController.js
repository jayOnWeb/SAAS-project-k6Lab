const mongoose = require("mongoose");
const Project = require("../models/Project");
const Folder = require("../models/Folder");
const TestJob = require("../models/TestJob");

// Create Project
const createProject = async (req, res) => {
  try {
    const { name, description, color, baseUrl } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, error: "Project name is required." });
    }

    const cleanName = String(name).trim().slice(0, 100);
    const cleanDesc = description ? String(description).trim().slice(0, 500) : "";
    const cleanColor = color && /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#ef4444";
    const cleanBaseUrl = baseUrl ? String(baseUrl).trim().slice(0, 200) : "";

    const project = await Project.create({
      userId: req.user._id,
      name: cleanName,
      description: cleanDesc,
      color: cleanColor,
      baseUrl: cleanBaseUrl,
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("Error creating project:", error.message);
    return res.status(500).json({ success: false, error: "Failed to create project." });
  }
};

// Get All Projects for User (with stats)
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const projectsWithStats = await Promise.all(
      projects.map(async (proj) => {
        const folderCount = await Folder.countDocuments({ projectId: proj._id });
        const testCount = await TestJob.countDocuments({ projectId: proj._id });
        const recentTests = await TestJob.find({ projectId: proj._id })
          .sort({ createdAt: -1 })
          .limit(3)
          .select("name config result status createdAt");

        return {
          ...proj.toObject(),
          folderCount,
          testCount,
          recentTests,
        };
      })
    );

    return res.json({ success: true, data: projectsWithStats });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    return res.status(500).json({ success: false, error: "Failed to fetch projects." });
  }
};

// Get Single Project Details (with folders and test list)
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid project ID." });
    }

    const project = await Project.findOne({ _id: id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found." });
    }

    const folders = await Folder.find({ projectId: project._id }).sort({ createdAt: 1 });
    const tests = await TestJob.find({ projectId: project._id })
      .select("-logs")
      .populate("folderId", "name")
      .sort({ createdAt: -1 })
      .limit(100);

    return res.json({
      success: true,
      data: {
        ...project.toObject(),
        folders,
        tests,
      },
    });
  } catch (error) {
    console.error("Error fetching project details:", error.message);
    return res.status(500).json({ success: false, error: "Failed to fetch project details." });
  }
};

// Delete Project
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid project ID." });
    }

    const project = await Project.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, error: "Project not found." });
    }

    await Folder.deleteMany({ projectId: project._id });
    await TestJob.updateMany({ projectId: project._id }, { $set: { projectId: null, folderId: null } });

    return res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    return res.status(500).json({ success: false, error: "Failed to delete project." });
  }
};

// Create Folder inside Project
const createFolder = async (req, res) => {
  try {
    const { projectId, name, description } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, error: "Folder name is required." });
    }

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, error: "Invalid associated project ID." });
    }

    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    if (!project) {
      return res.status(404).json({ success: false, error: "Associated project not found." });
    }

    const cleanName = String(name).trim().slice(0, 100);
    const cleanDesc = description ? String(description).trim().slice(0, 300) : "";

    const folder = await Folder.create({
      userId: req.user._id,
      projectId: project._id,
      name: cleanName,
      description: cleanDesc,
    });

    return res.status(201).json({ success: true, data: folder });
  } catch (error) {
    console.error("Error creating folder:", error.message);
    return res.status(500).json({ success: false, error: "Failed to create folder." });
  }
};

// Get Folders for a Project
const getFoldersByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, error: "Invalid project ID." });
    }

    const folders = await Folder.find({
      projectId,
      userId: req.user._id,
    }).sort({ createdAt: 1 });

    const foldersWithStats = await Promise.all(
      folders.map(async (folder) => {
        const testCount = await TestJob.countDocuments({ folderId: folder._id });
        return {
          ...folder.toObject(),
          testCount,
        };
      })
    );

    return res.json({ success: true, data: foldersWithStats });
  } catch (error) {
    console.error("Error fetching folders:", error.message);
    return res.status(500).json({ success: false, error: "Failed to fetch folders." });
  }
};

// Delete Folder
const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid folder ID." });
    }

    const folder = await Folder.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!folder) {
      return res.status(404).json({ success: false, error: "Folder not found." });
    }

    await TestJob.updateMany({ folderId: folder._id }, { $set: { folderId: null } });

    return res.json({ success: true, message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error.message);
    return res.status(500).json({ success: false, error: "Failed to delete folder." });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
  createFolder,
  getFoldersByProject,
  deleteFolder,
};
