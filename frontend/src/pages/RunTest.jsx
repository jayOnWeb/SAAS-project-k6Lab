import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { runTest, getTestById, cancelTest, getAgentStatus, getAISuggestions } from "../services/testService";
import { formatNumber } from "../utils/format";
import AgentOnboarding from "../components/AgentOnboarding";
import {
  Activity, Play, CheckCircle2, AlertTriangle, Shield,
  Settings, Terminal, AlertCircle, RefreshCw, XCircle, Info, ChevronDown, ChevronUp, Clock, Sparkles, Brain
} from "lucide-react";

export default function RunTest() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");

  const renderMarkdown = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const cleanLine = line.trim();
      if (!cleanLine) return <div key={idx} className="h-2" />;
      
      if (cleanLine.startsWith("###")) {
        return <h4 key={idx} className="text-xs font-bold text-purple-400 mt-4 mb-1.5">{cleanLine.replace("###", "").trim()}</h4>;
      }
      if (cleanLine.startsWith("##")) {
        return <h3 key={idx} className="text-sm font-bold text-purple-300 mt-5 mb-2">{cleanLine.replace("##", "").trim()}</h3>;
      }
      if (cleanLine.startsWith("#")) {
        return <h2 key={idx} className="text-base font-extrabold text-white mt-6 mb-3">{cleanLine.replace("#", "").trim()}</h2>;
      }
      if (cleanLine.startsWith("-") || cleanLine.startsWith("*")) {
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 my-1 pl-1 font-sans">
            <span className="text-purple-500 text-xs shrink-0 mt-0.5">•</span>
            <span>{cleanLine.substring(1).trim()}</span>
          </div>
        );
      }
      if (/^\d+\./.test(cleanLine)) {
        const number = cleanLine.split(".")[0];
        const content = cleanLine.split(".").slice(1).join(".").trim();
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 my-1 pl-1 font-sans">
            <span className="text-purple-400 font-bold shrink-0">{number}.</span>
            <span>{content}</span>
          </div>
        );
      }
      return <p key={idx} className="text-xs text-zinc-400 leading-relaxed my-1 font-sans">{cleanLine}</p>;
    });
  };

  const [agentLoading, setAgentLoading] = useState(true);
  const [hasAgent, setHasAgent] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: "",
    url: "",
    method: "GET",
    vus: 5,
    duration: "10s",
    expectedStatus: 200,
    maxResponseTimeMs: 1000,
    sleepSeconds: 1,
    timeout: "30s",
    headersText: "{\n  \"Content-Type\": \"application/json\"\n}",
    bodyText: "{\n  \"email\": \"test@example.com\"\n}",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live Telemetry Monitoring State
  const [job, setJob] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // AI Suggestions State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [aiError, setAiError] = useState("");

  const logsEndRef = useRef(null);

  // Check agent status
  const checkAgent = async () => {
    try {
      setAgentLoading(true);
      const res = await getAgentStatus();
      if (res.success) {
        setHasAgent(res.hasAgent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAgentLoading(false);
    }
  };

  const fetchAISuggestions = async (id, force = false) => {
    setAiLoading(true);
    setAiError("");
    try {
      const res = await getAISuggestions(id, force);
      if (res.success) {
        setAiSuggestions(res.suggestions);
      } else {
        setAiError(res.error || "Failed to load AI suggestions.");
      }
    } catch (err) {
      setAiError(err.response?.data?.error || "AI engine currently offline.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    checkAgent();
  }, [jobId]);

  useEffect(() => {
    setAiSuggestions("");
    setAiError("");
    setAiLoading(false);
  }, [jobId]);

  useEffect(() => {
    if (job && job.aiSuggestions && !aiSuggestions && !aiLoading) {
      setAiSuggestions(job.aiSuggestions);
    }
  }, [job, aiSuggestions, aiLoading]);

  // Polling Job Details when jobId is present
  useEffect(() => {
    let interval = null;

    const fetchJobDetails = async () => {
      try {
        const res = await getTestById(jobId);
        if (res.success) {
          setJob(res.data);
          
          // Stop polling if final state reached
          if (["completed", "failed", "cancelled"].includes(res.data.status)) {
            setPollingActive(false);
          }
        }
      } catch (err) {
        console.error("Polling job details failed:", err);
      }
    };

    if (jobId) {
      fetchJobDetails();
      setPollingActive(true);
      interval = setInterval(fetchJobDetails, 2000);
    } else {
      setJob(null);
      setPollingActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId]);

  // Auto-scroll log console to bottom
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [job?.logs]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRunTest = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let trimmedUrl = form.url.trim();
      if (!/^https?:\/\//i.test(trimmedUrl)) {
        trimmedUrl = "http://" + trimmedUrl;
      }

      // Simple URL validation
      try {
        const parsed = new URL(trimmedUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          throw new Error();
        }
      } catch (err) {
        setError("Please enter a valid URL (e.g., http://localhost:8000 or https://api.example.com)");
        setLoading(false);
        return;
      }

      // Parse headers
      let headers = {};
      if (form.headersText) {
        try {
          headers = JSON.parse(form.headersText);
        } catch (err) {
          setError("Invalid JSON format in Headers field");
          setLoading(false);
          return;
        }
      }

      // Parse body
      let body = null;
      if (form.method !== "GET" && form.bodyText) {
        try {
          body = JSON.parse(form.bodyText);
        } catch (err) {
          setError("Invalid JSON format in Request Body field");
          setLoading(false);
          return;
        }
      }

      const payload = {
        name: form.name || `Load test: ${form.method} ${new URL(trimmedUrl).pathname}`,
        url: trimmedUrl,
        method: form.method,
        vus: parseInt(form.vus),
        duration: form.duration,
        headers,
        body,
        expectedStatus: parseInt(form.expectedStatus),
        maxResponseTimeMs: parseInt(form.maxResponseTimeMs),
        sleepSeconds: parseFloat(form.sleepSeconds),
        timeout: form.timeout,
      };

      const res = await runTest(payload);
      if (res.success) {
        setSearchParams({ jobId: res.job.id });
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.response?.data?.error || "Error queueing stress test job");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!jobId) return;
    setCancelLoading(true);
    try {
      await cancelTest(jobId);
    } catch (err) {
      console.error(err);
      alert("Failed to request cancel.");
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "text-zinc-500";
    switch (status.toLowerCase()) {
      case "queued": return "text-blue-400";
      case "running": return "text-amber-400 animate-pulse";
      case "completed": return "text-emerald-400";
      case "failed": return "text-red-400";
      case "cancel_requested": return "text-yellow-400 animate-pulse";
      case "cancelled": return "text-zinc-400";
      default: return "text-zinc-300";
    }
  };

  const getStatusBg = (status) => {
    if (!status) return "bg-zinc-900/30 border-zinc-800";
    switch (status.toLowerCase()) {
      case "queued": return "bg-blue-950/20 border-blue-900/40 text-blue-400";
      case "running": return "bg-amber-950/20 border-amber-900/40 text-amber-400";
      case "completed": return "bg-emerald-950/20 border-emerald-900/40 text-emerald-400";
      case "failed": return "bg-red-950/20 border-red-900/40 text-red-400";
      case "cancel_requested": return "bg-yellow-950/20 border-yellow-900/40 text-yellow-400";
      case "cancelled": return "bg-zinc-900/40 border-zinc-800 text-zinc-400";
      default: return "bg-zinc-900/30 border-zinc-800 text-zinc-300";
    }
  };

  const MetricCard = ({ label, value, unit = "", accent = false }) => (
    <div className={`rounded-xl border p-4 flex flex-col gap-1.5 transition-all duration-150 ${accent ? "bg-red-950/10 border-red-900/30" : "bg-zinc-900/30 border-zinc-900"}`}>
      <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</span>
      <span className={`text-xl font-bold font-mono tracking-tight ${accent ? "text-red-400" : "text-white"}`}>
        {value}
        <span className="text-xs font-normal text-zinc-500 ml-1">{unit}</span>
      </span>
    </div>
  );

  const StatRow = ({ label, value, highlight = false }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-zinc-900 last:border-0">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className={`text-xs font-mono font-semibold ${highlight ? "text-emerald-400" : "text-white"}`}>{value}</span>
    </div>
  );

  // If loading status checks
  if (agentLoading) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Synchronizing telemetric workspace...</p>
      </div>
    );
  }

  // If no connected agent, force setup onboarding
  if (!hasAgent) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans py-8">
        <AgentOnboarding onConnected={checkAgent} />
      </div>
    );
  }

  // 🔹 VIEW STATE: LIVE MONITORING TELEMETRY COCKPIT
  if (jobId && job) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Activity className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white leading-none">Test Telemetry Cockpit</h1>
                <p className="text-xs text-zinc-500 mt-1">Real-time load run metrics & local stdout monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="text-xs font-semibold px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-all">
                Dashboard
              </Link>
              <button
                onClick={() => setSearchParams({})}
                className="text-xs font-semibold px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all cursor-pointer"
              >
                Fire New Test
              </button>
            </div>
          </div>

          {/* Job Overview Status Banner */}
          <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${getStatusBg(job.status)}`}>
            <div className="flex items-start gap-3 min-w-0">
              <Clock className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-0.5">{job.name}</p>
                <p className="text-sm font-mono font-medium text-zinc-300 truncate max-w-sm sm:max-w-xl">
                  {job.method} {job.url}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 self-end sm:self-auto shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5 font-sans">Run Status</span>
                <span className={`text-sm font-bold tracking-wider uppercase font-mono ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              {/* Live interrupt cancel button */}
              {(job.status === "queued" || job.status === "running") && (
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="bg-red-950/40 hover:bg-red-600/20 border border-red-500/30 hover:border-red-500/60 text-red-400 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {cancelLoading ? "Interrupting..." : "Cancel Test"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Live Metrics Columns */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* LATENCY SUMMARY */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Response Times Latency
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <MetricCard label="Avg" value={formatNumber(job.avgResponseTime)} unit="ms" accent />
                  <MetricCard label="P90" value={formatNumber(job.p90ResponseTime)} unit="ms" />
                  <MetricCard label="P95" value={formatNumber(job.p95ResponseTime)} unit="ms" />
                  <MetricCard label="Min" value={formatNumber(job.minResponseTime)} unit="ms" />
                  <MetricCard label="Max" value={formatNumber(job.maxResponseTime)} unit="ms" />
                </div>
              </div>

              {/* REQUESTS + NETWORK */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    Request Statistics
                  </p>
                  <StatRow label="Total Fired" value={job.totalRequests} />
                  <StatRow label="Successful OK" value={job.successRequests} highlight />
                  <StatRow label="Failed Error" value={job.failedRequests} />
                  <StatRow label="Failure Rate" value={`${formatNumber(job.failureRate)}%`} />
                </div>

                <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    Network Metrics
                  </p>
                  <StatRow label="Data Received" value={`${(job.dataReceived / 1024).toFixed(2)} KB`} />
                  <StatRow label="Data Sent" value={`${(job.dataSent / 1024).toFixed(2)} KB`} />
                  <StatRow label="Simulated VUs" value={job.vus} />
                  <StatRow label="Duration Spec" value={job.duration} />
                </div>
              </div>

              {/* TIMINGS BREAKDOWN */}
              <div className="rounded-2xl border border-zinc-900 bg-zinc-900/30 p-4">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  Connection Timing Breakdown (Avg)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
                  {[
                    { label: "Waiting (TTFB)", value: job.waitingTime },
                    { label: "Sending",        value: job.sendingTime },
                    { label: "Receiving",      value: job.receivingTime },
                    { label: "Blocked Delay",  value: job.blockedTime },
                    { label: "Connecting",     value: job.connectingTime },
                    { label: "TLS Handshake",  value: job.tlsTime },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2.5 border-b border-zinc-900/50 last:border-0 px-1">
                      <span className="text-xs text-zinc-400">{label}</span>
                      <span className="text-xs font-mono text-zinc-200 font-semibold">
                        {formatNumber(value)} ms
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Terminal Log Stream Console */}
            <div className="lg:col-span-2 flex flex-col min-h-[350px] lg:h-[480px]">
              <div className="bg-zinc-900/50 border border-zinc-900 rounded-2xl flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-3 bg-zinc-950 border-b border-zinc-900 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-xs font-bold font-mono tracking-wide text-zinc-400">agent_stdout.log</span>
                  </div>
                  {pollingActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>

                <div className="flex-1 bg-zinc-950 p-4 overflow-y-auto font-mono text-[10px] sm:text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap select-text">
                  {job.logs ? (
                    job.logs
                  ) : (
                    <span className="text-zinc-600 italic">Waiting for terminal stream...</span>
                  )}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>

          </div>

          {/* AI Suggestions Card */}
          {["completed", "failed"].includes(job.status) && (
            <div className="relative rounded-2xl border border-zinc-900 bg-zinc-900/10 overflow-hidden p-5 space-y-4">
              
              {/* Premium Glow effect */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 blur-3xl rounded-full -mr-12 -mt-12 pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-900/80 pb-3 relative">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-none">Neural Performance Audit</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Free LLM-driven performance review & suggestions</p>
                  </div>
                </div>
                
                {aiSuggestions && !aiLoading && (
                  <button
                    onClick={() => fetchAISuggestions(jobId, true)}
                    className="flex items-center gap-1 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/20 hover:border-purple-500/40 text-[10px] font-bold text-purple-400 py-1.5 px-3 rounded-lg transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate suggestions
                  </button>
                )}
              </div>

              {/* Body / Content */}
              <div className="relative min-h-[60px] flex flex-col justify-center">
                {aiLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
                    <span className="text-xs text-zinc-500 font-mono">Consulting LLM performance diagnostics...</span>
                  </div>
                ) : aiError ? (
                  <div className="py-4 flex flex-col items-center justify-center gap-2 text-zinc-500">
                    <AlertCircle className="w-6 h-6 text-zinc-600" />
                    <span className="text-xs">{aiError}</span>
                    <button
                      onClick={() => fetchAISuggestions(jobId, true)}
                      className="mt-2 text-xs font-semibold px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg transition-all"
                    >
                      Generate Analysis
                    </button>
                  </div>
                ) : aiSuggestions ? (
                  <div className="space-y-2 pt-1">
                    {renderMarkdown(aiSuggestions)}
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center gap-2 text-zinc-500">
                    <Brain className="w-6 h-6 text-zinc-600 animate-pulse" />
                    <span className="text-xs">No analysis has been triggered for this test run.</span>
                    <button
                      onClick={() => fetchAISuggestions(jobId, false)}
                      className="mt-2 text-[10px] font-bold uppercase tracking-wider px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all cursor-pointer animate-pulse"
                    >
                      Audit Telemetry Run
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error Banner */}
          {job.error && (
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex gap-3 text-xs text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <div>
                <p className="font-bold">Test Execution Interrupted</p>
                <p className="mt-1 font-mono">{job.error}</p>
              </div>
            </div>
          )}

          {/* Run Metadata Details */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 px-4 py-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <div>WORKSPACE_ID: <span className="text-zinc-400">{job._id}</span></div>
            <span>Triggered: {new Date(job.createdAt).toLocaleString()}</span>
          </div>

        </div>
      </div>
    );
  }

  // 🔹 VIEW STATE: FORM CONFIGURATION INTERFACE
  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Load Test Configurator</h1>
            <p className="text-xs text-zinc-500 mt-1">Configure and queue performance runs triggered locally by your agent</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleRunTest} className="space-y-6">
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 space-y-4">
            
            {/* Test Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Test name</label>
              <input
                name="name"
                placeholder="e.g. Users List Load Query"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all"
              />
            </div>

            {/* Target Endpoint URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Target Endpoint URL</label>
              <input
                name="url"
                placeholder="http://localhost:5000/api/users"
                value={form.url}
                onChange={handleChange}
                required
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* HTTP Method selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">HTTP Method</label>
                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-all font-mono"
                >
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* VUs */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Virtual Users (VUs)</label>
                <input
                  name="vus"
                  type="number"
                  min="1"
                  max="100"
                  value={form.vus}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-all font-mono"
                />
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Duration spec</label>
                <input
                  name="duration"
                  placeholder="30s"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-600 transition-all font-mono"
                />
              </div>

            </div>

          </div>

          {/* 🔹 ADVANCED COLLAPSIBLE DRAWER OPTIONS */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-4 flex justify-between items-center bg-zinc-900/40 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Advanced Parameters Metrics</span>
              </div>
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvanced && (
              <div className="p-5 border-t border-zinc-900 space-y-4 bg-zinc-900/10">
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Expected Status */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase">Expected Status</label>
                    <input
                      name="expectedStatus"
                      type="number"
                      value={form.expectedStatus}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  {/* Max response Time */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase">Max Response Time (ms)</label>
                    <input
                      name="maxResponseTimeMs"
                      type="number"
                      value={form.maxResponseTimeMs}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  {/* Sleep Seconds */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase">Sleep Delay (s)</label>
                    <input
                      name="sleepSeconds"
                      type="number"
                      step="0.1"
                      value={form.sleepSeconds}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>

                  {/* Timeout */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase">Request Timeout</label>
                    <input
                      name="timeout"
                      value={form.timeout}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                    />
                  </div>
                </div>

                {/* Headers Map text JSON */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase">Custom Headers (JSON)</label>
                  <textarea
                    name="headersText"
                    rows="3"
                    value={form.headersText}
                    onChange={handleChange}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono whitespace-pre"
                  />
                </div>

                {/* Body text JSON (Disabled for GETs) */}
                {form.method !== "GET" && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-500 uppercase">Request Payload Body (JSON)</label>
                    <textarea
                      name="bodyText"
                      rows="4"
                      value={form.bodyText}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono whitespace-pre"
                    />
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3 px-4 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-[0.98] shadow-lg shadow-red-900/10 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Queuing job in agent stream...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Dispatch Load Test Run</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}