import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Database, BarChart3, Cpu, Sparkles, ArrowDown } from 'lucide-react';

const PHASES = [
  {
    tag: "Phase 1: The Dark Age",
    title: "Before K6: Complete Chaos",
    subtitle: "Performance testing was a tangled mess of broken configurations, heavy manual setups, and disconnected testing platforms. Bottlenecks lurked undetected in deep microservice layers.",
    colorClass: "from-rose-500 to-red-600 bg-rose-950/20 border-rose-500/30 text-rose-400",
    glowColor: "rgba(239, 68, 68, 0.2)",
    icon: ShieldAlert
  },
  {
    tag: "Phase 2: Lost in Translation",
    title: "Cryptic Logs & Silent Crashes",
    subtitle: "Hours wasted parsing endless text documents and chasing latency ghosts. Sifting through noisy server logs without a single source of truth or intelligent diagnostic context.",
    colorClass: "from-amber-400 to-orange-500 bg-amber-950/20 border-amber-500/30 text-amber-400",
    glowColor: "rgba(245, 158, 11, 0.2)",
    icon: Database
  },
  {
    tag: "Phase 3: The Awakening",
    title: "Enter K6: Developer-First Control",
    subtitle: "The paradigm shift. Modern code-centric load testing combined with high-fidelity performance metrics. Instant orchestration of thousands of concurrent users in clean JS.",
    colorClass: "from-cyan-400 to-teal-400 bg-cyan-950/20 border-cyan-500/30 text-cyan-400",
    glowColor: "rgba(6, 182, 212, 0.2)",
    icon: BarChart3
  },
  {
    tag: "Phase 4: Neural Diagnostics",
    title: "Autonomous Intelligence",
    subtitle: "Automated anomaly isolation and microservice response tracing. Real-time telemetry analytics discover structural regressions and optimize critical database transaction pipelines.",
    colorClass: "from-indigo-400 to-purple-400 bg-indigo-950/20 border-indigo-500/30 text-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.2)",
    icon: Cpu
  },
  {
    tag: "Phase 5: Seamless Integration",
    title: "Beautiful Dashboards & Automated AI",
    subtitle: "A beautiful, unified monitoring ecosystem. Complete automated pipeline integration, autonomous load optimization, and real-time failure assertions. Total operational peace of mind.",
    colorClass: "from-purple-400 to-pink-500 bg-purple-950/20 border-purple-500/30 text-purple-400",
    glowColor: "rgba(168, 85, 247, 0.2)",
    icon: Sparkles
  }
];

