import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  Home, 
  Terminal, 
  Bug, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  AlertOctagon, 
  LayoutDashboard,
  ShieldCheck
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import IllustrationCard from '../components/IllustrationCard';

export default function ErrorPage({ 
  error = null, 
  resetErrorBoundary = null, 
  errorInfo = null 
}) {
  const [showStack, setShowStack] = useState(false);
  const [copied, setCopied] = useState(false);

  const errorMessage = error?.message || 'An unexpected client-side exception occurred.';
  const errorStack = error?.stack || errorInfo?.componentStack || 'No stack trace available. (Simulated/Direct error view)';
  const timestamp = new Date().toISOString();

  const handleCopy = () => {
    const report = {
      message: errorMessage,
      timestamp,
      stack: errorStack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.href = '/';
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500 selection:text-white relative overflow-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.18)_0%,rgba(185,28,28,0.05)_50%,transparent_75%)] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-red-600/15 blur-[140px] pointer-events-none -z-10" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-32 sm:pt-36 pb-20 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Error Information Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Status Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
              <AlertOctagon className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-red-400 tracking-wider uppercase">
                System Exception Intercepted
              </span>
            </div>

            {/* Error Headline */}
            <div className="relative">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white font-['Space_Grotesk'] leading-none">
                Something went <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-600">wrong</span>.
              </h1>
              <p className="text-xl sm:text-2xl font-bold text-zinc-300 tracking-tight mt-3">
                Our runtime guard caught an unexpected error.
              </p>
            </div>

            {/* Error Message Box */}
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-start gap-3">
                <Bug className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1 overflow-hidden">
                  <span className="text-[11px] font-mono uppercase text-red-400 tracking-wider">Error Details</span>
                  <p className="text-xs font-mono text-zinc-300 break-words line-clamp-3">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>

            {/* Explanatory Text */}
            <p className="text-zinc-400 text-sm max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Don't worry — your load testing scripts and project configurations remain completely safe in our database. You can try recovering the session, reloading the page, or returning to your dashboard.
            </p>

            {/* Recovery Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleReload}
                className="btn-red px-6 py-3.5 text-sm rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center gap-2 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                onClick={handleReset}
                className="btn-ghost px-5 py-3.5 text-sm rounded-xl flex items-center gap-2 font-medium"
              >
                <Home className="w-4 h-4" />
                Return to Safety
              </button>

              <Link
                to="/dashboard"
                className="btn-ghost px-5 py-3.5 text-sm rounded-xl flex items-center gap-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </motion.div>

          {/* Right Illustration Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center items-center"
          >
            <IllustrationCard
              statusCode="500"
              statusText="CRITICAL // HOTFIX_IN_PROGRESS"
              tagline="Emergency Triage"
            />
          </motion.div>
        </div>

        {/* Developer Stack Trace Accordion */}
        <div className="mt-16 sm:mt-20">
          <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md overflow-hidden">
            <button
              onClick={() => setShowStack(!showStack)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono font-medium text-zinc-300">
                  Developer Stack Trace & Diagnostic Report
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  EXCEPTION_LOG
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                <span>{showStack ? 'Hide Trace' : 'View Trace'}</span>
                {showStack ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence>
              {showStack && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/10 p-6 bg-zinc-950 font-mono text-xs"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Captured at {timestamp}</span>
                    </div>

                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all text-[11px]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Crash Report</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="overflow-x-auto text-[11px] text-red-300/90 leading-relaxed p-4 rounded-xl bg-black/90 border border-zinc-900 font-mono whitespace-pre-wrap">
                    <code>
{`[UNHANDLED_EXCEPTION]
Message: ${errorMessage}

Stack Trace:
${errorStack}`}
                    </code>
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
