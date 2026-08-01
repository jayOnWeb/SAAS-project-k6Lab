import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, Server, Database, UserCheck, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PrivacyPage() {
  const lastUpdated = "August 2, 2026";

  const sections = [
    { id: "overview", title: "1. Overview & Local-First Philosophy" },
    { id: "information-collection", title: "2. Information We Collect" },
    { id: "how-we-use-data", title: "3. How We Use Your Data" },
    { id: "local-agent-security", title: "4. Local Agent & Security Model" },
    { id: "data-sharing", title: "5. Data Sharing & Third Parties" },
    { id: "cookies", title: "6. Cookies & Session Storage" },
    { id: "your-rights", title: "7. Your Rights & Data Retention" },
  ];

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      {/* Red Aurora Background Spotlight */}
      <div className="red-aurora" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative z-10">
        {/* Header Hero Banner */}
        <section className="max-w-7xl mx-auto px-6 py-12 border-b border-white/10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="badge-red inline-flex items-center gap-1.5 font-mono text-xs">
                <Shield className="w-3.5 h-3.5" /> LEGAL & PRIVACY TRUST CENTER
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                Privacy <span className="text-gradient-red">Policy</span>
              </h1>
              <p className="text-zinc-400 text-base max-w-2xl font-sans">
                At K6 LAB, privacy is architected directly into our local-first engine. We ensure your API endpoints, payload data, and performance benchmarks remain strictly confidential.
              </p>
            </div>
            <div className="font-mono text-xs text-zinc-500 bg-zinc-950/80 border border-white/10 px-4 py-2.5 rounded-xl self-start md:self-auto shrink-0">
              <span className="text-zinc-400 font-semibold">Effective Date:</span> {lastUpdated}
            </div>
          </div>
        </section>

        {/* Main Content Layout with Sticky Sidebar Index */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-28 space-y-4 p-5 bg-zinc-950/60 border border-white/10 rounded-2xl backdrop-blur-md">
                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-red-500" /> On This Page
                </h3>
                <nav className="space-y-1.5 text-xs font-mono">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block text-zinc-400 hover:text-red-400 transition-colors py-1 truncate"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Privacy Document Body */}
            <article className="lg:col-span-3 space-y-12 text-zinc-300 font-sans leading-relaxed">
              
              {/* Highlight Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-950/80 border border-red-500/30 rounded-xl space-y-2">
                  <div className="p-2 w-fit bg-red-500/10 rounded-lg text-red-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="font-mono text-sm font-bold text-white">Local Execution</h4>
                  <p className="text-xs text-zinc-400">Your test scripts and target API endpoints are executed locally by your machine agent.</p>
                </div>

                <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-xl space-y-2">
                  <div className="p-2 w-fit bg-white/10 rounded-lg text-white">
                    <EyeOff className="w-5 h-5" />
                  </div>
                  <h4 className="font-mono text-sm font-bold text-white">Zero Payload Storage</h4>
                  <p className="text-xs text-zinc-400">We do not log or store private request/response body payloads from your local test runs.</p>
                </div>

                <div className="p-4 bg-zinc-950/80 border border-white/10 rounded-xl space-y-2">
                  <div className="p-2 w-fit bg-emerald-500/10 rounded-lg text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h4 className="font-mono text-sm font-bold text-white">SOC-2 & GDPR Ready</h4>
                  <p className="text-xs text-zinc-400">Designed following strict data minimization principles and encrypted telemetry transmission.</p>
                </div>
              </div>

              {/* Section 1 */}
              <section id="overview" className="space-y-4 pt-4 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">01.</span> Overview &amp; Local-First Philosophy
                </h2>
                <p>
                  Welcome to K6 LAB. We are committed to honoring and protecting the privacy of developers, performance engineers, and engineering teams using our local-first performance testing engine.
                </p>
                <p>
                  Unlike traditional cloud load testing solutions that require uploading your private API endpoints, staging environments, and database credentials to centralized servers, K6 LAB operates on a <strong className="text-white">Local-First Architecture</strong>. Your local k6 agent triggers tests directly from your environment (localhost, intranet, docker, or private cloud) while syncing only high-level telemetry metrics (RPS, latency p95/p99, error rates) to your visual dashboard.
                </p>
              </section>

              {/* Section 2 */}
              <section id="information-collection" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">02.</span> Information We Collect
                </h2>
                <p>
                  We collect information necessary to provide authentication, workspace management, and aggregated real-time test telemetry visualization:
                </p>
                <div className="space-y-3">
                  <div className="p-4 bg-zinc-950/60 border border-white/10 rounded-xl">
                    <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <UserCheck className="w-4 h-4 text-red-400" /> Account & Profile Information
                    </h4>
                    <p className="text-xs text-zinc-400">
                      When creating an account, we collect your name, email address, password hash (encrypted via bcrypt/argon2), and optional organization details.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/60 border border-white/10 rounded-xl">
                    <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <Server className="w-4 h-4 text-red-400" /> Aggregated Test Telemetry
                    </h4>
                    <p className="text-xs text-zinc-400">
                      During active test runs, the local agent streams anonymized statistical aggregates (http_req_duration, http_reqs per sec, virtual user counts, CPU/memory usage of test runner) to feed the live dashboard.
                    </p>
                  </div>

                  <div className="p-4 bg-zinc-950/60 border border-white/10 rounded-xl">
                    <h4 className="font-mono text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <Database className="w-4 h-4 text-red-400" /> System & Agent Diagnostics
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Basic agent diagnostic data such as local CLI version, operating system identifier, and agent uptime to assist in debugging agent connection issues.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="how-we-use-data" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">03.</span> How We Use Your Data
                </h2>
                <p>We restrict our data usage to core operational purposes:</p>
                <ul className="space-y-2 list-disc list-inside text-zinc-300 text-sm pl-2">
                  <li>Rendering live graphs, historical latency trends, and AI-driven performance bottleneck analyses.</li>
                  <li>Authenticating user sessions and maintaining project workspace configurations.</li>
                  <li>Sending critical notifications regarding test completions, threshold breaches, or security updates.</li>
                  <li>Improving platform stability, fixing infrastructure bugs, and enhancing agent performance.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="local-agent-security" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">04.</span> Local Agent &amp; Security Model
                </h2>
                <p>
                  Security is paramount for internal developer tools. K6 LAB ensures end-to-end data integrity through the following controls:
                </p>
                <div className="p-5 bg-zinc-950 border border-red-500/20 rounded-xl space-y-3 font-mono text-xs text-zinc-300">
                  <div className="flex items-start gap-2 text-white font-bold">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>TLS 1.3 Encryption in Transit</span>
                  </div>
                  <p className="pl-6 text-zinc-400 font-sans text-xs">All web socket streams and HTTP API communications between the local agent and K6 LAB servers are encrypted using modern TLS 1.3 protocols.</p>

                  <div className="flex items-start gap-2 text-white font-bold pt-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Zero Environment Variable Scraping</span>
                  </div>
                  <p className="pl-6 text-zinc-400 font-sans text-xs">The agent runs strictly inside your specified execution directory and does not harvest machine environment secrets or credentials.</p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="data-sharing" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">05.</span> Data Sharing &amp; Third Parties
                </h2>
                <p>
                  <strong className="text-white">We do not sell, rent, or trade your personal data or test telemetry to third parties.</strong>
                </p>
                <p className="text-sm text-zinc-400">
                  We only share minimal necessary information with trusted infrastructure providers required to operate our web application (e.g. database hosting providers, cloud storage, authentication services). All third-party providers comply with equivalent security standards and data processing agreements.
                </p>
              </section>

              {/* Section 6 */}
              <section id="cookies" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">06.</span> Cookies &amp; Session Storage
                </h2>
                <p className="text-sm">
                  We use essential session tokens stored in browser LocalStorage or HttpOnly cookies to keep you signed in securely. We do not employ third-party advertising cookies or cross-site tracking scripts.
                </p>
              </section>

              {/* Section 7 */}
              <section id="your-rights" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">07.</span> Your Rights &amp; Data Retention
                </h2>
                <p className="text-sm">
                  You maintain full ownership of your data. Under applicable privacy laws (GDPR, CCPA), you have the right to:
                </p>
                <ul className="space-y-2 list-disc list-inside text-zinc-300 text-sm pl-2">
                  <li>Export your test history and project performance metrics.</li>
                  <li>Request permanent deletion of your user account and associated project workspaces.</li>
                  <li>Opt out of optional email updates and product announcements at any time.</li>
                </ul>
              </section>

            </article>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
