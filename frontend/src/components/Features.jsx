import { BarChart3, Bot, CloudCog, FileJson, Globe2, SlidersHorizontal } from 'lucide-react';

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Live Run Dashboards',
    desc: 'Track response time, request volume, failures, and virtual users in one calm view that stays readable under load.',
  },
  {
    icon: Bot,
    title: 'AI Failure Notes',
    desc: 'Translate raw k6 output into direct explanations of pool saturation, cache misses, queue pressure, and latency spikes.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Scenario Tuning',
    desc: 'Compare thresholds, stages, and endpoint groups without turning every stress experiment into a configuration hunt.',
  },
  {
    icon: FileJson,
    title: 'Native k6 Parsing',
    desc: 'Drop in standard JSON summaries and preserve the metrics engineers already trust, with clearer presentation.',
  },
  {
    icon: Globe2,
    title: 'Regional Signals',
    desc: 'Review edge performance across nodes so geography, routing, and provider issues stop hiding inside averages.',
  },
  {
    icon: CloudCog,
    title: 'Shareable Briefs',
    desc: 'Package findings for release reviews with concise export-ready summaries, evidence, and recommended next actions.',
  },
];

function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <article className="feature-card">
      <span className="icon-tile" aria-hidden="true">
        <Icon size={20} strokeWidth={2.1} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
    </article>
  );
}

export default function Features() {
  return (
    <section id="features" className="site-section" aria-labelledby="features-title">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Core features</span>
          <h2 id="features-title" className="section-title smaller">
            Built for the moment a load test becomes a decision.
          </h2>
          <p className="section-copy">
            k6lab keeps the high-signal parts of performance testing close together: the run, the evidence, and the next fix.
          </p>
        </div>

        <div className="feature-grid">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
