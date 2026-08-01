import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    end: true,
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Run Test",
    path: "/dashboard/run-test",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="w-60 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full shrink-0 font-sans relative">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-red-500/40 p-1 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
            <img 
              src="/logo.png" 
              alt="k6-agent workspace logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-white font-semibold text-sm tracking-tight truncate">k6-agent workspace</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-zinc-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">
          Telemetry Core
        </p>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-red-950/40 text-red-400 border-l-2 border-red-500 pl-[10px]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Profile & Footer */}
      <div className="px-3 pb-4 border-t border-zinc-900 pt-4 space-y-2">
        <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-900">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-medium leading-none truncate">{user?.name || "Anonymous User"}</p>
              <p className="text-zinc-500 text-[10px] mt-0.5 truncate">{user?.email || "developer@k6lab"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 justify-center text-xs text-zinc-400 hover:text-white bg-zinc-900/50 hover:bg-zinc-900 py-1.5 px-2 rounded-md transition-colors cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1 justify-center text-xs text-red-400/80 hover:text-red-400 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 py-1.5 px-2 rounded-md transition-colors cursor-pointer"
          >
            Delete Data
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