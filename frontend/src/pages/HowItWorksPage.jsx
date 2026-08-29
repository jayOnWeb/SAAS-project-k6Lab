import { Link } from 'react-router-dom';
import { ArrowRight, Terminal, Sliders, Server, Zap, Activity, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const STEPS = [
  {
    num: '01',
    title: 'Connect Your Machine.',
    desc: 'Install the k6lab-agent CLI on the machine that can reach the API you want to test.',
    icon: Terminal,
  },
  {
    num: '02',
    title: 'Configure Your Test.',
    desc: 'Choose your target URL, virtual users, and test duration from the K6 Lab platform.',
    icon: Sliders,
  },
  {
    num: '03',
    title: 'Your Local Agent Receives the Job.',
    desc: 'The K6 Lab backend coordinates the test and your connected local agent picks up the queued job.',
    icon: Server,
  },
  {
    num: '04',
    title: 'Native k6 Runs on Your Machine.',
    desc: 'The agent generates and executes the k6 test locally. Your private or local API does not need to be exposed to a remote load-testing server.',
    icon: Zap,
  },
  {
    num: '05',
    title: 'Telemetry Streams Back in Real Time.',
    desc: 'As the test runs, logs and performance data are sent back to the K6 Lab cockpit so you can watch the run as it happens.',
    icon: Activity,
  },
  {
    num: '06',
    title: 'Understand the Result.',
    desc: 'When the test is complete, review your final metrics and trigger an AI Performance Audit to decide what to test next.',
    icon: Sparkles,
  },
];

import SEO from '../components/SEO';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      <SEO 
        title="How It Works — Local Agent & Native k6 Workflow"
        description="Learn how K6 LAB connects your local CLI agent with native k6 binaries to run load tests on your API with zero latency."
        keywords="how k6 lab works, k6 local agent, performance testing workflow, API load test setup, k6 execution architecture"
      />
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="badge-red mb-4">THE WORKFLOW</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
            From Your Terminal to <br />
            <span className="text-gradient-red">Performance Insight.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-8">
            One local agent. One native k6 test. One focused performance cockpit.
          </p>
        </section>

        {/* 6 STEP CARDS */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-t border-white/5">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STEPS.map((step) => {
              const IconComp = step.icon;
              return (
                <div key={step.num} className="glass-card p-8 flex flex-col justify-between hover:border-red-500/60 transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-2xl font-extrabold text-red-500">{step.num}</span>
                      <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/30 text-red-500 flex items-center justify-center group-hover:border-red-500 transition-colors">
                        <IconComp size={22} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-['Space_Grotesk']">Step {step.num} — {step.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FULL FLOW VISUAL DIAGRAM */}
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4 font-['Space_Grotesk']">
              Full Flow Visual Pipeline
            </h2>
            <p className="text-zinc-400">Complete execution lifecycle from trigger to audit.</p>
          </div>

          <div className="glass-card-red p-8">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 text-center font-mono text-xs">
              {[
                'CONFIGURE TEST',
                'QUEUE TEST JOB',
                'LOCAL AGENT',
                'NATIVE k6',
                'LIVE LOGS + TELEMETRY',
                'FINAL METRICS',
                'AI PERFORMANCE AUDIT'
              ].map((stage, idx) => (
                <div key={stage} className="bg-[#08080c] border border-red-500/30 p-4 rounded-xl flex flex-col justify-center items-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  <span className="text-red-500 font-bold text-[10px] mb-1">STAGE 0{idx + 1}</span>
                  <span className="text-white font-semibold">{stage}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center border-t border-white/5">
          <h2 className="text-3xl font-extrabold text-white mb-4 font-['Space_Grotesk']">Ready to Run Your First Test?</h2>
          <div className="mt-6">
            <Link to="/docs" className="btn-red text-base px-8 py-3.5">
              Read the Setup Docs
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
