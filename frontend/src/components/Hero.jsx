import { Suspense, lazy } from 'react';
import {
  Activity, BarChart3, Gauge, Server, Cpu, Zap,
  Database, Globe, Shield, Terminal, GitBranch, Layers,
  Monitor, Wifi, Clock, TrendingUp,
} from 'lucide-react';
import {
  FloatingIconsHero,
} from '@/components/ui/floating-icons-hero-section';

// Lazy-load the 3D viewer so three.js doesn't block initial paint
const HeroModelViewer = lazy(() => import('./HeroModelViewer'));

// --- Lucide icon wrapper ---
const makeLucideIcon = (LucideIcon, color) => {
  const WrappedIcon = (props) => (
    <LucideIcon
      {...props}
      size={undefined}
      strokeWidth={1.8}
      style={{ color }}
    />
  );
  WrappedIcon.displayName = LucideIcon.displayName || 'LucideIcon';
  return WrappedIcon;
};

const heroIcons = [
  { id: 1,  icon: makeLucideIcon(Activity, '#0071e3'),     className: 'top-[10%] left-[10%]' },
  { id: 2,  icon: makeLucideIcon(BarChart3, '#30d158'),     className: 'top-[20%] right-[8%]' },
  { id: 3,  icon: makeLucideIcon(Gauge, '#ffd60a'),         className: 'top-[80%] left-[10%]' },
  { id: 4,  icon: makeLucideIcon(Server, '#0071e3'),        className: 'bottom-[10%] right-[10%]' },
  { id: 5,  icon: makeLucideIcon(Cpu, '#ff453a'),           className: 'top-[5%] left-[30%]' },
  { id: 6,  icon: makeLucideIcon(Zap, '#ffd60a'),           className: 'top-[5%] right-[30%]' },
  { id: 7,  icon: makeLucideIcon(Database, '#30d158'),      className: 'bottom-[8%] left-[25%]' },
  { id: 8,  icon: makeLucideIcon(Globe, '#0071e3'),         className: 'top-[40%] left-[15%]' },
  { id: 9,  icon: makeLucideIcon(Shield, '#30d158'),        className: 'top-[75%] right-[25%]' },
  { id: 10, icon: makeLucideIcon(Terminal, '#f5f5f7'),      className: 'top-[90%] left-[70%]' },
  { id: 11, icon: makeLucideIcon(GitBranch, '#ff453a'),     className: 'top-[50%] right-[5%]' },
  { id: 12, icon: makeLucideIcon(Layers, '#0071e3'),        className: 'top-[55%] left-[5%]' },
  { id: 13, icon: makeLucideIcon(Monitor, '#ffd60a'),       className: 'top-[5%] left-[55%]' },
  { id: 14, icon: makeLucideIcon(Wifi, '#30d158'),          className: 'bottom-[5%] right-[45%]' },
  { id: 15, icon: makeLucideIcon(Clock, '#ff453a'),         className: 'top-[25%] right-[20%]' },
  { id: 16, icon: makeLucideIcon(TrendingUp, '#0071e3'),    className: 'top-[60%] left-[30%]' },
];

function ModelFallback() {
  return (
    <div className="hero-3d-canvas" style={{ display: 'grid', placeItems: 'center' }}>
      <div className="model-loader">
        <span className="eyebrow">Preparing Aether model</span>
        <div className="loader-bar" aria-hidden="true">
          <span style={{ width: '42%' }} />
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <FloatingIconsHero
      title="k6lab"
      subtitle="Performance telemetry, explained as fast as your load tests run."
      ctaText="Get Started"
      ctaHref="/signup"
      icons={heroIcons}
    >
      <Suspense fallback={<ModelFallback />}>
        <HeroModelViewer />
      </Suspense>
    </FloatingIconsHero>
  );
}
