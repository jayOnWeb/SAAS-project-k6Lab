import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { runTest, getTestById, cancelTest, getAgentStatus, getAISuggestions, askAIChat } from "../services/testService";
import { getProjects, getFoldersByProject } from "../services/projectService";
import { formatNumber } from "../utils/format";
import AgentOnboarding from "../components/AgentOnboarding";
import {
  Activity, Play, CheckCircle2, AlertTriangle, Shield,
  Settings, Terminal, AlertCircle, RefreshCw, XCircle, Info, ChevronDown, ChevronUp, Clock, Sparkles, Brain, Key, Folder, Layers, Lock, Code, Cpu,
  MessageSquare, Send, Copy, Check, HelpCircle, Zap
} from "lucide-react";

export default function RunTest() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("jobId");
  const initialProjectId = searchParams.get("projectId") || "";
  const initialFolderId = searchParams.get("folderId") || "";

  const renderMarkdown = (text) => {
    if (!text) return null;

    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
      }
      parts.push({ type: "code", content: match[1].trim() });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return (
      <div className="space-y-3 font-sans">
        {parts.map((part, pIdx) => {
          if (part.type === "code") {
            return (
              <div key={pIdx} className="relative group my-3 rounded-xl border border-purple-900/40 bg-zinc-950/90 p-3.5 font-mono text-[11px] text-purple-200 overflow-x-auto shadow-inner">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2 border-b border-zinc-900 pb-1.5 font-semibold tracking-wider uppercase">
                  <span>Code / Fix Snippet</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(part.content)}
                    className="text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3" /> Copy Snippet
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">{part.content}</pre>
              </div>
            );
          }

          return part.content.split("\n").map((line, lIdx) => {
            const clean = line.trim();
            if (!clean) return <div key={lIdx} className="h-1" />;

            const formatInline = (str) => {
              const elements = [];
              const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
              let last = 0;
              let m;
              while ((m = regex.exec(str)) !== null) {
                if (m.index > last) elements.push(str.substring(last, m.index));
                const token = m[0];
                if (token.startsWith("**") && token.endsWith("**")) {
                  elements.push(<strong key={m.index} className="font-bold text-white">{token.slice(2, -2)}</strong>);
                } else if (token.startsWith("`") && token.endsWith("`")) {
                  elements.push(<code key={m.index} className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-800/40 text-purple-300 font-mono text-[11px]">{token.slice(1, -1)}</code>);
                }
                last = m.index + token.length;
              }
              if (last < str.length) elements.push(str.substring(last));
              return elements;
            };

            if (clean.startsWith("###")) {
              return <h4 key={lIdx} className="text-xs font-bold text-purple-300 tracking-wide uppercase mt-4 mb-1.5 flex items-center gap-1.5">{formatInline(clean.replace(/^###\s*/, ""))}</h4>;
            }
            if (clean.startsWith("##")) {
              return <h3 key={lIdx} className="text-sm font-bold text-purple-200 mt-5 mb-2 pb-1 border-b border-purple-900/30 flex items-center gap-2">{formatInline(clean.replace(/^##\s*/, ""))}</h3>;
            }
            if (clean.startsWith("#")) {
              return <h2 key={lIdx} className="text-base font-extrabold text-white mt-6 mb-3">{formatInline(clean.replace(/^#\s*/, ""))}</h2>;
            }
            if (clean.startsWith("-") || clean.startsWith("*")) {
              return (
                <div key={lIdx} className="flex items-start gap-2.5 text-xs text-zinc-300 my-1 pl-1">
                  <span className="text-purple-400 font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{formatInline(clean.replace(/^[-*]\s*/, ""))}</span>
                </div>
              );
            }
            if (/^\d+\./.test(clean)) {
              const num = clean.match(/^\d+/)[0];
              const rest = clean.replace(/^\d+\.\s*/, "");
              return (
                <div key={lIdx} className="flex items-start gap-2 text-xs text-zinc-300 my-1.5 pl-1">
                  <span className="text-purple-400 font-bold shrink-0 bg-purple-950/40 border border-purple-800/30 text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center mt-0.5">{num}</span>
                  <span className="leading-relaxed">{formatInline(rest)}</span>
                </div>
              );
            }

            return <p key={lIdx} className="text-xs text-zinc-300 leading-relaxed my-1">{formatInline(clean)}</p>;
          });
        })}
      </div>
    );
  };


  const [agentLoading, setAgentLoading] = useState(true);
  const [hasAgent, setHasAgent] = useState(false);

  // Projects & Folders state
  const [projects, setProjects] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [selectedFolderId, setSelectedFolderId] = useState(initialFolderId);

  // Form State
  const [form, setForm] = useState({
    name: "",
    url: "",
    method: "GET",
    vus: 5,
    duration: "10s",
    bearerToken: "",
    expectedStatus: 200,
    maxResponseTimeMs: 1000,
    sleepSeconds: 1,
    timeout: "30s",
    headersText: "{\n  \"Content-Type\": \"application/json\"\n}",
    bodyText: "{\n  \"email\": \"test@example.com\"\n}",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState("auth"); // 'auth', 'headers', 'body', 'slas', 'pacing'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live Telemetry Monitoring State
  const [job, setJob] = useState(null);
  const [pollingActive, setPollingActive] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  // AI Suggestions & Interactive Chat State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState("");
  const [aiError, setAiError] = useState("");
  const [copiedAi, setCopiedAi] = useState(false);

  // Mode: 'audit' | 'chat'
  const [aiMode, setAiMode] = useState("audit");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  const handleCopyAudit = () => {
    if (!aiSuggestions) return;
    navigator.clipboard.writeText(aiSuggestions);
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 2000);
  };

  const handleSendChat = async (promptText) => {
    const q = promptText || chatInput;
    const targetId = jobId || job?._id;
    if (!q || !q.trim() || chatLoading || !targetId) return;

    const userMsg = { role: "user", content: q.trim() };
    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await askAIChat(targetId, q.trim(), chatMessages);
      if (res.success && res.answer) {
        setChatMessages([...updatedHistory, { role: "assistant", content: res.answer }]);
      } else {
        setChatMessages([
          ...updatedHistory,
          { role: "assistant", content: `❌ Error: ${res.error || "Failed to fetch answer from OpenRouter."}` },
        ]);
      }
    } catch (err) {
      setChatMessages([
        ...updatedHistory,
        { role: "assistant", content: `❌ Error: ${err.response?.data?.error || err.message || "Failed to connect to AI engine."}` },
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // Load Projects on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await getProjects();
        if (res.success) {
          setProjects(res.data || []);
        }
      } catch (err) {
        console.error("Failed to load user projects:", err);
      }
    }
    loadProjects();
  }, []);

  // Fetch Folders when Project selected
  useEffect(() => {
    async function loadFolders() {
      if (!selectedProjectId) {
        setFolders([]);
        setSelectedFolderId("");
        return;
      }
      try {
        const res = await getFoldersByProject(selectedProjectId);
        if (res.success) {
          setFolders(res.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch project folders:", err);
      }
    }
    loadFolders();
  }, [selectedProjectId]);

  // Check agent status
  const checkAgent = async (isInitial = false) => {
    try {
      if (isInitial) setAgentLoading(true);
      const res = await getAgentStatus();
      if (res.success) {
        setHasAgent(res.hasAgent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isInitial) setAgentLoading(false);
    }
  };

  const fetchAISuggestions = async (id, force = false) => {
    const targetId = id || jobId || job?._id;
    if (!targetId) {
      setAiError("No test job selected to analyze.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const res = await getAISuggestions(targetId, force);
      if (res.success) {
        setAiSuggestions(res.suggestions);
      } else {
        setAiError(res.error || "Failed to load AI suggestions.");
      }
    } catch (err) {
      setAiError(err.response?.data?.error || "AI engine currently offline. Please retry in a moment.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    checkAgent(true);
    const interval = setInterval(() => checkAgent(false), 5000);
    return () => clearInterval(interval);
  }, [jobId]);



  useEffect(() => {
    setAiSuggestions("");
    setAiError("");
    setAiLoading(false);
    setChatMessages([]);
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

  const logContainerRef = useRef(null);

  // Auto-scroll log console internally without scrolling main page
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
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

      let headers = {};
      if (form.headersText) {
        try {
          headers = JSON.parse(form.headersText);
        } catch (err) {
          setError("Invalid JSON format in Custom Headers field");
          setLoading(false);
          return;
        }
      }

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
        bearerToken: form.bearerToken,
        projectId: selectedProjectId || null,
        folderId: selectedFolderId || null,
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

  if (agentLoading) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Synchronizing telemetric workspace...</p>
      </div>
    );
  }

  // 🔹 VIEW STATE 1: LIVE MONITORING TELEMETRY COCKPIT (Always viewable for test details)
  if (jobId && job) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          
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
            <div className="lg:col-span-3 space-y-6">
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Response Times Latency</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MetricCard label="Average" value={formatNumber(job.avgResponseTime || 0)} unit="ms" accent />
                  <MetricCard label="P90 Latency" value={formatNumber(job.p90ResponseTime || 0)} unit="ms" />
                  <MetricCard label="P95 Latency" value={formatNumber(job.p95ResponseTime || 0)} unit="ms" />
                  <MetricCard label="Max Peak" value={formatNumber(job.maxResponseTime || 0)} unit="ms" />
                </div>
              </div>

              <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Throughput & Health Audit</span>
                  </div>
                  <span className={`text-[10px] font-bold font-mono px-2.5 py-1 rounded-md border ${job.failureRate === 0 ? "bg-emerald-950/40 border-emerald-900/50 text-emerald-400" : "bg-red-950/40 border-red-900/50 text-red-400"}`}>
                    SLA: {job.healthStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <div>
                    <StatRow label="Total Requests Dispatched" value={formatNumber(job.totalRequests || 0)} />
                    <StatRow label="Passed Requests" value={formatNumber(job.successRequests || 0)} highlight />
                    <StatRow label="Failed Requests" value={formatNumber(job.failedRequests || 0)} />
                  </div>
                  <div>
                    <StatRow label="Failure Error Rate" value={`${(job.failureRate || 0).toFixed(1)}%`} />
                    <StatRow label="Network Recv Payload" value={`${formatNumber((job.dataReceived || 0) / 1024)} KB`} />
                    <StatRow label="Network Sent Payload" value={`${formatNumber((job.dataSent || 0) / 1024)} KB`} />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
                <div className="bg-zinc-900/40 px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono font-bold text-zinc-300">Local Agent Standard Output</span>
                  </div>
                  {pollingActive && (
                    <div className="flex items-center gap-2 text-[10px] text-amber-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      Live Stream...
                    </div>
                  )}
                </div>
                <div ref={logContainerRef} className="p-4 font-mono text-xs text-zinc-300 h-64 overflow-y-auto bg-black/40 space-y-1">
                  {job.logs ? (
                    job.logs.split("\n").map((line, i) => (
                      <div key={i} className="leading-relaxed hover:bg-zinc-900/50 px-1 rounded transition-colors">
                        <span className="text-zinc-600 select-none mr-3">{i + 1}</span>
                        <span>{line}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-600 italic">Waiting for execution output from local agent runner...</p>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-b from-purple-950/20 to-zinc-950/80 border border-purple-900/30 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
                
                {/* Header & Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-900/30 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-700/40 flex items-center justify-center text-purple-400">
                      <Brain className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300">AI Performance Intelligence</h3>
                      <p className="text-[10px] text-purple-400/70 font-mono">OpenRouter Powered Engine</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-zinc-900/80 border border-purple-900/30 p-1 rounded-xl">
                    <button
                      onClick={() => setAiMode("audit")}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        aiMode === "audit" ? "bg-purple-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      Diagnostic Audit
                    </button>
                    <button
                      onClick={() => setAiMode("chat")}
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                        aiMode === "chat" ? "bg-purple-600 text-white shadow" : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      Ask AI Q&A
                      {chatMessages.length > 0 && (
                        <span className="bg-purple-400 text-black font-bold text-[9px] px-1 rounded-full">{chatMessages.length}</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* AUDIT TAB CONTENT */}
                {aiMode === "audit" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-950/50 border border-purple-800/40 px-2 py-0.5 rounded-md">
                          Deep Telemetry Mode
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {aiSuggestions && (
                          <button
                            onClick={handleCopyAudit}
                            className="text-[10px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                          >
                            {copiedAi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {copiedAi ? "Copied" : "Copy Report"}
                          </button>
                        )}
                        <button
                          onClick={() => fetchAISuggestions(job._id, true)}
                          disabled={aiLoading}
                          className="text-[10px] bg-purple-900/40 hover:bg-purple-900/70 border border-purple-700/40 text-purple-200 font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${aiLoading ? "animate-spin" : ""}`} />
                          {aiLoading ? "Analyzing..." : "Re-Analyze"}
                        </button>
                      </div>
                    </div>

                    {aiLoading ? (
                      <div className="py-12 text-center space-y-3 bg-purple-950/10 border border-purple-900/20 rounded-xl">
                        <RefreshCw className="w-7 h-7 animate-spin text-purple-400 mx-auto" />
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-purple-200">Synthesizing Telemetry Audit...</p>
                          <p className="text-[11px] text-purple-400/60 font-mono">Evaluating P95 latency, throughput limits & failure rates</p>
                        </div>
                      </div>
                    ) : aiError ? (
                      <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-4 rounded-xl space-y-1">
                        <p className="font-bold flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> AI Diagnosis Error</p>
                        <p className="font-mono text-[11px] opacity-80">{aiError}</p>
                      </div>
                    ) : aiSuggestions ? (
                      <div className="max-h-[520px] overflow-y-auto pr-1 space-y-3 custom-scrollbar text-xs">
                        {renderMarkdown(aiSuggestions)}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4 space-y-3 bg-purple-950/10 border border-purple-900/20 rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center mx-auto text-purple-400">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white">Generate Comprehensive Diagnostic Audit</h4>
                          <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">Get detailed root cause analysis, health scores, metric explanations, and architectural optimizations.</p>
                        </div>
                        <button
                          onClick={() => fetchAISuggestions(job._id)}
                          className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-lg cursor-pointer inline-flex items-center gap-2 active:scale-95"
                        >
                          <Sparkles className="w-4 h-4" />
                          Generate Performance Report
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* INTERACTIVE CHAT TAB CONTENT */}
                {aiMode === "chat" && (
                  <div className="space-y-3 flex flex-col h-[480px]">
                    
                    {/* Chat Messages Window */}
                    <div ref={chatScrollRef} className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar bg-black/40 border border-purple-900/20 rounded-xl p-3">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-8 px-4 space-y-3">
                          <div className="w-9 h-9 rounded-full bg-purple-900/30 border border-purple-700/40 flex items-center justify-center mx-auto text-purple-400">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-purple-200">Ask Anything About This Test Run</p>
                            <p className="text-[11px] text-zinc-400 max-w-xs mx-auto">Ask follow-up questions about latency spikes, database indexing, k6 scripts, or server configurations.</p>
                          </div>

                          {/* Quick Suggestion Chips */}
                          <div className="pt-2 flex flex-wrap justify-center gap-1.5 max-w-sm mx-auto">
                            {[
                              "How to fix latency spikes?",
                              "Give Node.js/Express fix snippet",
                              "Write k6 script for 50 VUs",
                              "Explain the p95 response time",
                            ].map((chip, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSendChat(chip)}
                                className="text-[10px] bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/40 text-purple-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer text-left"
                              >
                                💡 {chip}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        chatMessages.map((msg, mIdx) => (
                          <div key={mIdx} className={`flex gap-2 text-xs ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                            {msg.role === "assistant" && (
                              <div className="w-6 h-6 rounded-md bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300 shrink-0 mt-1">
                                <Brain className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className={`max-w-[85%] p-3 rounded-2xl ${
                              msg.role === "user"
                                ? "bg-purple-600 text-white rounded-br-none shadow-md font-sans"
                                : "bg-zinc-900 border border-purple-900/30 text-zinc-200 rounded-bl-none shadow-inner"
                            }`}>
                              {msg.role === "user" ? (
                                <p className="text-xs leading-relaxed">{msg.content}</p>
                              ) : (
                                renderMarkdown(msg.content)
                              )}
                            </div>
                          </div>
                        ))
                      )}

                      {chatLoading && (
                        <div className="flex gap-2 justify-start items-center text-xs text-purple-300 font-mono py-2">
                          <div className="w-6 h-6 rounded-md bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300">
                            <Brain className="w-3.5 h-3.5 animate-spin" />
                          </div>
                          <span className="animate-pulse text-[11px]">Synthesizing response...</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Input Box */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChat();
                      }}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask AI follow-up question..."
                        disabled={chatLoading}
                        className="flex-1 bg-zinc-950 border border-purple-900/40 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={chatLoading || !chatInput.trim()}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white p-2 rounded-xl transition-all shadow-md cursor-pointer shrink-0 flex items-center justify-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

          </div>

          {job.error && (
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 flex gap-3 text-xs text-red-400">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <div>
                <p className="font-bold">Test Execution Interrupted</p>
                <p className="mt-1 font-mono">{job.error}</p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-zinc-900 bg-zinc-900/20 px-4 py-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <div>WORKSPACE_ID: <span className="text-zinc-400">{job._id}</span></div>
            <span>Triggered: {new Date(job.createdAt).toLocaleString()}</span>
          </div>

        </div>
      </div>
    );
  }

  // 🔹 VIEW STATE 2: AGENT ONBOARDING (Required to fire new load tests if no local runner agent is paired)
  if (!hasAgent) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans py-8">
        <AgentOnboarding onConnected={checkAgent} />
      </div>
    );
  }

  // 🔹 VIEW STATE 3: FORM CONFIGURATION INTERFACE
  return (

    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">API Load Test Configurator</h1>
              <p className="text-xs text-zinc-500 mt-1">Configure and fire stress tests across projects, folders, and authenticated endpoints</p>
            </div>
          </div>

          <Link
            to="/dashboard/projects"
            className="text-xs font-semibold px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-xl transition-all flex items-center gap-1.5"
          >
            <Folder className="w-3.5 h-3.5 text-zinc-400" />
            Workspace Projects
          </Link>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleRunTest} className="space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-5">
            
            {/* Project & Folder Assignment Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-zinc-900/80">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Folder className="w-3.5 h-3.5 text-red-500" />
                  Target Project
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 transition-all font-mono"
                >
                  <option value="">-- Standard Sandbox (No Project) --</option>
                  {projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      📁 {proj.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-500" />
                  Folder / Module
                </label>
                <select
                  value={selectedFolderId}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  disabled={!selectedProjectId}
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 transition-all font-mono disabled:opacity-40"
                >
                  <option value="">-- Project Root --</option>
                  {folders.map((fold) => (
                    <option key={fold._id} value={fold._id}>
                      📂 {fold.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Test Label */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400">Test Execution Label</label>
              <input
                name="name"
                placeholder="e.g. Auth Login SLA Audit / Checkout Load"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all"
              />
            </div>

            {/* Endpoint Method + URL */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-400">HTTP Method &amp; Target Endpoint URL</label>
                <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-500" /> Authorized Target Testing Only
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-3 text-sm text-amber-400 font-bold focus:outline-none focus:border-red-600 transition-all font-mono"
                >
                  {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  name="url"
                  placeholder="https://api.ecommerce.com/v1/auth/login"
                  value={form.url}
                  onChange={handleChange}
                  required
                  className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 pt-0.5">
                <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Notice: Ensure you own or have explicit authorization to load test public target endpoints.</span>
              </p>
            </div>

            {/* Load Profile VUs & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex justify-between items-center">
                  <span>Virtual Users (VUs) <span className="text-[10px] text-zinc-500 font-mono">(Max 500 Free)</span></span>
                  <div className="flex gap-1">
                    {[10, 50, 100, 500].map((v) => (
                      <button
                        type="button"
                        key={v}
                        onClick={() => setForm({ ...form, vus: v })}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono border ${form.vus === v ? "bg-red-600 border-red-500 text-white" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </label>
                <input
                  name="vus"
                  type="number"
                  min="1"
                  max="500"
                  value={form.vus}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-all font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 flex justify-between items-center">
                  <span>Duration Spec</span>
                  <div className="flex gap-1">
                    {["10s", "30s", "1m", "5m"].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => setForm({ ...form, duration: d })}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono border ${form.duration === d ? "bg-red-600 border-red-500 text-white" : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </label>
                <input
                  name="duration"
                  placeholder="30s"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* 🔑 Bearer Token Quick Field */}
            <div className="space-y-1.5 bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-900/80">
              <label className="text-xs font-semibold text-amber-400 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Bearer Token Authentication
                </span>
                <span className="text-[10px] text-zinc-500 font-mono font-normal">Auto-injects Authorization header</span>
              </label>
              <input
                name="bearerToken"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={form.bearerToken}
                onChange={handleChange}
                className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 placeholder:text-zinc-700 focus:outline-none focus:border-amber-500 font-mono truncate"
              />
            </div>

          </div>

          {/* 🔹 ADVANCED COLLAPSIBLE ACCORDION */}
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-5 py-4 flex justify-between items-center bg-zinc-900/40 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-red-500" />
                <span>Advanced Test Parameters & Accordion</span>
                {form.bearerToken && <span className="text-[10px] bg-amber-950/60 border border-amber-800/40 text-amber-400 px-2 py-0.5 rounded-md font-mono lowercase">bearer active</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 lowercase font-normal">{showAdvanced ? "click to hide" : "click to expand headers & SLAs"}</span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showAdvanced && (
              <div className="p-5 border-t border-zinc-900 space-y-4 bg-zinc-900/10">
                
                {/* Accordion Tabs */}
                <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-2">
                  {[
                    { id: "auth", label: "Authentication", icon: Lock },
                    { id: "headers", label: "Custom Headers", icon: Code },
                    { id: "body", label: "Request Body", icon: Terminal, disabled: form.method === "GET" },
                    { id: "slas", label: "SLAs & Thresholds", icon: Shield },
                    { id: "pacing", label: "Pacing & Timeouts", icon: Clock },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        type="button"
                        key={tab.id}
                        disabled={tab.disabled}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"} ${tab.disabled ? "opacity-30 cursor-not-allowed" : ""}`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab 1: Auth */}
                {activeTab === "auth" && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-zinc-400">Configure bearer tokens or header security tokens for protected endpoints.</p>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Bearer Token (JWT / OAuth2)</label>
                      <input
                        name="bearerToken"
                        placeholder="Bearer token string"
                        value={form.bearerToken}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3 text-xs text-emerald-400 focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 2: Headers */}
                {activeTab === "headers" && (
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-zinc-400">Enter custom HTTP Request Headers as a valid JSON object.</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, headersText: "{\n  \"Content-Type\": \"application/json\"\n}" })}
                          className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-2 py-1 rounded"
                        >
                          JSON Preset
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, headersText: "{\n  \"Content-Type\": \"application/x-www-form-urlencoded\"\n}" })}
                          className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-2 py-1 rounded"
                        >
                          Form Preset
                        </button>
                      </div>
                    </div>
                    <textarea
                      name="headersText"
                      rows="4"
                      value={form.headersText}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono whitespace-pre"
                    />
                  </div>
                )}

                {/* Tab 3: Request Body */}
                {activeTab === "body" && form.method !== "GET" && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-zinc-400">JSON payload dispatched with POST / PUT / PATCH requests.</p>
                    <textarea
                      name="bodyText"
                      rows="5"
                      value={form.bodyText}
                      onChange={handleChange}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono whitespace-pre"
                    />
                  </div>
                )}

                {/* Tab 4: SLAs & Thresholds */}
                {activeTab === "slas" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Expected HTTP Status Code</label>
                      <input
                        name="expectedStatus"
                        type="number"
                        value={form.expectedStatus}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Max Response Time SLA (ms)</label>
                      <input
                        name="maxResponseTimeMs"
                        type="number"
                        value={form.maxResponseTimeMs}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  </div>
                )}

                {/* Tab 5: Pacing & Timeout */}
                {activeTab === "pacing" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Sleep Delay per VU (s)</label>
                      <input
                        name="sleepSeconds"
                        type="number"
                        step="0.1"
                        value={form.sleepSeconds}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-400 uppercase">Request Timeout</label>
                      <input
                        name="timeout"
                        value={form.timeout}
                        onChange={handleChange}
                        className="w-full bg-zinc-950 border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 font-mono"
                      />
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-3.5 px-4 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 text-white cursor-pointer active:scale-[0.98] shadow-lg shadow-red-900/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Queuing job in agent stream...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Fire API Load Test Run</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}