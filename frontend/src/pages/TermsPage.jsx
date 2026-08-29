import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldAlert, CheckCircle2, FileText, AlertTriangle, Terminal, Cpu, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import SEO from '../components/SEO';

export default function TermsPage() {
  const lastUpdated = "August 2, 2026";

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "platform-description", title: "2. Description of Service" },
    { id: "user-accounts", title: "3. Account Registration & Security" },
    { id: "acceptable-use", title: "4. Acceptable Use Policy" },
    { id: "subscriptions-billing", title: "5. Subscriptions & Free Tier" },
    { id: "intellectual-property", title: "6. Intellectual Property Rights" },
    { id: "disclaimers-liability", title: "7. Disclaimers & Limitation of Liability" },
    { id: "termination", title: "8. Termination & Modifications" },
  ];

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500/40 selection:text-white relative">
      <SEO 
        title="Terms of Service & Usage Policy"
        description="Review K6 LAB Terms of Service, acceptable load testing use guidelines, and platform service terms."
        keywords="k6 lab terms of service, acceptable use policy, load testing terms"
      />
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
                <Scale className="w-3.5 h-3.5" /> TERMS OF SERVICE & AGREEMENT
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
                Terms &amp; <span className="text-gradient-red">Conditions</span>
              </h1>
              <p className="text-zinc-400 text-base max-w-2xl font-sans">
                Please review these Terms and Conditions carefully. They govern your access to and use of the K6 LAB platform, CLI agent tools, and performance telemetry services.
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
                  <FileText className="w-3.5 h-3.5 text-red-500" /> Navigation Index
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

            {/* Terms Document Body */}
            <article className="lg:col-span-3 space-y-12 text-zinc-300 font-sans leading-relaxed">
              
              {/* Highlight Callout Banner */}
              <div className="p-5 bg-gradient-to-r from-red-950/40 via-zinc-950 to-zinc-950 border border-red-500/30 rounded-2xl space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span>Important Notice: Load Testing Ownership</span>
                </div>
                <p className="text-zinc-300 font-sans text-xs leading-normal">
                  You agree to only run k6 load tests against API targets, infrastructure, or servers that you own, operate, or have explicit written authorization to test. Executing stress or denial-of-service tests against unauthorized third-party systems is strictly prohibited.
                </p>
              </div>

              {/* Section 1 */}
              <section id="acceptance" className="space-y-4 pt-4 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">01.</span> Acceptance of Terms
                </h2>
                <p>
                  By accessing, registering for, or using K6 LAB (including our web application, desktop app, local agent CLI, and developer documentation), you confirm that you have read, understood, and agreed to be bound by these Terms &amp; Conditions and our Privacy Policy.
                </p>
                <p className="text-sm text-zinc-400">
                  If you are entering into these terms on behalf of a company, organization, or legal entity, you represent that you have the authority to bind such entity to these Terms.
                </p>
              </section>

              {/* Section 2 */}
              <section id="platform-description" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">02.</span> Description of Service
                </h2>
                <p>
                  K6 LAB provides a modern local-first platform designed for running, managing, and inspecting performance tests powered by k6 engines. Features include:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs text-zinc-300">
                  <div className="p-3 bg-zinc-950/60 border border-white/10 rounded-xl flex items-center gap-2.5">
                    <Terminal className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Native k6 script execution via local agent</span>
                  </div>
                  <div className="p-3 bg-zinc-950/60 border border-white/10 rounded-xl flex items-center gap-2.5">
                    <Cpu className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Real-time WebSocket telemetry visualization</span>
                  </div>
                  <div className="p-3 bg-zinc-950/60 border border-white/10 rounded-xl flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                    <span>AI-assisted bottleneck analysis &amp; audits</span>
                  </div>
                  <div className="p-3 bg-zinc-950/60 border border-white/10 rounded-xl flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Local network testing support (localhost &amp; VPC)</span>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="user-accounts" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">03.</span> Account Registration &amp; Security
                </h2>
                <p className="text-sm">
                  To access platform features, you must create a user account. You are responsible for:
                </p>
                <ul className="space-y-2 list-disc list-inside text-zinc-300 text-sm pl-2">
                  <li>Maintaining the confidentiality of your account password and API access keys.</li>
                  <li>All activities that occur under your account or generated agent tokens.</li>
                  <li>Notifying K6 LAB support immediately if you suspect unauthorized access or security breaches.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section id="acceptable-use" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">04.</span> Acceptable Use Policy
                </h2>
                <p>
                  You agree not to misuse the K6 LAB platform or assist others in doing so. Prohibited activities include:
                </p>
                <div className="space-y-3 font-sans text-xs">
                  <div className="p-4 bg-zinc-950/60 border border-red-500/20 rounded-xl">
                    <span className="font-mono font-bold text-red-400 uppercase tracking-wide block mb-1">Forbidden Target Operations</span>
                    Launching load tests, stress tests, or distributed requests against third-party domain names, government endpoints, or networks without explicit legal authorization.
                  </div>
                  <div className="p-4 bg-zinc-950/60 border border-white/10 rounded-xl">
                    <span className="font-mono font-bold text-white uppercase tracking-wide block mb-1">Platform Abuse</span>
                    Attempting to reverse engineer, decompile, or overload K6 LAB infrastructure or telemetry backend services.
                  </div>
                  <div className="p-4 bg-zinc-950/60 border border-white/10 rounded-xl">
                    <span className="font-mono font-bold text-white uppercase tracking-wide block mb-1">Malicious Payloads</span>
                    Embedding malicious code, web scrapers, or unauthorized data miners in custom k6 JavaScript test scripts.
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="subscriptions-billing" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">05.</span> Subscriptions &amp; Free Tier
                </h2>
                <p className="text-sm">
                  K6 LAB offers a generous Free Tier (including 500 Virtual Users forever for local executions) alongside paid team plans. Free tier limits are subject to fair use monitoring to prevent system abuse.
                </p>
              </section>

              {/* Section 6 */}
              <section id="intellectual-property" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">06.</span> Intellectual Property Rights
                </h2>
                <p className="text-sm">
                  <strong className="text-white">Your Scripts &amp; Data:</strong> You retain complete ownership of all k6 test scripts, scenario configurations, and private code written or executed using K6 LAB.
                </p>
                <p className="text-sm">
                  <strong className="text-white">K6 LAB Property:</strong> The platform UI, logos, visual branding, AI audit engines, and agent binaries remain the exclusive intellectual property of K6 LAB and its licensors.
                </p>
              </section>

              {/* Section 7 */}
              <section id="disclaimers-liability" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">07.</span> Disclaimers &amp; Limitation of Liability
                </h2>
                <p className="text-sm text-zinc-400">
                  THE K6 LAB PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="text-sm text-zinc-300">
                  K6 LAB IS NOT LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES RESULTING FROM API DOWNTIME, UNINTENDED TARGET SYSTEM FAILURE, ACCIDENTIAL RESOURCE EXHAUSTION, OR NETWORK LATENCY VARIATIONS OCCURRING DURING LOAD TESTING RUNS.
                </p>
              </section>

              {/* Section 8 */}
              <section id="termination" className="space-y-4 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <span className="text-red-500 font-mono text-lg">08.</span> Termination &amp; Modifications
                </h2>
                <p className="text-sm">
                  We reserve the right to suspend or terminate accounts that violate our Acceptable Use Policy. We may update these Terms periodically. Continued usage of the platform after updates constitutes acceptance of revised terms.
                </p>
              </section>

            </article>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
