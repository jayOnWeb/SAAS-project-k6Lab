import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Globe2, Pause, Play, ShieldCheck, Terminal, Cpu, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { BorderBeam } from './ui/border-beam';
import { NumberTicker } from './ui/number-ticker';

const TERMINAL_STEPS = [
  { text: 'k6 run --vus 100 --duration 30s auth-flow.js', type: 'cmd' },
  { text: 'loading script and threshold configuration', type: 'log' },
  { text: '020/100 VUs, 120 rps, p95=42ms', type: 'log' },
  { text: '080/100 VUs, 580 rps, p95=78ms', type: 'log' },
  { text: '100/100 VUs, 720 rps, p95=160ms', type: 'warn' },
  { text: 'connection_pool_exhausted at 15/15 connections', type: 'error' },
  { text: '100/100 VUs, 410 rps, p95=480ms', type: 'error' },
  { text: 'summary parsed: 42,910 requests, 2.4% failed', type: 'success' },
];

const REGIONS = [
  { city: 'Dublin', latency: '34ms', status: 'Stable', statusBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { city: 'Frankfurt', latency: '42ms', status: 'Stable', statusBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { city: 'Tokyo', latency: '190ms', status: 'Watch', statusBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { city: 'Oregon', latency: '85ms', status: 'Stable', statusBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

export default function TelemetryBento() {
  const [termLines, setTermLines] = useState([TERMINAL_STEPS[0]]);
  const [activeStep, setActiveStep] = useState(1);
  const [running, setRunning] = useState(true);
  const [gaugeValue, setGaugeValue] = useState(12);

  useEffect(() => {
    if (!running) return undefined;

    const interval = window.setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep >= TERMINAL_STEPS.length) {
          setTermLines([TERMINAL_STEPS[0]]);
          return 1;
        }

        setTermLines((lines) => [...lines, TERMINAL_STEPS[currentStep]]);
        return currentStep + 1;
      });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const target = activeStep >= 6 ? 94 : Math.max(12, activeStep * 12);
    const interval = window.setInterval(() => {
      setGaugeValue((value) => {
        if (value < target) return Math.min(value + 2, target);
        if (value > target) return Math.max(value - 2, target);
        return value;
      });
    }, 42);

    return () => window.clearInterval(interval);
  }, [activeStep]);

  const dash = (gaugeValue / 100) * 251.2;

  return (
    <section id="telemetry-bento" className="relative py-24 px-4 overflow-hidden bg-black">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-4"
          >
            <Badge variant="glow" pulse>
              <Cpu className="w-3.5 h-3.5 mr-1" /> Real-time Console & Anomaly Engine
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            The run, the risk, and the fix in <span className="text-gradient-red">one workspace</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg"
          >
            A compact command view pairs with AI notes and regional context, so your team can move from failure signal to action without switching tools.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Main Terminal Panel (Spans 2 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 relative flex flex-col justify-between rounded-2xl bg-zinc-950/80 border border-white/10 p-6 backdrop-blur-xl shadow-2xl overflow-hidden group hover:border-red-500/40 transition-colors"
          >
            <BorderBeam size={280} duration={14} colorFrom="#ef4444" colorTo="#dc2626" />

            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 font-medium ml-2">auth-flow.js / live stream</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRunning((value) => !value)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 transition-colors cursor-pointer"
                >
                  {running ? <Pause size={12} /> : <Play size={12} />}
                  {running ? 'Pause' : 'Resume'}
                </button>
              </div>

              <div className="font-mono text-xs space-y-2 max-h-56 overflow-y-auto pr-2">
                {termLines.map((line, index) => (
                  <div
                    key={`${line.text}-${index}`}
                    className={`flex items-start gap-2 ${
                      line.type === 'cmd'
                        ? 'text-red-400 font-bold'
                        : line.type === 'warn'
                        ? 'text-amber-400'
                        : line.type === 'error'
                        ? 'text-red-400 bg-red-950/30 p-1 rounded border border-red-500/30'
                        : line.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-zinc-400'
                    }`}
                  >
                    <span className="text-zinc-600 select-none">{line.type === 'cmd' ? '$' : '>'}</span>
                    <span>{line.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric counters at bottom */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 bg-black/40 -mx-6 -mb-6 p-4">
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Throughput</span>
                <span className="text-lg font-bold text-white font-mono flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-red-500" />
                  <NumberTicker value={activeStep >= 5 ? 720 : 580} suffix=" RPS" />
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Virtual Users</span>
                <span className="text-lg font-bold text-white font-mono">
                  <NumberTicker value={activeStep >= 4 ? 100 : 80} suffix=" VUs" />
                </span>
              </div>
              <div>
                <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">Latency (P95)</span>
                <span className={`text-lg font-bold font-mono ${activeStep >= 6 ? 'text-red-400' : 'text-emerald-400'}`}>
                  <NumberTicker value={activeStep >= 6 ? 480 : 78} suffix="ms" />
                </span>
              </div>
            </div>
          </motion.div>

          {/* Anomaly Score Panel */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl bg-zinc-950/80 border border-white/10 p-6 backdrop-blur-xl hover:border-red-500/40 transition-colors"
          >
            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">Risk Score</span>
              <h3 className="text-lg font-bold text-white mt-1">Anomaly Coefficient</h3>
              <p className="text-xs text-zinc-400 mt-1">Tracks live runs against baseline thresholds.</p>
            </div>

            <div className="my-6 flex flex-col items-center justify-center relative">
              <svg className="w-32 h-32" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={gaugeValue > 80 ? '#ef4444' : '#10b981'}
                  strokeWidth="6"
                  strokeDasharray={`${dash} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-mono text-white">{gaugeValue}%</span>
                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                  gaugeValue > 80 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {gaugeValue > 80 ? 'Review' : 'Stable'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 bg-white/5 p-2.5 rounded-xl border border-white/10">
              {gaugeValue > 80 ? (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="truncate">
                {gaugeValue > 80 ? 'Pool connections exhausted' : 'Thresholds in safe range'}
              </span>
            </div>
          </motion.div>

          {/* AI Parser Notes Panel */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-between rounded-2xl bg-zinc-950/80 border border-white/10 p-6 backdrop-blur-xl hover:border-red-500/40 transition-colors"
          >
            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">AI Insights</span>
              <h3 className="text-lg font-bold text-white mt-1">Raw logs to review notes</h3>
              <p className="text-xs text-zinc-400 mt-1">k6lab transforms machine logs into actionable fixes.</p>
            </div>

            <div className="space-y-3 my-4">
              <div className="bg-zinc-900/90 border border-white/10 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
                  <FileText className="w-3.5 h-3.5 text-red-400" />
                  <span>Machine Metric</span>
                </div>
                <p className="text-xs font-mono text-white">http_req_duration p95: 480.24ms</p>
                <p className="text-[11px] font-mono text-red-400">http_req_failed rate: 2.4%</p>
              </div>

              <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>AI Root Cause Fix</span>
                </div>
                <p className="text-xs text-white font-medium">Authorization bottleneck detected.</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">Raise pool limit, warm token cache, retest at 500 VUs.</p>
              </div>
            </div>
          </motion.div>

          {/* Regional Context Panel (Spans remaining on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 lg:col-span-4 flex flex-col md:flex-row items-center justify-between rounded-2xl bg-zinc-950/80 border border-white/10 p-6 backdrop-blur-xl gap-6 hover:border-red-500/40 transition-colors"
          >
            <div>
              <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">Multi-Region Edge</span>
              <h3 className="text-lg font-bold text-white mt-1">Distributed Global Nodes</h3>
              <p className="text-xs text-zinc-400 mt-1">Separate backend saturation from regional network routing latency.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
              {REGIONS.map((reg) => (
                <div key={reg.city} className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 rounded-xl min-w-[150px]">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-red-400" />
                    <div>
                      <span className="text-xs font-medium text-white block">{reg.city}</span>
                      <span className="text-[11px] font-mono text-zinc-400">{reg.latency}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${reg.statusBg}`}>
                    {reg.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
