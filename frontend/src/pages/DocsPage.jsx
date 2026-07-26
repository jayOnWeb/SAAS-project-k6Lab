import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, ArrowRight, Terminal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DocsPage() {
  const [copiedStep, setCopiedStep] = useState(null);

  const copyToClipboard = (text, step) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="badge-red mb-4">DOCUMENTATION &amp; QUICKSTART</div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
            Start Testing in <span className="text-gradient-red">Minutes.</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Connect your machine, run your first local test, and start understanding your API&apos;s performance.
          </p>
        </section>

        {/* SETUP STEPS */}
        <section className="max-w-4xl mx-auto px-6 py-12 space-y-12">
          {/* STEP 01 */}
          <div className="glass-card p-8 hover:border-red-500/50 transition-colors" id="k6-install">
            <div className="flex items-center gap-3 text-xs font-mono text-red-500 font-bold mb-4">
              <span className="px-3 py-1 bg-red-950/80 border border-red-500/30 rounded-full">STEP 01</span>
              <span>PREREQUISITE</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Install k6</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              K6 Lab uses native k6 for load-test execution. Install k6 on the machine you want to use as your test agent.
            </p>

            <div className="space-y-4">
              <div className="code-container p-5 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 font-mono text-xs block mb-1"># macOS (Homebrew)</span>
                  <code className="text-red-400 text-sm">$ brew install k6</code>
                </div>
                <button 
                  onClick={() => copyToClipboard('brew install k6', 'k6-brew')}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Copy code"
                >
                  {copiedStep === 'k6-brew' ? <Check size={18} className="text-red-500" /> : <Copy size={18} />}
                </button>
              </div>

              <div className="code-container p-5 flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 font-mono text-xs block mb-1"># Windows (Chocolatey)</span>
                  <code className="text-red-400 text-sm">$ choco install k6</code>
                </div>
                <button 
                  onClick={() => copyToClipboard('choco install k6', 'k6-choco')}
                  className="p-2 text-zinc-400 hover:text-white transition-colors"
                  aria-label="Copy code"
                >
                  {copiedStep === 'k6-choco' ? <Check size={18} className="text-red-500" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* STEP 02 */}
          <div className="glass-card p-8 hover:border-red-500/50 transition-colors" id="agent-install">
            <div className="flex items-center gap-3 text-xs font-mono text-red-500 font-bold mb-4">
              <span className="px-3 py-1 bg-red-950/80 border border-red-500/30 rounded-full">STEP 02</span>
              <span>AGENT SETUP</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Install the Agent</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Install the official K6 Lab agent CLI globally via npm.
            </p>
            <div className="code-container p-5 flex items-center justify-between">
              <code className="text-red-400 text-sm">$ npm install -g k6lab-agent</code>
              <button 
                onClick={() => copyToClipboard('npm install -g k6lab-agent', 'step-2')}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Copy code"
              >
                {copiedStep === 'step-2' ? <Check size={18} className="text-red-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* STEP 03 */}
          <div className="glass-card p-8 hover:border-red-500/50 transition-colors" id="agent-auth">
            <div className="flex items-center gap-3 text-xs font-mono text-red-500 font-bold mb-4">
              <span className="px-3 py-1 bg-red-950/80 border border-red-500/30 rounded-full">STEP 03</span>
              <span>AUTHENTICATION</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Connect Your Agent</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Authenticate your CLI agent using your secret token from your K6 Lab dashboard.
            </p>
            <div className="code-container p-5 flex items-center justify-between">
              <code className="text-red-400 text-sm">$ k6lab-agent login YOUR_AGENT_TOKEN</code>
              <button 
                onClick={() => copyToClipboard('k6lab-agent login YOUR_AGENT_TOKEN', 'step-3')}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Copy code"
              >
                {copiedStep === 'step-3' ? <Check size={18} className="text-red-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* STEP 04 */}
          <div className="glass-card p-8 hover:border-red-500/50 transition-colors" id="agent-start">
            <div className="flex items-center gap-3 text-xs font-mono text-red-500 font-bold mb-4">
              <span className="px-3 py-1 bg-red-950/80 border border-red-500/30 rounded-full">STEP 04</span>
              <span>EXECUTION</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Start the Agent</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Run the agent in your terminal to begin listening for incoming test dispatches.
            </p>
            <div className="code-container p-5 flex items-center justify-between">
              <code className="text-red-400 text-sm">$ k6lab-agent start</code>
              <button 
                onClick={() => copyToClipboard('k6lab-agent start', 'step-4')}
                className="p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Copy code"
              >
                {copiedStep === 'step-4' ? <Check size={18} className="text-red-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          {/* STEP 05 */}
          <div className="glass-card p-8 hover:border-red-500/50 transition-colors">
            <div className="flex items-center gap-3 text-xs font-mono text-red-500 font-bold mb-4">
              <span className="px-3 py-1 bg-red-950/80 border border-red-500/30 rounded-full">STEP 05</span>
              <span>DISPATCH</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Run Your First Test</h2>
            <p className="text-zinc-400 mb-4 leading-relaxed">
              Create a test from the K6 Lab platform. Configure:
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6 font-mono text-sm">
              <div className="p-4 bg-[#08080c] border border-white/5 rounded-xl text-center text-zinc-200">Target URL</div>
              <div className="p-4 bg-[#08080c] border border-white/5 rounded-xl text-center text-zinc-200">Virtual Users</div>
              <div className="p-4 bg-[#08080c] border border-white/5 rounded-xl text-center text-zinc-200">Duration</div>
            </div>
            <p className="text-zinc-400 text-sm">
              Then dispatch the test to your connected local agent.
            </p>
          </div>

          {/* STEP 06 */}
          <div className="glass-card-red p-8">
            <div className="flex items-center gap-3 text-xs font-mono text-red-400 font-bold mb-4">
              <span className="px-3 py-1 bg-black/90 border border-red-500/40 rounded-full">STEP 06</span>
              <span>ANALYSIS</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3 font-['Space_Grotesk']">Watch the Results</h2>
            <p className="text-zinc-300 leading-relaxed">
              Monitor live logs and telemetry from the running test. When the test is complete, review the final metrics and use the AI Performance Audit to understand what to test next.
            </p>
            <div className="mt-8">
              <Link to="/signup" className="btn-red text-sm py-2.5 px-5">
                Get Started Now
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
