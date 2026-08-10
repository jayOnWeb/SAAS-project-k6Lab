import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Terminal, Coffee, Radio, Sparkles, Activity } from 'lucide-react';
import meImage from '../assets/me.png';

export default function IllustrationCard({
  statusText = '404 // ROUTE_NOT_FOUND',
  statusCode = '404',
  tagline = 'Lost in Cyberspace',
}) {
  // Mouse tilt animation
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="relative w-full max-w-[480px] mx-auto perspective-[1000px]">
      {/* Background ambient multi-layer glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-red-600/20 via-orange-600/15 to-red-500/25 rounded-3xl blur-3xl opacity-75 -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-500/10 blur-[80px] pointer-events-none -z-10 rounded-full" />

      {/* 3D Tilt Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-colors duration-500 hover:border-red-500/40 overflow-visible group"
      >
        {/* Subtle Cyber Grid Background Inside Card */}
        <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.07] pointer-events-none" />

        {/* Top Status Bar with Tech Markers */}
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/5 font-mono text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-red-400 font-semibold tracking-wider">DEV_STATION_01</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-500">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>ERR_CODE_{statusCode}</span>
          </div>
        </div>

        {/* Central Illustration Area with Pedestal & Floating Badges */}
        <div className="relative flex items-center justify-center my-2 py-4">
          {/* Holographic Glowing Base / Pedestal Shadow */}
          <div className="absolute bottom-3 w-3/4 h-10 bg-gradient-to-r from-transparent via-red-600/30 to-transparent blur-xl rounded-full pointer-events-none" />
          <div className="absolute bottom-4 w-1/2 h-2 bg-red-500/40 blur-sm rounded-full pointer-events-none" />

          {/* Floating Telemetry Badge 1 (Top Right) */}
          <motion.div
            animate={{
              y: [0, -6, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-2 -right-2 sm:-right-4 z-20 hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 border border-red-500/30 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.6)] text-[11px] font-mono text-zinc-300"
          >
            <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Dropped: <strong className="text-red-400">100%</strong></span>
          </motion.div>

          {/* Floating Telemetry Badge 2 (Top Left) */}
          <motion.div
            animate={{
              y: [0, 6, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute top-8 -left-2 sm:-left-4 z-20 hidden xs:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/80 border border-white/10 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.6)] text-[11px] font-mono text-zinc-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Stress: <strong className="text-amber-400">High</strong></span>
          </motion.div>

          {/* Floating Telemetry Badge 3 (Bottom Left) */}
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-2 -left-2 sm:-left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/90 border border-amber-500/30 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.6)] text-[11px] font-mono text-zinc-300"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Coffee: <strong className="text-amber-400">Refilling...</strong></span>
          </motion.div>

          {/* Floating Speech Bubble above Jay */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{
              opacity: 1,
              y: [0, -6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/95 border border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.4)] backdrop-blur-xl text-xs font-mono text-white whitespace-nowrap cursor-default hover:scale-105 transition-transform"
          >
            <span className="text-sm">🤫</span>
            <span className="font-semibold text-zinc-100">Shhh...</span>
            <span className="text-red-400 font-bold tracking-tight">Jay is working</span>
            <span className="flex items-center gap-0.5 ml-0.5">
              <span className="w-1 h-1 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-1 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            {/* Speech bubble tail pointer */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-950 border-r border-b border-red-500/50 rotate-45" />
          </motion.div>

          {/* The Main Illustration Container */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative z-10 w-full max-w-[320px] sm:max-w-[360px] aspect-square rounded-2xl overflow-hidden bg-white p-3 sm:p-4 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(239,68,68,0.15)] border border-white/30"
          >
            {/* Subtle Vignette Overlay for Visual Polish */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
            <img
              src={meImage}
              alt="Jay debugging endpoint"
              className="w-full h-full object-contain filter drop-shadow-md select-none transition-transform duration-500 group-hover:scale-105"
            />
          </motion.div>
        </div>

        {/* Bottom Banner inside Card */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Terminal className="w-3.5 h-3.5 text-red-500" />
            <span className="text-zinc-300 truncate max-w-[220px]">{statusText}</span>
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400/80 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20">
            {tagline}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
