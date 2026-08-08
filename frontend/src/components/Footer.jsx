import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Terminal, Heart, Sparkles } from 'lucide-react';
import { BorderBeam } from './ui/border-beam';
import SpecularButton from './SpecularButton';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
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
              <li><Link to="/why" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Why K6 Lab</Link></li>
              <li><Link to="/features" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" onClick={handleNavClick} className="hover:text-red-400 transition-colors">How It Works</Link></li>
              <li><Link to="/platform" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Platform</Link></li>
              <li><Link to="/docs" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Docs &amp; Quickstart</Link></li>
            </ul>
          </div>

          {/* Column 2: Legal & Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest">Legal &amp; Resources</h4>
            <ul className="space-y-2 text-sm text-zinc-400 font-sans">
              <li><Link to="/privacy" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link to="/docs#k6-install" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Install k6 CLI</Link></li>
              <li><Link to="/docs#agent-install" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Install Agent</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span>© {new Date().getFullYear()} K6 LAB.</span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <Link to="/privacy" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Privacy Policy</Link>
            <span className="text-zinc-600">•</span>
            <Link to="/terms" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Terms &amp; Conditions</Link>
          </div>

          {/* Mysterious Dev SpecularButton Integration */}
          <div className="flex items-center gap-3 bg-zinc-950/80 border border-red-500/20 px-4 py-2 rounded-2xl shadow-[0_0_25px_rgba(239,68,68,0.15)]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
                Mysterious Dev:
              </span>
            </div>

            <SpecularButton
              size="sm"
              radius={12}
              tint="#ef4444"
              tintOpacity={0.15}
              blur={8}
              textColor="#f5f5f5"
              lineColor="#ef4444"
              baseColor="#71717a"
              intensity={1.5}
              shineSize={15}
              shineFade={35}
              thickness={1.5}
              speed={0.4}
              followMouse={true}
              proximity={300}
              autoAnimate={false}
              onClick={() => window.open('https://github.com/jayOnWeb', '_blank', 'noopener,noreferrer')}
              className="px-3.5 py-2 font-mono text-xs font-semibold tracking-wide hover:scale-105 transition-transform"
            >
              <span className="flex items-center gap-2">
                <GithubIcon className="w-4 h-4 text-red-400 transition-transform duration-300 group-hover:rotate-12" />
                <span className="text-white font-bold font-mono">@jayOnWeb</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-widest font-mono font-bold">
                  ⚡ Arch
                </span>
              </span>
            </SpecularButton>
          </div>
        </div>
      </div>
    </footer>
  );
}

