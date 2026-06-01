import { Activity, Database, Network, Server } from 'lucide-react';
import Sparkline from './Sparkline';

const LATENCY = [54, 58, 61, 70, 76, 88, 92, 116, 140, 168, 210, 260, 420, 480, 442, 390, 348, 310];

const METRICS = [
  { label: 'Requests', value: '42,910', delta: '+12.4% volume', icon: Activity },
  { label: 'p95 latency', value: '480ms', delta: 'above 310ms target', icon: Server },
  { label: 'Peak RPS', value: '1,842', delta: '+8.2% from baseline', icon: Network },
  { label: 'DB misses', value: '89%', delta: 'token cache cold path', icon: Database },
];

const ENDPOINTS = [
  { path: '/api/auth/token', method: 'POST', p95: '480ms', rps: '410', state: 'Review' },
  { path: '/api/orders/summary', method: 'GET', p95: '84ms', rps: '860', state: 'Stable' },
  { path: '/api/report/export', method: 'POST', p95: '210ms', rps: '290', state: 'Watch' },
  { path: '/api/catalog/search', method: 'GET', p95: '62ms', rps: '1,240', state: 'Stable' },
];

export default function DashboardShowcase() {
  return (
    <section id="dashboard" className="site-section" aria-labelledby="dashboard-title">
      <div className="section-inner">
        <div className="section-header">
          <span className="eyebrow">Dashboard</span>
          <h2 id="dashboard-title" className="section-title smaller">
            Dense telemetry without visual noise.
          </h2>
          <p className="section-copy">
            The dashboard is built for scanning during a run: large numbers, stable layout, and table rows that do not jump when values change.
          </p>
        </div>

        <div className="dashboard-shell" aria-label="Telemetry dashboard preview">
          <div className="panel-topbar">
            <span>stress-test-v3 / production-like stage</span>
            <span className="status-pill">
              <span className="status-dot" aria-hidden="true" />
              Run complete
            </span>
          </div>

          <div className="dashboard-grid">
            {METRICS.map(({ label, value, delta, icon: Icon }) => (
              <div className="metric-cell" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>
                  <Icon size={13} aria-hidden="true" /> {delta}
                </small>
              </div>
            ))}

            <div className="chart-cell">
              <span className="chart-label">Latency curve</span>
              <Sparkline data={LATENCY} color="#0071e3" height={118} />
            </div>

            <div className="metric-cell">
              <span>Diagnosis</span>
              <strong>Pool limit</strong>
              <small>Primary fix candidate</small>
            </div>

            <div className="table-cell">
              <span className="table-label">Endpoint load parameters</span>
              <div className="table-scroll">
                <table className="endpoint-table">
                  <thead>
                    <tr>
                      <th>Endpoint</th>
                      <th>Method</th>
                      <th>p95</th>
                      <th>RPS</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ENDPOINTS.map((endpoint) => (
                      <tr key={endpoint.path}>
                        <td>{endpoint.path}</td>
                        <td>{endpoint.method}</td>
                        <td>{endpoint.p95}</td>
                        <td>{endpoint.rps}</td>
                        <td>{endpoint.state}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
