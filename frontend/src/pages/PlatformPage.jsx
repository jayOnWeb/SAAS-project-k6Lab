import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Sparkles, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PlatformPage() {
  const [logs, setLogs] = useState([
    '[00:01] Starting k6 test against local API endpoint...',
    '[00:03] Agent initialized on machine: dev-box-01',
    '[00:05] 1,240 requests completed (latency avg: 140ms)',
    '[00:10] Agent heartbeat received - VUs active: 10',
    '[00:15] Test running smoothly... 0 failures detected',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSec = Math.floor((Date.now() % 60000) / 1000);
      const reqCount = Math.floor(Math.random() * 500) + 12000;
      setLogs((prev) => [
        ...prev.slice(-6),
        `[00:${timeSec < 10 ? '0' + timeSec : timeSec}] Telemetry stream active - ${reqCount.toLocaleString()} total requests`,
      ]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="badge-red mb-4">PLATFORM COCKPIT</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
            See Your System Under Pressure. <br />
            <span className="text-gradient-red">In Real Time.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-8">
            A focused performance cockpit for watching your APIs, understanding latency, and finding the next test worth running.
          </p>
        </section>

        {/* LIVE TEST PREVIEW SHOWCASE */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="glass-card-red p-8">
            <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-white/10 gap-4">
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest">LIVE TEST</div>
                <div className="text-2xl font-bold text-white font-['Space_Grotesk'] flex items-center gap-3 mt-1">
                  API STRESS TEST
                  <span className="text-xs bg-red-950/90 border border-red-500/40 text-red-400 px-3 py-1 rounded-full font-mono flex items-center gap-2">
                    <span className="pulse-red-dot" />
                    RUNNING
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-xs font-mono text-zinc-400">AGENT STATUS</div>
                  <div className="text-base font-bold text-red-400 font-mono">ONLINE</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-zinc-400">REQUESTS</div>
                  <div className="text-base font-bold text-white font-mono">12,482</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-zinc-400">SUCCESS RATE</div>
                  <div className="text-base font-bold text-white font-mono">99.92%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-zinc-400">P95</div>
                  <div className="text-base font-bold text-red-400 font-mono">280ms</div>
                </div>
              </div>
            </div>

            {/* Live Chart Simulation */}
            <div className="bg-[#07070a] p-6 rounded-xl border border-white/5 mb-6">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-400 mb-4">
                <span>LATENCY SPECTRUM (ms)</span>
                <span className="text-red-500 font-bold flex items-center gap-1.5">
                  <span className="pulse-red-dot" />
                  LIVE FEED
                </span>
              </div>
              <div className="h-36 flex items-end gap-2 pt-4 border-b border-white/5">
                {[120, 135, 142, 160, 210, 280, 150, 145, 138, 142, 155, 190, 280, 142, 130, 148, 160, 210, 145, 135].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${h > 200 ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-zinc-800'}`}
                      style={{ height: `${(h / 300) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PERFORMANCE METRICS */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              Every Request Tells a Story.
            </h2>
            <p className="text-zinc-400 text-lg">
              K6 Lab brings the important signals together in one place, so you can move from raw test output to actual understanding.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Average', val: '142ms' },
              { label: 'P90', val: '220ms' },
              { label: 'P95', val: '280ms' },
              { label: 'Min', val: '45ms' },
              { label: 'Max', val: '410ms' },
              { label: 'Requests', val: '12,482' },
              { label: 'Errors', val: '10' },
              { label: 'Failure Rate', val: '0.08%' },
            ].map((m) => (
              <div key={m.label} className="glass-card p-6 text-center hover:border-red-500/50 transition-colors">
                <div className="text-xs font-mono text-zinc-400 uppercase mb-2">{m.label}</div>
                <div className="text-2xl font-extrabold text-red-400 font-['Space_Grotesk']">{m.val}</div>
              </div>
            ))}
          </div>
        </section>

        {/* LIVE LOGS */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest uppercase">STREAMING CONSOLE</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
                Don&apos;t Wait for the Test to Finish.
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Follow the raw output from your active test as the local agent executes it.
              </p>
            </div>
            <div className="code-container p-6 space-y-2 text-xs">
              <div className="text-zinc-500 border-b border-white/10 pb-3 mb-3 flex items-center justify-between font-mono">
                <span>k6lab-agent // stdout stream</span>
                <span className="text-red-500 font-bold flex items-center gap-1.5">
                  <span className="pulse-red-dot" />
                  REAL-TIME
                </span>
              </div>
              {logs.map((log, index) => (
                <div key={index} className="text-zinc-300 font-mono leading-relaxed">
                  <span className="text-red-500 font-bold">&gt;</span> {log}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI AUDIT */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="glass-card-red p-12 text-center max-w-4xl mx-auto">
            <div className="badge-red mb-4">POST-TEST ANALYSIS</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              From Performance Data to the Next Experiment.
            </h2>
            <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              A completed test should not be the end of the process. Use the results from one test to decide what to explore next.
            </p>
            <Link to="/signup" className="btn-red text-base px-8 py-3.5">
              Audit Telemetry Run
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
