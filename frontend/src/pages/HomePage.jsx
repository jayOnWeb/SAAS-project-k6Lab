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
import DotField from '../components/ui/DotField';
import FuzzyText from '../components/ui/FuzzyText';
import GlitchText from '../components/ui/GlitchText';
export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-red-500/40 selection:text-white relative overflow-hidden">
      {/* React Bits Interactive DotField Background Header */}
      <div className="absolute top-0 left-0 right-0 h-[800px] pointer-events-auto z-0 overflow-hidden opacity-60">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#ef4444"
          gradientTo="#b91c1c"
          glowColor="#120F17"
        />
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

      <main className="flex-1 pt-24 pb-20 relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 text-center relative z-10">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <Badge variant="glow" pulse className="px-4 py-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> LOCAL-FIRST LOAD TESTING PLATFORM v2.4
            </Badge>
          </motion.div>

          {/* Headline with FuzzyText & GlitchText */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.1] font-['Space_Grotesk'] flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
          >
            <FuzzyText
              baseIntensity={0.2}
              hoverIntensity={0.5}
              enableHover
              color="#ffffff"
            >
              Stress Test
            </FuzzyText>
            <span>Your APIs.</span>
            <br className="hidden sm:inline" />
            <span className="text-gradient-red flex items-center justify-center gap-2">
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

          {/* Live Hero Dashboard Interactive Cockpit */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
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
