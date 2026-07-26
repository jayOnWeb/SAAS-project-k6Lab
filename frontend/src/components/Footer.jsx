import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Terminal, Heart, Sparkles, Send } from 'lucide-react';
import { BorderBeam } from './ui/border-beam';

export default function Footer() {
  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-12 px-6 relative z-10 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-16">
        {/* Pre-footer Call to Action Banner */}
        <div className="relative rounded-3xl bg-zinc-950 border border-white/10 p-8 md:p-12 overflow-hidden shadow-2xl">
          <BorderBeam size={350} duration={12} colorFrom="#ef4444" colorTo="#dc2626" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/30">
                <Sparkles className="w-3.5 h-3.5" /> High-Performance Infrastructure
              </span>
              <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
                Ready to eliminate <span className="text-gradient-red">latency bottlenecks</span>?
              </h3>
              <p className="text-zinc-400 text-sm max-w-xl">
                Run your first distributed k6 test script in less than 2 minutes. Free 500 Virtual Users included forever.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link to="/signup" onClick={handleNavClick} className="btn-red py-3.5 px-6 text-sm rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.5)]">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/docs" onClick={handleNavClick} className="btn-ghost py-3.5 px-6 text-sm rounded-xl">
                Explore Documentation
              </Link>
            </div>
          </div>
        </div>

        {/* Directory links grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group" onClick={handleNavClick}>
              <div className="w-9 h-9 rounded-xl bg-zinc-950 border border-red-500/40 p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <img 
                  src="/logo.png" 
                  alt="K6 LAB Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center leading-none">
                <span className="text-white font-extrabold tracking-tight text-xl font-['Space_Grotesk']">K6</span>
                <span className="text-red-500 font-extrabold tracking-tight text-xl font-['Space_Grotesk'] ml-0.5">LAB</span>
              </div>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm font-sans">
              Local-first performance testing platform with native k6 execution, real-time telemetry, and AI-powered performance insights.
            </p>
            <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational (99.99%)</span>
            </div>
          </div>

          {/* Column 1: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-2 text-sm text-zinc-400 font-sans">
              <li><Link to="/" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Home</Link></li>
              <li><Link to="/features" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" onClick={handleNavClick} className="hover:text-red-400 transition-colors">How It Works</Link></li>
              <li><Link to="/platform" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Platform</Link></li>
              <li><Link to="/docs" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Docs &amp; Quickstart</Link></li>
            </ul>
          </div>

          {/* Column 2: Developer */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest">Developer</h4>
            <ul className="space-y-2 text-sm text-zinc-400 font-sans">
              <li><Link to="/docs#k6-install" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Install k6 CLI</Link></li>
              <li><Link to="/docs#agent-install" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Install Agent</Link></li>
              <li><Link to="/platform" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Telemetry Stream</Link></li>
              <li><Link to="/features" onClick={handleNavClick} className="hover:text-red-400 transition-colors">AI Audit Engine</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest">Stay Updated</h4>
            <p className="text-xs text-zinc-400">Subscribe for load testing benchmarks and performance engineering tips.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-1 bg-zinc-950 border border-white/10 p-1.5 rounded-xl">
              <input
                type="email"
                placeholder="developer@company.com"
                className="w-full bg-transparent px-2 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none"
              />
              <button type="submit" className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            © {new Date().getFullYear()} K6 LAB. Your machine runs the test. K6 Lab makes sense of the result.
          </div>
          <div className="flex items-center gap-2 text-red-400 font-medium">
            <span>Red / Black / White SaaS Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
