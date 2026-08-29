import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  Database, 
  Server, 
  Flame, 
  Terminal,
  Clock,
  Layers,
  AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Badge } from '../components/ui/badge';
import { BorderBeam } from '../components/ui/border-beam';

const PRODUCTION_RISKS = [
  {
    icon: Flame,
    title: "504 Gateway Timeouts on Launch Day",
    desc: "Your API responds in 20ms during staging, but when 5,000 users hit checkout simultaneously, thread starvation causes silent outages.",
    impact: "Lost revenue & customer churn"
  },
  {
    icon: Database,
    title: "Database Connection Pool Exhaustion",
    desc: "Untested concurrent requests exhaust available pool connections in seconds, causing cascading failures across all microservices.",
    impact: "Total backend freeze"
  },
  {
    icon: Clock,
    title: "Unindexed Query Latency Chokepoints",
    desc: "A single unindexed database query that takes 10ms with 1 user escalates to 15-second blocking queries when 10,000 requests queue up.",
    impact: "CPU spikes to 100%"
  },
  {
    icon: Cpu,
    title: "Event-Loop Blocking & Memory Leaks",
    desc: "Heavy JSON serialization or synchronous operations lock the Node.js/Python event loop, dropping incoming network packets.",
    impact: "Unpredictable service degradation"
  }
];

const PRE_DEPLOYMENT_PILLARS = [
  {
    num: "01",
    tag: "LOCAL-FIRST SAFETY",
    title: "Stress-Test on Localhost & Private VPCs",
    desc: "No need to open public firewalls or route sensitive traffic through third-party cloud proxies. The lightweight k6lab-agent runs natively on your machine or private VPC, testing localhost endpoints directly.",
    icon: Terminal,
    highlight: "Zero cloud data leakage & 100% private"
  },
  {
    num: "02",
    tag: "TRUE CAPACITY MAPPING",
    title: "Discover Your Exact Breaking Point",
    desc: "Ramp up Virtual Users (VUs) from 100 to 50,000+ to discover the precise concurrency threshold where your backend begins dropping packets or spiking in latency.",
    icon: Activity,
    highlight: "Sub-millisecond P95 & P99 telemetry"
  },
  {
    num: "03",
    tag: "ACTIONABLE INTELLIGENCE",
    title: "Instant Neural AI Root-Cause Diagnosis",
    desc: "Instead of drowning in endless text logs, K6 Lab's integrated AI analyzes metrics instantly, telling you the exact line of code, unindexed query, or pool setting that caused the bottleneck.",
    icon: Sparkles,
    highlight: "Immediate fixes before staging deployment"
  },
  {
    num: "04",
    tag: "ZERO CLOUD BILLS",
    title: "Native Go k6 Execution Without Limits",
    desc: "Enjoy the raw power of Grafana's native Go k6 engine with zero per-test cloud surcharges. Run unlimited tests on your own development hardware.",
    icon: Zap,
    highlight: "Unlimited local load generation"
  }
];

const CHECKLIST_ITEMS = [
  { text: "Simulated 10,000+ concurrent Virtual Users against target API routes", category: "Traffic" },
  { text: "Verified P95 response time is strictly under 50ms threshold", category: "Latency" },
  { text: "Validated 0.00% packet loss and 0% 5xx server error rate", category: "Reliability" },
  { text: "Confirmed Database connection pool has 30%+ headroom under peak stress", category: "Database" },
  { text: "Ran Neural AI Audit to verify zero unindexed query bottlenecks", category: "AI Diagnosis" },
  { text: "Tested TTFB, DNS lookup, and TLS handshake under heavy network load", category: "Network" }
];

import SEO from '../components/SEO';

