import { Brain } from 'lucide-react';
import Sparkline from './Sparkline';

const RT_DATA  = [42,55,48,70,65,88,75,120,95,108,130,115,142,128,160];
const BAR_DATA = [30,48,42,60,55,70,65,80,72,85,78,88];

export default function HeroDashboard() {
  return (
    <div className="relative bg-[#0d1117]/80 border border-[#1c2330] rounded-2xl p-4 backdrop-blur-lg shadow-[0_24px_64px_#00000070,0_0_0_1px_#ffffff05]">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #ffffff02 2px, #ffffff02 4px)',
        }}
      />

      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="pulse-dot w-[7px] h-[7px] rounded-full bg-[#3fb950] inline-block shadow-[0_0_6px_#3fb95080]" />
          <span className="mono text-[11px] text-[#6e7681]">k6 run — stress-test-v3</span>
        </div>
        <span className="mono text-[10px] text-[#3fb950] font-semibold">LIVE</span>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Avg Response', value: '142ms', delta: '↑ 18ms', bad: true },
          { label: 'Requests/s',   value: '1,842', delta: '↑ 12%',  bad: false },
          { label: 'Error Rate',   value: '2.4%',  delta: '↓ 0.3%', bad: false },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-[#080c10] border border-[#1c2330] rounded-lg p-2.5"
          >
            <div className="text-[10px] text-[#6e7681] mb-1">{m.label}</div>
            <div className="text-[18px] font-semibold text-[#e6edf3] leading-none mb-1">{m.value}</div>
            <div className={`text-[10px] ${m.bad ? 'text-[#f85149]' : 'text-[#3fb950]'}`}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Response time chart */}
      <div className="bg-[#080c10] border border-[#1c2330] rounded-lg p-3 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] text-[#8b949e] font-medium">Response Time (ms)</span>
          <span className="mono text-[10px] text-[#6e7681]">last 60s</span>
        </div>
        <Sparkline data={RT_DATA} color="#2a7aff" height={46} />
        <div className="flex justify-between mt-1">
          <span className="mono text-[9px] text-[#3a4555]">0s</span>
          <span className="mono text-[9px] text-[#3a4555]">60s</span>
        </div>
      </div>

      {/* VU bars */}
      <div className="bg-[#080c10] border border-[#1c2330] rounded-lg p-3 mb-2">
        <div className="text-[11px] text-[#8b949e] mb-2">Virtual Users</div>
        <div className="flex items-end gap-1 h-9">
          {BAR_DATA.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${v}%`,
                background: `linear-gradient(180deg, #3fb95070, #3fb95030)`,
                border: '1px solid #3fb95030',
              }}
            />
          ))}
        </div>
      </div>

      {/* AI insight */}
      <div className="bg-gradient-to-br from-[#0d1a2e] to-[#0a1020] border border-[#2a7aff30] rounded-lg p-3 shadow-[0_0_20px_#2a7aff12]">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Brain size={11} color="#2a7aff" />
          <span className="text-[10px] text-[#2a7aff] font-semibold">AI Insight</span>
        </div>
        <p className="text-[11px] text-[#8b949e] leading-relaxed">
          Latency spike at{' '}
          <span className="text-[#f0c070]">500+ VUs</span>.
          Likely:{' '}
          <span className="text-[#e6edf3]">DB connection pool saturation</span>.
        </p>
      </div>
    </div>
  );
}
