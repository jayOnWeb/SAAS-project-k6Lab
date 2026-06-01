import { CheckCircle2, ShieldCheck } from 'lucide-react';

const FINDINGS = [
  ['Primary pressure', 'Postgres pool saturation'],
  ['Trigger point', '500 concurrent users'],
  ['Secondary signal', '89% token cache misses'],
  ['Suggested fix', 'Pool 15 to 40 plus Redis cache'],
];

const BENEFITS = [
  'Keeps raw k6 metrics attached to every AI recommendation.',
  'Names the threshold where system behavior changed.',
  'Separates symptoms from the likely infrastructure constraint.',
  'Produces release-review language without hiding technical evidence.',
];

function DiagnosticPanel() {
  return (
    <div className="diagnostic-panel" aria-label="AI diagnostic example">
      <div className="panel-topbar">
        <span>Aether diagnostic panel</span>
        <span className="status-pill">
          <span className="status-dot" aria-hidden="true" />
          Evidence linked
        </span>
      </div>

      <div className="diagnostic-body">
        <div className="message user">
          Why does authorization latency jump after the run reaches 500 concurrent users?
        </div>
        <div className="message">
          The first sustained regression appears when Postgres reaches its configured connection ceiling. Cache misses then increase request work per user and push p95 latency to 480ms.
        </div>

        <div className="analysis-block">
          {FINDINGS.map(([label, value]) => (
            <div className="analysis-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AIAnalysis() {
  return (
    <section id="ai-analysis" className="site-section compact" aria-labelledby="diagnostics-title">
      <div className="section-inner split-section">
        <DiagnosticPanel />

        <div className="copy-stack">
          <div className="section-header left">
            <span className="eyebrow">Diagnostics</span>
            <h2 id="diagnostics-title" className="section-title smaller">
              Answers that keep their evidence visible.
            </h2>
            <p className="section-copy">
              k6lab reads the run like an engineer would: thresholds first, symptoms second, and recommended action only after the signal is clear.
            </p>
          </div>

          <ul className="check-list">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <p className="section-copy">
            <ShieldCheck size={18} aria-hidden="true" /> Recommendations are written for humans, but backed by the original run data.
          </p>
        </div>
      </div>
    </section>
  );
}
