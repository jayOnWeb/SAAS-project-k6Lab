import { useEffect, useState } from 'react';
import { Activity, ArrowRight, Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Diagnostics', href: '/#ai-analysis' },
  { label: 'Dashboard', href: '/#dashboard' },
  { label: 'Specs', href: '/#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav-inner">
        <Link className="brand-lockup" to="/" aria-label="k6lab home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <Activity size={17} strokeWidth={2.4} />
          </span>
          <span>k6lab</span>
        </Link>

        <nav className="nav-links" aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          {user ? (
            <Link className="button-primary" to="/dashboard">
              Dashboard
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ) : (
            <Link className="button-primary" to="/signup">
              Get Started
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}

          <Link
            className="nav-avatar flex items-center justify-center border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:text-white transition-all w-8 h-8 rounded-full"
            to={user ? "/dashboard" : "/login"}
            aria-label="User profile"
          >
            <User size={16} strokeWidth={2} />
          </Link>
        </div>

        <button
          className="nav-menu-button"
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
          <div className="mobile-nav-actions">
            {user ? (
              <Link
                className="button-primary"
                to="/dashboard"
                onClick={closeMenu}
              >
                Dashboard
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            ) : (
              <Link
                className="button-primary"
                to="/signup"
                onClick={closeMenu}
              >
                Get Started
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            )}
            <Link
              className="nav-avatar flex items-center justify-center border border-zinc-800 bg-zinc-900 text-zinc-400 w-8 h-8 rounded-full mt-2"
              to={user ? "/dashboard" : "/login"}
              onClick={closeMenu}
              aria-label="User profile"
            >
              <User size={16} strokeWidth={2} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