export default function ScrollVideoSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const currentFrameRef = useRef(0);
  const activePhaseRef = useRef(0);

  const loadedImagesRef = useRef([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activePhase, setActivePhase] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState("Initializing performance visualizers...");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Preloading 240 frames
  useEffect(() => {
    let loadedCount = 0;
    const totalFrames = 240;
    const imageCache = [];

    const updateStatusText = (progress) => {
      if (progress < 25) {
        setLoadingStatusText("Connecting core diagnostics engine...");
      } else if (progress < 50) {
        setLoadingStatusText("Buffering telemetry frames [JK Sequence]...");
      } else if (progress < 75) {
        setLoadingStatusText("Calibrating vector canvas layers...");
      } else if (progress < 99) {
        setLoadingStatusText("Configuring neural anomaly mapping...");
      } else {
        setLoadingStatusText("AI Engine Online. Ready to scan.");
      }
    };

    for (let i = 1; i <= totalFrames; i++) {
      const frameStr = String(i).padStart(3, '0');
      // Constructing dynamic resource path so Vite includes them cleanly in assets
      const imgUrl = new URL(`../assets/jk/ezgif-frame-${frameStr}.jpg`, import.meta.url).href;
      
      const img = new Image();
      img.src = imgUrl;

      img.onload = () => {
        loadedCount++;
        const progress = Math.floor((loadedCount / totalFrames) * 100);
        setLoadingProgress(progress);
        updateStatusText(progress);

        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };

      img.onerror = () => {
        // Fallback to avoid getting stuck if a frame fails to load
        loadedCount++;
        const progress = Math.floor((loadedCount / totalFrames) * 100);
        setLoadingProgress(progress);
        
        if (loadedCount === totalFrames) {
          setIsLoaded(true);
        }
      };

      imageCache.push(img);
    }

    loadedImagesRef.current = imageCache;
  }, []);

  // Frame Draw logic
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const loadedImages = loadedImagesRef.current;
    if (!canvas || loadedImages.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = loadedImages[index];
    if (!img) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width;
    const imgHeight = img.height;

    // Calculate scaling to completely cover canvas viewport
    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;

    // Center the image inside canvas frame
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, x, y, newWidth, newHeight);
  }, []);

  // Re-scale canvas on resize and redraw current frame
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      if (isLoaded) {
        drawFrame(currentFrameRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isLoaded, drawFrame]);

  // Redraw initial frame when loading finishes
  useEffect(() => {
    if (isLoaded && loadedImagesRef.current.length > 0) {
      drawFrame(0);
    }
  }, [isLoaded, drawFrame]);

  // Bind scroll positions to frame render and text phases
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded || loadedImagesRef.current.length === 0) return;

    // Determine frame based on progress
    const frameIndex = Math.min(
      Math.floor(latest * 240),
      239
    );
    currentFrameRef.current = frameIndex;
    drawFrame(frameIndex);

    // Determine storytelling phase based on scroll boundaries
    let phase;
    if (latest < 0.18) {
      phase = 0;
    } else if (latest < 0.40) {
      phase = 1;
    } else if (latest < 0.63) {
      phase = 2;
    } else if (latest < 0.85) {
      phase = 3;
    } else {
      phase = 4;
    }

    if (phase !== activePhaseRef.current) {
      activePhaseRef.current = phase;
      setActivePhase(phase);
    }
  });

  const ActiveIcon = PHASES[activePhase].icon;

  return (
    <section 
      ref={containerRef} 
      className="relative w-full bg-slate-950/20"
      style={{ height: '350vh' }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">
        {/* HTML5 Cover-fit Canvas */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: isLoaded ? 0.75 : 0 }}
        />

        {/* Ethereal Gradient Overlay behind the text card */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />

        {/* Loading Overlay */}
        <AnimatePresence>
          {!isLoaded && (
            <motion.div 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
            >
              <div className="text-center space-y-6 max-w-sm px-6">
                <div className="relative w-24 h-24 mx-auto">
                  {/* Glowing core orbital tracker */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      className="stroke-slate-900 fill-none"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="48"
                      cy="48"
                      r="40"
                      className="stroke-cyan-400 fill-none"
                      strokeWidth="3"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * loadingProgress) / 100}
                      style={{ filter: "drop-shadow(0 0 8px rgba(0, 242, 254, 0.6))" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-lg font-bold text-cyan-300">
                      {loadingProgress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="mono text-xs uppercase tracking-widest text-slate-400">
                    AI Diagnostic Vector Init
                  </h3>
                  <p className="text-xs text-cyan-400/80 font-mono italic animate-pulse">
                    {loadingStatusText}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Synced Storytelling Text Overlays */}
        {isLoaded && (
          <div className="relative z-10 w-full max-w-6xl mx-auto px-6 h-full flex flex-col justify-center items-center pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePhase}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-2xl text-center pointer-events-auto"
              >
                {/* Cyber Card Deck */}
                <div 
                  className="card-hover card-cyber-brackets px-8 py-10 rounded-2xl border flex flex-col items-center gap-6"
                  style={{
                    boxShadow: `0 15px 40px rgba(0, 0, 0, 0.5), 0 0 30px ${PHASES[activePhase].glowColor}`,
                    transition: "box-shadow 0.6s ease, border-color 0.6s ease"
                  }}
                >
                  {/* Cyber Icon Panel */}
                  <div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border bg-slate-950/80`}
                    style={{
                      borderColor: PHASES[activePhase].glowColor.replace('0.2', '0.6'),
                      color: PHASES[activePhase].glowColor.replace('0.2', '1'),
                      boxShadow: `0 0 15px ${PHASES[activePhase].glowColor}`
                    }}
                  >
                    <ActiveIcon size={22} className="animate-pulse" />
                  </div>

                  {/* Header Title & Tag */}
                  <div className="space-y-2">
                    <span 
                      className={`inline-block text-[10px] font-mono font-semibold tracking-widest uppercase px-3 py-1 rounded-full border bg-slate-950/60`}
                      style={{
                        borderColor: PHASES[activePhase].glowColor.replace('0.2', '0.4'),
                        color: PHASES[activePhase].glowColor.replace('0.2', '0.9')
                      }}
                    >
                      {PHASES[activePhase].tag}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent">
                      {PHASES[activePhase].title}
                    </h2>
                  </div>

                  {/* Description Subtitle */}
                  <p className="text-[13px] sm:text-[14px] text-slate-300 leading-relaxed font-sans max-w-lg">
                    {PHASES[activePhase].subtitle}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Scroll Indicator Prompt */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: activePhase === 0 ? 0.6 : 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400 font-mono text-[10px] tracking-widest uppercase"
            >
              <span>Scroll to scan telemetry</span>
              <motion.div 
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ArrowDown size={14} className="text-cyan-400" />
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
