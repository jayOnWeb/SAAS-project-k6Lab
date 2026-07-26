import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Menu, X, Terminal } from 'lucide-react';
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
        ? 'bg-black/95 backdrop-blur-xl border-b border-red-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.9)]' 
        : 'bg-black/60 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo - Perfectly Scaled & Constrained */}
        <Link to="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
          <div className="w-8 h-8 rounded-lg bg-black border border-red-500/40 p-1 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
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

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" onClick={handleNavClick} className="btn-red text-sm py-2 px-4">
              <Terminal size={15} />
              Dashboard
              <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={handleNavClick} className="btn-ghost text-sm py-2 px-4">
                Sign In
              </Link>
              <Link to="/signup" onClick={handleNavClick} className="btn-red text-sm py-2 px-4">
                Start Testing Free
                <ArrowRight size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden p-2 text-zinc-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-zinc-950/98 border-b border-red-500/30 px-6 py-6 space-y-4 backdrop-blur-2xl">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`block py-2.5 text-base font-medium border-b border-white/5 ${
                location.pathname === item.path ? 'text-red-500 font-bold' : 'text-zinc-300'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 space-y-2">
            {user ? (
              <Link to="/dashboard" className="btn-red w-full justify-center" onClick={handleNavClick}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost w-full justify-center" onClick={handleNavClick}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn-red w-full justify-center" onClick={handleNavClick}>
                  Start Testing Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
