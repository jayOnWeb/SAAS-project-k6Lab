import { Link } from 'react-router-dom';
import { Shield, Zap, Activity, Clock, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="badge-red mb-4">PRODUCT CAPABILITIES</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
            The Performance Cockpit for <br />
            <span className="text-gradient-red">Your Local APIs.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Run native k6 locally. See your telemetry live. Understand what to do next.
          </p>
        </section>

        {/* FEATURE 01 — LOCAL-FIRST ARCHITECTURE */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest uppercase">FEATURE 01 — LOCAL-FIRST ARCHITECTURE</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-['Space_Grotesk']">
                Test Where Your Code Lives.
              </h2>
              <p className="text-zinc-300 text-lg mb-4 leading-relaxed font-medium">
                Not every API is public.
              </p>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Your application might be running on localhost, inside a private network, or within a development environment.
              </p>
              <div className="p-5 bg-zinc-900/80 border-l-4 border-red-500 rounded-r-xl text-sm font-mono text-zinc-300">
                With K6 Lab, the test runs through a local agent on your machine, so the machine that can reach your API is the machine that runs the test.
              </div>
            </div>
            
            <div className="glass-card-red p-8 space-y-4">
              <div className="text-xs font-mono text-red-400 font-bold mb-4 uppercase">UNRESTRICTED ACCESS SCOPE</div>
              {[
                'Localhost / 127.0.0.1 (Dev Server)',
                'Private VPC & Corporate Intranet',
                'Docker Containers & Local Kubernetes Cluster'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 bg-[#08080c] rounded-xl border border-white/10 font-mono text-sm text-zinc-200">
                  <Shield className="text-red-500" size={20} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE 02 — NATIVE K6 EXECUTION */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 glass-card p-8">
              <div className="code-container p-6 space-y-4 font-mono text-sm">
                <div className="text-xs text-zinc-500">// native k6 execution engine</div>
                <div className="text-red-400 font-bold">$ k6lab-agent run --script loadtest.js --vus 50</div>
                <div className="pt-4 border-t border-white/10 text-xs text-zinc-400 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-red-500" />
                    <span>Native Go binary execution engine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-red-500" />
                    <span>Zero network proxy or gateway overhead</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-red-500" />
                    <span>High Virtual User (VU) concurrency capacity</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest uppercase">FEATURE 02 — NATIVE K6 EXECUTION</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-['Space_Grotesk']">
                Your Load Test Runs Where It Matters.
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                K6 Lab uses a local agent to execute native k6 tests directly on your machine.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                The platform handles coordination and visibility. Your machine handles the actual load generation.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURE 03 — REAL-TIME TELEMETRY */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest uppercase">FEATURE 03 — REAL-TIME TELEMETRY</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              Watch Your System Under Pressure.
            </h2>
            <p className="text-zinc-400 text-lg">
              See your test as it happens instead of waiting for a final report. Monitor request volume, latency, failures, and live output from the active agent.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-3">
            {[
              'Average Latency', 'P90', 'P95', 'Minimum', 'Maximum', 
              'Total Requests', 'Successful Requests', 'Failed Requests', 'Failure Rate'
            ].map((metric) => (
              <div key={metric} className="glass-card p-4 text-center hover:border-red-500 transition-colors">
                <div className="text-xs font-mono text-zinc-400 mb-2 truncate">{metric}</div>
                <div className="text-sm font-extrabold text-red-400 font-mono">LIVE</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURE 04 — TIMING BREAKDOWN */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest uppercase">FEATURE 04 — TIMING BREAKDOWN</div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
                Latency Is More Than One Number.
              </h2>
              <p className="text-zinc-400 text-lg mb-6">
                Break down your request timing to understand where the time is going.
              </p>
            </div>

            <div className="glass-card p-8 space-y-4">
              {[
                { name: 'Waiting / TTFB', time: '84ms', width: '70%' },
                { name: 'Connecting', time: '12ms', width: '20%' },
                { name: 'TLS Handshake', time: '18ms', width: '25%' },
                { name: 'Sending', time: '4ms', width: '10%' },
                { name: 'Receiving', time: '14ms', width: '18%' },
                { name: 'Blocked', time: '2ms', width: '5%' },
              ].map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-zinc-300">{item.name}</span>
                    <span className="text-red-400 font-bold">{item.time}</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full" style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURE 05 — AI PERFORMANCE AUDIT */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="glass-card-red p-12 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="text-xs font-mono text-red-400 font-bold mb-3 tracking-widest uppercase">FEATURE 05 — AI PERFORMANCE AUDIT</div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
              Stop Staring at Metrics. <br />
              Start Knowing What to Test Next.
            </h2>
            <p className="text-zinc-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              When your test is complete, trigger an AI-powered performance audit. The audit looks at your actual test results and provides direct, context-specific recommendations for exploring your system&apos;s limits.
            </p>
            <div className="inline-block p-4 bg-black/90 border border-red-500/40 rounded-xl font-mono text-sm text-red-400 mb-8 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              No generic textbook clutter. Just insight based on your telemetry.
            </div>
            <div>
              <Link to="/signup" className="btn-red text-base px-8 py-3.5">
                Try K6 Lab Features
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
