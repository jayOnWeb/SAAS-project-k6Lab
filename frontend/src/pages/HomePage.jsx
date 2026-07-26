import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Server, 
  Activity, 
  Cpu, 
  Zap, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  BarChart2, 
  Terminal,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function HomePage() {
  const [reqCount, setReqCount] = useState(12482);
  const [latency, setLatency] = useState(142);

  useEffect(() => {
    const timer = setInterval(() => {
      setReqCount((prev) => prev + Math.floor(Math.random() * 8) + 1);
      setLatency(138 + Math.floor(Math.random() * 10));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative overflow-hidden">
      {/* Red Aurora & Grid Overlay */}
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 text-center">
          {/* Eyebrow */}
          <div className="inline-block mb-6">
            <div className="badge-red">
              <span className="pulse-red-dot"></span>
              LOCAL-FIRST PERFORMANCE TESTING
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.1] font-['Space_Grotesk']">
            Stress Test Your APIs. <br />
            <span className="text-gradient-red">Understand Their Limits.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Run native k6 load tests directly from your own machine, watch real-time telemetry as it happens, and get actionable AI-powered insights from your actual performance data.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
            <Link to="/signup" className="btn-red text-base px-8 py-3.5 group">
              Start Testing Free
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/how-it-works" className="btn-ghost text-base px-8 py-3.5">
              See How It Works
            </Link>
          </div>

          {/* Supporting Statement */}
          <div className="text-sm font-mono text-zinc-400 mb-16 flex items-center justify-center gap-2">
            <span>Your machine runs the test.</span>
            <span className="text-red-400 font-semibold bg-red-950/60 border border-red-500/30 px-3 py-1 rounded-full">
              K6 Lab makes sense of the result.
            </span>
          </div>

          {/* HERO VISUAL — Premium Telemetry Cockpit */}
          <div className="glass-card-red max-w-5xl mx-auto overflow-hidden text-left p-1">
            <div className="bg-[#08080c] rounded-xl overflow-hidden border border-red-500/20">
              {/* Window Header */}
              <div className="bg-[#101015] px-4 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                    <Terminal size={13} className="text-red-500" />
                    k6lab-cockpit // telemetry-stream.live
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-red-400 bg-red-950/80 border border-red-500/40 px-3 py-1 rounded-full">
                  <span className="pulse-red-dot" />
                  AGENT ONLINE
                </div>
              </div>

              {/* Cockpit Stats Grid */}
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#0a0a0e]">
                <div className="bg-[#121218] p-5 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">API RESPONSE TIME</div>
                  <div className="text-3xl font-extrabold text-red-400 font-['Space_Grotesk']">{latency}ms</div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">Average Latency</div>
                </div>

                <div className="bg-[#121218] p-5 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">P95 LATENCY</div>
                  <div className="text-3xl font-extrabold text-white font-['Space_Grotesk']">280ms</div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">95th Percentile</div>
                </div>

                <div className="bg-[#121218] p-5 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">REQUESTS</div>
                  <div className="text-3xl font-extrabold text-white font-['Space_Grotesk']">{reqCount.toLocaleString()}</div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">Live Streamed</div>
                </div>

                <div className="bg-[#121218] p-5 rounded-xl border border-white/5 hover:border-red-500/30 transition-colors">
                  <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1">ERROR RATE</div>
                  <div className="text-3xl font-extrabold text-red-400 font-['Space_Grotesk']">0.08%</div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">Optimal State</div>
                </div>
              </div>

              {/* Simulated Live Latency Bar Chart */}
              <div className="px-6 py-4 bg-[#07070a] border-t border-white/5 flex items-end gap-1.5 h-20">
                {[45, 60, 55, 70, 85, 120, 142, 95, 65, 80, 110, 140, 180, 280, 130, 90, 75, 85, 105, 135, 160, 220, 142, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-zinc-800 hover:bg-red-500 rounded-t transition-all duration-300" style={{ height: `${(h / 280) * 100}%` }}>
                    {h > 200 && <div className="w-full h-1 bg-red-500 shadow-[0_0_8px_#ef4444]" />}
                  </div>
                ))}
              </div>

              {/* Command Ticker */}
              <div className="px-6 py-3 bg-[#050508] border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-zinc-300 flex items-center gap-2">
                  <span className="text-red-500 font-bold">&gt;</span> k6lab-agent: executing local test against target http://localhost:8080/api/v1/checkout
                </span>
                <span className="text-zinc-500">Virtual Users: 10</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-['Space_Grotesk']">
              Performance Testing Shouldn&apos;t Feel Like Guesswork.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Your APIs aren&apos;t always public. Your performance data is more than a wall of numbers. And generic advice rarely tells you what to test next.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)] group-hover:border-red-500 transition-colors">
                <Server size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Space_Grotesk']">Card 01 — Local APIs</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Test localhost, private APIs, internal services, and development environments directly from the machine that can reach them.
              </p>
            </div>

            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)] group-hover:border-red-500 transition-colors">
                <Activity size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Space_Grotesk']">Card 02 — Raw Metrics</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Latency numbers tell you what happened. They don&apos;t always tell you why it happened.
              </p>
            </div>

            <div className="glass-card p-8 group">
              <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/30 text-red-500 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(239,68,68,0.15)] group-hover:border-red-500 transition-colors">
                <Sparkles size={26} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Space_Grotesk']">Card 03 — Generic Advice</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                You don&apos;t need another vague recommendation. You need insight based on the actual behaviour of your system.
              </p>
            </div>
          </div>
        </section>

        {/* CORE PRODUCT EXPLANATION */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="badge-red mb-4">ARCHITECTURE</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
                Your Machine Runs the Test. <br />
                <span className="text-red-500">K6 Lab Makes Sense of the Results.</span>
              </h2>
              <p className="text-zinc-300 text-lg mb-6 leading-relaxed font-medium">
                K6 Lab uses a local-first architecture.
              </p>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Your local k6lab-agent executes native k6 directly on your machine. K6 Lab coordinates the test and brings the telemetry, logs, and performance data into one focused cockpit.
              </p>
              <div className="p-5 bg-red-950/30 border-l-4 border-red-500 rounded-r-xl text-sm font-mono text-zinc-300 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                The dashboard coordinates the work. Your machine executes the test. The cockpit helps you understand the result.
              </div>
            </div>

            {/* Architecture Visual Pipeline */}
            <div className="glass-card-red p-8 space-y-3">
              <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest mb-6 flex items-center justify-between">
                <span>LOCAL-FIRST PIPELINE VISUAL</span>
                <span className="pulse-red-dot"></span>
              </div>

              {[
                { name: 'YOUR MACHINE', desc: 'Host Environment', icon: Cpu },
                { name: 'k6lab-agent', desc: 'CLI Daemon Process', icon: Terminal },
                { name: 'Native k6', desc: 'Go Load Engine', icon: Zap },
                { name: 'Live Telemetry', desc: 'Stream Connection', icon: Activity },
                { name: 'K6 LAB COCKPIT', desc: 'Central Control Platform', icon: BarChart2, highlight: true },
                { name: 'Performance Insight', desc: 'Actionable Intelligence', icon: Sparkles, red: true }
              ].map((step, idx, arr) => {
                const Icon = step.icon;
                return (
                  <div key={step.name} className="space-y-3">
                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      step.red 
                        ? 'bg-red-600 border-red-400 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] font-bold' 
                        : step.highlight 
                        ? 'bg-zinc-900 border-red-500/60 text-red-400 font-bold' 
                        : 'bg-[#09090d] border-white/5 text-zinc-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs opacity-60">0{idx + 1}</span>
                        <span className="font-mono text-sm tracking-wide">{step.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans opacity-70 hidden sm:inline">{step.desc}</span>
                        <Icon size={18} />
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="text-center text-red-500 font-extrabold text-sm py-0.5">↓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURES PREVIEW */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              Everything You Need to Push Your API Further.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8 hover:border-red-500/50 transition-colors">
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest">FEATURE 01</div>
              <h3 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Local-First Execution</h3>
              <p className="text-zinc-400 leading-relaxed">
                Run tests against local and private environments without exposing your APIs to a remote testing infrastructure.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-red-500/50 transition-colors">
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest">FEATURE 02</div>
              <h3 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Real-Time Telemetry</h3>
              <p className="text-zinc-400 leading-relaxed">
                Watch requests, latency, failures, and logs while your test is running.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-red-500/50 transition-colors">
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest">FEATURE 03</div>
              <h3 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Detailed Timing Breakdown</h3>
              <p className="text-zinc-400 leading-relaxed">
                Understand where time is being spent across connection, TLS, waiting, sending, and receiving phases.
              </p>
            </div>

            <div className="glass-card p-8 hover:border-red-500/50 transition-colors">
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest">FEATURE 04</div>
              <h3 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">AI Performance Audit</h3>
              <p className="text-zinc-400 leading-relaxed">
                Turn your actual test results into direct, context-specific recommendations for your next performance test.
              </p>
            </div>
          </div>
        </section>

        {/* AI AUDIT PREVIEW */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="badge-red mb-4">AI INSIGHT ENGINE</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk'] leading-tight">
              Metrics Tell You What Happened. <br />
              <span className="text-red-500">AI Helps You Decide What to Do Next.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Example Test Result */}
            <div className="glass-card p-8 flex flex-col justify-between border-white/10">
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                  <span className="font-mono text-xs text-zinc-400 font-bold uppercase tracking-wider">TEST RESULT</span>
                  <span className="text-xs text-red-400 font-mono font-bold bg-red-950/60 border border-red-500/30 px-3.5 py-1 rounded-full">STATUS: COMPLETED</span>
                </div>

                <div className="grid grid-cols-3 gap-4 my-8">
                  <div className="bg-[#09090d] p-5 rounded-xl border border-white/5 text-center">
                    <div className="text-xs font-mono text-zinc-400 mb-1">P95 LATENCY</div>
                    <div className="text-2xl font-extrabold text-white font-['Space_Grotesk']">280ms</div>
                  </div>
                  <div className="bg-[#09090d] p-5 rounded-xl border border-white/5 text-center">
                    <div className="text-xs font-mono text-zinc-400 mb-1">ERROR RATE</div>
                    <div className="text-2xl font-extrabold text-red-400 font-['Space_Grotesk']">0.4%</div>
                  </div>
                  <div className="bg-[#09090d] p-5 rounded-xl border border-white/5 text-center">
                    <div className="text-xs font-mono text-zinc-400 mb-1">VIRTUAL USERS</div>
                    <div className="text-2xl font-extrabold text-white font-['Space_Grotesk']">10</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 text-xs text-zinc-500 font-mono">
                Telemetry collected via k6lab-agent v1.2
              </div>
            </div>

            {/* Example AI Output */}
            <div className="glass-card-red p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-4 mb-6 border-b border-red-500/20">
                  <Sparkles className="text-red-500" size={20} />
                  <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider">PERFORMANCE AUDIT</span>
                </div>

                <div className="space-y-6 text-zinc-200">
                  <p className="text-base leading-relaxed">
                    Your API is handling <strong className="text-white font-semibold underline decoration-red-500 decoration-2">10 VUs cleanly</strong> with a low failure rate.
                  </p>

                  <div className="bg-black/90 p-5 rounded-xl border border-red-500/40 space-y-2 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                    <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-wide">Next test:</div>
                    <p className="text-base text-white font-semibold">
                      Increase load to 20–50 VUs and run for 60 seconds to identify where latency begins to degrade.
                    </p>
                  </div>

                  <p className="text-sm text-zinc-400">
                    The current run does not indicate a clear bottleneck.
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-red-500/20 flex justify-end">
                <Link to="/platform" className="btn-red text-sm py-2.5 px-5">
                  Audit Telemetry Run
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 text-center">
          <div className="glass-card-red max-w-4xl mx-auto py-16 px-8 relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
              Know How Far Your System Can Go.
            </h2>
            <p className="text-zinc-300 text-lg mb-10 max-w-xl mx-auto">
              Run your first local performance test with K6 Lab.
            </p>
            <Link to="/signup" className="btn-red text-lg px-9 py-4 shadow-[0_0_40px_rgba(239,68,68,0.6)]">
              Get Started Free →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
