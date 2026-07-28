import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProjects, createProject, deleteProject } from "../services/projectService";
import { Folder, Plus, Trash2, ExternalLink, Play, Layers, Activity, Search, Shield, Server } from "lucide-react";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({
    name: "",
    description: "",
    baseUrl: "",
    color: "#ef4444",
  });
  const [modalError, setModalError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchProjectsList = async () => {
    try {
      setLoading(true);
      const res = await getProjects();
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsList();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!modalForm.name.trim()) {
      setModalError("Project name is required");
      return;
    }
    setModalError("");
    setCreating(true);
    try {
      const res = await createProject(modalForm);
      if (res.success) {
        setShowModal(false);
        setModalForm({ name: "", description: "", baseUrl: "", color: "#ef4444" });
        fetchProjectsList();
      }
    } catch (err) {
      setModalError(err.response?.data?.error || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete project "${name}"? Folders and test associations will be cleaned up.`)) {
      return;
    }
    try {
      await deleteProject(id);
      fetchProjectsList();
    } catch (err) {
      alert("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-950/40 border border-red-900/30 rounded-lg text-red-500">
                <Folder className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">API Projects & Workspaces</h1>
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Organize your API endpoints into microservice projects (e.g. E-Commerce, Auth, Checkout) and nested folders
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 transition-all font-sans"
              />
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-lg shadow-red-900/10 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
            <p className="text-zinc-500 text-xs">Loading projects workspace...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-zinc-900/10 border border-dashed border-zinc-800 rounded-2xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
              <Folder className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">No projects found</h3>
              <p className="text-zinc-500 text-xs mt-1">Create a project like "E-Commerce" or "Auth Service" to structure your API tests and folders.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-5 space-y-4 transition-all duration-150 cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-md shrink-0 border border-white/10"
                        style={{ backgroundColor: project.color || "#ef4444" }}
                      />
                      <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors truncate">
                        {project.name}
                      </h3>
                    </div>

                    <button
                      onClick={(e) => handleDelete(project._id, project.name, e)}
                      title="Delete project"
                      className="text-zinc-600 hover:text-red-400 p-1 rounded-lg hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 min-h-[32px]">
                    {project.description || "No description provided."}
                  </p>

                  {project.baseUrl && (
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono bg-zinc-950/60 px-2.5 py-1 rounded-lg border border-zinc-900 truncate">
                      <Server className="w-3 h-3 text-zinc-500 shrink-0" />
                      <span className="truncate">{project.baseUrl}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-900/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-zinc-500 font-mono text-[11px]">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Layers className="w-3.5 h-3.5 text-amber-500" />
                      {project.folderCount || 0} folders
                    </span>
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Activity className="w-3.5 h-3.5 text-red-500" />
                      {project.testCount || 0} tests
                    </span>
                  </div>

                  <Link
                    to={`/dashboard/run-test?projectId=${project._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-red-950/40 hover:bg-red-600 text-red-400 hover:text-white border border-red-900/30 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    Test API
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Folder className="w-4 h-4 text-red-500" />
                Create New Project
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-mono"
              >
                ✕
              </button>
            </div>

            {modalError && (
              <div className="bg-red-950/30 border border-red-900/30 text-red-400 text-xs p-3 rounded-xl">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Microservices"
                  value={modalForm.name}
                  onChange={(e) => setModalForm({ ...modalForm, name: e.target.value })}
                  required
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Description</label>
                <textarea
                  rows="2"
                  placeholder="e.g. APIs for products, auth, cart, and payment checkout flow"
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Base Target URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://api.store.com"
                  value={modalForm.baseUrl}
                  onChange={(e) => setModalForm({ ...modalForm, baseUrl: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Badge Theme Color</label>
                <div className="flex gap-2">
                  {["#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setModalForm({ ...modalForm, color: c })}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${modalForm.color === c ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-zinc-900">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-xl disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
