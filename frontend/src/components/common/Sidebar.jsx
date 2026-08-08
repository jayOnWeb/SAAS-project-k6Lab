import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { runTest } from "../../services/testService";
import { getMethodBadgeStyle } from "../../utils/getMethodStyle";
import { 
  Zap, 
  Play, 
  Folder, 
  Activity, 
  BarChart3, 
  History as HistoryIcon, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw, 
  LogOut, 
  Trash2, 
  AlertCircle 
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    end: true,
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Projects",
    path: "/dashboard/projects",
    icon: <Folder className="w-4 h-4 shrink-0" />,
  },
  {
    name: "Run Test",
    path: "/dashboard/run-test",
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Test History",
    path: "/dashboard/history",
    icon: <HistoryIcon className="w-4 h-4 shrink-0" />,
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: <BarChart3 className="w-4 h-4 shrink-0" />,
  },
];

const Sidebar = () => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Quick Launch Widget State
  const [quickExpanded, setQuickExpanded] = useState(true);
  const [quickUrl, setQuickUrl] = useState("");
  const [quickMethod, setQuickMethod] = useState("GET");
  const [quickVus, setQuickVus] = useState(5);
  const [quickDuration, setQuickDuration] = useState("10s");
  const [quickLaunching, setQuickLaunching] = useState(false);
  const [quickError, setQuickError] = useState("");

  const handleSignOut = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleDeleteAccountConfirm = async () => {
    setDeleting(true);
    const res = await deleteAccount();
    setDeleting(false);
    if (res.success) {
      navigate("/", { replace: true });
    } else {
      alert(res.error || "Failed to delete account");
    }
  };

  const handleQuickLaunch = async (e) => {
    e.preventDefault();
    if (!quickUrl.trim()) {
      setQuickError("Target URL required");
      return;
    }
    setQuickLaunching(true);
    setQuickError("");
    try {
      const res = await runTest({
        name: `Quick Test - ${quickUrl.replace(/https?:\/\//, "")}`,
        url: quickUrl.trim(),
        method: quickMethod,
        vus: Number(quickVus) || 5,
        duration: quickDuration || "10s",
      });
      if (res.success && res.job) {
        navigate(`/dashboard/run-test?jobId=${res.job.id}`);
      }
    } catch (err) {
      setQuickError(err.response?.data?.message || err.response?.data?.error || "Launch failed");
    } finally {
      setQuickLaunching(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full shrink-0 font-sans select-none">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-zinc-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-red-500/30 p-1.5 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            <img 
              src="/logo.png" 
              alt="k6-agent workspace logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-white font-bold text-sm tracking-tight block leading-tight">k6-agent</span>
            <span className="text-[10px] text-zinc-500 font-mono">telemetry v2.4</span>
          </div>
        </div>
      </div>

      {/* Main Nav Links & Quick Launcher - Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Navigation Section */}
        <div>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-red-500/10 text-red-400 border border-red-500/30 font-semibold shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ⚡ Quick Load Launcher Card in Sidebar */}
        <div className="pt-2 border-t border-zinc-900/80">
          <div 
            onClick={() => setQuickExpanded(!quickExpanded)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-zinc-300 hover:text-white cursor-pointer group transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-colors">
                <Zap className="w-3 h-3 text-red-400 fill-red-400/20" />
              </div>
              <span className="text-xs font-bold tracking-tight text-zinc-200 group-hover:text-white">Quick Launch</span>
            </div>
            {quickExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform" />
            )}
          </div>

          {quickExpanded && (
            <div className="mt-2.5 bg-zinc-900/40 border border-zinc-900 rounded-xl p-3 space-y-2.5 shadow-inner">
              {quickError && (
                <div className="flex items-center gap-1.5 text-[11px] text-red-400 bg-red-950/40 border border-red-900/40 p-2 rounded-lg font-mono">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span className="truncate">{quickError}</span>
                </div>
              )}

              <form onSubmit={handleQuickLaunch} className="space-y-2">
                <div className="flex gap-1.5">
                  <select
                    value={quickMethod}
                    onChange={(e) => setQuickMethod(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-[11px] font-bold font-mono text-zinc-300 focus:outline-none focus:border-red-500/50 shrink-0"
                  >
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <input
                    type="text"
                    placeholder="https://api.domain.com/path"
                    value={quickUrl}
                    onChange={(e) => setQuickUrl(e.target.value)}
                    required
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/50 font-mono min-w-0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 focus-within:border-red-500/50">
                    <span className="text-[10px] text-zinc-500 font-mono mr-1">VUs:</span>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={quickVus}
                      onChange={(e) => setQuickVus(e.target.value)}
                      className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none text-right"
                    />
                  </div>

                  <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 focus-within:border-red-500/50">
                    <span className="text-[10px] text-zinc-500 font-mono mr-1">Dur:</span>
                    <input
                      type="text"
                      value={quickDuration}
                      onChange={(e) => setQuickDuration(e.target.value)}
                      placeholder="10s"
                      className="w-full bg-transparent text-[11px] font-mono text-white focus:outline-none text-right"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={quickLaunching}
                  className="w-full mt-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-red-950/30 border border-red-500/20 active:scale-[0.98]"
                >
                  {quickLaunching ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3 h-3 fill-white" />
                  )}
                  <span>{quickLaunching ? "Launching..." : "Fire Quick Test"}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* User Profile & Footer */}
      <div className="px-3 pb-3 border-t border-zinc-900 pt-3 space-y-2 shrink-0 bg-zinc-950">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-zinc-900/50 border border-zinc-900">
          <div className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-bold shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold leading-tight truncate">{user?.name || "Developer"}</p>
            <p className="text-zinc-500 text-[10px] font-mono truncate">{user?.email || "developer@k6lab"}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 justify-center text-xs text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 py-1.5 px-2 rounded-lg transition-colors cursor-pointer border border-zinc-800/50"
            title="Sign Out"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign out</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 justify-center text-[11px] text-red-400/80 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 py-1.5 px-2 rounded-lg transition-colors cursor-pointer"
            title="Delete Account Data"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">Delete Account &amp; Test Data?</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                This will permanently delete your account, paired k6 local agents, and test telemetry history. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccountConfirm}
                disabled={deleting}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl transition-colors cursor-pointer"
              >
                {deleting ? "Wiping..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;