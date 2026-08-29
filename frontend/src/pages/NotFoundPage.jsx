import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Home, 
  Terminal, 
  Compass, 
  BookOpen, 
  LayoutDashboard, 
  Layers, 
  Zap, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Search,
  RefreshCw
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import IllustrationCard from '../components/IllustrationCard';

const QUICK_LINKS = [
  {
    title: 'Platform Overview',
    description: 'Explore distributed cloud runners & k6 execution engine.',
    path: '/platform',
    icon: Layers,
    badge: 'Core Engine'
  },
  {
    title: 'Platform Features',
    description: 'Real-time telemetry, AI insights & SLA threshold triggers.',
    path: '/features',
    icon: Zap,
    badge: 'Capabilities'
  },
  {
    title: 'Documentation',
    description: 'Step-by-step guides, k6 script templates & API reference.',
    path: '/docs',
    icon: BookOpen,
    badge: 'Guides'
  },
  {
    title: 'Test Dashboard',
    description: 'Manage active test runs, concurrency limits & reports.',
    path: '/dashboard',
    icon: LayoutDashboard,
    badge: 'Workspace'
  }
];

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPath = location.pathname;
  const timestamp = new Date().toISOString();

  const diagnosticData = {
    statusCode: 404,
    statusText: 'Not Found',
    requestedPath: currentPath,
    clientTime: timestamp,
    userAgent: navigator.userAgent,
    protocol: window.location.protocol,
    clusterRegion: 'us-east-edge-01',
    recommendation: 'Check the route spelling or navigate via the primary menu.'
  };

  const handleCopyDiagnostics = () => {
    navigator.clipboard.writeText(JSON.stringify(diagnosticData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredLinks = QUICK_LINKS.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col selection:bg-red-500 selection:text-white relative overflow-hidden">
      <SEO 
        title="404 — Page Not Found"
        description="The requested route or resource could not be found."
        noindex={true}
      />
      {/* Top Main Navbar */}
      <Navbar />

      {/* Ambient Red Glow Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.16)_0%,rgba(220,38,38,0.04)_50%,transparent_75%)] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-600/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-600/10 blur-[130px] pointer-events-none -z-10" />
      
      {/* Cyber Grid Lines */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 pt-32 sm:pt-36 pb-20 flex flex-col justify-center">
        
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text & Controls Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Cyber Status Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="pulse-red-dot" />
              <span className="font-mono text-xs font-semibold text-red-400 tracking-wider uppercase">
                Status 404 // Virtual Resource Not Found
              </span>
            </div>

            {/* Giant 404 Number + Typography */}
            <div className="relative">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter text-white font-['Space_Grotesk'] leading-none">
                4<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-red-600">0</span>4
              </h1>
              <p className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight mt-2">
                This endpoint drifted into the void.
              </p>
            </div>

            {/* Explanatory Description */}
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              The page or benchmark environment at <code className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-mono text-xs break-all">{currentPath}</code> does not exist, was renamed, or experienced high-concurrency packet loss.
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link 
                to="/" 
                className="btn-red px-6 py-3.5 text-sm rounded-xl shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center gap-2 font-medium"
              >
                <Home className="w-4 h-4" />
                Return to Safe Zone
              </Link>

              <button 
                onClick={() => navigate(-1)} 
                className="btn-ghost px-5 py-3.5 text-sm rounded-xl flex items-center gap-2 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>

              <Link 
                to="/dashboard" 
                className="btn-ghost px-5 py-3.5 text-sm rounded-xl flex items-center gap-2 font-medium"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            </div>

            {/* Quick Filter / Search Bar */}
            <div className="pt-3 max-w-md mx-auto lg:mx-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Looking for a specific page? (e.g. docs, platform, why)..."
                  className="w-full bg-zinc-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/30 transition-all font-mono"
                />
              </div>
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
              statusCode="404"
              statusText={`ERR_NOT_FOUND: ${currentPath}`}
              tagline="Debugger In Action"
            />
          </motion.div>
        </div>

        {/* Quick Nav Destination Cards */}
        <div className="mt-16 sm:mt-20 pt-12 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Compass className="w-5 h-5 text-red-500" />
                Explore Available Destinations
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Jump straight to one of our core systems or documentation hubs.
              </p>
            </div>
            
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Clear Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.path}
                  className="group relative rounded-2xl bg-zinc-950/60 border border-white/5 p-5 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(239,68,68,0.15)] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 group-hover:text-red-400 transition-colors uppercase">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1 text-xs font-mono text-red-400 group-hover:translate-x-1 transition-transform">
                    <span>Access Node</span>
                    <span>&rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Technical Diagnostics Terminal Accordion */}
        <div className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md overflow-hidden">
            <button
              onClick={() => setShowDiagnostics(!showDiagnostics)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono font-medium text-zinc-300">
                  Developer Diagnostics & Network Telemetry
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  404_DEBUG
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 text-xs">
                <span>{showDiagnostics ? 'Hide Raw Logs' : 'View Raw Logs'}</span>
                {showDiagnostics ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            <AnimatePresence>
              {showDiagnostics && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/10 p-6 bg-zinc-950 font-mono text-xs text-zinc-300"
                >
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2 text-red-400">
                      <ShieldAlert className="w-4 h-4" />
                      <span className="font-semibold">Raw Stack Context</span>
                    </div>

                    <button
                      onClick={handleCopyDiagnostics}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition-all text-[11px]"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Diagnostic JSON</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="overflow-x-auto text-[11px] text-zinc-400 leading-relaxed p-4 rounded-xl bg-black/90 border border-zinc-900">
                    <code>
{`[k6lab-router] REQUEST_TRACE_EVENT
---------------------------------------------
Timestamp      : ${diagnosticData.clientTime}
Status Code    : ${diagnosticData.statusCode} (${diagnosticData.statusText})
Requested Path : ${diagnosticData.requestedPath}
Protocol       : ${diagnosticData.protocol}
Cluster Node   : ${diagnosticData.clusterRegion}
User-Agent     : ${diagnosticData.userAgent}
Recommendation : ${diagnosticData.recommendation}`}
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
