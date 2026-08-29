import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Database, 
  Server, 
  CheckCircle2, 
  Sliders, 
  Radio, 
  TrendingUp, 
  Layers
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Badge } from '../components/ui/badge';
import { BorderBeam } from '../components/ui/border-beam';
import SEO from '../components/SEO';

const SCENARIOS = [
  { id: 'baseline', label: '500 VUs Baseline', vus: 500, baseP95: 18, baseRPS: 920, color: '#10b981' },
  { id: 'peak', label: '5,000 VUs Peak', vus: 5000, baseP95: 48, baseRPS: 4600, color: '#f59e0b' },
  { id: 'extreme', label: '25,000 VUs Stress', vus: 25000, baseP95: 145, baseRPS: 12400, color: '#f43f5e' }
];

export default function PlatformPage() {
  const [scenario, setScenario] = useState('peak');
  const [isPlaying, setIsPlaying] = useState(true);
  const [totalRequests, setTotalRequests] = useState(14820);
  const [liveP95, setLiveP95] = useState(48.2);
  const [liveP90, setLiveP90] = useState(36.5);
  const [liveAvg, setLiveAvg] = useState(24.1);
  const [liveMin, setLiveMin] = useState(8.4);
  const [liveMax, setLiveMax] = useState(182.0);
  const [liveRPS, setLiveRPS] = useState(4620);
  const [errorCount, setErrorCount] = useState(0);
  const [isSpikeActive, setIsSpikeActive] = useState(false);

  // Dynamic Latency Chart Points (25 real-time continuous points)
  const [chartData, setChartData] = useState(() => 
    Array.from({ length: 24 }, (_, i) => ({
      val: 35 + Math.sin(i * 0.5) * 15 + Math.random() * 8,
      p90: 25 + Math.sin(i * 0.5) * 10 + Math.random() * 5
    }))
  );

  // Live Streaming Stdout Console Logs
  const [logs, setLogs] = useState([
    { id: 1, time: '14:32:01.120', text: 'k6 engine initialized on local daemon (PID: 4812)', code: 200, latency: '12ms' },
    { id: 2, time: '14:32:01.840', text: 'GET /api/v1/auth/session — token verified', code: 200, latency: '18ms' },
    { id: 3, time: '14:32:02.410', text: 'POST /api/v1/checkout — order payload processed', code: 200, latency: '34ms' },
    { id: 4, time: '14:32:03.020', text: 'GET /api/v1/telemetry/live — stream connected', code: 200, latency: '14ms' },
    { id: 5, time: '14:32:03.650', text: 'Check threshold: p(95) < 150ms [PASSED]', code: 200, latency: '28ms' }
  ]);

  const activeScenario = SCENARIOS.find((s) => s.id === scenario) || SCENARIOS[1];

  // Trigger Instant Latency Spike
  const triggerSpike = () => {
    setIsSpikeActive(true);
    setTimeout(() => setIsSpikeActive(false), 3000);
  };

  // Real-time live data engine
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const spikeMultiplier = isSpikeActive ? 2.8 : 1.0;
      const jitter = (Math.random() - 0.5) * 6;
      
      // Calculate dynamic telemetry
      const newP95 = Number((activeScenario.baseP95 * spikeMultiplier + jitter).toFixed(1));
      const newP90 = Number((newP95 * 0.78).toFixed(1));
      const newAvg = Number((newP95 * 0.55).toFixed(1));
      const newMax = Number((newP95 * 2.1).toFixed(1));
      const newRPS = Math.round(activeScenario.baseRPS * (isSpikeActive ? 1.4 : 1.0) + (Math.random() - 0.5) * 120);

      setLiveP95(newP95);
      setLiveP90(newP90);
      setLiveAvg(newAvg);
      setLiveMax(newMax);
      setLiveRPS(newRPS);
      setTotalRequests((prev) => prev + Math.round(newRPS / 2));

      // Append new chart point and slice oldest
      setChartData((prev) => {
        const next = [...prev.slice(1)];
        next.push({
          val: newP95,
          p90: newP90
        });
        return next;
      });

      // Append new stdout log
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(Math.floor(Math.random() * 900) + 100)}`;
      
      const endpoints = [
        { path: 'GET /api/v1/user/profile', baseMs: 16 },
        { path: 'POST /api/v1/checkout/pay', baseMs: 38 },
        { path: 'GET /api/v1/products/list', baseMs: 22 },
        { path: 'PATCH /api/v1/cart/items', baseMs: 29 },
        { path: 'GET /api/v1/telemetry/ws', baseMs: 14 }
      ];
      const ep = endpoints[Math.floor(Math.random() * endpoints.length)];
      const epLatency = Math.round(ep.baseMs * (newP95 / activeScenario.baseP95) + Math.random() * 4);

      setLogs((prev) => [
        ...prev.slice(-6),
        {
          id: Date.now(),
          time: timeStr,
          text: `${ep.path} — HTTP 200 OK (${activeScenario.vus.toLocaleString()} VUs active)`,
          code: 200,
          latency: `${epLatency}ms`
        }
      ]);
    }, 750);

    return () => clearInterval(interval);
  }, [isPlaying, scenario, isSpikeActive, activeScenario]);

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      <SEO 
        title="Interactive Load Simulator Platform"
        description="Experience K6 LAB's interactive load simulator. Adjust VUs, simulate traffic spikes, monitor P95 response times, and analyze performance bottlenecks live."
        keywords="k6 lab platform, interactive load simulator, virtual users simulator, response time telemetry, p95 latency testing"
      />
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 pb-20 relative z-10">
        
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-12 text-center">
          <div className="badge-red mb-4 inline-flex items-center gap-2">
            <Radio size={14} className="animate-pulse text-red-500" />
            <span>REAL-TIME TELEMETRY COCKPIT</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-5 font-['Space_Grotesk'] leading-tight">
            See Your System Under Pressure. <br />
            <span className="text-gradient-red">Live In Real Time.</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Experience sub-millisecond telemetry histograms, live stdout streaming, and instant neural root-cause diagnostics powered by native Go k6.
          </p>

          {/* INTERACTIVE CONTROLS & SCENARIO BAR */}
          <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-zinc-950/90 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 font-semibold flex items-center gap-1.5">
                <Sliders size={14} className="text-red-500" /> Scenario:
              </span>
              <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/5">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setScenario(s.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      scenario === s.id
                        ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerSpike}
                disabled={isSpikeActive}
                className="btn-ghost text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 border border-red-500/30 text-red-300 hover:bg-red-950/50 cursor-pointer"
              >
                <Flame size={14} className={isSpikeActive ? 'animate-bounce text-yellow-400' : 'text-red-500'} />
                <span>{isSpikeActive ? 'Spiking...' : 'Inject Traffic Burst'}</span>
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/25 text-xs font-mono text-zinc-200 flex items-center gap-1.5 cursor-pointer"
              >
                {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                <span>{isPlaying ? 'Pause Feed' : 'Resume Feed'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 1: LIVE INTERACTIVE COCKPIT */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="glass-card-red p-6 sm:p-8 rounded-3xl relative overflow-hidden">
            <BorderBeam size={280} duration={10} colorFrom="#ef4444" colorTo="#dc2626" />

            {/* Cockpit Header Status Bar */}
            <div className="flex flex-wrap items-center justify-between pb-6 mb-6 border-b border-white/10 gap-4">
              <div>
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <span>TARGET ENDPOINT</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-red-400 font-semibold">https://api.yourdomain.com/v1/checkout</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk'] flex items-center gap-3 mt-1">
                  <span>ACTIVE STRESS TEST</span>
                  <span className="text-xs bg-red-950/90 border border-red-500/40 text-red-400 px-3 py-1 rounded-full font-mono flex items-center gap-2">
                    <span className="pulse-red-dot" />
                    LIVE RUNNING
                  </span>
                </div>
              </div>

              {/* Real-Time Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-right font-mono">
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-400 uppercase">ACTIVE VUs</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {activeScenario.vus.toLocaleString()}
                  </div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-400 uppercase">THROUGHPUT</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">
                    {liveRPS.toLocaleString()} <span className="text-xs font-normal">RPS</span>
                  </div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-400 uppercase">P95 LATENCY</div>
                  <div className="text-lg font-bold text-red-400 mt-0.5">
                    {liveP95} <span className="text-xs font-normal">ms</span>
                  </div>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-zinc-400 uppercase">SUCCESS RATE</div>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">
                    99.98%
                  </div>
                </div>
              </div>
            </div>

            {/* REAL-TIME DYNAMIC LATENCY WAVEFORM CHART */}
            <div className="bg-[#07070a] p-6 rounded-2xl border border-white/5 mb-6 space-y-4">
              <div className="flex flex-wrap justify-between items-center text-xs font-mono text-zinc-400 gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <Activity size={14} className="text-red-500" />
                    LIVE P95 LATENCY SPECTRUM (ms)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-950/60 border border-red-500/30 text-red-400 font-bold">
                    {liveP95} ms (Current)
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> P95 Curve
                  </span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-zinc-600" /> P90 Baseline
                  </span>
                  <span className="text-red-500 font-bold flex items-center gap-1.5">
                    <span className="pulse-red-dot" />
                    750ms POLL
                  </span>
                </div>
              </div>

              {/* Dynamic Animated SVG Waveform Bar Graph */}
              <div className="h-44 flex items-end gap-1.5 sm:gap-2 pt-6 border-b border-white/5 relative">
                {/* Horizontal Baseline Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-15">
                  <div className="border-b border-dashed border-white w-full" />
                  <div className="border-b border-dashed border-white w-full" />
                  <div className="border-b border-dashed border-white w-full" />
                </div>

                {chartData.map((pt, i) => {
                  const maxRange = 250;
                  const heightPct = Math.min(100, Math.max(8, (pt.val / maxRange) * 100));
                  const isPeak = pt.val > 100;
                  const isLatest = i === chartData.length - 1;

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      {/* Bar Fill with dynamic gradient */}
                      <motion.div 
                        initial={false}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className={`w-full rounded-t transition-all duration-300 ${
                          isLatest 
                            ? 'bg-white shadow-[0_0_15px_#ffffff]'
                            : isPeak 
                            ? 'bg-gradient-to-t from-red-800 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' 
                            : 'bg-gradient-to-t from-zinc-900 to-zinc-700 hover:bg-zinc-500'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-1">
                <span>T - 18s</span>
                <span>T - 12s</span>
                <span>T - 6s</span>
                <span className="text-red-400 font-bold">LIVE NOW (0s)</span>
              </div>
            </div>

            {/* NETWORK LATENCY STACK BREAKDOWN */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-3">
              <div className="text-xs font-mono text-zinc-300 font-semibold flex items-center justify-between">
                <span>SUB-MILLI TIME-TO-FIRST-BYTE (TTFB) BREAKDOWN</span>
                <span className="text-red-400 font-mono">Total Connection: {(liveAvg + 6.2).toFixed(1)}ms</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
                  <span className="text-[10px] text-zinc-400 uppercase block">DNS Lookup</span>
                  <span className="text-sm font-bold text-white">0.8ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
                  <span className="text-[10px] text-zinc-400 uppercase block">TCP Connect</span>
                  <span className="text-sm font-bold text-white">1.2ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
                  <span className="text-[10px] text-zinc-400 uppercase block">TLS Handshake</span>
                  <span className="text-sm font-bold text-white">1.8ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30">
                  <span className="text-[10px] text-red-400 uppercase block font-bold">Server TTFB</span>
                  <span className="text-sm font-bold text-red-400">{liveAvg}ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5">
                  <span className="text-[10px] text-zinc-400 uppercase block">Content Transfer</span>
                  <span className="text-sm font-bold text-emerald-400">2.4ms</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE METRICS 8-GRID */}
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              Every Metric. <span className="text-gradient-red">Streaming Continuously.</span>
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              Sub-millisecond tracking across every request cycle. Watch real-time distributions mutate as load shifts.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            {[
              { label: 'AVERAGE LATENCY', val: `${liveAvg}ms`, change: 'Optimal' },
              { label: 'P90 LATENCY', val: `${liveP90}ms`, change: '+4.2%' },
              { label: 'P95 LATENCY', val: `${liveP95}ms`, change: isSpikeActive ? '⚡ Spike' : 'Stable', red: true },
              { label: 'MINIMUM RESPONSE', val: `${liveMin}ms`, change: 'Fastest' },
              { label: 'MAXIMUM RESPONSE', val: `${liveMax}ms`, change: 'Peak' },
              { label: 'TOTAL REQUESTS', val: totalRequests.toLocaleString(), change: `+${liveRPS}/s` },
              { label: 'TOTAL ERRORS', val: errorCount, change: '0.00%' },
              { label: 'LOCAL DAEMON', val: 'CONNECTED', change: 'Go k6 v0.54', green: true }
            ].map((m) => (
              <div 
                key={m.label} 
                className={`p-5 rounded-2xl border transition-all ${
                  m.red 
                    ? 'bg-red-950/30 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]' 
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>{m.label}</span>
                  <span className={`text-[10px] font-bold ${m.green ? 'text-emerald-400' : m.red ? 'text-red-400' : 'text-zinc-500'}`}>
                    {m.change}
                  </span>
                </div>
                <div className={`text-2xl font-extrabold font-['Space_Grotesk'] ${m.red ? 'text-red-400' : m.green ? 'text-emerald-400' : 'text-white'}`}>
                  {m.val}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: LIVE STDOUT TERMINAL & NEURAL AI DIAGNOSTIC */}
        <section className="max-w-7xl mx-auto px-6 py-16 border-t border-white/5">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Terminal Console (Left 7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Terminal size={14} />
                  <span>LOCAL AGENT STDOUT CONSOLE</span>
                </div>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                  <span className="pulse-red-dot" /> STREAMING LIVE
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/90 p-5 font-mono text-xs space-y-2.5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-zinc-500 text-[11px]">
                  <span>daemon // k6lab-agent v2.4.0</span>
                  <span>localhost:8000</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-2.5 text-zinc-300 leading-relaxed font-mono">
                      <span className="text-zinc-600 text-[10px] shrink-0">{log.time}</span>
                      <span className="text-red-500 font-bold shrink-0">&gt;</span>
                      <span className="flex-1">{log.text}</span>
                      <span className="text-emerald-400 shrink-0">{log.latency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Neural AI Diagnostic Card (Right 5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={14} />
                <span>NEURAL AI AUDIT (OPENROUTER)</span>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950/90 border border-red-500/30 space-y-4 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <BorderBeam size={220} duration={12} colorFrom="#ef4444" colorTo="#dc2626" />

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-red-400 font-bold uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE PERFORMANCE ANALYSIS
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">NVIDIA NEMOTRON 9B</span>
                </div>

                <div className="space-y-3 font-sans text-xs sm:text-sm text-zinc-300">
                  <p className="leading-relaxed">
                    <strong className="text-white font-semibold">Root-Cause Audit:</strong> Database connection pool allocation is currently at <span className="text-emerald-400 font-mono font-bold">68% utilization</span> under {activeScenario.vus.toLocaleString()} Virtual Users.
                  </p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    P95 latency is trending at <span className="text-white font-mono">{liveP95}ms</span>. No unindexed database locks or thread starvation detected. Safe to ramp load to 50,000 VUs.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Zero Critical Bottlenecks
                  </span>
                  <Link to="/signup" className="text-red-400 hover:text-red-300 font-semibold flex items-center gap-1">
                    Run Full AI Audit <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center border-t border-white/5">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk']">
              Ready to Connect Your Local Agent?
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
              Start streaming live telemetry from your localhost endpoints in less than two minutes.
            </p>
            <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
              <Link to="/signup" className="btn-red text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                Start Testing Free
              </Link>
              <Link to="/docs" className="btn-ghost text-base px-8 py-3.5 rounded-xl">
                Read Agent Quickstart
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
