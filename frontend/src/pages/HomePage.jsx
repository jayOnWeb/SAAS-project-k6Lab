import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Server, 
  Activity, 
  Cpu, 
  Zap, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  BarChart2, 
  Terminal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroDashboard from '../components/HeroDashboard';
import TelemetryBento from '../components/TelemetryBento';
import { Badge } from '../components/ui/badge';
import { GridPattern } from '../components/ui/grid-pattern';
import { BorderBeam } from '../components/ui/border-beam';
import LaserFlow from '../components/LaserFlow';
import CurvedLoop from '../components/CurvedLoop';
import FuzzyText from '../components/ui/FuzzyText';
import GlitchText from '../components/ui/GlitchText';

import SEO from '../components/SEO';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-red-500/40 selection:text-white relative overflow-hidden">
      <SEO 
        title="Local-First Performance Testing Platform"
        description="K6 LAB delivers native k6 script execution, real-time metrics, visual load test builder, and AI performance analysis directly on your local workstation."
        keywords="k6 lab, k6 gui, load testing tool, performance testing platform, local-first testing, api load test, real-time telemetry"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "K6 LAB",
          "operatingSystem": "macOS, Linux, Windows",
          "applicationCategory": "DeveloperApplication",
          "description": "Local-first performance testing platform with native k6 execution, real-time telemetry, and AI-powered performance insights.",
          "url": "https://k6lab.com",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }}
      />
      {/* LaserFlow Background Effect */}
      <div className="absolute top-10 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[950px] pointer-events-none z-0 overflow-hidden opacity-70 flex items-center justify-center">
        <div style={{ width: '1080px', height: '1080px', position: 'relative' }}>
          <LaserFlow
            color="#F43F5E"
            dpr={1}
            wispDensity={1}
            flowSpeed={0.35}
            verticalSizing={2}
            horizontalSizing={0.5}
            fogIntensity={0.45}
            fogScale={0.3}
            wispSpeed={15}
            wispIntensity={5}
            flowStrength={0.25}
            decay={1.1}
            horizontalBeamOffset={0}
            verticalBeamOffset={-0.35}
          />
        </div>
      </div>

      {/* Background Animated Grid Pattern with Spots */}
      <GridPattern
        width={50}
        height={50}
        squares={[
          [4, 4],
          [8, 2],
          [2, 10],
          [12, 6],
          [16, 12],
          [6, 18],
        ]}
        className="opacity-30"
      />

      {/* Red Ambient Glow */}
      <div className="red-aurora" />

      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28 md:pt-36 pb-20 relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-6 sm:pt-10 md:pt-14 pb-20 sm:pb-28 text-center relative z-10 flex flex-col items-center justify-center">
          {/* Top Pill / Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/50 border border-red-500/40 backdrop-blur-md text-xs font-mono text-red-400 mb-8 shadow-[0_0_25px_rgba(239,68,68,0.25)]"
          >
            <Sparkles size={14} className="text-red-500" />
            <span>LOCAL-FIRST LOAD TESTING &amp; REAL-TIME TELEMETRY</span>
          </motion.div>

          {/* Headline with FuzzyText & GlitchText */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.15] font-['Space_Grotesk'] text-center"
          >
            <span className="inline-flex items-center justify-center flex-wrap gap-x-3 sm:gap-x-4">
              <FuzzyText
                baseIntensity={0.20}
                hoverIntensity={0.45}
                enableHover
                color="#ffffff"
              >
                Stress Test
              </FuzzyText>
              <span>Your APIs.</span>
            </span>
            <span className="block mt-2 sm:mt-3 text-gradient-red">
              <span className="inline-flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-3">
                <span>Understand Their</span>
                <GlitchText
                  speed={1}
                  enableShadows
                  enableOnHover={false}
                  className="text-gradient-red inline-block"
                >
                  Limits.
                </GlitchText>
              </span>
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Run native k6 load tests directly from your own machine, watch real-time telemetry stream live, and get instant AI-powered root-cause diagnosis.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 mb-12"
          >
            <Link to="/signup" className="btn-red cursor-target text-base px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.5)] group">
              Start Testing Free
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link to="/how-it-works" className="btn-ghost cursor-target text-base px-8 py-3.5 rounded-xl">
              See Architecture
            </Link>
          </motion.div>

          {/* INTERACTIVE CURVED MARQUEE TECH FACTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-6 relative z-10 overflow-hidden w-full"
          >
            <CurvedLoop
              marqueeText="LOCAL-FIRST EXECUTION ✦ RUNS ON YOUR OWN HARDWARE ✦ NATIVE GO K6 ENGINE ✦ INSTANT AI ROOT CAUSE DIAGNOSIS ✦ REAL-TIME TELEMETRY HISTOGRAMS ✦ ZERO CLOUD DATA LEAKAGE ✦ CLI DAEMON AGENT ✦ PRIVATE LOCALHOST & VPC TESTING ✦ "
              speed={2}
              curveAmount={160}
              direction="left"
              interactive
              className="fill-white text-red-500 font-extrabold tracking-widest text-2xl sm:text-4xl uppercase opacity-90 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            />
          </motion.div>
        </section>

        {/* SECTION 2: INTERACTIVE DASHBOARD COCKPIT */}
        <section className="max-w-7xl mx-auto px-6 py-16 relative z-10 border-t border-white/5">
          <div className="text-center mb-12">
            <Badge variant="glow" pulse className="px-4 py-1.5 text-xs mb-4">
              LIVE COCKPIT PREVIEW
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              Experience the <span className="text-gradient-red">Real-Time Control Room</span>
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto mt-4 text-base sm:text-lg">
              Explore the interactive cockpit below to see how K6 Lab streams latency histograms, active VUs, and instant AI diagnostics.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <HeroDashboard />
          </motion.div>
        </section>

        {/* TELEMETRY BENTO SECTION */}
        <TelemetryBento />

        {/* CORE PRODUCT ARCHITECTURE */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge variant="default" className="mb-4">
                LOCAL-FIRST ARCHITECTURE
              </Badge>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 font-['Space_Grotesk'] leading-tight">
                Your Machine Runs the Test. <br />
                <span className="text-gradient-red">K6 Lab Makes Sense of the Results.</span>
              </h2>
              <p className="text-zinc-300 text-lg mb-6 leading-relaxed font-medium">
                No third-party firewall setup required. Test private APIs on localhost or internal VPCs effortlessly.
              </p>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                Your local k6lab-agent daemon executes native Go k6 engines locally. K6 Lab coordinates test execution and streams live latency histograms directly to your browser cockpit.
              </p>
              <div className="p-5 bg-red-950/40 border-l-4 border-red-500 rounded-r-xl text-sm font-mono text-zinc-300 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                The dashboard coordinates the run. Your local machine executes the test. AI pinpoints the exact failure line.
              </div>
            </div>

            {/* Architecture Pipeline Visual */}
            <div className="relative rounded-2xl bg-zinc-950 border border-white/10 p-8 space-y-3 backdrop-blur-xl">
              <BorderBeam size={260} duration={10} colorFrom="#ef4444" colorTo="#dc2626" />
              <div className="text-xs font-mono text-red-400 font-bold uppercase tracking-widest mb-6 flex items-center justify-between">
                <span>LOCAL-FIRST TELEMETRY PIPELINE</span>
                <span className="pulse-red-dot"></span>
              </div>

              {[
                { name: 'YOUR MACHINE', desc: 'Host Environment', icon: Cpu },
                { name: 'k6lab-agent', desc: 'CLI Daemon Process', icon: Terminal },
                { name: 'Native k6 Engine', desc: 'Go Load Generator', icon: Zap },
                { name: 'Telemetry Stream', desc: 'Real-Time WebSockets', icon: Activity },
                { name: 'K6 LAB COCKPIT', desc: 'Central Command Center', icon: BarChart2, highlight: true },
                { name: 'AI Root Cause Fix', desc: 'Actionable Intelligence', icon: Sparkles, red: true }
              ].map((step, idx, arr) => {
                const Icon = step.icon;
                return (
                  <div key={step.name} className="space-y-3">
                    <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                      step.red 
                        ? 'bg-red-600 border-red-400 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] font-bold' 
                        : step.highlight 
                        ? 'bg-zinc-900 border-red-500/60 text-red-400 font-bold' 
                        : 'bg-black/60 border-white/10 text-zinc-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs opacity-60">0{idx + 1}</span>
                        <span className="font-mono text-sm tracking-wide">{step.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-sans opacity-70 hidden sm:inline">{step.desc}</span>
                        <Icon size={18} />
                      </div>
                    </div>
                    {idx < arr.length - 1 && (
                      <div className="text-center text-red-500 font-extrabold text-sm py-0.5">↓</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
