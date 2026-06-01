import { Activity, ExternalLink, GitBranch } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Diagnostics', href: '#ai-analysis' },
      { label: 'Dashboard', href: '#dashboard' },
      { label: 'Console', href: '#telemetry-bento' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'k6 Documentation', href: 'https://k6.io/docs/' },
      { label: 'Load test planning', href: '#features' },
      { label: 'Release reviews', href: '#about' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'GitHub', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-note">
          k6lab is an independent diagnostic interface for k6-style performance workflows. It is not affiliated with Grafana Labs. Demo metrics and AI recommendations shown on this page are representative examples for product storytelling.
        </p>

        <div className="footer-grid">
          <div>
            <h2>
              <Activity size={15} aria-hidden="true" /> k6lab
            </h2>
            <p>
              Performance telemetry parsed into clear run evidence, diagnostics, and review-ready findings.
            </p>
            <div className="footer-social">
              <a className="button-link" href="#" aria-label="k6lab on GitHub">
                <GitBranch size={18} aria-hidden="true" />
                GitHub
              </a>
              <a className="button-link" href="#" aria-label="k6lab on LinkedIn">
                <ExternalLink size={18} aria-hidden="true" />
                LinkedIn
              </a>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer-bottom">
          <span>Copyright 2026 k6lab. All rights reserved.</span>
          <span>Privacy Policy | Terms of Use | Site Map</span>
        </div>
      </div>
    </footer>
  );
}