export default function WhyK6LabPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      <SEO 
        title="Why K6 LAB — Local-First vs Cloud Load Testing"
        description="Discover why developers choose K6 LAB over traditional cloud SaaS load testing. Zero cloud bills, complete data privacy, and zero latency."
        keywords="why k6 lab, local load testing benefits, k6 vs cloud load testing, data privacy load test, zero cost performance testing"
      />
      {/* Ambient Red Glow */}
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/50 border border-red-500/40 backdrop-blur-md text-xs font-mono text-red-400 mb-6 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <ShieldCheck size={14} className="text-red-500" />
            <span>PRE-DEPLOYMENT STRESS &amp; RELIABILITY VERIFICATION</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-[1.1] max-w-5xl mx-auto"
          >
            Know Your API&apos;s Limits. <br />
            <span className="text-gradient-red">Before Your Users Do.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal"
          >
            Deploying code without stress testing is like launching a rocket without a wind-tunnel test. K6 Lab tests your APIs under extreme concurrent load on your own machine, diagnosing bottlenecks before you ever ship to production.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4"
          >
            <Link to="/signup" className="btn-red text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.5)] group">
              Start Stress Testing Free
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/docs" className="btn-ghost text-base px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/25">
              Read Quickstart Docs
            </Link>
          </motion.div>
        </section>

        {/* SECTION 1: THE RISK OF DEPLOYING UNTESTED APIS */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-mono text-red-500 font-bold mb-3 tracking-widest uppercase flex items-center justify-center gap-2">
              <AlertTriangle size={14} />
              <span>THE PRODUCTION REALITY</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              What Happens When You Deploy Blind?
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              APIs that feel fast in local development frequently crash under real-world concurrent traffic.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {PRODUCTION_RISKS.map((risk) => {
              const Icon = risk.icon;
              return (
                <div 
                  key={risk.title}
                  className="p-7 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-4 backdrop-blur-md hover:border-red-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 group-hover:scale-105 transition-transform">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30 text-red-400">
                      {risk.impact}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white font-['Space_Grotesk']">
                    {risk.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {risk.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: THE 4 PRE-DEPLOYMENT SAFEGUARDS */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="glow" pulse className="px-4 py-1.5 text-xs mb-3">
              THE K6 LAB ADVANTAGE
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              4 Pillars of <span className="text-gradient-red">Pre-Deployment Confidence</span>
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg">
              How K6 Lab protects your infrastructure before a single line of code reaches production.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {PRE_DEPLOYMENT_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div 
                  key={pillar.num}
                  className="relative p-8 rounded-2xl bg-zinc-950/90 border border-white/10 space-y-4 backdrop-blur-xl hover:border-red-500/50 transition-all duration-300 group"
                >
                  <BorderBeam size={220} duration={14} colorFrom="#ef4444" colorTo="#dc2626" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                        <Icon size={22} />
                      </div>
                      <span className="text-xs font-mono font-bold text-red-400 tracking-wider">
                        {pillar.tag}
                      </span>
                    </div>
                    <span className="font-mono text-2xl font-extrabold text-zinc-700">
                      {pillar.num}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white font-['Space_Grotesk']">
                    {pillar.title}
                  </h3>

                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-mono text-zinc-300">
                    <CheckCircle2 size={14} className="text-red-500" />
                    <span>{pillar.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: PRE-DEPLOYMENT VERIFICATION CHECKLIST */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="glass-card-red p-8 sm:p-12 rounded-3xl max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="text-xs font-mono text-red-400 font-bold mb-2 tracking-widest uppercase flex items-center justify-center gap-2">
                <ShieldCheck size={16} />
                <span>PRE-FLIGHT RELEASE GATE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 font-['Space_Grotesk']">
                The Pre-Deployment Checklist
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base">
                Verify every critical metric before promoting your build from staging to production.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {CHECKLIST_ITEMS.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-xl bg-black/60 border border-white/10 flex items-start gap-3.5 font-mono text-xs text-zinc-200"
                >
                  <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 size={14} />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">{item.category}</span>
                    <span>{item.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center pt-6 border-t border-white/10 flex flex-wrap justify-center items-center gap-4">
              <span className="text-xs font-mono text-zinc-400">Ready to audit your API before the next sprint release?</span>
              <Link to="/signup" className="btn-red text-xs px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)] inline-flex items-center gap-2">
                Run Pre-Flight Stress Test
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: HEAD-TO-HEAD COMPARISON (DEPLOYING BLIND VS WITH K6 LAB) */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              Deploying Blind vs <span className="text-gradient-red">Deploying with K6 Lab</span>
            </h2>
            <p className="text-zinc-400 mt-3 text-base">
              The difference between sleepless launch nights and total operational peace of mind.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/90 overflow-hidden shadow-2xl backdrop-blur-xl max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-black/70 text-zinc-400 uppercase tracking-wider text-[11px]">
                    <th className="py-4 px-6 font-semibold">Scenario / Metric</th>
                    <th className="py-4 px-6 font-semibold text-zinc-400">Deploying Blind</th>
                    <th className="py-4 px-6 font-bold text-red-400 bg-red-950/30 border-x border-red-500/20">⚡ With K6 Lab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {[
                    {
                      feature: "Traffic Spike Readiness",
                      blind: "Fingers crossed on launch day",
                      k6lab: "Benchmark verified at 50,000 VUs"
                    },
                    {
                      feature: "Localhost & VPC Testing",
                      blind: "Blocked behind firewalls / complex tunnels",
                      k6lab: "Zero-config local daemon execution"
                    },
                    {
                      feature: "Bottleneck Discovery",
                      blind: "After customers report 504 errors",
                      k6lab: "Instant AI root-cause pinpointing"
                    },
                    {
                      feature: "P95 Latency Precision",
                      blind: "Average approximations only",
                      k6lab: "Sub-millisecond histogram precision"
                    },
                    {
                      feature: "Testing Cost & Overhead",
                      blind: "Expensive cloud runners or manual scripts",
                      k6lab: "Free native Go execution on your hardware"
                    }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 font-sans font-medium text-white text-sm">
                        {row.feature}
                      </td>
                      <td className="py-4 px-6 text-zinc-400 flex items-center gap-2">
                        <XCircle size={15} className="text-zinc-600 shrink-0" />
                        <span>{row.blind}</span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-red-300 bg-red-950/20 border-x border-red-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-red-500 shrink-0" />
                          <span>{row.k6lab}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 5: FINAL CTA */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center border-t border-white/5">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk']">
              Never Ship Blindly Again.
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Run your first local stress test in under 60 seconds. Know your breaking point before you push your next release.
            </p>
            <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
              <Link to="/signup" className="btn-red text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                Start Testing Free
              </Link>
              <Link to="/platform" className="btn-ghost text-base px-8 py-3.5 rounded-xl">
                Explore Live Platform
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
