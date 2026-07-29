import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTests from "../hooks/useTests";
import { formatNumber } from "../utils/format";
import { getAgentStatus, runTest } from "../services/testService";
import { getProjects } from "../services/projectService";
import AgentOnboarding from "../components/AgentOnboarding";
import { Activity, Play, Calendar, Zap, AlertCircle, CheckCircle2, Shield, Cpu, Folder, Layers, Plus, ArrowRight, RefreshCw, Server, Search } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tests, loading: testsLoading, fetchTests } = useTests();
  const [projects, setProjects] = useState([]);

  const [stats, setStats] = useState({
    avgLatency: 0,
    successRate: 0,
    totalRequests: 0,
    failedRequests: 0,
  });

  const [agentLoading, setAgentLoading] = useState(true);
  const [hasAgent, setHasAgent] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);

  // Quick Launcher State
  const [quickUrl, setQuickUrl] = useState("");
  const [quickMethod, setQuickMethod] = useState("GET");
  const [quickVus, setQuickVus] = useState(5);
  const [quickDuration, setQuickDuration] = useState("10s");
  const [quickLaunching, setQuickLaunching] = useState(false);
  const [quickError, setQuickError] = useState("");

  const checkAgent = async (isInitial = false) => {
    try {
      if (isInitial) setAgentLoading(true);
      const res = await getAgentStatus();
      if (res.success) {
        setHasAgent(res.hasAgent);
        setActiveAgent(res.activeAgent);
      }
    } catch (err) {
      console.error("Failed to fetch agent status:", err);
    } finally {
      if (isInitial) setAgentLoading(false);
    }
  };

  const fetchWorkspaceProjects = async () => {
    try {
      const res = await getProjects();
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  useEffect(() => {
    checkAgent(true);
    fetchTests();
    fetchWorkspaceProjects();
    const interval = setInterval(() => checkAgent(false), 5000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    if (tests && tests.length > 0) {
      let totalLatency = 0;
      let totalRequests = 0;
      let totalSuccess = 0;
      let totalFailed = 0;

      tests.forEach((test) => {
        totalLatency += test.avgResponseTime || 0;
        totalRequests += test.totalRequests || 0;
        totalFailed += test.failedRequests || 0;
        if ((test.failureRate || 0) === 0) totalSuccess += 1;
      });

      setStats({
        avgLatency: totalLatency / tests.length,
        successRate: (totalSuccess / tests.length) * 100,
        totalRequests,
        failedRequests: totalFailed,
      });
    }
  }, [tests]);

  const handleQuickLaunch = async (e) => {
    e.preventDefault();
    if (!quickUrl) {
      setQuickError("Target URL is required");
      return;
    }
    setQuickLaunching(true);
    setQuickError("");
    try {
      const res = await runTest({
        name: `Quick Test - ${quickUrl.replace(/https?:\/\//, "")}`,
        url: quickUrl,
        method: quickMethod,
        vus: Number(quickVus),
        duration: quickDuration,
      });
      if (res.success && res.job) {
        navigate(`/dashboard/run-test?jobId=${res.job.id}`);
      }
    } catch (err) {
      setQuickError(err.response?.data?.message || err.response?.data?.error || "Failed to start quick load test");
    } finally {
      setQuickLaunching(false);
    }
  };

  if (agentLoading) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Validating workspace credentials...</p>
      </div>
    );
  }

  const isAgentOnline = hasAgent && activeAgent?.status === "online";

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-zinc-900">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || "Developer"}
            </h1>
            <p className="text-zinc-400 text-xs mt-0.5">
              High-Productivity Telemetry Command Center & API Load Testing Workspace
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isAgentOnline ? (
              <div className="hidden sm:flex items-center gap-2 bg-zinc-900/60 border border-zinc-800 px-3.5 py-2 rounded-xl text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-zinc-400">Agent: </span>
                <span className="text-white font-semibold font-mono">{activeAgent.name}</span>
              </div>
            ) : (
              <Link
                to="/dashboard/run-test"
                className="hidden sm:flex items-center gap-2 bg-amber-950/30 border border-amber-800/40 px-3.5 py-2 rounded-xl text-xs font-medium hover:border-amber-700 transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-400">Agent: Disconnected</span>
                <span className="text-amber-300 font-semibold underline ml-1">Connect</span>
              </Link>
            )}

            <Link
              to="/dashboard/projects"
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Folder className="w-4 h-4 text-zinc-400" />
              Projects
            </Link>

            <Link
              to="/dashboard/run-test"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-900/10 border border-red-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              Configurator
            </Link>
          </div>
        </div>

        {/* Local Agent Connection Banner (if agent not registered or offline) */}
        {!isAgentOnline && (
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-xl bg-amber-900/30 border border-amber-700/40 flex items-center justify-center shrink-0 text-amber-400 font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-amber-200">Local Agent Not Connected</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">Generate your token and connect your local runner CLI agent on the Run Test page to launch live stress tests.</p>
              </div>
            </div>
            <Link
              to="/dashboard/run-test"
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer text-xs shrink-0 shadow-md"
            >
              Connect Agent First
            </Link>
          </div>
        )}

        {/* Top Telemetry Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute right-4 top-4 text-zinc-800"><Activity className="w-8 h-8" /></div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Total Test Runs</span>
            <span className="text-3xl font-bold font-mono tracking-tight text-white mt-1">{tests.length}</span>
            <span className="text-zinc-500 text-xs mt-1">Dispatched performance tests</span>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute right-4 top-4 text-zinc-800"><Zap className="w-8 h-8" /></div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Average Latency</span>
            <span className="text-3xl font-bold font-mono tracking-tight text-red-400 mt-1">
              {formatNumber(stats.avgLatency)} <span className="text-sm text-zinc-500 font-normal">ms</span>
            </span>
            <span className="text-zinc-500 text-xs mt-1">Across all endpoint runs</span>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute right-4 top-4 text-zinc-800"><Shield className="w-8 h-8" /></div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">SLA Health Rate</span>
            <span className="text-3xl font-bold font-mono tracking-tight text-emerald-400 mt-1">
              {formatNumber(stats.successRate)}%
            </span>
            <span className="text-zinc-500 text-xs mt-1">Passed request assertions</span>
          </div>


          <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute right-4 top-4 text-zinc-800"><Folder className="w-8 h-8" /></div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Active Projects</span>
            <span className="text-3xl font-bold font-mono tracking-tight text-amber-400 mt-1">{projects.length}</span>
            <span className="text-zinc-500 text-xs mt-1">Structured microservice suites</span>
          </div>
        </div>

        {/* 🚀 Quick Load Launcher Widget */}
        <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick API Load Launcher</h3>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Fire rapid stress run without full config</span>
          </div>

          {quickError && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/30 p-2.5 rounded-xl font-mono">{quickError}</p>
          )}

          <form onSubmit={handleQuickLaunch} className="flex flex-col sm:flex-row gap-3">
            <select
              value={quickMethod}
              onChange={(e) => setQuickMethod(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-amber-400 font-bold font-mono focus:outline-none focus:border-red-600"
            >
              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter endpoint URL (e.g. http://localhost:8000/api/v1/auth)"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              required
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600 font-mono"
            />

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="number"
                min="1"
                max="100"
                value={quickVus}
                onChange={(e) => setQuickVus(e.target.value)}
                title="VUs"
                className="w-16 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2.5 text-xs text-center font-mono text-white focus:outline-none focus:border-red-600"
              />
              <span className="text-xs text-zinc-500 font-mono">VUs</span>

              <input
                type="text"
                placeholder="10s"
                value={quickDuration}
                onChange={(e) => setQuickDuration(e.target.value)}
                title="Duration (e.g. 10s, 30s, 1m)"
                className="w-16 bg-zinc-950 border border-zinc-800 rounded-xl px-2 py-2.5 text-xs text-center font-mono text-white focus:outline-none focus:border-red-600"
              />
              <span className="text-xs text-zinc-500 font-mono">Duration</span>

              <button
                type="submit"
                disabled={quickLaunching}
                className="bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {quickLaunching ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                <span>Fire Now</span>
              </button>
            </div>
          </form>
        </div>

        {/* 📁 Projects & Folders Workspace Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Workspace Projects (e.g. E-Commerce, Auth)</h3>
            </div>

            <Link
              to="/dashboard/projects"
              className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Manage Projects</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="bg-zinc-900/10 border border-dashed border-zinc-900 rounded-2xl p-6 text-center space-y-2">
              <p className="text-xs text-zinc-500">No projects created yet. Create a project like "E-Commerce" to organize your folders and API endpoints.</p>
              <Link to="/dashboard/projects" className="text-xs bg-red-600 text-white px-3.5 py-1.5 rounded-xl inline-block">
                + Create Project
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 3).map((proj) => (
                <div
                  key={proj._id}
                  onClick={() => navigate(`/dashboard/projects/${proj._id}`)}
                  className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-4 space-y-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: proj.color || "#ef4444" }} />
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">{proj.name}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                      {proj.testCount || 0} tests
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">{proj.description || "Microservices project workspace"}</p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-900">
                    <span className="flex items-center gap-1 font-mono">
                      <Layers className="w-3 h-3 text-amber-500" />
                      {proj.folderCount || 0} folders
                    </span>
                    <span className="text-red-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📊 Recent Load Test Runs Feed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Load Test Runs</h3>
            </div>

            <button
              onClick={() => fetchTests()}
              className="text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          {testsLoading && tests.length === 0 ? (
            <div className="py-12 flex justify-center">
              <div className="w-6 h-6 border-2 border-zinc-800 border-t-red-500 rounded-full animate-spin" />
            </div>
          ) : tests.length === 0 ? (
            <div className="bg-zinc-900/10 border border-zinc-900 rounded-2xl p-8 text-center space-y-3">
              <p className="text-xs text-zinc-500">No load tests executed yet.</p>
              <Link to="/dashboard/run-test" className="text-xs bg-red-600 text-white px-4 py-2 rounded-xl inline-block">
                Fire First Load Test
              </Link>
            </div>
          ) : (
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden divide-y divide-zinc-900/80">
              {tests.slice(0, 8).map((test) => (
                <div
                  key={test._id}
                  onClick={() => navigate(`/dashboard/run-test?jobId=${test._id}`)}
                  className="p-4 hover:bg-zinc-900/50 transition-colors cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-amber-400 shrink-0">
                      {test.method || test.config?.method || "GET"}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{test.name || "Load Test Run"}</h4>
                        {test.projectId?.name && (
                          <span className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono truncate">
                            📁 {test.projectId.name} {test.folderId?.name ? `/ ${test.folderId.name}` : ""}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-zinc-500 truncate max-w-sm sm:max-w-md">{test.url || test.config?.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0 font-mono text-xs self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">VUs & TIME</span>
                      <span className="text-zinc-300 font-semibold">{test.vus || test.config?.vus || 5} VUs / {test.duration || test.config?.duration || "10s"}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">AVG LATENCY</span>
                      <span className="text-red-400 font-bold">{formatNumber(test.avgResponseTime || 0)} ms</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">STATUS</span>
                      <span className={`font-bold uppercase text-[11px] ${test.status === "completed" ? "text-emerald-400" : "text-amber-400"}`}>
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
  );
}