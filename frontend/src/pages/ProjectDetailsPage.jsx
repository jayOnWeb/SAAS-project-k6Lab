import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjectById, createFolder, deleteFolder } from "../services/projectService";
import { getAllTests } from "../services/testService";
import { formatNumber } from "../utils/format";
import { Folder, Layers, Plus, Trash2, Play, ArrowLeft, Activity, Shield, Clock, Server, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [folders, setFolders] = useState([]);
  const [tests, setTests] = useState([]);
  const [activeFolderId, setActiveFolderId] = useState("all"); // 'all' or specific folder ID
  const [loading, setLoading] = useState(true);

  // Folder creation modal state
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDesc, setFolderDesc] = useState("");
  const [folderError, setFolderError] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const res = await getProjectById(projectId);
      if (res.success) {
        setProject(res.data);
        setFolders(res.data.folders || []);
        setTests(res.data.tests || []);
      }
    } catch (err) {
      console.error("Failed to fetch project details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setFolderError("Folder name is required (e.g., Auth, E-Com)");
      return;
    }
    setFolderError("");
    setCreatingFolder(true);
    try {
      const res = await createFolder({
        projectId,
        name: folderName,
        description: folderDesc,
      });
      if (res.success) {
        setShowFolderModal(false);
        setFolderName("");
        setFolderDesc("");
        fetchProjectData();
      }
    } catch (err) {
      setFolderError(err.response?.data?.error || "Failed to create folder");
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete folder "${name}"? Tests will revert to project root.`)) return;
    try {
      await deleteFolder(id);
      fetchProjectData();
    } catch (err) {
      alert("Failed to delete folder");
    }
  };

  const filteredTests = tests.filter((t) => {
    if (activeFolderId === "all") return true;
    if (activeFolderId === "root") return !t.folderId;
    return t.folderId?._id === activeFolderId || t.folderId === activeFolderId;
  });

  if (loading) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
        <p className="text-zinc-500 text-xs font-mono">Loading project workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans py-20 text-center space-y-4">
        <p className="text-zinc-400 text-sm">Project not found or deleted.</p>
        <Link to="/dashboard/projects" className="text-xs bg-red-600 text-white px-4 py-2 rounded-xl inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Navigation & Header */}
        <div className="space-y-4">
          <Link
            to="/dashboard/projects"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl p-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 rounded-md border border-white/20"
                  style={{ backgroundColor: project.color || "#ef4444" }}
                />
                <h1 className="text-2xl font-bold text-white tracking-tight">{project.name}</h1>
              </div>

              <p className="text-xs text-zinc-400 max-w-2xl">{project.description || "Project microservices load testing workspace."}</p>

              {project.baseUrl && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <Server className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Base URL: </span>
                  <span className="text-zinc-300">{project.baseUrl}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFolderModal(true)}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Folder (e.g., Auth)
              </button>

              <Link
                to={`/dashboard/run-test?projectId=${project._id}${activeFolderId !== "all" && activeFolderId !== "root" ? `&folderId=${activeFolderId}` : ""}`}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-red-900/10"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Test API Endpoint
              </Link>
            </div>
          </div>
        </div>

        {/* Workspace Layout: Folders Sidebar + Tests Table */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Folders Navigation Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Folders / Modules
              </span>
              <button
                onClick={() => setShowFolderModal(true)}
                className="text-zinc-500 hover:text-white text-[11px] font-semibold"
              >
                + New
              </button>
            </div>

            <div className="space-y-1 bg-zinc-900/20 border border-zinc-900 p-2 rounded-xl">
              <button
                onClick={() => setActiveFolderId("all")}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${activeFolderId === "all" ? "bg-red-950/40 text-red-400 border border-red-900/30" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"}`}
              >
                <span>All Endpoints</span>
                <span className="text-[10px] font-mono text-zinc-500">{tests.length}</span>
              </button>

              {folders.map((folder) => {
                const count = tests.filter((t) => t.folderId?._id === folder._id || t.folderId === folder._id).length;
                return (
                  <div
                    key={folder._id}
                    onClick={() => setActiveFolderId(folder._id)}
                    className={`group w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${activeFolderId === folder._id ? "bg-red-950/40 text-red-400 border border-red-900/30" : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"}`}
                  >
                    <span className="truncate">📂 {folder.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-zinc-500">{count}</span>
                      <button
                        onClick={(e) => handleDeleteFolder(folder._id, folder.name, e)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Runs Table / Cards */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-red-500" />
                API Test Runs ({filteredTests.length})
              </span>
            </div>

            {filteredTests.length === 0 ? (
              <div className="bg-zinc-900/10 border border-dashed border-zinc-900 rounded-2xl p-10 text-center space-y-3">
                <p className="text-xs text-zinc-500">No test runs associated with this folder yet.</p>
                <Link
                  to={`/dashboard/run-test?projectId=${project._id}${activeFolderId !== "all" && activeFolderId !== "root" ? `&folderId=${activeFolderId}` : ""}`}
                  className="inline-flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-xl transition-all"
                >
                  <Play className="w-3 h-3 fill-white" />
                  Run First API Test
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTests.map((test) => (
                  <div
                    key={test._id}
                    onClick={() => navigate(`/dashboard/run-test?jobId=${test._id}`)}
                    className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-amber-400">
                          {test.config?.method || test.method}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{test.name}</h4>
                        {test.folderId?.name && (
                          <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
                            📂 {test.folderId.name}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-zinc-500 truncate max-w-lg">{test.config?.url || test.url}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block">LATENCY</span>
                        <span className="text-white font-bold">{formatNumber(test.result?.avgResponseTime || test.avgResponseTime || 0)} ms</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-zinc-500 block">STATUS</span>
                        <span className={`font-bold ${test.status === "completed" ? "text-emerald-400" : "text-amber-400"}`}>
                          {test.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-500" />
                Add Folder (Module)
              </h2>
              <button
                onClick={() => setShowFolderModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {folderError && (
              <div className="bg-red-950/30 border border-red-900/30 text-red-400 text-xs p-3 rounded-xl">
                {folderError}
              </div>
            )}

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Folder Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Auth, E-Com, Checkout, Cart"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Description</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Authentication & Token verification endpoints"
                  value={folderDesc}
                  onChange={(e) => setFolderDesc(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingFolder}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
                >
                  {creatingFolder ? "Creating..." : "Create Folder"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
