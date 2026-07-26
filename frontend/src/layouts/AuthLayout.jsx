import { Link } from "react-router-dom";
import { Activity, ShieldCheck, Zap, BarChart3, Bot } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * AuthLayout - Shared split-screen layout for Login, Signup, and Register pages.
 * 
 * - Left Side: Brand presentation, slogan, performance facts, animated telemetry ticker,
 *   and a designated slot (#auth-effect-slot) for custom visual effect components.
 * - Right Side: Auth Form Container (Login, Signup, Register).
 */
export default function AuthLayout({ children }) {
  // Animated telemetry preview stats for high-tech aesthetic
  const [metrics, setMetrics] = useState({
    vus: 1250,
    rps: 4890,
    p95: 14.2,
    successRate: 99.98,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        vus: Math.floor(1200 + Math.random() * 120),
        rps: Math.floor(4800 + Math.random() * 250),
        p95: +(13.8 + Math.random() * 1.2).toFixed(1),
        successRate: +(99.95 + Math.random() * 0.04).toFixed(2),
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#030305] text-white flex flex-col lg:flex-row overflow-x-hidden font-sans relative">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-zinc-900/50 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-900/20 to-transparent pointer-events-none" />

      {/* ==================================================================== */}
      {/* LEFT COLUMN: k6lab Showcase & Slogans & Telemetry (Hidden on mobile or top block, 55% width on desktop) */}
      {/* ==================================================================== */}
      <div className="w-full lg:w-[55%] flex flex-col justify-between p-8 lg:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-zinc-800/60 relative z-10 bg-zinc-950/40 backdrop-blur-md">
        
        {/* Brand Header */}
        <div>
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-xl tracking-tight flex items-center gap-1.5">
                k6lab
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-semibold tracking-wider">
                  v2.0
                </span>
              </span>
              <span className="text-xs text-zinc-500 font-mono">Local-First Performance Engine</span>
            </div>
          </Link>

          {/* Slogan & Hero Copy */}
          <div className="mt-10 lg:mt-14 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/50 border border-red-500/30 text-red-400 text-xs font-mono tracking-wide uppercase font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Native k6 Load Testing Platform
            </div>

            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Stress Test Your APIs. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-rose-600">
                Understand Their Limits.
              </span>
            </h1>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
              Execute production-grade load scripts directly from your local hardware. Watch real-time telemetry streaming and get automated AI performance insights without cloud vendor lock-in.
            </p>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm hover:border-red-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-red-400" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">100% Data Privacy</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                Test traffic stays in your network. Secrets never touch external servers.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm hover:border-red-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4 text-red-400" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">Real-Time Telemetry</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                Sub-millisecond latency & HTTP throughput metrics streamed live.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm hover:border-red-500/30 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                <Bot className="w-4 h-4 text-red-400" />
              </div>
              <h4 className="text-xs font-semibold text-zinc-200">AI Root-Cause Audit</h4>
              <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                Instant AI breakdown on p95 spikes, bottleneck endpoints & failures.
              </p>
            </div>
          </div>
        </div>

        {/* Live Telemetry Animated Ticker */}
        <div className="mt-8">
          <div className="p-5 rounded-2xl bg-gradient-to-b from-zinc-900/70 to-zinc-950/90 border border-zinc-800/90 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                  Live Engine Telemetry Stream
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded">
                k6-local-agent #01
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/50">
                <div className="text-[10px] text-zinc-500 font-mono">ACTIVE VUs</div>
                <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">
                  {metrics.vus.toLocaleString()}
                </div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/50">
                <div className="text-[10px] text-zinc-500 font-mono">HTTP RPS</div>
                <div className="text-base sm:text-lg font-bold font-mono text-red-400 mt-0.5">
                  {metrics.rps.toLocaleString()}
                </div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/50">
                <div className="text-[10px] text-zinc-500 font-mono">p95 LATENCY</div>
                <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">
                  {metrics.p95} ms
                </div>
              </div>
              <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/50">
                <div className="text-[10px] text-zinc-500 font-mono">SUCCESS RATE</div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  {metrics.successRate}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* DESIGNATED EFFECT CONTAINER SLOT FOR USER'S CUSTOM EFFECT COMPONENT */}
        {/* ==================================================================== */}
        {/* 
          Note: You can pass your custom visual effect component directly into this container,
          or render it here when ready.
        */}
        <div id="auth-effect-slot" className="mt-6 relative z-20">
          <div className="w-full p-4 rounded-2xl bg-zinc-900/30 border border-dashed border-zinc-800 flex items-center justify-between text-xs text-zinc-400 hover:border-red-500/40 transition-colors">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-red-400" />
              <span>Visual Effect Slot — Ready for custom component</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              #auth-effect-slot
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-zinc-800/40 flex items-center justify-between text-xs text-zinc-500">
          <span>&copy; {new Date().getFullYear()} k6lab Engine. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
            <Link to="/platform" className="hover:text-zinc-300 transition-colors">Platform</Link>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* RIGHT COLUMN: Auth Form (Login / Signup / Register) */}
      {/* ==================================================================== */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-12 relative z-10 my-auto">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
