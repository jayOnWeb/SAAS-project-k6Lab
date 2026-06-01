import { useState, useEffect } from "react";
import { registerAgent, getAgentStatus } from "../services/testService";
import { Terminal, ShieldAlert, Cpu, CheckCircle2, Copy, Check, Play, RefreshCw } from "lucide-react";

export default function AgentOnboarding({ onConnected }) {
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [tokenCopied, setTokenCopied] = useState(false);
  
  const [agentName, setAgentName] = useState("My Laptop");
  const [agentData, setAgentData] = useState(null); // stores { agent, agentToken, commands }
  const [isPolling, setIsPolling] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Waiting for local agent heartbeat...");

  // Copy command to clipboard helper
  const handleCopyCommand = (command, index) => {
    navigator.clipboard.writeText(command);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Copy token to clipboard
  const handleCopyToken = () => {
    if (agentData?.agentToken) {
      navigator.clipboard.writeText(agentData.agentToken);
      setTokenCopied(true);
      setTimeout(() => setTokenCopied(false), 2000);
    }
  };

  // Create Agent and get token
  const handleCreateAgent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerAgent(agentName);
      if (res.success) {
        setAgentData(res);
        setIsPolling(true);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to create agent token");
    } finally {
      setLoading(false);
    }
  };

  // Polling for agent status
  useEffect(() => {
    let interval = null;
    if (isPolling && agentData) {
      interval = setInterval(async () => {
        try {
          const res = await getAgentStatus();
          if (res.success && res.hasAgent) {
            setStatusMessage("Agent detected! Connected successfully ✅");
            clearInterval(interval);
            setTimeout(() => {
              if (onConnected) onConnected();
            }, 1500);
          }
        } catch (err) {
          // silent check fails
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling, agentData, onConnected]);

  return (
    <div className="bg-zinc-950 text-white p-6 max-w-4xl mx-auto my-8 font-sans">
      
      {/* Onboarding Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-900/30 flex items-center justify-center mx-auto mb-4">
          <Cpu className="w-5 h-5 text-red-500 animate-pulse" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
          Connect Your Local K6 Lab Agent
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
          K6 Lab runs high-throughput API load tests directly from your own laptop. 
          This allows you to securely test local URLs like <code className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded font-mono text-xs">http://localhost:5000</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* Step 1: Create Credentials */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
              Step 1: Emit Agent Token
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate a unique, cryptographically secure token. The backend only stores a secure hash.
            </p>
            
            {!agentData ? (
              <form onSubmit={handleCreateAgent} className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase">
                    Device/Agent Name
                  </label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    required
                    placeholder="e.g. Work MacBook Pro"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/20 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer active:scale-98 flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/15"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Generate Agent Token"
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-3.5 pt-2">
                <div className="bg-emerald-950/10 border border-emerald-900/30 rounded-xl p-3 text-[11px] text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>Agent registered! Token emitted once.</span>
                </div>
                
                <div className="space-y-1.5">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                    Your One-Time Token
                  </span>
                  <div className="flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 font-mono text-[11px]">
                    <span className="truncate text-zinc-300 select-all flex-1">{agentData.agentToken}</span>
                    <button
                      onClick={handleCopyToken}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {tokenCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2 & Live Status Terminal */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-zinc-900/30 border border-zinc-900 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
              Step 2: Terminal Setup Instructions
            </h3>
            
            <div className="space-y-4">
              {/* MacOS/Linux tabs info */}
              <div className="space-y-2 text-xs text-zinc-400 leading-relaxed">
                <p>Run these commands inside your local project terminal:</p>
              </div>

              {/* Console commands list */}
              <div className="space-y-2">
                {[
                  {
                    num: "1",
                    cmd: "npm install -g /Users/jaykacha/Downloads/k6lab/agent",
                    desc: "Installs k6lab CLI from your local sandbox folder globally"
                  },
                  {
                    num: "2",
                    cmd: agentData ? `k6lab-agent login ${agentData.agentToken}` : "k6lab-agent login <your_agent_token>",
                    desc: "Authenticates and connects CLI locally to this workspace"
                  },
                  {
                    num: "3",
                    cmd: "k6lab-agent start",
                    desc: "Spawns background process monitoring queue jobs"
                  }
                ].map((step, idx) => (
                  <div key={idx} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-500 shrink-0 mt-0.5">
                          {step.num}
                        </span>
                        <code className="text-zinc-200 font-mono text-xs select-all break-all pr-2">
                          {step.cmd}
                        </code>
                      </div>
                      <button
                        onClick={() => handleCopyCommand(step.cmd, idx)}
                        className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-500 hover:text-white shrink-0 cursor-pointer transition-colors"
                      >
                        {copiedIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500 pl-7">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Heartbeat Status Indicator Console */}
            {isPolling && (
              <div className="border-t border-zinc-900/60 pt-4 space-y-2.5">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block">
                  Telemetric Heartbeat Console
                </span>
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3.5 flex items-center gap-3.5">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 truncate animate-pulse">
                    {statusMessage}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
