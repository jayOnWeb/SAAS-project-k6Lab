import { useEffect } from "react";
import useTests from "../hooks/useTests";
import { formatNumber } from "../utils/format";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Activity, TrendingUp, ShieldAlert, Database, HelpCircle } from "lucide-react";

export default function Analytics() {
  const { tests, loading, fetchTests } = useTests();

  useEffect(() => {
    fetchTests();
  }, []);

  // Format data for charts (sort oldest to newest for chronological plotting)
  const chartData = [...tests]
    .reverse()
    .slice(-10) // Limit to past 10 runs
    .map((test, index) => {
      const dateObj = new Date(test.createdAt);
      return {
        name: `Run #${tests.length - 9 + index}`,
        date: dateObj.toLocaleDateString(),
        url: test.url,
        avg: parseFloat(test.avgResponseTime.toFixed(2)),
        p90: parseFloat(test.p90ResponseTime.toFixed(2)),
        p95: parseFloat(test.p95ResponseTime.toFixed(2)),
        totalRequests: test.totalRequests,
        successRequests: test.successRequests,
        failedRequests: test.failedRequests,
        receivedKB: parseFloat((test.dataReceived / 1024).toFixed(2)),
        sentKB: parseFloat((test.dataSent / 1024).toFixed(2)),
      };
    });

  // Calculate high-level aggregates
  const totalRuns = tests.length;
  const criticalRuns = tests.filter((t) => t.healthStatus.includes("Critical")).length;
  const healthRatio = totalRuns > 0 ? ((totalRuns - criticalRuns) / totalRuns) * 100 : 100;
  const maxLatency = totalRuns > 0 ? Math.max(...tests.map((t) => t.maxResponseTime)) : 0;

  if (loading && tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 bg-zinc-950 text-white gap-4 font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-zinc-900 border-t-red-600 animate-spin" />
        <span className="text-sm text-zinc-500">Calculating historical analytics...</span>
      </div>
    );
  }

  // Custom tooltips matching modern dark aesthetic
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-xl backdrop-blur-md shadow-xl text-xs font-sans">
          <p className="font-bold text-white mb-2">{label}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="flex justify-between gap-6 py-0.5">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">{entry.value}</span>
            </div>
          ))}
          {payload[0]?.payload?.url && (
            <p className="text-[10px] text-zinc-500 font-mono mt-2 truncate max-w-[200px] border-t border-zinc-800/50 pt-1.5">
              {payload[0].payload.url}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-red-950/40 border border-red-900/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">
              Telemetry Analytics
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Trace chronological system behavior and degradation signals
            </p>
          </div>
        </div>

        {tests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-900 bg-zinc-950 flex flex-col items-center justify-center py-28 gap-3">
            <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800 text-zinc-700">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-zinc-400">Analytics ledger empty</p>
            <p className="text-xs text-zinc-600">Dispense k6 stress scripts to construct visual diagnostics</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Quick Aggregates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Workspace Health Index</span>
                <span className={`text-2xl font-bold font-mono tracking-tight mt-1.5 ${healthRatio >= 90 ? "text-emerald-400" : "text-amber-400"}`}>
                  {formatNumber(healthRatio)}%
                </span>
                <span className="text-[10px] text-zinc-600 mt-1">Non-critical test session ratio</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Max Response Spike</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-white mt-1.5">
                  {maxLatency > 0 ? `${formatNumber(maxLatency)}` : "—"}
                  <span className="text-xs text-zinc-500 ml-1">ms</span>
                </span>
                <span className="text-[10px] text-zinc-600 mt-1">Highest response duration recorded</span>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-900 p-5 rounded-2xl flex flex-col">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Chronological Runs Plotted</span>
                <span className="text-2xl font-bold font-mono tracking-tight text-white mt-1.5">
                  {chartData.length} <span className="text-xs text-zinc-500 font-normal">/ {tests.length} total</span>
                </span>
                <span className="text-[10px] text-zinc-600 mt-1">Telemetry window limits</span>
              </div>
            </div>

            {/* CHART 1: Response Times (Area Chart) */}
            <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Latency Performance Envelope (ms)</h3>
                <p className="text-[11px] text-zinc-500">Compares Average, P90, and P95 responses across past test runs</p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                    <Area type="monotone" dataKey="avg" name="Avg Latency" stroke="#ef4444" strokeWidth={1.8} fillOpacity={1} fill="url(#colorAvg)" />
                    <Area type="monotone" dataKey="p90" name="P90 Latency" stroke="#f59e0b" strokeWidth={1.5} fillOpacity={1} fill="url(#colorP90)" />
                    <Area type="monotone" dataKey="p95" name="P95 Latency" stroke="#3b82f6" strokeWidth={1.2} fillOpacity={0} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CHARTS 2 & 3 Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Stacked Requests (Bar Chart) */}
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Requests Volume Success vs Errors</h3>
                  <p className="text-[11px] text-zinc-500">Visualizes HTTP requests throughput success envelope</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Bar dataKey="successRequests" name="Success Requests" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="failedRequests" name="Failed Requests" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Transfer KB (Line Chart) */}
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Data Throughput (KB)</h3>
                  <p className="text-[11px] text-zinc-500">Chronological bytes transfer speed envelope</p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                      <Line type="monotone" dataKey="receivedKB" name="Bytes Received" stroke="#ef4444" strokeWidth={1.8} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="sentKB" name="Bytes Sent" stroke="#f59e0b" strokeWidth={1.2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}