import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTests from "../hooks/useTests";
import { formatNumber } from "../utils/format";
import { getMethodBadgeStyle } from "../utils/getMethodStyle";
import { getAgentStatus } from "../services/testService";
import { getProjects } from "../services/projectService";
import AnimatedList from "../components/AnimatedList";
import { 
  Activity, 
  Play, 
  Zap, 
  Shield, 
  Cpu, 
  Folder, 
  Layers, 
  Plus, 
  ArrowRight, 
  RefreshCw, 
  Search,
  Sliders,
  BarChart3,
  ExternalLink,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tests, loading: testsLoading, fetchTests } = useTests();
  const [projects, setProjects] = useState([]);
  const [testSearch, setTestSearch] = useState("");

  const [stats, setStats] = useState({
    avgLatency: 0,
    successRate: 0,
    totalRequests: 0,
    failedRequests: 0,
  });

  const [agentLoading, setAgentLoading] = useState(true);
  const [hasAgent, setHasAgent] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);

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

  const filteredTests = useMemo(() => {
    if (!testSearch.trim()) return tests;
    const q = testSearch.toLowerCase();
    return tests.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.url?.toLowerCase().includes(q) ||
        t.config?.url?.toLowerCase().includes(q) ||
        t.projectId?.name?.toLowerCase().includes(q)
    );
  }, [tests, testSearch]);

  if (agentLoading) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
        <p className="text-zinc-500 text-sm font-mono">Synchronizing workspace telemetry...</p>
      </div>
    );
  }

  const isAgentOnline = hasAgent && activeAgent?.status === "online";

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-9">
        
        {/* Workspace Command Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-900/90">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                Welcome back, {user?.name || "Developer"}
              </h1>
              <span className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">
                Workspace
              </span>
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Distributed API Load Testing Command Center &amp; Real-Time Telemetry Orchestrator
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Agent Live Connectivity Pill */}
            {isAgentOnline ? (
              <div className="flex items-center gap-2 bg-emerald-950/20 border border-emerald-800/40 px-3 py-2 rounded-xl text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-zinc-400">Agent:</span>
                <span className="text-emerald-300 font-semibold font-mono">{activeAgent.name}</span>
              </div>
            ) : (
              <Link
                to="/dashboard/run-test"
                className="flex items-center gap-2 bg-amber-950/20 border border-amber-800/40 hover:border-amber-700/60 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                title="Connect local runner agent"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-amber-400 font-medium">Agent Disconnected</span>
                <span className="text-amber-300 font-semibold underline ml-1">Connect</span>
              </Link>
            )}

            <Link
              to="/dashboard/projects"
              className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-zinc-400" />
              <span>New Project</span>
            </Link>

            <Link
              to="/dashboard/run-test"
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold py-2 px-4 rounded-xl transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-950/40 border border-red-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Launch Configurator</span>
            </Link>
          </div>
        </div>

        {/* Local Agent Warning Banner (if agent offline) */}
        {!isAgentOnline && (
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-900/30 border border-amber-700/50 flex items-center justify-center shrink-0 text-amber-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-amber-200">Local Runner Agent Disconnected</p>
                <p className="text-zinc-400 text-[11px] mt-0.5">
                  Pair your CLI runner token on the Run Test page to dispatch live distributed stress benchmarks.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/run-test"
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-xl transition-all cursor-pointer text-xs shrink-0 shadow-md"
            >
              Connect Runner Agent
            </Link>
          </div>
        )}

        {/* Executive Telemetry KPI Metric Bento Grid */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">
              Telemetry Overview
            </h2>
            <span className="text-[11px] text-zinc-500 font-mono">Real-time aggregate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Executions */}
            <div className="bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs font-semibold">Total Test Runs</span>
                <div className="w-8 h-8 rounded-xl bg-zinc-800/50 border border-zinc-700/40 flex items-center justify-center text-zinc-300 group-hover:text-red-400 group-hover:border-red-500/30 transition-colors">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-white block">
                  {tests.length}
                </span>
                <p className="text-zinc-500 text-[11px] mt-1">Dispatched performance tests</p>
              </div>
            </div>

            {/* 2. Mean Latency */}
            <div className="bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs font-semibold">Average Latency</span>
                <div className="w-8 h-8 rounded-xl bg-red-950/30 border border-red-800/40 flex items-center justify-center text-red-400 group-hover:bg-red-950/50 transition-colors">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-red-400 block">
                  {formatNumber(stats.avgLatency)} <span className="text-xs text-zinc-500 font-normal">ms</span>
                </span>
                <p className="text-zinc-500 text-[11px] mt-1">Across all endpoint executions</p>
              </div>
            </div>

            {/* 3. SLA Health Rate */}
            <div className="bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs font-semibold">SLA Health Rate</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-950/50 transition-colors">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-emerald-400 block">
                  {formatNumber(stats.successRate)}%
                </span>
                <p className="text-zinc-500 text-[11px] mt-1">Passed request assertions</p>
              </div>
            </div>

            {/* 4. Active Workspace Suites */}
            <div className="bg-zinc-900/30 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700/80 p-5 rounded-2xl flex flex-col justify-between transition-all duration-300 relative group overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-xs font-semibold">Active Projects</span>
                <div className="w-8 h-8 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-center text-amber-400 group-hover:bg-amber-950/50 transition-colors">
                  <Folder className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-amber-400 block">
                  {projects.length}
                </span>
                <p className="text-zinc-500 text-[11px] mt-1">Structured microservice suites</p>
              </div>
            </div>
          </div>
        </div>

        {/* 📁 Microservice Projects Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
            <div className="flex items-center gap-2.5">
              <Folder className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
                Microservice Projects
              </h3>
              <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                {projects.length} Suites
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <Link
                to="/dashboard/projects"
                className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1 font-medium"
              >
                <span>Manage All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="bg-zinc-900/20 border border-dashed border-zinc-800/80 rounded-2xl p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <Folder className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-white">No workspace projects created yet</p>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Create organized microservice projects (e.g., Auth, Payments, Catalog) to group your endpoint suites and multi-stage benchmarks.
                </p>
              </div>
              <Link 
                to="/dashboard/projects" 
                className="text-xs font-semibold bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl inline-flex items-center gap-1.5 transition-all shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Project</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 3).map((proj) => (
                <div
                  key={proj._id}
                  onClick={() => navigate(`/dashboard/projects/${proj._id}`)}
                  className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-red-500/40 rounded-2xl p-5 space-y-3.5 cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0 ring-2 ring-zinc-800" 
                        style={{ backgroundColor: proj.color || "#ef4444" }} 
                      />
                      <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                        {proj.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 shrink-0">
                      {proj.testCount || 0} tests
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {proj.description || "Microservice workspace for performance regression suites."}
                  </p>

                  {proj.baseUrl && (
                    <div className="text-[11px] font-mono text-zinc-500 bg-zinc-950/80 border border-zinc-900 px-2.5 py-1 rounded-lg truncate">
                      {proj.baseUrl}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-900">
                    <span className="flex items-center gap-1.5 font-mono text-[11px]">
                      <Layers className="w-3.5 h-3.5 text-amber-400" />
                      <span>{proj.folderCount || 0} folders</span>
                    </span>
                    <span className="text-red-400 font-semibold text-xs group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 📊 Recent Load Test Executions Feed */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-['Space_Grotesk']">
                Recent Load Test Executions
              </h3>
              <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md">
                {tests.length} Total
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Filter */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by endpoint, name..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500/50 font-sans"
                />
              </div>

              <button
                onClick={() => fetchTests()}
                className="text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                title="Refresh Execution List"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {testsLoading && tests.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3">
              <div className="w-7 h-7 border-2 border-zinc-800 border-t-red-500 rounded-full animate-spin" />
              <p className="text-xs text-zinc-500 font-mono">Fetching test telemetry records...</p>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-10 text-center space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                <Activity className="w-5 h-5" />
              </div>
              <p className="text-xs text-zinc-400">
                {testSearch ? `No test runs matching "${testSearch}"` : "No load tests executed in this workspace yet."}
              </p>
              <Link 
                to="/dashboard/run-test" 
                className="text-xs font-semibold bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl inline-block transition-all shadow-md"
              >
                Launch First Benchmark
              </Link>
            </div>
          ) : (
            <AnimatedList
              items={filteredTests}
              showGradients
              enableArrowNavigation
              displayScrollbar
              maxHeight="360px"
              onItemSelect={(test) => navigate(`/dashboard/run-test?jobId=${test._id}`)}
              renderItem={(test) => (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 w-full">
                  {/* Left: Method, Name, URL & Project */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border shrink-0 ${getMethodBadgeStyle(test.method || test.config?.method || "GET")}`}>
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
                      <p className="text-[11px] font-mono text-zinc-500 truncate max-w-sm sm:max-w-md mt-0.5">
                        {test.url || test.config?.url}
                      </p>
                    </div>
                  </div>

                  {/* Right: Metrics & Status */}
                  <div className="flex items-center gap-6 shrink-0 font-mono text-xs self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">VUs &amp; TIME</span>
                      <span className="text-zinc-300 font-semibold">{test.vus || test.config?.vus || 5} VUs / {test.duration || test.config?.duration || "10s"}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">AVG LATENCY</span>
                      <span className="text-red-400 font-bold">{formatNumber(test.avgResponseTime || 0)} ms</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 block">STATUS</span>
                      <span className={`font-bold uppercase text-[11px] ${
                        test.status === "completed" 
                          ? "text-emerald-400" 
                          : test.status === "failed" 
                          ? "text-red-400" 
                          : "text-amber-400"
                      }`}>
                        {test.status}
                      </span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors hidden sm:block" />
                  </div>
                </div>
              )}
            />
          )}
        </div>

        {/* 🛠️ Guided Workflow Shortcuts (Bento Footer) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Link
            to="/dashboard/run-test"
            className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-red-500/30 p-5 rounded-2xl transition-all group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <Sliders className="w-5 h-5 text-red-400" />
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-red-400 transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">Visual Test Configurator</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Design multi-stage load curves, ramp-up schedules, custom headers, and SLA pass/fail thresholds.
            </p>
          </Link>

          <Link
            to="/dashboard/projects"
            className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/30 p-5 rounded-2xl transition-all group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <Folder className="w-5 h-5 text-amber-400" />
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-400 transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">Microservice Suites</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Structure API endpoints into organized microservice folders with shared environment variables and base URLs.
            </p>
          </Link>

          <Link
            to="/dashboard/analytics"
            className="bg-zinc-900/30 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-emerald-500/30 p-5 rounded-2xl transition-all group space-y-2 block"
          >
            <div className="flex items-center justify-between">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">Telemetry Analytics</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Inspect historical percentile distributions (p90, p95, p99), error rates, and SLA assertion compliance.
            </p>
          </Link>
        </div>

      </div>
    </div>
  );
}