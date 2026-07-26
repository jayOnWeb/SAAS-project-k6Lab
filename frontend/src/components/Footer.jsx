import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Terminal, Heart } from 'lucide-react';

export default function Footer() {
  const handleNavClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#050508] border-t border-red-500/20 pt-16 pb-12 px-6 relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">
        {/* Brand Column (Spans 2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
            <div className="w-8 h-8 rounded-lg bg-black border border-red-500/40 p-1 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.3)] flex-shrink-0">
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
            Local-first performance testing platform with native k6 execution, real-time telemetry, and AI-powered performance insight.
          </p>
          <div className="flex items-center gap-2 font-mono text-xs text-red-400 bg-red-950/40 border border-red-500/30 px-3 py-1 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>Local-First Architecture</span>
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

        {/* Column 2: Developer Resources */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest">Developer</h4>
          <ul className="space-y-2 text-sm text-zinc-400 font-sans">
            <li><Link to="/docs#k6-install" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Install k6</Link></li>
            <li><Link to="/docs#agent-install" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Install Agent CLI</Link></li>
            <li><Link to="/platform" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Live Telemetry Stream</Link></li>
            <li><Link to="/features" onClick={handleNavClick} className="hover:text-red-400 transition-colors">AI Audit Engine</Link></li>
          </ul>
        </div>

        {/* Column 3: Platform & Account */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono text-white font-bold uppercase tracking-widest">Platform</h4>
          <ul className="space-y-2 text-sm text-zinc-400 font-sans">
            <li><Link to="/login" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Sign In</Link></li>
            <li><Link to="/signup" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Create Free Account</Link></li>
            <li><Link to="/dashboard" onClick={handleNavClick} className="hover:text-red-400 transition-colors">Dashboard Cockpit</Link></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
        <div>
          © {new Date().getFullYear()} K6 LAB. Your machine runs the test. K6 Lab makes sense of the result.
        </div>
        <div className="flex items-center gap-2 text-red-400 font-medium">
          <span>Red / Black / White Edition</span>
        </div>
      </div>
    </footer>
  );
}
