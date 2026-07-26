import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X, Terminal, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Features', path: '/features' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Platform', path: '/platform' },
  { label: 'Docs', path: '/docs' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/90 backdrop-blur-xl border-b border-red-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' 
        : 'bg-black/40 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={handleNavClick}>
          <div className="relative w-9 h-9 rounded-xl bg-zinc-950 border border-red-500/40 p-1.5 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300 group-hover:scale-105 group-hover:border-red-500">
            <img 
              src="/logo.png" 
              alt="K6 LAB Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex items-center leading-none">
            <span className="text-white font-extrabold tracking-tight text-xl font-['Space_Grotesk']">K6</span>
            <span className="text-red-500 font-extrabold tracking-tight text-xl font-['Space_Grotesk'] ml-0.5">LAB</span>
            <span className="ml-2 hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
              v2.4
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links with Motion Pill */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-950/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`relative px-4 py-1.5 text-xs font-mono font-medium transition-colors cursor-pointer rounded-full ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600/30 via-red-500/20 to-red-600/30 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.25)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" onClick={handleNavClick} className="btn-red text-xs py-2 px-4 rounded-xl">
              <Terminal size={14} />
              Dashboard
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={handleNavClick} className="btn-ghost text-xs py-2 px-4 rounded-xl">
                Sign In
              </Link>
              <Link to="/signup" onClick={handleNavClick} className="btn-red text-xs py-2 px-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                Start Testing Free
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 text-zinc-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-zinc-950/98 border-b border-red-500/30 px-6 py-6 space-y-4 backdrop-blur-2xl"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`block py-2.5 text-sm font-mono border-b border-white/5 ${
                location.pathname === item.path ? 'text-red-500 font-bold' : 'text-zinc-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            {user ? (
              <Link to="/dashboard" className="btn-red w-full justify-center text-sm" onClick={handleNavClick}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost w-full justify-center text-sm" onClick={handleNavClick}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn-red w-full justify-center text-sm" onClick={handleNavClick}>
                  Start Testing Free
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
}
