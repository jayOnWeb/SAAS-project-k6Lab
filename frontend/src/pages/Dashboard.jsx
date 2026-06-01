import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useTests from "../hooks/useTests";
import { formatNumber } from "../utils/format";
import { getAgentStatus } from "../services/testService";
import AgentOnboarding from "../components/AgentOnboarding";
import { Activity, Play, Calendar, Zap, AlertCircle, CheckCircle2, Shield, Cpu } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { tests, loading: testsLoading, fetchTests } = useTests();
  const [stats, setStats] = useState({
    avgLatency: 0,
    successRate: 0,
    totalRequests: 0,
    failedRequests: 0,
  });

  const [agentLoading, setAgentLoading] = useState(true);
  const [hasAgent, setHasAgent] = useState(false);
  const [activeAgent, setActiveAgent] = useState(null);

  // Check agent status
  const checkAgent = async () => {
    try {
      setAgentLoading(true);
      const res = await getAgentStatus();
      if (res.success) {
        setHasAgent(res.hasAgent);
        setActiveAgent(res.activeAgent);
      }
    } catch (err) {
      console.error("Failed to fetch agent status:", err);
    } finally {
      setAgentLoading(false);
    }
  };

  useEffect(() => {
    checkAgent();
  }, []);

  useEffect(() => {
    if (hasAgent) {
      fetchTests();
    }
  }, [hasAgent]);

  useEffect(() => {
    if (tests && tests.length > 0) {
      let totalLatency = 0;
      let totalRequests = 0;
      let totalSuccess = 0;
      let totalFailed = 0;

      tests.forEach((test) => {
        totalLatency += test.avgResponseTime || 0;
        totalRequests += test.totalRequests || 0;
        totalSuccess += test.successRequests || 0;
        totalFailed += test.failedRequests || 0;
      });

      const avgLatency = totalLatency / tests.length;
      const successRate = totalRequests > 0 ? (totalSuccess / totalRequests) * 100 : 0;

      setStats({
        avgLatency,
        successRate,
        totalRequests,
        failedRequests: totalFailed,
      });
    } else {
      setStats({
        avgLatency: 0,
        successRate: 0,
        totalRequests: 0,
        failedRequests: 0,
      });
    }
  }, [tests]);

  if (agentLoading) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Validating workspace credentials...</p>
      </div>
    );
  }

  if (!hasAgent) {
    return (
      <div className="bg-zinc-950 text-white min-h-screen font-sans py-8">
        <AgentOnboarding onConnected={checkAgent} />
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || "Developer"}
            </h1>
            <p className="text-zinc-500 text-sm mt-0.5">
              Platform dashboard representing stress telemetry from your load tests
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Agent Live Widget */}
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-zinc-400">Agent: </span>
              <span className="text-white font-semibold">{activeAgent?.name || "Online Device"}</span>
            </div>

            <Link
              to="/dashboard/run-test"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer shadow-lg shadow-red-900/10 border border-red-500/20"
            >
              <Play className="w-4 h-4 fill-white" />
              Fire New Load Test
            </Link>
          </div>
        </div>

        {testsLoading && tests.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-red-500 animate-spin" />
            <p className="text-zinc-500 text-sm">Collating server diagnostics...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1 */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-4 top-4 text-zinc-800"><Activity className="w-8 h-8" /></div>
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Total Tests</span>
                <span className="text-3xl font-bold font-mono tracking-tight text-white mt-1">
                  {tests.length}
                </span>
                <span className="text-zinc-600 text-xs mt-1">Runs triggered in sandbox</span>
              </div>

              {/* Stat 2 */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-4 top-4 text-zinc-800"><Zap className="w-8 h-8" /></div>
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Avg Latency</span>
                <span className="text-3xl font-bold font-mono tracking-tight text-white mt-1">
                  {stats.avgLatency > 0 ? `${formatNumber(stats.avgLatency)}` : "—"}
                  {stats.avgLatency > 0 && <span className="text-sm font-normal text-zinc-500 ml-1">ms</span>}
                </span>
                <span className="text-zinc-600 text-xs mt-1">Weighted latency aggregate</span>
              </div>

              {/* Stat 3 */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-4 top-4 text-zinc-800">
                  {stats.successRate >= 95 ? (
                    <CheckCircle2 className="w-8 h-8 text-green-950/20" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-amber-950/20" />
                  )}
                </div>
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">Success Rate</span>
                <span className={`text-3xl font-bold font-mono tracking-tight mt-1 ${stats.successRate >= 95 ? "text-green-400" : stats.successRate > 0 ? "text-amber-400" : "text-white"}`}>
                  {stats.successRate > 0 ? `${formatNumber(stats.successRate)}%` : "—"}
                </span>
                <span className="text-zinc-600 text-xs mt-1">HTTP ok response ratio</span>
              </div>

              {/* Stat 4 */}
              <div className="bg-zinc-900/40 border border-zinc-900 p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
                <div className="absolute right-4 top-4 text-zinc-800"><Shield className="w-8 h-8" /></div>
                <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">HTTP Requests</span>
                <span className="text-3xl font-bold font-mono tracking-tight text-white mt-1">
                  {stats.totalRequests > 0 ? stats.totalRequests.toLocaleString() : "—"}
                </span>
                <span className="text-zinc-600 text-xs mt-1">Total requests fired globally</span>
              </div>

            </div>

            {/* Quick dashboard section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Recent Tests */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-semibold text-white">Recent Load Runs</h3>
                  <Link to="/dashboard/history" className="text-xs text-red-500 hover:text-red-400 font-semibold hover:underline">
                    View all history
                  </Link>
                </div>

                {tests.length === 0 ? (
                  <div className="bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 border border-zinc-800">
                      <Zap className="w-5 h-5" />
                    </div>
                    <p className="text-zinc-400 text-sm font-medium">No load telemetry recorded</p>
                    <p className="text-zinc-600 text-xs max-w-xs">Register your target API, select VUs and duration, and fire a test run to populate metrics</p>
                    <Link
                      to="/dashboard/run-test"
                      className="mt-2 text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 px-4 py-2 rounded-xl transition-colors duration-150"
                    >
                      Fire First Test
                    </Link>
                  </div>
                ) : (
                  <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl divide-y divide-zinc-900 overflow-hidden">
                    {tests.slice(0, 5).map((test) => (
                      <Link
                        key={test._id}
                        to={`/dashboard/run-test?jobId=${test._id}`}
                        className="p-4 flex items-center justify-between hover:bg-zinc-900/40 transition-all duration-150 flex-wrap sm:flex-nowrap gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-wider shrink-0 ${
                            test.method === "GET"
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                          }`}>
                            {test.method}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-mono text-zinc-200 truncate">{test.url}</p>
                            <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-0.5">
                              <Calendar className="w-3 h-3 text-zinc-600" />
                              {new Date(test.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 shrink-0 ml-auto sm:ml-0">
                          <div className="text-right">
                            <p className="text-xs font-mono font-medium text-white">{formatNumber(test.avgResponseTime)} ms</p>
                            <p className="text-[10px] text-zinc-500 mt-0.5">avg response</p>
                          </div>
                          
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            test.status === "completed"
                              ? test.healthStatus.includes("Healthy")
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : test.healthStatus.includes("Slow")
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          }`}>
                            {test.status === "completed" ? test.healthStatus.split(" ")[0] : test.status.toUpperCase()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Platform Diagnostics / AI Insights */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-white">Neural Telemetry</h3>
                <div className="bg-gradient-to-br from-zinc-900/60 to-zinc-950 border border-zinc-900 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2.5 text-red-500">
                    <Shield className="w-5 h-5 text-red-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-red-500">Local Sandbox Mode</span>
                  </div>
                  
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Welcome to your private sandboxed load-testing control room. The K6 Lab Agent is currently connected and waiting for job dispatches on your machine.
                  </p>

                  <div className="border-t border-zinc-900 pt-4 space-y-3">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Quick Sandbox Specs</span>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-zinc-400">
                      <div>VUs Limit: <span className="text-white font-bold">100</span></div>
                      <div>Max Duration: <span className="text-white font-bold">10m</span></div>
                      <div>Engine: <span className="text-red-500 font-bold">k6 Native</span></div>
                      <div>DB Storage: <span className="text-white font-bold">Isolated</span></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}