import { BrainCircuit, PlugZap, ServerCog } from 'lucide-react';

const SPECS = [
  {
    icon: PlugZap,
    title: 'k6-native input',
    desc: 'Works with the artifacts your team already produces, including JSON summary output and endpoint-level timing data.',
  },
  {
    icon: ServerCog,
    title: 'Backend-aware reads',
    desc: 'Highlights database pools, cache strategy, queue pressure, and regional networking as first-class performance signals.',
  },
  {
    icon: BrainCircuit,
    title: 'Explainable AI layer',
    desc: 'Summaries are concise and review-friendly, with the source metrics kept close enough to audit before acting.',
  },
];

export default function About() {
  return (
    <section id="about" className="site-section compact" aria-labelledby="about-title">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">System specs</span>
          <h2 id="about-title" className="section-title smaller">
            Designed for engineering reviews, not vanity charts.
          </h2>
          <p className="section-copy">
            k6lab is a focused telemetry surface for teams who need to turn load-test output into a clear release decision.
          </p>
        </div>

        <div className="spec-grid">
          {SPECS.map(({ icon: Icon, title, desc }) => (
            <article className="spec-card" key={title}>
              <span className="icon-tile" aria-hidden="true">
                <Icon size={20} strokeWidth={2.1} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
