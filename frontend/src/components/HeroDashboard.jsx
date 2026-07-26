import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Play, RefreshCw, Terminal, Cpu, Zap, Activity, Code2 } from 'lucide-react';
import Sparkline from './Sparkline';
import { NumberTicker } from './ui/number-ticker';
import { BorderBeam } from './ui/border-beam';
import { MotionTabs } from './ui/tabs';

const RT_DATA  = [42, 55, 48, 70, 65, 88, 75, 120, 95, 108, 130, 115, 142, 128, 160];
const BAR_DATA = [30, 48, 42, 60, 55, 70, 65, 80, 72, 85, 78, 88];

export default function HeroDashboard() {
  const [activeTab, setActiveTab] = useState('live-metrics');
  const [isExecuting, setIsExecuting] = useState(false);

  const handleSimulateRun = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 2500);
  };

  return (
    <div className="relative bg-zinc-950/90 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
      <BorderBeam size={320} duration={12} colorFrom="#ef4444" colorTo="#dc2626" />

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <span className="pulse-red-dot inline-block" />
            <span className="font-mono text-xs text-zinc-300 font-semibold">k6 run — prod-load-test-v4</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <MotionTabs
            tabs={[
              { id: 'live-metrics', label: 'Live Telemetry', icon: <Activity className="w-3.5 h-3.5" /> },
              { id: 'script-editor', label: 'k6 Script', icon: <Code2 className="w-3.5 h-3.5" />, badge: 'JS' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="py-1 px-1 scale-90 md:scale-100"
          />

          <button
            onClick={handleSimulateRun}
            disabled={isExecuting}
            className="btn-red py-1.5 px-3 text-xs rounded-lg flex items-center gap-1.5 font-mono cursor-pointer shadow-lg"
          >
            {isExecuting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            {isExecuting ? 'Running...' : 'Run Test'}
          </button>
        </div>
      </div>

      {activeTab === 'live-metrics' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          {/* Key Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-black/60 border border-white/10 rounded-xl p-3">
              <span className="text-[10px] font-mono text-zinc-400 block mb-1">P95 Response</span>
              <div className="text-xl font-mono font-bold text-white leading-none">
                <NumberTicker value={142} suffix="ms" />
              </div>
              <span className="text-[10px] font-mono text-red-400 block mt-1">↑ +18ms (spike)</span>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-3">
              <span className="text-[10px] font-mono text-zinc-400 block mb-1">Throughput</span>
              <div className="text-xl font-mono font-bold text-white leading-none">
                <NumberTicker value={1842} suffix=" RPS" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block mt-1">↑ +12% scaling</span>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-3">
              <span className="text-[10px] font-mono text-zinc-400 block mb-1">Error Rate</span>
              <div className="text-xl font-mono font-bold text-white leading-none">
                <NumberTicker value={2.4} decimalPlaces={1} suffix="%" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 block mt-1">↓ -0.3% low</span>
            </div>
          </div>

          {/* Response Time Chart */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono text-zinc-300 font-medium flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-red-500" /> Latency Telemetry Curve
              </span>
              <span className="font-mono text-[10px] text-zinc-500">interval: 60s</span>
            </div>
            <Sparkline data={RT_DATA} color="#ef4444" height={48} />
            <div className="flex justify-between mt-1">
              <span className="font-mono text-[9px] text-zinc-500">0s</span>
              <span className="font-mono text-[9px] text-zinc-500">30s</span>
              <span className="font-mono text-[9px] text-zinc-500">60s</span>
            </div>
          </div>

          {/* VU Bars */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-3">
            <div className="text-xs font-mono text-zinc-300 mb-2">Concurrent Virtual Users (0 - 5,000 VUs)</div>
            <div className="flex items-end gap-1.5 h-10">
              {BAR_DATA.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${v}%`,
                    background: `linear-gradient(180deg, rgba(239, 68, 68, 0.8), rgba(239, 68, 68, 0.2))`,
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* AI Root Cause Card */}
          <div className="bg-gradient-to-r from-red-950/40 via-red-900/20 to-black border border-red-500/30 rounded-xl p-3.5 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-red-400" />
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">AI Root Cause Analysis</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Latency spike detected at <span className="text-amber-400 font-mono font-semibold">500+ VUs</span>.
              Diagnosis: <span className="text-white font-semibold">Database Connection Pool Saturation</span> (PostgreSQL 15 connections maxed).
            </p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-black border border-white/10 rounded-xl p-4 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto"
        >
          <div className="flex items-center gap-2 text-zinc-500 mb-3 pb-2 border-b border-white/10 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-red-500" />
            <span>script.js</span>
          </div>
          <pre className="text-zinc-300">
            <span className="text-red-400">import</span> http <span className="text-red-400">from</span> <span className="text-emerald-400">'k6/http'</span>;{"\n"}
            <span className="text-red-400">import</span> &#123; check, sleep &#125; <span className="text-red-400">from</span> <span className="text-emerald-400">'k6'</span>;{"\n\n"}
            <span className="text-red-400">export const</span> options = &#123;{"\n"}
            {"  "}stages: [{"\n"}
            {"    "}&#123; duration: <span className="text-amber-400">'30s'</span>, target: <span className="text-amber-400">500</span> &#125;, <span className="text-zinc-500">// ramp up</span>{"\n"}
            {"    "}&#123; duration: <span className="text-amber-400">'1m'</span>, target: <span className="text-amber-400">5000</span> &#125;, <span className="text-zinc-500">// peak stress</span>{"\n"}
            {"  "}],{"\n"}
            {"  "}thresholds: &#123; http_req_duration: [<span className="text-amber-400">'p(95)&lt;200'</span>] &#125;,{"\n"}
            &#125;;{"\n\n"}
            <span className="text-red-400">export default function</span> () &#123;{"\n"}
            {"  "}<span className="text-red-400">const</span> res = http.get(<span className="text-emerald-400">'https://api.k6lab.io/v1/auth'</span>);{"\n"}
            {"  "}check(res, &#123; <span className="text-amber-400">'status 200'</span>: (r) =&gt; r.status === <span className="text-amber-400">200</span> &#125;);{"\n"}
            {"  "}sleep(<span className="text-amber-400">1</span>);{"\n"}
            &#125;
          </pre>
        </motion.div>
      )}
    </div>
  );
}
