import { useEffect, useState } from 'react';
import { FileText, Globe2, Pause, Play, ShieldCheck } from 'lucide-react';

const TERMINAL_STEPS = [
  { text: 'k6 run --vus 100 --duration 30s auth-flow.js', type: 'cmd' },
  { text: 'loading script and threshold configuration', type: 'log' },
  { text: '020/100 VUs, 120 rps, p95=42ms', type: 'log' },
  { text: '080/100 VUs, 580 rps, p95=78ms', type: 'log' },
  { text: '100/100 VUs, 720 rps, p95=160ms', type: 'warn' },
  { text: 'connection_pool_exhausted at 15/15 connections', type: 'error' },
  { text: '100/100 VUs, 410 rps, p95=480ms', type: 'error' },
  { text: 'summary parsed: 42,910 requests, 2.4% failed', type: 'success' },
];

const REGIONS = [
  ['Dublin', '34ms', 'Stable'],
  ['Frankfurt', '42ms', 'Stable'],
  ['Tokyo', '190ms', 'Watch'],
  ['Oregon', '85ms', 'Stable'],
];

export default function TelemetryBento() {
  const [termLines, setTermLines] = useState([TERMINAL_STEPS[0]]);
  const [activeStep, setActiveStep] = useState(1);
  const [running, setRunning] = useState(true);
  const [gaugeValue, setGaugeValue] = useState(12);

  useEffect(() => {
    if (!running) return undefined;

    const interval = window.setInterval(() => {
      setActiveStep((currentStep) => {
        if (currentStep >= TERMINAL_STEPS.length) {
          setTermLines([TERMINAL_STEPS[0]]);
          return 1;
        }

        setTermLines((lines) => [...lines, TERMINAL_STEPS[currentStep]]);
        return currentStep + 1;
      });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    const target = activeStep >= 6 ? 94 : Math.max(12, activeStep * 12);
    const interval = window.setInterval(() => {
      setGaugeValue((value) => {
        if (value < target) return Math.min(value + 2, target);
        if (value > target) return Math.max(value - 2, target);
        return value;
      });
    }, 42);

    return () => window.clearInterval(interval);
  }, [activeStep]);

  const dash = (gaugeValue / 100) * 251.2;

  return (
    <section id="telemetry-bento" className="site-section" aria-labelledby="console-title">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Live console</span>
          <h2 id="console-title" className="section-title smaller">
            The run, the risk, and the fix in one workspace.
          </h2>
          <p className="section-copy">
            A compact command view pairs with AI notes and regional context, so the team can move from failure signal to action without switching tools.
          </p>
        </div>

        <div className="bento-grid">
          <div className="bento-panel terminal-panel">
            <div className="panel-topbar">
              <span>auth-flow.js / live stream</span>
              <button
                className="button-secondary"
                type="button"
                onClick={() => setRunning((value) => !value)}
              >
                {running ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
                {running ? 'Pause' : 'Resume'}
              </button>
            </div>

            <div className="terminal-lines" aria-live="polite">
              {termLines.map((line, index) => (
                <div className={`terminal-line ${line.type}`} key={`${line.text}-${index}`}>
                  <span aria-hidden="true">{line.type === 'cmd' ? '$' : '>'}</span>
                  <strong>{line.text}</strong>
                </div>
              ))}
            </div>

            <div className="terminal-summary">
              <div>
                <span>Throughput</span>
                <strong>{activeStep >= 5 ? '720 RPS' : '580 RPS'}</strong>
              </div>
              <div>
                <span>Users</span>
                <strong>{activeStep >= 4 ? '100 VUs' : '80 VUs'}</strong>
              </div>
              <div>
                <span>p95</span>
                <strong>{activeStep >= 6 ? '480ms' : '78ms'}</strong>
              </div>
            </div>
          </div>

          <div className="bento-panel">
            <div>
              <span className="eyebrow">Risk score</span>
              <h3>Anomaly coefficient</h3>
              <p>Tracks the active run against thresholds and marks the moment normal behavior changes.</p>
            </div>

            <div className="gauge" aria-label={`Anomaly coefficient ${gaugeValue} percent`}>
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={gaugeValue > 80 ? '#ff453a' : '#0071e3'}
                  strokeWidth="4"
                  strokeDasharray={`${dash} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="gauge-value">
                <strong>{gaugeValue}%</strong>
                <span>{gaugeValue > 80 ? 'Review' : 'Stable'}</span>
              </div>
            </div>

            <ul className="check-list">
              <li>
                <ShieldCheck size={18} aria-hidden="true" />
                <span>{gaugeValue > 80 ? 'Pool connections exhausted' : 'Thresholds currently in range'}</span>
              </li>
            </ul>
          </div>

          <div className="bento-panel">
            <div>
              <span className="eyebrow">Parser output</span>
              <h3>Raw logs become review notes.</h3>
              <p>k6lab keeps the machine detail intact while writing the readable summary your release team needs.</p>
            </div>

            <div className="raw-compare">
              <div>
                <FileText size={18} aria-hidden="true" />
                <strong>http_req_duration p95: 480.24</strong>
                <span>http_req_failed rate: 0.024</span>
              </div>
              <div>
                <ShieldCheck size={18} aria-hidden="true" />
                <strong>Authorization bottleneck detected.</strong>
                <span>Raise pool limit, warm token cache, retest at 500 VUs.</span>
              </div>
            </div>
          </div>

          <div className="bento-panel">
            <div>
              <span className="eyebrow">Edge context</span>
              <h3>Regional nodes stay visible.</h3>
              <p>Separate backend saturation from routing and geography before declaring a regression fixed.</p>
            </div>

            <div className="region-list">
              {REGIONS.map(([city, latency, state]) => (
                <div className="region-row" key={city}>
                  <span>
                    <Globe2 size={15} aria-hidden="true" />
                    {city}
                  </span>
                  <strong>{latency}</strong>
                  <em>{state}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
